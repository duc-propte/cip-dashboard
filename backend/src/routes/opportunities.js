import express from 'express';
import {
  getOpportunities,
  getOpportunityById,
} from '../controllers/opportunityController.js';

const router = express.Router();

// Get all opportunities (with optional filters) - uses session
router.get('/', getOpportunities);

// Get single opportunity by ID - uses session
router.get('/:id', getOpportunityById);

export default router;


