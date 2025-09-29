import { Router, Request, Response } from 'express';
import { Project } from '../models/Project';
import { authenticate, AuthRequest } from '../middleware/auth';
import { EntityProcessor } from '../services/relationshipProcessor';
import { updateEntitiesWithSampleData } from '../utils/sampleDataGenerator';

const router = Router();

// POST /api/projects - Save extracted requirements
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const { appName, description, entities, roles, features } = req.body;

    // Validate required fields
    if (!appName || !description || !entities || !roles || !features) {
      return res.status(400).json({
        error: 'Missing required fields: appName, description, entities, roles, features'
      });
    }

    // Generate sample data for entities
    const entitiesWithSamples = updateEntitiesWithSampleData(entities, 3);

    const project = new Project({
      appName,
      description,
      entities: entitiesWithSamples,
      roles,
      features,
      createdBy: authReq.user._id
    });

    const savedProject = await project.save();

    res.status(201).json({
      success: true,
      data: savedProject
    });
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).json({
      error: 'Failed to save project',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/projects/:id - Get specific project
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        error: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      error: 'Failed to fetch project',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/projects - List all projects
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const projects = await Project.find({ createdBy: authReq.user._id })
      .sort({ updatedAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: projects,
      count: projects.length
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      error: 'Failed to fetch projects',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const { id } = req.params;
    const { appName, description, entities, roles, features } = req.body;

    // Validate required fields
    if (!appName || !description) {
      return res.status(400).json({
        error: 'Missing required fields: appName, description'
      });
    }

    const project = await Project.findOne({
      _id: id,
      createdBy: authReq.user._id
    });

    if (!project) {
      return res.status(404).json({
        error: 'Project not found or not authorized to update'
      });
    }

    // Update allowed fields
    project.appName = appName;
    project.description = description;

    // Update entities if provided
    if (entities) {
      // Process entities with basic validation
      const preparedEntities = EntityProcessor.prepareEntitiesFromAI(entities);
      const processedData = EntityProcessor.processProject({
        entities: preparedEntities,
        roles: roles || project.roles || [],
        features: features || project.features || []
      });

      project.entities = processedData.entities as any;

      // Update roles and features if provided
      if (roles) {
        project.roles = roles;
      }

      if (features) {
        project.features = features;
      }
    } else {
      // Update roles if provided (handles both string[] and Role[] formats)
      if (roles) {
        project.roles = roles;
      }

      // Update features if provided
      if (features) {
        project.features = features;
      }
    }

    const updatedProject = await project.save();

    res.json({
      success: true,
      data: updatedProject,
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      error: 'Failed to update project',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const { id } = req.params;

    const project = await Project.findOne({
      _id: id,
      createdBy: authReq.user._id
    });

    if (!project) {
      return res.status(404).json({
        error: 'Project not found or not authorized to delete'
      });
    }

    await Project.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      error: 'Failed to delete project',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;