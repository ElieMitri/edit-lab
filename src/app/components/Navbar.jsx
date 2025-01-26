"use client";

import Image from "next/image";
import Logo from "../../../public/TEL.png";
import styles from "../styles/Nav.module.css";
import { LuCrown } from "react-icons/lu";
import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { IoMdPerson } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
// import { useRouter } from "next/router";
import { useRef, useEffect, useState } from "react";
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
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import Sidebar from "./Sidebar";
import { IoClose } from "react-icons/io5";
import OMT from "../../../public/OMT.png";
import Whish from "../../../public/Whish.png";
import Crypto from "../../../public/Crypto.png";
import { courseData } from "../../../courseData";
import { FaEye } from "react-icons/fa";

export default function Navbar() {
  // const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleOpenPayment = () => setOpenPayment(true);
  const [openPayment, setOpenPayment] = useState(false);

  const [emailCheck, setEmailCheck] = useState();
  const [passwordCheck, setPasswordCheck] = useState();
  const [nameCheck, setNameCheck] = useState();

  const [createLoading, setCreateLoading] = useState(false);

  const [email, setEmail] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [switched, setSwitched] = useState(false);
  const [error, setError] = useState(null);
  const [paid, setPaid] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [memberFirstLetter, setMemberFirstLetter] = useState();
  const [openedSidebar, setOpenedSidebar] = useState(false);
  const [matchingUser, setMatchingUser] = useState(null);
  const [openedPayment, setOpenedPayment] = useState(false);
  const handleClosePayment = () => setOpenPayment(false);

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

  function handleClose() {
    setOpen(false);
    setOpenPayment(false);
    setError(null);
    setPasswordError(null);
  }

  const userEmail = useRef("");
  const userPassword = useRef("");
  const userName = useRef();

  const menuItems = [
    { icon: "🏠", label: "Dashboard", link: "/" },
    { icon: "📚", label: "Course", link: "/course" },
    { icon: "⚙️", label: "Settings", link: "/account" },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const addCoursesToFirestore = async () => {
    try {
      const userCoursesCollection = collection(
        db,
        "completedLessons",
        user.uid,
        "markedLessons"
      );

      // Iterate over each course in courseData
      for (const course of courseData) {
        await addDoc(userCoursesCollection, {
          ...course, // Spread the course data into the Firestore document
          addedAt: new Date(), // Optional: Add a timestamp for when the course was added
        });
        // console.log(`Course added: ${course.title}`);
      }

      // console.log("All courses have been added!");
    } catch (error) {
      // console.error("Error adding courses to Firestore:", error);
    }
  };

  async function createAccount(e) {
    e.preventDefault(); // Prevent the default form submission behavior
  
    const email = userEmail.current.value;
    const password = userPassword.current.value;
    const displayName = userName.current.value;
  
    setCreateLoading(true);
  
    if (userPassword.current.value.length <= 6) {
      setPasswordError("Password should be at least 6 characters");
      setCreateLoading(false);
      return;
    } else {
      setPasswordError(null);
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      await updateProfile(user, {
        displayName: displayName,
      });
  
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        subscriptionPlan: "FREE",
      });
  
      for (let i = courseData.length - 1; i >= 0; i--) {
        const course = courseData[i];
        const docRef = doc(
          db,
          "completedLessons",
          user.uid,
          "markedLessons",
          (i + 1).toString()
        );
  
        await setDoc(docRef, {
          id: course.id,
          markedComplete: "false",
        });
      }
  
      setOpenedSidebar(false);
  
      // setMemberFirstLetter(user.displayName[0]);
      setCreateLoading(false);
    } catch (error) {
      setCreateLoading(false); // Ensure loading state is reset in case of an error
  
      const errorCode = error.code; // Firebase error code
      const errorMessage = error.message; // Full error message (includes error code)
  
      // Handle specific error codes
      switch (errorCode) {
        case "auth/email-already-in-use":
          setError("The email address is already in use by another account.");
          break;
  
        case "auth/invalid-email":
          setError("The email address is not valid. Please check and try again.");
          break;
  
        case "auth/operation-not-allowed":
          setError("Email/password accounts are not enabled. Please contact support.");
          break;
  
        case "auth/weak-password":
          setError("The password is too weak. Please choose a stronger password.");
          break;
  
        case "auth/missing-email":
          setError("Email address is required. Please provide a valid email.");
          break;
  
        case "auth/internal-error":
          setError("An internal error occurred. Please try again later.");
          break;
  
        case "auth/network-request-failed":
          setError("Network error. Please check your internet connection and try again.");
          break;
  
        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
          break;
  
        default:
          // Generic fallback for unexpected errors
          setError("An unexpected error occurred. Please try again.");
      }
  
      console.error("Error creating account:", errorCode, errorMessage); // Log for debugging
    }
  }
  

  async function login() {
    const email = userEmail.current.value;
    const password = userPassword.current.value;

    setCreateLoading(true); // Set loading state to true at the start of the process

    // Validate password length
    if (userPassword.current.value.length <= 6) {
      setPasswordError("Password should be at least 6 characters");
      setCreateLoading(false); // Stop loading if validation fails
      return;
    } else {
      setPasswordError(null);
    }

    try {
      // Attempt to sign in
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      setError(null); // Clear any previous errors
      setOpenedSidebar(false);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      // Handle specific error codes
      if (errorCode === "auth/invalid-credential") {
        setError("Incorrect Email or Password");
      } else if (errorCode === "auth/user-not-found") {
        setError("No user found with this email.");
      } else if (errorCode === "auth/wrong-password") {
        setError("Incorrect Password.");
      } else if (errorCode === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        // Fallback for other errors
        setError("An unexpected error occurred. Please try again.");
      }

      console.error("Error signing in:", errorCode, errorMessage);
    } finally {
      setCreateLoading(false); // Stop loading regardless of success or failure
    }
  }

  function signOut() {
    firebaseSignOut(auth).then(() => {
      //   router.push("/");
    });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      //   console.log(currentUser.displayName[0]);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.body.style.overflow = "";
  }, []);

  function openSidebar() {
    setOpenedSidebar(true);
    document.body.style.overflow = "hidden";
  }
  function closeSidebar() {
    setOpenedSidebar(false);
    document.body.style.overflow = "";
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // console.log(currentUser.auth);
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

  function switchToLogin() {
    setSwitched(true);
    setPasswordError(null);
    setError(null);
  }

  function switchToSignUp() {
    setSwitched(false);
    setPasswordError(null);
    setError(null);
  }

  return (
    <>
      {user ? (
        <nav className={styles.nav}>
          <div className={styles.burgerLogo}>
            <h1 className={styles.burgerWrapper}>
              {openedSidebar ? (
                <IoClose className={styles.burger} onClick={closeSidebar} />
              ) : (
                <GiHamburgerMenu
                  className={styles.burger}
                  onClick={openSidebar}
                />
              )}
            </h1>
            <figure className={styles.logoWrapper}>
              <Image src={Logo} className={styles.logo} alt="" />
            </figure>
          </div>
          <div className={styles.navText}>
            {/* <div className={styles.firstLetter}>{user.displayName[0]}</div> */}

            {paid ? (
              <>
                <LuCrown className={styles.crown} />
              </>
            ) : (
              <button className={styles.button} onClick={handleOpenPayment}>
                Lab Member <LuCrown className={styles.crown} />
              </button>
            )}
          </div>
          {openedSidebar ? (
            <Sidebar setOpenedSidebar={setOpenedSidebar} />
          ) : (
            <></>
          )}
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={openPayment}
            onClose={handleClosePayment}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 500,
              },
            }}
          >
            <Fade in={openPayment}>
              <Box sx={style}>
                <div className="login__inputs">
                  <h1 className="login__title">
                    Become a Premium Lab Member{" "}
                    <LuCrown className={styles.crown} />
                  </h1>
                  <div className={styles.paymentMethods}>
                    <div className={styles.paymentMethod}>
                      <Image
                        src={OMT}
                        className={styles.paymentLogoOMT}
                        alt=""
                        priority
                      />
                      <button className={styles.paymentName}>OMT</button>
                    </div>
                    <div className={styles.paymentMethod}>
                      <Image
                        src={Whish}
                        className={styles.paymentLogoWhish}
                        alt=""
                        priority
                      />
                      <button className={styles.paymentName}>Whish</button>
                    </div>
                    <div className={styles.paymentMethod}>
                      <Image
                        src={Crypto}
                        className={styles.paymentLogoCrypto}
                        alt=""
                        priority
                      />
                      <button className={styles.paymentName}>Crypto</button>
                    </div>
                  </div>
                </div>
              </Box>
            </Fade>
          </Modal>
        </nav>
      ) : (
        <nav className={styles.nav}>
          <figure className={styles.logoWrapper}>
            <Image src={Logo} className={styles.logo} alt="" priority />
          </figure>
          <div className={styles.navText}>
            <button className={styles.button} onClick={handleOpen}>
              Lab Member
            </button>
          </div>

          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 500,
              },
            }}
          >
            <Fade in={open}>
              <Box sx={style}>
                {switched ? (
                  <div className="login__inputs">
                    <h1 className="login__title">Already a Lab Member?</h1>
                    {error ? (
                      <div className={styles.errorMessage}>{error}</div>
                    ) : (
                      <></>
                    )}
                    <input
                      type="email"
                      className="modal__input"
                      placeholder="Email"
                      ref={userEmail}
                      onChange={() => setEmailCheck(userEmail.current.value)}
                    />
                    <div className="password__login">
                      <input
                        type="password"
                        className="modal__input"
                        placeholder="••••••••••••"
                        ref={userPassword}
                        onChange={() =>
                          setPasswordCheck(userPassword.current.value)
                        }
                      />
                      <div className={styles.errorPasswordMessage}>
                        {passwordError ? (
                          <div className={styles.errorMessage}>
                            {passwordError}
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>

                    {!emailCheck || !passwordCheck ? (
                      <button className="login__btn--no cursor">Log in</button>
                    ) : createLoading ? (
                      <button className="login__btn cursor">
                        <div className="loader"></div>
                      </button>
                    ) : (
                      <button className="login__btn cursor" onClick={login}>
                        Log in
                      </button>
                    )}

                    <div className="login__or">
                      <h4 className="login__h4">OR</h4>
                    </div>
                    <button className="login__button" onClick={switchToSignUp}>
                      Create an account
                    </button>
                  </div>
                ) : (
                  <div className="login__inputs">
                    <h1 className="login__title">Become a Lab member!</h1>
                    {error ? (
                      <div className={styles.errorMessage}>{error}</div>
                    ) : (
                      <></>
                    )}
                    <input
                      type="email"
                      className="modal__input"
                      placeholder="Email"
                      ref={userEmail}
                      onChange={() => setEmailCheck(userEmail.current.value)}
                    />
                    <input
                      type="name"
                      className="modal__input"
                      placeholder="Name"
                      ref={userName}
                      onChange={() => setNameCheck(userName.current.value)}
                    />
                    <div className="password__login">
                      <input
                        type="password"
                        className="modal__input"
                        placeholder="••••••••••••"
                        ref={userPassword}
                        onChange={() =>
                          setPasswordCheck(userPassword.current.value)
                        }
                      />
                    </div>
                    {passwordError ? (
                      <div className={styles.errorMessage}>{passwordError}</div>
                    ) : (
                      <></>
                    )}

                    {!emailCheck || !passwordCheck || !nameCheck ? (
                      <button
                        className="login__btn--no cursor"
                        //  onClick={createAccount}
                      >
                        Sign Up
                      </button>
                    ) : (
                      <button
                        className="login__btn cursor"
                        onClick={createAccount}
                      >
                        Sign Up
                      </button>
                    )}

                    {/* <button
                      className="login__btn cursor"
                      onClick={createAccount}
                    >
                      Sign Up
                    </button> */}

                    <div className="login__or">
                      <h4 className="login__h4">OR</h4>
                    </div>
                    <button className="login__button" onClick={switchToLogin}>
                      Login
                    </button>
                  </div>
                )}
              </Box>
            </Fade>
          </Modal>
        </nav>
      )}
    </>
  );
}
