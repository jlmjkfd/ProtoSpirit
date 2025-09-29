import type { Entity } from '../../../types';

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
  onDeleteEntity
}: EntitiesTabProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Data Entities</h3>
        <button
          onClick={onAddEntity}
          className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
        >
          + Add Entity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entities.map((entity, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              highlightedEntity === entity.name
                ? 'bg-blue-50 border-blue-300 shadow-md'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
            onClick={() => onHighlight(entity.name)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-gray-900">{entity.name}</h4>
                <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                  Entity
                </span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditEntity(entity);
                  }}
                  className="text-blue-500 hover:text-blue-700 p-1"
                  title="Edit entity"
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteEntity(entity.name);
                  }}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Delete entity"
                >
                  🗑️
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3">
              {entity.metadata?.description || 'No description'}
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
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No entities yet</h3>
          <p className="text-gray-600 mb-4">Add your first data entity to get started.</p>
          <button
            onClick={onAddEntity}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Entity
          </button>
        </div>
      )}
    </div>
  );
}