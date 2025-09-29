import { useState, useEffect } from "react";
import type { Project } from "../../../types";

interface BasicSettingsProps {
  project: Project;
  projectData: {
    appName: string;
    description: string;
  };
  onUpdate: (updates: { appName?: string; description?: string }) => void;
  onDelete: () => void;
}

export function BasicSettings({
  project,
  projectData,
  onUpdate,
  onDelete,
}: BasicSettingsProps) {
  const [editingAppName, setEditingAppName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [tempAppName, setTempAppName] = useState(projectData.appName);
  const [tempDescription, setTempDescription] = useState(
    projectData.description
  );

  // Sync temp values when projectData changes
  useEffect(() => {
    if (!editingAppName) {
      setTempAppName(projectData.appName);
    }
    if (!editingDescription) {
      setTempDescription(projectData.description);
    }
  }, [
    projectData.appName,
    projectData.description,
    editingAppName,
    editingDescription,
  ]);

  const handleEditAppName = () => {
    setTempAppName(projectData.appName);
    setEditingAppName(true);
  };

  const handleConfirmAppName = () => {
    onUpdate({ appName: tempAppName });
    setEditingAppName(false);
  };

  const handleCancelAppName = () => {
    setTempAppName(projectData.appName);
    setEditingAppName(false);
  };

  const handleEditDescription = () => {
    setTempDescription(projectData.description);
    setEditingDescription(true);
  };

  const handleConfirmDescription = () => {
    onUpdate({ description: tempDescription });
    setEditingDescription(false);
  };

  const handleCancelDescription = () => {
    setTempDescription(projectData.description);
    setEditingDescription(false);
  };
  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          Basic Information
        </h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>
            Created{" "}
            {new Date(project.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span>•</span>
          <span>
            Updated{" "}
            {new Date(project.updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
      <div className="max-w-2xl space-y-6">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              App Name
            </label>
            {!editingAppName && (
              <button
                onClick={handleEditAppName}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                title="Edit app name"
              >
                ✏️ Edit
              </button>
            )}
          </div>
          {editingAppName ? (
            <div className="space-y-2">
              <input
                type="text"
                value={tempAppName}
                onChange={(e) => setTempAppName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter application name"
                autoFocus
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleConfirmAppName}
                  className="rounded-md bg-green-600 px-3 py-1 text-sm text-white transition-colors hover:bg-green-700"
                >
                  ✓ Confirm
                </button>
                <button
                  onClick={handleCancelAppName}
                  className="rounded-md bg-gray-300 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-400"
                >
                  ✕ Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900">
              {projectData.appName || "No app name set"}
            </div>
          )}
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            {!editingDescription && (
              <button
                onClick={handleEditDescription}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                title="Edit description"
              >
                ✏️ Edit
              </button>
            )}
          </div>
          {editingDescription ? (
            <div className="space-y-2">
              <textarea
                value={tempDescription}
                onChange={(e) => setTempDescription(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your application"
                autoFocus
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleConfirmDescription}
                  className="rounded-md bg-green-600 px-3 py-1 text-sm text-white transition-colors hover:bg-green-700"
                >
                  ✓ Confirm
                </button>
                <button
                  onClick={handleCancelDescription}
                  className="rounded-md bg-gray-300 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-400"
                >
                  ✕ Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="min-h-[100px] rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900">
              {projectData.description || "No description provided"}
            </div>
          )}
        </div>

        {/* Project Info */}
        <div className="rounded-lg bg-gray-50 p-4">
          <h4 className="mb-3 font-medium text-gray-900">
            Project Information
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Project ID:</span>
              <span className="font-mono text-gray-900">{project._id}</span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <h4 className="mb-3 font-medium text-red-900">Danger Zone</h4>
          <div className="flex items-start justify-between">
            <div>
              <h5 className="mb-1 font-medium text-red-900">Delete Project</h5>
              <p className="text-sm text-red-700">
                Permanently delete this project and all its data. This action
                cannot be undone.
              </p>
            </div>
            <button
              onClick={onDelete}
              className="ml-4 flex-shrink-0 rounded-md bg-red-600 px-4 py-2 text-sm text-white transition-colors hover:bg-red-700"
            >
              Delete Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
