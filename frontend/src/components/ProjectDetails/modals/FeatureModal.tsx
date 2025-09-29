import { useState } from "react";
import type { Feature, Entity, Role } from "../../../types";

interface FeatureModalProps {
  feature: Feature;
  onSave: (feature: Feature) => void;
  onClose: () => void;
  entities: Entity[];
  roles: Role[];
  isNew?: boolean;
}

export function FeatureModal({
  feature,
  onSave,
  onClose,
  entities,
  roles,
  isNew = false,
}: FeatureModalProps) {
  const [formData, setFormData] = useState({
    name: feature.name,
    description: feature.description || "",
    category: feature.category,
    entityTarget: feature.entityTarget || "",
    relationshipTarget: feature.relationshipTarget || "",
    relatedEntities: feature.relatedEntities || [],
    showInEntityLists: feature.showInEntityLists || [],
    permissions: feature.permissions || [],
  });

  const handleSave = () => {
    if (formData.name.trim()) {
      const updatedFeature: Feature = {
        id: feature.id,
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        permissions: formData.permissions,
      };

      if (formData.category === "entity" && formData.entityTarget) {
        updatedFeature.entityTarget = formData.entityTarget;
      }

      if (formData.category === "relationship") {
        if (formData.relatedEntities.length >= 2) {
          updatedFeature.relatedEntities = formData.relatedEntities;
        }
        if (formData.showInEntityLists.length > 0) {
          updatedFeature.showInEntityLists = formData.showInEntityLists;
        }
      }

      onSave(updatedFeature);
      onClose();
    }
  };

  const modalTitle = isNew ? "Add New Feature" : "Edit Feature";
  const modalSubtitle = isNew ? "Create a new system feature" : `Modify ${feature.name} settings`;
  const saveButtonText = isNew ? "Add Feature" : "Save Changes";
  const headerColorClass = isNew ? "from-purple-600 to-purple-700" : "from-blue-600 to-blue-700";
  const accentColorClass = isNew ? "purple" : "blue";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[95vh] overflow-hidden">
        {/* Modal Header */}
        <div className={`bg-gradient-to-r ${headerColorClass} text-white px-4 py-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">⚡</span>
              <div>
                <h2 className="text-lg font-semibold">{modalTitle}</h2>
                <p className={`text-${accentColorClass}-100 text-sm`}>
                  {modalSubtitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-md p-1 transition-colors"
            >
              <svg
                className="w-5 h-5"
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
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-7rem)]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Feature Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter feature name..."
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-${accentColorClass}-500`}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
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
                    placeholder="Feature description..."
                    className={`w-full h-20 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-${accentColorClass}-500 resize-none`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const category = e.target.value as
                        | "entity"
                        | "relationship";
                      setFormData((prev) => ({
                        ...prev,
                        category,
                        entityTarget: "",
                        relatedEntities: [],
                        showInEntityLists: [],
                      }));
                    }}
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-${accentColorClass}-500`}
                    required
                  >
                    <option value="entity">Entity Feature</option>
                    <option value="relationship">Relationship Feature</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Entity-specific settings */}
            {formData.category === "entity" && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-900 mb-4">
                  Entity Settings
                </h3>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Target Entity
                  </label>
                  <select
                    value={formData.entityTarget}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        entityTarget: e.target.value,
                      }))
                    }
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-${accentColorClass}-500`}
                  >
                    <option value="">Select target entity...</option>
                    {entities.map((entity) => (
                      <option key={entity.name} value={entity.name}>
                        {entity.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Which entity this feature primarily manages
                  </p>
                </div>
              </div>
            )}

            {/* Relationship-specific settings */}
            {formData.category === "relationship" && (
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-900 mb-4">
                  Relationship Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Related Entities *
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-3 bg-white shadow-sm">
                      {entities.map((entity) => (
                        <label
                          key={entity.name}
                          className="flex items-center space-x-2 py-1 border-b border-gray-100 last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            checked={formData.relatedEntities.includes(
                              entity.name
                            )}
                            disabled={!formData.relatedEntities.includes(entity.name) && formData.relatedEntities.length >= 2}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFormData((prev) => {
                                let newRelatedEntities;
                                if (checked) {
                                  // Only allow selection if less than 2 entities are selected
                                  if (prev.relatedEntities.length < 2) {
                                    newRelatedEntities = [...prev.relatedEntities, entity.name];
                                  } else {
                                    // Prevent selection if already 2 entities selected
                                    return prev;
                                  }
                                } else {
                                  newRelatedEntities = prev.relatedEntities.filter(
                                    (name) => name !== entity.name
                                  );
                                }

                                // Update showInEntityLists to only include entities that are in relatedEntities
                                const newShowInEntityLists = prev.showInEntityLists.filter(
                                  (name) => newRelatedEntities.includes(name)
                                );

                                return {
                                  ...prev,
                                  relatedEntities: newRelatedEntities,
                                  showInEntityLists: newShowInEntityLists,
                                };
                              });
                            }}
                            className={`h-4 w-4 text-${accentColorClass}-600 focus:ring-${accentColorClass}-500 border-gray-300 rounded`}
                          />
                          <span className="text-sm text-gray-700">
                            {entity.name}
                          </span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Select exactly 2 entities for this relationship ({formData.relatedEntities.length}/2 selected)
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Show in Entity Lists
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-3 bg-white shadow-sm">
                      {formData.relatedEntities.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">
                          Select related entities first to choose which entity lists should show this relationship button
                        </p>
                      ) : (
                        entities.filter(entity => formData.relatedEntities.includes(entity.name)).map((entity) => (
                          <label
                            key={entity.name}
                            className="flex items-center space-x-2 py-1 border-b border-gray-100 last:border-b-0"
                          >
                            <input
                              type="checkbox"
                              checked={formData.showInEntityLists.includes(
                                entity.name
                              )}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setFormData((prev) => ({
                                  ...prev,
                                  showInEntityLists: checked
                                    ? [...prev.showInEntityLists, entity.name]
                                    : prev.showInEntityLists.filter(
                                        (name) => name !== entity.name
                                      ),
                                }));
                              }}
                              className={`h-4 w-4 text-${accentColorClass}-600 focus:ring-${accentColorClass}-500 border-gray-300 rounded`}
                            />
                            <span className="text-sm text-gray-700">
                              {entity.name}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Which entity lists should show this relationship button (only selected related entities available)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Permissions */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-900 mb-4">
                Role Permissions
              </h3>
              <div className="space-y-3 border border-gray-300 rounded-md p-3 bg-white shadow-sm max-h-40 overflow-y-auto">
                {roles.map((role) => {
                  const rolePermission = formData.permissions.find(
                    (p) => p.role === role.name
                  );
                  return (
                    <div
                      key={role.name}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200 last:mb-0"
                    >
                      <div>
                        <span className="font-medium text-sm">{role.name}</span>
                        <p className="text-xs text-gray-500">
                          {role.description}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <label className="flex items-center space-x-1">
                          <input
                            type="checkbox"
                            checked={
                              rolePermission?.actions.includes("read") || false
                            }
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFormData((prev) => {
                                const permissions = prev.permissions.filter(
                                  (p) => p.role !== role.name
                                );
                                if (
                                  checked ||
                                  rolePermission?.actions.includes("full")
                                ) {
                                  const actions: ("read" | "full")[] = ["read"];
                                  if (
                                    rolePermission?.actions.includes("full")
                                  ) {
                                    actions.push("full");
                                  }
                                  permissions.push({
                                    role: role.name,
                                    actions,
                                  });
                                }
                                return { ...prev, permissions };
                              });
                            }}
                            className={`h-4 w-4 text-${accentColorClass}-600 focus:ring-${accentColorClass}-500 border-gray-300 rounded`}
                          />
                          <span className="text-xs">Read</span>
                        </label>
                        <label className="flex items-center space-x-1">
                          <input
                            type="checkbox"
                            checked={
                              rolePermission?.actions.includes("full") || false
                            }
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFormData((prev) => {
                                const permissions = prev.permissions.filter(
                                  (p) => p.role !== role.name
                                );
                                if (checked) {
                                  permissions.push({
                                    role: role.name,
                                    actions: ["read", "full"],
                                  });
                                } else if (
                                  rolePermission?.actions.includes("read")
                                ) {
                                  permissions.push({
                                    role: role.name,
                                    actions: ["read"],
                                  });
                                }
                                return { ...prev, permissions };
                              });
                            }}
                            className={`h-4 w-4 text-${accentColorClass}-600 focus:ring-${accentColorClass}-500 border-gray-300 rounded`}
                          />
                          <span className="text-xs">Full</span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Set which roles can access this feature and their permission
                levels
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-2 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={
              !formData.name.trim() ||
              (formData.category === "relationship" &&
                formData.relatedEntities.length !== 2)
            }
            className={`px-3 py-1.5 text-sm bg-${accentColorClass}-600 text-white rounded hover:bg-${accentColorClass}-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {saveButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}