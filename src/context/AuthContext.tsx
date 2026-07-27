import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { pullSettingsFromCloud, clearCloudSettingsFromLocal } from '../Main_chat/utils/settingsSync';
import { getWelcomeEmailHtml } from './WelcomeEmailTemplate';
import { getLoginAlertEmailHtml } from './ReturningEmailTemplate';

const sendClientAuthEmail = async (email: string, firstName: string, isFirstTime: boolean) => {
  const emailHtml = isFirstTime ? getWelcomeEmailHtml(firstName) : getLoginAlertEmailHtml(firstName);
  const subject = isFirstTime ? 'Welcome to Nothric!' : 'Welcome Back to Nothric!';

  const url = '/resend-api/emails';
  const resendKey = import.meta.env.VITE_RESEND_API_KEY || 're_RuQyPUzw_6244v8mV89gswqdjUvcUX7eH';

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendKey}`
      },
      body: JSON.stringify({
        from: 'Nothric <onboarding@resend.dev>',
        to: [email],
        subject,
        html: emailHtml,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.warn('Resend email response:', data);
    } else {
      console.log(`Resend ${isFirstTime ? 'Welcome' : 'Login notification'} email sent to ${email}, ID: ${data.id}`);
    }
  } catch (err) {
    console.error('Error triggering Resend email:', err);
  }
};

interface AuthContextType {
  user: any;
  isInitializing: boolean;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(() => {
    const cached = localStorage.getItem('auth_user_cache');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
    return null;
  });
  const [isInitializing, setIsInitializing] = useState(() => !localStorage.getItem('auth_user_cache'));

  useEffect(() => {
    let active = true;

    const syncUserSettings = async (event?: string) => {
      try {
        const currentUser = (await supabase.auth.getUser()).data.user;
        if (!currentUser || !currentUser.email) return;

        const fullName = currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || '';
        const firstName = currentUser.user_metadata?.first_name || fullName.split(' ')[0] || currentUser.email.split('@')[0] || 'there';

        const isWelcomeSent = !!currentUser.user_metadata?.welcome_email_sent;

        if (!isWelcomeSent) {
          // Send First-Time Welcome Email
          await sendClientAuthEmail(currentUser.email, firstName, true);
          await supabase.auth.updateUser({
            data: {
              ...currentUser.user_metadata,
              welcome_email_sent: true
            }
          });
        } else if (event === 'SIGNED_IN') {
          // Send Returning User Login Notification on SIGNED_IN
          await sendClientAuthEmail(currentUser.email, firstName, false);
        }
        
        if (active) {
          await pullSettingsFromCloud();
        }
      } catch (err) {
        console.error('Failed to sync settings from Supabase:', err);
      }
    };

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (active) {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
          if (currentUser) {
            localStorage.setItem('auth_user_cache', JSON.stringify(currentUser));
          } else {
            localStorage.removeItem('auth_user_cache');
          }
        }
      } catch (err) {
        console.error("Auth session fetch error:", err);
      } finally {
        if (active) {
          setIsInitializing(false);
        }
      }
    };

    checkSession();

    let lastUserId: string | null = null;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (active) {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          localStorage.setItem('auth_user_cache', JSON.stringify(currentUser));
        } else {
          const hadCachedUser = !!localStorage.getItem('auth_user_cache');
          localStorage.removeItem('auth_user_cache');
          if (_event === 'SIGNED_OUT' && hadCachedUser) {
            clearCloudSettingsFromLocal();
          }
        }
        setIsInitializing(false);

        if (currentUser) {
          await syncUserSettings(_event);
        }
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isInitializing, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
