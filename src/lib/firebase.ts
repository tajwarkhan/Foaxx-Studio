import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthSuccess) {
          // Pass available user info even if token was cleared on page reload
          onAuthSuccess(user, '');
        }
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential?.accessToken || '';
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutGoogle = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};

export const sendFirebasePasswordReset = async (
  email: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    const actionCodeSettings = currentOrigin
      ? {
          url: currentOrigin,
          handleCodeInApp: true,
        }
      : undefined;

    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    return { success: true };
  } catch (err: any) {
    // If actionCodeSettings domain is restricted, fallback to default dispatch
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (fallbackErr: any) {
      console.warn('Firebase sendPasswordResetEmail notice:', fallbackErr);
      return {
        success: false,
        error:
          fallbackErr?.code === 'auth/user-not-found'
            ? 'Account not found in Firebase Auth database.'
            : fallbackErr?.message || 'Firebase reset error',
      };
    }
  }
};

export const verifyFirebaseResetCode = async (
  code: string
): Promise<{ success: boolean; email?: string; error?: string }> => {
  try {
    const email = await verifyPasswordResetCode(auth, code);
    return { success: true, email };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Invalid or expired password reset link.',
    };
  }
};

export const confirmFirebasePasswordReset = async (
  code: string,
  newPass: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await confirmPasswordReset(auth, code, newPass);
    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to update password in Firebase Auth.',
    };
  }
};
