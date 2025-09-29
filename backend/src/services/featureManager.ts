/**
 * Feature Management Service - Simplified for Intern Project
 * Only includes essential functions needed for the basic requirement capture and UI generation
 */

import type { Feature, Role, Entity } from '../types';

export interface FeatureValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class FeatureManager {
  /**
   * Validate feature permissions against available roles
   * Used by requirements endpoint to validate incoming project data
   */
  static validateFeaturePermissions(features: Feature[], roles: Role[]): FeatureValidation {
    const errors: string[] = [];
    const roleNames = new Set(roles.map(role => role.name));

    for (const feature of features) {
      // Check if feature has valid structure
      if (!feature.id || !feature.name || !feature.category) {
        errors.push(`Feature missing required fields: ${JSON.stringify(feature)}`);
        continue;
      }

      // Check if all permission roles exist
      for (const permission of feature.permissions || []) {
        if (!roleNames.has(permission.role)) {
          errors.push(`Feature "${feature.name}" references non-existent role: ${permission.role}`);
        }

        // Check if permission actions are valid
        for (const action of permission.actions) {
          if (!['read', 'full'].includes(action)) {
            errors.push(`Feature "${feature.name}" has invalid permission action: ${action}`);
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: [] // No warnings in simplified version
    };
  }

  /**
   * Convert string-based features to structured Feature objects
   * Used by relationshipProcessor when handling legacy string features
   */
  static convertStringFeaturesToStructured(
    stringFeatures: string[],
    entities: Entity[],
    roles: Role[]
  ): Feature[] {
    return stringFeatures.map((featureName, index) => {
      // Simple conversion - just create basic feature structure
      return {
        id: `feature_${index + 1}`,
        name: featureName,
        description: `Feature: ${featureName}`,
        category: this.guessCategory(featureName, entities),
        permissions: this.generateBasicPermissions(roles)
      };
    });
  }

  /**
   * Generate basic entity management features for entities
   * Used by relationshipProcessor to create standard CRUD features
   */
  static generateEntityManagementFeatures(entities: Entity[]): Feature[] {
    return entities.map((entity, index) => ({
      id: `entity_feature_${index + 1}`,
      name: `${entity.name} Management`,
      description: `Manage ${entity.name} records`,
      category: 'entity' as const,
      entityTarget: entity.name,
      permissions: [
        { role: 'Admin', actions: ['full'] }
      ]
    }));
  }

  /**
   * Simple category guessing based on feature name
   */
  private static guessCategory(featureName: string, entities: Entity[]): 'entity' | 'relationship' {
    const lowerName = featureName.toLowerCase();
    const entityNames = entities.map(e => e.name.toLowerCase());

    // Check if feature mentions any entity
    for (const entityName of entityNames) {
      if (lowerName.includes(entityName)) {
        return 'entity';
      }
    }

    // Check for relationship keywords
    if (lowerName.includes('assign') || lowerName.includes('link') || lowerName.includes('connect')) {
      return 'relationship';
    }

    // Default to entity (simplified from business)
    return 'entity';
  }

  /**
   * Generate basic permissions for all roles
   */
  private static generateBasicPermissions(roles: Role[]): Array<{ role: string; actions: ('read' | 'full')[] }> {
    return roles.map(role => ({
      role: role.name,
      actions: role.name.toLowerCase().includes('admin') ? ['full'] : ['read']
    }));
  }
}