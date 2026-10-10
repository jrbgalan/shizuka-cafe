import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ZoomImage from "@/components/ZoomImage";
import JapanesePhotoFrame from "@/components/JapanesePhotoFrame";

// Large hover-zoom photo card (benchmarkcoffee "the experience" style)
// Encased in an authentic Japanese gold leaf frame with scroll light shine.
export default function ExperienceCard({ experience, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: index * 0.12 }}
      className="group relative"
    >
      <JapanesePhotoFrame className="transition-all duration-500 hover:scale-[1.01]">
        <Link to={experience.href} className="block relative h-full w-full">
          <ZoomImage
            label={experience.imageLabel}
            alt={experience.title}
            aspect="aspect-[3/4] md:aspect-[4/5]"
            zoom={1.12}
            duration={0.9}
            framed={false}
          />
          {/* Fixed overlay — darkens on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zen-espresso/80 via-zen-espresso/20 to-transparent transition-opacity duration-700 group-hover:from-zen-espresso/90" />
          <div className="pointer-events-none absolute inset-0 bg-zen-espresso/0 transition-opacity duration-700 group-hover:bg-zen-espresso/20" />

          <div className="absolute inset-x-0 bottom-0 p-7 text-zen-paper">
            <p className="font-jp text-sm tracking-[0.3em] text-zen-paper/70">{experience.jp}</p>
            <h3 className="mt-2 font-heading text-3xl lowercase md:text-4xl">{experience.title}</h3>
            <p className="mt-3 max-w-sm text-sm text-zen-paper/75">{experience.description}</p>
            <span className="mt-5 flex translate-y-2 items-center gap-2 text-xs uppercase tracking-[0.25em] text-zen-paper/0 opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:text-zen-paper group-hover:opacity-100">
              check here <ArrowRight className="h-4 w-4" strokeWidth={1.25} />
            </span>
          </div>
        </Link>
      </JapanesePhotoFrame>
    </motion.article>
  );
}