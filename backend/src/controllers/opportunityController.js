import salesforceService from '../services/salesforceService.js';

/**
 * Get all opportunities with optional filters
 */
export const getOpportunities = async (req, res) => {
  const { accessToken, instanceUrl } = req.body;
  const filters = req.query;

  if (!accessToken || !instanceUrl) {
    return res.status(400).json({ error: 'Access token and instance URL are required' });
  }

  try {
    const opportunities = await salesforceService.getOpportunities(
      accessToken,
      instanceUrl,
      filters
    );
    
    res.json({
      success: true,
      count: opportunities.length,
      data: opportunities,
    });
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get a single opportunity by ID
 */
export const getOpportunityById = async (req, res) => {
  const { id } = req.params;
  const { accessToken, instanceUrl } = req.body;

  if (!accessToken || !instanceUrl) {
    return res.status(400).json({ error: 'Access token and instance URL are required' });
  }

  if (!id) {
    return res.status(400).json({ error: 'Opportunity ID is required' });
  }

  try {
    const opportunity = await salesforceService.getOpportunityById(
      accessToken,
      instanceUrl,
      id
    );
    
    res.json({
      success: true,
      data: opportunity,
    });
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    res.status(500).json({ error: error.message });
  }
};


