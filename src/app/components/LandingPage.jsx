"use client";

import React, { useState, useEffect } from "react";
import styles from "../styles/LandingPage.module.css";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import OMT from "../../../public/OMT.png";
import Whish from "../../../public/Whish.png";
import Crypto from "../../../public/Crypto.png";
import { LuCrown } from "react-icons/lu";
import Image from "next/image";
import style2 from "../styles/Nav.module.css";
import { db, auth } from "../../../firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
  signOut as firebaseSignOut,
} from "firebase/auth";
import {
  setDoc,
  doc,
  collection,
  serverTimestamp,
  addDoc,
  getDoc,
  updateDoc,
  signOut,
  getFirestore,
  getDocs,
} from "firebase/firestore";

import { query, where } from "firebase/firestore";

const LandingPage = () => {
  const [openPayments, setOpenPayments] = useState(false);
  const [user, setUser] = useState(false);
  const [paid, setPaid] = useState(false);
  const [matchingUser, setMatchingUser] = useState(false);
  const handleClosePayment = () => setOpenPayments(false);

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

    return () => unsubscribe(); // Cleanup the listener when the component unmounts
  }, []);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 320,
    bgcolor: "#2f2f2f",
    borderRadius: "15px",
    padding: "0",
    boxShadow: 24,
    p: 4,
    outline: "none",
  };

  const courseStructure = [
    {
      id: 1,
      title: "Basics of Video Editing",
      description:
        "Learn the fundamental concepts of video editing, including timeline management, cuts, and transitions.",
      topics: [
        "Interface overview",
        "Basic cuts & transitions",
        "Timeline management",
        "File organization",
      ],
      duration: "2 hours",
    },
    {
      id: 2,
      title: "Advanced Editing Techniques",
      description:
        "Master professional editing techniques used in the industry for seamless storytelling.",
      topics: [
        "Complex transitions",
        "Color grading",
        "Audio mixing",
        "Motion effects",
      ],
      duration: "3 hours",
    },
    {
      id: 3,
      title: "Visual Effects & Graphics",
      description:
        "Create stunning visual effects and incorporate graphics into your videos.",
      topics: [
        "Text animations",
        "Overlays",
        "Green screen",
        "Motion tracking",
      ],
      duration: "2.5 hours",
    },
    {
      id: 4,
      title: "Final Production & Export",
      description:
        "Learn professional workflow for finalizing and exporting your videos for different platforms.",
      topics: [
        "Export settings",
        "Platform optimization",
        "Compression",
        "Publishing workflow",
      ],
      duration: "1.5 hours",
    },
  ];

  const features = [
    {
      title: "Project-Based Learning",
      description:
        "Learn by working on real-world video editing projects. Apply your skills immediately with hands-on exercises.",
      icon: "🎯",
    },
    {
      title: "Industry-Standard Software",
      description:
        "Master the tools used by professionals. Get familiar with premiere editing software used in the industry.",
      icon: "💻",
    },
    {
      title: "Personalized Feedback",
      description:
        "Submit your projects and receive detailed feedback to improve your editing skills.",
      icon: "📝",
    },
    {
      title: "Resource Library",
      description:
        "Access a vast library of stock footage, music, and effects to use in your projects.",
      icon: "📚",
    },
    {
      title: "Flexible Learning",
      description:
        "Learn at your own pace with lifetime access to all course materials and future updates.",
      icon: "⏰",
    },
    {
      title: "Certificate",
      description:
        "Earn a certificate of completion to showcase your video editing expertise.",
      icon: "🏆",
    },
  ];

  return (
    <div className={styles.container}>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openPayments}
        onClose={handleClosePayment}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openPayments}>
          <Box sx={style}>
            <div className="login__inputs">
              <h1 className="login__title">
                Become a Premium Lab Member <LuCrown className={style2.crown} />
              </h1>
              <div className={style2.paymentMethods}>
                <div className={style2.paymentMethod}>
                  <Image
                    src={OMT}
                    className={style2.paymentLogoOMT}
                    alt=""
                    priority
                  />
                  <button className={style2.paymentName}>OMT</button>
                </div>
                <div className={style2.paymentMethod}>
                  <Image
                    src={Whish}
                    className={style2.paymentLogoWhish}
                    alt=""
                    priority
                  />
                  <button className={style2.paymentName}>Whish</button>
                </div>
                <div className={style2.paymentMethod}>
                  <Image
                    src={Crypto}
                    className={style2.paymentLogoCrypto}
                    alt=""
                    priority
                  />
                  <button className={style2.paymentName}>Crypto</button>
                </div>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>

      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Master Video Editing</h1>
          <p className={styles.heroText}>
            Transform your raw footage into compelling stories with our
            comprehensive video editing course.
          </p>
          <div className={styles.buttonGroup}>
            {paid ? (
              <button className={styles.primaryButton}>
                Start Learning Now
              </button>
            ) : (
              <></>
            )}
            <button className={styles.secondaryButton}>Watch Preview</button>
          </div>
        </div>
      </header>

      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>1000+</div>
            <div className={styles.statLabel}>Students Enrolled</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>9.5/10</div>
            <div className={styles.statLabel}>Average Rating</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>40+</div>
            <div className={styles.statLabel}>Hours of Content</div>
          </div>
        </div>
      </section>

      <section className={styles.courseSection}>
        <h2 className={styles.sectionTitle}>Course Curriculum</h2>
        <div className={styles.courseGrid}>
          {courseStructure.map((section) => (
            <div key={section.id} className={styles.courseCard}>
              <div className={styles.courseHeader}>
                <h3 className={styles.courseTitle}>{section.title}</h3>
                <span className={styles.duration}>{section.duration}</span>
              </div>
              <p className={styles.courseDescription}>{section.description}</p>
              <ul className={styles.topicList}>
                {section.topics.map((topic, index) => (
                  <li key={index} className={styles.topicItem}>
                    <span className={styles.checkmark}>✓</span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Why Choose Our Course</h2>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {paid ? (
        <></>
      ) : (
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Begin Your Journey?</h2>
            <button
              onClick={() => setOpenPayments(true)}
              className={styles.primaryButton}
            >
              Enroll Now
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default LandingPage;
