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
      <h4 className="mb-3 text-sm font-medium text-gray-900">Entity Fields</h4>

      {/* Add New Field */}
      <div className="mb-3 rounded bg-gray-50 p-3">
        <h5 className="mb-2 text-xs font-medium text-gray-700">
          Add New Field
        </h5>
        <div className="grid grid-cols-1 items-end gap-2 md:grid-cols-5">
          <div>
            <input
              type="text"
              placeholder="Field name"
              value={newField.name || ""}
              onChange={(e) => {
                onNewFieldChange({ ...newField, name: e.target.value });
                if (fieldNameError) onFieldNameError(false);
              }}
              className={`w-full rounded border px-2 py-1.5 text-sm focus:ring-1 focus:outline-none ${
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
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
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
              className="w-full rounded bg-blue-600 px-2 py-1.5 text-xs text-white transition-colors hover:bg-blue-700"
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
              className={`rounded border p-2 ${
                isRemoved
                  ? "border-red-200 bg-red-50"
                  : isNew
                    ? "border-green-200 bg-green-50"
                    : "border-gray-200 bg-white"
              }`}
            >
              <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-5">
                <div>
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) =>
                      onUpdateField(index, { ...field, name: e.target.value })
                    }
                    disabled={isRemoved}
                    className={`w-full rounded border px-2 py-1.5 text-sm focus:ring-1 focus:outline-none ${
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
                    className={`w-full rounded border px-2 py-1.5 text-sm focus:ring-1 focus:outline-none ${
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
                <div className="flex justify-center md:col-span-2">
                  {isRemoved ? (
                    <button
                      onClick={() => onCancelRemoveField(index)}
                      className="rounded bg-green-100 px-2 py-1.5 text-xs text-green-700 transition-colors hover:bg-green-200"
                    >
                      Cancel Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => onRemoveField(index)}
                      className="rounded bg-red-100 px-2 py-1.5 text-xs text-red-700 transition-colors hover:bg-red-200"
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
          <div className="py-6 text-center text-sm text-gray-500">
            No fields defined. Add a field above to get started.
          </div>
        )}
      </div>
    </div>
  );
}
