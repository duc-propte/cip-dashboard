'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Building2, Calendar, DollarSign, TrendingUp, User, Loader2, AlertCircle } from 'lucide-react';
import { fetchOpportunityById, checkAuthStatus, type Opportunity } from '@/lib/salesforceApi';

function OpportunityProfileContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const opportunityId = params.id as string;
  const isEmbedded = searchParams.get('embedded') === 'true';
  
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOpportunity = async () => {
      // Check authentication status
      try {
        const authStatus = await checkAuthStatus();
        if (!authStatus.authenticated) {
          setError('Not authenticated. Please connect to Salesforce first.');
          setIsLoading(false);
          return;
        }
      } catch (err) {
        setError('Failed to check authentication status');
        setIsLoading(false);
        return;
      }

      if (!opportunityId) {
        setError('No opportunity ID provided');
        setIsLoading(false);
        return;
      }

      try {
        const data = await fetchOpportunityById(opportunityId);
        setOpportunity(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load opportunity');
      } finally {
        setIsLoading(false);
      }
    };

    loadOpportunity();
  }, [opportunityId]);

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStageColor = (stage: string) => {
    const stageColors: Record<string, string> = {
      'Prospecting': 'bg-gray-500',
      'Qualification': 'bg-blue-500',
      'Needs Analysis': 'bg-cyan-500',
      'Value Proposition': 'bg-indigo-500',
      'Proposal/Price Quote': 'bg-purple-500',
      'Negotiation/Review': 'bg-yellow-500',
      'Closed Won': 'bg-green-500',
      'Closed Lost': 'bg-red-500',
    };
    return stageColors[stage] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading opportunity details...</p>
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-6 w-6" />
              <CardTitle>Error</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error || 'Opportunity not found'}</p>
            <Button onClick={() => router.push('/')} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isEmbedded ? 'bg-background' : 'bg-gradient-to-br from-background to-muted/20'} p-6`}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        {!isEmbedded && (
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <p className="text-sm text-muted-foreground">Opportunity Profile</p>
              <h1 className="text-3xl font-bold">{opportunity.Name}</h1>
            </div>
          </div>
        )}
        
        {isEmbedded && (
          <div className="pb-2">
            <h1 className="text-2xl font-bold">{opportunity.Name}</h1>
            <p className="text-sm text-muted-foreground mt-1">Custom Dashboard View</p>
          </div>
        )}

        {/* Main Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{opportunity.Name}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {opportunity.Account?.Name || 'No Account'}
                </CardDescription>
              </div>
              <Badge className={getStageColor(opportunity.StageName)}>
                {opportunity.StageName}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm font-medium">Amount</span>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(opportunity.Amount)}</p>
              </div>

              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm font-medium">Probability</span>
                </div>
                <p className="text-2xl font-bold">
                  {opportunity.Probability ? `${opportunity.Probability}%` : 'N/A'}
                </p>
              </div>

              <div className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm font-medium">Close Date</span>
                </div>
                <p className="text-2xl font-bold">{formatDate(opportunity.CloseDate)}</p>
              </div>
            </div>

            <Separator />

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Opportunity Details</h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Opportunity ID</p>
                    <p className="font-mono text-sm">{opportunity.Id}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">{opportunity.Type || 'N/A'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Lead Source</p>
                    <p className="font-medium">{opportunity.LeadSource || 'N/A'}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Owner</p>
                      <p className="font-medium">{opportunity.Owner?.Name || 'N/A'}</p>
                    </div>
                  </div>

                  {opportunity.Account && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Account</p>
                        <p className="font-medium">{opportunity.Account.Name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Timeline</h3>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Created Date</p>
                    <p className="font-medium">{formatDate(opportunity.CreatedDate)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Last Modified</p>
                    <p className="font-medium">{formatDate(opportunity.LastModifiedDate)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Expected Close Date</p>
                    <p className="font-medium">{formatDate(opportunity.CloseDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description (if available) */}
            {opportunity.Description && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg mb-3">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {opportunity.Description}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        {!isEmbedded && (
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => router.push('/')}>
                  Back to Dashboard
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open(`https://login.salesforce.com/${opportunity.Id}`, '_blank')}
                >
                  View in Salesforce
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function OpportunityProfile() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading opportunity details...</p>
        </div>
      </div>
    }>
      <OpportunityProfileContent />
    </Suspense>
  );
}

