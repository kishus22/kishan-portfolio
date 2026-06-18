import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import './Section.scss';

const Section = ({ videoSrc, title, description, SvgComponent }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  };

  return (
    <section className="story-section" ref={ref}>
      <video className="bg-video" src={videoSrc} autoPlay muted loop playsInline />
      <motion.div
        className="content"
        variants={overlayVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <h2 className="title">{title}</h2>
        <p className="description">{description}</p>
        {SvgComponent && <SvgComponent />}
      </motion.div>
    </section>
  );
};

export default Section;
