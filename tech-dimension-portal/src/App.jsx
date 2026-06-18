import React from 'react';
import Section from './components/Section';
import AnimatedSVG from './components/AnimatedSVG';
import './styles/main.scss';

const sections = [
  {
    video: 'https://cdn.coverr.co/videos/coverr-1702749490259?title=Travel%20Time&autoPlay=1&loop=1',
    title: 'Explore the Future',
    text: 'Dive into cutting‑edge technology that shapes tomorrow. Experience immersive visuals and interactive storytelling.',
  },
  {
    video: 'https://cdn.coverr.co/videos/coverr-1668623616?title=Space%20Technology&autoPlay=1&loop=1',
    title: 'Innovate Beyond Limits',
    text: 'From AI breakthroughs to quantum leaps, witness the milestones that redefine what’s possible.',
  },
  {
    video: 'https://cdn.coverr.co/videos/coverr-1478809454?title=Digital%20Revolution&autoPlay=1&loop=1',
    title: 'Join the Revolution',
    text: 'Become part of the tech renaissance. Engage, learn, and contribute to a vibrant community.',
  },
];

function App() {
  return (
    <div className="app">
      {sections.map((s, idx) => (
        <Section
          key={idx}
          videoSrc={s.video}
          title={s.title}
          description={s.text}
          SvgComponent={AnimatedSVG}
        />
      ))}
    </div>
  );
}

export default App;
