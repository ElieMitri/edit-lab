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

        setLessons(fetchedLessons);
        console.log("Fetched Lessons:", fetchedLessons);
      } catch (error) {
        console.error("Error fetching completed lessons:", error);
      }
    };

    fetchCompletedLessons();
  }, [db, user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

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

        setLessons(fetchedLessons);

        if (id) {
          const foundLesson = fetchedLessons.find((lesson) => lesson.id === id);
          const isMarkedComplete =
            foundLesson.markedComplete === "true" ||
            foundLesson.markedComplete === true;
          if (isMarkedComplete) {
            setMarkedComplete(true);
          }
        } else {
          console.log("No ID provided.");
        }
      } catch (error) {
        console.error("Error fetching completed lessons:", error);
      }
    };

    fetchCompletedLessons();
  }, [db, user, id]);

  useEffect(() => {
    async function findMarkedLesson(db, userUid, lessonId) {
      try {
        const lessonsRef = collection(
          db,
          "completedLessons",
          userUid,
          "markedLessons"
        );
        const querySnapshot = await getDocs(lessonsRef);

        let matchedLesson = null;
        querySnapshot.forEach((doc) => {
          const lessonData = doc.data();
          if (lessonData.id === lessonId) {
            matchedLesson = { markedLesson: doc.id, data: lessonData };
          }
        });

        if (matchedLesson) {
          return matchedLesson;
        } else {
          console.log("Lesson ID not found in markedLessons");
          return null;
        }
      } catch (error) {
        console.error("Error fetching marked lessons:", error);
      }
    }

    if (user?.uid && id) {
      const userUid = user.uid;
      const lessonId = id;

      findMarkedLesson(db, userUid, lessonId).then((result) => {
        if (result) {
          console.log(result.markedLesson);
          console.log("sdsd", result.data);
          setMarkedLessonResult(result.markedLesson);
          setDataResult(result.data);
        } else {
          // console.log("No match found.");
        }
      });
    } else {
      // console.log("User or lesson ID is not defined yet.");
    }
  }, [user, id, db]);
  

  async function markComplete() {
    if (!user || !id) {
      console.error("User or lesson ID is missing");
      return;
    }

    setMarkedComplete(true);
    const completeRef = doc(
      db,
      "completedLessons",
      user.uid,
      "markedLessons",
      markedLessonResult
    );

    try {
      await updateDoc(completeRef, {
        markedComplete: true, 
      });
      console.log("Lesson marked as complete!");
    } catch (error) {
      console.error("Error marking lesson as complete:", error.message);
    }
  }

  async function removeMarkComplete() {
    if (!user || !id) {
      console.error("User or lesson ID is missing");
      return;
    }

    setMarkedComplete(false);

    const completeRef = doc(
      db,
      "completedLessons",
      user.uid,
      "markedLessons",
      markedLessonResult
    );

    try {
      await updateDoc(completeRef, {
        markedComplete: false, 
      });
      console.log("Lesson marked as incomplete!");
    } catch (error) {
      console.error("Error removing mark as complete:", error.message);
    }
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
