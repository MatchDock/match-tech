import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../shared/lib/firebase/firebase.client';
import {
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from 'firebase/auth';
import { authLog } from '../shared/lib/logger/logger';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  magicLinkSent: boolean;
  magicLinkEmail: string | null;
  completingMagicLink: boolean;
  resetMagicLinkState: () => void;
  pendingMagicLinkUrl: string | null;
  confirmMagicLinkEmail: (email: string) => Promise<void>;
}

const MAGIC_EMAIL_KEY = 'matchtech_magic_email';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [magicLinkEmail, setMagicLinkEmail] = useState<string | null>(null);
  const [completingMagicLink, setCompletingMagicLink] = useState(false);
  const [pendingMagicLinkUrl, setPendingMagicLinkUrl] = useState<string | null>(null);

  useEffect(() => {
    // Detecta se a URL atual é um Magic Link de login
    if (isSignInWithEmailLink(auth, window.location.href)) {
      setCompletingMagicLink(true);
      authLog.info('Magic Link detectado na URL. Completando login...');

      // Recupera o email salvo no localStorage (mesmo dispositivo)
      const savedEmail = window.localStorage.getItem(MAGIC_EMAIL_KEY);

      if (savedEmail) {
        // Mesmo dispositivo: completa imediatamente
        signInWithEmailLink(auth, savedEmail, window.location.href)
          .then(() => {
            authLog.info('Login via Magic Link realizado com sucesso.');
            window.localStorage.removeItem(MAGIC_EMAIL_KEY);
            window.history.replaceState(null, '', window.location.pathname);
          })
          .catch((err) => {
            authLog.error('Erro ao completar login via Magic Link:', err);
          })
          .finally(() => {
            setCompletingMagicLink(false);
          });
      } else {
        // Dispositivo diferente: armazena a URL e pede email via UI própria
        authLog.warn('Magic Link: email não encontrado no dispositivo. Aguardando confirmação via UI.');
        setPendingMagicLinkUrl(window.location.href);
        window.history.replaceState(null, '', window.location.pathname);
        setCompletingMagicLink(false);
      }
    }

    // Listener padrão de autenticação
    const unsubscribe = auth.onAuthStateChanged((u) => {
      authLog.info(
        'Estado de autenticação mudou:',
        u?.email ? { email: u?.email } : { "error": "nao autenticado" }
      );
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Login via Google (Popup)
  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      authLog.info('Login via Google realizado com sucesso (popup).');
    } catch (err) {
      authLog.error('Erro no login via popup do Google:', err);
      throw err;
    }
  };

  // Login via Magic Link (Email sem senha)
  const sendMagicLink = async (email: string) => {
    const actionCodeSettings = {
      // Usa a URL atual do site (funciona no localhost E na Vercel automaticamente)
      url: `${window.location.origin}/onboarding`,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      // Salva o email no localStorage para não pedir de novo quando voltar pelo link
      window.localStorage.setItem(MAGIC_EMAIL_KEY, email);
      setMagicLinkSent(true);
      setMagicLinkEmail(email);
      authLog.info(`Magic Link enviado para: ${email}`);
    } catch (err) {
      authLog.error('Erro ao enviar Magic Link:', err);
      throw err;
    }
  };

  // Reset do estado do Magic Link (para voltar à tela de login)
  const resetMagicLinkState = () => {
    setMagicLinkSent(false);
    setMagicLinkEmail(null);
  };

  const logOut = async () => {
    await signOut(auth);
    authLog.info('Usuário fez logout.');
  };

  // Confirma email para login em dispositivo diferente (substitui window.prompt)
  const confirmMagicLinkEmail = async (email: string) => {
    if (!pendingMagicLinkUrl) return;
    setCompletingMagicLink(true);
    try {
      await signInWithEmailLink(auth, email, pendingMagicLinkUrl);
      authLog.info('Login via Magic Link (cross-device) realizado com sucesso.');
      setPendingMagicLinkUrl(null);
    } catch (err) {
      authLog.error('Erro ao confirmar Magic Link (cross-device):', err);
      throw err;
    } finally {
      setCompletingMagicLink(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      logOut,
      sendMagicLink,
      magicLinkSent,
      magicLinkEmail,
      completingMagicLink,
      resetMagicLinkState,
      pendingMagicLinkUrl,
      confirmMagicLinkEmail,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
