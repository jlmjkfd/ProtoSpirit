/**
 * Shared Type Definitions
 * Used by both frontend and backend to ensure consistency
 */

// Core Entity Types
export interface EntityField {
  name: string;
  type: 'text' | 'email' | 'number' | 'date' | 'boolean' | 'select' | 'textarea';
  required: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
  metadata?: {
    label?: string;
    placeholder?: string;
    helpText?: string;
  };
}

export interface EntityRelationship {
  type: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';
  entity: string;
  description?: string;
  foreignKey?: string;
}

export interface Entity {
  name: string;
  fields: EntityField[];
  relationships?: EntityRelationship[];
  examples?: Record<string, any>[];
  metadata?: {
    color?: string;
    description?: string;
    isNew?: boolean;
    isRemoved?: boolean;
  };
}

// Feature Management Types
export interface Feature {
  id: string;
  name: string;
  description: string;
  category: 'entity' | 'relationship';
  entityTarget?: string;
  relationshipTarget?: string;
  // New relationship properties
  relatedEntities?: string[];        // Which entities are involved in this relationship
  showInEntityLists?: string[];      // Which entity lists should show this relationship button
  permissions: Array<{
    role: string;
    actions: ('read' | 'full')[];
  }>;
}

export interface Role {
  name: string;
  description: string;
  features: string[]; // Feature names or IDs
}

// Project Types (Base interface - frontend/backend can extend)
export interface ProjectBase {
  appName: string;
  description: string;
  entities: Entity[];
  roles: Role[];
  features: Feature[];
}

// Frontend Project (dates as strings)
export interface Project extends ProjectBase {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// Backend Project (dates as Date objects)
export interface ProjectDocument extends ProjectBase {
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Junction Entity Types
export interface JunctionEntitySuggestion {
  name: string;
  description: string;
  sourceEntity: string;
  targetEntity: string;
  suggestedFields: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  relationships: EntityRelationship[];
}

// Relationship Analysis
export interface RelationshipAnalysis {
  manyToManyRelationships: Array<{
    sourceEntity: string;
    targetEntity: string;
    relationship: EntityRelationship;
  }>;
  suggestedJunctionEntities: JunctionEntitySuggestion[];
  warnings: string[];
}

// Extracted Requirements
export interface ExtractedRequirements {
  appName: string;
  entities: Entity[];
  roles: Role[];
  features: Feature[];
  relationshipAnalysis?: RelationshipAnalysis;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

