import type { Role, Feature } from '../../../types';
import { PermissionToggle } from './PermissionToggle';

interface FeatureAssignmentModalProps {
  features: Feature[];
  roles: Role[];
  onUpdatePermission: (roleName: string, featureId: string, permission: 'none' | 'read' | 'full') => void;
  onClose: () => void;
}

export function FeatureAssignmentModal({
  features,
  roles,
  onUpdatePermission,
  onClose
}: FeatureAssignmentModalProps) {

  // Get permission level for a specific role and feature
  const getPermission = (role: Role, feature: Feature): 'none' | 'read' | 'full' => {
    // Handle legacy string features in role.features array
    if (typeof feature === 'string') {
      return role.features?.includes(feature) ? 'full' : 'none';
    }

    // For new feature objects, check the permissions array
    const permission = feature.permissions?.find(p => p.role === role.name);
    if (!permission) return 'none';

    if (permission.actions.includes('full')) return 'full';
    if (permission.actions.includes('read')) return 'read';
    return 'none';
  };

  // Get feature name for display
  const getFeatureName = (feature: Feature): string => {
    return typeof feature === 'string' ? feature : feature.name;
  };

  // Get feature ID for updates
  const getFeatureId = (feature: Feature): string => {
    return typeof feature === 'string' ? feature : feature.id;
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">📊</span>
              <div>
                <h2 className="text-lg font-semibold">Feature Permission Matrix</h2>
                <p className="text-indigo-100 text-sm">Click toggles to set None/Read/Full permissions for each role</p>
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
        <div className="p-4 overflow-y-auto max-h-[calc(95vh-7rem)]">
          {roles.length > 0 && features.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-2 font-medium text-gray-700 border-b border-gray-200 bg-gray-50 sticky left-0 z-10 min-w-[120px]">
                      Feature
                    </th>
                    {roles.map((role) => (
                      <th key={role.name} className="text-center py-2 px-2 font-medium text-gray-700 border-b border-gray-200 bg-gray-50 min-w-[80px]">
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
                      <tr key={featureId} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                        <td className="py-2 px-2 font-medium text-gray-900 border-b border-gray-100 bg-white sticky left-0 z-10">
                          <div className="flex flex-col">
                            <div className="truncate font-medium" title={featureName}>
                              {featureName}
                            </div>
                            {typeof feature !== 'string' && feature.category && (
                              <span className={`inline-block mt-1 px-1.5 py-0.5 text-xs rounded-full w-fit ${
                                feature.category === 'entity' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                              }`}>
                                {feature.category}
                              </span>
                            )}
                          </div>
                        </td>
                        {roles.map((role) => (
                          <td key={`${featureId}-${role.name}`} className="text-center py-2 px-2 border-b border-gray-100">
                            <div className="flex justify-center">
                              <PermissionToggle
                                value={getPermission(role, feature)}
                                onChange={(permission) => onUpdatePermission(role.name, featureId, permission)}
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
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Data to Display</h3>
              <p className="text-gray-600">
                {roles.length === 0 && features.length === 0
                  ? 'Add some roles and features to see the assignment matrix.'
                  : roles.length === 0
                  ? 'Add some roles to see feature assignments.'
                  : 'Add some features to see role assignments.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="text-xs text-gray-600">
                {features.length} features × {roles.length} roles
              </div>

              {/* Permission Legend */}
              <div className="flex items-center space-x-4 text-xs">
                <span className="text-gray-500">Legend:</span>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-xs text-gray-400">✕</div>
                  <span className="text-gray-600">None</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded flex items-center justify-center text-xs text-blue-600">👁</div>
                  <span className="text-gray-600">Read</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-green-100 border border-green-200 rounded flex items-center justify-center text-xs text-green-600">✓</div>
                  <span className="text-gray-600">Full</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}