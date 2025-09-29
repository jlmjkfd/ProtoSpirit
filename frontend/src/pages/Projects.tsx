import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { ProjectCard } from '../components/Projects/ProjectCard';
import { ProjectFilters } from '../components/Projects/ProjectFilters';
import { EmptyProjects } from '../components/Projects/EmptyProjects';
import apiService from '../services/api';
import type { Project } from '../types';

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');

  // Load projects
  useEffect(() => {
    loadProjects();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...projects];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.appName.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.features.some(feature => {
          const featureName = typeof feature === 'string' ? feature : feature.name;
          return featureName.toLowerCase().includes(query);
        }) ||
        project.roles.some(role => role.name?.toLowerCase().includes(query) || role.description?.toLowerCase().includes(query))
      );
    }

    // Default sorting by newest first
    filtered.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredProjects(filtered);
  }, [projects, searchQuery]);

  const loadProjects = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getProjects();
      if (response.success) {
        setProjects(response.data || []);
      } else {
        throw new Error('Failed to load projects');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load projects';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    const projectToDelete = projects.find(p => p._id === projectId);
    if (!projectToDelete) return;

    if (!confirm(`Are you sure you want to delete "${projectToDelete.appName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiService.deleteProject(projectId);
      // Remove project from local state
      setProjects(prev => prev.filter(p => p._id !== projectId));
    } catch (err: unknown) {
      console.error('Failed to delete project:', err);
      alert('Failed to delete project. Please try again.');
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Projects ({projects.length})</h1>
              <p className="text-gray-600 mt-1">
                Manage and view your app prototypes
              </p>
            </div>

            {projects.length > 0 && (
              <Link
                to="/create"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New App
              </Link>
            )}
          </div>

        </div>

        {/* Search */}
        <ProjectFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading projects</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button
                  onClick={loadProjects}
                  className="mt-2 text-sm text-red-800 underline hover:text-red-900"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-600">Loading projects...</span>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {!isLoading && !error && (
          <>
            {filteredProjects.length === 0 ? (
              projects.length === 0 ? (
                <EmptyProjects />
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                  <p className="text-gray-600 mb-4">
                    No projects match your search query. Try adjusting your search.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear search
                  </button>
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onDelete={handleDeleteProject}
                  />
                ))}
              </div>
            )}

            {/* Results Summary */}
            {filteredProjects.length > 0 && (
              <div className="mt-8 text-center text-sm text-gray-600">
                Showing {filteredProjects.length} of {projects.length} projects
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}