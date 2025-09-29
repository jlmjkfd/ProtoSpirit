import { useState } from "react";
import type { Role, Feature } from "../../../types";

interface RoleEditModalProps {
  role: Role;
  features: Feature[];
  onSave: (role: Role) => void;
  onClose: () => void;
}

export function RoleEditModal({
  role,
  features,
  onSave,
  onClose,
}: RoleEditModalProps) {
  const [formData, setFormData] = useState({
    name: role.name,
    description: role.description,
    features: [...(role.features || [])],
  });

  const handleSave = () => {
    const updatedRole: Role = {
      name: formData.name,
      description: formData.description,
      features: formData.features,
    };
    onSave(updatedRole);
    onClose();
  };

  const toggleFeature = (featureName: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(featureName)
        ? prev.features.filter((f) => f !== featureName)
        : [...prev.features, featureName],
    }));
  };

  // Get permission level for a feature
  const getFeaturePermission = (feature: Feature): "full" | "read" | "none" => {
    if (typeof feature === "string") {
      return formData.features.includes(feature) ? "full" : "none";
    }

    const permission = feature.permissions?.find((p) => p.role === role.name);
    if (!permission) return "none";

    if (permission.actions.includes("full")) return "full";
    if (permission.actions.includes("read")) return "read";
    return "none";
  };

  // Update permission level for a feature
  const updateFeaturePermission = (
    feature: Feature,
    level: "full" | "read" | "none"
  ) => {
    // For legacy string features, use the old checkbox behavior
    if (typeof feature === "string") {
      toggleFeature(feature);
      return;
    }

    // For new feature objects, we need to update the feature's permission in the project
    // This would need to be handled by the parent component
    // For now, we'll just update the role's features array for backward compatibility
    const featureName = feature.name;

    if (level === "none") {
      setFormData((prev) => ({
        ...prev,
        features: prev.features.filter((f) => f !== featureName),
      }));
    } else {
      if (!formData.features.includes(featureName)) {
        setFormData((prev) => ({
          ...prev,
          features: [...prev.features, featureName],
        }));
      }
    }
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="max-h-[95vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">👤</span>
              <div>
                <h2 className="text-lg font-semibold">Edit Role</h2>
                <p className="text-sm text-green-100">{role.name}</p>
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
        <div className="max-h-[calc(95vh-7rem)] overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Side - Basic Information */}
            <div className="lg:col-span-1">
              <div className="flex h-full flex-col rounded-lg bg-gray-50 p-4">
                <h3 className="text-md mb-4 font-medium text-gray-900">
                  Role Information
                </h3>
                <div className="flex flex-1 flex-col space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Role Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:ring-1 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Role description..."
                      className="min-h-24 w-full flex-1 resize-none rounded border border-gray-300 px-2 py-1.5 text-sm focus:ring-1 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Features */}
            <div className="lg:col-span-1">
              <div className="h-full rounded-lg bg-gray-50 p-4">
                <h3 className="text-md mb-4 font-medium text-gray-900">
                  Feature Permissions
                </h3>
                <div className="max-h-64 overflow-y-auto">
                  <div className="space-y-3">
                    {features.map((feature) => {
                      const currentPermission = getFeaturePermission(feature);
                      const featureName =
                        typeof feature === "string" ? feature : feature.name;

                      return (
                        <div
                          key={feature.id || featureName}
                          className="flex items-center justify-between rounded border border-gray-200 bg-white p-3"
                        >
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {featureName}
                            </div>
                            {typeof feature !== "string" &&
                              feature.description && (
                                <div className="mt-1 text-xs text-gray-500">
                                  {feature.description}
                                </div>
                              )}
                            {typeof feature !== "string" &&
                              feature.category && (
                                <span
                                  className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${
                                    feature.category === "entity"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-purple-100 text-purple-800"
                                  }`}
                                >
                                  {feature.category}
                                </span>
                              )}
                          </div>

                          <select
                            value={currentPermission}
                            onChange={(e) =>
                              updateFeaturePermission(
                                feature,
                                e.target.value as "full" | "read" | "none"
                              )
                            }
                            className="ml-4 rounded border border-gray-300 px-3 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                          >
                            <option value="none" className="text-gray-500">
                              No Access
                            </option>
                            <option value="read" className="text-blue-600">
                              Read Only
                            </option>
                            <option value="full" className="text-green-600">
                              Full Access
                            </option>
                          </select>
                        </div>
                      );
                    })}
                  </div>
                  {features.length === 0 && (
                    <div className="py-6 text-center text-sm text-gray-500">
                      No features available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-2 border-t border-gray-200 bg-gray-50 px-4 py-3">
          <button
            onClick={onClose}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded bg-green-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
