import type { Entity } from "../../../types";

interface EntitiesTabProps {
  entities: Entity[];
  highlightedEntity: string | null;
  onHighlight: (entityName: string) => void;
  onAddEntity: () => void;
  onEditEntity: (entity: Entity) => void;
  onDeleteEntity: (entityName: string) => void;
}

export function EntitiesTab({
  entities,
  highlightedEntity,
  onHighlight,
  onAddEntity,
  onEditEntity,
  onDeleteEntity,
}: EntitiesTabProps) {
  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Data Entities</h3>
        <button
          onClick={onAddEntity}
          className="rounded-md bg-green-600 px-3 py-2 text-sm text-white transition-colors hover:bg-green-700"
        >
          + Add Entity
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {entities.map((entity, index) => (
          <div
            key={index}
            className={`cursor-pointer rounded-lg border p-4 transition-all ${
              highlightedEntity === entity.name
                ? "border-blue-300 bg-blue-50 shadow-md"
                : "border-gray-200 bg-gray-50 hover:bg-gray-100"
            }`}
            onClick={() => onHighlight(entity.name)}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-gray-900">{entity.name}</h4>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                  Entity
                </span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditEntity(entity);
                  }}
                  className="p-1 text-blue-500 hover:text-blue-700"
                  title="Edit entity"
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteEntity(entity.name);
                  }}
                  className="p-1 text-red-500 hover:text-red-700"
                  title="Delete entity"
                >
                  🗑️
                </button>
              </div>
            </div>

            <p className="mb-3 text-sm text-gray-600">
              {entity.metadata?.description || "No description"}
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Fields: {entity.fields?.length || 0}</span>
                <span>Relationships: {entity.relationships?.length || 0}</span>
              </div>

              {entity.fields?.slice(0, 3).map((field, fieldIndex) => (
                <div key={fieldIndex} className="text-xs text-gray-600">
                  <span className="font-medium">{field.name}</span>
                  <span className="text-gray-400"> ({field.type})</span>
                  {field.required && <span className="text-red-500"> *</span>}
                </div>
              ))}

              {entity.fields && entity.fields.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{entity.fields.length - 3} more fields...
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {entities.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 text-gray-400">📄</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No entities yet
          </h3>
          <p className="mb-4 text-gray-600">
            Add your first data entity to get started.
          </p>
          <button
            onClick={onAddEntity}
            className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Add Entity
          </button>
        </div>
      )}
    </div>
  );
}
