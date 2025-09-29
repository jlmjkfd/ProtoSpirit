import { useState } from "react";
import type { ExtractedRequirements } from "../../types";

interface RequirementsReviewProps {
  requirements: ExtractedRequirements;
  onConfirm: (requirements: ExtractedRequirements) => void;
  onBack: () => void;
  isLoading: boolean;
}

export function RequirementsReview({
  requirements,
  onConfirm,
  onBack,
  isLoading,
}: RequirementsReviewProps) {
  const [editedRequirements, setEditedRequirements] =
    useState<ExtractedRequirements>(requirements);
  const [activeTab, setActiveTab] = useState<"entities" | "roles" | "features">(
    "entities"
  );
  const [editingEntityIndex, setEditingEntityIndex] = useState<number | null>(
    null
  );
  const [editingRoleIndex, setEditingRoleIndex] = useState<number | null>(null);

  const handleAppNameChange = (appName: string) => {
    setEditedRequirements((prev) => ({ ...prev, appName }));
  };

  const handleEntityChange = (index: number, field: string, value: any) => {
    setEditedRequirements((prev) => ({
      ...prev,
      entities: prev.entities.map((entity, i) =>
        i === index ? { ...entity, [field]: value } : entity
      ),
    }));
  };

  const handleEntityFieldChange = (
    entityIndex: number,
    fieldIndex: number,
    field: string,
    value: any
  ) => {
    setEditedRequirements((prev) => ({
      ...prev,
      entities: prev.entities.map((entity, i) =>
        i === entityIndex
          ? {
              ...entity,
              fields: entity.fields.map((f, j) =>
                j === fieldIndex ? { ...f, [field]: value } : f
              ),
            }
          : entity
      ),
    }));
  };

  const addEntityField = (entityIndex: number) => {
    setEditedRequirements((prev) => ({
      ...prev,
      entities: prev.entities.map((entity, i) =>
        i === entityIndex
          ? {
              ...entity,
              fields: [
                ...entity.fields,
                { name: "", type: "text", required: true },
              ],
            }
          : entity
      ),
    }));
  };

  const removeEntityField = (entityIndex: number, fieldIndex: number) => {
    setEditedRequirements((prev) => ({
      ...prev,
      entities: prev.entities.map((entity, i) =>
        i === entityIndex
          ? {
              ...entity,
              fields: entity.fields.filter((_, j) => j !== fieldIndex),
            }
          : entity
      ),
    }));
  };

  const addEntity = () => {
    setEditedRequirements((prev) => ({
      ...prev,
      entities: [
        ...prev.entities,
        {
          name: "",
          fields: [{ name: "name", type: "text", required: true }],
          relationships: [],
          examples: [],
        },
      ],
    }));
  };

  const removeEntity = (index: number) => {
    setEditedRequirements((prev) => ({
      ...prev,
      entities: prev.entities.filter((_, i) => i !== index),
    }));
  };

  const handleRoleChange = (index: number, field: string, value: string) => {
    setEditedRequirements((prev) => ({
      ...prev,
      roles: prev.roles.map((role, i) =>
        i === index ? { ...role, [field]: value } : role
      ),
    }));
  };

  const addRoleFeature = (roleIndex: number, featureName: string) => {
    setEditedRequirements((prev) => ({
      ...prev,
      roles: prev.roles.map((role, i) =>
        i === roleIndex
          ? { ...role, features: [...role.features, featureName] }
          : role
      ),
    }));
  };

  const removeRoleFeature = (roleIndex: number, featureIndex: number) => {
    setEditedRequirements((prev) => ({
      ...prev,
      roles: prev.roles.map((role, i) =>
        i === roleIndex
          ? {
              ...role,
              features: role.features.filter((_, j) => j !== featureIndex),
            }
          : role
      ),
    }));
  };

  const addRole = () => {
    setEditedRequirements((prev) => ({
      ...prev,
      roles: [...prev.roles, { name: "", description: "", features: [] }],
    }));
  };

  const removeRole = (index: number) => {
    setEditedRequirements((prev) => ({
      ...prev,
      roles: prev.roles.filter((_, i) => i !== index),
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setEditedRequirements((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) =>
        i === index
          ? typeof feature === "string"
            ? {
                id: `feature_${Date.now()}`,
                name: value,
                description: "",
                category: "entity" as const,
                permissions: [],
              }
            : { ...feature, name: value }
          : feature
      ),
    }));
  };

  const addFeature = () => {
    setEditedRequirements((prev) => ({
      ...prev,
      features: [
        ...prev.features,
        {
          id: `feature_${Date.now()}`,
          name: "",
          description: "",
          category: "entity" as const,
          permissions: [],
        },
      ],
    }));
  };

  const removeFeature = (index: number) => {
    const featureToRemove = editedRequirements.features[index];
    const featureName =
      typeof featureToRemove === "string"
        ? featureToRemove
        : featureToRemove.name;
    setEditedRequirements((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
      roles: prev.roles.map((role) => ({
        ...role,
        features: role.features.filter((f) => f !== featureName),
      })),
    }));
  };

  const getAvailableFeatures = (roleIndex: number) => {
    const currentRole = editedRequirements.roles[roleIndex];
    return editedRequirements.features.filter((feature) => {
      const featureName = typeof feature === "string" ? feature : feature.name;
      return !currentRole.features.includes(featureName);
    });
  };

  const handleConfirm = () => {
    onConfirm(editedRequirements);
  };

  const fieldTypes = ["text", "email", "number", "date", "boolean", "textarea"];

  return (
    <div
      className="p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setEditingEntityIndex(null);
          setEditingRoleIndex(null);
        }
      }}
    >
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          Review & Edit Requirements
        </h3>
        <p className="text-gray-600">
          Our AI has extracted the following requirements from your description.
          Review and edit them as needed before generating your app.
        </p>
      </div>

      {/* App Name */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          App Name
        </label>
        <input
          type="text"
          value={editedRequirements.appName}
          onChange={(e) => handleAppNameChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter app name"
        />
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          {["entities", "roles", "features"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as any);
                setEditingEntityIndex(null);
                setEditingRoleIndex(null);
              }}
              className={`border-b-2 px-1 py-3 text-sm font-medium whitespace-nowrap capitalize ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab === "entities" &&
                `Data Entities (${editedRequirements.entities.length})`}
              {tab === "roles" &&
                `User Roles (${editedRequirements.roles.length})`}
              {tab === "features" &&
                `Features (${editedRequirements.features.length})`}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        {/* Entities Tab */}
        {activeTab === "entities" && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setEditingEntityIndex(null);
                setEditingRoleIndex(null);
              }
            }}
          >
            <div
              className="mb-6 flex items-center justify-between"
              onClick={() => {
                setEditingEntityIndex(null);
                setEditingRoleIndex(null);
              }}
            >
              <h4 className="text-lg font-medium text-gray-900">
                Data Entities
              </h4>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  addEntity();
                }}
                className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Add Entity
              </button>
            </div>

            <div className="space-y-3">
              {editedRequirements.entities.map((entity, entityIndex) => (
                <div
                  key={entityIndex}
                  className={`cursor-pointer rounded-lg border p-3 transition-all ${
                    editingEntityIndex === entityIndex
                      ? "border-blue-300 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingEntityIndex(entityIndex);
                    setEditingRoleIndex(null);
                  }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <input
                      type="text"
                      value={entity.name}
                      onChange={(e) =>
                        handleEntityChange(entityIndex, "name", e.target.value)
                      }
                      className="text-md rounded border border-gray-300 bg-white px-2 py-1 text-sm font-medium"
                      placeholder="Entity name"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeEntity(entityIndex);
                        setEditingEntityIndex(null);
                      }}
                      className="px-2 text-xs text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h6 className="text-xs font-medium text-gray-600">
                        Fields:
                      </h6>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addEntityField(entityIndex);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        + Add Field
                      </button>
                    </div>
                    {entity.fields.map((field, fieldIndex) => (
                      <div
                        key={fieldIndex}
                        className="flex items-center gap-2 text-xs"
                      >
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) =>
                            handleEntityFieldChange(
                              entityIndex,
                              fieldIndex,
                              "name",
                              e.target.value
                            )
                          }
                          className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs"
                          placeholder="Field name"
                        />
                        <select
                          value={field.type}
                          onChange={(e) =>
                            handleEntityFieldChange(
                              entityIndex,
                              fieldIndex,
                              "type",
                              e.target.value
                            )
                          }
                          className="rounded border border-gray-300 px-2 py-1 text-xs"
                        >
                          {fieldTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        <label className="flex items-center text-xs">
                          <input
                            type="checkbox"
                            checked={field.required !== false}
                            onChange={(e) =>
                              handleEntityFieldChange(
                                entityIndex,
                                fieldIndex,
                                "required",
                                e.target.checked
                              )
                            }
                            className="mr-1 scale-75"
                          />
                          Req
                        </label>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeEntityField(entityIndex, fieldIndex);
                          }}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {editedRequirements.entities.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                  <div className="mb-4 text-gray-400">
                    <svg
                      className="mx-auto h-12 w-12"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p>No entities defined. Add an entity to get started.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Roles Tab */}
        {activeTab === "roles" && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setEditingEntityIndex(null);
                setEditingRoleIndex(null);
              }
            }}
          >
            <div
              className="mb-6 flex items-center justify-between"
              onClick={() => {
                setEditingEntityIndex(null);
                setEditingRoleIndex(null);
              }}
            >
              <h4 className="text-lg font-medium text-gray-900">User Roles</h4>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  addRole();
                }}
                className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Add Role
              </button>
            </div>

            <div className="space-y-3">
              {editedRequirements.roles.map((role, roleIndex) => (
                <div
                  key={roleIndex}
                  className={`cursor-pointer rounded-lg border p-3 transition-all ${
                    editingRoleIndex === roleIndex
                      ? "border-green-300 bg-green-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingRoleIndex(roleIndex);
                    setEditingEntityIndex(null);
                  }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h6 className="text-sm font-medium text-gray-900">
                      Role {roleIndex + 1}
                    </h6>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRole(roleIndex);
                        setEditingRoleIndex(null);
                      }}
                      className="px-2 text-xs text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Role Name
                      </label>
                      <input
                        type="text"
                        value={role.name}
                        onChange={(e) =>
                          handleRoleChange(roleIndex, "name", e.target.value)
                        }
                        className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                        placeholder="Role name (e.g., Admin, User, Viewer)"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Description
                      </label>
                      <textarea
                        value={role.description}
                        onChange={(e) =>
                          handleRoleChange(
                            roleIndex,
                            "description",
                            e.target.value
                          )
                        }
                        className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs"
                        placeholder="Brief description of this role's purpose"
                        rows={2}
                      />
                    </div>

                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <label className="block text-xs font-medium text-gray-600">
                          Features
                        </label>
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              addRoleFeature(roleIndex, e.target.value);
                              e.target.value = "";
                            }
                          }}
                          className="rounded border border-gray-300 px-2 py-1 text-xs"
                        >
                          <option value="">Add Feature...</option>
                          {getAvailableFeatures(roleIndex).map(
                            (feature, index) => {
                              const featureName =
                                typeof feature === "string"
                                  ? feature
                                  : feature.name;
                              return (
                                <option key={index} value={featureName}>
                                  {featureName}
                                </option>
                              );
                            }
                          )}
                        </select>
                      </div>
                      <div className="space-y-1">
                        {role.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-center gap-2 rounded bg-gray-50 px-2 py-1"
                          >
                            <span className="flex-1 text-xs text-gray-700">
                              {feature}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeRoleFeature(roleIndex, featureIndex);
                              }}
                              className="text-xs text-red-600 hover:text-red-800"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        {role.features.length === 0 && (
                          <div className="text-xs text-gray-400 italic">
                            No features assigned
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {editedRequirements.roles.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                  <div className="mb-4 text-gray-400">
                    <svg
                      className="mx-auto h-12 w-12"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p>No roles defined. Add a role to get started.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === "features" && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setEditingEntityIndex(null);
                setEditingRoleIndex(null);
              }
            }}
          >
            <div
              className="mb-6 flex items-center justify-between"
              onClick={() => {
                setEditingEntityIndex(null);
                setEditingRoleIndex(null);
              }}
            >
              <h4 className="text-lg font-medium text-gray-900">Features</h4>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  addFeature();
                }}
                className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Add Feature
              </button>
            </div>

            <div className="space-y-2">
              {editedRequirements.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded bg-gray-50 p-2"
                >
                  <input
                    type="text"
                    value={typeof feature === "string" ? feature : feature.name}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm"
                    placeholder="Feature description"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="px-2 text-xs text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}

              {editedRequirements.features.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                  <div className="mb-4 text-gray-400">
                    <svg
                      className="mx-auto h-12 w-12"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p>No features defined. Add a feature to get started.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Back to Description
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={isLoading}
          className="rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg
                className="mr-3 -ml-1 h-5 w-5 animate-spin text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating Project...
            </div>
          ) : (
            "Create Project"
          )}
        </button>
      </div>
    </div>
  );
}
