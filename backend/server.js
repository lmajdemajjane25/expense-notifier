
const express = require('express');
const cors = require('cors');
const servicesRoutes = require('./routes/services');
const usersRoutes = require('./routes/users');
const rpcRoutes = require('./routes/rpc');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/services', servicesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/profiles', usersRoutes); // Alias for compatibility
app.use('/api/rpc', rpcRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
