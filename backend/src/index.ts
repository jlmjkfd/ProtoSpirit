import express from "express";
import { config } from "./config/environment";
import { corsMiddleware } from "./middleware/cors";
import { errorHandler } from "./middleware/errorHandler";
import { connectDatabase, seedDatabase } from "./models";

// Import routes
import requirementsRoutes from "./routes/requirements";
import projectsRoutes from "./routes/projects";
import authRoutes from "./routes/auth";

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/requirements", requirementsRoutes);
app.use("/api/projects", projectsRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = config.port;

// Initialize database and start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Seed database with demo data
    await seedDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`>> ProtoSpirit Backend running on port ${PORT}`);
      console.log(`>> Environment: ${config.nodeEnv}`);
      console.log(`>> Health check: http://localhost:${PORT}/health`);
      console.log(`>> Auth endpoints: http://localhost:${PORT}/api/auth`);
    });
  } catch (error) {
    console.error("× Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
