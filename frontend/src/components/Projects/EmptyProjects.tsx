import { Link } from "react-router-dom";

export function EmptyProjects() {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto max-w-md">
        {/* Illustration */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
          <svg
            className="h-12 w-12 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>

        {/* Content */}
        <h3 className="mb-2 text-xl font-semibold text-gray-900">
          No projects yet
        </h3>
        <p className="mb-8 text-gray-600">
          Get started by creating your first app prototype. Describe your idea
          in natural language and let our AI generate the structure for you.
        </p>

        {/* CTA Button */}
        <Link
          to="/create"
          className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          <svg
            className="mr-2 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Create Your First App
        </Link>
      </div>
    </div>
  );
}
