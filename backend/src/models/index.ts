// Central export file for all models
export { Project, IProject, IProjectModel } from "./Project";
export { User, IUser, IUserModel } from "./User";

// Database connection utility
import mongoose from "mongoose";
import { config } from "../config/environment";

export const connectDatabase = async (): Promise<void> => {
  try {
    // Connection options
    const options = {
      autoIndex: config.nodeEnv !== "production", // Disable auto-index in production
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
    };

    await mongoose.connect(config.mongodbUri, options);

    console.log("√ Connected to MongoDB successfully");

    // Connection event handlers
    mongoose.connection.on("error", (error) => {
      console.error("× MongoDB connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("!  MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("√ MongoDB reconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      try {
        await mongoose.connection.close();
        console.log("-×- MongoDB connection closed through app termination");
        process.exit(0);
      } catch (error) {
        console.error("× Error closing MongoDB connection:", error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("× Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

// Helper function to check database health
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    if (!mongoose.connection.db) {
      throw new Error("Database connection not established");
    }
    await mongoose.connection.db.admin().ping();
    return true;
  } catch (error) {
    console.error("× Database health check failed:", error);
    return false;
  }
};

// Development helper - seed database
export const seedDatabase = async (): Promise<void> => {
  if (config.nodeEnv !== "development") {
    return;
  }

  try {
    const { Project } = require("./Project");
    const { User } = require("./User");

    // Check if we already have users
    const existingUsers = await User.countDocuments();
    if (existingUsers === 0) {
      // Create demo users
      const demoUsers = [
        {
          username: "admin",
          email: "admin@protospirit.com",
          password: "admin123",
          role: "admin",
          profile: {
            firstName: "System",
            lastName: "Administrator",
          },
        },
        {
          username: "demo",
          email: "demo@protospirit.com",
          password: "demo123",
          role: "user",
          profile: {
            firstName: "Demo",
            lastName: "User",
          },
        },
      ];

      await User.create(demoUsers);
      console.log("   Demo users created:");
      console.log("   Admin: admin / admin123");
      console.log("   User:  demo / demo123");
    }

    // Check if we already have projects
    const existingProjects = await Project.countDocuments();
    if (existingProjects === 0) {
      // Get admin user for sample project
      const adminUser = await User.findOne({ username: "admin" });
      if (!adminUser) {
        throw new Error("Admin user not found for sample project creation");
      }

      // Sample project data
      const sampleProject = {
        appName: "Student Management System",
        description:
          "A system to manage students, courses, and grades for educational institutions.",
        entities: [
          {
            name: "Student",
            fields: [
              { name: "firstName", type: "text", required: true },
              { name: "lastName", type: "text", required: true },
              { name: "email", type: "email", required: true },
              { name: "dateOfBirth", type: "date", required: true },
              { name: "grade", type: "number", required: false },
            ],
            metadata: {},
          },
          {
            name: "Course",
            fields: [
              { name: "title", type: "text", required: true },
              { name: "code", type: "text", required: true },
              { name: "credits", type: "number", required: true },
              { name: "description", type: "textarea", required: false },
            ],
            metadata: {},
          },
        ],
        features: [
          {
            id: "manage-students",
            name: "Manage Students",
            description: "Create, read, update, and delete student records.",
            category: "entity",
            permissions: [
              { role: "Administrator", actions: ["full"] },
              { role: "Teacher", actions: ["read"] },
            ],
          },
          {
            id: "manage-courses",
            name: "Manage Courses",
            description: "Create, read, update, and delete course records.",
            category: "entity",
            permissions: [
              { role: "Administrator", actions: ["full"] },
              { role: "Teacher", actions: ["full"] },
            ],
          },
          {
            id: "student-enrollment",
            name: "Student Enrollment",
            description: "Manage student enrollment in courses.",
            category: "relationship",
            relatedEntities: ["Student", "Course"],
            showInEntityLists: ["Student"],
            permissions: [
              { role: "Administrator", actions: ["full"] },
              { role: "Teacher", actions: ["read"] },
            ],
          },
          {
            id: "view-courses",
            name: "View Courses",
            description: "View available courses and course details.",
            category: "entity",
            permissions: [
              { role: "Student", actions: ["read"] },
              { role: "Teacher", actions: ["read"] },
              { role: "Administrator", actions: ["read"] },
            ],
          },
        ],
        roles: [
          {
            name: "Student",
            description: "Can view course details and enroll in courses.",
            features: ["view-courses"],
          },
          {
            name: "Teacher",
            description: "Can manage courses and track student progress.",
            features: ["manage-courses", "student-enrollment", "view-courses"],
          },
          {
            name: "Administrator",
            description:
              "Full system access with all administrative privileges.",
            features: [
              "manage-students",
              "manage-courses",
              "student-enrollment",
              "view-courses",
            ],
          },
        ],
        status: "active",
        createdBy: adminUser._id,
      };

      await Project.create(sampleProject);
      console.log(">> Sample project created");
    }

    if (existingUsers === 0 || existingProjects === 0) {
      console.log(">> Database seeded successfully");
    } else {
      console.log(">> Database already has data, skipping seed");
    }
  } catch (error) {
    console.error("× Failed to seed database:", error);
  }
};
