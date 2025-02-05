import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/auth.module.scss";
import Carousel from "../components/Auth/Carousel";

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [isInit, setIsInit] = useState(true);

  const toggleForm = () => {
    setIsInit(false);
    setIsSignup((prev) => !prev);
  };

  const formWidthRatio = 30; // Max 50
  const carouselWidthRatio = 100 - formWidthRatio;
  const formInitTranslate =
    (isSignup ? -1 : 1) * (100 / formWidthRatio - 1) * 100;
  const carouselInitTranslate =
    (isSignup ? 1 : -1) * (100 / carouselWidthRatio - 1) * 100;

  return (
    <div className={styles.authContainer}>
      <div
        className={`${styles.authWrapper} ${isSignup ? styles.reverse : ""}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            className={styles.authForm}
            style={{ width: `${formWidthRatio}%` }}
            key={isSignup ? "signup" : "login"}
            initial={{
              x: `${isInit ? 0 : formInitTranslate}%`,
              opacity: 1,
            }}
            animate={{ x: "0%", opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={styles.title}>
              {isSignup ? "Create an Account" : "Welcome Back!"}
            </h2>

            <form className={styles.form}>
              <input type="email" placeholder="Email" required />
              <input type="password" placeholder="Password" required />
              <button type="submit">{isSignup ? "Sign up" : "Log in"}</button>
            </form>

            <p className={styles.switchText} onClick={toggleForm}>
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <span className={styles.switchLink}>
                {isSignup ? "Log in" : "Sign up"}
              </span>
            </p>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            className={`${styles.carouselWrapper}`}
            style={{ width: `${carouselWidthRatio}%` }}
            key={isSignup ? "login-carousel" : "signup-carousel"}
            initial={{
              x: `${isInit ? 0 : carouselInitTranslate}%`,
              opacity: 1,
            }}
            animate={{ x: "0%", opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Carousel />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthPage;
