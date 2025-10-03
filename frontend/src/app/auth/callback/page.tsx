'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setMessage(`Authentication failed: ${error}`);
      
      // Send error to parent window
      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'SALESFORCE_AUTH_ERROR',
            error: error,
          },
          window.location.origin
        );
      }
      
      setTimeout(() => {
        window.close();
      }, 3000);
      return;
    }

    if (!code) {
      setStatus('error');
      setMessage('No authorization code received');
      setTimeout(() => {
        window.close();
      }, 3000);
      return;
    }

    // Exchange code for tokens
    fetch(`${API_BASE_URL}/api/auth/callback?code=${code}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus('success');
          setMessage('Successfully connected to Salesforce!');

          // Send success to parent window
          if (window.opener) {
            window.opener.postMessage(
              {
                type: 'SALESFORCE_AUTH_SUCCESS',
                authData: data.data,
              },
              window.location.origin
            );
          }

          setTimeout(() => {
            window.close();
          }, 2000);
        } else {
          throw new Error(data.error || 'Authentication failed');
        }
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'Failed to complete authentication');
        
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'SALESFORCE_AUTH_ERROR',
              error: err.message,
            },
            window.location.origin
          );
        }

        setTimeout(() => {
          window.close();
        }, 3000);
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 p-8">
        {status === 'loading' && (
          <>
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <h2 className="text-xl font-semibold">{message}</h2>
            <p className="text-sm text-muted-foreground">
              Please wait while we connect your Salesforce account...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="h-12 w-12 mx-auto text-green-600" />
            <h2 className="text-xl font-semibold text-green-600">{message}</h2>
            <p className="text-sm text-muted-foreground">
              This window will close automatically...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="h-12 w-12 mx-auto text-red-600" />
            <h2 className="text-xl font-semibold text-red-600">{message}</h2>
            <p className="text-sm text-muted-foreground">
              This window will close automatically...
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 p-8">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <h2 className="text-xl font-semibold">Loading...</h2>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}

