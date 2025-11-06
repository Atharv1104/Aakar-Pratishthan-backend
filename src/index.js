import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import contactRouter from './routes/contact.route.js';
import donationRouter from './routes/donation.route.js';
import eventsRouter from "./routes/events.route.js"
import errorHandler from './middleware/errorHandler.js';
import VolunteerRouter from './routes/volunteer.route.js';
import newsRouter from './routes/news.router.js';
import dashboardRouter from './routes/dashboard.route.js';
import authRouter from './routes/auth.route.js';
import { protect } from './middleware/auth.middleware.js';
dotenv.config();

const app = express();

app.use(helmet());

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  'https://hoppscotch.io',
  'http://localhost:5173', // dev frontend
  'https://aakarpratishthan.in' //Netlify URL
];
app.use(cors({
  origin: function (origin, callback) {
    console.log('INCOMING ORIGIN:', origin); // This is your debug log

    // This line explicitly allows "undefined" origins (like your app)
    if (!origin) return callback(null, true);

    // This now only checks the array
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }

    return callback(null, true);
  },
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRouter);

app.use('/api/contact', protect, contactRouter);
app.use('/api/donation', protect, donationRouter);
app.use('/api/events', protect, eventsRouter);
app.use('/api/volunteer', protect, VolunteerRouter);
app.use('/api/news', protect, newsRouter);
app.use('/api/dashboard', protect, dashboardRouter);
const { MONGODB_URI = 'mongodb://127.0.0.1:27017/aakar', PORT = 4000 } = process.env;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Mongo connected'))
  .catch(err => { console.error('Mongo connect error', err); process.exit(1); });


app.get('/api/health', (req, res) => {
  res.json({
    message: 'Aakar pratishthan API is running',
    timestamp: new Date().toISOString()
  })
});

app.use(errorHandler);
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));