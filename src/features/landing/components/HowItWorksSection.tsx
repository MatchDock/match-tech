import { motion } from "motion/react";
import type { Step } from "../constants/steps";

interface Props {
  steps: Step[];
}

export function HowItWorksSection({ steps }: Props) {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tighter">
            COMO FUNCIONA_
          </h2>
          <div className="w-24 h-2 bg-neo-black mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className={`bg-neo-${step.color} neo-border border-4 neo-shadow p-6 md:p-8 relative group hover:neo-shadow-hover hover:-translate-y-2 transition-all duration-200`}>
                  {/* Step number */}
                  <div className="absolute -top-5 -left-3 bg-neo-black text-white w-12 h-12 flex items-center justify-center font-heading font-black text-2xl border-[3px] border-neo-black shadow-[3px_3px_0_0_#000]">
                    {i + 1}
                  </div>

                  {/* Decorative accent */}
                  <div className={`absolute top-4 right-4 w-5 h-5 ${step.accent} border-2 border-black rotate-12 group-hover:rotate-45 transition-transform`} />

                  <div className="mt-4">
                    <Icon className="w-10 h-10 mb-4" strokeWidth={2.5} />
                    <h3 className="font-heading font-black text-2xl md:text-3xl uppercase tracking-tight mb-3">
                      {step.title}
                    </h3>
                    <p className="font-bold text-sm md:text-base">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
