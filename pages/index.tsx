import { GetStaticProps } from 'next';
import { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import React from 'react';
import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import socialMediaLink from "../hooks/useMediaLink";
import useNavbarLink from "../hooks/navbar-hooks";
import useMenuLink from "../hooks/menu-hooks";
import Nav from "../components/nav";
import CloseButton from "../components/closebutton";



interface Experience {
  title: string; 
  company: string; 
  date: string;
  emg_photo_url: string; 
  highlights: string[];
}

interface Project {
  id: number;
  url_link: string; 
  title: string ;
  emg_photo_url: string; 
  each_explanation: string[];
  tags_project: string[];
}

interface Stack {
  id: number;
  title: string;
  perlevel_stack: string[];
}

interface About {
  h1_title: string;
  h2_subtitle: string;
  p_tag: string[];
}

interface Hero {
  strong: string;
  p1: string; 
  p2: string; 
  cta: string; 
}

interface HomeProps {
  experiences: Experience[];
  projects: Project[];
  stacks: Stack[];
  about: About;
  hero: Hero;
}



const Home: React.FC<HomeProps> = ({ experiences, projects, stacks, about, hero }) => {
  const hideProjects = process.env.NEXT_PUBLIC_HIDE_PROJECT_SECTION === 'true';
  const mainRef = useRef<HTMLDivElement | null>(null);

  const mediaLink = socialMediaLink();
  const navbarLink = useNavbarLink();
  const menuLink = useMenuLink(hideProjects);

  const [isToggled, setToggled] = useState<boolean>(false);

  
  const toggleTrueFalse = () => setToggled(!isToggled);

  const scrollToSection = useCallback((hash: string, updateHash: boolean = true) => {
    if (typeof window === 'undefined' || !hash.startsWith('#')) {
      return;
    }

    const targetId = hash.slice(1);

    if (!targetId) {
      return;
    }

    const targetSection = document.getElementById(targetId);

    if (!targetSection || !mainRef.current?.contains(targetSection)) {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    targetSection.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });

    if (updateHash && window.location.hash !== hash) {
      window.history.replaceState(null, '', hash);
    }
  }, []);

  const handleSectionLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    hash: string,
    closeMenu: boolean = false
  ) => {
    if (!hash.startsWith('#')) {
      if (closeMenu) {
        toggleTrueFalse();
      }
      return;
    }

    event.preventDefault();
    scrollToSection(hash);

    if (closeMenu) {
      toggleTrueFalse();
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const initialHash = window.location.hash;

    if (!initialHash) {
      return;
    }

    if (hideProjects && initialHash === '#project') {
      window.history.replaceState(null, '', '#experience');
      scrollToSection('#experience', false);
      return;
    }

    scrollToSection(initialHash, false);
  }, [hideProjects, scrollToSection]);
  
  return (
    <div>
      <Head>
        <link rel="icon" href="" />
        <title>Nurrizky Imani</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      
      <main className="flex flex-col h-screen relative bg-gray-100">

        <Nav toggleTFProp={() => toggleTrueFalse()} />

        {/*NAV BAR*/}
        
        <div className="flex flex-1 overflow-y-hidden min-h-0">

          {/*SIDE BAR  */}
          <div
            className={`
            sidebar md:w-48 mb-5 md:mb-0 flex-none md:flex 
            flex-col divide-y px-4 pl-5  md:mt-5 
            min-h-screen md:min-h-0 fixed z-20
            md:static md:z-0 md:bg-gray-0 bg-gray-100
            w-screen top-0
            ease-linear
            ${isToggled ? "" : "hidden"}`}
          >

            <div
              className={`sidebar-top space-y-5 md:space-y-0 object-center py-10 md:py-0`}
            >
              <p
                className="self-center type-card-title font-title-theme flex justify-between no-underline text-center transform hover:-translate-y-1 duration-300 md:hidden"
              >
                "👨‍💻 👨‍🚀 👨‍🎓"
              </p>

              {menuLink.map((menu) => (
                <a
                  key={menu.info}
                  href={menu.link}
                  onClick={(event) => handleSectionLinkClick(event, menu.link, true)}
                  className="icon-work flex py-2  hover:shadow-inner transition duration-300 ease-in-out hover:bg-gray-300 rounded-md p-2  "
                >
                  <p className="mr-1">{menu.icon}</p>
                  <div className="ml-3 type-body"> {menu.info}</div>
                </a>
              ))}

              <ul className="flex justify-between items-center mr-3 md:hidden">
                {navbarLink.map((link) => (
                  <li key={link.id}>
                    <a
                      href=""
                      className="inline-block type-meta px-2 py-2 hover:shadow-inner transform pl-1 rounded-md text-gray-900
                      transition duration-300 ease-in-out  hover:bg-gray-300  lg:mt-0"
                    >
                      <div className="flex">
                        {link.href1}
                        <p className="type-meta"> {link.label}</p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>

              <CloseButton
                toggleTrueFalse={() => {
                  toggleTrueFalse();
                }}
              />
            </div>
          </div>
          
        
          <div ref={mainRef} className="main w-full flex-1 min-h-0 lg:px-5 overflow-y-auto bg-gray-100">


             {/* HERO */}
             <div id="home" className="home-viewport container mx-auto px-6 md:px-12 flex flex-col-reverse sm:flex-row items-center justify-center scroll-mt-6 md:scroll-mt-10">
               <div className="w-full sm:w-4/5 flex flex-col items-start sm:mt-0">
                 <h1 className="font-title-theme type-display mb-4">
                   {hero && (
                     <strong className="font-extrabold">
                       {hero.strong}
                     </strong>
                   )}
                 </h1>
                 {hero && (
                   <p className="type-body reading-width mb-2">{hero.p1}</p>
                 )}

                 {hero && (
                   <p className="type-body reading-width mb-6 md:mb-12">
                     {hero.p2}
                   </p>
                 )}
                 <a
                   className="font-semibold type-body bg-blue-500 hover:bg-blue-400 transition duration-300 ease-in-out text-white py-3 px-10 rounded-full hover:shadow-inner transform"
                   href="#experience"
                   onClick={(event) => handleSectionLinkClick(event, '#experience')}
                 >
                   {hero.cta}
                 </a>
               </div>
             </div>

             {/*  EXPERIENCE */}
             <div id="experience" className="scroll-mt-6 md:scroll-mt-10 section-gap">
               <h2 className="font-title-theme type-section-title border-b border-blue-600 mb-5 md:mb-0 px-5 md:px-0">
                 Experience 🧳
               </h2>

               <div className="work-exp md:px-8 md:py-1">
                 <div>
                   <div className="relative  m-8">
                     <div className="border-r-2 border-gray-800 border-dotted absolute h-full z-0 pl-2 mt-2" />
                     <ul className="list-none m-0 p-0">
                       {experiences &&
                         experiences.map((exp, index) => (
                           <li key={index} className="mb-4">
                             <div className="flex mb-1 align-top content-start">
                               <div className="flex">
                                 <img
                                   className="w-12 h-12 object-cover -ml-4 z-10"
                                   src={
                                     exp.emg_photo_url != null
                                       ? exp.emg_photo_url
                                       : ""
                                   }
                                 />

                                 <div className="flex flex-col">
                                   
                                   <h3 className="ml-4 font-title-theme type-card-title">
                                     {exp.title}
                                   </h3>
                                   
                                   <p className="ml-4 type-meta">
                                     {exp.company}
                                   </p>
                                   
                                 </div>
                                 
                               </div>

                               <div className="flex z-auto flex-col flex-1 items-end relative md:pr-5 text-right">
                                 <p className="type-meta">
                                   {exp.date}
                                 </p>
                               </div>
                             </div>
                             <div className="ml-12 ">

                               <ul className="list-disc list-inside text-left mb-4 type-body">
                                 {exp.highlights.map((highlight, idx) => (
                                   <li key={idx}>{highlight}</li>
                                 ))}
                               </ul>

                             </div>
                           </li>
                         ))}
                     </ul>
                   </div>
                 </div>
               </div>
             </div>

             {!hideProjects && (
               <>
                 {/* PROJECT  */}
                 <div id="project" className="scroll-mt-6 md:scroll-mt-10 section-gap">
                   <h2 className="font-title-theme type-section-title border-b border-blue-600 mb-5 px-5 md:px-0">
                     Projects 📂
                   </h2>

                   <div className="project-cards-list flex w-full justify-between flex-wrap py-10 px-10 md:px-4">
                     {projects.map((project) => (
                       <a
                         href={project.url_link}
                         key={project.id}
                         className={`
                     card 
                     flex
                     flex-col
                     justify-between
                     max-w-almost-sm
                     flex-grow mb-8 
                     mr-2 border-gray-500  
                     shadow-lg overflow-hidden rounded-md 
                     transform hover:scale-105 duration-300 hover:shadow-xl
                     `}
                       >
                         <div>
                           <img
                             className="w-full h-48 object-cover border-b"
                             src={`${
                               project.emg_photo_url
                                 ? project.emg_photo_url
                                 : ""
                             }`}
                           />
                           <div className="px-5 py-2 ">
                             <div className="flex flex-col justify-between w-full min-h-full">
                               {project && (
                                 <h3 className="font-title-theme type-card-title">
                                   {project.title}
                                 </h3>
                               )}

                               {project && (
                                 <ul className="space-y-3 type-body pt-4 list-disc px-5 reading-width">
                                   {project.each_explanation.map(
                                     (expla, idx) => (
                                       <li key={idx}>
                                         {expla}
                                       </li>
                                     )
                                   )}
                                 </ul>
                               )}
                             </div>
                           </div>
                         </div>

                         <div className="align-start pt-4 items-end px-5 pb-5">
                           {project.tags_project &&
                             project.tags_project.map((tag, idx) => {
                               if (tag != null) {
                                 return (
                                   <span
                                     key={idx}
                                     className="inline-block bg-gray-200 rounded-full px-3 py-1 type-meta font-semibold text-gray-700 mr-2 mb-2"
                                   >
                                     {tag}
                                   </span>
                                 );
                               }
                             })}
                         </div>
                       </a>
                     ))}
                   </div>
                 </div>
               </>
             )}

            {/* STACK */}
            <div id="stack" className="scroll-mt-6 md:scroll-mt-10 section-gap">
               <h2 className="font-title-theme type-section-title border-b border-blue-600 mb-5 px-5 md:px-0">
                 Stack 🛠
               </h2>
               <div className="px-5 md:px-0">

                 <div className="flex flex-col md:flex-row md:space-x-5 pt-4 py-10 stack-gap">
                   {stacks.map((stack, idx) => (
                     <div key={idx} className="md:w-1/3">
                       <h3 className="font-title-theme type-card-title pb-2">{stack.title}</h3>
                       <div className="pl-4 ">
                         <ul className=" flex flex-wrap ">
                           {stack.perlevel_stack &&
                             stack.perlevel_stack.map((each, id) => {
                               if (each != null) {
                                 return (
                                   <li key={id} className="w-1/2 mb-3 type-body">
                                     {each}
                                   </li>
                                 );
                               }
                             })}
                         </ul>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             </div>


            {/* ABOUT */}
             <div className="min-h-full scroll-mt-6 md:scroll-mt-10 section-gap" id="about">
               <h2 className="font-title-theme type-section-title border-b border-blue-600 mb-5 px-5 md:px-0">
                 About 👨‍🚀
               </h2>

               <div className="flex flex-col lg:flex-row px-5 md:px-0">
                 <div className=" lg:w-1/2 border-gray-500 pr-5">
                   <p className="font-title-theme type-meta text-gray-600 -mb-1">
                     {" "}
                     Nice to meet you{" "}
                   </p>
                   {about && (
                     <h3 className="font-title-theme type-section-title font-bold tracking-wide pt-2">
                       {" "}
                       {about.h1_title}
                     </h3>
                   )}

                   {about && (
                     <h4 className="font-title-theme type-card-title font-normal tracking-wide pt-2">
                       {about.h2_subtitle}
                     </h4>
                   )}
                   <div>
                     {about &&
                       about.p_tag.map((p_tag, idx) => (
                         <p
                           key={idx}
                           className="type-body reading-width pt-8 text-left"
                         >
                           {p_tag}
                         </p>
                       ))}
                   </div>
                 </div>

                 <div className=" border-gray-500 flex lg:items-center flex-col ">
                   <div className="card rounded-md  md:px-6 py-8  md:w-5/12 flex flex-col  space-y-3">
                     <div className="relative  w-3/12 md:w-9/12 transform hover:scale-110 duration-300 ">
                       <img
                         className="rounded-full hover:shadow-xl transform ease-in-out duration-300 "
                         src="https://avatars3.githubusercontent.com/u/25843889?s=460&u=0665df9620e6db3156619b8414fdd6b047f32286&v=4"
                         alt="Sunset in the mountains"
                       />

                       <div className="bg-green-online p-3 md:p-4 rounded-full absolute right-0 bottom-0 " />
                     </div>

                     <div>
                       <h3 className="font-title-theme type-card-title">Stay up-to-date</h3>
                       <p className="type-meta mt-2">
                         <strong>Hint:</strong>{" "}
                         <span className=" opacity-50">
                           Active on Instagram and Twitter.
                         </span>
                       </p>
                       <ul className="social-link space-y-2 mt-6 ">
                         {mediaLink.map((each) => (
                           <li key={each.label} className="social-link  ">
                               <a
                                 className="flex type-meta py-2 pr-2 hover:shadow-inner transition duration-300 ease-in-out hover:bg-gray-300 rounded-md p-2 -ml-2"
                                 href={each.link}
                               >

                               <div className="mr-2">{each.svg}</div>
                
                            
                               <p className="type-meta">{each.label}</p>
                             </a>
                           </li>
                         ))}
                       </ul>
                     </div>
                   </div>
                 </div>
               </div>
             </div>

          
           </div>
        </div>
      </main>
      
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const filePath = path.join(process.cwd(), 'pages/markdown', 'work.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const rawWorkEntries = fileContents.split('\n---\n').filter(entry => entry.trim().length > 0);

  //experience
  const experiences: Experience[] = [];
  rawWorkEntries.forEach(rawEntry => {
    const parsedEntry = matter(rawEntry);
    experiences.push({
      title: parsedEntry.data.title || '',
      company: parsedEntry.data.company || '',
      date: parsedEntry.data.date || '',
      emg_photo_url: parsedEntry.data.emg_photo_url || '',
      highlights: parsedEntry.data.highlights || [],
    });
  });

  //project 
  const fileProjectPath = path.join(process.cwd(), 'pages/markdown', 'project.md');
  const fileProjectContents = fs.readFileSync(fileProjectPath, 'utf8');
  const rawProjectEntries = fileProjectContents.split('\n---\n').filter(entry => entry.trim().length > 0);

  const projects: Project[] = [];
  rawProjectEntries.forEach(rawEntry => {
    const parsedEntry = matter(rawEntry);
      projects.push({
        id: parsedEntry.data.id || '',
        emg_photo_url: parsedEntry.data.emg_photo_url || '',
        url_link: parsedEntry.data.url_link || '', 
        title: parsedEntry.data.title || '',
        each_explanation: parsedEntry.data.each_explanation || [],
        tags_project: parsedEntry.data.tags_project || [],
    });
  });

  //stack
  const fileStackPath = path.join(process.cwd(), 'pages/markdown', 'stack.md');
  const fileStackContents = fs.readFileSync(fileStackPath, 'utf8');
  const rawStackEntries = fileStackContents.split('\n---\n').filter(entry => entry.trim().length > 0);

  const stacks: Stack[] = [];
    rawStackEntries.forEach(rawEntry => {
    const parsedEntry = matter(rawEntry);
  
      
    stacks.push({
        id: parsedEntry.data.id || '',
        title: parsedEntry.data.title || '', 
        perlevel_stack: parsedEntry.data.perlevel_stack || [],
    });
      
  });


  //about
  const fileAboutPath = path.join(process.cwd(), 'pages/markdown', 'about.md');
  const fileAboutContent = fs.readFileSync(fileAboutPath, 'utf8');
  const parsedAboutEntry = matter(fileAboutContent);
  
  const about: About =  {
      h1_title: parsedAboutEntry.data.h1_title || '',
      h2_subtitle: parsedAboutEntry.data.h2_subtitle || '',
      p_tag: parsedAboutEntry.data.p_tag || [],
  }

  //hero
  const fileHeroPath = path.join(process.cwd(), 'pages/markdown', 'hero.md');
  const fileHeroContent = fs.readFileSync(fileHeroPath, 'utf8');
  const parsedHeroEntry = matter(fileHeroContent);

  const hero: Hero =  {
        strong: parsedHeroEntry.data.strong || '',
        p1: parsedHeroEntry.data.p1 || '',
        p2: parsedHeroEntry.data.p2 || '',
        cta: parsedHeroEntry.data.cta || '',
  }

  
  return {
    props: {
      experiences,
      projects, 
      stacks, 
      about, 
      hero
    },
  };
};

export default Home
