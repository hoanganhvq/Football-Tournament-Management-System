const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const cloudinary = require('./config/cloudinary');

// Load environment variables
dotenv.config();
connectDB();
const app = express();
// ⚠️ Cho phép frontend (localhost:3000) gọi API
// CORS will make the API accessible from the frontend
app.use(cors({
  origin: 'https://football-tournament-management-system.vercel.app/',
  credentials: true,
}));
//Midldleware
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/', require('./routes/imageRoute')); //If you place express.json before the route, it parse file so it don't have enoguh space



app.use(express.json());



// Routes

app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/player', require('./routes/playerRoutes'));
app.use('/api/team', require('./routes/teamRoutes'));
app.use('/api/tournament', require('./routes/tournamentRoutes'));
app.use('/api/match', require('./routes/matchRoutes'));
app.use('/api/group', require('./routes/groupRoutes'));
app.use('/api/round', require('./routes/roundRoutes'));
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});