// Import shared types
import {
  Entity,
  EntityField,
  EntityRelationship,
  Feature,
  Role,
  ProjectBase,
  Project as ProjectShared,
  ProjectDocument,
  JunctionEntitySuggestion,
  RelationshipAnalysis,
  ExtractedRequirements,
  ApiResponse
} from './shared';

// Re-export shared types
export {
  Entity,
  EntityField,
  EntityRelationship,
  Feature,
  Role,
  ProjectBase,
  ProjectShared,
  ProjectDocument,
  JunctionEntitySuggestion,
  RelationshipAnalysis,
  ExtractedRequirements,
  ApiResponse
};

// Backend-specific types
export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  profile?: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  lastLogin?: Date;
  loginCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Backend Project type (uses Date objects)
export interface Project {
  _id?: string;
  appName: string;
  description: string;
  entities: Entity[];
  roles: Role[];
  features: Feature[];
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

