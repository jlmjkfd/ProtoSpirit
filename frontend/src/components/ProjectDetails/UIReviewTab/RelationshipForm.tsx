interface RelationshipFormProps {
  showRelationshipView: any;
  relationshipFormData: Record<string, any>;
  setRelationshipFormData: (
    data:
      | Record<string, any>
      | ((prev: Record<string, any>) => Record<string, any>)
  ) => void;
  setShowRelationshipForm: (show: boolean) => void;
}

export function RelationshipForm({
  showRelationshipView,
  relationshipFormData,
  setRelationshipFormData,
  setShowRelationshipForm,
}: RelationshipFormProps) {
  if (!showRelationshipView) return null;

  const feature = showRelationshipView;
  const [entity1, entity2] = feature.relatedEntities || ["Entity1", "Entity2"];

  // Generate sample options for dropdowns
  const entity1Options = Array.from(
    { length: 5 },
    (_, i) => `${entity1} ${i + 1}`
  );
  const entity2Options = Array.from(
    { length: 5 },
    (_, i) => `${entity2} ${i + 1}`
  );

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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Entity 1 Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select {entity1}
              <span className="ml-1 text-red-500">*</span>
            </label>
            <select
              value={relationshipFormData[entity1.toLowerCase()] || ""}
              onChange={(e) =>
                setRelationshipFormData((prev) => ({
                  ...prev,
                  [entity1.toLowerCase()]: e.target.value,
                }))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            >
              <option value="">Choose {entity1}</option>
              {entity1Options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Entity 2 Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Select {entity2}
              <span className="ml-1 text-red-500">*</span>
            </label>
            <select
              value={relationshipFormData[entity2.toLowerCase()] || ""}
              onChange={(e) =>
                setRelationshipFormData((prev) => ({
                  ...prev,
                  [entity2.toLowerCase()]: e.target.value,
                }))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            >
              <option value="">Choose {entity2}</option>
              {entity2Options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
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
              const entity1Value = relationshipFormData[entity1.toLowerCase()];
              const entity2Value = relationshipFormData[entity2.toLowerCase()];

              if (!entity1Value || !entity2Value) {
                alert("Please select both entities");
                return;
              }

              alert(
                `${
                  feature.name
                } created successfully!\n\n${entity1}: ${entity1Value}\n${entity2}: ${entity2Value}\nStatus: ${
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
