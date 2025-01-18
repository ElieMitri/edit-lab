import Image from "next/image";
import styles from "./page.module.css";
import LandingPage from "./components/LandingPage";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <LandingPage />
    </div>
  );
}
