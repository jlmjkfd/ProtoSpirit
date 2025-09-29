import { Router, Request, Response } from "express";
import { GeminiProvider } from "../services/gemini";

const router = Router();

// POST /api/requirements/extract
// Main endpoint for the intern project - extract requirements using AI
router.post("/extract", async (req: Request, res: Response) => {
  try {
    const { description } = req.body;

    if (!description || typeof description !== "string") {
      return res.status(400).json({
        error: "Description is required and must be a string",
      });
    }

    if (description.trim().length < 10) {
      return res.status(400).json({
        error: "Description must be at least 10 characters long",
      });
    }

    console.log("Extracting requirements using Gemini AI...");

    // Use Gemini AI to extract requirements
    const aiProvider = new GeminiProvider();
    const extractedRequirements = await aiProvider.extractRequirements(description);

    // Return the extracted requirements directly
    // The AI already provides properly structured entities, roles, and features
    res.json({
      success: true,
      data: extractedRequirements
    });

  } catch (error) {
    console.error("Error in requirements extraction:", error);
    res.status(500).json({
      error: "Failed to extract requirements",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;