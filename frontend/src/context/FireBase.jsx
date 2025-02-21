import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { useNavigate, useLocation } from "react-router-dom";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVn37jTelRPQv-rQA-xLjgEqitJDLahu4", // ***REPLACE WITH YOUR API KEY***
  authDomain: "collabverse-643ff.firebaseapp.com",
  projectId: "collabverse-643ff",
  storageBucket: "collabverse-643ff.firebasestorage.app",
  messagingSenderId: "61506144073",
  appId: "1:61506144073:web:50bdbe1234a7a1c9c67c98",
  measurementId: "G-V02WZB9BFY",
};

const firebaseApp = initializeApp(firebaseConfig);
const googleProvider = new GoogleAuthProvider();
const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

const FireBaseContext = createContext(null);

export const useFireBase = () => useContext(FireBaseContext);

export const FireBaseProvider = (props) => {
  const firenavigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialRender = useRef(true);

  const signUpWithGoogle = async () => {
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const user = result.user;
      console.log("Sign-in successful:", user);
      firenavigate("/select-role");
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (authUser) => {
      setUser(authUser);
      setIsLoading(false);

      if (authUser) {
        try {
          const userDocRef = doc(firestore, "users", authUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUserRole(userData.role);

            if (initialRender.current) {
              initialRender.current = false;
              const currentPath = location.pathname;

              if (!currentPath.startsWith("/room/")) {
                if (userData.role) {
                  if (userData.role === "admin") {
                    firenavigate("/createworkspace");
                  } else if (userData.role === "user") {
                    firenavigate("/workspace");
                  } else {
                    console.error("Invalid user role:", userData.role);
                    firenavigate("/unauthorized");
                  }
                } else {
                  firenavigate("/select-role");
                }
              }
            }
          } else {
            firenavigate("/select-role");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          firenavigate("/error");
        }
      } else {
        setUserRole(null);
        firenavigate("/");
      }
    });

    return () => unsubscribe();
  }, [firenavigate]);

  const handleRoleSelection = async (role) => {
    if (!user) {
      console.error("No user logged in.");
      return;
    }

    try {
      const userDocRef = doc(firestore, "users", user.uid);
      await setDoc(userDocRef, { role });
      console.log("Role saved to Firestore:", role);
      setUserRole(role);

      if (role === "admin") {
        firenavigate("/createworkspace");
      } else if (role === "user") {
        firenavigate("/workspace");
      }
    } catch (error) {
      console.error("Error saving user role:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await firebaseAuth.signOut();
      console.log("Sign-out successful");
      setUser(null);
      setUserRole(null);
      firenavigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <FireBaseContext.Provider
      value={{
        firebaseApp,
        signUpWithGoogle,
        firebaseAuth,
        user,
        userRole,
        handleRoleSelection,
        isLoading,
        handleSignOut,
      }}
    >
      {props.children}
    </FireBaseContext.Provider>
  );
};