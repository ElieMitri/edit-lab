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
import {
  setDoc,
  doc,
  serverTimestamp,
  addDoc,
  getDoc,
  updateDoc,
  signOut,
  getFirestore,
} from "firebase/firestore";

export default function Page({ params }) {
  const { id } = React.use(params);

  const [paid, setPaid] = useState(false);
  const [user, setUser] = useState();
  const [matchingUser, setMatchingUser] = useState();
  const [markedComplete, setMarkedComplete] = useState(false);
  const currentId = parseInt(id);
  const [lessons, setLessons] = useState([]);
  const [markedLessonResult, setMarkedLessonResult] = useState([]);
  const [dataResult, setDataResult] = useState([]);

  const course = courseData.find((item) => +item.id === +id);

  const maxId = Math.max(...courseData.map((course) => course.id));
  const isLastCourse = currentId >= maxId;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const currentUserEmail = currentUser.email;
        // console.log("Current User Email:", currentUserEmail);

        try {
          const usersCollectionRef = collection(db, "users");
          const q = query(
            usersCollectionRef,
            where("email", "==", currentUserEmail)
          );

          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // If a matching user is found
            const matchedUser = querySnapshot.docs[0].data();
            setMatchingUser(matchedUser);
            // console.log(matchedUser);
            if (matchedUser.subscriptionPlan === "Paid") {
              setPaid(true);
            }
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

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchCompletedLessons = async () => {
      try {
        const lessonsRef = collection(
          db,
          "completedLessons",
          user.uid,
          "markedLessons"
        );

        const querySnapshot = await getDocs(lessonsRef);

        const fetchedLessons = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // console.log(id);
        // console.log(...fetchedLessons);

        if (id) {
          const foundLesson = fetchedLessons.find(
            (lesson) => +lesson.id === +id
          );
          // console.log(foundLesson);

          if (foundLesson) {
            const isMarkedComplete =
              foundLesson.markedComplete === "true" ||
              foundLesson.markedComplete === true;

            if (isMarkedComplete) {
              setMarkedComplete(true);
            }
          } else {
            // console.log("No lesson found with the provided ID.");
          }
        } else {
          // console.log("No ID provided.");
        }
      } catch (error) {
        // console.error("Error fetching completed lessons:", error);
      }
    };

    fetchCompletedLessons();
  }, [db, user, id]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);


  async function markComplete() {
    if (!user || !id) {
      console.error("User or lesson ID is missing");
      return;
    }

    try {
      const lessonsRef = collection(
        db,
        "completedLessons",
        user.uid,
        "markedLessons"
      );

      const querySnapshot = await getDocs(lessonsRef);

      const fetchedLessons = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const foundLesson = fetchedLessons.find((lesson) => +lesson.id === +id);

      if (foundLesson) {
        const documentIDs = querySnapshot.docs.map((doc) => doc.id);

        const matchingDocID = documentIDs.find(
          (docID) => +docID === +foundLesson.id
        );

        if (matchingDocID) {
          const docRef = doc(
            db,
            "completedLessons",
            user.uid,
            "markedLessons",
            matchingDocID
          );
          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists()) {
            const markedComplete = docSnapshot.data().markedComplete;

            await updateDoc(docRef, {
              markedComplete: "true",
            });
            setMarkedComplete(true)
          } else {
            // console.log("No document found for the matching ID.");
          }
        } else {
          // console.log("No matching document found for the lesson.");
        }
      } else {
        // console.log("Lesson not found in the fetched lessons.");
      }

      if (id) {
      } else {
      }
    } catch (error) {}

  }
  async function removeMarkComplete() {
    if (!user || !id) {
      console.error("User or lesson ID is missing");
      return;
    }

    try {
      const lessonsRef = collection(
        db,
        "completedLessons",
        user.uid,
        "markedLessons"
      );

      const querySnapshot = await getDocs(lessonsRef);

      const fetchedLessons = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const foundLesson = fetchedLessons.find((lesson) => +lesson.id === +id);

      if (foundLesson) {
        const documentIDs = querySnapshot.docs.map((doc) => doc.id);

        const matchingDocID = documentIDs.find(
          (docID) => +docID === +foundLesson.id
        );

        if (matchingDocID) {
          const docRef = doc(
            db,
            "completedLessons",
            user.uid,
            "markedLessons",
            matchingDocID
          );
          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists()) {
            const markedComplete = docSnapshot.data().markedComplete;

            await updateDoc(docRef, {
              markedComplete: "false",
            });
            setMarkedComplete(false)
          } else {
            // console.log("No document found for the matching ID.");
          }
        } else {
          // console.log("No matching document found for the lesson.");
        }
      } else {
        // console.log("Lesson not found in the fetched lessons.");
      }

      if (id) {
      } else {
      }
    } catch (error) {}

  }


  return (
    <div>
      <Navbar />

      {paid ? (
        <div className={styles.videoWrapper}>
          <div className={styles.video}>
            <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
              <iframe
                src={course.videoUrl}
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
                  onClick={removeMarkComplete}
                >
                  Mark Complete
                </button>
              ) : (
                <button
                  className={styles.buttonContinue}
                  onClick={markComplete}
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
