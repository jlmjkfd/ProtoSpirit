import type { Project } from "../../types";

interface ProjectSummaryProps {
  project: Project;
  onStartOver: () => void;
  onGoToProject: () => void;
}

export function ProjectSummary({
  project,
  onStartOver,
  onGoToProject,
}: ProjectSummaryProps) {
  return (
    <div className="p-6 text-center">
      {/* Success Icon */}
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg
          className="h-8 w-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Success Message */}
      <h3 className="mb-2 text-2xl font-bold text-gray-900">
        🎉 Your App is Ready!
      </h3>
      <p className="mb-8 text-lg text-gray-600">
        "{project.appName}" has been successfully created with all your
        requirements.
      </p>

      {/* Project Summary */}
      <div className="mb-8 rounded-lg bg-gray-50 p-6 text-left">
        <h4 className="mb-4 text-lg font-semibold text-gray-900">
          Project Summary
        </h4>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h5 className="mb-2 font-medium text-gray-700">
              Data Entities ({project.entities.length})
            </h5>
            <ul className="space-y-1">
              {project.entities.map((entity, index) => (
                <li
                  key={index}
                  className="flex items-center text-sm text-gray-600"
                >
                  <svg
                    className="mr-2 h-4 w-4 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {entity.name} ({entity.fields.length} fields)
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="mb-2 font-medium text-gray-700">
              User Roles ({project.roles.length})
            </h5>
            <ul className="space-y-1">
              {project.roles.map((role, index) => (
                <li
                  key={index}
                  className="flex items-center text-sm text-gray-600"
                >
                  <svg
                    className="mr-2 h-4 w-4 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {role.name} ({role.features?.length || 0} features)
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <h5 className="mb-2 font-medium text-gray-700">
            Features ({project.features.length})
          </h5>
          <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
            {project.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center text-sm text-gray-600"
              >
                <svg
                  className="mr-2 h-4 w-4 text-purple-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {typeof feature === "string" ? feature : feature.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <button
          onClick={onGoToProject}
          className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          View Project Details
        </button>

        <button
          onClick={onStartOver}
          className="rounded-lg border border-gray-300 px-8 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Create Another App
        </button>
      </div>

      {/* Project Info */}
      <div className="mt-8 text-sm text-gray-500">
        <p>Project ID: {project._id}</p>
        <p>Created: {new Date(project.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
