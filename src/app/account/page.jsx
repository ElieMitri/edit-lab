"use client";

import Navbar from "../components/Navbar";
import styles from "../styles/Acc.module.css";
import { db, auth } from "../../../firebase";
import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { CiLogout } from "react-icons/ci";
import Link from "next/link";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Page() {
  const userData = auth.currentUser;

  const [user, setUser] = useState();

  const [matchingUser, setMatchingUser] = useState(null); // This will store the matched user data

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Get current logged-in user's email
        const currentUserEmail = currentUser.email;
        // console.log("Current User Email:", currentUserEmail);

        try {
          // Create a Firestore query to fetch users by email
          const usersCollectionRef = collection(db, "users");
          const q = query(
            usersCollectionRef,
            where("email", "==", currentUserEmail)
          );

          // Get the users that match the email
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // If a matching user is found
            const matchedUser = querySnapshot.docs[0].data(); // Get the first matching user
            setMatchingUser(matchedUser); // Store the matched user data
            // console.log("Matched User by Email:", matchedUser);
          } else {
            // console.log("No user found with this email.");
          }
        } catch (error) {
          // console.error("Error fetching users by email:", error);
        }
      } else {
        // console.log("No user is signed in.");
      }
    });

    return () => unsubscribe(); // Cleanup the listener when the component unmounts
  }, []);

  //   useEffect(() => {
  //     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //       setUser(currentUser);
  //       console.log(currentUser.displayName);
  //       console.log(currentUser.email);
  //       console.log(currentUser.uid);
  //     });
  //     return () => unsubscribe();
  //   }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // console.log(currentUser.displayName);
        // console.log(currentUser.email);
        // console.log(currentUser.uid);

        // Call the function to fetch all users from Firestore
        try {
          const usersCollectionRef = collection(db, "users");
          const querySnapshot = await getDocs(usersCollectionRef);

          const users = querySnapshot.docs.map((doc) => ({
            id: doc.id, // UID of the user
            ...doc.data(), // Other user data
          }));

          // console.log("Fetched Users:", users);
        } catch (error) {
          // console.error("Error fetching users:", error);
        }
      } else {
        // console.log("No user is signed in.");
      }
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  function signOut() {
    firebaseSignOut(auth).then(() => {
      //   router.push("/");
    });
  }

  return (
    <>
      <div>
        <Navbar />
        {user && matchingUser ? (
          <>
            <div className={styles.accDetailsWrapper}>
              <div className={styles.accDetails}>
                <div className={styles.accDetail}>
                  <h1 className={styles.accDetailText}>Email:</h1>
                  <span className={styles.detail}>{user.email}</span>
                </div>
                <div className={styles.accDetail}>
                  <h1 className={styles.accDetailText}>Name:</h1>
                  <span className={styles.detail}>{user.displayName}</span>
                </div>
                <div className={styles.accDetail}>
                  <h1 className={styles.accDetailText}>Subscription:</h1>
                  <span className={styles.detail}>
                    {matchingUser?.subscriptionPlan}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
