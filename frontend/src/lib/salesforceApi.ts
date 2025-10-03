/**
 * Salesforce API Client
 * Handles all communication with the backend API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cip-dashboard.onrender.com';

export interface SalesforceAuthData {
  accessToken: string;
  refreshToken: string;
  instanceUrl: string;
  userId: string;
  organizationId: string;
}

export interface Opportunity {
  Id: string;
  Name: string;
  AccountId?: string;
  Account?: {
    Name: string;
  };
  Amount?: number;
  StageName: string;
  CloseDate: string;
  Probability?: number;
  Type?: string;
  LeadSource?: string;
  Description?: string;
  CreatedDate: string;
  LastModifiedDate: string;
  OwnerId?: string;
  Owner?: {
    Name: string;
  };
}

export interface OpportunityFilters {
  stageNames?: string[];
  minAmount?: number;
  fromDate?: string;
}

/**
 * Get OAuth authorization URL
 */
export async function getAuthUrl(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`);
  const data = await response.json();
  return data.authUrl;
}

/**
 * Fetch opportunities from Salesforce
 */
export async function fetchOpportunities(
  authData: SalesforceAuthData,
  filters?: OpportunityFilters
): Promise<Opportunity[]> {
  const queryParams = new URLSearchParams();
  
  if (filters?.stageNames) {
    filters.stageNames.forEach(stage => queryParams.append('stageNames[]', stage));
  }
  if (filters?.minAmount) {
    queryParams.append('minAmount', filters.minAmount.toString());
  }
  if (filters?.fromDate) {
    queryParams.append('fromDate', filters.fromDate);
  }

  const response = await fetch(
    `${API_BASE_URL}/api/opportunities?${queryParams.toString()}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: authData.accessToken,
        instanceUrl: authData.instanceUrl,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch opportunities');
  }

  const data = await response.json();
  return data.data;
}

/**
 * Fetch a single opportunity by ID
 */
export async function fetchOpportunityById(
  authData: SalesforceAuthData,
  opportunityId: string
): Promise<Opportunity> {
  const response = await fetch(
    `${API_BASE_URL}/api/opportunities/${opportunityId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: authData.accessToken,
        instanceUrl: authData.instanceUrl,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch opportunity');
  }

  const data = await response.json();
  return data.data;
}

/**
 * Get current user information
 */
export async function getUserInfo(authData: SalesforceAuthData) {
  const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accessToken: authData.accessToken,
      instanceUrl: authData.instanceUrl,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user info');
  }

  const data = await response.json();
  return data.data;
}

