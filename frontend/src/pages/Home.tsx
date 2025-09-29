import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Header } from "../components/Header";

export const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header showNavigation={false} showLoginWhenNotAuth={true} />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Ideas into
            <span className="text-blue-600"> App Prototypes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Describe your app in plain English and watch ProtoSpirit generate
            beautiful, functional UI mockups with forms, tables, and navigation
            - powered by AI.
          </p>

          {isAuthenticated ? (
            <div className="space-x-4">
              <Link
                to="/create"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Create Your App
              </Link>
              <Link
                to="/projects"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium border border-blue-600 hover:bg-blue-50 transition-colors"
              >
                View Projects
              </Link>
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                to="/login"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              AI-Powered Analysis
            </h3>
            <p className="text-gray-600">
              Describe your app in natural language and let our AI extract
              entities, roles, and features automatically using Google Gemini.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M13 13h4a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4a2 2 0 012-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Dynamic UI Generation
            </h3>
            <p className="text-gray-600">
              Generate forms, tables, and navigation menus automatically based
              on your app requirements. No coding required.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Project Management
            </h3>
            <p className="text-gray-600">
              Save, organize, and iterate on your app prototypes. Track your
              projects and share them with your team.
            </p>
          </div>
        </div>

        {/* Example */}
        <div className="mt-20 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              How it works
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 aspect-square bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Describe your app
                      </h4>
                      <p className="text-gray-600 text-sm">
                        "I want an app to manage student courses and grades.
                        Teachers add courses, students enroll, and admins manage
                        reports."
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 aspect-square bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        AI extracts requirements
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Entities: Student, Course, Grade
                        <br />
                        Roles: Teacher, Student, Admin
                        <br />
                        Features: Add course, Enroll students, View reports
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 aspect-square bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Generate UI mockup
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Forms for each entity, role-based navigation, and
                        feature menus automatically created.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-6">
                <div className="text-center text-gray-500">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex space-x-2 mb-4">
                      <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        Student
                      </div>
                      <div className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm">
                        Teacher
                      </div>
                      <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                        Admin
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="mt-4 text-xs text-gray-400">
                      Generated UI Preview
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        {!isAuthenticated && (
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to bring your ideas to life?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join ProtoSpirit today and start creating app prototypes in
              minutes.
            </p>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Sign In to Get Started
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>
              &copy; 2024 ProtoSpirit. Built with React, Node.js, and Google
              Gemini AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
