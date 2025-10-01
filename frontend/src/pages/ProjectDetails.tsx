import { useState, useEffect } from "react";
import {
  useParams,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Header } from "../components/Header";
import { ProjectDetailsTab } from "../components/ProjectDetails/ProjectDetailsTab";
import { EntityDiagramProvider } from "../components/ProjectDetails/EntityDiagramTab";
import { UIReviewTab } from "../components/ProjectDetails/UIReviewTab";
import apiService from "../services/api";
import type { Project } from "../types";

type TabType = "details" | "diagram" | "preview";

export function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadProject(id);
    }
  }, [id]);

  // Handle tab query parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab") as TabType;
    if (tabParam && ["details", "diagram", "preview"].includes(tabParam)) {
      setActiveTab(tabParam);
    } else if (tabParam && ["overview", "settings"].includes(tabParam)) {
      // Redirect old tab names to details
      setActiveTab("details");
    }
  }, [searchParams]);

  const loadProject = async (projectId: string) => {
    try {
      const response = await apiService.getProject(projectId);
      if (response.success && response.data) {
        setProject(response.data);
      } else {
        throw new Error("Project not found");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load project";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;

    if (
      !confirm(
        `Are you sure you want to delete "${project.appName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await apiService.deleteProject(project._id);
      navigate("/projects");
    } catch (err: unknown) {
      console.error("Failed to delete project:", err);
      alert("Failed to delete project. Please try again.");
    }
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    setProject(updatedProject);

    // Save to database
    try {
      const response = await apiService.updateProject(updatedProject._id, {
        appName: updatedProject.appName,
        description: updatedProject.description,
        entities: updatedProject.entities,
        roles: updatedProject.roles,
        features: updatedProject.features,
      });

      if (!response.success) {
        throw new Error("Failed to update project");
      }
    } catch (err: unknown) {
      console.error("Failed to save project:", err);
      alert("Failed to save project changes. Please try again.");
      // Optionally reload the project from server to revert changes
      loadProject(updatedProject._id);
    }
  };

  const tabs = [
    { id: "preview", name: "UI Preview", special: true },
    { id: "details", name: "Project Details" },
    { id: "diagram", name: "Entity Diagram" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <svg
                className="h-8 w-8 animate-spin text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-gray-600">Loading project...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <div className="mb-4 text-red-400">
              <svg
                className="mx-auto h-12 w-12"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Project not found
            </h3>
            <p className="mb-4 text-gray-600">
              {error ||
                "The project you're looking for doesn't exist or you don't have permission to view it."}
            </p>
            <Link
              to="/projects"
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Project Header */}
        <div className="mb-8">
          {/* Back Button */}
          <div className="mb-4">
            <Link
              to="/projects"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <svg
                className="mr-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Projects
            </Link>
          </div>

          {/* Project Title */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {project.appName}
            </h1>
            <p className="mt-1 text-gray-600">{project.description}</p>
          </div>

          {/* Project Meta */}
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div>
              Created {new Date(project.createdAt).toLocaleDateString()}
            </div>
            <div>
              Updated {new Date(project.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-6">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const isSpecial = tab.special;

              if (isSpecial) {
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`relative transform rounded-t-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-200 hover:scale-105 ${
                      isActive
                        ? "border-b-2 border-purple-600 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                        : "border-b-2 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:from-purple-600 hover:to-pink-600"
                    }`}
                  >
                    {tab.name}
                    {isActive && (
                      <div className="absolute right-0 -bottom-px left-0 h-0.5 bg-white"></div>
                    )}
                  </button>
                );
              }

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`border-b-2 px-1 py-2 text-sm font-medium whitespace-nowrap ${
                    isActive
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="rounded-lg border border-gray-200 bg-white">
          {activeTab === "details" && (
            <ProjectDetailsTab
              project={project}
              onDelete={handleDeleteProject}
              onUpdate={handleUpdateProject}
            />
          )}

          {activeTab === "diagram" && (
            <div className="p-6">
              <div className="mb-4">
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                  Entity Relationship Diagram
                </h2>
                <p className="text-gray-600">
                  Visual representation of your app's data entities and their
                  relationships. Click entities to edit fields and
                  relationships, or drag to connect new relationships between
                  entities.
                </p>
              </div>
              <EntityDiagramProvider
                project={project}
                onUpdateProject={handleUpdateProject}
              />
            </div>
          )}

          {activeTab === "preview" && <UIReviewTab project={project} />}
        </div>
      </div>
    </div>
  );
}
