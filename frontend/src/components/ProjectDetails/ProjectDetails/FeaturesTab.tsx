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
    const rolePermissions = feature.permissions?.map(permission => ({
      roleName: permission.role,
      actions: permission.actions
    })) || [];

    return (
      <div
        key={feature.id || index}
        className={`border rounded-lg p-4 hover:shadow-md transition-all ${getCategoryColor(
          feature.category
        )}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div>
              <h4 className="font-semibold text-sm">{feature.name}</h4>
              <p className="text-xs opacity-75 mt-1">{feature.description}</p>
            </div>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => onEditFeature(feature)}
              className="text-blue-600 hover:text-blue-800 text-sm p-1 rounded"
              title="Edit feature"
            >
              ✏️
            </button>
            <button
              onClick={() => onDeleteFeature(feature.name)}
              className="text-red-600 hover:text-red-800 text-sm p-1 rounded"
              title="Delete feature"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="mb-3">
          <div className="text-xs font-medium mb-1">Category:</div>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-70">
            {feature.category.charAt(0).toUpperCase() +
              feature.category.slice(1)}
          </span>
        </div>

        {(feature.entityTarget || feature.relationshipTarget) && (
          <div className="mb-3">
            <div className="text-xs font-medium mb-1">Target:</div>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-white bg-opacity-70">
              {feature.entityTarget || feature.relationshipTarget}
            </span>
          </div>
        )}

        <div>
          <div className="text-xs font-medium mb-1">Role Permissions:</div>
          <div className="flex flex-wrap gap-1">
            {rolePermissions.map((permission) => (
              <span
                key={permission.roleName}
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                  permission.actions.includes('full')
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}
              >
                {permission.roleName}
                <span className="ml-1 text-xs opacity-75">
                  ({permission.actions.includes('full') ? 'Full' : 'Read'})
                </span>
              </span>
            ))}
            {rolePermissions.length === 0 && (
              <span className="text-xs opacity-60 italic">
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
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">System Features</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAssignmentMatrix(true)}
            className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
          >
Assignment Matrix
          </button>
          <button
            onClick={onAddFeature}
            className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
          >
            + Add Feature
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { key: "all", label: "All Features" },
          { key: "entity", label: "Entity Management" },
          { key: "relationship", label: "Relationships" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key as any)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeCategory === key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span>{label}</span>
            {key !== "all" && (
              <span className="ml-1 bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full text-xs">
                {categorizedFeatures[key as keyof typeof categorizedFeatures]
                  ?.length || 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Features Grid */}
      {displayFeatures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayFeatures.map(renderFeatureCard)}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {activeCategory === "all"
              ? "No features yet"
              : `No ${activeCategory} features`}
          </h3>
          <p className="text-gray-600 mb-4">
            {activeCategory === "all"
              ? "Add system features to define functionality."
              : `Add ${activeCategory} features to enhance your application.`}
          </p>
          <button
            onClick={onAddFeature}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
