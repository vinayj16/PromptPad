import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Document from '../models/Document.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get all documents for user
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('category').optional().isString(),
  query('sortBy').optional().isIn(['createdAt', 'updatedAt', 'title']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search;
    const category = req.query.category;
    const sortBy = req.query.sortBy || 'updatedAt';
    const sortOrder = req.query.sortOrder || 'desc';

    // Build query
    const query = {
      $or: [
        { owner: req.user.userId },
        { 'collaborators.user': req.user.userId }
      ],
      isDeleted: false
    };

    if (search) {
      query.$and = [
        query.$and || {},
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { plainTextContent: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } }
          ]
        }
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const documents = await Document.find(query)
      .populate('owner', 'firstName lastName avatar avatarColor')
      .populate('collaborators.user', 'firstName lastName avatar avatarColor')
      .populate('lastModifiedBy', 'firstName lastName avatar avatarColor')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Document.countDocuments(query);

    res.json({
      documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single document
router.get('/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('owner', 'firstName lastName avatar avatarColor')
      .populate('collaborators.user', 'firstName lastName avatar avatarColor')
      .populate('comments.author', 'firstName lastName avatar avatarColor')
      .populate('changes.author', 'firstName lastName avatar avatarColor')
      .populate('versions.author', 'firstName lastName avatar avatarColor');

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check permissions
    const hasAccess = document.owner._id.toString() === req.user.userId ||
                     document.collaborators.some(c => c.user._id.toString() === req.user.userId) ||
                     document.sharing.isPublic;

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update last viewed
    const existingView = document.lastViewedBy.find(v => v.user.toString() === req.user.userId);
    if (existingView) {
      existingView.viewedAt = new Date();
    } else {
      document.lastViewedBy.push({ user: req.user.userId, viewedAt: new Date() });
    }
    await document.save();

    res.json({ document });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new document
router.post('/', [
  body('title').notEmpty().trim().isLength({ max: 200 }),
  body('content').optional().isString(),
  body('category').optional().isIn(['document', 'letter', 'resume', 'report', 'essay', 'other']),
  body('templateId').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content = '', category = 'document', templateId } = req.body;

    const document = new Document({
      title,
      content,
      category,
      owner: req.user.userId,
      lastModifiedBy: req.user.userId,
      template: templateId || undefined
    });

    await document.save();

    // Increment user's document count
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { 'usage.documentsCreated': 1 }
    });

    const populatedDocument = await Document.findById(document._id)
      .populate('owner', 'firstName lastName avatar avatarColor');

    res.status(201).json({
      message: 'Document created successfully',
      document: populatedDocument
    });
  } catch (error) {
    console.error('Create document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update document
router.patch('/:id', [
  body('title').optional().trim().isLength({ max: 200 }),
  body('content').optional().isString(),
  body('settings').optional().isObject(),
  body('formatting').optional().isObject(),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check edit permissions
    const canEdit = document.owner.toString() === req.user.userId ||
                   document.collaborators.some(c => 
                     c.user.toString() === req.user.userId && c.permission === 'edit'
                   );

    if (!canEdit) {
      return res.status(403).json({ error: 'Edit permission denied' });
    }

    // Update fields
    const allowedFields = ['title', 'content', 'settings', 'formatting', 'tags'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'settings' || field === 'formatting') {
          document[field] = { ...document[field], ...req.body[field] };
        } else {
          document[field] = req.body[field];
        }
      }
    });

    document.lastModifiedBy = req.user.userId;
    await document.save();

    const populatedDocument = await Document.findById(document._id)
      .populate('owner', 'firstName lastName avatar avatarColor')
      .populate('lastModifiedBy', 'firstName lastName avatar avatarColor');

    res.json({
      message: 'Document updated successfully',
      document: populatedDocument
    });
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete document (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Only owner can delete
    if (document.owner.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Only owner can delete document' });
    }

    document.isDeleted = true;
    document.deletedAt = new Date();
    await document.save();

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add collaborator
router.post('/:id/collaborators', [
  body('email').isEmail().normalizeEmail(),
  body('permission').isIn(['view', 'comment', 'edit'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, permission } = req.body;

    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Only owner can add collaborators
    if (document.owner.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Only owner can add collaborators' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already a collaborator
    const existingCollaborator = document.collaborators.find(
      c => c.user.toString() === user._id.toString()
    );

    if (existingCollaborator) {
      existingCollaborator.permission = permission;
    } else {
      document.collaborators.push({ user: user._id, permission });
    }

    await document.save();

    const populatedDocument = await Document.findById(document._id)
      .populate('collaborators.user', 'firstName lastName avatar avatarColor email');

    res.json({
      message: 'Collaborator added successfully',
      collaborators: populatedDocument.collaborators
    });
  } catch (error) {
    console.error('Add collaborator error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove collaborator
router.delete('/:id/collaborators/:userId', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Only owner can remove collaborators
    if (document.owner.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Only owner can remove collaborators' });
    }

    document.collaborators = document.collaborators.filter(
      c => c.user.toString() !== req.params.userId
    );

    await document.save();

    res.json({ message: 'Collaborator removed successfully' });
  } catch (error) {
    console.error('Remove collaborator error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add comment
router.post('/:id/comments', [
  body('text').notEmpty().trim(),
  body('position').isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text, position } = req.body;

    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check comment permissions
    const canComment = document.owner.toString() === req.user.userId ||
                      document.collaborators.some(c => 
                        c.user.toString() === req.user.userId && 
                        ['edit', 'comment'].includes(c.permission)
                      );

    if (!canComment) {
      return res.status(403).json({ error: 'Comment permission denied' });
    }

    const comment = {
      id: new mongoose.Types.ObjectId().toString(),
      text,
      position,
      author: req.user.userId,
      resolved: false,
      replies: []
    };

    document.comments.push(comment);
    await document.save();

    const populatedDocument = await Document.findById(document._id)
      .populate('comments.author', 'firstName lastName avatar avatarColor');

    const addedComment = populatedDocument.comments.find(c => c.id === comment.id);

    res.status(201).json({
      message: 'Comment added successfully',
      comment: addedComment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Resolve comment
router.patch('/:id/comments/:commentId/resolve', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const comment = document.comments.find(c => c.id === req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Only comment author or document owner can resolve
    const canResolve = comment.author.toString() === req.user.userId ||
                      document.owner.toString() === req.user.userId;

    if (!canResolve) {
      return res.status(403).json({ error: 'Cannot resolve this comment' });
    }

    comment.resolved = true;
    await document.save();

    res.json({ message: 'Comment resolved successfully' });
  } catch (error) {
    console.error('Resolve comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create document version
router.post('/:id/versions', [
  body('changes').optional().isArray(),
  body('major').optional().isBoolean()
], async (req, res) => {
  try {
    const { changes = [], major = false } = req.body;

    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check edit permissions
    const canEdit = document.owner.toString() === req.user.userId ||
                   document.collaborators.some(c => 
                     c.user.toString() === req.user.userId && c.permission === 'edit'
                   );

    if (!canEdit) {
      return res.status(403).json({ error: 'Edit permission denied' });
    }

    await document.createVersion(changes, major);

    res.json({ message: 'Version created successfully' });
  } catch (error) {
    console.error('Create version error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get document statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check permissions
    const hasAccess = document.owner.toString() === req.user.userId ||
                     document.collaborators.some(c => c.user.toString() === req.user.userId);

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const stats = {
      metadata: document.metadata,
      collaborators: document.collaborators.length,
      comments: document.comments.length,
      unresolvedComments: document.comments.filter(c => !c.resolved).length,
      versions: document.versions.length,
      lastModified: document.updatedAt,
      views: document.lastViewedBy.length
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get document stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;