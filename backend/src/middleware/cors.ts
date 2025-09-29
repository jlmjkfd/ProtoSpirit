import cors from 'cors';
import { config } from '../config/environment';

const corsOptions = {
  origin: config.nodeEnv === 'production'
    ? [config.frontendUrl] // Use environment variable for production frontend URL
    : ['http://localhost:5173', 'http://localhost:3000'], // Vite default port and CRA port
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

export const corsMiddleware = cors(corsOptions);