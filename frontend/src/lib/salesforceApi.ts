/**
 * Salesforce API Client
 * Handles all communication with the backend API
 * Uses session-based authentication (cookies)
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface SalesforceAuthData {
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
 * Get OAuth authorization URL - redirects to backend
 */
export function getAuthUrl(): string {
  return `${API_BASE_URL}/api/auth/login`;
}

/**
 * Check authentication status
 */
export async function checkAuthStatus(): Promise<{ authenticated: boolean; userId?: string; organizationId?: string }> {
  const response = await fetch(`${API_BASE_URL}/api/auth/status`, {
    credentials: 'include', // Important: include cookies
  });
  
  if (!response.ok) {
    throw new Error('Failed to check auth status');
  }
  
  return await response.json();
}

/**
 * Logout - destroy session
 */
export async function logout(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to logout');
  }
}

/**
 * Fetch opportunities from Salesforce (uses session)
 */
export async function fetchOpportunities(
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
      method: 'GET',
      credentials: 'include', // Important: include session cookie
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
 * Fetch a single opportunity by ID (uses session)
 */
export async function fetchOpportunityById(
  opportunityId: string
): Promise<Opportunity> {
  const response = await fetch(
    `${API_BASE_URL}/api/opportunities/${opportunityId}`,
    {
      method: 'GET',
      credentials: 'include', // Important: include session cookie
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
 * Get current user information (uses session)
 */
export async function getUserInfo() {
  const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
    method: 'GET',
    credentials: 'include', // Important: include session cookie
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user info');
  }

  const data = await response.json();
  return data.data;
}

