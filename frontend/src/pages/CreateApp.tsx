import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { DescriptionInput } from "../components/CreateApp/DescriptionInput";
import { RequirementsReview } from "../components/CreateApp/RequirementsReview";
import { ProjectSummary } from "../components/CreateApp/ProjectSummary";
import apiService from "../services/api";
import type { ExtractedRequirements, Project } from "../types";

type CreateStep = "input" | "review" | "complete";

export function CreateApp() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CreateStep>("input");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step data
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] =
    useState<ExtractedRequirements | null>(null);
  const [project, setProject] = useState<Project | null>(null);

  const handleDescriptionSubmit = async (desc: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.extractRequirements(desc);
      if (response.success) {
        setDescription(desc);
        setRequirements(response.data);
        console.log(response);
        setCurrentStep("review");
      } else {
        throw new Error("Failed to extract requirements");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to extract requirements";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequirementsConfirm = async (
    confirmedRequirements: ExtractedRequirements
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // Save project
      const projectResponse = await apiService.createProject({
        appName: confirmedRequirements.appName,
        description,
        entities: confirmedRequirements.entities,
        roles: confirmedRequirements.roles,
        features: confirmedRequirements.features,
      });

      if (projectResponse.success && projectResponse.data) {
        const savedProject = projectResponse.data;
        setProject(savedProject);
        setCurrentStep("complete");
      } else {
        throw new Error("Failed to save project");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create project";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setCurrentStep("input");
    setDescription("");
    setRequirements(null);
    setProject(null);
    setError(null);
  };

  const handleGoToProject = () => {
    if (project) {
      navigate(`/projects/${project._id}?tab=preview`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* User Description Display */}
        {description && currentStep !== "input" && (
          <div className="mb-6 rounded-md border border-blue-200 bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Your App Description
                </h3>
                <p className="mt-1 text-sm text-blue-700">{description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          {currentStep === "input" && (
            <DescriptionInput
              onSubmit={handleDescriptionSubmit}
              isLoading={isLoading}
            />
          )}

          {currentStep === "review" && requirements && (
            <RequirementsReview
              requirements={requirements}
              onConfirm={handleRequirementsConfirm}
              onBack={() => setCurrentStep("input")}
              isLoading={isLoading}
            />
          )}

          {currentStep === "complete" && project && (
            <ProjectSummary
              project={project}
              onStartOver={handleStartOver}
              onGoToProject={handleGoToProject}
            />
          )}
        </div>
      </div>
    </div>
  );
}
