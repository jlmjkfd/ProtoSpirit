import type { Entity } from "../../../../types";

interface ExamplesTabProps {
  editingEntity: Entity;
}

export function ExamplesTab({ editingEntity }: ExamplesTabProps) {
  return (
    <div>
      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-900">Sample Data</h4>
      </div>

      {editingEntity.examples && editingEntity.examples.length > 0 ? (
        <div className="space-y-3">
          {editingEntity.examples.map((example, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-3 border border-gray-200"
            >
              <div className="text-xs font-medium text-gray-500 mb-2">
                Example {index + 1}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(example).map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <span className="font-medium text-gray-700">{key}:</span>{" "}
                    <span className="text-gray-900">
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="text-gray-400 mb-2">📋</div>
          <p className="text-sm text-gray-600">No sample data available</p>
          <p className="text-xs text-gray-500 mt-2">
            Sample data is automatically generated when entity fields are
            defined
          </p>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-3">
        Sample data is automatically generated based on the entity fields when
        the entity is saved.
      </p>
    </div>
  );
}
