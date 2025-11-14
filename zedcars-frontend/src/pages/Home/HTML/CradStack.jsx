import React from "react";
import { motion } from "framer-motion";

const CardStack = () => {
  return (
    <div className="w-full min-h-[80vh] bg-[#05010c] flex items-center justify-center px-10 py-20">
      <div className="max-w-6xl w-full flex items-center justify-between gap-10">
        
        {/* LEFT TEXT SECTION */}
        <div className="text-left space-y-4">
          <h1 className="text-white text-5xl font-semibold leading-tight">
            Card stacks have never <br /> looked so good
          </h1>
          <p className="text-gray-400 text-xl">
            Just look at it go!
          </p>
        </div>

        {/* RIGHT CARD STACK */}
        <div className="relative w-[420px] h-[330px]">
          
          {/* BACK CARD */}
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute inset-0 rounded-2xl border border-white/10 bg-white/5
                       backdrop-blur-xl shadow-2xl overflow-hidden"
            style={{ transform: "perspective(900px) rotateX(10deg) rotateY(-10deg)" }}
          >
            <div className="px-5 py-3 text-gray-300 font-medium flex items-center gap-2">
              ⚙️ Customizable
            </div>
          </motion.div>

          {/* FRONT CARD */}
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
            className="absolute inset-0 rounded-2xl border border-white/10 bg-[#0e0c18]
                       backdrop-blur-xl shadow-[0_0_40px_rgba(120,70,255,0.5)] overflow-hidden"
            style={{ transform: "perspective(900px) rotateX(12deg) rotateY(-8deg)" }}
          >
            <div className="px-5 py-3 text-gray-200 font-medium flex items-center gap-2">
              💻 Reliable
            </div>

            <div className="w-full h-full flex items-center justify-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-[140px] font-bold bg-gradient-to-r
                           from-purple-500 to-blue-400 bg-clip-text text-transparent"
              >
                2
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CardStack;
