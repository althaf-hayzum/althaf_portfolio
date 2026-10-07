import { Navbar } from './components/Navbar';
import { ScrollPortrait } from './components/ScrollPortrait';
import { Hero } from './sections/Hero';
import { WhatIGreatAt } from './sections/WhatIGreatAt';
import { About } from './sections/About';
import { Skills } from './sections/Skills';
import { Projects } from './sections/Projects';
import { Contact } from './sections/Contact';
import { HayzumiCaseStudy } from './sections/HayzumiCaseStudy';
import { AlBeefyCaseStudy } from './sections/AlBeefyCaseStudy';

function App() {
  const projectPath = window.location.pathname.replace(/\/$/, '');
  if (projectPath === '/projects/albeefy') {
    return <AlBeefyCaseStudy />;
  }
  if (projectPath === '/projects/hayzumi') {
    return <HayzumiCaseStudy />;
  }

  return (
    <>
      <Navbar />
      <ScrollPortrait />
      <main>
        <Hero />
        <WhatIGreatAt />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </>
  );
}

export default App;
