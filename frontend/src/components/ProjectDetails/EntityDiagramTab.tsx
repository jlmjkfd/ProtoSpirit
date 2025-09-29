import { useState, useCallback, useMemo, useEffect } from "react";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  ReactFlowProvider,
  MarkerType,
} from "reactflow";
import type { Node, Edge, Connection } from "reactflow";
import "reactflow/dist/style.css";
import type { Project, Entity, EntityRelationship } from "../../types";
import { EntityNodeComponent } from "./EntityDiagram/EntityNode";
import { EntityEditModal } from "./modals/EntityEditModal";

interface EntityDiagramTabProps {
  project: Project;
  onUpdateProject: (updatedProject: Project) => void;
}

export function EntityDiagramTab({
  project,
  onUpdateProject,
}: EntityDiagramTabProps) {
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle entity edit
  const handleEntityEdit = useCallback((entity: Entity) => {
    setEditingEntity(entity);
    setIsModalOpen(true);
  }, []);

  // Handle entity delete
  const handleEntityDelete = useCallback(
    (entityName: string) => {
      // Remove the entity from the project
      const updatedEntities = project.entities.filter(
        (e) => e.name !== entityName
      );

      // Clean up relationships that reference the deleted entity
      const cleanedEntities = updatedEntities.map((entity) => ({
        ...entity,
        relationships:
          entity.relationships?.filter((rel) => rel.entity !== entityName) ||
          [],
      }));

      const updatedProject = {
        ...project,
        entities: cleanedEntities,
      };

      onUpdateProject(updatedProject);
    },
    [project, onUpdateProject]
  );

  // Convert project entities to ReactFlow nodes
  const initialNodes: Node[] = useMemo(() => {
    if (!project.entities) return [];

    return project.entities.map((entity, index) => {
      // Calculate initial positions in a smart layout
      const cols = Math.ceil(Math.sqrt(project.entities.length));
      const row = Math.floor(index / cols);
      const col = index % cols;
      const spacing = 350;

      return {
        id: entity.name,
        type: "entityNode",
        position: {
          x: col * spacing + 50,
          y: row * spacing + 50,
        },
        data: {
          entity,
          onEdit: handleEntityEdit,
        },
        draggable: true,
      };
    });
  }, [project.entities]);

  // Convert project relationships to ReactFlow edges
  const computedEdges: Edge[] = useMemo(() => {
    if (!project.entities) return [];

    const edges: Edge[] = [];
    const processedRelationships = new Set<string>();

    project.entities.forEach((entity) => {
      entity.relationships?.forEach((rel) => {
        const relationshipKey = createRelationshipKey(entity.name, rel.entity);
        const reverseKey = createRelationshipKey(rel.entity, entity.name);

        // Skip if we've already processed this relationship
        if (
          processedRelationships.has(relationshipKey) ||
          processedRelationships.has(reverseKey)
        ) {
          return;
        }

        // Basic edge styling based on relationship type
        let edgeColor = "#6b7280"; // gray-500
        let strokeWidth = 2;

        switch (rel.type) {
          case "one-to-one":
            edgeColor = "#3b82f6"; // blue-500
            break;
          case "one-to-many":
            edgeColor = "#10b981"; // emerald-500
            strokeWidth = 3;
            break;
          case "many-to-one":
            edgeColor = "#f59e0b"; // amber-500
            strokeWidth = 3;
            break;
          case "many-to-many":
            edgeColor = "#ef4444"; // red-500
            strokeWidth = 4;
            break;
        }

        edges.push({
          id: `${entity.name}-${rel.entity}`,
          source: entity.name,
          target: rel.entity,
          type: "smoothstep",
          animated: false,
          style: { stroke: edgeColor, strokeWidth },
          markerEnd: { type: MarkerType.Arrow, color: edgeColor },
          label: rel.type,
          labelStyle: { fontSize: 12, fontWeight: 500 },
        });

        processedRelationships.add(relationshipKey);
      });
    });

    return edges;
  }, [project.entities]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(computedEdges);

  // Update handleEntityDelete to also manage ReactFlow state
  const handleEntityDeleteWithVisuals = useCallback(
    (entityName: string) => {
      handleEntityDelete(entityName);

      // Remove the corresponding node and edges from the diagram
      setNodes((nodes) => nodes.filter((node) => node.id !== entityName));
      setEdges((edges) =>
        edges.filter(
          (edge) => edge.source !== entityName && edge.target !== entityName
        )
      );
    },
    [handleEntityDelete, setNodes, setEdges]
  );

  // Update edges when project entities change
  useEffect(() => {
    setEdges(computedEdges);
  }, [computedEdges, setEdges]);

  // Update node data with delete handlers after they're defined
  useEffect(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onDelete: handleEntityDeleteWithVisuals,
        },
      }))
    );
  }, [handleEntityDeleteWithVisuals, setNodes]);

  // Update existing nodes with latest entity data when project changes
  useEffect(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        const updatedEntity = project.entities.find((e) => e.name === node.id);
        if (updatedEntity) {
          return {
            ...node,
            data: {
              ...node.data,
              entity: updatedEntity,
            },
          };
        }
        return node;
      })
    );
  }, [project.entities, setNodes]);

  // Custom node types
  const nodeTypes = useMemo(
    () => ({
      entityNode: EntityNodeComponent,
    }),
    []
  );

  // Handle entity save (both create and update)
  const handleEntitySave = useCallback(
    (updatedEntity: Entity) => {
      // Check if this is a new entity (not in the current project)
      const isNewEntity = !project.entities.find(
        (e) => e.name === editingEntity?.name
      );

      let updatedEntities;
      if (isNewEntity) {
        // Adding new entity
        updatedEntities = [...project.entities, updatedEntity];
      } else {
        // Updating existing entity
        updatedEntities = project.entities.map((entity) =>
          entity.name === editingEntity?.name ? updatedEntity : entity
        );
      }

      const updatedProject = {
        ...project,
        entities: updatedEntities,
      };

      onUpdateProject(updatedProject);
      setIsModalOpen(false);
      setEditingEntity(null);

      if (isNewEntity) {
        // Calculate position for new node (avoid overlaps)
        const cols = Math.ceil(Math.sqrt(nodes.length + 1));
        const newIndex = nodes.length;
        const row = Math.floor(newIndex / cols);
        const col = newIndex % cols;
        const spacing = 350;

        // Add new node to diagram
        const newNode: Node = {
          id: updatedEntity.name,
          type: "entityNode",
          position: {
            x: col * spacing + 50,
            y: row * spacing + 50,
          },
          data: {
            entity: updatedEntity,
            onEdit: handleEntityEdit,
          },
          draggable: true,
        };

        setNodes((currentNodes) => [...currentNodes, newNode]);
      } else {
        // Update existing node data
        setNodes((nodes) =>
          nodes.map((node) =>
            node.id === editingEntity?.name
              ? {
                  ...node,
                  id: updatedEntity.name, // Handle name changes
                  data: {
                    ...node.data,
                    entity: updatedEntity,
                  },
                }
              : node
          )
        );
      }
    },
    [project, editingEntity, onUpdateProject, setNodes, nodes, handleEntityEdit]
  );

  // Handle adding new relationships by connecting edges
  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target || params.source === params.target)
        return;

      // Add the new relationship to the source entity
      const updatedEntities = project.entities.map((entity) => {
        if (entity.name === params.source) {
          const newRelationship: EntityRelationship = {
            entity: params.target!,
            type: "one-to-many", // Default type, can be edited later
            description: `${params.source} to ${params.target}`,
          };

          return {
            ...entity,
            relationships: [...(entity.relationships || []), newRelationship],
          };
        }
        return entity;
      });

      const updatedProject = {
        ...project,
        entities: updatedEntities,
      };

      onUpdateProject(updatedProject);

      // Add the edge to ReactFlow with basic styling
      const newEdge: Edge = {
        id: `${params.source}-${params.target}`,
        source: params.source,
        target: params.target!,
        type: "smoothstep",
        animated: false,
        style: { stroke: "#10b981", strokeWidth: 3 },
        markerEnd: { type: MarkerType.Arrow, color: "#10b981" },
        label: "one-to-many",
        labelStyle: { fontSize: 12, fontWeight: 500 },
      };

      setEdges((eds) => addEdge(newEdge, eds));
    },
    [project, onUpdateProject, setEdges]
  );

  // Handle deleting relationships
  const onEdgesDelete = useCallback(
    (edgesToDelete: Edge[]) => {
      edgesToDelete.forEach((edge) => {
        // Remove the relationship from the project data
        const updatedEntities = project.entities.map((entity) => {
          if (entity.name === edge.source) {
            return {
              ...entity,
              relationships:
                entity.relationships?.filter(
                  (rel) => !(rel.entity === edge.target)
                ) || [],
            };
          }
          return entity;
        });

        const updatedProject = {
          ...project,
          entities: updatedEntities,
        };

        onUpdateProject(updatedProject);
      });
    },
    [project, onUpdateProject]
  );

  // Helper function to get next entity number
  const getNextEntityNumber = useCallback(() => {
    const existingNumbers = project.entities
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

    // Fallback (should never reach here)
    return Math.max(...existingNumbers) + 1;
  }, [project.entities]);

  // Add new entity function - now just opens modal with template
  const handleAddEntity = useCallback(() => {
    const entityNumber = getNextEntityNumber();
    const newEntity: Entity = {
      name: `NewEntity${entityNumber}`,
      fields: [
        { name: "id", type: "number", required: true },
        { name: "name", type: "text", required: true },
      ],
      relationships: [],
      examples: [],
      metadata: {
        description: `New entity ${entityNumber}`,
      },
    };

    // Just open the modal with the template entity (don't save yet)
    setEditingEntity(newEntity);
    setIsModalOpen(true);
  }, [getNextEntityNumber]);

  // Auto-layout function
  const autoLayout = useCallback(() => {
    const layoutedNodes = nodes.map((node, index) => {
      const cols = Math.ceil(Math.sqrt(nodes.length));
      const row = Math.floor(index / cols);
      const col = index % cols;
      const spacing = 350;

      return {
        ...node,
        position: {
          x: col * spacing + 50,
          y: row * spacing + 50,
        },
      };
    });

    setNodes(layoutedNodes);
  }, [nodes, setNodes]);

  return (
    <div className="relative h-[800px] w-full rounded-lg border border-gray-200 bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgesDelete={onEdgesDelete}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#f1f5f9" gap={20} />
      </ReactFlow>

      {/* Simple Toolbar */}
      <div className="absolute top-4 left-4 z-10">
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-md">
          <div className="mb-2 flex items-center space-x-2">
            <button
              onClick={handleAddEntity}
              className="rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
            >
              Add Entity
            </button>
            <button
              onClick={autoLayout}
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Auto Layout
            </button>
          </div>
        </div>
      </div>

      {/* Entity Edit Modal */}
      {isModalOpen && editingEntity && (
        <EntityEditModal
          entity={editingEntity}
          project={project}
          onSave={handleEntitySave}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEntity(null);
          }}
        />
      )}
    </div>
  );
}

// Wrapper component with ReactFlowProvider
export function EntityDiagramProvider(props: EntityDiagramTabProps) {
  return (
    <ReactFlowProvider>
      <EntityDiagramTab {...props} />
    </ReactFlowProvider>
  );
}

// Helper functions
function createRelationshipKey(entity1: string, entity2: string): string {
  return [entity1, entity2].sort().join("|");
}
