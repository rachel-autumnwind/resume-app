import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
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

// Default resume content in Markdown
const DEFAULT_MD = `# 翁露婷 - 前端开发工程师

## 基本信息

- **姓名**：翁露婷
- **联系电话**：15158725753
- **电子邮箱**：965412234@qq.com
- **求职意向**：前端开发工程师（Vue 方向）
- **工作年限**：5 年（含实习，2021.03 起）
- **学历背景**：温州理工学院 计算机科学与技术（本科，2017-2021）

## 核心优势

- **5 年** Vue 技术栈实战经验：深度参与 **Vue2/3** 全家桶在复杂 SaaS、3D 编辑器及中台系统中的应用，具备从 0 到 1 独立搭建项目、微前端架构（Qiankun）及自研 UI 组件库的工程化能力。

- **AI 与前端**融合落地能力：敏锐捕捉技术趋势，深度参与 AIGC 产品落地，实现 AI 对话设计助手、图像重绘与擦除等功能，熟悉 AI Agent 交互设计与大模型 API 集成。

- **Shopify** 海外生态对接经验：精通 Shopify 定制化开发与 Liquid 模版语言，曾成功交付 10+ 海外品牌项目，具备跨国技术支持经验，能精准转化业务需求为技术方案。

- 复杂交互与性能优化心得：在 3D 编辑器材质管理、Canvas 交互工具、大规模数据可视化（G6/D3.js）等高难度场景有深度实践，擅长通过性能调优（Vite/分包/缓存）提升复杂系统的用户体验。

- 具备团队协作与管理视野：曾任前端小组组长，熟悉敏捷开发流程，能够协调跨部门资源，确保高质量的代码交付与项目里程碑达成。

- 熟练使用**Cursor**、**Claude Code** 协作开发。
---

## 工作经历

### Pacdora 公司 | 前端开发工程师 | 2024.07 - 2026.02

作为核心开发主导产品落地，覆盖API 服务、客户对接及 AI 功能，直接推动业务增长与客户拓展。

#### 1. API SDK 产品及后台开发

**API 示例地址**：https://apidemo.pacdora.com/detail.html?modelId=100010

- 负责 **Pacdora-plus API SDK** 的前端架构设计与功能开发
- 实现 **报价系统**：变量和规则配置、产品模板管理、公式验证和计算等功能
- 开发各类 Pacdora 自定义组件，支持客户通过少量代码集成 3D 包装能力
- **3D编辑器**内容：实现 3D 模型尺寸、材质、厚度实时交互调节；开发 3D 水印功能及多语言切换系统；PDF 转图片高性能处理。
- 后台中枢：搭建模型库管理系统，完成高级编辑器布局、字体管理系统及自定义权限配置。
- 通过接口缓存、限流优化，保障多客户并发调用稳定性

#### 2. AI 功能开发与落地

**AI 功能地址**：https://www.pacdora.com/ai-packaging-design

- 核心模块：开发 AI 生成(Creation) 智能生成系统，支持文本生图、分面设计元素生成及 AI Logo 生成。

- 图像处理：实现 AI 重绘与擦除功能，包括笔刷工具、涂抹区域控制、缩放交互等逻辑。

- 对话系统：构建 AI 设计助手，设计 useAIChat 状态管理流，优化 Inspire Prompt 用户引导流程。

#### 3. Shopify 客户对接与 API 接入（10+ 海外客户）

**案例地址**：https://www.packhubs.com/collections/packaging/products/corrugated-mailer-box-advanced-editor-copy-1

- 定制化接入：利用 Liquid 模板语言为 ko-ma-tsu、Lookourway 等 10 余家海外品牌开发定制器插件。
- 全链路打通：解决设计数据与 Shopify 购物车、订单系统的同步难题，支持拼板计算与高级编辑器集成，客户满意度 > 95%。
- 全程对接海外客户（**英语**沟通），提供技术支持，解决兼容性与逻辑问题，为公司带来持续收入。

#### 4. UI 组件库与工程化建设（@pacdora/ui）

- 开发 **Color Picker 颜色选择器**组件，支持推荐颜色与自定义颜色
- 实现 **Tooltip、PTooltip** 提示组件，支持插槽与鼠标跟随
- 开发 **LazyImage 懒加载图片**组件，支持刷新与占位
- 实现 **StyleInput、History** 等业务组件

---

### 浙江臻善科技股份有限公司 | 前端小组组长 | 2022.04 - 2024.06

主导项目微前端架构设计与技术选型（Vite+Qiankun），通过自研组件库标准规范及团队管理，赋能 3 人团队实现研发效率与交付质量 30% 以上的提升。

#### 1.贵州农业农村数据中台（微前端架构）

- 微前端实战： 基于 Qiankun 实现 5 个子应用平滑接入，统一管理 Axios 拦截、环境配置及样式隔离。

- 流程图自研： 利用 Antv-G6 / Vue-Flow 开发数据建模与血缘分析模块，实现节点拖拽布局、逻辑连线及状态感知等复杂交互。

- 性能优化： 针对 Vite 进行首屏加载优化（分包策略、Gzip 等），首屏加载速度提升 30%；集成 Codemirror 实现 SQL 在线编辑。

#### 2.数据治理平台 / 数字智库中台

- 复杂交互： 基于 D3.js 自研字段映射组件（支持同行/同名自动映射）；利用 Websocket 实现任务运行日志的实时流式推送。

- 资产管理： 封装高性能文件预览模块，支持 PDF、Doc、多媒体等全格式展示；通过 Iframe 状态同步技术解决多标签页切换的持久化问题。

- 工程优化： 实施 Webpack 代码拆分与动图按需加载方案，显著降低低配机器下的系统卡顿率。

---

### 华卓信息科技有限公司 | 前端工程师 | 2021.07 - 2022.04

- 开发医院 **CRM 系统**（Vue3 + TypeScript）
- 智慧服务 H5（Vue2 + Vant）
- 完成核心模块，保障项目上线迭代


---

### 杭州数政科技有限公司 | 前端实习生 | 2021.03 - 2021.06

- 参与页面开发、接口联调与 Bug 修复，积累实战基础

---

## 个人项目与技术研究

### AI Agent 智体大战（GitHub）

- 地址：https://github.com/rachel-autumnwind?tab=repositories

- 基于 **LangChain + Vue3** 搭建，实现多 AI 智体交互、协作场景可视化

---

## 技术技能

| 领域        | 技能                                                        |
| ----------- | ----------------------------------------------------------- |
| 前端框架    | Vue2/Vue3 全家桶、Qiankun 微前端、Uniapp、TypeScript      |
| 工程化工具  | Vite、Webpack、Rollup、pnpm (Monorepo)、Git、Nginx、Jenkins |
| 电商开发    | Shopify、Liquid                                             |
| 后端/数据库 | Prisma、PostgreSQL                                          |
| AI 与拓展   | LangChain、大模型 API 集成、AI Agent 开发                   |
| 开发工具    | Cursor、Claude Code、VS Code                                |

---

## 自我评价

- **5 年 Vue 技术栈深耕经验**，核心聚焦 Pacdora 公司 3D 编辑器、AI 功能、shopify等关键项目，具备从 0 到 1 搭建复杂项目与定制化交付能力
- 擅长将前端技术与业务结合，兼顾技术优化、用户体验与客户需求，同时持续探索 **AI 与前端融合创新**
- 具备 **团队管理与跨部门协作经验**，服务过 **10+ 海外客户**，客户满意度 95%+
- 严谨务实，注重效率与结果，期待为技术驱动型团队贡献核心价值

`;

const App = () => {
  const [md, setMd] = useState(DEFAULT_MD);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
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

  return (
    <div className="min-h-screen pb-20 relative">
      <AnimatedBackground />
      <FloatingParticles />
      <ScrollProgress />

      {/* Floating Controls */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 no-print z-50">
        <motion.button
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
          whileHover={{
            scale: 1.15,
            boxShadow: "0 0 25px rgba(59, 130, 246, 0.5)",
            rotate: 5
          }}
          whileTap={{ scale: 0.95, rotate: -5 }}
          onClick={handlePrint}
          className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full shadow-xl flex items-center justify-center transition-all relative overflow-hidden group"
        >
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 2, opacity: 0.2 }}
            transition={{ duration: 0.4 }}
          />
          <Download size={22} className="relative z-10" />
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
                  onClick={() => { if(confirm('重置将清空当前所有修改，确定吗？')) setMd(DEFAULT_MD); }}
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
