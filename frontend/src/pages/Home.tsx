import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Header } from "../components/Header";

export const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header showNavigation={false} showLoginWhenNotAuth={true} />

      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mb-6 text-5xl font-bold text-gray-900">
            Transform Ideas into
            <span className="text-blue-600"> App Prototypes</span>
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600">
            Describe your app in plain English and watch ProtoSpirit generate
            beautiful, functional UI mockups with forms, tables, and navigation
            - powered by AI.
          </p>

          {isAuthenticated ? (
            <div className="space-x-4">
              <Link
                to="/create"
                className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-blue-700"
              >
                Create Your App
              </Link>
              <Link
                to="/projects"
                className="rounded-lg border border-blue-600 bg-white px-8 py-3 text-lg font-medium text-blue-600 transition-colors hover:bg-blue-50"
              >
                View Projects
              </Link>
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                to="/login"
                className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <svg
                className="h-6 w-6 text-blue-600"
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
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              AI-Powered Analysis
            </h3>
            <p className="text-gray-600">
              Describe your app in natural language and let our AI extract
              entities, roles, and features automatically using Google Gemini.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
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
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Dynamic UI Generation
            </h3>
            <p className="text-gray-600">
              Generate forms, tables, and navigation menus automatically based
              on your app requirements. No coding required.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <svg
                className="h-6 w-6 text-purple-600"
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
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Project Management
            </h3>
            <p className="text-gray-600">
              Save, organize, and iterate on your app prototypes. Track your
              projects and share them with your team.
            </p>
          </div>
        </div>

        {/* Example */}
        <div className="mt-20 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">
              How it works
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
              <div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="mr-4 flex aspect-square h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Describe your app
                      </h4>
                      <p className="text-sm text-gray-600">
                        "I want an app to manage student courses and grades.
                        Teachers add courses, students enroll, and admins manage
                        reports."
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 flex aspect-square h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        AI extracts requirements
                      </h4>
                      <p className="text-sm text-gray-600">
                        Entities: Student, Course, Grade
                        <br />
                        Roles: Teacher, Student, Admin
                        <br />
                        Features: Add course, Enroll students, View reports
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 flex aspect-square h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Generate UI mockup
                      </h4>
                      <p className="text-sm text-gray-600">
                        Forms for each entity, role-based navigation, and
                        feature menus automatically created.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-gray-100 p-6">
                <div className="text-center text-gray-500">
                  <div className="rounded-lg bg-white p-4 shadow-sm">
                    <div className="mb-4 flex space-x-2">
                      <div className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-800">
                        Student
                      </div>
                      <div className="rounded bg-green-100 px-3 py-1 text-sm text-green-800">
                        Teacher
                      </div>
                      <div className="rounded bg-purple-100 px-3 py-1 text-sm text-purple-800">
                        Admin
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 rounded bg-gray-200"></div>
                      <div className="h-3 w-3/4 rounded bg-gray-200"></div>
                      <div className="h-3 w-1/2 rounded bg-gray-200"></div>
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
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Ready to bring your ideas to life?
            </h2>
            <p className="mb-8 text-lg text-gray-600">
              Join ProtoSpirit today and start creating app prototypes in
              minutes.
            </p>
            <Link
              to="/login"
              className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-blue-700"
            >
              Sign In to Get Started
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
