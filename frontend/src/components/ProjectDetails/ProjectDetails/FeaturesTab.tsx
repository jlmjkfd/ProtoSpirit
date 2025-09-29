import { useState } from "react";
import type { Role, Feature } from "../../../types";
import { FeatureAssignmentModal } from "../modals/FeatureAssignmentModal";

interface FeaturesTabProps {
  features: Feature[];
  roles: Role[];
  onAddFeature: () => void;
  onEditFeature: (feature: Feature) => void;
  onDeleteFeature: (featureName: string) => void;
  onUpdatePermission: (
    roleName: string,
    featureId: string,
    permission: "none" | "read" | "full"
  ) => void;
}

export function FeaturesTab({
  features,
  roles,
  onAddFeature,
  onEditFeature,
  onDeleteFeature,
  onUpdatePermission,
}: FeaturesTabProps) {
  const [showAssignmentMatrix, setShowAssignmentMatrix] = useState(false);
  const [activeCategory, setActiveCategory] = useState<
    "all" | "entity" | "relationship"
  >("all");

  // Categorize features
  const categorizedFeatures = {
    entity: features.filter((f) => f.category === "entity"),
    relationship: features.filter((f) => f.category === "relationship"),
  };

  const getCategoryColor = (category: "entity" | "relationship") => {
    switch (category) {
      case "entity":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "relationship":
        return "bg-green-50 border-green-200 text-green-800";
    }
  };

  const displayFeatures =
    activeCategory === "all"
      ? features
      : categorizedFeatures[activeCategory as keyof typeof categorizedFeatures];

  const renderFeatureCard = (feature: Feature, index: number) => {
    // Get roles with their permission levels for this feature
    const rolePermissions =
      feature.permissions?.map((permission) => ({
        roleName: permission.role,
        actions: permission.actions,
      })) || [];

    return (
      <div
        key={feature.id || index}
        className={`rounded-lg border p-4 transition-all hover:shadow-md ${getCategoryColor(
          feature.category
        )}`}
      >
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div>
              <h4 className="text-sm font-semibold">{feature.name}</h4>
              <p className="mt-1 text-xs opacity-75">{feature.description}</p>
            </div>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => onEditFeature(feature)}
              className="rounded p-1 text-sm text-blue-600 hover:text-blue-800"
              title="Edit feature"
            >
              ✏️
            </button>
            <button
              onClick={() => onDeleteFeature(feature.name)}
              className="rounded p-1 text-sm text-red-600 hover:text-red-800"
              title="Delete feature"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="mb-3">
          <div className="mb-1 text-xs font-medium">Category:</div>
          <span className="bg-opacity-70 inline-flex items-center rounded-full bg-white px-2 py-1 text-xs font-medium">
            {feature.category.charAt(0).toUpperCase() +
              feature.category.slice(1)}
          </span>
        </div>

        {(feature.entityTarget || feature.relationshipTarget) && (
          <div className="mb-3">
            <div className="mb-1 text-xs font-medium">Target:</div>
            <span className="bg-opacity-70 inline-flex items-center rounded-full bg-white px-2 py-1 text-xs">
              {feature.entityTarget || feature.relationshipTarget}
            </span>
          </div>
        )}

        <div>
          <div className="mb-1 text-xs font-medium">Role Permissions:</div>
          <div className="flex flex-wrap gap-1">
            {rolePermissions.map((permission) => (
              <span
                key={permission.roleName}
                className={`inline-flex items-center rounded px-2 py-0.5 text-xs ${
                  permission.actions.includes("full")
                    ? "border border-green-200 bg-green-100 text-green-800"
                    : "border border-blue-200 bg-blue-100 text-blue-800"
                }`}
              >
                {permission.roleName}
                <span className="ml-1 text-xs opacity-75">
                  ({permission.actions.includes("full") ? "Full" : "Read"})
                </span>
              </span>
            ))}
            {rolePermissions.length === 0 && (
              <span className="text-xs italic opacity-60">
                No roles assigned
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">System Features</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAssignmentMatrix(true)}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm text-white transition-colors hover:bg-indigo-700"
          >
            Assignment Matrix
          </button>
          <button
            onClick={onAddFeature}
            className="rounded-md bg-green-600 px-3 py-2 text-sm text-white transition-colors hover:bg-green-700"
          >
            + Add Feature
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="mb-6 flex space-x-1 rounded-lg bg-gray-100 p-1">
        {[
          { key: "all", label: "All Features" },
          { key: "entity", label: "Entity Management" },
          { key: "relationship", label: "Relationships" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key as any)}
            className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeCategory === key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span>{label}</span>
            {key !== "all" && (
              <span className="ml-1 rounded-full bg-gray-200 px-1.5 py-0.5 text-xs text-gray-700">
                {categorizedFeatures[key as keyof typeof categorizedFeatures]
                  ?.length || 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Features Grid */}
      {displayFeatures.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayFeatures.map(renderFeatureCard)}
        </div>
      ) : (
        <div className="py-12 text-center">
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            {activeCategory === "all"
              ? "No features yet"
              : `No ${activeCategory} features`}
          </h3>
          <p className="mb-4 text-gray-600">
            {activeCategory === "all"
              ? "Add system features to define functionality."
              : `Add ${activeCategory} features to enhance your application.`}
          </p>
          <button
            onClick={onAddFeature}
            className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Add Feature
          </button>
        </div>
      )}

      {/* Feature Assignment Matrix Modal */}
      {showAssignmentMatrix && (
        <FeatureAssignmentModal
          features={features} // Pass full Feature objects
          roles={roles}
          onUpdatePermission={onUpdatePermission}
          onClose={() => setShowAssignmentMatrix(false)}
        />
      )}
    </div>
  );
}
