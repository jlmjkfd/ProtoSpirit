import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Project } from "../../types";

interface ProjectCardProps {
  project: Project;
  onDelete: (projectId: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on the menu button or dropdown
    if (
      (e.target as HTMLElement).closest(".menu-button") ||
      (e.target as HTMLElement).closest(".menu-dropdown")
    ) {
      return;
    }
    navigate(`/projects/${project._id}`);
  };

  const handleDeleteClick = () => {
    setIsMenuOpen(false);
    onDelete(project._id);
  };

  return (
    <div
      className="group relative cursor-pointer rounded-lg border border-gray-200 bg-white transition-colors hover:border-gray-300"
      onClick={handleCardClick}
    >
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="mb-3 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
              {project.appName}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-gray-600">
              {project.description}
            </p>
          </div>

          {/* Three dots menu */}
          <div className="menu-button relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {isMenuOpen && (
              <div className="menu-dropdown absolute top-8 right-0 z-10 w-32 rounded-md border border-gray-200 bg-white shadow-lg">
                <button
                  onClick={handleDeleteClick}
                  className="w-full rounded-md px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Project Stats */}
        <div className="mb-4 flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <svg
              className="mr-1 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
            {project.entities.length} entities
          </div>
          <div className="flex items-center">
            <svg
              className="mr-1 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            {project.roles.length} roles
          </div>
          <div className="flex items-center">
            <svg
              className="mr-1 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {project.features.length} features
          </div>
        </div>

        {/* Entities Preview */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {project.entities.slice(0, 3).map((entity, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded bg-blue-50 px-2 py-1 text-xs text-blue-700"
              >
                {entity.name}
              </span>
            ))}
            {project.entities.length > 3 && (
              <span className="inline-flex items-center rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                +{project.entities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Roles Preview */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {project.roles.slice(0, 4).map((role, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded bg-green-50 px-2 py-1 text-xs text-green-700"
                title={role.description}
              >
                {role.name}
              </span>
            ))}
            {project.roles.length > 4 && (
              <span className="inline-flex items-center rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                +{project.roles.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="rounded-b-lg border-t border-gray-100 bg-gray-50 px-6 py-4">
        {/* Created Date */}
        <div className="text-xs text-gray-400">
          Created {formatDate(project.createdAt)}
        </div>
      </div>
    </div>
  );
}
