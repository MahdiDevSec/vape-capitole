import express, { Express } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import orderRoutes from './routes/order.routes';
import productRoutes from './routes/product.routes';
import storeRoutes from './routes/store.routes';
import mixRoutes from './routes/mix.routes';
import ratingRoutes from './routes/rating.routes';
import liquidRoutes from './routes/liquid.routes';
import translationRoutes from './routes/translation.routes';
import usedProductRoutes from './routes/usedProduct.routes';
import { errorHandler } from './middleware/error.middleware';
import { authMiddleware } from './middleware/auth.middleware';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
// Allow images (uploads) to be fetched from a different origin/port (e.g., front-end dev server)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  skip: (req)=> req.path.startsWith('/api/liquids') || process.env.NODE_ENV==='development',
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/mixes', mixRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/liquids', liquidRoutes);
app.use('/api/translations', translationRoutes);
app.use('/api/used-products', usedProductRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vape Shop API',
      version: '1.0.0',
      description: 'API documentation for Vape Shop',
    },
    servers: [
      { url: 'http://localhost:' + port + '/api' }
    ],
  },
  apis: ['./src/routes/*.ts'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handling middleware
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
