'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, RefreshCw, DollarSign, Calendar, TrendingUp, Eye } from 'lucide-react';
import { Opportunity } from '@/lib/salesforceApi';

interface OpportunitiesListProps {
  opportunities: Opportunity[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export default function OpportunitiesList({ 
  opportunities, 
  isLoading = false,
  onRefresh 
}: OpportunitiesListProps) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<'name' | 'amount' | 'closeDate'>('closeDate');

  // Format currency
  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get stage color
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

  // Sort opportunities
  const sortedOpportunities = [...opportunities].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.Name.localeCompare(b.Name);
      case 'amount':
        return (b.Amount || 0) - (a.Amount || 0);
      case 'closeDate':
        return new Date(b.CloseDate).getTime() - new Date(a.CloseDate).getTime();
      default:
        return 0;
    }
  });

  // Calculate statistics
  const totalAmount = opportunities.reduce((sum, opp) => sum + (opp.Amount || 0), 0);
  const avgAmount = opportunities.length > 0 ? totalAmount / opportunities.length : 0;
  const closedWon = opportunities.filter(opp => opp.StageName === 'Closed Won').length;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Opportunities</CardTitle>
            <CardDescription>
              Showing {opportunities.length} opportunities from Salesforce
            </CardDescription>
          </div>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <DollarSign className="h-4 w-4" />
              Total Value
            </div>
            <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              Average Deal
            </div>
            <div className="text-2xl font-bold">{formatCurrency(avgAmount)}</div>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" />
              Closed Won
            </div>
            <div className="text-2xl font-bold">{closedWon}</div>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No opportunities found</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => setSortBy('name')}>
                    Opportunity Name
                  </TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => setSortBy('amount')}>
                    Amount
                  </TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => setSortBy('closeDate')}>
                    Close Date
                  </TableHead>
                  <TableHead>Probability</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOpportunities.map((opp) => (
                  <TableRow key={opp.Id}>
                    <TableCell className="font-medium">{opp.Name}</TableCell>
                    <TableCell>{opp.Account?.Name || 'N/A'}</TableCell>
                    <TableCell>{formatCurrency(opp.Amount)}</TableCell>
                    <TableCell>
                      <Badge className={getStageColor(opp.StageName)}>
                        {opp.StageName}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(opp.CloseDate)}</TableCell>
                    <TableCell>{opp.Probability ? `${opp.Probability}%` : 'N/A'}</TableCell>
                    <TableCell>{opp.Owner?.Name || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/opportunity-profile/${opp.Id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

