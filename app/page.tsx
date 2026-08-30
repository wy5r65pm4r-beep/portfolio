'use client';

import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUpRight, Grid2X2, List, Moon, Play, Sun } from 'lucide-react';

const projects = [
  { no: '01', slug: 'supor', title: '苏泊尔 · 节日海报系统', en: 'SUPOR Campaign System', type: '视觉系统 / 海报', year: '2025', asset: '12 张系列海报图 + 应用场景图', tone: 'coral' },
  { no: '02', slug: 'manlong', title: '曼龙 · 儿童帐篷插画', en: 'MANLONG Illustration', type: '插画 / 产品视觉', year: '2024', asset: '帐篷产品图 + 插画细节图', tone: 'sage' },
  { no: '03', slug: 'goat-milk', title: '羊奶粉 · 包装系列', en: 'Goat Milk Packaging', type: '包装 / 消费品牌', year: '2024', asset: '4 款包装图 + 陈列场景图', tone: 'cream' },
  { no: '04', slug: 'animation-art', title: '动画美术精选', en: 'Animation Art Direction', type: '动画美术 / 影像', year: '2022—25', asset: '动画视频 + 关键帧画面', tone: 'ink' },
  { no: '05', slug: 'digital-works', title: '数字体验精选', en: 'Selected Digital Works', type: '网站 / 数字设计', year: '2023—25', asset: '网站界面图 + 设备场景图', tone: 'blue' },
];

function MediaSlot({ label, note, ratio = 'landscape', dark = false, play = false, cmsKey }: { label: string; note: string; ratio?: 'landscape' | 'portrait' | 'wide' | 'square'; dark?: boolean; play?: boolean; cmsKey?: string }) {
  return <div className={`media-slot ${ratio} ${dark ? 'dark-slot' : ''}`} data-cms-key={cmsKey} data-cms-label={label}><div className="slot-top"><span>MEDIA PLACEHOLDER</span><span>↗</span></div><div className="slot-center">{play && <span className="play"><Play size={18} fill="currentColor" /></span>}<strong>{label}</strong><small>{note}</small></div></div>;
}

function SectionTitle({ index, title, subtitle }: { index: string; title: string; subtitle?: string }) {
  return <div className="section-title"><span>{index}</span><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>;
}

