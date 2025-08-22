// // server/routes/adminRoutes.js

// import express from 'express';


// const router = express.Router();



// export default router;

import express from 'express';
import {
  getAllDonations,
  getAllDonors,
  getAllNGOs
} from '../controllers/adminController.js';

import { verifyToken } from '../middleware/verifyToken.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';
import { loginAdmin } from '../controllers/adminController.js';

const router = express.Router();

// ✅ Admin-only routes
router.get('/donations', verifyToken, verifyAdmin, getAllDonations);
router.get('/donors', verifyToken, verifyAdmin, getAllDonors);
router.get('/ngos', verifyToken, verifyAdmin, getAllNGOs);
router.post('/login', loginAdmin);  // POST /api/admin/login
export default router;

