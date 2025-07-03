import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: function() {
      return this.firstName.charAt(0).toUpperCase() + this.lastName.charAt(0).toUpperCase();
    }
  },
  avatarColor: {
    type: String,
    default: function() {
      const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    fontSize: {
      type: Number,
      default: 14,
      min: 10,
      max: 24
    },
    fontFamily: {
      type: String,
      default: 'Calibri'
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
  subscription: {
    type: {
      type: String,
      enum: ['free', 'premium', 'enterprise'],
      default: 'free'
    },
    expiresAt: Date,
    features: [{
      type: String
    }]
  },
  usage: {
    aiRequestsToday: {
      type: Number,
      default: 0
    },
    aiRequestsThisMonth: {
      type: Number,
      default: 0
    },
    documentsCreated: {
      type: Number,
      default: 0
    },
    lastResetDate: {
      type: Date,
      default: Date.now
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Get full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Check if user can make AI requests
userSchema.methods.canMakeAIRequest = function() {
  const limits = {
    free: { daily: 50, monthly: 1000 },
    premium: { daily: 500, monthly: 10000 },
    enterprise: { daily: Infinity, monthly: Infinity }
  };
  
  const userLimits = limits[this.subscription.type];
  return this.usage.aiRequestsToday < userLimits.daily && 
         this.usage.aiRequestsThisMonth < userLimits.monthly;
};

// Increment AI usage
userSchema.methods.incrementAIUsage = async function() {
  this.usage.aiRequestsToday += 1;
  this.usage.aiRequestsThisMonth += 1;
  await this.save();
};

// Reset daily usage (called by cron job)
userSchema.methods.resetDailyUsage = async function() {
  this.usage.aiRequestsToday = 0;
  this.usage.lastResetDate = new Date();
  await this.save();
};

export default mongoose.model('User', userSchema);