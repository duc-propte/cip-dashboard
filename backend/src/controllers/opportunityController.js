import salesforceService from '../services/salesforceService.js';

/**
 * Get all opportunities with optional filters (uses session)
 */
export const getOpportunities = async (req, res) => {
  // Get tokens from session
  if (!req.session || !req.session.salesforce) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { accessToken, instanceUrl } = req.session.salesforce;
  const filters = req.query;

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
    
    // If token expired, return specific error code
    if (error.message.includes('INVALID_SESSION_ID') || error.message.includes('Session expired')) {
      return res.status(401).json({ error: 'Session expired', code: 'TOKEN_EXPIRED' });
    }
    
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get a single opportunity by ID (uses session)
 */
export const getOpportunityById = async (req, res) => {
  // Get tokens from session
  if (!req.session || !req.session.salesforce) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { accessToken, instanceUrl } = req.session.salesforce;
  const { id } = req.params;

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
    
    // If token expired, return specific error code
    if (error.message.includes('INVALID_SESSION_ID') || error.message.includes('Session expired')) {
      return res.status(401).json({ error: 'Session expired', code: 'TOKEN_EXPIRED' });
    }
    
    res.status(500).json({ error: error.message });
  }
};


