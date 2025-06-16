
const express = require('express');
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Get all users/profiles
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, array_agg(ur.role) as roles 
      FROM public.profiles p
      LEFT JOIN public.user_roles ur ON p.id = ur.user_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const { email, password, full_name, phone } = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const userResult = await pool.query(
      'INSERT INTO public.profiles (email, full_name, phone) VALUES ($1, $2, $3) RETURNING *',
      [email, full_name, phone]
    );
    
    const user = userResult.rows[0];
    
    // Assign default role
    await pool.query(
      'INSERT INTO public.user_roles (user_id, role) VALUES ($1, $2)',
      [user.id, 'normal']
    );

    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Simple login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // For now, just return a simple success response
    // You can implement proper password checking later
    const result = await pool.query('SELECT * FROM public.profiles WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'default-secret');

    res.json({ user, token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
