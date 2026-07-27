import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton, useAuth } from '@clerk/react'
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || ''
const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

function SupabaseDataVerifier() {
  const { getToken, userId } = useAuth()
  const [dbStatus, setDbStatus] = useState('Initiating validation...')
  const [userToken, setUserToken] = useState('')

  useEffect(() => {
    async function verifyConnection() {
      if (!userId) return;

      try {
        // 1. Get the Supabase specific JWT token from Clerk
        const token = await getToken({ template: 'supabase' })
        
        if (!token) {
          setDbStatus('Error: Could not retrieve JWT token from Clerk. Make sure you set up the Supabase JWT template in the Clerk Dashboard.')
          return;
        }

        setUserToken(token.substring(0, 30) + '...')

        // 2. Initialize a scoped Supabase client using Clerk's custom JWT
        const tempSupabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, {
          global: {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        })

        // 3. Query the user profiles or config table to test RLS
        // (Replace 'profiles' with your actual table name if different)
        const { data, error } = await tempSupabase
          .from('profiles')
          .select('*')
          .limit(1)

        if (error) {
          setDbStatus(`Clerk Auth working. Supabase returned RLS error: ${error.message} (This is normal if table is empty or policies block reads)`)
        } else {
          setDbStatus(`Success! Clerk + Supabase linked. Query returned: ${JSON.stringify(data)}`)
        }
      } catch (err: any) {
        setDbStatus(`Execution error: ${err.message}`)
      }
    }

    verifyConnection()
  }, [userId, getToken])

  return (
    <div style={{ marginTop: '24px', padding: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', color: '#0f172a', textAlign: 'left' }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 700 }}>Connection Details</h4>
      <p style={{ margin: '6px 0', fontSize: '0.88rem' }}><strong>Clerk User ID:</strong> <code>{userId}</code></p>
      <p style={{ margin: '6px 0', fontSize: '0.88rem', wordBreak: 'break-all' }}><strong>Clerk JWT Token Prefix:</strong> <code>{userToken}</code></p>
      <p style={{ margin: '6px 0', fontSize: '0.88rem' }}><strong>Supabase Status:</strong> {dbStatus}</p>
    </div>
  )
}

export default function ClerkTestPage() {
  if (!CLERK_PUBLISHABLE_KEY) {
    return (
      <div style={{ padding: '40px', color: '#dc2626', fontFamily: 'sans-serif', maxWidth: '600px', margin: '40px auto', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fee2e2' }}>
        <h3 style={{ marginTop: 0 }}>Missing Clerk Configuration</h3>
        <p style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
          The Clerk Publishable Key was not found in your environment variables.
        </p>
        <ol style={{ fontSize: '0.9rem', paddingLeft: '20px', lineHeight: 1.6 }}>
          <li>Make sure you ran <code>npx clerk env pull</code> in your terminal.</li>
          <li>Check that <code>VITE_CLERK_PUBLISHABLE_KEY</code> is set inside your <code>.env.local</code> file.</li>
          <li>Restart your development server (<code>npm run dev</code>) so Vite loads the new variables.</li>
        </ol>
      </div>
    )
  }

  return (
    <ClerkProvider 
      publishableKey={CLERK_PUBLISHABLE_KEY}
      signInForceRedirectUrl="/clerk-test"
      signUpForceRedirectUrl="/clerk-test"
    >
      <div style={{ padding: '60px 24px', maxWidth: '600px', margin: '0 auto', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', color: '#0f172a' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 8px 0' }}>Clerk + Supabase Integration</h2>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>Testing secure Custom Domain OAuth logins</p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          <Show when="signed-out">
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '24px' }}>You are currently signed out.</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <SignInButton mode="modal" forceRedirectUrl="/clerk-test">
                  <button style={{ background: '#0f172a', color: '#ffffff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem', transition: 'background 0.15s' }}>
                    Sign in with Google
                  </button>
                </SignInButton>
                <SignUpButton mode="modal" forceRedirectUrl="/clerk-test">
                  <button style={{ background: 'transparent', color: '#0f172a', border: '1px solid #e2e8f0', padding: '12px 24px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem', transition: 'background 0.15s' }}>
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </div>
          </Show>

          <Show when="signed-in">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <UserButton />
                  <div>
                    <span style={{ display: 'block', fontWeight: 600, fontSize: '0.95rem' }}>Session Active</span>
                    <span style={{ display: 'block', color: '#64748b', fontSize: '0.75rem' }}>Authenticated via Clerk</span>
                  </div>
                </div>
                <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.72rem', fontWeight: 700, padding: '4px 8px', borderRadius: '6px' }}>SIGNED IN</span>
              </div>
              
              <SupabaseDataVerifier />
            </div>
          </Show>
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <a href="/pricing" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.88rem' }}>&larr; Back to Pricing Page</a>
        </div>
      </div>
    </ClerkProvider>
  )
}
