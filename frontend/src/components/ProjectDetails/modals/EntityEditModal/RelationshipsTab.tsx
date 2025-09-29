import type { Entity, EntityRelationship } from "../../../../types";

interface RelationshipsTabProps {
  editingEntity: Entity;
  newRelationship: Partial<EntityRelationship>;
  relationshipEntityError: boolean;
  removedRelationships: Set<number>;
  originalRelationshipsCount: number;
  availableEntities: Entity[];
  onNewRelationshipChange: (relationship: Partial<EntityRelationship>) => void;
  onRelationshipEntityError: (error: boolean) => void;
  onAddRelationship: () => void;
  onUpdateRelationship: (
    index: number,
    relationship: EntityRelationship
  ) => void;
  onRemoveRelationship: (index: number) => void;
  onCancelRemoveRelationship: (index: number) => void;
}

export function RelationshipsTab({
  editingEntity,
  newRelationship,
  relationshipEntityError,
  removedRelationships,
  originalRelationshipsCount,
  availableEntities,
  onNewRelationshipChange,
  onRelationshipEntityError,
  onAddRelationship,
  onUpdateRelationship,
  onRemoveRelationship,
  onCancelRemoveRelationship,
}: RelationshipsTabProps) {
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-3">
        Entity Relationships
      </h4>

      {/* Add New Relationship */}
      <div className="bg-gray-50 rounded p-3 mb-3">
        <h5 className="text-xs font-medium text-gray-700 mb-2">
          Add New Relationship
        </h5>
        <div className="grid grid-cols-1 gap-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <select
                value={newRelationship.entity || ""}
                onChange={(e) => {
                  onNewRelationshipChange({
                    ...newRelationship,
                    entity: e.target.value,
                  });
                  if (relationshipEntityError) onRelationshipEntityError(false);
                }}
                className={`w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 ${
                  relationshipEntityError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              >
                <option value="">Select entity...</option>
                {availableEntities.map((entity) => (
                  <option key={entity.name} value={entity.name}>
                    {entity.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={newRelationship.type || "one-to-many"}
                onChange={(e) =>
                  onNewRelationshipChange({
                    ...newRelationship,
                    type: e.target.value as any,
                  })
                }
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="one-to-one">1:1</option>
                <option value="one-to-many">1:M</option>
                <option value="many-to-one">M:1</option>
                <option value="many-to-many">M:M</option>
              </select>
            </div>
            <div>
              <button
                onClick={onAddRelationship}
                className="w-full px-2 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Add Relationship
              </button>
            </div>
          </div>
          <div>
            <textarea
              placeholder="Description (optional)"
              value={newRelationship.description || ""}
              onChange={(e) =>
                onNewRelationshipChange({
                  ...newRelationship,
                  description: e.target.value,
                })
              }
              rows={2}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Existing Relationships */}
      <div className="space-y-2">
        {editingEntity.relationships?.map((relationship, index) => {
          const isRemoved = removedRelationships.has(index);
          const isNew = index >= originalRelationshipsCount;

          return (
            <div
              key={index}
              className={`border rounded p-2 ${
                isRemoved
                  ? "bg-red-50 border-red-200"
                  : isNew
                  ? "bg-green-50 border-green-200"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="grid grid-cols-1 gap-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <select
                      value={relationship.entity}
                      onChange={(e) =>
                        onUpdateRelationship(index, {
                          ...relationship,
                          entity: e.target.value,
                        })
                      }
                      disabled={isRemoved}
                      className={`w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 ${
                        isRemoved
                          ? "bg-gray-100 text-gray-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                    >
                      {availableEntities.map((entity) => (
                        <option key={entity.name} value={entity.name}>
                          {entity.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      value={relationship.type}
                      onChange={(e) =>
                        onUpdateRelationship(index, {
                          ...relationship,
                          type: e.target.value as any,
                        })
                      }
                      disabled={isRemoved}
                      className={`w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 ${
                        isRemoved
                          ? "bg-gray-100 text-gray-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                    >
                      <option value="one-to-one">1:1</option>
                      <option value="one-to-many">1:M</option>
                      <option value="many-to-one">M:1</option>
                      <option value="many-to-many">M:M</option>
                    </select>
                  </div>
                  <div className="flex justify-center">
                    {isRemoved ? (
                      <button
                        onClick={() => onCancelRemoveRelationship(index)}
                        className="px-2 py-1.5 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                      >
                        Cancel Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => onRemoveRelationship(index)}
                        className="px-2 py-1.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <textarea
                    value={relationship.description || ""}
                    onChange={(e) =>
                      onUpdateRelationship(index, {
                        ...relationship,
                        description: e.target.value,
                      })
                    }
                    disabled={isRemoved}
                    className={`w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 ${
                      isRemoved
                        ? "bg-gray-100 text-gray-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="Description (optional)"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {(!editingEntity.relationships ||
          editingEntity.relationships.length === 0) && (
          <div className="text-center py-6 text-gray-500 text-sm">
            No relationships defined. Add a relationship above to get started.
          </div>
        )}
      </div>
    </div>
  );
}
