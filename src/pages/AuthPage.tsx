import { FormEvent, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/auth.module.scss";
import Carousel from "../components/Auth/Carousel";
import { useLogin } from "../utils/hooks";
import { useAuthContext } from "../store/auth-context";
import { Navigate } from "react-router-dom";

const AuthPage = () => {
  const { data: auth } = useAuthContext();

  if (auth) {
    return <Navigate to="/" replace />;
  }

  const [isSignup, setIsSignup] = useState(false);
  const [isInit, setIsInit] = useState(true);

  const { login, error, isLoading } = useLogin();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      return;
    }

    await login(email, password, isSignup ? "signup" : "login");
  };

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

            <form className={styles.form} onSubmit={handleSubmit}>
              <input type="email" placeholder="Email" ref={emailRef} required />
              <input
                type="password"
                placeholder="Password"
                ref={passwordRef}
                required
              />
              <button type="submit" disabled={isLoading}>
                {isSignup ? "Sign up" : "Log in"}
              </button>
            </form>

            {error && <div className={styles.error}>{error}</div>}

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
