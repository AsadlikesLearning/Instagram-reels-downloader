"use client";

import React from "react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function LoadingSpinner({ size = "md", text, className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Outer subtle glow */}
      <motion.div
        className={`relative ${sizeClasses[size]} rounded-full`}
        initial={{ scale: 0.95, opacity: 0.9 }}
        animate={{ scale: [0.95, 1, 0.95], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Back ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow:
              "0 0 18px rgba(168, 85, 247, 0.25), inset 0 0 12px rgba(236, 72, 153, 0.15)"
          }}
        />
        {/* Spinner ring with gradient */}
        <motion.div
          className={`absolute inset-0 rounded-full border-[3px] border-transparent`}
          style={{
            background:
              "conic-gradient(from 0deg, rgba(168,85,247,0.0) 0deg, rgba(168,85,247,0.9) 120deg, rgba(236,72,153,0.9) 300deg, rgba(236,72,153,0.0) 360deg)",
            WebkitMask:
              "radial-gradient(farthest-side, #0000 calc(100% - 3px), #000 0)"
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
        {/* Inner core */}
        <motion.div
          className="absolute inset-[22%] rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20"
          animate={{ scale: [1, 0.98, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      {text && (
        <motion.span
          className="text-sm text-gray-600 dark:text-gray-300"
          animate={{ opacity: [0.4, 1, 0.4], filter: ["blur(0.2px)", "blur(0px)", "blur(0.2px)"] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {text}
        </motion.span>
      )}
    </div>
  );
}

export function CuteLoadingAnimation({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6">
      <motion.div
        className="relative"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.div
          className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-[0_0_24px_rgba(168,85,247,0.35)]"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <motion.div
            className="w-6 h-6 bg-white rounded-full"
            animate={{ scale: [1, 0.8, 1] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>
      
      <motion.div
        className="flex gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.45)]"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
      
      <motion.p
        className="text-sm text-gray-600 dark:text-gray-300 font-medium"
        animate={{ opacity: [0.45, 1, 0.45], letterSpacing: ["0.2px", "0.6px", "0.2px"] }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {text}
      </motion.p>
    </div>
  );
}

export function SuccessAnimation({ text = "Success!" }: { text?: string }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-3 p-4"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
    >
      <motion.div
        className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 10,
          delay: 0.2
        }}
      >
        <motion.svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.5
          }}
        >
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </motion.svg>
      </motion.div>
      
      <motion.p
        className="text-sm text-green-600 dark:text-green-400 font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {text}
      </motion.p>
    </motion.div>
  );
}
