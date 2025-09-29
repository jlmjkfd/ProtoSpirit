import { useState, useRef, useEffect } from "react";

interface DescriptionInputProps {
  onSubmit: (description: string) => void;
  isLoading: boolean;
}

export function DescriptionInput({
  onSubmit,
  isLoading,
}: DescriptionInputProps) {
  const [description, setDescription] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const minLength = 10;
  const maxLength = 2000;
  const minHeight = 120; // minimum height in pixels
  const maxHeight = 300; // maximum height in pixels
  const isValid = description.trim().length >= minLength;

  const handleDescriptionChange = (value: string) => {
    if (value.length <= maxLength) {
      setDescription(value);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;

      if (scrollHeight < minHeight) {
        textarea.style.height = `${minHeight}px`;
        textarea.style.overflowY = "hidden";
      } else if (scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = "auto";
      } else {
        textarea.style.height = `${scrollHeight}px`;
        textarea.style.overflowY = "hidden";
      }
    }
  }, [description]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && !isLoading) {
      onSubmit(description.trim());
    }
  };

  const exampleDescriptions = [
    "I want to build a student management system where teachers can add courses, students can enroll in classes, and administrators can generate reports on student performance and attendance.",
    "Create an e-commerce platform where customers can browse products, add items to cart, make purchases, and sellers can manage their inventory and track orders.",
    "Design a project management tool where team members can create tasks, assign them to colleagues, track progress, and managers can view project timelines and resource allocation.",
    "Build a restaurant ordering system where customers can view menu items, place orders, make payments, and staff can manage orders and update menu availability.",
  ];

  const handleExampleClick = (example: string) => {
    setDescription(example);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header - Search Engine Style */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <div className="mx-auto w-full max-w-2xl text-center">
          {/* Title */}
          <h1 className="mb-2 text-4xl font-light text-gray-900">
            ProtoSpirit
          </h1>
          <p className="mb-12 text-lg text-gray-600">
            Describe your app idea and watch it come to life
          </p>

          {/* Main Search Interface */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative rounded-lg border border-gray-300 bg-white shadow-sm transition-shadow duration-200 focus-within:border-blue-500 focus-within:shadow-lg hover:shadow-md">
              <textarea
                ref={textareaRef}
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                className="w-full resize-none rounded-lg border-none bg-transparent px-6 py-4 text-lg text-gray-900 placeholder-gray-500 focus:outline-none"
                placeholder="Describe your app idea in detail..."
                disabled={isLoading}
                style={{ minHeight: `${minHeight}px` }}
              />

              {/* Bottom row with character count and button */}
              <div className="flex items-center justify-between px-6 pb-4">
                <div className="text-sm text-gray-500">
                  {description.length}/{maxLength}
                </div>
                <button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className={`rounded-md px-6 py-2 font-medium transition-colors ${
                    isValid && !isLoading
                      ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                      : "cursor-not-allowed bg-gray-300 text-gray-500"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="mr-2 -ml-1 h-4 w-4 animate-spin"
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
                      Analyzing...
                    </div>
                  ) : (
                    "Generate App"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Examples Section - Separated and Below */}
      <div className="bg-gray-50 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <h3 className="mb-8 text-center text-xl text-gray-700">
            Need inspiration? Try one of these examples:
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {exampleDescriptions.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleExampleClick(example)}
                disabled={isLoading}
                className="rounded-lg border border-gray-200 bg-white p-6 text-left text-gray-700 transition-all duration-200 hover:border-blue-300 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="text-sm leading-relaxed">{example}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
