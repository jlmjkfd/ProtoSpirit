import { useState, useRef, useEffect } from 'react';

interface DescriptionInputProps {
  onSubmit: (description: string) => void;
  isLoading: boolean;
}

export function DescriptionInput({ onSubmit, isLoading }: DescriptionInputProps) {
  const [description, setDescription] = useState('');
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
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;

      if (scrollHeight < minHeight) {
        textarea.style.height = `${minHeight}px`;
        textarea.style.overflowY = 'hidden';
      } else if (scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.height = `${scrollHeight}px`;
        textarea.style.overflowY = 'hidden';
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - Search Engine Style */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-8">
        <div className="w-full max-w-2xl mx-auto text-center">
          {/* Title */}
          <h1 className="text-4xl font-light text-gray-900 mb-2">
            ProtoSpirit
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            Describe your app idea and watch it come to life
          </p>

          {/* Main Search Interface */}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 focus-within:shadow-lg focus-within:border-blue-500">
              <textarea
                ref={textareaRef}
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                className="w-full px-6 py-4 text-lg text-gray-900 bg-transparent border-none rounded-lg resize-none focus:outline-none placeholder-gray-500"
                placeholder="Describe your app idea in detail..."
                disabled={isLoading}
                style={{ minHeight: `${minHeight}px` }}
              />

              {/* Bottom row with character count and button */}
              <div className="flex justify-between items-center px-6 pb-4">
                <div className="text-sm text-gray-500">
                  {description.length}/{maxLength}
                </div>
                <button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    isValid && !isLoading
                      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </div>
                  ) : (
                    'Generate App'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Examples Section - Separated and Below */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-center text-xl text-gray-700 mb-8">
            Need inspiration? Try one of these examples:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exampleDescriptions.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleExampleClick(example)}
                disabled={isLoading}
                className="text-left p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-sm leading-relaxed">
                  {example}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}