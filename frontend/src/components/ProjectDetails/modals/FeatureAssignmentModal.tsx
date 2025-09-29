import type { Role, Feature } from "../../../types";
import { PermissionToggle } from "./PermissionToggle";

interface FeatureAssignmentModalProps {
  features: Feature[];
  roles: Role[];
  onUpdatePermission: (
    roleName: string,
    featureId: string,
    permission: "none" | "read" | "full"
  ) => void;
  onClose: () => void;
}

export function FeatureAssignmentModal({
  features,
  roles,
  onUpdatePermission,
  onClose,
}: FeatureAssignmentModalProps) {
  // Get permission level for a specific role and feature
  const getPermission = (
    role: Role,
    feature: Feature
  ): "none" | "read" | "full" => {
    // Handle legacy string features in role.features array
    if (typeof feature === "string") {
      return role.features?.includes(feature) ? "full" : "none";
    }

    // For new feature objects, check the permissions array
    const permission = feature.permissions?.find((p) => p.role === role.name);
    if (!permission) return "none";

    if (permission.actions.includes("full")) return "full";
    if (permission.actions.includes("read")) return "read";
    return "none";
  };

  // Get feature name for display
  const getFeatureName = (feature: Feature): string => {
    return typeof feature === "string" ? feature : feature.name;
  };

  // Get feature ID for updates
  const getFeatureId = (feature: Feature): string => {
    return typeof feature === "string" ? feature : feature.id;
  };
  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="max-h-[95vh] w-full max-w-6xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-3 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">📊</span>
              <div>
                <h2 className="text-lg font-semibold">
                  Feature Permission Matrix
                </h2>
                <p className="text-sm text-indigo-100">
                  Click toggles to set None/Read/Full permissions for each role
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
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

        {/* Modal Body */}
        <div className="max-h-[calc(95vh-7rem)] overflow-y-auto p-4">
          {roles.length > 0 && features.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-10 min-w-[120px] border-b border-gray-200 bg-gray-50 px-2 py-2 text-left font-medium text-gray-700">
                      Feature
                    </th>
                    {roles.map((role) => (
                      <th
                        key={role.name}
                        className="min-w-[80px] border-b border-gray-200 bg-gray-50 px-2 py-2 text-center font-medium text-gray-700"
                      >
                        <div className="truncate" title={role.name}>
                          {role.name}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, index) => {
                    const featureName = getFeatureName(feature);
                    const featureId = getFeatureId(feature);

                    return (
                      <tr
                        key={featureId}
                        className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}`}
                      >
                        <td className="sticky left-0 z-10 border-b border-gray-100 bg-white px-2 py-2 font-medium text-gray-900">
                          <div className="flex flex-col">
                            <div
                              className="truncate font-medium"
                              title={featureName}
                            >
                              {featureName}
                            </div>
                            {typeof feature !== "string" &&
                              feature.category && (
                                <span
                                  className={`mt-1 inline-block w-fit rounded-full px-1.5 py-0.5 text-xs ${
                                    feature.category === "entity"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-purple-100 text-purple-700"
                                  }`}
                                >
                                  {feature.category}
                                </span>
                              )}
                          </div>
                        </td>
                        {roles.map((role) => (
                          <td
                            key={`${featureId}-${role.name}`}
                            className="border-b border-gray-100 px-2 py-2 text-center"
                          >
                            <div className="flex justify-center">
                              <PermissionToggle
                                value={getPermission(role, feature)}
                                onChange={(permission) =>
                                  onUpdatePermission(
                                    role.name,
                                    featureId,
                                    permission
                                  )
                                }
                                size="sm"
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="mb-4 text-gray-400">📊</div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No Data to Display
              </h3>
              <p className="text-gray-600">
                {roles.length === 0 && features.length === 0
                  ? "Add some roles and features to see the assignment matrix."
                  : roles.length === 0
                    ? "Add some roles to see feature assignments."
                    : "Add some features to see role assignments."}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-xs text-gray-600">
                {features.length} features × {roles.length} roles
              </div>

              {/* Permission Legend */}
              <div className="flex items-center space-x-4 text-xs">
                <span className="text-gray-500">Legend:</span>
                <div className="flex items-center space-x-1">
                  <div className="flex h-4 w-4 items-center justify-center rounded border border-gray-200 bg-gray-100 text-xs text-gray-400">
                    ✕
                  </div>
                  <span className="text-gray-600">None</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="flex h-4 w-4 items-center justify-center rounded border border-blue-200 bg-blue-100 text-xs text-blue-600">
                    👁
                  </div>
                  <span className="text-gray-600">Read</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="flex h-4 w-4 items-center justify-center rounded border border-green-200 bg-green-100 text-xs text-green-600">
                    ✓
                  </div>
                  <span className="text-gray-600">Full</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded bg-indigo-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
