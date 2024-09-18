import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import notFound from './app/middleware/notFound';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import cookieParser from 'cookie-parser';
import { allRoutes } from './app/routes';
import path from 'path';

const app: Application = express();

console.log(__dirname);
app.use(express.static(path.join(__dirname, `../public`)));

// parser
app.use(
  cors({
    origin: [
      'https://meeting-room-booking-system-frontend.vercel.app',
      'http://localhost:5173',
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'The server is running successfully',
  });
});

// all routes
app.use('/api/v1', allRoutes);

// global error handler
app.use(globalErrorHandler);

// not found
app.use(notFound);

export default app;
