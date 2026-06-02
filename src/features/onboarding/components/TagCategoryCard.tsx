import { Heart, Check, Ban } from "lucide-react";
import { motion } from "motion/react";

import type { OnboardingForm, TagSentiment } from "../types";

import { Card } from "@/shared/components/ui/Card";

interface TagCategory {
  name: string;
  color: string;
  textColor: string;
  tags: string[];
}

interface Props {
  category: TagCategory;
  form: OnboardingForm;
  onSetSentiment: (tag: string, sentiment: TagSentiment) => void;
}

export function TagCategoryCard({ category, form, onSetSentiment }: Props) {
  return (
    <Card
      variant="white"
      padding="none"
      className="border-4 shadow-[10px_10px_0_0_#000] overflow-hidden flex flex-col group hover:shadow-[14px_14px_0_0_#000] transition-all"
    >
      {/* Category header */}
      <div className="bg-neo-black p-3 flex justify-between items-center group-hover:bg-neo-black/90 transition-colors">
        <h3
          className={`font-heading text-xl ${category.textColor} uppercase italic tracking-tighter`}
        >
          {category.name}
        </h3>
        <div className={`w-3 h-3 rounded-full ${category.color} animate-pulse`} />
      </div>

      {/* Tag rows */}
      <div className="p-4 flex flex-col gap-2 bg-neo-bg/30">
        {category.tags.map((tag) => {
          const isLoves = form.loves.includes(tag);
          const isComfort = form.comfort.includes(tag);
          const isVeto = form.veto.includes(tag);

          return (
            <div
              key={tag}
              className="flex items-center neo-border bg-white overflow-hidden h-12 group/row hover:border-neo-black transition-all hover:bg-white/80"
            >
              <span className="flex-1 px-4 font-black text-xs uppercase truncate text-neo-black/80">
                {tag}
              </span>

              <div className="flex h-full border-l-4 border-neo-black bg-neo-bg">
                {/* Loves */}
                <button
                  type="button"
                  title="Amo"
                  onClick={() => onSetSentiment(tag, isLoves ? null : "loves")}
                  className={`w-12 h-full flex items-center justify-center border-r-2 border-black transition-all group/btn
                    ${isLoves ? "bg-neo-pink text-white" : "bg-white hover:bg-neo-pink/20"}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.4, rotate: [0, 15, -15, 0] }}
                    animate={isLoves ? { scale: [1, 1.4, 1], rotate: [0, 15, -15, 0] } : {}}
                    transition={{ repeat: isLoves ? 1 : 0 }}
                  >
                    <Heart
                      className={`w-5 h-5 ${isLoves ? "fill-current" : "text-neo-black/20 group-hover/btn:text-neo-pink"}`}
                    />
                  </motion.div>
                </button>

                {/* Comfort */}
                <button
                  type="button"
                  title="Conforto"
                  onClick={() => onSetSentiment(tag, isComfort ? null : "comfort")}
                  className={`w-12 h-full flex items-center justify-center border-r-2 border-black transition-all group/btn
                    ${isComfort ? "bg-neo-lime text-black" : "bg-white hover:bg-neo-lime/20"}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.4, rotate: 360 }}
                    animate={isComfort ? { rotate: [0, 360], scale: [1, 1.4, 1] } : {}}
                  >
                    <Check
                      className={`w-5 h-5 ${isComfort ? "text-black" : "text-neo-black/20 group-hover/btn:text-neo-lime"}`}
                    />
                  </motion.div>
                </button>

                {/* Veto */}
                <button
                  type="button"
                  title="Veto"
                  onClick={() => onSetSentiment(tag, isVeto ? null : "veto")}
                  className={`w-12 h-full flex items-center justify-center transition-all group/btn
                    ${isVeto ? "bg-neo-black text-neo-pink shadow-inner" : "bg-white hover:bg-neo-pink/10"}`}
                >
                  <motion.div
                    whileHover={{ x: [-2, 2, -2, 2, 0], scale: 1.1 }}
                    animate={isVeto ? { x: [-1, 1, -1, 1, 0] } : {}}
                  >
                    <Ban
                      className={`w-5 h-5 ${isVeto ? "text-neo-pink" : "text-neo-black/20 group-hover/btn:text-neo-pink"}`}
                    />
                  </motion.div>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
