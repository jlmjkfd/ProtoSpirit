interface ProjectFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ProjectFilters({
  searchQuery,
  onSearchChange,
}: ProjectFiltersProps) {
  return (
    <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          id="search"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 leading-5 placeholder-gray-500 focus:border-blue-500 focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          placeholder="Search by name, description, features, or roles..."
        />
      </div>
    </div>
  );
}
