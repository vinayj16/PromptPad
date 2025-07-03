import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['business', 'academic', 'personal', 'creative', 'legal', 'marketing']
  },
  content: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String, // URL to thumbnail image
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPremium: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  usageCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
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
    margins: {
      top: { type: Number, default: 2.54 },
      bottom: { type: Number, default: 2.54 },
      left: { type: Number, default: 2.54 },
      right: { type: Number, default: 2.54 }
    },
    pageSize: {
      type: String,
      default: 'A4'
    }
  },
  variables: [{
    name: String,
    type: {
      type: String,
      enum: ['text', 'date', 'number', 'boolean']
    },
    placeholder: String,
    required: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

// Indexes
templateSchema.index({ category: 1, isPublic: 1 });
templateSchema.index({ tags: 1 });
templateSchema.index({ name: 'text', description: 'text' });
templateSchema.index({ 'rating.average': -1 });
templateSchema.index({ usageCount: -1 });

// Method to increment usage
templateSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  return this.save();
};

// Method to add rating
templateSchema.methods.addRating = function(rating) {
  const totalRating = this.rating.average * this.rating.count + rating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  return this.save();
};

export default mongoose.model('Template', templateSchema);