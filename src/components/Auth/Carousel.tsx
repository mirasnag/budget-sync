import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../../styles/carousel.module.scss";

const items = [
  { text: "Manage your finances efficiently!" },
  { text: "Track spending habits easily" },
  { text: "Plan your budget for the future" },
];

const Carousel = () => {
  const [index, setIndex] = useState(0);
  const duration = 1.5; // in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, duration * 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.carousel}>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: duration, ease: "linear" }}
          className={styles.carouselItem}
        >
          <h3>{items[index].text}</h3>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Carousel;
