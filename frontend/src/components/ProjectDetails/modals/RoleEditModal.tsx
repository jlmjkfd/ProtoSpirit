import { useState } from 'react';
import type { Role, Feature } from '../../../types';

interface RoleEditModalProps {
  role: Role;
  features: Feature[];
  onSave: (role: Role) => void;
  onClose: () => void;
}

export function RoleEditModal({ role, features, onSave, onClose }: RoleEditModalProps) {
  const [formData, setFormData] = useState({
    name: role.name,
    description: role.description,
    features: [...(role.features || [])]
  });

  const handleSave = () => {
    const updatedRole: Role = {
      name: formData.name,
      description: formData.description,
      features: formData.features
    };
    onSave(updatedRole);
    onClose();
  };

  const toggleFeature = (featureName: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureName)
        ? prev.features.filter(f => f !== featureName)
        : [...prev.features, featureName]
    }));
  };

  // Get permission level for a feature
  const getFeaturePermission = (feature: Feature): 'full' | 'read' | 'none' => {
    if (typeof feature === 'string') {
      return formData.features.includes(feature) ? 'full' : 'none';
    }

    const permission = feature.permissions?.find(p => p.role === role.name);
    if (!permission) return 'none';

    if (permission.actions.includes('full')) return 'full';
    if (permission.actions.includes('read')) return 'read';
    return 'none';
  };

  // Update permission level for a feature
  const updateFeaturePermission = (feature: Feature, level: 'full' | 'read' | 'none') => {
    // For legacy string features, use the old checkbox behavior
    if (typeof feature === 'string') {
      toggleFeature(feature);
      return;
    }

    // For new feature objects, we need to update the feature's permission in the project
    // This would need to be handled by the parent component
    // For now, we'll just update the role's features array for backward compatibility
    const featureName = feature.name;

    if (level === 'none') {
      setFormData(prev => ({
        ...prev,
        features: prev.features.filter(f => f !== featureName)
      }));
    } else {
      if (!formData.features.includes(featureName)) {
        setFormData(prev => ({
          ...prev,
          features: [...prev.features, featureName]
        }));
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">👤</span>
              <div>
                <h2 className="text-lg font-semibold">Edit Role</h2>
                <p className="text-green-100 text-sm">{role.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-md p-1 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-7rem)]">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Basic Information */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 h-full flex flex-col">
                <h3 className="text-md font-medium text-gray-900 mb-4">Role Information</h3>
                <div className="flex flex-col space-y-3 flex-1">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Role Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Role description..."
                      className="flex-1 min-h-24 w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Features */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 h-full">
                <h3 className="text-md font-medium text-gray-900 mb-4">Feature Permissions</h3>
                <div className="max-h-64 overflow-y-auto">
                  <div className="space-y-3">
                    {features.map(feature => {
                      const currentPermission = getFeaturePermission(feature);
                      const featureName = typeof feature === 'string' ? feature : feature.name;

                      return (
                        <div key={feature.id || featureName} className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900">{featureName}</div>
                            {typeof feature !== 'string' && feature.description && (
                              <div className="text-xs text-gray-500 mt-1">{feature.description}</div>
                            )}
                            {typeof feature !== 'string' && feature.category && (
                              <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                                feature.category === 'entity' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                              }`}>
                                {feature.category}
                              </span>
                            )}
                          </div>

                          <select
                            value={currentPermission}
                            onChange={(e) => updateFeaturePermission(feature, e.target.value as 'full' | 'read' | 'none')}
                            className="ml-4 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <option value="none" className="text-gray-500">No Access</option>
                            <option value="read" className="text-blue-600">Read Only</option>
                            <option value="full" className="text-green-600">Full Access</option>
                          </select>
                        </div>
                      );
                    })}
                  </div>
                  {features.length === 0 && (
                    <div className="text-center py-6 text-gray-500 text-sm">
                      No features available
                    </div>
                  )}
                </div>
              </div>
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
            className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}