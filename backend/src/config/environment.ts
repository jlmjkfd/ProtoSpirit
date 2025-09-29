import dotenv from "dotenv";

// Load environment variables only in development
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

export const config = {
  // API Key
  geminiApiKey: process.env.GEMINI_API_KEY || "",

  // Core Configuration
  mongodbUri: process.env.MONGODB_URI || "",
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || "development",

  // Frontend URL
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",

  // Authentication
  jwtSecret: process.env.JWT_SECRET || "protospirit-dev-secret-key",
  jwtExpires: process.env.JWT_EXPIRES || "7d",
};

// Environment-specific validation
const isProduction = config.nodeEnv === "production";

// Log environment configuration (without secrets)
console.log(`>> Environment: ${config.nodeEnv}`);
console.log(
  `>> Using ${
    isProduction ? "environment variables" : ".env file"
  } for configuration`
);

// Validate that Gemini API key is configured
if (!config.geminiApiKey) {
  const errorMsg = isProduction
    ? "GEMINI_API_KEY environment variable is required in production."
    : "GEMINI_API_KEY not found. Please add it to your .env file.";
  throw new Error(errorMsg);
}

// Log configured AI provider
console.log(`>> AI provider: gemini`);

// Remove references to other providers since they're not needed

if (!config.mongodbUri) {
  const errorMsg = isProduction
    ? "MONGODB_URI environment variable is required in production. Set it in your deployment platform."
    : "MONGODB_URI not found. Please check your .env file or set the environment variable.";
  throw new Error(errorMsg);
}

// Validate JWT secret in production
if (isProduction && config.jwtSecret === "protospirit-dev-secret-key") {
  throw new Error(
    "JWT_SECRET must be set to a secure value in production. Do not use the default development secret."
  );
}
