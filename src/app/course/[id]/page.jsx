"use client";

import Image from "next/image";

import styles from "../../styles/Player.module.css";
import style from "../../styles/Nav.module.css";
import Navbar from "../../components/Navbar";
import { courseData } from "../../../../courseData";
import React from "react";
import { useState, useEffect } from "react";
import { db, auth } from "../../../../firebase";
import Link from "next/link";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { LuCrown } from "react-icons/lu";
import { FaLock } from "react-icons/fa";

export default function Page({ params }) {
  const { id } = React.use(params);

  const [paid, setPaid] = useState(false);
  const [user, setUser] = useState();
  const [matchingUser, setMatchingUser] = useState();
  const [markedComplete, setMarkedComplete] = useState(false);
  const currentId = parseInt(id);

  const course = courseData.find((item) => +item.id === +id);

  const maxId = Math.max(...courseData.map(course => course.id));
  const isLastCourse = currentId >= maxId;


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

  return (
    <div>
      <Navbar />

      {paid ? (
        <div className={styles.videoWrapper}>
          <div className={styles.video}>
            <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
              <iframe
                src={course.videoUrl}
                // src="https://player.vimeo.com/video/851580640?badge=0&autopause=0&player_id=0&app_id=58479"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
                // title={course.title}
              ></iframe>
            </div>
          </div>
          <div className={styles.textWrapper}>
            <h1 className={styles.videoTitle}>{course.title}</h1>
            {/* <p>{course.description}</p>  */}
            <div className={styles.buttonWrapper}>
              {markedComplete ? (
                <button
                  className={styles.completed}
                  onClick={() => setMarkedComplete(false)}
                >
                  Mark Complete
                </button>
              ) : (
                <button
                  className={styles.buttonContinue}
                  onClick={() => setMarkedComplete(true)}
                >
                  Mark Complete
                </button>
              )}
              {!isLastCourse && (
                <Link href={`/course/${currentId + 1}`}>
                  <button className={styles.buttonMark}>Continue</button>
                </Link>
              )}
              {isLastCourse && (
                <button className={styles.buttonMarkLast} disabled>
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.videoWrapper}>
          <div className={styles.video}>
            <div
              style={{
                padding: "56.25% 0 0 0",
                position: "relative",
                backgroundColor: "black",
              }}
            >
              <iframe
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
                // title={course.title}
              ></iframe>
              <FaLock className={styles.lock} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
