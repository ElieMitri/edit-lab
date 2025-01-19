"use client";

import Navbar from "../components/Navbar";
import styles from "../styles/Course.module.css";
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
import { courseData } from "../../../courseData";
import { styled } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";

export default function Page({ params }) {
  const { id } = React.use(params);

  console.log(id);
  const course = courseData.find((item) => +item.id === +id);

  const userData = auth.currentUser;

  const [user, setUser] = useState();
  const [paid, setPaid] = useState(false);
  const [text, setText] = useState(false);

  const [matchingUser, setMatchingUser] = useState(null); // This will store the matched user data

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Get current logged-in user's email
        const currentUserEmail = currentUser.email;
        console.log("Current User Email:", currentUserEmail);

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
            console.log(matchedUser);
            if (matchedUser.subscriptionPlan === "Paid") {
              setPaid(true);
            }
          } else {
            console.log("No user found with this email.");
          }
        } catch (error) {
          console.error("Error fetching users by email:", error);
        }
      } else {
        console.log("No user is signed in.");
      }
    });

    return () => unsubscribe(); // Cleanup the listener when the component unmounts
  }, []);

  useEffect(() => {
    console.log(courseData);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        console.log(currentUser.displayName);
        console.log(currentUser.email);
        console.log(currentUser.uid);

        // Call the function to fetch all users from Firestore
        try {
          const usersCollectionRef = collection(db, "users");
          const querySnapshot = await getDocs(usersCollectionRef);

          const users = querySnapshot.docs.map((doc) => ({
            id: doc.id, // UID of the user
            ...doc.data(), // Other user data
          }));

          console.log("Fetched Users:", users);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      } else {
        console.log("No user is signed in.");
      }
    });

    return () => unsubscribe(); 
  }, []);

  function signOut() {
    firebaseSignOut(auth).then(() => {
      
    });
  }

  return (
    <>
      <div>
        <Navbar />
        {user ? (
          <>
            {paid ? (
              <>
                <div className={styles.courseDetailsWrapper}>
                  <div className={styles.courseDetails}>
                    {courseData.map((course, index) => (
                      <Link
                        href={`/course/${course.id}`}
                        className={styles.courseDetailAccess}
                        key={index}
                      >
                        <div className={styles.detailItem}>
                          Title: {course.title}
                        </div>
                        <div className={styles.detailItem}>
                          Duration: {course.duration}
                        </div>
                        <label className={styles.checkboxWrapper}>
                          <input type="checkbox" className={styles.checkbox} />
                          <span className={styles.customCheckbox}></span>
                        </label>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.courseDetailsWrapper}>
                <div className={styles.courseDetails}>
                  {courseData.map((course, index) => (
                    <div className={styles.courseDetail} key={index}>
                      <div className={styles.detailItem}>
                        Title: {course.title}
                      </div>
                      <div className={styles.detailItem}>
                        Duration: {course.duration}
                      </div>
                      <label className={styles.checkboxWrapper}>
                        <input type="checkbox" className={styles.checkbox} />
                        <span className={styles.customCheckbox}></span>
                      </label>
                      <h1 className={styles.noAccess}>No Access</h1>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}