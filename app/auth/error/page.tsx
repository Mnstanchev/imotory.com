'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'CredentialsSignin':
        return 'Invalid email or password. Please try again.';
      case 'Configuration':
        return 'Authentication configuration error.';
      case 'AccessDenied':
        return 'Access denied. You do not have permission to sign in.';
      case 'Verification':
        return 'Email verification required.';
      default:
        return 'An authentication error occurred. Please try again.';
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: '#f9fafb'
      }}
    >
      <div 
        style={{
          maxWidth: '400px',
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}
      >
        <div 
          style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#fee2e2',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}
        >
          <span style={{ fontSize: '24px' }}>⚠️</span>
        </div>
        
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Authentication Error
        </h1>
        
        <p style={{ color: '#6b7280', marginBottom: '24px', lineHeight: '1.5' }}>
          {getErrorMessage(error)}
        </p>

        {error && (
          <div 
            style={{
              backgroundColor: '#f3f4f6',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '24px',
              fontSize: '14px',
              color: '#6b7280'
            }}
          >
            Error code: {error}
          </div>
        )}
        
        <Button 
          onClick={() => router.push('/')}
          style={{
            width: '100%',
            height: '48px',
            backgroundColor: '#111827',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb'
      }}>
        <div>Loading...</div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}