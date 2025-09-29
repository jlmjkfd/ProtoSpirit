import { useState, useEffect } from 'react';
import type { Project } from '../../../types';

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
  onDelete
}: BasicSettingsProps) {
  const [editingAppName, setEditingAppName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [tempAppName, setTempAppName] = useState(projectData.appName);
  const [tempDescription, setTempDescription] = useState(projectData.description);

  // Sync temp values when projectData changes
  useEffect(() => {
    if (!editingAppName) {
      setTempAppName(projectData.appName);
    }
    if (!editingDescription) {
      setTempDescription(projectData.description);
    }
  }, [projectData.appName, projectData.description, editingAppName, editingDescription]);

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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Basic Information</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Created {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span>•</span>
          <span>Updated {new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>
      <div className="space-y-6 max-w-2xl">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">App Name</label>
            {!editingAppName && (
              <button
                onClick={handleEditAppName}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter application name"
                autoFocus
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleConfirmAppName}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                >
                  ✓ Confirm
                </button>
                <button
                  onClick={handleCancelAppName}
                  className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 transition-colors"
                >
                  ✕ Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
              {projectData.appName || 'No app name set'}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            {!editingDescription && (
              <button
                onClick={handleEditDescription}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your application"
                autoFocus
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleConfirmDescription}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                >
                  ✓ Confirm
                </button>
                <button
                  onClick={handleCancelDescription}
                  className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 transition-colors"
                >
                  ✕ Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 min-h-[100px]">
              {projectData.description || 'No description provided'}
            </div>
          )}
        </div>

        {/* Project Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Project Information</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Project ID:</span>
              <span className="font-mono text-gray-900">{project._id}</span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-900 mb-3">Danger Zone</h4>
          <div className="flex items-start justify-between">
            <div>
              <h5 className="font-medium text-red-900 mb-1">Delete Project</h5>
              <p className="text-sm text-red-700">
                Permanently delete this project and all its data. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={onDelete}
              className="ml-4 px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors flex-shrink-0"
            >
              Delete Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}