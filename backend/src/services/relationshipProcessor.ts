/**
 * Entity Processing Service
 * Simplified entity validation and basic processing
 */

import type { Entity, Role, Feature } from '../types';
import { FeatureManager } from './featureManager';

export class EntityProcessor {
  /**
   * Process project entities with basic validation and feature consolidation
   */
  static processProject(data: {
    entities: Entity[];
    roles: Role[];
    features: string[] | Feature[];
  }): {
    entities: Entity[];
    roles: Role[];
    features: Feature[];
  } {
    const { entities, roles, features } = data;

    // Convert string features to structured features if needed
    let structuredFeatures: Feature[];
    if (features.length > 0 && typeof features[0] === 'string') {
      structuredFeatures = FeatureManager.convertStringFeaturesToStructured(
        features as string[],
        entities,
        roles
      );
    } else {
      structuredFeatures = features as Feature[];
    }

    return {
      entities: this.validateAndCleanEntities(entities),
      roles: roles,
      features: structuredFeatures
    };
  }

  /**
   * Clean and validate entities
   */
  static validateAndCleanEntities(entities: Entity[]): Entity[] {
    return entities.map(entity => ({
      ...entity,
      fields: entity.fields || [],
      relationships: entity.relationships || [],
      examples: entity.examples || [],
      metadata: entity.metadata || {}
    }));
  }

  /**
   * Prepare raw AI extracted entities
   */
  static prepareEntitiesFromAI(rawEntities: Record<string, any>[]): Entity[] {
    return rawEntities.map(entity => ({
      name: entity.name || '',
      fields: entity.fields || [],
      relationships: entity.relationships || [],
      examples: entity.examples || [],
      metadata: entity.metadata || {}
    }));
  }

  /**
   * Convert string-based features to structured features
   */
  static convertFeaturesToStructured(
    stringFeatures: string[],
    entities: Entity[],
    roles: Role[]
  ): Feature[] {
    return FeatureManager.convertStringFeaturesToStructured(stringFeatures, entities, roles);
  }

  /**
   * Generate entity management features for all entities
   */
  static generateEntityFeatures(entities: Entity[]): Feature[] {
    return FeatureManager.generateEntityManagementFeatures(entities);
  }
}