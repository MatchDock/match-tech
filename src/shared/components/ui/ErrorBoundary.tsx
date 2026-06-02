import React, { Component, ErrorInfo, ReactNode } from 'react';
import { appLog } from '@/src/shared/lib/logger/logger';
import { motion } from 'motion/react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    appLog.error('React component threw an error', { error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen bg-neo-bg flex items-center justify-center p-6 font-sans relative overflow-hidden"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M40 40H0V0h1v39h39v1z' fill='%23000' fill-opacity='0.1'/%3E%3C/svg%3E")`
          }}
        >
          {/* Decorative Animated Background Shapes */}
          <motion.div
            animate={{ x: [-20, 20, -20], y: [-20, 20, -20], rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 left-10 w-32 h-32 bg-neo-pink/15 border-2 border-neo-black/10 hidden md:block"
          />
          <motion.div
            animate={{ x: [20, -20, 20], y: [20, -20, 20], rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-10 right-10 w-44 h-44 bg-neo-lime/15 rounded-full border-2 border-neo-black/10 hidden md:block"
          />
          <motion.div
            animate={{ scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 right-1/4 w-24 h-24 bg-neo-cyan/15 rotate-45 border-2 border-neo-black/10 hidden md:block"
          />

          <div className="max-w-2xl w-full relative z-10">
            {/* Main error card with spring entry */}
            <motion.div 
              initial={{ scale: 0.85, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 90, damping: 12 }}
              className="bg-white border-[4px] border-neo-black shadow-[8px_8px_0_0_#000] p-8 md:p-12 relative"
            >
              
              {/* Decorative corner accent with wobble animation */}
              <motion.div 
                animate={{ rotate: [12, 18, 12], scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 w-10 h-10 bg-neo-pink border-[3px] border-neo-black shadow-[3px_3px_0_0_#000]"
              />
              <motion.div 
                animate={{ rotate: [-6, -12, -6], scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute -bottom-3 -left-3 w-8 h-8 bg-neo-lime border-[3px] border-neo-black shadow-[3px_3px_0_0_#000]"
              />

              {/* Alert icon with subtle scale pulse and hover rotation */}
              <motion.div 
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                whileHover={{ scale: 1.15, rotate: 10 }}
                className="w-20 h-20 bg-neo-yellow border-[4px] border-neo-black shadow-[4px_4px_0_0_#000] flex items-center justify-center mx-auto mb-6 cursor-pointer"
              >
                <span className="text-4xl font-heading font-black">⚠️</span>
              </motion.div>

              {/* Title with sliding text entry effect */}
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="font-heading font-black text-3xl md:text-5xl uppercase tracking-tighter text-center mb-4"
              >
                OOPS, ALGO QUEBROU_
              </motion.h1>

              {/* Friendly message */}
              <div className="bg-neo-bg border-[3px] border-neo-black p-6 mb-6">
                <p className="font-bold text-base md:text-lg mb-3">
                  Olá! Parece que algo deu errado, né? 😅
                </p>
                <p className="text-sm md:text-base mb-3">
                  Este é o <span className="bg-neo-yellow px-1 font-bold">primeiro projeto desta turma</span> — dá um desconto! 
                  Que tal me avisar sobre esse erro?
                </p>
                <p className="text-sm md:text-base">
                  Você pode inspecionar a página (<kbd className="bg-neo-black text-white px-2 py-0.5 font-mono text-xs border-[2px] border-neo-black shadow-[2px_2px_0_0_#B8FF29]">F12</kbd> → Console), 
                  copiar o log e me mandar. Já vai ajudar <span className="font-black uppercase">MUITO</span>.
                </p>
              </div>

              {/* Technical error - terminal style */}
              <div className="bg-neo-black text-neo-lime p-4 border-[3px] border-neo-black mb-6 font-mono text-xs md:text-sm overflow-x-auto">
                <p className="text-neo-pink mb-1 font-bold">{'>'} error.message:</p>
                <p className="break-all mb-2 opacity-90">{this.state.error?.message || 'Unknown error'}</p>
                <p className="text-neo-cyan text-[10px] opacity-60">Copie esse texto e mande pro Tony ;)</p>
              </div>

              {/* Action button with spring hover/tap effects */}
              <div className="flex justify-center">
                <motion.button 
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98, y: 1 }}
                  className="px-8 py-4 bg-neo-lime text-neo-black font-heading font-black text-lg uppercase border-[4px] border-neo-black shadow-[6px_6px_0_0_#000] hover:shadow-[8px_8px_0_0_#000] transition-all"
                  onClick={() => window.location.reload()}
                >
                  RECARREGAR PÁGINA →
                </motion.button>
              </div>
            </motion.div>

            {/* Fun footer with delay entry */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-center"
            >
              <p className="font-mono text-xs font-bold bg-white border-[3px] border-neo-black shadow-[4px_4px_0_0_#000] inline-block px-4 py-2">
                Foi um erro mesmo ou eu fiz isso de propósito pra você ver esta linda página? 🤔
              </p>
            </motion.div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
