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
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">User Roles</h3>
        <button
          onClick={onAddRole}
          className="rounded-md bg-green-600 px-3 py-2 text-sm text-white transition-colors hover:bg-green-700"
        >
          + Add Role
        </button>
      </div>

      <div className="space-y-4">
        {roles.map((role, index) => (
          <div
            key={index}
            className={`cursor-pointer rounded-lg border p-4 transition-all ${
              highlightedRole === role.name
                ? "border-blue-300 bg-blue-50 shadow-md"
                : "border-gray-200 bg-gray-50 hover:bg-gray-100"
            }`}
            onClick={() => onHighlight(role.name)}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
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
                  className="p-1 text-blue-500 hover:text-blue-700"
                  title="Edit role"
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteRole(role.name);
                  }}
                  className="p-1 text-red-500 hover:text-red-700"
                  title="Delete role"
                >
                  🗑️
                </button>
              </div>
            </div>

            <p className="mb-4 text-sm text-gray-600">{role.description}</p>

            <div className="space-y-2">
              <h5 className="text-xs font-medium tracking-wide text-gray-700 uppercase">
                Assigned Features:
              </h5>
              <div className="flex flex-wrap gap-1">
                {role.features?.map((feature, featureIndex) => (
                  <span
                    key={featureIndex}
                    className="inline-flex items-center rounded bg-green-100 px-2 py-1 text-xs text-green-800"
                  >
                    {feature}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdatePermission(role.name, feature, "none");
                      }}
                      className="ml-1 text-xs text-green-600 hover:text-green-800"
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
        <div className="py-12 text-center">
          <div className="mb-4 text-gray-400">👥</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No roles yet
          </h3>
          <p className="mb-4 text-gray-600">
            Add user roles to define access levels.
          </p>
          <button
            onClick={onAddRole}
            className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Add Role
          </button>
        </div>
      )}
    </div>
  );
}
