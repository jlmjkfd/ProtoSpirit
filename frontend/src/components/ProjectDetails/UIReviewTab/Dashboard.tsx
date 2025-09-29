import type { Project, Feature } from "../../../types";

interface DashboardProps {
  project: Project;
  selectedRole: string;
  roleFeatures: (string | Feature)[];
  getFeatureName: (feature: any) => string;
}

export function Dashboard({
  project,
  selectedRole,
  roleFeatures,
  getFeatureName,
}: DashboardProps) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          {selectedRole} Dashboard
        </h2>
        <p className="text-gray-600">
          Welcome to {project.appName}! Here are your available features:
        </p>
      </div>

      {/* Simple Feature Cards (simplified for intern task) */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roleFeatures.map((feature, index) => {
          const isRelationship =
            typeof feature !== "string" && feature.category === "relationship";
          const isEntity =
            typeof feature !== "string" && feature.category === "entity";

          return (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {getFeatureName(feature)}
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                {isRelationship
                  ? "Manage entity relationships"
                  : isEntity
                    ? "Manage entity data"
                    : "Access this feature"}
              </p>
              {typeof feature !== "string" && feature.description && (
                <p className="mt-2 text-xs text-gray-500">
                  {feature.description}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Simple Entity Overview */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Available Entities
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {project.entities.map((entity) => (
            <div key={entity.name} className="rounded-lg bg-gray-50 p-3">
              <h4 className="font-medium text-gray-900">{entity.name}</h4>
              <p className="text-sm text-gray-500">
                {entity.fields?.length || 0} fields
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
