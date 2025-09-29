import type { Project } from "../../../types";

interface CreateFormProps {
  showCreateForm: string | null;
  project: Project;
  formData: Record<string, any>;
  handleFormFieldChange: (fieldName: string, value: any) => void;
  handleCloseCreateForm: () => void;
  handleSubmitCreate: (entityName: string | null) => void;
}

export function CreateForm({
  showCreateForm,
  project,
  formData,
  handleFormFieldChange,
  handleCloseCreateForm,
  handleSubmitCreate
}: CreateFormProps) {
  if (!showCreateForm) return null;

  const entity = project.entities.find((e) => e.name === showCreateForm);
  if (!entity) return null;

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg border border-gray-200 shadow-lg max-w-4xl mx-auto">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Create New {showCreateForm}
            </h3>
            <button
              onClick={handleCloseCreateForm}
              className="text-white hover:bg-white/20 rounded-md px-3 py-1 transition-colors text-lg"
            >
              ×
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entity.fields?.map((field) => (
              <div
                key={field.name}
                className={field.type === "textarea" ? "md:col-span-2" : ""}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.name}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>

                {field.type === "textarea" ? (
                  <textarea
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleFormFieldChange(field.name, e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Enter ${field.name.toLowerCase()}`}
                    required={field.required}
                  />
                ) : field.type === "boolean" ? (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData[field.name] || false}
                      onChange={(e) =>
                        handleFormFieldChange(field.name, e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      {field.metadata?.helpText ||
                        `Enable ${field.name.toLowerCase()}`}
                    </span>
                  </div>
                ) : field.type === "select" ? (
                  <select
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleFormFieldChange(field.name, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required={field.required}
                  >
                    <option value="">
                      Select {field.name.toLowerCase()}
                    </option>
                    <option value="Option 1">Option 1</option>
                    <option value="Option 2">Option 2</option>
                    <option value="Option 3">Option 3</option>
                  </select>
                ) : field.type === "date" ? (
                  <input
                    type="date"
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleFormFieldChange(field.name, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required={field.required}
                  />
                ) : field.type === "number" ? (
                  <input
                    type="number"
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleFormFieldChange(field.name, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Enter ${field.name.toLowerCase()}`}
                    required={field.required}
                  />
                ) : (
                  <input
                    type={field.type === "email" ? "email" : "text"}
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleFormFieldChange(field.name, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Enter ${field.name.toLowerCase()}`}
                    required={field.required}
                  />
                )}

                {field.metadata?.helpText && field.type !== "boolean" && (
                  <p className="mt-1 text-sm text-gray-500">
                    {field.metadata.helpText}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={handleCloseCreateForm}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Back to List
            </button>
            <button
              onClick={() => handleSubmitCreate(showCreateForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create {showCreateForm}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}