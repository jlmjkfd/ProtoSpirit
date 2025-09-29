import { GoogleGenAI, Type } from "@google/genai";
import { config } from "../config/environment";
import { ExtractedRequirements } from "../types";

export interface AIRequestOptions {
  retries?: number;
  timeout?: number;
  temperature?: number;
}

export class GeminiProvider {
  private genAI: GoogleGenAI;
  private config = {
    name: "Gemini",
    model: "gemini-2.5-flash",
    temperature: 0.7,
    // maxTokens: 8000,
    // timeout: 30000,
  };

  // Define detailed schema for structured output using proper format
  private requirementsSchema = {
    type: Type.OBJECT,
    properties: {
      appName: {
        type: Type.STRING,
        description: "The name of the application",
        minLength: "1",
        maxLength: "100",
      },
      entities: {
        type: Type.ARRAY,
        minItems: "1",
        items: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: "Entity name",
              minLength: "1",
            },
            fields: {
              type: Type.ARRAY,
              minItems: "1",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: {
                    type: Type.STRING,
                    description: "Field name",
                    minLength: "1",
                  },
                  type: {
                    type: Type.STRING,
                    enum: [
                      "text",
                      "email",
                      "number",
                      "date",
                      "boolean",
                      "select",
                      "textarea",
                    ],
                    description: "Field data type",
                  },
                  required: {
                    type: Type.BOOLEAN,
                    description: "Whether field is required",
                  },
                },
                required: ["name", "type", "required"],
                propertyOrdering: ["name", "type", "required"],
              },
            },
            relationships: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: {
                    type: Type.STRING,
                    enum: ["one-to-one", "one-to-many", "many-to-many"],
                    description: "Relationship type",
                  },
                  entity: {
                    type: Type.STRING,
                    description: "Target entity name",
                    minLength: "1",
                  },
                  description: {
                    type: Type.STRING,
                    description: "Relationship description",
                  },
                },
                required: ["type", "entity"],
                propertyOrdering: ["type", "entity", "description"],
              },
            },
            metadata: {
              type: Type.OBJECT,
              nullable: true,
              properties: {
                description: {
                  type: Type.STRING,
                  description: "Entity description",
                },
              },
            },
          },
          required: ["name", "fields"],
          propertyOrdering: ["name", "fields", "relationships", "metadata"],
        },
      },
      roles: {
        type: Type.ARRAY,
        minItems: "1",
        items: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: "Role name",
              minLength: "1",
            },
            description: {
              type: Type.STRING,
              description: "Role description",
              minLength: "1",
            },
            features: {
              type: Type.ARRAY,
              description: "Array of feature IDs this role has access to",
              items: { type: Type.STRING },
            },
          },
          required: ["name", "description", "features"],
          propertyOrdering: ["name", "description", "features"],
        },
      },
      features: {
        type: Type.ARRAY,
        minItems: "1",
        items: {
          type: Type.OBJECT,
          properties: {
            id: {
              type: Type.STRING,
              description: "Unique feature identifier (kebab-case)",
              pattern: "^[a-z0-9-]+$",
              minLength: "1",
            },
            name: {
              type: Type.STRING,
              description: "Human readable feature name",
              minLength: "1",
            },
            description: {
              type: Type.STRING,
              description: "Feature description",
              minLength: "1",
            },
            category: {
              type: Type.STRING,
              enum: ["entity", "relationship"],
              description: "Feature category: entity (CRUD operations) or relationship (associations between entities)",
            },
            relatedEntities: {
              type: Type.ARRAY,
              description: "For relationship features: array of entity names involved in the relationship",
              items: {
                type: Type.STRING,
                minLength: "1",
              },
            },
            showInEntityLists: {
              type: Type.ARRAY,
              description: "For relationship features: which entity lists should show this relationship button",
              items: {
                type: Type.STRING,
                minLength: "1",
              },
            },
            permissions: {
              type: Type.ARRAY,
              minItems: "1",
              items: {
                type: Type.OBJECT,
                properties: {
                  role: {
                    type: Type.STRING,
                    description: "Role name",
                    minLength: "1",
                  },
                  actions: {
                    type: Type.ARRAY,
                    minItems: "1",
                    items: {
                      type: Type.STRING,
                      enum: ["full", "read"],
                      description: "Permission level: 'full' (create/read/update/delete) or 'read' (read-only)",
                    },
                  },
                },
                required: ["role", "actions"],
                propertyOrdering: ["role", "actions"],
              },
            },
          },
          required: ["id", "name", "description", "category", "permissions"],
          propertyOrdering: [
            "id",
            "name",
            "description",
            "category",
            "permissions",
          ],
        },
      },
    },
    required: ["appName", "entities", "roles", "features"],
    propertyOrdering: ["appName", "entities", "roles", "features"],
  };

  // Guidelines for comprehensive requirement extraction
  private guidelines = `
ENTITY IDENTIFICATION RULES:
- Entities are NOUNS that exist independently and have their own data
- Ask: "Can this thing exist without other things?"
- Examples: Student (has name, email), Course (has title, credits), Teacher (has name, department)
- NOT entities: Enrollment (just links Student+Course), Grade (just links Student+Assignment), Attendance (just links Student+Class)

ENTITY DESIGN:
- Focus on core independent entities only
- Add relevant fields for each entity (name, email, dates, etc.)
- Use appropriate field types: text, email, number, date, boolean, select, textarea
- Mark fields as required based on business logic
- Add metadata with descriptions

AVOID THESE ENTITY MISTAKES:
❌ Don't create entities for: Enrollment, Registration, Assignment, Attendance, Grade, Rating, Review, Booking, Reservation
✅ These are relationships between real entities
❌ "Enrollment Management" → ✅ "Student Enrollment" (relationship)
❌ "Grade Management" → ✅ "Grade Assignment" (relationship)
❌ "Attendance Management" → ✅ "Attendance Tracking" (relationship)

RELATIONSHIP IDENTIFICATION:
- Relationships connect two existing entities
- Look for action words: "enroll", "assign", "track", "attend", "rate", "review", "book"
- Examples: "students enroll in courses" → student-enrollment relationship
- Examples: "track attendance" → attendance-tracking relationship
- Examples: "assign grades" → grade-assignment relationship

RELATIONSHIP PATTERNS:
- Define relationships unidirectionally (avoid duplicates)
- Use "one-to-many" instead of "many-to-one"
- For many-to-many with extra data, create junction entities
- Examples: User → Orders (one-to-many), Student ↔ Course → StudentEnrollment (junction)

FEATURE GENERATION:
- Create ONE feature per entity: "[entity]-management" (e.g., "student-management", "course-management", "order-management")
- Create ONE feature per relationship: "[action-noun]" (e.g., "student-enrollment", "order-assignment", "course-assignment")
- Keep features simple - one feature covers all operations for that entity/relationship
- Use kebab-case IDs: "student-management", "course-management", "student-enrollment"

RELATIONSHIP FEATURE PROPERTIES:
- For relationship features, ALWAYS include:
  * relatedEntities: Array of entities involved (e.g., ["Student", "Course"])
  * showInEntityLists: Which entity lists show the relationship button

BUSINESS LOGIC EXAMPLES:
- Student-Course enrollment → showInEntityLists: ["Student"] (students enroll in courses)
- Customer-Order → showInEntityLists: ["Customer"] (customers place orders)
- Employee-Project assignment → showInEntityLists: ["Employee"] (employees are assigned to projects)
- Product-Category → showInEntityLists: ["Product", "Category"] (both sides can manage the relationship)
- User-Role assignment → showInEntityLists: ["User"] (assign roles to users)

DECISION RULES:
- If one entity is clearly the "actor" → show only in that entity's list
- If both entities equally manage the relationship → show in both lists
- Consider real-world business processes when deciding

PERMISSION ASSIGNMENT:
- Use only "full" or "read" permissions
- "full" = can create/edit/delete (shows all buttons)
- "read" = view-only (shows no action buttons)
- Only include roles that have access - omit roles with no permission
- Admin roles typically get "full" access to most features
- User roles typically get "read" access to relevant data

ROLE DESIGN:
- Admin: Full system access and management capabilities
- Staff/Manager: Operational management and data entry
- User/Customer: Self-service and view access
- Assign relevant features to each role based on responsibilities

EXAMPLES:
Student Management System (User Input: "teachers add courses, students enroll, admins generate reports"):
❌ WRONG: Entities: Student, Teacher, Course, Enrollment, Grade, Attendance
✅ CORRECT:
- Entities: Student, Teacher, Course (core independent data)
- Features:
  * student-management, teacher-management, course-management (entity features)
  * student-enrollment (relationship: relatedEntities: ["Student", "Course"], showInEntityLists: ["Student"])
  * grade-assignment (relationship: relatedEntities: ["Student", "Course"], showInEntityLists: ["Teacher"])
  * attendance-tracking (relationship: relatedEntities: ["Student", "Course"], showInEntityLists: ["Teacher"])

E-commerce System:
- Entities: Customer, Product, Order (core independent data)
- Features:
  * customer-management, product-management, order-management (entity features)
  * order-placement (relationship: relatedEntities: ["Customer", "Order"], showInEntityLists: ["Customer"])
  * product-review (relationship: relatedEntities: ["Customer", "Product"], showInEntityLists: ["Product"])
`;

  constructor() {
    if (!config.geminiApiKey) {
      throw new Error(
        "Gemini API key is required but not found in configuration"
      );
    }

    this.genAI = new GoogleGenAI({
      apiKey: config.geminiApiKey,
    });
  }

  /**
   * Extract requirements from description using Gemini with structured output
   */
  async extractRequirements(
    description: string,
    options?: AIRequestOptions
  ): Promise<ExtractedRequirements> {
    try {
      console.log("🔍 Calling Gemini API with structured output...");

      const response = await this.genAI.models.generateContent({
        model: this.config.model,
        contents: `Extract software requirements from this app description and return structured JSON data with entities, roles, and features.

${this.guidelines}

APP DESCRIPTION:
${description}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: this.requirementsSchema,
          temperature: this.config.temperature,
          // maxOutputTokens: this.config.maxTokens,
          systemInstruction:
            "You are an expert software architect. Extract app requirements from user descriptions and return structured JSON data with entities, roles, and features. CRITICAL: Only create entities for things that exist independently (Student, Course, Product). Do NOT create entities for relationships/processes (Enrollment, Grade, Attendance, Review). These should be relationship features instead. Create realistic, well-structured data models with appropriate relationships and role-based access patterns. Always create meaningful feature IDs using kebab-case format.",
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response from Gemini API");
      }

      const result = JSON.parse(responseText);

      // Log successful extraction
      console.log(`✅ Gemini successfully extracted requirements:`, {
        provider: "Gemini",
        appName: result.appName,
        entities: result.entities?.length || 0,
        roles: result.roles?.length || 0,
        features: result.features?.length || 0,
        descriptionLength: description.length,
      });

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      console.error(`❌ Gemini extraction failed:`, {
        provider: "Gemini",
        error: errorMessage,
        descriptionLength: description.length,
        timestamp: new Date().toISOString(),
      });

      throw new Error(`Gemini provider failed: ${errorMessage}`);
    }
  }

  /**
   * Validate Gemini API connection
   */
  async validateConnection(): Promise<boolean> {
    try {
      const testPrompt =
        "Respond with just the word 'OK' if you can see this message.";

      const response = await this.genAI.models.generateContent({
        model: this.config.model,
        contents: testPrompt,
        config: {
          temperature: 0.1,
          maxOutputTokens: 50,
        },
      });

      const responseText = response.text;
      return responseText?.toLowerCase().includes("ok") || false;
    } catch (error) {
      console.error("Gemini connection validation failed:", error);
      return false;
    }
  }

  /**
   * Get Gemini-specific model information
   */
  getModelInfo(): any {
    return {
      provider: "Google Gemini",
      model: this.config.model,
      version: "2.5-flash",
      capabilities: [
        "text_generation",
        "json_output",
        "structured_output",
        "large_context",
      ],
      // maxTokens: this.config.maxTokens,
      temperature: this.config.temperature,
    };
  }
}
