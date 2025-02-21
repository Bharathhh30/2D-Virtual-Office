import React from "react";
import { useNavigate } from "react-router-dom";
import { useFireBase } from "../context/FireBase";
import { Cover } from "../components/ui/Cover";
import {TextGenerateEffect} from "../components/ui/TextGenerate";
import {WorldMap} from "../components/ui/WorldMap";
import { motion } from "motion/react";
import { SparklesCore } from "../components/ui/Sparkles";


function Home() {
  const firebase = useFireBase();
  const navigate = useNavigate();

  const handleSignInWithGoogle = async () => {
    await firebase.signUpWithGoogle();
    console.log("Sign In With Google success");
  };

  const words = `Step into a dynamic 2D virtual world where work meets interaction! Our gamified marketplace and virtual office empower users to explore spaces, collaborate in real time, and connect seamlessly using WebSockets and peer-to-peer video. Built with React, Phaser.js, Node.js, and Firebase, it's the future of immersive online engagement.`

  return (
    <div className="p-3 ">
      <div className="flex items-center">
        <div className="text-3xl font-bold p-2 font-GF">HackStation</div>
        <div className="ml-auto flex gap-x-2 text-xl font-semibold text-white">
          <button
            onClick={handleSignInWithGoogle}
            className="bg-amber-400 rounded-md p-2 cursor-pointer"
          >
            SignIn
          </button>
        </div>
      </div>

      <div>
        <div>
          <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
          The Virtual Office  <br /> That Feels <Cover>Real</Cover>
          </h1>
        </div>
      </div>

      <div className="flex justify-center">
        <img src="src/assets/Flora.png" alt="" />
      </div>

      <div className="flex justify-center text-center font-J15 p-16">
        <TextGenerateEffect words={words} />
      </div>

      <div className=" py-40 dark:bg-black bg-white w-full">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-bold text-xl md:text-4xl dark:text-white text-black">
            Remote{" "}
            <span className="text-neutral-400">
              {"Connectivity".split("").map((word, idx) => (
                <motion.span
                  key={idx}
                  className="inline-block"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.04 }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </p>
          <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto py-4">
            Break free from traditional boundaries. Work from anywhere, at the
            comfort of your own studio apartment. Perfect for Nomads and
            Travellers.
          </p>
        </div>
        <WorldMap
          dots={[
            {
              start: {
                lat: 64.2008,
                lng: -149.4937,
              }, // Alaska (Fairbanks)
              end: {
                lat: 34.0522,
                lng: -118.2437,
              }, // Los Angeles
            },
            {
              start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
              end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
            },
            {
              start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
              end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
            },
            {
              start: { lat: 51.5074, lng: -0.1278 }, // London
              end: { lat: 28.6139, lng: 77.209 }, // New Delhi
            },
            {
              start: { lat: 28.6139, lng: 77.209 }, // New Delhi
              end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
            },
            {
              start: { lat: 28.6139, lng: 77.209 }, // New Delhi
              end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
            },
          ]}
        />
      </div>

      <div className="h-[40rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
      <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
        HackStation
      </h1>
      <div className="w-[40rem] h-40 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
 
        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
 
        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
      <div className="text-white">
        A Product by <span className="text-amber-400">Fhirst Price❤️</span>
      </div>
    </div>

    </div>
  );
}
export default Home;
