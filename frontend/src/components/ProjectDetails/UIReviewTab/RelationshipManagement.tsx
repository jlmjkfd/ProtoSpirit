interface RelationshipManagementProps {
  showRelationshipView: any;
  selectedRole: string;
  navigationHistory: string[];
  showRelationshipForm: boolean;
  getFeaturePermission: (
    feature: any,
    roleName: string
  ) => "full" | "read" | "none";
  generateRelationshipData: (feature: any) => any[];
  setShowRelationshipView: (view: any) => void;
  navigateBack: () => void;
  setShowRelationshipForm: (show: boolean) => void;
  setRelationshipFormData: (data: Record<string, any>) => void;
  renderRelationshipForm: () => React.ReactNode;
  project: any; // Add project prop for entity validation
}

export function RelationshipManagement({
  showRelationshipView,
  selectedRole,
  navigationHistory,
  showRelationshipForm,
  getFeaturePermission,
  generateRelationshipData,
  setShowRelationshipView,
  navigateBack,
  setShowRelationshipForm,
  setRelationshipFormData,
  renderRelationshipForm,
  project,
}: RelationshipManagementProps) {
  if (!showRelationshipView) return null;

  const feature = showRelationshipView;
  const permission = getFeaturePermission(feature, selectedRole);
  const relationshipData = generateRelationshipData(feature);
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

  return (
    <div className="p-6">
      {/* Show warning only if both entities are missing */}
      {shouldShowWarning && (
        <div className="mb-6 rounded-md bg-yellow-50 border border-yellow-200 p-4">
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
                <p className="mt-1">You can create relationships by entering the entity names manually.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="mb-2 flex items-center text-2xl font-bold text-gray-900">
            {feature.name}
          </h2>
          <p className="text-gray-600">
            {feature.description ||
              `Manage relationships between ${safeEntity1} and ${safeEntity2}`}
          </p>
        </div>
        <div className="flex space-x-2">
          {/* Only show back button if there's a meaningful previous page */}
          {navigationHistory.length > 1 && (
            <button
              onClick={() => {
                setShowRelationshipView(null);
                navigateBack();
              }}
              className="rounded-md border border-gray-300 px-3 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              ← Back
            </button>
          )}
          {permission === "full" && (
            <button
              onClick={() => {
                setShowRelationshipForm(true);
                setRelationshipFormData({});
              }}
              className="rounded-md bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
            >
              + Add {feature.name}
            </button>
          )}
        </div>
      </div>

      {/* Relationship List */}
      {showRelationshipForm ? (
        renderRelationshipForm()
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  {safeEntity1}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  {safeEntity2}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Created Date
                </th>
                <th className="w-32 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {relationshipData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                    {item.entity1Name}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                    {item.entity2Name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        item.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {item.createdDate}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    <div className="flex space-x-2">
                      {permission !== "none" && (
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          View
                        </button>
                      )}
                      {permission === "full" && (
                        <>
                          <button className="text-sm text-green-600 hover:text-green-800">
                            Edit
                          </button>
                          <button className="text-sm text-red-600 hover:text-red-800">
                            Delete
                          </button>
                        </>
                      )}
                      {permission === "none" && (
                        <span className="text-xs text-gray-400">No access</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {relationshipData.length === 0 && !showRelationshipForm && (
        <div className="py-12 text-center">
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No relationships yet
          </h3>
          <p className="mb-4 text-gray-600">
            Start by adding your first {feature.name.toLowerCase()}.
          </p>
          {permission === "full" && (
            <button
              onClick={() => {
                setShowRelationshipForm(true);
                setRelationshipFormData({});
              }}
              className="rounded-md bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
            >
              Add {feature.name}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
