import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';
import { UserProfile, UserRole } from '../types';

// Pre-approved admin emails
export const ADMIN_EMAILS = [
  'ghafrishamsaal@gmail.com',
  'admin@peakshieldroofing.com',
];

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string, phone?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  loginAsDemoAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync user profile from Firestore or initialize it
  const syncUserProfile = async (firebaseUser: FirebaseUser) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const snap = await getDoc(userRef);

      const isKnownAdmin = ADMIN_EMAILS.includes(firebaseUser.email?.toLowerCase() || '');

      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        // Promote to admin if email matches admin list
        if (isKnownAdmin && data.role !== 'admin') {
          await updateDoc(userRef, { role: 'admin' });
          data.role = 'admin';
        }
        setUserProfile(data);
      } else {
        const role: UserRole = isKnownAdmin ? 'admin' : 'customer';
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Customer',
          email: firebaseUser.email || '',
          phone: firebaseUser.phoneNumber || '',
          photoURL: firebaseUser.photoURL || '',
          role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (err) {
      console.warn('Could not sync user profile from Firestore:', err);
      // Fallback local profile
      const isKnownAdmin = ADMIN_EMAILS.includes(firebaseUser.email?.toLowerCase() || '');
      setUserProfile({
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Customer',
        email: firebaseUser.email || '',
        role: isKnownAdmin ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncUserProfile(currentUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      await syncUserProfile(res.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, pass: string, name: string, phone?: string) => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (name) {
        await updateProfile(res.user, { displayName: name });
      }
      const isKnownAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
      const newProfile: UserProfile = {
        uid: res.user.uid,
        name,
        email,
        phone: phone || '',
        photoURL: '',
        role: isKnownAdmin ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const userRef = doc(db, 'users', res.user.uid);
      await setDoc(userRef, newProfile);
      setUserProfile(newProfile);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await syncUserProfile(res.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      setUserProfile((prev) => (prev ? { ...prev, ...data } : null));
    } catch (err) {
      console.error('Failed to update profile:', err);
      throw err;
    }
  };

  // Demo Admin Login helper: signs in or creates admin account
  const loginAsDemoAdmin = async () => {
    setLoading(true);
    const demoEmail = 'admin@peakshieldroofing.com';
    const demoPass = 'AdminPass123!';
    try {
      await signInWithEmailAndPassword(auth, demoEmail, demoPass);
    } catch (err: any) {
      // If doesn't exist, create it!
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        try {
          const res = await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
          const adminProfile: UserProfile = {
            uid: res.user.uid,
            name: 'PeakShield Administrator',
            email: demoEmail,
            role: 'admin',
            createdAt: new Date().toISOString(),
          };
          await setDoc(doc(db, 'users', res.user.uid), adminProfile);
          setUserProfile(adminProfile);
        } catch (innerErr) {
          console.warn('Demo admin creation fallback:', innerErr);
        }
      } else {
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = Boolean(
    userProfile?.role === 'admin' ||
    (user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase()))
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isAdmin,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        resetPassword,
        updateProfileData,
        loginAsDemoAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
