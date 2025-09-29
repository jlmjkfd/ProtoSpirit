import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken, authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

console.log("Auth router created and registering routes...");

// POST /api/auth/login
console.log("Registering POST /login route");
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    // Validation
    if (!identifier || !password) {
      return res.status(400).json({
        error: 'Username/email and password are required'
      });
    }

    // Find user and validate credentials
    const user = await User.findByCredentials(identifier, password);

    // Update login info
    await user.updateLoginInfo();

    // Generate JWT token
    const token = generateToken((user._id as string).toString());

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          displayName: user.displayName,
          lastLogin: user.lastLogin,
          loginCount: user.loginCount
        },
        token,
        expiresIn: '7d'
      }
    });
  } catch (error) {
    console.error('Login error:', error);

    if (error instanceof Error && error.message === 'Invalid credentials') {
      return res.status(401).json({
        error: 'Invalid username/email or password'
      });
    }

    res.status(500).json({
      error: 'Login failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/auth/register (Admin only in demo)
router.post('/register', authenticate, async (req: Request, res: Response) => {
  try {
    const currentUser = (req as AuthRequest).user;

    // Only admin can create new users in this demo
    if (currentUser.role !== 'admin') {
      return res.status(403).json({
        error: 'Only administrators can create new users'
      });
    }

    const { username, email, password, role = 'user', profile } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Username, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email: email.toLowerCase() }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User with this username or email already exists'
      });
    }

    // Create new user
    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password,
      role,
      profile
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          displayName: newUser.displayName
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  try {
    const user = authReq.user;

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          displayName: user.displayName,
          lastLogin: user.lastLogin,
          loginCount: user.loginCount,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to get user information',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticate, async (req: Request, res: Response) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return success (client should remove token)

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/auth/users (Admin only)
router.get('/users', authenticate, async (req: Request, res: Response) => {
  try {
    const currentUser = (req as AuthRequest).user;

    if (currentUser.role !== 'admin') {
      return res.status(403).json({
        error: 'Admin access required'
      });
    }

    const users = await User.findActiveUsers();
    const stats = await User.getUserStats();

    res.json({
      success: true,
      data: {
        users,
        stats
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Failed to get users',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});


export default router;