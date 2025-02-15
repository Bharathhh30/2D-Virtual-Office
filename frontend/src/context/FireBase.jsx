
import React, { createContext,useState,useContext, useEffect } from 'react';
import {initializeApp, setLogLevel} from 'firebase/app';
import { useNavigate } from 'react-router-dom';
import {
    GoogleAuthProvider,
    getAuth, 
    signInWithPopup,
    onAuthStateChanged,
} from 'firebase/auth';
import {
    doc,
    getDoc,
    setDoc,
    getFirestore,
} from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyAVn37jTelRPQv-rQA-xLjgEqitJDLahu4",
    authDomain: "collabverse-643ff.firebaseapp.com",
    projectId: "collabverse-643ff",
    storageBucket: "collabverse-643ff.firebasestorage.app",
    messagingSenderId: "61506144073",
    appId: "1:61506144073:web:50bdbe1234a7a1c9c67c98",
    measurementId: "G-V02WZB9BFY"
  };

// initialize karo app ko
const firebaseApp = initializeApp(firebaseConfig)
// google provder ka object banao and also for get auth
const googleProvider = new GoogleAuthProvider()
const firebaseAuth = getAuth(firebaseApp)
const firestore = getFirestore(firebaseApp)

// create a context ra
const FireBaseContext = createContext(null)

// use karna hai to export karna hai
export const useFireBase = () =>{
    return useContext(FireBaseContext)
}

export const FireBaseProvider = (props) =>{
    const firenavigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const signUpWithGoogle = async()=>{
        const result = await signInWithPopup(firebaseAuth,googleProvider)
        const user = result.user;
        console.log("Sign-in successful:", user);
        firenavigate('/select-role')
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (authUser) => {
            setUser(authUser);
            setIsLoading(false); // Done checking authentication state
    
            if (authUser) {
                try {
                    const userDocRef = doc(firestore, 'users', authUser.uid);
                    const userDocSnapshot = await getDoc(userDocRef);
    
                    if (userDocSnapshot.exists()) {
                        const userData = userDocSnapshot.data();
                        setUserRole(userData.role);
    
                        // Robust Redirection Logic:
                        if (userData.role) { // Check if role exists (not null or undefined)
                            if (userData.role === 'admin') {
                                firenavigate('/createworkspace');
                            } else if (userData.role === 'user') {
                                firenavigate('/workspace');
                            } else {
                                console.error("Invalid user role:", userData.role);
                                firenavigate('/unauthorized'); // Or handle the invalid role case
                            }
                        } else {
                            // User document exists, but role is not set (e.g., first login)
                            firenavigate('/select-role');
                        }
                    } else {
                        // User document doesn't exist (new user)
                        firenavigate('/select-role');
                    }
                } catch (error) {
                    console.error("Error fetching user role:", error);
                    firenavigate('/error'); // Redirect to an error page
                }
            } else {
                setUserRole(null); // Clear the role if the user signs out
                navigate('/');
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
            const userDocRef = doc(firestore, 'users', user.uid);
            await setDoc(userDocRef, { role }); // Store the selected role
            console.log("Role saved to Firestore:", role)
            setUserRole(role);
            if (role === 'admin') {
                firenavigate('/admin');
            } else if (role === 'worker') {
                firenavigate('/worker');
            }
        } catch (error) {
            console.error("Error saving user role:", error);
            // Handle error, maybe display a message to the user
        }
    };

    const handleSignOut = async() => {
        await firebaseAuth.signOut();
        console.log("Sign-out successful");
        firenavigate('/');
    }

    return (
        <FireBaseContext.Provider value={{
            firebaseApp,
            signUpWithGoogle,
            firebaseAuth,
            user,
            userRole,
            handleRoleSelection,
            isLoading,
            handleSignOut,

        }}>
            {props.children}
        </FireBaseContext.Provider>

    )
}
  