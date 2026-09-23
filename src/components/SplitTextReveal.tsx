"use client";

import React, { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";

export interface SplitTextRevealProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  delay?: number; // Delay before animation starts in seconds
  stagger?: number; // Delay between consecutive words in seconds
  duration?: number; // Duration of each word animation
  className?: string;
  wordClassName?: string;
  style?: React.CSSProperties;
  triggerOnView?: boolean;
  once?: boolean;
  id?: string;
  splitBy?: "words" | "chars";
}

export default function SplitTextReveal({
  text,
  as = "span",
  delay = 0,
  stagger = 0.04,
  duration = 0.65,
  className = "",
  wordClassName = "",
  style,
  triggerOnView = true,
  once = true,
  id,
  splitBy = "words",
}: SplitTextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, {
    once,
    amount: 0.15,
  });

  const isAnimated = triggerOnView ? isInView : true;

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      y: "115%",
      opacity: 0,
    },
    visible: {
      y: "0%",
      opacity: 1,
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1], // Signature high-end cubic-bezier curve
      },
    },
  };

  const Tag = motion[as] as any;

  if (splitBy === "chars") {
    const chars = Array.from(text);
    return (
      <Tag
        ref={containerRef}
        id={id}
        key={text}
        initial="hidden"
        animate={isAnimated ? "visible" : "hidden"}
        variants={containerVariants}
        className={`inline-block ${className}`}
        style={style}
      >
        {chars.map((char, index) => (
          <span
            key={index}
            className="inline-block overflow-hidden align-top"
          >
            <motion.span
              variants={itemVariants}
              className={`inline-block ${wordClassName}`}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          </span>
        ))}
      </Tag>
    );
  }

  // Default: splitBy="words"
  // Split on spaces while preserving words
  const words = text.split(" ").filter(Boolean);

  return (
    <Tag
      ref={containerRef}
      id={id}
      key={text}
      initial="hidden"
      animate={isAnimated ? "visible" : "hidden"}
      variants={containerVariants}
      className={`inline-block ${className}`}
      style={style}
    >
      {words.map((word, index) => (
        <span
          key={index}
          className="inline-block overflow-hidden align-top mr-[0.28em] last:mr-0"
        >
          <motion.span
            variants={itemVariants}
            className={`inline-block ${wordClassName}`}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
