'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/ui/icons';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function AuthPage() {
  // Add spinner animation styles
  const spinnerStyle = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  React.useEffect(() => {
    // Add spinner animation and reset body styles
    const style = document.createElement('style');
    style.textContent = spinnerStyle + `
      body {
        margin: 0 !important;
        padding: 0 !important;
        overflow-x: hidden;
      }
      html {
        margin: 0 !important;
        padding: 0 !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (style.parentNode) {
        document.head.removeChild(style);
      }
    };
  }, []);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error('Invalid email or password');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }



  return (
    <div 
      style={{
        minHeight: '100vh',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        position: 'fixed',
        top: 0,
        left: 0,
        background: 'linear-gradient(135deg, #74b9ff 0%, #b3d9ff 100%)',
        backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><defs><linearGradient id="a" x1="0" x2="0" y1="1" y2="0"><stop offset="0" stop-color="%23a8e6cf"/><stop offset="1" stop-color="%2387ceeb"/></linearGradient></defs><rect fill="url(%23a)" width="1600" height="900"/></svg>')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        margin: 0,
        boxSizing: 'border-box'
      }}
    >
      {/* Imotory branding in top-left */}
      <div 
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '24px',
          zIndex: 10
        }}
      >
        Imotory
      </div>

      {/* Centered login card */}
      <div 
        style={{
          width: '100%',
          maxWidth: '450px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            padding: '40px',
            border: '1px solid #f3f4f6',
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden'
          }}
        >
          {/* Login icon */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div 
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#f3f4f6',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icons.logIn style={{ width: '32px', height: '32px', color: '#374151' }} />
            </div>
          </div>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
              Sign in with email
            </h1>
            <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
              Make a new doc to bring your words, data,<br />
              and teams together. For free
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
            {/* Email Input */}
            <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
              <Icons.mail 
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  width: '20px',
                  height: '20px'
                }}
              />
              <input
                id="email"
                type="email"
                placeholder="Email"
                style={{
                  width: '100%',
                  height: '48px',
                  paddingLeft: '48px',
                  paddingRight: '16px',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  color: '#111827',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            {/* Password Input */}
            <div style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
              <Icons.lock 
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  width: '20px',
                  height: '20px'
                }}
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                style={{
                  width: '100%',
                  height: '48px',
                  paddingLeft: '48px',
                  paddingRight: '48px',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  color: '#111827',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Icons.eyeOff style={{ width: '20px', height: '20px' }} />
                ) : (
                  <Icons.eye style={{ width: '20px', height: '20px' }} />
                )}
              </button>
            </div>

            {/* Forgot Password */}
            <div style={{ textAlign: 'right' }}>
              <button
                type="button"
                style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}
                onMouseOver={(e) => (e.target as HTMLButtonElement).style.textDecoration = 'underline'}
                onMouseOut={(e) => (e.target as HTMLButtonElement).style.textDecoration = 'none'}
              >
                Forgot password?
              </button>
            </div>

            {/* Error Alert */}
            {error && (
              <div 
                style={{
                  padding: '12px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '12px',
                  color: '#dc2626',
                  fontSize: '14px'
                }}
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit" 
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: '#111827',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              disabled={isLoading}
              onMouseOver={(e) => {
                if (!isLoading) {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#1f2937';
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#111827';
                }
              }}
            >
              {isLoading ? (
                <Icons.spinner style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
              ) : null}
              Get Started
            </button>
          </form>


        </div>
      </div>
    </div>
  );
}