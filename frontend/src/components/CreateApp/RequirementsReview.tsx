import { useState } from 'react';
import type { ExtractedRequirements } from '../../types';

interface RequirementsReviewProps {
  requirements: ExtractedRequirements;
  onConfirm: (requirements: ExtractedRequirements) => void;
  onBack: () => void;
  isLoading: boolean;
}

export function RequirementsReview({ requirements, onConfirm, onBack, isLoading }: RequirementsReviewProps) {
  const [editedRequirements, setEditedRequirements] = useState<ExtractedRequirements>(requirements);
  const [activeTab, setActiveTab] = useState<'entities' | 'roles' | 'features'>('entities');
  const [editingEntityIndex, setEditingEntityIndex] = useState<number | null>(null);
  const [editingRoleIndex, setEditingRoleIndex] = useState<number | null>(null);

  const handleAppNameChange = (appName: string) => {
    setEditedRequirements(prev => ({ ...prev, appName }));
  };

  const handleEntityChange = (index: number, field: string, value: any) => {
    setEditedRequirements(prev => ({
      ...prev,
      entities: prev.entities.map((entity, i) =>
        i === index ? { ...entity, [field]: value } : entity
      )
    }));
  };

  const handleEntityFieldChange = (entityIndex: number, fieldIndex: number, field: string, value: any) => {
    setEditedRequirements(prev => ({
      ...prev,
      entities: prev.entities.map((entity, i) =>
        i === entityIndex
          ? {
              ...entity,
              fields: entity.fields.map((f, j) =>
                j === fieldIndex ? { ...f, [field]: value } : f
              )
            }
          : entity
      )
    }));
  };

  const addEntityField = (entityIndex: number) => {
    setEditedRequirements(prev => ({
      ...prev,
      entities: prev.entities.map((entity, i) =>
        i === entityIndex
          ? {
              ...entity,
              fields: [...entity.fields, { name: '', type: 'text', required: true }]
            }
          : entity
      )
    }));
  };

  const removeEntityField = (entityIndex: number, fieldIndex: number) => {
    setEditedRequirements(prev => ({
      ...prev,
      entities: prev.entities.map((entity, i) =>
        i === entityIndex
          ? {
              ...entity,
              fields: entity.fields.filter((_, j) => j !== fieldIndex)
            }
          : entity
      )
    }));
  };

  const addEntity = () => {
    setEditedRequirements(prev => ({
      ...prev,
      entities: [...prev.entities, {
        name: '',
        fields: [{ name: 'name', type: 'text', required: true }],
        relationships: [],
        examples: []
      }]
    }));
  };

  const removeEntity = (index: number) => {
    setEditedRequirements(prev => ({
      ...prev,
      entities: prev.entities.filter((_, i) => i !== index)
    }));
  };

  const handleRoleChange = (index: number, field: string, value: string) => {
    setEditedRequirements(prev => ({
      ...prev,
      roles: prev.roles.map((role, i) =>
        i === index ? { ...role, [field]: value } : role
      )
    }));
  };


  const addRoleFeature = (roleIndex: number, featureName: string) => {
    setEditedRequirements(prev => ({
      ...prev,
      roles: prev.roles.map((role, i) =>
        i === roleIndex
          ? { ...role, features: [...role.features, featureName] }
          : role
      )
    }));
  };

  const removeRoleFeature = (roleIndex: number, featureIndex: number) => {
    setEditedRequirements(prev => ({
      ...prev,
      roles: prev.roles.map((role, i) =>
        i === roleIndex
          ? { ...role, features: role.features.filter((_, j) => j !== featureIndex) }
          : role
      )
    }));
  };

  const addRole = () => {
    setEditedRequirements(prev => ({
      ...prev,
      roles: [...prev.roles, { name: '', description: '', features: [] }]
    }));
  };

  const removeRole = (index: number) => {
    setEditedRequirements(prev => ({
      ...prev,
      roles: prev.roles.filter((_, i) => i !== index)
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setEditedRequirements(prev => ({
      ...prev,
      features: prev.features.map((feature, i) =>
        i === index
          ? (typeof feature === 'string'
              ? { id: `feature_${Date.now()}`, name: value, description: '', category: 'entity' as const, permissions: [] }
              : { ...feature, name: value })
          : feature
      )
    }));
  };

  const addFeature = () => {
    setEditedRequirements(prev => ({
      ...prev,
      features: [...prev.features, {
        id: `feature_${Date.now()}`,
        name: '',
        description: '',
        category: 'entity' as const,
        permissions: []
      }]
    }));
  };

  const removeFeature = (index: number) => {
    const featureToRemove = editedRequirements.features[index];
    const featureName = typeof featureToRemove === 'string' ? featureToRemove : featureToRemove.name;
    setEditedRequirements(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
      roles: prev.roles.map(role => ({
        ...role,
        features: role.features.filter(f => f !== featureName)
      }))
    }));
  };

  const getAvailableFeatures = (roleIndex: number) => {
    const currentRole = editedRequirements.roles[roleIndex];
    return editedRequirements.features.filter(feature => {
      const featureName = typeof feature === 'string' ? feature : feature.name;
      return !currentRole.features.includes(featureName);
    });
  };

  const handleConfirm = () => {
    onConfirm(editedRequirements);
  };

  const fieldTypes = ['text', 'email', 'number', 'date', 'boolean', 'textarea'];

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
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Review & Edit Requirements
        </h3>
        <p className="text-gray-600">
          Our AI has extracted the following requirements from your description.
          Review and edit them as needed before generating your app.
        </p>
      </div>

      {/* App Name */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          App Name
        </label>
        <input
          type="text"
          value={editedRequirements.appName}
          onChange={(e) => handleAppNameChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter app name"
        />
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {['entities', 'roles', 'features'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as any);
                setEditingEntityIndex(null);
                setEditingRoleIndex(null);
              }}
              className={`py-3 px-1 border-b-2 font-medium text-sm capitalize whitespace-nowrap ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'entities' && `Data Entities (${editedRequirements.entities.length})`}
              {tab === 'roles' && `User Roles (${editedRequirements.roles.length})`}
              {tab === 'features' && `Features (${editedRequirements.features.length})`}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Entities Tab */}
        {activeTab === 'entities' && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setEditingEntityIndex(null);
                setEditingRoleIndex(null);
              }
            }}
          >
            <div
              className="flex justify-between items-center mb-6"
              onClick={() => {
                setEditingEntityIndex(null);
                setEditingRoleIndex(null);
              }}
            >
              <h4 className="text-lg font-medium text-gray-900">Data Entities</h4>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  addEntity();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Entity
              </button>
            </div>

            <div className="space-y-3">
              {editedRequirements.entities.map((entity, entityIndex) => (
                <div
                  key={entityIndex}
                  className={`border rounded-lg p-3 transition-all cursor-pointer ${
                    editingEntityIndex === entityIndex
                      ? 'border-blue-300 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingEntityIndex(entityIndex);
                    setEditingRoleIndex(null);
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <input
                      type="text"
                      value={entity.name}
                      onChange={(e) => handleEntityChange(entityIndex, 'name', e.target.value)}
                      className="text-md font-medium px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                      placeholder="Entity name"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeEntity(entityIndex);
                        setEditingEntityIndex(null);
                      }}
                      className="text-red-600 hover:text-red-800 text-xs px-2"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h6 className="text-xs font-medium text-gray-600">Fields:</h6>
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
                      <div key={fieldIndex} className="flex gap-2 items-center text-xs">
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) => handleEntityFieldChange(entityIndex, fieldIndex, 'name', e.target.value)}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                          placeholder="Field name"
                        />
                        <select
                          value={field.type}
                          onChange={(e) => handleEntityFieldChange(entityIndex, fieldIndex, 'type', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-xs"
                        >
                          {fieldTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        <label className="flex items-center text-xs">
                          <input
                            type="checkbox"
                            checked={field.required !== false}
                            onChange={(e) => handleEntityFieldChange(entityIndex, fieldIndex, 'required', e.target.checked)}
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
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {editedRequirements.entities.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>No entities defined. Add an entity to get started.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Roles Tab */}
        {activeTab === 'roles' && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setEditingEntityIndex(null);
                setEditingRoleIndex(null);
              }
            }}
          >
            <div
              className="flex justify-between items-center mb-6"
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
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Role
              </button>
            </div>

            <div className="space-y-3">
              {editedRequirements.roles.map((role, roleIndex) => (
                <div
                  key={roleIndex}
                  className={`border rounded-lg p-3 transition-all cursor-pointer ${
                    editingRoleIndex === roleIndex
                      ? 'border-green-300 bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingRoleIndex(roleIndex);
                    setEditingEntityIndex(null);
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h6 className="font-medium text-gray-900 text-sm">Role {roleIndex + 1}</h6>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRole(roleIndex);
                        setEditingRoleIndex(null);
                      }}
                      className="text-red-600 hover:text-red-800 text-xs px-2"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Role Name
                      </label>
                      <input
                        type="text"
                        value={role.name}
                        onChange={(e) => handleRoleChange(roleIndex, 'name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                        placeholder="Role name (e.g., Admin, User, Viewer)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Description
                      </label>
                      <textarea
                        value={role.description}
                        onChange={(e) => handleRoleChange(roleIndex, 'description', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white"
                        placeholder="Brief description of this role's purpose"
                        rows={2}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-medium text-gray-600">
                          Features
                        </label>
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              addRoleFeature(roleIndex, e.target.value);
                              e.target.value = '';
                            }
                          }}
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="">Add Feature...</option>
                          {getAvailableFeatures(roleIndex).map((feature, index) => {
                            const featureName = typeof feature === 'string' ? feature : feature.name;
                            return (
                              <option key={index} value={featureName}>{featureName}</option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="space-y-1">
                        {role.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex gap-2 items-center bg-gray-50 rounded px-2 py-1">
                            <span className="flex-1 text-xs text-gray-700">{feature}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeRoleFeature(roleIndex, featureIndex);
                              }}
                              className="text-red-600 hover:text-red-800 text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        {role.features.length === 0 && (
                          <div className="text-xs text-gray-400 italic">No features assigned</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {editedRequirements.roles.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>No roles defined. Add a role to get started.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setEditingEntityIndex(null);
                setEditingRoleIndex(null);
              }
            }}
          >
            <div
              className="flex justify-between items-center mb-6"
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
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Feature
              </button>
            </div>

            <div className="space-y-2">
              {editedRequirements.features.map((feature, index) => (
                <div key={index} className="flex gap-2 items-center bg-gray-50 rounded p-2">
                  <input
                    type="text"
                    value={typeof feature === 'string' ? feature : feature.name}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                    placeholder="Feature description"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-600 hover:text-red-800 text-xs px-2"
                  >
                    ×
                  </button>
                </div>
              ))}

              {editedRequirements.features.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
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
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Back to Description
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={isLoading}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Project...
            </div>
          ) : (
            'Create Project'
          )}
        </button>
      </div>
    </div>
  );
}