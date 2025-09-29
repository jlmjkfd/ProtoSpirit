import mongoose, { Schema, Document } from 'mongoose';

// Entity field schema
const EntityFieldSchema = new Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['text', 'email', 'number', 'date', 'boolean', 'select', 'textarea']
  },
  required: { type: Boolean, default: false },
  validation: {
    options: [{ type: String }]
  },
  metadata: {
    helpText: { type: String }
  }
}, { _id: false });


// Entity relationship schema
const EntityRelationshipSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['one-to-one', 'one-to-many', 'many-to-many']
  },
  entity: { type: String, required: true },
  description: { type: String },
  foreignKey: { type: String },
}, { _id: false });

// Feature permission schema
const FeaturePermissionSchema = new Schema({
  role: { type: String, required: true },
  actions: [{ type: String, enum: ['read', 'full'], required: true }]
}, { _id: false });

// Feature schema
const FeatureSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['entity', 'relationship'], required: true },
  entityTarget: { type: String },
  relationshipTarget: { type: String },
  // New relationship properties
  relatedEntities: [{ type: String }],        // Which entities are involved in this relationship
  showInEntityLists: [{ type: String }],      // Which entity lists should show this relationship button
  permissions: [FeaturePermissionSchema]
}, { _id: false });

// Role schema
const RoleSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  features: [{ type: String, required: true }] // Feature IDs
}, { _id: false });


// Entity schema
const EntitySchema = new Schema({
  name: { type: String, required: true },
  fields: [EntityFieldSchema],
  relationships: [EntityRelationshipSchema],
  examples: [{ type: Schema.Types.Mixed }],
  metadata: {
    description: { type: String },
    isNew: { type: Boolean },
    isRemoved: { type: Boolean }
  },
}, { _id: false });

// Main project schema
const ProjectSchema = new Schema({
  appName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    index: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  entities: {
    type: [EntitySchema],
    validate: {
      validator: function(entities: IProject['entities']) {
        return entities.length > 0;
      },
      message: 'At least one entity is required'
    }
  },
  roles: {
    type: [RoleSchema],
    validate: {
      validator: function(roles: IProject['roles']) {
        return roles.length > 0;
      },
      message: 'At least one role is required'
    }
  },
  features: {
    type: [FeatureSchema],
    validate: {
      validator: function(features: IProject['features']) {
        return features.length > 0;
      },
      message: 'At least one feature is required'
    }
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Future reference
    required: true,
    index: true
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
ProjectSchema.index({ appName: 1, createdAt: -1 });
ProjectSchema.index({
  appName: 'text',
  description: 'text',
  features: 'text'
}, {
  weights: {
    appName: 10,
    features: 5,
    description: 1
  }
});
ProjectSchema.index({ createdBy: 1, createdAt: -1 });

// Virtuals
ProjectSchema.virtual('entityCount').get(function(this: IProject) {
  return this.entities.length;
});

ProjectSchema.virtual('roleCount').get(function(this: IProject) {
  return this.roles?.length || 0;
});

ProjectSchema.virtual('featureCount').get(function(this: IProject) {
  return this.features.length;
});

// Pre-save middleware
ProjectSchema.pre('save', function(this: IProject, next: () => void) {
  // Ensure app name is properly formatted
  if (this.isModified('appName')) {
    this.appName = this.appName.trim();
  }

  // Remove duplicate roles and features
  if (this.isModified('roles')) {
    // Simple deduplication for roles - will be handled by application logic
    // Removed complex filtering to avoid TypeScript DocumentArray issues
  }

  if (this.isModified('features')) {
    // Features are now objects, not strings - remove this deduplication
    // Will be handled by application logic
  }

  next();
});

// Static methods
ProjectSchema.statics.findByAppName = function(appName: string) {
  return this.find({
    appName: new RegExp(appName, 'i')
  });
};


ProjectSchema.statics.searchProjects = function(query: string) {
  return this.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
};

// Instance methods
ProjectSchema.methods.addEntity = function(entity: IProject['entities'][0]) {
  this.entities.push(entity);
  return this.save();
};

ProjectSchema.methods.removeEntity = function(entityName: string) {
  this.entities = this.entities.filter((e: IProject['entities'][0]) => e.name !== entityName);
  return this.save();
};


// Interface for TypeScript
export interface IProject extends Document {
  appName: string;
  description: string;
  entities: Array<{
    name: string;
    fields: Array<{
      name: string;
      type: string;
      required: boolean;
      validation?: {
        options?: string[];
      };
      metadata?: {
        helpText?: string;
      };
    }>;
    relationships?: string[];
    metadata?: {
      description?: string;
      isNew?: boolean;
      isRemoved?: boolean;
    };
  }>;
  roles: Array<{
    name: string;
    description: string;
    features: string[];
  }>;
  features: Array<{
    id: string;
    name: string;
    description: string;
    category: 'entity' | 'relationship';
    entityTarget?: string;
    relationshipTarget?: string;
    relatedEntities?: string[];
    showInEntityLists?: string[];
    permissions: Array<{
      role: string;
      actions: ('read' | 'full')[];
    }>;
  }>;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  entityCount: number;
  roleCount: number;
  featureCount: number;

  // Instance methods
  addEntity(entity: IProject['entities'][0]): Promise<IProject>;
  removeEntity(entityName: string): Promise<IProject>;
}

// Model interface
export interface IProjectModel extends mongoose.Model<IProject> {
  findByAppName(appName: string): mongoose.Query<IProject[], IProject>;
  searchProjects(query: string): mongoose.Query<IProject[], IProject>;
}

export const Project = mongoose.model<IProject, IProjectModel>('Project', ProjectSchema);