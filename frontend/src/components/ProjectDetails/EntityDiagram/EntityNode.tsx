import { memo } from "react";
import { Handle, Position } from "reactflow";
import type { NodeProps } from "reactflow";
import type { Entity } from "../../../types";

interface EntityNodeData {
  entity: Entity;
  onEdit: (entity: Entity) => void;
  onDelete?: (entityName: string) => void;
}

export const EntityNodeComponent = memo(
  ({ data }: NodeProps<EntityNodeData>) => {
    const { entity, onEdit, onDelete } = data;

    const handleEdit = () => {
      onEdit(entity);
    };

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (
        onDelete &&
        confirm(
          `Delete entity "${entity.name}"? This will also remove all relationships and features related to this entity.`
        )
      ) {
        onDelete(entity.name);
      }
    };

    const fieldCount = entity.fields?.length || 0;
    const relationshipCount = entity.relationships?.length || 0;

    return (
      <div className="bg-white border-2 border-gray-300 rounded-lg shadow-lg min-w-[200px] hover:border-blue-400 transition-colors">
        {/* Entity Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-sm">{entity.name}</h3>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={handleEdit}
                className="text-white hover:bg-white/20 rounded p-1 transition-colors"
                title="Edit Entity"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="text-white hover:bg-red-500/50 rounded p-1 transition-colors"
                  title="Delete Entity"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
          {entity.metadata?.description && (
            <p className="text-blue-100 text-xs mt-1 truncate">
              {entity.metadata.description}
            </p>
          )}
        </div>

        {/* Entity Body */}
        <div className="p-3">
          {/* Fields Preview */}
          <div className="space-y-1">
            {entity.fields?.slice(0, 5).map((field: any) => (
              <div
                key={field.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      field.type === "text"
                        ? "bg-blue-400"
                        : field.type === "number"
                        ? "bg-green-400"
                        : field.type === "boolean"
                        ? "bg-purple-400"
                        : field.type === "date"
                        ? "bg-orange-400"
                        : "bg-gray-400"
                    }`}
                  />
                  <span className="font-medium text-gray-700">
                    {field.name}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  {field.required && (
                    <span className="text-red-500 text-xs">*</span>
                  )}
                  <span className="text-gray-500 text-xs">{field.type}</span>
                </div>
              </div>
            ))}

            {fieldCount > 5 && (
              <div className="text-xs text-gray-500 italic">
                +{fieldCount - 5} more fields...
              </div>
            )}

            {fieldCount === 0 && (
              <div className="text-xs text-gray-400 italic">
                No fields defined
              </div>
            )}
          </div>

          {/* Entity Stats */}
          <div className="mt-3 pt-2 border-t border-gray-200">
            <div className="flex justify-between text-xs text-gray-600">
              <span>
                {fieldCount} field{fieldCount !== 1 ? "s" : ""}
              </span>
              <span>
                {relationshipCount} relation{relationshipCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Click to edit hint */}
          <div className="mt-2 text-center">
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
              Click to edit
            </span>
          </div>
        </div>

        {/* Connection Handles */}
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-blue-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-blue-500 border-2 border-white"
        />
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 !bg-blue-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 !bg-blue-500 border-2 border-white"
        />
      </div>
    );
  }
);

EntityNodeComponent.displayName = "EntityNodeComponent";
