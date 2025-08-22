import { Router } from 'express';
import { createDonation, listDonations } from '../controllers/donationController.js';
import { protect } from '../middleware/auth.js';
const router = Router();
router.post('/', protect(['DONOR']), createDonation);
router.get('/', protect(['NGO', 'DONOR']), listDonations);
export default router;