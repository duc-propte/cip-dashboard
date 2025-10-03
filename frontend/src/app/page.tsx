import SalesforceIntegration from '@/components/SalesforceIntegration';

export default function Home() {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-7xl mx-auto space-y-8 py-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            CIP Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect your Salesforce account to access and manage your opportunities
            in a beautiful, modern dashboard.
          </p>
        </div>

        {/* Integration Card & Opportunities */}
        <div className="w-full">
          <SalesforceIntegration />
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
            <h3 className="font-semibold mb-2">Real-time Sync</h3>
            <p className="text-sm text-muted-foreground">
              Stay up to date with automatic synchronization of your Salesforce data
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
            <h3 className="font-semibold mb-2">Secure Authentication</h3>
            <p className="text-sm text-muted-foreground">
              OAuth 2.0 integration ensures your data is always protected
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
            <h3 className="font-semibold mb-2">Easy Management</h3>
            <p className="text-sm text-muted-foreground">
              View and manage opportunities with an intuitive interface
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
