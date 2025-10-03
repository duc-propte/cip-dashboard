import express from 'express';
import {
  getOpportunities,
  getOpportunityById,
} from '../controllers/opportunityController.js';

const router = express.Router();

// Get all opportunities (with optional filters)
router.post('/', getOpportunities);

// Get single opportunity by ID
router.post('/:id', getOpportunityById);

export default router;


