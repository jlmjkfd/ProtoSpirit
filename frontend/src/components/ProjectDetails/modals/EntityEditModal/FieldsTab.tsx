import type { Entity, EntityField } from "../../../../types";

interface FieldsTabProps {
  editingEntity: Entity;
  newField: Partial<EntityField>;
  fieldNameError: boolean;
  removedFields: Set<number>;
  originalFieldsCount: number;
  onNewFieldChange: (field: Partial<EntityField>) => void;
  onFieldNameError: (error: boolean) => void;
  onAddField: () => void;
  onUpdateField: (index: number, field: EntityField) => void;
  onRemoveField: (index: number) => void;
  onCancelRemoveField: (index: number) => void;
}

export function FieldsTab({
  editingEntity,
  newField,
  fieldNameError,
  removedFields,
  originalFieldsCount,
  onNewFieldChange,
  onFieldNameError,
  onAddField,
  onUpdateField,
  onRemoveField,
  onCancelRemoveField,
}: FieldsTabProps) {
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-3">Entity Fields</h4>

      {/* Add New Field */}
      <div className="bg-gray-50 rounded p-3 mb-3">
        <h5 className="text-xs font-medium text-gray-700 mb-2">
          Add New Field
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
          <div>
            <input
              type="text"
              placeholder="Field name"
              value={newField.name || ""}
              onChange={(e) => {
                onNewFieldChange({ ...newField, name: e.target.value });
                if (fieldNameError) onFieldNameError(false);
              }}
              className={`w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 ${
                fieldNameError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
          </div>
          <div>
            <select
              value={newField.type || "text"}
              onChange={(e) =>
                onNewFieldChange({ ...newField, type: e.target.value as any })
              }
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="date">Date</option>
              <option value="select">Select</option>
              <option value="textarea">Textarea</option>
            </select>
          </div>
          <div className="flex justify-center">
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={newField.required || false}
                onChange={(e) =>
                  onNewFieldChange({ ...newField, required: e.target.checked })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-700">Required</span>
            </label>
          </div>
          <div className="md:col-span-2">
            <button
              onClick={onAddField}
              className="w-full px-2 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Add Field
            </button>
          </div>
        </div>
      </div>

      {/* Existing Fields */}
      <div className="space-y-2">
        {editingEntity.fields?.map((field, index) => {
          const isRemoved = removedFields.has(index);
          const isNew = index >= originalFieldsCount;

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
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                <div>
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) =>
                      onUpdateField(index, { ...field, name: e.target.value })
                    }
                    disabled={isRemoved}
                    className={`w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 ${
                      isRemoved
                        ? "bg-gray-100 text-gray-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                </div>
                <div>
                  <select
                    value={field.type}
                    onChange={(e) =>
                      onUpdateField(index, {
                        ...field,
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
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="date">Date</option>
                    <option value="select">Select</option>
                    <option value="textarea">Textarea</option>
                  </select>
                </div>
                <div className="flex justify-center">
                  <label className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) =>
                        onUpdateField(index, {
                          ...field,
                          required: e.target.checked,
                        })
                      }
                      disabled={isRemoved}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span
                      className={`text-xs ${
                        isRemoved ? "text-gray-500" : "text-gray-700"
                      }`}
                    >
                      Required
                    </span>
                  </label>
                </div>
                <div className="md:col-span-2 flex justify-center">
                  {isRemoved ? (
                    <button
                      onClick={() => onCancelRemoveField(index)}
                      className="px-2 py-1.5 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      Cancel Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => onRemoveField(index)}
                      className="px-2 py-1.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {(!editingEntity.fields || editingEntity.fields.length === 0) && (
          <div className="text-center py-6 text-gray-500 text-sm">
            No fields defined. Add a field above to get started.
          </div>
        )}
      </div>
    </div>
  );
}
