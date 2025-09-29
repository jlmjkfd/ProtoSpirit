import { useState, useEffect } from "react";
import type {
  Entity,
  EntityField,
  EntityRelationship,
  Project,
} from "../../../types";
import {
  updateEntityWithSampleData,
  needsSampleDataUpdate,
} from "../../../utils/sampleDataGenerator";
import { FieldsTab } from "./EntityEditModal/FieldsTab";
import { RelationshipsTab } from "./EntityEditModal/RelationshipsTab";
import { ExamplesTab } from "./EntityEditModal/ExamplesTab";

interface EntityEditModalProps {
  entity: Entity;
  project: Project;
  onSave: (entity: Entity) => void;
  onClose: () => void;
}

type TabType = "fields" | "relationships" | "examples";

export function EntityEditModal({
  entity,
  project,
  onSave,
  onClose,
}: EntityEditModalProps) {
  const [editingEntity, setEditingEntity] = useState<Entity>({ ...entity });
  const [activeTab, setActiveTab] = useState<TabType>("fields");
  const [newField, setNewField] = useState<Partial<EntityField>>({
    name: "",
    type: "text",
    required: false,
  });
  const [newRelationship, setNewRelationship] = useState<
    Partial<EntityRelationship>
  >({
    entity: "",
    type: "one-to-many",
    description: "",
  });
  const [fieldNameError, setFieldNameError] = useState(false);
  const [relationshipEntityError, setRelationshipEntityError] = useState(false);
  const [removedFields, setRemovedFields] = useState<Set<number>>(new Set());
  const [removedRelationships, setRemovedRelationships] = useState<Set<number>>(
    new Set()
  );
  const [originalFieldsCount, setOriginalFieldsCount] = useState(0);
  const [originalRelationshipsCount, setOriginalRelationshipsCount] =
    useState(0);

  useEffect(() => {
    let entityToSet = { ...entity };

    // Auto-generate sample data if needed
    if (needsSampleDataUpdate(entityToSet)) {
      entityToSet = updateEntityWithSampleData(entityToSet);
    }

    setEditingEntity(entityToSet);
    setOriginalFieldsCount(entityToSet.fields?.length || 0);
    setOriginalRelationshipsCount(entityToSet.relationships?.length || 0);
  }, [entity]);

  const handleSave = () => {
    // Filter out removed fields and relationships
    let finalEntity: Entity = {
      ...editingEntity,
      fields:
        editingEntity.fields?.filter((_, index) => !removedFields.has(index)) ||
        [],
      relationships:
        editingEntity.relationships?.filter(
          (_, index) => !removedRelationships.has(index)
        ) || [],
    };

    // Ensure sample data is up to date
    if (needsSampleDataUpdate(finalEntity)) {
      finalEntity = updateEntityWithSampleData(finalEntity);
    }

    onSave(finalEntity);
  };

  const addField = () => {
    if (!newField.name?.trim()) {
      setFieldNameError(true);
      return;
    }
    setFieldNameError(false);

    const field: EntityField = {
      name: newField.name,
      type: newField.type || "text",
      required: newField.required || false,
      metadata: newField.metadata,
    };

    setEditingEntity((prev) => {
      const updatedEntity = {
        ...prev,
        fields: [...(prev.fields || []), field],
      };

      // Regenerate sample data with the new field
      return updateEntityWithSampleData(updatedEntity);
    });

    setNewField({ name: "", type: "text", required: false });
  };

  const removeField = (index: number) => {
    if (index >= originalFieldsCount) {
      // Truly remove new fields and regenerate sample data
      setEditingEntity((prev) => {
        const updatedEntity = {
          ...prev,
          fields: prev.fields?.filter((_, i) => i !== index) || [],
        };

        // Regenerate sample data without the removed field
        return updateEntityWithSampleData(updatedEntity);
      });
    } else {
      // Mark existing fields for removal (sample data will be regenerated on save)
      setRemovedFields((prev) => new Set([...prev, index]));
    }
  };

  const cancelRemoveField = (index: number) => {
    setRemovedFields((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const updateField = (index: number, field: EntityField) => {
    setEditingEntity((prev) => {
      const oldField = prev.fields?.[index];
      const updatedFields =
        prev.fields?.map((f, i) => (i === index ? field : f)) || [];

      // Check if field type or name changed - if so, regenerate sample data
      const typeChanged =
        oldField &&
        (oldField.type !== field.type || oldField.name !== field.name);

      let updatedEntity = {
        ...prev,
        fields: updatedFields,
      };

      // Regenerate sample data if field type or name changed
      if (typeChanged) {
        updatedEntity = updateEntityWithSampleData(updatedEntity);
      }

      return updatedEntity;
    });
  };

  const addRelationship = () => {
    if (!newRelationship.entity?.trim()) {
      setRelationshipEntityError(true);
      return;
    }
    setRelationshipEntityError(false);

    const relationship: EntityRelationship = {
      entity: newRelationship.entity,
      type: newRelationship.type || "one-to-many",
      description:
        newRelationship.description ||
        `${editingEntity.name} to ${newRelationship.entity}`,
      foreignKey: newRelationship.foreignKey,
    };

    setEditingEntity((prev) => ({
      ...prev,
      relationships: [...(prev.relationships || []), relationship],
    }));

    setNewRelationship({ entity: "", type: "one-to-many", description: "" });
  };

  const removeRelationship = (index: number) => {
    if (index >= originalRelationshipsCount) {
      // Truly remove new relationships
      setEditingEntity((prev) => ({
        ...prev,
        relationships: prev.relationships?.filter((_, i) => i !== index) || [],
      }));
    } else {
      // Mark existing relationships for removal
      setRemovedRelationships((prev) => new Set([...prev, index]));
    }
  };

  const cancelRemoveRelationship = (index: number) => {
    setRemovedRelationships((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const updateRelationship = (
    index: number,
    relationship: EntityRelationship
  ) => {
    setEditingEntity((prev) => ({
      ...prev,
      relationships:
        prev.relationships?.map((r, i) => (i === index ? relationship : r)) ||
        [],
    }));
  };

  const availableEntities = project.entities.filter(
    (e) => e.name !== editingEntity.name
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div>
                <h2 className="text-lg font-semibold">Edit Entity</h2>
                <p className="text-blue-100 text-sm">{editingEntity.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-md p-1 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto max-h-[calc(95vh-7rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Side - Basic Information */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 h-full flex flex-col">
                <h3 className="text-md font-medium text-gray-900 mb-4">
                  Basic Information
                </h3>
                <div className="flex flex-col space-y-3 flex-1">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Entity Name
                    </label>
                    <input
                      type="text"
                      value={editingEntity.name}
                      onChange={(e) =>
                        setEditingEntity((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editingEntity.metadata?.description || ""}
                      onChange={(e) =>
                        setEditingEntity((prev) => ({
                          ...prev,
                          metadata: {
                            ...prev.metadata,
                            description: e.target.value,
                          },
                        }))
                      }
                      placeholder="Entity description..."
                      className="flex-1 min-h-24 w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Tabs Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="border-b border-gray-200 mb-4">
                <nav className="flex space-x-6">
                  {(["fields", "relationships", "examples"] as const).map(
                    (tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-1.5 px-1 border-b-2 font-medium text-xs capitalize ${
                          activeTab === tab
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {tab}
                      </button>
                    )
                  )}
                </nav>
              </div>

              {/* Fields Tab */}
              {activeTab === "fields" && (
                <FieldsTab
                  editingEntity={editingEntity}
                  newField={newField}
                  fieldNameError={fieldNameError}
                  removedFields={removedFields}
                  originalFieldsCount={originalFieldsCount}
                  onNewFieldChange={setNewField}
                  onFieldNameError={setFieldNameError}
                  onAddField={addField}
                  onUpdateField={updateField}
                  onRemoveField={removeField}
                  onCancelRemoveField={cancelRemoveField}
                />
              )}

              {/* Relationships Tab */}
              {activeTab === "relationships" && (
                <RelationshipsTab
                  editingEntity={editingEntity}
                  newRelationship={newRelationship}
                  relationshipEntityError={relationshipEntityError}
                  removedRelationships={removedRelationships}
                  originalRelationshipsCount={originalRelationshipsCount}
                  availableEntities={availableEntities}
                  onNewRelationshipChange={setNewRelationship}
                  onRelationshipEntityError={setRelationshipEntityError}
                  onAddRelationship={addRelationship}
                  onUpdateRelationship={updateRelationship}
                  onRemoveRelationship={removeRelationship}
                  onCancelRemoveRelationship={cancelRemoveRelationship}
                />
              )}

              {/* Examples Tab */}
              {activeTab === "examples" && (
                <ExamplesTab editingEntity={editingEntity} />
              )}
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
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
