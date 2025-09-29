import type { Project, Feature } from "../../../types";

interface EntityListProps {
  entityName: string;
  project: Project;
  selectedRole: string;
  roleFeatures: (string | Feature)[];
  getFeatureName: (feature: any) => string;
  getFeaturePermission: (feature: any, roleName: string) => "full" | "read" | "none";
  generateSampleData: (entityName: string) => any[];
  showCreateForm: string | null;
  handleShowCreateForm: (entityName: string) => void;
  setShowRelationshipView: (feature: any) => void;
  navigateToView: (viewName: string) => void;
  renderCreateForm: () => React.ReactNode;
}

export function EntityList({
  entityName,
  project,
  selectedRole,
  roleFeatures,
  getFeatureName,
  getFeaturePermission,
  generateSampleData,
  showCreateForm,
  handleShowCreateForm,
  setShowRelationshipView,
  navigateToView,
  renderCreateForm
}: EntityListProps) {
  const entity = project.entities.find((e) => e.name === entityName);
  if (!entity) return null;

  const sampleData = generateSampleData(entityName);
  const displayFields = entity.fields?.slice(0, 4) || []; // Show first 4 fields

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {entityName} Management
          </h2>
          <p className="text-gray-600 mt-1">
            {entity.metadata?.description ||
              `Manage your ${entityName.toLowerCase()}s`}
          </p>
        </div>

        {/* Show Add button if user has full permission for this entity */}
        {(() => {
          const entityFeature = roleFeatures.find(
            (f) =>
              getFeatureName(f)
                .toLowerCase()
                .includes(entityName.toLowerCase() + "-management") ||
              getFeatureName(f)
                .toLowerCase()
                .includes("manage-" + entityName.toLowerCase()) ||
              getFeatureName(f)
                .toLowerCase()
                .includes(entityName.toLowerCase())
          );
          const permission = entityFeature
            ? getFeaturePermission(entityFeature, selectedRole)
            : "none";
          return permission === "full";
        })() && (
          <button
            onClick={() => handleShowCreateForm(entityName)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add {entityName}
          </button>
        )}
      </div>

      {/* Show Create Form or Data Table */}
      {showCreateForm === entityName ? (
        renderCreateForm()
      ) : (
        /* Data Table */
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                {displayFields.map((field) => (
                  <th
                    key={field.name}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      field.type === "textarea" ? "w-80" : "w-40"
                    }`}
                  >
                    {field.name}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sampleData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {displayFields.map((field) => (
                    <td
                      key={field.name}
                      className={`px-6 py-4 text-sm text-gray-900 ${
                        field.type === "textarea"
                          ? "max-w-xs break-words"
                          : field.type === "text" &&
                            field.name.toLowerCase().includes("description")
                          ? "max-w-xs break-words"
                          : "whitespace-nowrap"
                      }`}
                    >
                      <div
                        className={
                          field.type === "textarea" ||
                          (field.type === "text" &&
                            field.name.toLowerCase().includes("description"))
                            ? "line-clamp-3 overflow-hidden"
                            : ""
                        }
                      >
                        {String(item[field.name] || "-")}
                      </div>
                    </td>
                  ))}
                  <td className="px-6 py-4 text-sm text-gray-500 w-48">
                    {(() => {
                      const entityFeature = roleFeatures.find(
                        (f) =>
                          getFeatureName(f)
                            .toLowerCase()
                            .includes(
                              entityName.toLowerCase() + "-management"
                            ) ||
                          getFeatureName(f)
                            .toLowerCase()
                            .includes("manage-" + entityName.toLowerCase()) ||
                          getFeatureName(f)
                            .toLowerCase()
                            .includes(entityName.toLowerCase())
                      );
                      const permission = entityFeature
                        ? getFeaturePermission(entityFeature, selectedRole)
                        : "none";

                      // Find relationship features that could apply to this entity
                      const relationshipFeatures = roleFeatures.filter(
                        (feature) =>
                          typeof feature !== "string" &&
                          feature.category === "relationship"
                      );

                      return (
                        <div className="flex flex-wrap items-center gap-2">
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

                          {/* Add relationship action buttons - using new showInEntityLists property */}
                          {relationshipFeatures.map(
                            (relFeature, relIndex) => {
                              const relPermission = getFeaturePermission(
                                relFeature,
                                selectedRole
                              );
                              if (relPermission === "none") return null;

                              // Use the new showInEntityLists property to determine if this button should appear
                              const shouldShowInThisList =
                                typeof relFeature !== "string" &&
                                relFeature.showInEntityLists &&
                                relFeature.showInEntityLists.includes(
                                  entityName
                                );

                              if (!shouldShowInThisList) return null;

                              const actionName = getFeatureName(relFeature);

                              return (
                                <button
                                  key={relIndex}
                                  onClick={() => {
                                    setShowRelationshipView(relFeature);
                                    navigateToView(
                                      `${actionName} Management`
                                    );
                                  }}
                                  className="text-purple-600 hover:text-purple-800 text-sm bg-purple-50 px-2 py-1 rounded"
                                >
                                  {actionName}
                                </button>
                              );
                            }
                          )}

                          {permission === "none" &&
                            relationshipFeatures.length === 0 && (
                              <span className="text-gray-400 text-xs">
                                No access
                              </span>
                            )}
                        </div>
                      );
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}