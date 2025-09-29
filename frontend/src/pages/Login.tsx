import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { LoginCredentials, FormErrors } from "../types";

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [credentials, setCredentials] = useState<LoginCredentials>({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/projects";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!credentials.identifier.trim()) {
      newErrors.identifier = "Username or email is required";
    }

    if (!credentials.password) {
      newErrors.password = "Password is required";
    } else if (credentials.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await login(credentials);
      // Navigation will be handled by useEffect
    } catch (error: unknown) {
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "Login failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">ProtoSpirit</h1>
          <h2 className="mb-8 text-xl text-gray-600">
            Sign in to your account
          </h2>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {errors.submit}
            </div>
          )}

          <div>
            <label
              htmlFor="identifier"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Username or Email
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              value={credentials.identifier}
              onChange={handleChange}
              className={`w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.identifier ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter your username or email"
            />
            {errors.identifier && (
              <p className="mt-1 text-sm text-red-600">{errors.identifier}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={credentials.password}
              onChange={handleChange}
              className={`w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.password ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Demo credentials info */}
        <div className="mt-8 rounded-md border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-2 text-sm font-medium text-blue-800">
            Demo Accounts:
          </h3>
          <div className="space-y-1 text-sm text-blue-700">
            <div>
              <strong>Admin:</strong> admin / admin123
            </div>
            <div>
              <strong>User:</strong> demo / demo123
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/" className="text-sm text-blue-600 hover:text-blue-500">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