export default function Home() {
  const [view, setView] = useState<'grid' | 'index'>('grid');
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const savedTheme = window.localStorage.getItem('portfolio-theme');
    const shouldUseDark = savedTheme === 'dark';
    setDarkMode(shouldUseDark);
    document.documentElement.classList.toggle('dark-theme', shouldUseDark);
  }, []);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 40); onScroll(); window.addEventListener('scroll', onScroll); return () => window.removeEventListener('scroll', onScroll); }, []);
  const toggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    document.documentElement.classList.toggle('dark-theme', nextMode);
    window.localStorage.setItem('portfolio-theme', nextMode ? 'dark' : 'light');
  };

  return <main>
    <button className="theme-toggle" onClick={toggleTheme} aria-label={darkMode ? '切换为浅色背景' : '切换为黑色背景'} aria-pressed={darkMode}><span>{darkMode ? 'Light' : 'Dark'}</span>{darkMode ? <Sun size={17} /> : <Moon size={17} />}</button>
    <header className={scrolled ? 'site-header scrolled' : 'site-header'}><a href="#top" className="brand">ZOEY <span>Visual Designer</span></a><nav aria-label="主导航"><a href="#works">Works</a><a href="#about">About</a><a href="#contact">Contact</a></nav><span className="availability"><i /> Available for selected projects</span></header>
    <section className="hero" id="top"><div className="hero-kicker"><span>PORTFOLIO / 2022—2026</span><span>SHANGHAI, CN</span></div><h1 data-cms-key="home.hero.title">把复杂的商业信息，<br /><em>转化为清晰而有记忆点的视觉。</em></h1><div className="hero-foot"><p data-cms-key="home.hero.subtitle">Visual design, illustration & art direction<br />for ambitious consumer brands.</p><a href="#works">Selected works <ArrowDown size={15} /></a></div><MediaSlot label="首页主视觉" note="建议：最具代表性的横幅作品 / 视觉拼贴，2400 × 1350 px" ratio="wide" cmsKey="home.hero.media" /></section>
    <section className="works" id="works"><div className="works-head"><SectionTitle index="01" title="Selected Works" subtitle="一组经过筛选的商业设计案例，呈现从信息梳理到最终落地的完整能力。" /><div className="view-toggle" aria-label="项目视图切换"><button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')}><Grid2X2 size={14} /> Grid</button><button className={view === 'index' ? 'active' : ''} onClick={() => setView('index')}><List size={15} /> Index</button></div></div><div className={`project-browser ${view}`}>{projects.map((project) => <a href={`/projects/${project.slug}`} className={`project-card ${project.tone}`} key={project.no}><div className="project-media"><span className="asset-label">需要素材<br /><b>{project.asset}</b></span><span className="project-no">{project.no}</span></div><div className="project-info"><div><h3>{project.title}</h3><p>{project.en}</p></div><div><span>{project.type}</span><span>{project.year}</span></div><ArrowUpRight className="project-arrow" size={20} /></div></a>)}</div></section>
    <section className="case flagship" id="project-01"><SectionTitle index="02" title="SUPOR / 苏泊尔" subtitle="旗舰案例预览 · 用统一的视觉系统，让多主题、多信息的节日传播保持清晰与品牌一致。" /><div className="case-meta"><p><b>Challenge</b>在密集的促销信息与节日氛围之间建立秩序，同时维持系列海报的整体识别。</p><p><b>Role</b>视觉概念 / 版式系统 / 海报执行 / 延展落地</p><a href="/projects/supor">View project <ArrowUpRight size={15} /></a></div><div className="poster-grid"><MediaSlot label="苏泊尔主海报图" note="竖版主视觉 / 核心概念" ratio="portrait" /><MediaSlot label="系列海报图" note="节日主题海报 01—04" ratio="portrait" /><MediaSlot label="系列海报图" note="节日主题海报 05—08" ratio="portrait" /></div><MediaSlot label="苏泊尔应用场景图" note="建议：线下物料、商场灯箱或社交媒体应用合成" ratio="wide" /></section>
    <section className="case split" id="project-02"><div><SectionTitle index="03" title="MANLONG / 曼龙" /><h3>让插画成为儿童产品的想象入口，而不只是表面装饰。</h3><p>从帐篷形态、观看距离与印刷工艺出发，建立既有童趣又保持克制的插画叙事。</p><a className="text-link" href="/projects/manlong">Explore case <ArrowUpRight size={15} /></a></div><div className="stack"><MediaSlot label="帐篷产品图" note="完整产品 / 使用场景" ratio="square" /><MediaSlot label="插画细节图" note="图案局部 / 线稿过程" ratio="landscape" /></div></section>
    <section className="case packaging" id="project-03"><SectionTitle index="04" title="Goat Milk / 羊奶粉包装" subtitle="以清晰的信息层级和有温度的品牌语言，建立可信赖的高端母婴产品形象。" /><div className="package-grid"><MediaSlot label="包装产品图" note="4 款正面包装 / 统一拍摄" ratio="portrait" /><MediaSlot label="包装系列图" note="侧面信息 / 系列陈列" ratio="portrait" /><MediaSlot label="包装应用场景图" note="货架或生活方式场景" ratio="portrait" /></div><div className="caption-row"><p>信息架构<br /><span>卖点、品类与规格的阅读优先级</span></p><p>视觉系统<br /><span>色彩、插画与版式的系列化规则</span></p><p>商业落地<br /><span>从屏幕设计到印刷工艺的执行</span></p></div></section>
    <section className="case animation" id="project-04"><SectionTitle index="05" title="Animation Art" subtitle="动画美术精选 · 从风格设定到关键画面，用视觉世界支撑叙事。" /><MediaSlot label="动画视频" note="Showreel / 60—90 秒，进入视口后显示播放提示" ratio="wide" dark play /><div className="frames"><MediaSlot label="动画关键帧" note="场景设定 / 色彩脚本" ratio="landscape" dark /><MediaSlot label="动画关键帧" note="角色与道具美术" ratio="landscape" dark /></div></section>
    <section className="case digital" id="project-05"><SectionTitle index="06" title="Digital Experiences" subtitle="网站项目精选 · 把品牌个性转译为结构清晰、易于浏览的数字体验。" /><div className="digital-grid"><MediaSlot label="网站界面图" note="桌面端首页 / 长页面截图" ratio="landscape" /><MediaSlot label="设备场景图" note="桌面端 + 移动端组合" ratio="landscape" /></div></section>
    <section className="services"><SectionTitle index="07" title="Capabilities" /><div className="service-list"><div><span>01</span><h3>Brand Visual</h3><p>品牌视觉方向、Campaign、海报与传播延展</p></div><div><span>02</span><h3>Packaging</h3><p>包装视觉、系列化规则、印刷与落地协作</p></div><div><span>03</span><h3>Illustration</h3><p>商业插画、产品图案、视觉叙事与风格设定</p></div><div><span>04</span><h3>Art Direction</h3><p>动画美术、数字体验与跨媒介视觉统一</p></div></div></section>
    <section className="about" id="about"><SectionTitle index="08" title="About" /><div className="about-copy"><h2 data-cms-key="home.about.title">审美成熟，<br />但不止于好看。</h2><p data-cms-key="home.about.p1">我是一名专注于消费品牌与视觉叙事的平面设计师。擅长从复杂需求中找到清晰秩序，并把概念可靠地推进到最终交付。</p><p data-cms-key="home.about.p2">服务于品牌团队、创意机构与有明确愿景的创业公司，覆盖包装、海报、插画、动画美术与数字设计。</p></div><MediaSlot label="设计师肖像 / 工作照" note="自然、克制、有创作环境感的人像" ratio="portrait" cmsKey="home.about.media" /></section>
    <section className="project-index" id="index"><div className="index-head"><SectionTitle index="09" title="Project Index" /><span>Selected archive / 2022—2026</span></div>{projects.map((p) => <a href={`/projects/${p.slug}`} key={p.no}><span>{p.no}</span><h3>{p.title}</h3><p>{p.type}</p><time>{p.year}</time><ArrowUpRight size={18} /></a>)}</section>
    <footer id="contact"><p>有一个值得被清晰表达的项目？</p><a href="mailto:hello@zoey.design"><span data-cms-key="home.contact.title">Let’s make it visible.</span><ArrowUpRight size={38} /></a><div className="footer-meta"><span>hello@zoey.design</span><span>Shanghai / Available worldwide</span><span>© 2026 Zoey Portfolio</span><a href="#top">Back to top <ArrowDown className="rotate-180" size={14} /></a></div></footer>
  </main>;
}
