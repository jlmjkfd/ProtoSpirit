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
      <h4 className="mb-3 text-sm font-medium text-gray-900">
        Entity Relationships
      </h4>

      {/* Add New Relationship */}
      <div className="mb-3 rounded bg-gray-50 p-3">
        <h5 className="mb-2 text-xs font-medium text-gray-700">
          Add New Relationship
        </h5>
        <div className="grid grid-cols-1 gap-2">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
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
                className={`w-full rounded border px-2 py-1.5 text-sm focus:ring-1 focus:outline-none ${
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
                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
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
                className="w-full rounded bg-blue-600 px-2 py-1.5 text-xs text-white transition-colors hover:bg-blue-700"
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
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
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
              className={`rounded border p-2 ${
                isRemoved
                  ? "border-red-200 bg-red-50"
                  : isNew
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-white"
              }`}
            >
              <div className="grid grid-cols-1 gap-2">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
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
                      className={`w-full rounded border px-2 py-1.5 text-sm focus:ring-1 focus:outline-none ${
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
                      className={`w-full rounded border px-2 py-1.5 text-sm focus:ring-1 focus:outline-none ${
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
                        className="rounded bg-green-100 px-2 py-1.5 text-xs text-green-700 transition-colors hover:bg-green-200"
                      >
                        Cancel Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => onRemoveRelationship(index)}
                        className="rounded bg-red-100 px-2 py-1.5 text-xs text-red-700 transition-colors hover:bg-red-200"
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
                    className={`w-full rounded border px-2 py-1.5 text-sm focus:ring-1 focus:outline-none ${
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
          <div className="py-6 text-center text-sm text-gray-500">
            No relationships defined. Add a relationship above to get started.
          </div>
        )}
      </div>
    </div>
  );
}
