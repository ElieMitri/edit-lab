"use client";

import Image from "next/image";
import style from "../styles/Preview.module.css";
import styles from "../styles/Player.module.css";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { courseData } from "../../../courseData";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className={styles.videoWrapper}>
        <h1 className={style.previewTitle}>
          Watch The <span className={style.previewWord}>Preview</span> Video!
        </h1>
        <div className={styles.video}>
          <div
            //  style={{ padding: "50.25% 0 0 0", position: "relative" }}
            className={style.previewVideo}
          >
            <iframe
              src="https://player.vimeo.com/video/851580640?badge=0&autopause=0&player_id=0&app_id=58479"
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
      </div>
    </div>
  );
}
