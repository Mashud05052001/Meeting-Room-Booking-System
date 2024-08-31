import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import notFound from './app/middleware/notFound';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import cookieParser from 'cookie-parser';
import { allRoutes } from './app/routes';

const app: Application = express();

// parser
app.use(cors({ origin: ['http://localhost:5173/'] }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'The server is running seccessfully',
  });
});

// all routes
app.use('/api/v1', allRoutes);

// global error handler
app.use(globalErrorHandler);

// not found
app.use(notFound);

export default app;
