'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Cloud, CheckCircle2, XCircle, Loader2, Database } from 'lucide-react';
import OpportunitiesList from './OpportunitiesList';
import { fetchOpportunities, getAuthUrl, checkAuthStatus, logout, type SalesforceAuthData, type Opportunity } from '@/lib/salesforceApi';

export default function SalesforceIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authData, setAuthData] = useState<SalesforceAuthData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isFetchingOpps, setIsFetchingOpps] = useState(false);
  const [showOpportunities, setShowOpportunities] = useState(false);

  // Check if user is already authenticated on mount
  useEffect(() => {
    checkAuth();
    
    // Check URL for auth success/error
    const urlParams = new URLSearchParams(window.location.search);
    const authSuccess = urlParams.get('auth');
    const authError = urlParams.get('error');
    
    if (authSuccess === 'success') {
      checkAuth().then(() => {
        // Clear URL params
        window.history.replaceState({}, '', window.location.pathname);
        loadOpportunities();
      });
    } else if (authError) {
      setError(decodeURIComponent(authError));
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const status = await checkAuthStatus();
      if (status.authenticated) {
        setIsConnected(true);
        setAuthData({
          userId: status.userId!,
          organizationId: status.organizationId!,
        });
      } else {
        setIsConnected(false);
        setAuthData(null);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setIsConnected(false);
    }
  };

  const handleConnect = () => {
    // Redirect to backend for OAuth (full page redirect)
    window.location.href = getAuthUrl();
  };

  const loadOpportunities = async () => {
    setIsFetchingOpps(true);
    setError(null);
    
    try {
      const opps = await fetchOpportunities();
      setOpportunities(opps);
      setShowOpportunities(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch opportunities');
    } finally {
      setIsFetchingOpps(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await logout();
      setIsConnected(false);
      setAuthData(null);
      setError(null);
      setOpportunities([]);
      setShowOpportunities(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect');
    }
  };

  const toggleIntegration = () => {
    if (isConnected) {
      handleDisconnect();
    } else {
      setShowAuthDialog(true);
    }
  };

  return (
    <>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Cloud className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle>Salesforce Integration</CardTitle>
                <CardDescription>
                  Connect your Salesforce account to access opportunities
                </CardDescription>
              </div>
            </div>
            <Badge variant={isConnected ? 'default' : 'secondary'} className="ml-auto">
              {isConnected ? (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Connected
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  Not Connected
                </span>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isConnected && authData && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  Successfully connected to Salesforce
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                  Organization ID: {authData.organizationId}
                </p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm font-medium text-red-900 dark:text-red-100">
                  Error: {error}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={toggleIntegration}
                variant={isConnected ? 'outline' : 'default'}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : isConnected ? (
                  'Disconnect'
                ) : (
                  'Connect to Salesforce'
                )}
              </Button>
            </div>

            {isConnected && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Quick Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      if (showOpportunities) {
                        setShowOpportunities(false);
                      } else {
                        if (opportunities.length === 0) {
                          loadOpportunities();
                        } else {
                          setShowOpportunities(true);
                        }
                      }
                    }}
                    disabled={isFetchingOpps}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    {showOpportunities ? 'Hide' : 'View'} Opportunities
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => loadOpportunities()}
                    disabled={isFetchingOpps}
                  >
                    {isFetchingOpps ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Database className="h-4 w-4 mr-2" />
                    )}
                    Sync Data
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect to Salesforce</DialogTitle>
            <DialogDescription>
              You&apos;ll be redirected to Salesforce to authorize this application.
              Please sign in with your Salesforce credentials.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Note:</strong> This will open a new window for secure authentication.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAuthDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleConnect} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Continue to Salesforce'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Opportunities List */}
      {isConnected && showOpportunities && (
        <div className="mt-6">
          <OpportunitiesList 
            opportunities={opportunities}
            isLoading={isFetchingOpps}
            onRefresh={() => loadOpportunities()}
          />
        </div>
      )}
    </>
  );
}

