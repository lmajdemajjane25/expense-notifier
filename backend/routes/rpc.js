
const express = require('express');
const pool = require('../config/database');
const router = express.Router();

// Handle RPC calls that were previously Supabase functions
router.post('/get_import_errors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.import_errors ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching import errors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/clear_import_errors', async (req, res) => {
  try {
    await pool.query('DELETE FROM public.import_errors');
    res.json({ message: 'Import errors cleared successfully' });
  } catch (error) {
    console.error('Error clearing import errors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/has_role', async (req, res) => {
  try {
    const { _user_id, _role } = req.body;
    const result = await pool.query(
      'SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = $1 AND role = $2)',
      [_user_id, _role]
    );
    res.json(result.rows[0].exists);
  } catch (error) {
    console.error('Error checking role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
