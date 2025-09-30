interface RelationshipFormProps {
  showRelationshipView: any;
  relationshipFormData: Record<string, any>;
  setRelationshipFormData: (
    data:
      | Record<string, any>
      | ((prev: Record<string, any>) => Record<string, any>)
  ) => void;
  setShowRelationshipForm: (show: boolean) => void;
  project: any; // Add project prop to check entity existence
}

export function RelationshipForm({
  showRelationshipView,
  relationshipFormData,
  setRelationshipFormData,
  setShowRelationshipForm,
  project,
}: RelationshipFormProps) {
  if (!showRelationshipView) return null;

  const feature = showRelationshipView;
  const [entity1, entity2] = feature.relatedEntities || ["Entity1", "Entity2"];

  // Ensure entity names are strings and not undefined
  // If there's only one entity, use relationship name for the missing one
  const safeEntity1 = entity1 || "Entity1";
  const safeEntity2 = entity2 || (feature.name ? feature.name.replace(/[-_]/g, ' ') : "Entity2");

  // Check which entities exist in the project
  const entity1Exists = project.entities.some((e: any) => e.name === safeEntity1);
  const entity2Exists = project.entities.some((e: any) => e.name === safeEntity2);

  // Determine if we should show warning (only if both entities are missing)
  const shouldShowWarning = !entity1Exists && !entity2Exists;

  // Generate sample options for dropdowns (only for existing entities)
  const entity1Options = entity1Exists
    ? Array.from({ length: 5 }, (_, i) => `${safeEntity1} ${i + 1}`)
    : [];
  const entity2Options = entity2Exists
    ? Array.from({ length: 5 }, (_, i) => `${safeEntity2} ${i + 1}`)
    : [];

  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white shadow-lg">
      {/* Form Header */}
      <div className="rounded-t-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center text-lg font-semibold">
            Add {feature.name}
          </h3>
          <button
            onClick={() => setShowRelationshipForm(false)}
            className="rounded-md p-1 text-white transition-colors hover:bg-white/20"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        {/* Show warning only if both entities are missing */}
        {shouldShowWarning && (
          <div className="mb-4 rounded-md bg-yellow-50 border border-yellow-200 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Missing Entities</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    This relationship feature references entities that don't exist in your project:
                    <span className="font-medium"> {safeEntity1}</span> and <span className="font-medium"> {safeEntity2}</span>
                  </p>
                  <p className="mt-1">You can create this relationship by entering the entity names manually.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Entity 1 Selection/Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {entity1Exists ? `Select ${safeEntity1}` : safeEntity1}
              <span className="ml-1 text-red-500">*</span>
            </label>
            {entity1Exists ? (
              <select
                value={relationshipFormData[safeEntity1.toLowerCase()] || ""}
                onChange={(e) =>
                  setRelationshipFormData((prev) => ({
                    ...prev,
                    [safeEntity1.toLowerCase()]: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
              >
                <option value="">Choose {safeEntity1}</option>
                {entity1Options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={relationshipFormData[safeEntity1.toLowerCase()] || ""}
                onChange={(e) =>
                  setRelationshipFormData((prev) => ({
                    ...prev,
                    [safeEntity1.toLowerCase()]: e.target.value,
                  }))
                }
                placeholder={`Enter ${safeEntity1}`}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
              />
            )}
          </div>

          {/* Entity 2 Selection/Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {entity2Exists ? `Select ${safeEntity2}` : safeEntity2}
              <span className="ml-1 text-red-500">*</span>
            </label>
            {entity2Exists ? (
              <select
                value={relationshipFormData[safeEntity2.toLowerCase()] || ""}
                onChange={(e) =>
                  setRelationshipFormData((prev) => ({
                    ...prev,
                    [safeEntity2.toLowerCase()]: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
              >
                <option value="">Choose {safeEntity2}</option>
                {entity2Options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={relationshipFormData[safeEntity2.toLowerCase()] || ""}
                onChange={(e) =>
                  setRelationshipFormData((prev) => ({
                    ...prev,
                    [safeEntity2.toLowerCase()]: e.target.value,
                  }))
                }
                placeholder={`Enter ${safeEntity2}`}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
              />
            )}
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={relationshipFormData.status || "Active"}
              onChange={(e) =>
                setRelationshipFormData((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={
                relationshipFormData.startDate ||
                new Date().toISOString().split("T")[0]
              }
              onChange={(e) =>
                setRelationshipFormData((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Notes (Optional)
          </label>
          <textarea
            value={relationshipFormData.notes || ""}
            onChange={(e) =>
              setRelationshipFormData((prev) => ({
                ...prev,
                notes: e.target.value,
              }))
            }
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            placeholder={`Enter any additional notes about this ${feature.name.toLowerCase()}...`}
          />
        </div>

        {/* Form Actions */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setShowRelationshipForm(false)}
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const entity1Value = relationshipFormData[safeEntity1.toLowerCase()];
              const entity2Value = relationshipFormData[safeEntity2.toLowerCase()];

              if (!entity1Value || !entity2Value) {
                alert("Please select both entities");
                return;
              }

              alert(
                `${
                  feature.name
                } created successfully!\n\n${safeEntity1}: ${entity1Value}\n${safeEntity2}: ${entity2Value}\nStatus: ${
                  relationshipFormData.status || "Active"
                }`
              );
              setShowRelationshipForm(false);
              setRelationshipFormData({});
            }}
            className="rounded-md bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
          >
            Create {feature.name}
          </button>
        </div>
      </div>
    </div>
  );
}
