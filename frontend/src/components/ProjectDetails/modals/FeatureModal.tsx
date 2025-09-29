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
  const modalSubtitle = isNew
    ? "Create a new system feature"
    : `Modify ${feature.name} settings`;
  const saveButtonText = isNew ? "Add Feature" : "Save Changes";
  const headerColorClass = isNew
    ? "from-purple-600 to-purple-700"
    : "from-blue-600 to-blue-700";
  const accentColorClass = isNew ? "purple" : "blue";

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="max-h-[95vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Modal Header */}
        <div
          className={`bg-gradient-to-r ${headerColorClass} px-4 py-3 text-white`}
        >
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
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="text-md mb-4 font-medium text-gray-900">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Feature Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter feature name..."
                    className={`w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none focus:ring-${accentColorClass}-500`}
                    required
                  />
                </div>
                <div className="md:col-span-2">
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
                    placeholder="Feature description..."
                    className={`h-20 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none focus:ring-${accentColorClass}-500 resize-none`}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
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
                    className={`w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none focus:ring-${accentColorClass}-500`}
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
              <div className="rounded-lg bg-blue-50 p-4">
                <h3 className="text-md mb-4 font-medium text-gray-900">
                  Entity Settings
                </h3>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
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
                    className={`w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none focus:ring-${accentColorClass}-500`}
                  >
                    <option value="">Select target entity...</option>
                    {entities.map((entity) => (
                      <option key={entity.name} value={entity.name}>
                        {entity.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Which entity this feature primarily manages
                  </p>
                </div>
              </div>
            )}

            {/* Relationship-specific settings */}
            {formData.category === "relationship" && (
              <div className="rounded-lg bg-green-50 p-4">
                <h3 className="text-md mb-4 font-medium text-gray-900">
                  Relationship Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-gray-700">
                      Related Entities *
                    </label>
                    <div className="max-h-32 space-y-2 overflow-y-auto rounded-md border border-gray-300 bg-white p-3 shadow-sm">
                      {entities.map((entity) => (
                        <label
                          key={entity.name}
                          className="flex items-center space-x-2 border-b border-gray-100 py-1 last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            checked={formData.relatedEntities.includes(
                              entity.name
                            )}
                            disabled={
                              !formData.relatedEntities.includes(entity.name) &&
                              formData.relatedEntities.length >= 2
                            }
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFormData((prev) => {
                                let newRelatedEntities;
                                if (checked) {
                                  // Only allow selection if less than 2 entities are selected
                                  if (prev.relatedEntities.length < 2) {
                                    newRelatedEntities = [
                                      ...prev.relatedEntities,
                                      entity.name,
                                    ];
                                  } else {
                                    // Prevent selection if already 2 entities selected
                                    return prev;
                                  }
                                } else {
                                  newRelatedEntities =
                                    prev.relatedEntities.filter(
                                      (name) => name !== entity.name
                                    );
                                }

                                // Update showInEntityLists to only include entities that are in relatedEntities
                                const newShowInEntityLists =
                                  prev.showInEntityLists.filter((name) =>
                                    newRelatedEntities.includes(name)
                                  );

                                return {
                                  ...prev,
                                  relatedEntities: newRelatedEntities,
                                  showInEntityLists: newShowInEntityLists,
                                };
                              });
                            }}
                            className={`h-4 w-4 text-${accentColorClass}-600 focus:ring-${accentColorClass}-500 rounded border-gray-300`}
                          />
                          <span className="text-sm text-gray-700">
                            {entity.name}
                          </span>
                        </label>
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Select exactly 2 entities for this relationship (
                      {formData.relatedEntities.length}/2 selected)
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-gray-700">
                      Show in Entity Lists
                    </label>
                    <div className="max-h-32 space-y-2 overflow-y-auto rounded-md border border-gray-300 bg-white p-3 shadow-sm">
                      {formData.relatedEntities.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">
                          Select related entities first to choose which entity
                          lists should show this relationship button
                        </p>
                      ) : (
                        entities
                          .filter((entity) =>
                            formData.relatedEntities.includes(entity.name)
                          )
                          .map((entity) => (
                            <label
                              key={entity.name}
                              className="flex items-center space-x-2 border-b border-gray-100 py-1 last:border-b-0"
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
                                className={`h-4 w-4 text-${accentColorClass}-600 focus:ring-${accentColorClass}-500 rounded border-gray-300`}
                              />
                              <span className="text-sm text-gray-700">
                                {entity.name}
                              </span>
                            </label>
                          ))
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Which entity lists should show this relationship button
                      (only selected related entities available)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Permissions */}
            <div className="rounded-lg bg-yellow-50 p-4">
              <h3 className="text-md mb-4 font-medium text-gray-900">
                Role Permissions
              </h3>
              <div className="max-h-40 space-y-3 overflow-y-auto rounded-md border border-gray-300 bg-white p-3 shadow-sm">
                {roles.map((role) => {
                  const rolePermission = formData.permissions.find(
                    (p) => p.role === role.name
                  );
                  return (
                    <div
                      key={role.name}
                      className="flex items-center justify-between rounded border border-gray-200 bg-gray-50 p-3 last:mb-0"
                    >
                      <div>
                        <span className="text-sm font-medium">{role.name}</span>
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
                            className={`h-4 w-4 text-${accentColorClass}-600 focus:ring-${accentColorClass}-500 rounded border-gray-300`}
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
                            className={`h-4 w-4 text-${accentColorClass}-600 focus:ring-${accentColorClass}-500 rounded border-gray-300`}
                          />
                          <span className="text-xs">Full</span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Set which roles can access this feature and their permission
                levels
              </p>
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
            disabled={
              !formData.name.trim() ||
              (formData.category === "relationship" &&
                formData.relatedEntities.length !== 2)
            }
            className={`px-3 py-1.5 text-sm bg-${accentColorClass}-600 rounded text-white hover:bg-${accentColorClass}-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {saveButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
