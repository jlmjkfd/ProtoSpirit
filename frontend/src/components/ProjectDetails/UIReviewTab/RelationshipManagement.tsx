
interface RelationshipManagementProps {
  showRelationshipView: any;
  selectedRole: string;
  navigationHistory: string[];
  showRelationshipForm: boolean;
  getFeaturePermission: (feature: any, roleName: string) => "full" | "read" | "none";
  generateRelationshipData: (feature: any) => any[];
  setShowRelationshipView: (view: any) => void;
  navigateBack: () => void;
  setShowRelationshipForm: (show: boolean) => void;
  setRelationshipFormData: (data: Record<string, any>) => void;
  renderRelationshipForm: () => React.ReactNode;
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
  renderRelationshipForm
}: RelationshipManagementProps) {
  if (!showRelationshipView) return null;

  const feature = showRelationshipView;
  const permission = getFeaturePermission(feature, selectedRole);
  const relationshipData = generateRelationshipData(feature);
  const [entity1, entity2] = feature.relatedEntities || [
    "Entity1",
    "Entity2",
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            {feature.name}
          </h2>
          <p className="text-gray-600">
            {feature.description ||
              `Manage relationships between ${entity1} and ${entity2}`}
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
              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
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
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
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
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {entity1}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {entity2}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {relationshipData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.entity1Name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.entity2Name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.createdDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {permission !== "none" && (
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          View
                        </button>
                      )}
                      {permission === "full" && (
                        <>
                          <button className="text-green-600 hover:text-green-800 text-sm">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-800 text-sm">
                            Delete
                          </button>
                        </>
                      )}
                      {permission === "none" && (
                        <span className="text-gray-400 text-xs">
                          No access
                        </span>
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
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No relationships yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start by adding your first {feature.name.toLowerCase()}.
          </p>
          {permission === "full" && (
            <button
              onClick={() => {
                setShowRelationshipForm(true);
                setRelationshipFormData({});
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Add {feature.name}
            </button>
          )}
        </div>
      )}
    </div>
  );
}