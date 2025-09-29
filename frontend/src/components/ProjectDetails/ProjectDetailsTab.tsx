import { useState } from "react";
import type { Project, Entity, Role, Feature } from "../../types";
import { BasicSettings } from "./ProjectDetails/BasicSettings";
import { EntitiesTab } from "./ProjectDetails/EntitiesTab";
import { RolesTab } from "./ProjectDetails/RolesTab";
import { FeaturesTab } from "./ProjectDetails/FeaturesTab";
import { EntityEditModal } from "./modals/EntityEditModal";
import { RoleEditModal } from "./modals/RoleEditModal";
import { FeatureModal } from "./modals/FeatureModal";

interface ProjectDetailsTabProps {
  project: Project;
  onDelete: () => void;
  onUpdate?: (updatedProject: Project) => void;
}

type ManagementSection = "basic" | "entities" | "roles" | "features";

export function ProjectDetailsTab({
  project,
  onDelete,
  onUpdate,
}: ProjectDetailsTabProps) {
  // State for active management section
  const [activeSection, setActiveSection] =
    useState<ManagementSection>("basic");

  // State for all project data
  const [projectData, setProjectData] = useState({
    appName: project.appName,
    description: project.description,
    entities: [...project.entities],
    roles: [...project.roles],
    features: [...project.features],
  });

  // Modal states
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);

  // Highlighting states
  const [highlightedEntity, setHighlightedEntity] = useState<string | null>(
    null
  );
  const [highlightedRole, setHighlightedRole] = useState<string | null>(null);

  // Helper function to save project changes
  const saveProjectChanges = (updatedProjectData: typeof projectData) => {
    if (onUpdate) {
      const updatedProject: Project = {
        ...project,
        appName: updatedProjectData.appName,
        description: updatedProjectData.description,
        entities: updatedProjectData.entities,
        roles: updatedProjectData.roles,
        features: updatedProjectData.features,
      };
      onUpdate(updatedProject);
    }
  };

  // Basic settings handlers
  const handleBasicUpdate = (updates: {
    appName?: string;
    description?: string;
  }) => {
    const updatedProjectData = { ...projectData, ...updates };
    setProjectData(updatedProjectData);
    saveProjectChanges(updatedProjectData);
  };

  // Helper function to get next entity number
  const getNextEntityNumber = () => {
    const existingNumbers = projectData.entities
      .map((entity) => entity.name)
      .filter((name) => name.startsWith("NewEntity"))
      .map((name) => {
        const match = name.match(/^NewEntity(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((num) => !isNaN(num));

    if (existingNumbers.length === 0) return 1;

    // Find the smallest available number starting from 1
    for (let i = 1; i <= Math.max(...existingNumbers) + 1; i++) {
      if (!existingNumbers.includes(i)) {
        return i;
      }
    }

    // Fallback
    return Math.max(...existingNumbers) + 1;
  };

  // Entity management functions
  const handleAddEntity = () => {
    const entityNumber = getNextEntityNumber();
    const newEntity: Entity = {
      name: `NewEntity${entityNumber}`,
      fields: [
        { name: "id", type: "number", required: true },
        { name: "name", type: "text", required: true },
      ],
      relationships: [],
      examples: [],
      metadata: { description: `New entity ${entityNumber}` },
    };

    // Just open the modal with the template entity (don't save yet)
    setEditingEntity(newEntity);
  };

  const handleEditEntity = (entity: Entity) => {
    setEditingEntity(entity);
  };

  const handleUpdateEntity = (updatedEntity: Entity) => {
    // Check if this is a new entity (not in the current project)
    const isNewEntity = !projectData.entities.find(
      (e) => e.name === editingEntity?.name
    );

    let updatedEntities;
    if (isNewEntity) {
      // Adding new entity
      updatedEntities = [...projectData.entities, updatedEntity];
    } else {
      // Updating existing entity
      updatedEntities = projectData.entities.map((e) =>
        e.name === editingEntity?.name ? updatedEntity : e
      );
    }

    const updatedProjectData = {
      ...projectData,
      entities: updatedEntities,
    };

    setProjectData(updatedProjectData);
    setEditingEntity(null);
    saveProjectChanges(updatedProjectData);
  };

  const handleDeleteEntity = (entityName: string) => {
    if (
      confirm(
        `Delete entity "${entityName}"? This will also remove all relationships and features related to this entity.`
      )
    ) {
      const updatedProjectData = {
        ...projectData,
        entities: projectData.entities
          .filter((e) => e.name !== entityName)
          .map((e) => ({
            ...e,
            relationships:
              e.relationships?.filter((rel) => rel.entity !== entityName) || [],
          })),
        features: projectData.features.filter((f) => {
          const featureName = typeof f === "string" ? f : f.name;
          return !featureName.toLowerCase().includes(entityName.toLowerCase());
        }),
      };

      setProjectData(updatedProjectData);
      saveProjectChanges(updatedProjectData);
    }
  };

  // Role management functions
  const handleAddRole = () => {
    const newRole: Role = {
      name: "New Role",
      description: "New role description",
      features: [],
    };
    setProjectData((prev) => ({
      ...prev,
      roles: [...prev.roles, newRole],
    }));
    setEditingRole(newRole);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
  };

  const handleUpdateRole = (updatedRole: Role) => {
    setProjectData((prev) => ({
      ...prev,
      roles: prev.roles.map((r) =>
        r.name === editingRole?.name ? updatedRole : r
      ),
    }));
    setEditingRole(null);
  };

  const handleDeleteRole = (roleName: string) => {
    if (confirm(`Delete role "${roleName}"?`)) {
      setProjectData((prev) => ({
        ...prev,
        roles: prev.roles.filter((r) => r.name !== roleName),
      }));
    }
  };

  // Feature management functions
  const handleAddFeature = () => {
    // Create a new feature template like EntityEditModal does
    const newFeature: Feature = {
      id: `feature_${Date.now()}`,
      name: "",
      description: "",
      category: "entity",
      permissions: [],
    };
    setEditingFeature(newFeature);
  };

  const handleSaveFeature = (feature: Feature) => {
    // Check if this is a new feature (not in the current project)
    const isNewFeature = !projectData.features.find((f) => {
      const existingId = typeof f === "string" ? null : f.id;
      return existingId === feature.id;
    });

    if (isNewFeature) {
      // Check for duplicate names
      const featureExists = projectData.features.some((f) => {
        const existingName = typeof f === "string" ? f : f.name;
        return existingName === feature.name;
      });
      if (featureExists) {
        alert(`A feature named "${feature.name}" already exists.`);
        return;
      }
    }

    let updatedFeatures;
    if (isNewFeature) {
      // Adding new feature
      updatedFeatures = [...projectData.features, feature];
    } else {
      // Updating existing feature
      updatedFeatures = projectData.features.map((f) => {
        const existingId = typeof f === "string" ? null : f.id;
        return existingId === feature.id ? feature : f;
      });
    }

    const updatedProjectData = {
      ...projectData,
      features: updatedFeatures,
    };

    setProjectData(updatedProjectData);
    setEditingFeature(null);
    saveProjectChanges(updatedProjectData);
  };

  const handleEditFeature = (feature: Feature) => {
    setEditingFeature(feature);
  };


  const handleDeleteFeature = (featureName: string) => {
    if (
      confirm(
        `Delete feature "${featureName}"? This will remove it from all roles.`
      )
    ) {
      const updatedProjectData = {
        ...projectData,
        features: projectData.features.filter((f) => {
          const fName = typeof f === "string" ? f : f.name;
          return fName !== featureName;
        }),
        roles: projectData.roles.map((role) => ({
          ...role,
          features: role.features.filter((f) => f !== featureName),
        })),
      };
      setProjectData(updatedProjectData);
      saveProjectChanges(updatedProjectData);
    }
  };

  const handleUpdatePermission = (
    roleName: string,
    featureId: string,
    permission: "none" | "read" | "full"
  ) => {
    setProjectData((prev) => ({
      ...prev,
      features: prev.features.map((feature) => {
        // Handle both legacy string features and new feature objects
        const currentFeatureId =
          typeof feature === "string" ? feature : feature.id;

        if (currentFeatureId === featureId) {
          // For new feature objects, update the permissions array
          if (typeof feature !== "string") {
            const updatedPermissions = [...(feature.permissions || [])];
            const existingPermissionIndex = updatedPermissions.findIndex(
              (p) => p.role === roleName
            );

            if (permission === "none") {
              // Remove permission if exists
              if (existingPermissionIndex >= 0) {
                updatedPermissions.splice(existingPermissionIndex, 1);
              }
            } else {
              // Add or update permission
              const newPermission = { role: roleName, actions: [permission] };
              if (existingPermissionIndex >= 0) {
                updatedPermissions[existingPermissionIndex] = newPermission;
              } else {
                updatedPermissions.push(newPermission);
              }
            }

            return { ...feature, permissions: updatedPermissions };
          }
        }
        return feature;
      }),
      // Also update the role's features array for backward compatibility
      roles: prev.roles.map((role) => {
        if (role.name === roleName) {
          const featureName =
            typeof prev.features.find(
              (f) => (typeof f === "string" ? f : f.id) === featureId
            ) === "string"
              ? featureId
              : prev.features.find(
                  (f) => typeof f !== "string" && f.id === featureId
                )?.name || featureId;

          if (permission === "none") {
            return {
              ...role,
              features: role.features.filter((f) => f !== featureName),
            };
          } else {
            if (!role.features.includes(featureName)) {
              return {
                ...role,
                features: [...role.features, featureName],
              };
            }
            return role;
          }
        }
        return role;
      }),
    }));
  };

  const managementSections = [
    { id: "basic", name: "Basic Info" },
    {
      id: "entities",
      name: "Entities",
      count: projectData.entities.length,
    },
    { id: "roles", name: "Roles", count: projectData.roles.length },
    {
      id: "features",
      name: "Features",
      count: projectData.features.length,
    },
  ];

  return (
    <div className="p-6">
      {/* Sub-navigation */}
      <div className="mb-6">
        <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {managementSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as ManagementSection)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeSection === section.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {section.name}
              {section.count !== undefined && (
                <span
                  className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    activeSection === section.id
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {section.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Management Content */}
      <div className="bg-gray-50 rounded-lg min-h-[400px]">
        {activeSection === "basic" && (
          <BasicSettings
            project={project}
            projectData={projectData}
            onUpdate={handleBasicUpdate}
            onDelete={onDelete}
          />
        )}

        {activeSection === "entities" && (
          <EntitiesTab
            entities={projectData.entities}
            highlightedEntity={highlightedEntity}
            onHighlight={setHighlightedEntity}
            onAddEntity={handleAddEntity}
            onEditEntity={handleEditEntity}
            onDeleteEntity={handleDeleteEntity}
          />
        )}

        {activeSection === "roles" && (
          <RolesTab
            roles={projectData.roles}
            highlightedRole={highlightedRole}
            onHighlight={setHighlightedRole}
            onAddRole={handleAddRole}
            onEditRole={handleEditRole}
            onDeleteRole={handleDeleteRole}
            onUpdatePermission={handleUpdatePermission}
          />
        )}

        {activeSection === "features" && (
          <FeaturesTab
            features={projectData.features}
            roles={projectData.roles}
            onAddFeature={handleAddFeature}
            onEditFeature={handleEditFeature}
            onDeleteFeature={handleDeleteFeature}
            onUpdatePermission={handleUpdatePermission}
          />
        )}
      </div>

      {/* Modals */}
      {editingEntity && (
        <EntityEditModal
          entity={editingEntity}
          project={project}
          onSave={handleUpdateEntity}
          onClose={() => {
            setEditingEntity(null);
          }}
        />
      )}

      {editingRole && (
        <RoleEditModal
          role={editingRole}
          features={projectData.features}
          onSave={handleUpdateRole}
          onClose={() => {
            setEditingRole(null);
          }}
        />
      )}

      {editingFeature && (
        <FeatureModal
          feature={editingFeature}
          onSave={handleSaveFeature}
          onClose={() => {
            setEditingFeature(null);
          }}
          entities={projectData.entities}
          roles={projectData.roles}
          isNew={!projectData.features.find((f) => {
            const existingId = typeof f === "string" ? null : f.id;
            return existingId === editingFeature.id;
          })}
        />
      )}
    </div>
  );
}
