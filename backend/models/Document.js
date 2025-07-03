import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  position: {
    type: Number,
    required: true
  },
  resolved: {
    type: Boolean,
    default: false
  },
  replies: [{
    id: String,
    text: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

const changeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['insert', 'delete', 'format'],
    required: true
  },
  content: String,
  position: Number,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accepted: {
    type: Boolean,
    default: null
  }
}, {
  timestamps: true
});

const versionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: String,
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  changes: [String], // Array of change descriptions
  major: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    default: ''
  },
  plainTextContent: {
    type: String,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['view', 'comment', 'edit'],
      default: 'view'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  sharing: {
    isPublic: {
      type: Boolean,
      default: false
    },
    shareLink: String,
    linkPermission: {
      type: String,
      enum: ['view', 'comment', 'edit'],
      default: 'view'
    },
    password: String
  },
  metadata: {
    wordCount: {
      type: Number,
      default: 0
    },
    characterCount: {
      type: Number,
      default: 0
    },
    pageCount: {
      type: Number,
      default: 1
    },
    readingTime: {
      type: Number,
      default: 0
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  settings: {
    trackChanges: {
      type: Boolean,
      default: false
    },
    autoSave: {
      type: Boolean,
      default: true
    },
    spellCheck: {
      type: Boolean,
      default: true
    },
    grammarCheck: {
      type: Boolean,
      default: true
    }
  },
  formatting: {
    fontSize: {
      type: Number,
      default: 14
    },
    fontFamily: {
      type: String,
      default: 'Calibri'
    },
    lineSpacing: {
      type: Number,
      default: 1.15
    },
    margins: {
      top: { type: Number, default: 2.54 },
      bottom: { type: Number, default: 2.54 },
      left: { type: Number, default: 2.54 },
      right: { type: Number, default: 2.54 }
    },
    pageSize: {
      type: String,
      default: 'A4'
    },
    orientation: {
      type: String,
      enum: ['portrait', 'landscape'],
      default: 'portrait'
    }
  },
  comments: [commentSchema],
  changes: [changeSchema],
  versions: [versionSchema],
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['document', 'letter', 'resume', 'report', 'essay', 'other'],
    default: 'document'
  },
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template'
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastViewedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  aiAnalysis: {
    lastAnalyzed: Date,
    readabilityScore: Number,
    sentimentScore: Number,
    toneAnalysis: String,
    suggestions: [String],
    keyTopics: [String]
  }
}, {
  timestamps: true
});

// Indexes for performance
documentSchema.index({ owner: 1, createdAt: -1 });
documentSchema.index({ 'collaborators.user': 1 });
documentSchema.index({ title: 'text', plainTextContent: 'text' });
documentSchema.index({ tags: 1 });
documentSchema.index({ category: 1 });
documentSchema.index({ isDeleted: 1 });

// Update metadata before saving
documentSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    // Update plain text content
    this.plainTextContent = this.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Update word count
    this.metadata.wordCount = this.plainTextContent ? this.plainTextContent.split(/\s+/).length : 0;
    
    // Update character count
    this.metadata.characterCount = this.plainTextContent.length;
    
    // Update page count (assuming ~250 words per page)
    this.metadata.pageCount = Math.max(1, Math.ceil(this.metadata.wordCount / 250));
    
    // Update reading time (assuming 200 words per minute)
    this.metadata.readingTime = Math.ceil(this.metadata.wordCount / 200);
  }
  next();
});

// Virtual for checking if user can edit
documentSchema.virtual('canEdit').get(function() {
  return function(userId) {
    if (this.owner.toString() === userId.toString()) return true;
    const collaborator = this.collaborators.find(c => c.user.toString() === userId.toString());
    return collaborator && collaborator.permission === 'edit';
  };
});

// Virtual for checking if user can comment
documentSchema.virtual('canComment').get(function() {
  return function(userId) {
    if (this.owner.toString() === userId.toString()) return true;
    const collaborator = this.collaborators.find(c => c.user.toString() === userId.toString());
    return collaborator && ['edit', 'comment'].includes(collaborator.permission);
  };
});

// Method to add collaborator
documentSchema.methods.addCollaborator = function(userId, permission = 'view') {
  const existingCollaborator = this.collaborators.find(c => c.user.toString() === userId.toString());
  if (existingCollaborator) {
    existingCollaborator.permission = permission;
  } else {
    this.collaborators.push({ user: userId, permission });
  }
  return this.save();
};

// Method to remove collaborator
documentSchema.methods.removeCollaborator = function(userId) {
  this.collaborators = this.collaborators.filter(c => c.user.toString() !== userId.toString());
  return this.save();
};

// Method to create version
documentSchema.methods.createVersion = function(changes = [], major = false) {
  const version = {
    id: new mongoose.Types.ObjectId().toString(),
    title: this.title,
    content: this.content,
    author: this.lastModifiedBy,
    changes,
    major
  };
  
  this.versions.push(version);
  
  // Keep only last 50 versions
  if (this.versions.length > 50) {
    this.versions = this.versions.slice(-50);
  }
  
  return this.save();
};

export default mongoose.model('Document', documentSchema);