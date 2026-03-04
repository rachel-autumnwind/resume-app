import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  Edit3,
  Download,
  X,
  Save,
  User,
  Briefcase,
  Code2,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { marked } from 'marked';
import './index.css';

// Floating particles component
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden no-print">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-blue-400/20"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Animated background gradient
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 no-print">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, rgba(219, 234, 254, 0.4) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, rgba(219, 234, 254, 0.4) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, rgba(219, 234, 254, 0.4) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 20%, rgba(219, 234, 254, 0.4) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

// Scroll progress indicator
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 origin-left z-50 no-print"
      style={{ scaleX }}
    />
  );
};

// Import default resume markdown
import defaultResumeMd from './default-resume.md?raw';

const App = () => {
  const [md, setMd] = useState(defaultResumeMd);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Parallax effect for header
  const headerY = useTransform(scrollY, [0, 300], [0, -50]);
  const headerOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  useEffect(() => {
    localStorage.setItem('resume_md', md);
  }, [md]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Enhanced Section Parser
  const sections = useMemo(() => {
    const rawHtml = marked.parse(md);
    const container = document.createElement('div');
    container.innerHTML = rawHtml;
    
    const parsedSections: { content: string; id: string }[] = [];
    let currentBlockHtml = "";

    Array.from(container.children).forEach((child, index) => {
      const isHeader = ['H1', 'H2', 'H3'].includes(child.tagName);
      const isHR = child.tagName === 'HR';

      if ((isHeader || isHR) && index !== 0) {
        if (currentBlockHtml.trim()) {
          parsedSections.push({
            id: `block-${parsedSections.length}`,
            content: currentBlockHtml
          });
        }
        currentBlockHtml = child.outerHTML;
      } else {
        currentBlockHtml += child.outerHTML;
      }

      if (index === container.children.length - 1 && currentBlockHtml.trim()) {
        parsedSections.push({
          id: `block-${parsedSections.length}`,
          content: currentBlockHtml
        });
      }
    });

    return parsedSections;
  }, [md]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = '翁露婷-5年前端.pdf';
    link.click();
  };

  return (
    <div className="min-h-screen pb-20 relative">
      <AnimatedBackground />
      <FloatingParticles />
      <ScrollProgress />

      {/* Floating Controls */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 no-print z-50">
        <motion.button
          initial={{ scale: 0, x: 60 }}
          animate={{ scale: 1, x: 0 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 25px rgba(59, 130, 246, 0.5)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="px-5 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full shadow-xl flex items-center gap-2.5 transition-all relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 2, opacity: 0.15 }}
            transition={{ duration: 0.4 }}
          />
          <Download size={18} className="relative z-10" />
          <span className="relative z-10 text-sm font-semibold tracking-wide">
            {isGeneratingPDF ? '生成中...' : '下载 PDF'}
          </span>
        </motion.button>
      </div>

      {/* Editor Overlay */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[60] bg-white/90 p-4 md:p-8 flex flex-col"
          >
            <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-3">
                  <Sparkles size={24} className="text-blue-500" /> 简历编辑器
                </h2>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-full transition-all"
                >
                  <X size={28} />
                </button>
              </div>
              <textarea
                className="flex-1 w-full p-8 font-mono text-sm bg-white rounded-2xl border border-blue-100 shadow-inner focus:ring-4 focus:ring-blue-50 resize-none outline-none transition-all"
                value={md}
                onChange={(e) => setMd(e.target.value)}
                spellCheck={false}
              />
              <div className="mt-6 flex justify-end items-center gap-6">
                <button 
                  onClick={() => { if(confirm('重置将清空当前所有修改，确定吗？')) setMd(defaultResumeMd); }}
                  className="text-slate-400 hover:text-red-400 transition-colors text-sm font-medium"
                >
                  恢复默认模板
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-10 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 font-semibold tracking-wide"
                >
                  完成预览
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resume View */}
      <motion.div
        ref={resumeRef}
        className="max-w-4xl mx-auto px-8 py-16 md:py-24 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Scroll indicator */}
        <motion.div
          className="absolute top-8 left-1/2 -translate-x-1/2 no-print"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-blue-400"
          >
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>

        {/* Profile Photo */}
        <motion.div
          className="absolute top-16 right-8 md:right-12"
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl blur-sm opacity-50"></div>
            <img
              src={`${import.meta.env.BASE_URL}img/photo.png`}
              alt="Profile Photo"
              className="relative w-32 h-40 md:w-36 md:h-44 object-cover rounded-2xl border-4 border-white"
            />
          </motion.div>
        </motion.div>

        <div className="resume-container prose prose-slate max-w-none">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.7,
                delay: Math.min(index * 0.1, 0.5),
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              whileHover={{
                scale: 1.01,
                transition: { duration: 0.2 }
              }}
              className="relative group"
            >
              {/* Hover glow effect */}
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-blue-50/0 via-blue-50/50 to-blue-50/0 rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
              <div dangerouslySetInnerHTML={{ __html: section.content }} />
            </motion.div>
          ))}
        </div>

        <motion.footer
          className="mt-24 pt-10 border-t border-blue-50 text-center no-print"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.p
            className="text-blue-200 text-[10px] tracking-[0.3em] uppercase font-bold"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            Innovation & Professionalism · Weng Luting
          </motion.p>
        </motion.footer>
      </motion.div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
