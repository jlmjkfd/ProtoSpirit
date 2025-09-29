import type { Role } from "../../../types";

interface RolesTabProps {
  roles: Role[];
  highlightedRole: string | null;
  onHighlight: (roleName: string) => void;
  onAddRole: () => void;
  onEditRole: (role: Role) => void;
  onDeleteRole: (roleName: string) => void;
  onUpdatePermission: (
    roleName: string,
    featureId: string,
    permission: "none" | "read" | "full"
  ) => void;
}

export function RolesTab({
  roles,
  highlightedRole,
  onHighlight,
  onAddRole,
  onEditRole,
  onDeleteRole,
  onUpdatePermission,
}: RolesTabProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">User Roles</h3>
        <button
          onClick={onAddRole}
          className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
        >
          + Add Role
        </button>
      </div>

      <div className="space-y-4">
        {roles.map((role, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              highlightedRole === role.name
                ? "bg-blue-50 border-blue-300 shadow-md"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
            }`}
            onClick={() => onHighlight(role.name)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {role.name}
                </span>
                <span className="text-sm text-gray-500">
                  {role.features?.length || 0} features
                </span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditRole(role);
                  }}
                  className="text-blue-500 hover:text-blue-700 p-1"
                  title="Edit role"
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteRole(role.name);
                  }}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Delete role"
                >
                  🗑️
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{role.description}</p>

            <div className="space-y-2">
              <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                Assigned Features:
              </h5>
              <div className="flex flex-wrap gap-1">
                {role.features?.map((feature, featureIndex) => (
                  <span
                    key={featureIndex}
                    className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800"
                  >
                    {feature}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdatePermission(role.name, feature, "none");
                      }}
                      className="ml-1 text-green-600 hover:text-green-800 text-xs"
                      title="Remove feature from role"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {(!role.features || role.features.length === 0) && (
                  <span className="text-xs text-gray-500 italic">
                    No features assigned
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {roles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No roles yet
          </h3>
          <p className="text-gray-600 mb-4">
            Add user roles to define access levels.
          </p>
          <button
            onClick={onAddRole}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Role
          </button>
        </div>
      )}
    </div>
  );
}
