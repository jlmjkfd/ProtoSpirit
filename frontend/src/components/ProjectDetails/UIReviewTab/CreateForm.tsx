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
  handleSubmitCreate,
}: CreateFormProps) {
  if (!showCreateForm) return null;

  const entity = project.entities.find((e) => e.name === showCreateForm);
  if (!entity) return null;

  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl rounded-lg border border-gray-200 bg-white shadow-lg">
        {/* Form Header */}
        <div className="rounded-t-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Create New {showCreateForm}
            </h3>
            <button
              onClick={handleCloseCreateForm}
              className="rounded-md px-3 py-1 text-lg text-white transition-colors hover:bg-white/20"
            >
              ×
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {entity.fields?.map((field) => (
              <div
                key={field.name}
                className={field.type === "textarea" ? "md:col-span-2" : ""}
              >
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {field.name}
                  {field.required && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </label>

                {field.type === "textarea" ? (
                  <textarea
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleFormFieldChange(field.name, e.target.value)
                    }
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required={field.required}
                  >
                    <option value="">Select {field.name.toLowerCase()}</option>
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
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required={field.required}
                  />
                ) : field.type === "number" ? (
                  <input
                    type="number"
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      handleFormFieldChange(field.name, e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              Back to List
            </button>
            <button
              onClick={() => handleSubmitCreate(showCreateForm)}
              className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Create {showCreateForm}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
