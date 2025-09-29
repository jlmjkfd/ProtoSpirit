import { useState } from "react";
import type { Project } from "../../types";
import { Dashboard } from "./UIReviewTab/Dashboard";
import { EntityList } from "./UIReviewTab/EntityList";
import { RelationshipManagement } from "./UIReviewTab/RelationshipManagement";
import { RelationshipForm } from "./UIReviewTab/RelationshipForm";
import { CreateForm } from "./UIReviewTab/CreateForm";

interface UIReviewTabProps {
  project: Project;
}

export function UIReviewTab({ project }: UIReviewTabProps) {
  const [selectedRole, setSelectedRole] = useState<string>(
    project.roles?.[0]?.name || "User"
  );
  const [currentView, setCurrentView] = useState<string>("Dashboard");
  const [showCreateForm, setShowCreateForm] = useState<string | null>(null); // null or entityName
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Navigation history state
  const [navigationHistory, setNavigationHistory] = useState<string[]>([
    "Dashboard",
  ]);

  // Relationship management state
  const [showRelationshipView, setShowRelationshipView] = useState<any>(null); // null or feature object
  const [showRelationshipForm, setShowRelationshipForm] =
    useState<boolean>(false);
  const [relationshipFormData, setRelationshipFormData] = useState<
    Record<string, any>
  >({});

  // Helper function to get feature name from Feature object or string
  const getFeatureName = (feature: any): string => {
    return typeof feature === "string" ? feature : feature.name;
  };

  // Navigation history helpers
  const navigateToView = (viewName: string) => {
    setNavigationHistory((prev) => [...prev, viewName]);
    setCurrentView(viewName);
  };

  const navigateBack = () => {
    setNavigationHistory((prev) => {
      if (prev.length <= 1) {
        return prev; // Stay on current view if no history
      }
      const newHistory = prev.slice(0, -1);
      const previousView = newHistory[newHistory.length - 1];
      setCurrentView(previousView);
      return newHistory;
    });
  };

  // Get role-specific features using the new permission system
  const getRoleFeatures = (roleName: string) => {
    const allFeatures = project.features || [];

    // Filter features based on the new permission system
    return allFeatures.filter((feature) => {
      // Handle both old string features and new feature objects
      if (typeof feature === "string") {
        return true; // Keep legacy string features for backward compatibility
      }

      // For new feature objects, check if role has any permission
      const hasPermission = feature.permissions?.some(
        (permission) =>
          permission.role === roleName &&
          (permission.actions.includes("full") ||
            permission.actions.includes("read"))
      );

      return hasPermission;
    });
  };

  // Get permission level for a specific feature and role
  const getFeaturePermission = (
    feature: any,
    roleName: string
  ): "full" | "read" | "none" => {
    // Handle legacy string features
    if (typeof feature === "string") {
      return "full"; // Default to full for backward compatibility
    }

    const permission = feature.permissions?.find(
      (p: any) => p.role === roleName
    );
    if (!permission) return "none";

    if (permission.actions.includes("full")) return "full";
    if (permission.actions.includes("read")) return "read";
    return "none";
  };

  const roleFeatures = getRoleFeatures(selectedRole);

  // Generate available views based on role features (simplified for intern task)
  const getAvailableViews = () => {
    const views = ["Dashboard"];

    // Add entity-specific views based on permissions for each entity
    project.entities.forEach((entity) => {
      const hasEntityAccess = roleFeatures.some((feature) => {
        const featureName = getFeatureName(feature).toLowerCase();
        const entityName = entity.name.toLowerCase();

        // Check if this feature is specifically for this entity
        return (
          // Direct entity management features
          featureName.includes(`manage-${entityName}`) ||
          featureName.includes(`${entityName}-management`) ||
          featureName.includes(`${entityName} management`) ||
          // View-specific features for this entity
          featureName.includes(`view-${entityName}`) ||
          featureName.includes(`${entityName}-view`) ||
          // Check entityTarget property for new feature objects
          (typeof feature !== "string" && feature.entityTarget === entity.name)
        );
      });

      if (hasEntityAccess) {
        views.push(`${entity.name} List`);
      }
    });

    // Add relationship features to menu if user can't access the entity list where they'd normally appear
    roleFeatures.forEach((feature) => {
      if (
        typeof feature !== "string" &&
        feature.category === "relationship" &&
        feature.showInEntityLists
      ) {
        const hasAccessToAnyEntityList = feature.showInEntityLists.some(
          (entityName) => {
            return views.includes(`${entityName} List`);
          }
        );
        if (!hasAccessToAnyEntityList) {
          views.push(feature.name);
        }
      }
    });

    return views;
  };

  const availableViews = getAvailableViews();

  // Generate sample data for demo
  const generateSampleData = (entityName: string) => {
    const entity = project.entities.find((e) => e.name === entityName);
    if (!entity) return [];

    // Create 3-5 sample records based on the entity's example data
    const examples = entity.examples || [];
    return Array.from(
      { length: Math.min(5, Math.max(3, examples.length)) },
      (_, index) => ({
        id: index + 1,
        ...(examples[0] || {}), // Use first example as template
        // Vary some fields for demo purposes
        ...(examples[index] || {}),
      })
    );
  };

  // Generate sample relationship data
  const generateRelationshipData = (feature: any) => {
    if (!feature.relatedEntities || feature.relatedEntities.length < 2)
      return [];

    const [entity1, entity2] = feature.relatedEntities;
    const sampleData = [];

    // Generate 3-5 sample relationship pairs
    for (let i = 1; i <= 4; i++) {
      sampleData.push({
        id: i,
        entity1Name: `${entity1} ${i}`,
        entity2Name: `${entity2} ${(i % 3) + 1}`, // Vary second entity
        status: i % 4 === 0 ? "Inactive" : "Active",
        createdDate: new Date(
          Date.now() - i * 7 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
      });
    }

    return sampleData;
  };

  // Form handlers
  const handleShowCreateForm = (entityName: string) => {
    setShowCreateForm(entityName);
    setFormData({});
  };

  const handleCloseCreateForm = () => {
    setShowCreateForm(null);
    setFormData({});
  };

  const handleFormFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmitCreate = (entityName: string | null) => {
    if (!entityName) return;

    const entity = project.entities.find((e) => e.name === entityName);
    if (!entity) return;

    // Basic validation
    const requiredFields =
      entity.fields?.filter((field) => field.required) || [];
    const missingFields = requiredFields.filter(
      (field) =>
        !formData[field.name] || formData[field.name].toString().trim() === ""
    );

    if (missingFields.length > 0) {
      alert(
        `Please fill in the required fields: ${missingFields.map((f) => f.name).join(", ")}`
      );
      return;
    }

    // Simulate success
    alert(`${entityName} created successfully!`);
    handleCloseCreateForm();
  };

  const renderCurrentView = () => {
    if (currentView === "Dashboard") {
      return (
        <Dashboard
          project={project}
          selectedRole={selectedRole}
          roleFeatures={roleFeatures}
          getFeatureName={getFeatureName}
        />
      );
    }

    // Check if it's a relationship management view
    if (showRelationshipView) {
      return (
        <RelationshipManagement
          showRelationshipView={showRelationshipView}
          selectedRole={selectedRole}
          navigationHistory={navigationHistory}
          showRelationshipForm={showRelationshipForm}
          getFeaturePermission={getFeaturePermission}
          generateRelationshipData={generateRelationshipData}
          setShowRelationshipView={setShowRelationshipView}
          navigateBack={navigateBack}
          setShowRelationshipForm={setShowRelationshipForm}
          setRelationshipFormData={setRelationshipFormData}
          renderRelationshipForm={() => (
            <RelationshipForm
              showRelationshipView={showRelationshipView}
              relationshipFormData={relationshipFormData}
              setRelationshipFormData={setRelationshipFormData}
              setShowRelationshipForm={setShowRelationshipForm}
            />
          )}
        />
      );
    }

    // Check if it's an entity list view
    const entityName = currentView.replace(" List", "");
    const entity = project.entities.find((e) => e.name === entityName);
    if (entity) {
      return (
        <EntityList
          entityName={entityName}
          project={project}
          selectedRole={selectedRole}
          roleFeatures={roleFeatures}
          getFeatureName={getFeatureName}
          getFeaturePermission={getFeaturePermission}
          generateSampleData={generateSampleData}
          showCreateForm={showCreateForm}
          handleShowCreateForm={handleShowCreateForm}
          setShowRelationshipView={setShowRelationshipView}
          navigateToView={navigateToView}
          renderCreateForm={() => (
            <CreateForm
              showCreateForm={showCreateForm}
              project={project}
              formData={formData}
              handleFormFieldChange={handleFormFieldChange}
              handleCloseCreateForm={handleCloseCreateForm}
              handleSubmitCreate={handleSubmitCreate}
            />
          )}
        />
      );
    }

    // Check if it's a relationship feature accessed from the menu
    const relationshipFeature = roleFeatures.find(
      (feature) =>
        typeof feature !== "string" &&
        feature.category === "relationship" &&
        feature.name === currentView
    );

    if (relationshipFeature) {
      // Set the relationship view and render it
      if (!showRelationshipView) {
        setShowRelationshipView(relationshipFeature);
      }
      return (
        <RelationshipManagement
          showRelationshipView={showRelationshipView}
          selectedRole={selectedRole}
          navigationHistory={navigationHistory}
          showRelationshipForm={showRelationshipForm}
          getFeaturePermission={getFeaturePermission}
          generateRelationshipData={generateRelationshipData}
          setShowRelationshipView={setShowRelationshipView}
          navigateBack={navigateBack}
          setShowRelationshipForm={setShowRelationshipForm}
          setRelationshipFormData={setRelationshipFormData}
          renderRelationshipForm={() => (
            <RelationshipForm
              showRelationshipView={showRelationshipView}
              relationshipFormData={relationshipFormData}
              setRelationshipFormData={setRelationshipFormData}
              setShowRelationshipForm={setShowRelationshipForm}
            />
          )}
        />
      );
    }

    // Fallback for unknown views (simplified for intern task)
    return (
      <div className="p-6">
        <div className="py-12 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            {currentView}
          </h2>
          <p className="mb-6 text-gray-600">
            This feature is not yet implemented in this demo.
          </p>
          <div className="rounded-lg bg-gray-100 p-8">
            <p className="text-sm text-gray-500">
              This would show the {currentView} interface for the {selectedRole}{" "}
              role.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Demo Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">{project.appName}</h1>
              <span className="rounded-full bg-white/20 px-3 py-1 text-sm">
                Demo Mode
              </span>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center space-x-4">
              <span className="text-sm opacity-90">Role:</span>
              <select
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  // Reset all state when role changes
                  setCurrentView("Dashboard");
                  setNavigationHistory(["Dashboard"]);
                  setShowCreateForm(null);
                  setFormData({});
                  setShowRelationshipView(null);
                  setShowRelationshipForm(false);
                  setRelationshipFormData({});
                }}
                className="rounded-md border border-white/30 bg-white/20 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-white/50 focus:outline-none"
              >
                {project.roles.map((role) => (
                  <option
                    key={role.name}
                    value={role.name}
                    className="text-gray-900"
                  >
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-4 flex items-center space-x-6">
            {availableViews.map((view) => (
              <button
                key={view}
                onClick={() => {
                  navigateToView(view);
                  // Reset relationship view state when changing views
                  setShowRelationshipView(null);
                  setShowRelationshipForm(false);
                  setRelationshipFormData({});
                }}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  currentView === view
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-[600px]">{renderCurrentView()}</div>
    </div>
  );
}
