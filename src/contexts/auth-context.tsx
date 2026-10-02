"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userProfile: UserProfile | null;
  refreshProfile: () => Promise<void>;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phone: string;
  location: string;
  createdAt: unknown;
  lastLoginAt: unknown;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  userProfile: null,
  refreshProfile: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (firebaseUser: User) => {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const profile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        phone: "",
        location: "",
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      };
      await setDoc(userRef, profile);
      setUserProfile(profile);
    } else {
      const existing = userSnap.data() as UserProfile;
      if (!existing.phone) existing.phone = "";
      if (!existing.location) existing.location = "";
      await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
      setUserProfile(existing);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserProfile(userSnap.data() as UserProfile);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        await fetchProfile(firebaseUser);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, userProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
