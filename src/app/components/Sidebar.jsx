"use client";

import React, { useState, useEffect } from "react";
import styles from "../styles/LandingPage.module.css";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { db, auth } from "../../../firebase";
import Link from "next/link";
import { IoMdPerson } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { IoIosArrowDown } from "react-icons/io";
import { courseData } from "../../../courseData";

const Sidebar = (setCloseSidebar) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(false);

  const menuItems = [
    { icon: "🏠", label: "Dashboard", link: "/" },
    { icon: "📚", label: "Course", link: "/course" },
    { icon: "⚙️", label: "Settings", link: "/account" },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      //   console.log(currentUser.displayName[0]);
    });

    return () => unsubscribe();
  }, []);

  function signOut() {
    firebaseSignOut(auth).then(() => {
      //   router.push("/");
    });
  }

  return (
    <>
      <button
        className={styles.menuButton}
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <div className={`${styles.hamburger} ${isOpen ? styles.active : ""}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <nav className={styles.navigation}>
          {menuItems.map((item, index) => (
            <Link key={index} href={item.link} className={styles.navItem}>
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <IoMdPerson className={styles.userPic} />
            <p className={styles.userName}>{user.displayName}</p>
          </div>
          <Link href="/">
            <CiLogout className={styles.logoutBtn} onClick={signOut} />
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
