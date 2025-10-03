import jsforce from 'jsforce';
import { salesforceConfig } from '../config/salesforce.js';

class SalesforceService {
  constructor() {
    this.connections = new Map(); // Store connections by session ID
  }

  /**
   * Get OAuth2 authorization URL
   */
  getAuthorizationUrl() {
    const oauth2 = new jsforce.OAuth2({
      clientId: salesforceConfig.clientId,
      clientSecret: salesforceConfig.clientSecret,
      redirectUri: salesforceConfig.redirectUri,
      loginUrl: salesforceConfig.loginUrl,
    });

    return oauth2.getAuthorizationUrl({
      scope: 'full refresh_token offline_access',
    });
  }

  /**
   * Exchange authorization code for access token
   */
  async authenticate(code) {
    const conn = new jsforce.Connection({
      oauth2: {
        clientId: salesforceConfig.clientId,
        clientSecret: salesforceConfig.clientSecret,
        redirectUri: salesforceConfig.redirectUri,
        loginUrl: salesforceConfig.loginUrl,
      },
    });

    try {
      const userInfo = await conn.authorize(code);
      
      return {
        accessToken: conn.accessToken,
        refreshToken: conn.refreshToken,
        instanceUrl: conn.instanceUrl,
        userId: userInfo.id,
        organizationId: userInfo.organizationId,
      };
    } catch (error) {
      console.error('Authentication error:', error);
      throw new Error(`Failed to authenticate with Salesforce: ${error.message}`);
    }
  }

  /**
   * Create a connection with existing access token
   */
  createConnection(accessToken, instanceUrl) {
    return new jsforce.Connection({
      accessToken,
      instanceUrl,
    });
  }

  /**
   * Fetch opportunities from Salesforce
   */
  async getOpportunities(accessToken, instanceUrl, filters = {}) {
    const conn = this.createConnection(accessToken, instanceUrl);

    try {
      let query = `
        SELECT Id, Name, AccountId, Account.Name, Amount, StageName, 
               CloseDate, Probability, Type, LeadSource, 
               CreatedDate, LastModifiedDate, OwnerId, Owner.Name
        FROM Opportunity
      `;

      const whereClauses = [];
      
      if (filters.stageNames && filters.stageNames.length > 0) {
        const stages = filters.stageNames.map(s => `'${s}'`).join(',');
        whereClauses.push(`StageName IN (${stages})`);
      }

      if (filters.minAmount) {
        whereClauses.push(`Amount >= ${filters.minAmount}`);
      }

      if (filters.fromDate) {
        whereClauses.push(`CreatedDate >= ${filters.fromDate}`);
      }

      if (whereClauses.length > 0) {
        query += ` WHERE ${whereClauses.join(' AND ')}`;
      }

      query += ' ORDER BY CreatedDate DESC LIMIT 1000';

      const result = await conn.query(query);
      return result.records;
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      throw new Error(`Failed to fetch opportunities: ${error.message}`);
    }
  }

  /**
   * Fetch a single opportunity by ID
   */
  async getOpportunityById(accessToken, instanceUrl, opportunityId) {
    const conn = this.createConnection(accessToken, instanceUrl);

    try {
      const result = await conn.query(`
        SELECT Id, Name, AccountId, Account.Name, Amount, StageName, 
               CloseDate, Probability, Type, LeadSource, Description,
               CreatedDate, LastModifiedDate, OwnerId, Owner.Name,
               IsClosed, IsWon
        FROM Opportunity
        WHERE Id = '${opportunityId}'
      `);

      if (result.records.length === 0) {
        throw new Error('Opportunity not found');
      }

      return result.records[0];
    } catch (error) {
      console.error('Error fetching opportunity:', error);
      throw new Error(`Failed to fetch opportunity: ${error.message}`);
    }
  }

  /**
   * Get current user information
   */
  async getUserInfo(accessToken, instanceUrl) {
    const conn = this.createConnection(accessToken, instanceUrl);

    try {
      const identity = await conn.identity();
      return identity;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw new Error(`Failed to fetch user info: ${error.message}`);
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken, instanceUrl) {
    const conn = new jsforce.Connection({
      oauth2: {
        clientId: salesforceConfig.clientId,
        clientSecret: salesforceConfig.clientSecret,
        redirectUri: salesforceConfig.redirectUri,
        loginUrl: salesforceConfig.loginUrl,
      },
      instanceUrl,
      refreshToken,
    });

    try {
      await conn.oauth2.refreshToken(refreshToken);
      return {
        accessToken: conn.accessToken,
        instanceUrl: conn.instanceUrl,
      };
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error(`Failed to refresh token: ${error.message}`);
    }
  }
}

export default new SalesforceService();


