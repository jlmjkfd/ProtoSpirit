import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// User schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  loginCount: {
    type: Number,
    default: 0
  },
  profile: {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    avatar: { type: String }
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete (ret as any).password; // Never include password in JSON output
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes
UserSchema.index({ username: 1, email: 1 });
UserSchema.index({ isActive: 1, lastLogin: -1 });

// Virtuals
UserSchema.virtual('fullName').get(function() {
  return `${this.profile?.firstName || ''} ${this.profile?.lastName || ''}`.trim();
});

UserSchema.virtual('displayName').get(function() {
  const fullName = `${this.profile?.firstName || ''} ${this.profile?.lastName || ''}`.trim();
  return fullName || this.username;
});

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method to check password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to update login info
UserSchema.methods.updateLoginInfo = function() {
  this.lastLogin = new Date();
  this.loginCount += 1;
  return this.save();
};

// Static method to find by credentials
UserSchema.statics.findByCredentials = async function(identifier: string, password: string) {
  // Find user by username or email
  const user = await this.findOne({
    $or: [
      { username: identifier },
      { email: identifier.toLowerCase() }
    ],
    isActive: true
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return user;
};

// Static method to find active users
UserSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true }).select('-password');
};

// Static method to get user stats
UserSchema.statics.getUserStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        adminUsers: {
          $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] }
        },
        recentLogins: {
          $sum: {
            $cond: [
              {
                $gte: ['$lastLogin', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)]
              },
              1,
              0
            ]
          }
        }
      }
    }
  ]);

  return stats[0] || {
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    recentLogins: 0
  };
};

// Interface for TypeScript
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  isActive: boolean;
  lastLogin?: Date;
  loginCount: number;
  profile?: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  fullName: string;
  displayName: string;

  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  updateLoginInfo(): Promise<IUser>;
}

// Model interface
export interface IUserModel extends mongoose.Model<IUser> {
  findByCredentials(identifier: string, password: string): Promise<IUser>;
  findActiveUsers(): mongoose.Query<IUser[], IUser>;
  getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    adminUsers: number;
    recentLogins: number;
  }>;
}

export const User = mongoose.model<IUser, IUserModel>('User', UserSchema);