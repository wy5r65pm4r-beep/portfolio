'use client';
import { useEffect, useRef, useState } from 'react';
import './gallery-home.css';
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const projects = [['supor','SUPOR Festival Visual Campaign'],['manlong','MANLONG Tent Illustration'],['goat-milk','Goat Milk Packaging'],['animation-art','Animation Art Direction'],['digital-works','Selected Digital Works']];
const groups = [
  {p:0,s:[1,1]}, {p:0,s:[1,1,1]}, {p:1,s:[1,1]},
  {p:0,s:[1,1.9,.8]}, {p:2,s:[1,1,1]}, {p:1,s:[1,1]},
  {p:3,s:[1,1]}, {p:3,s:[1,1]}, {p:2,s:[1,1]},
  {p:4,s:[1.5,1]}, {p:4,s:[1,1]}, {p:3,s:[1,1]},
];
export default function Home(){
  const [light,setLight]=useState(false);
  const [panel,setPanel]=useState<'about'|'index'|'menu'|null>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{try{setLight(localStorage.getItem('portfolio-theme')==='light');}catch{}},[]);
  useEffect(()=>{document.documentElement.classList.toggle('dark-theme',!light);},[light]);
  useEffect(()=>{if(!panel)return;dialog.current?.showModal();const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=old;};},[panel]);
  function toggle(){setLight(!light);try{localStorage.setItem('portfolio-theme',light?'dark':'light');}catch{}}
  return <main className={`gallery-home${light?' gallery-light':''}`} id="top">
    <header className="gallery-header"><a href="#top">ZOEY <span>Visual Designer</span></a><nav aria-label="主导航"><button onClick={()=>setPanel('about')}>ABOUT</button><button onClick={()=>setPanel('index')}>INDEX</button><button onClick={()=>setPanel('menu')}>MENU</button></nav></header>
    <section className="gallery-heading" aria-label="作品集 2026"><h1>PORTFOLIO</h1><span>2026</span></section>
    <section className="gallery-grid" id="works" aria-label="精选作品">{groups.map((group,i)=>{const [slug,name]=projects[group.p];return <a className={`gallery-work position-${i}`} href={`${base}/projects/${slug}/`} key={i} aria-label={`查看 ${name}`}><div className="gallery-images" style={{gridTemplateColumns:group.s.map(s=>`${s}fr`).join(' ')}}>{group.s.map((_,j)=><div className="gallery-placeholder" key={j} role="img" aria-label={`${name} 展示图 ${j+1} 待替换`} data-cms-key={`home.gallery.${i+1}.${j+1}`} data-cms-label={`${name} 展示图 ${j+1}`}/>)}</div><h2>{name}</h2></a>;})}</section>
    <button className="gallery-theme" onClick={toggle} aria-label={light?'切换为黑色背景':'切换为浅色背景'} aria-pressed={light}>{light?'◐':'◑'}</button>
    {panel&&<dialog ref={dialog} className="gallery-dialog" onCancel={()=>setPanel(null)} onClose={()=>setPanel(null)} onClick={e=>{if(e.target===e.currentTarget)setPanel(null);}} aria-labelledby="panel-title"><button className="gallery-close" autoFocus onClick={()=>setPanel(null)} aria-label="关闭">CLOSE ×</button><h2 id="panel-title">{panel.toUpperCase()}</h2>{panel==='about'?<div className="gallery-about"><p data-cms-key="home.about.title">审美成熟，但不止于好看。</p><p data-cms-key="home.about.p1">我是一名专注于消费品牌与视觉叙事的平面设计师。擅长从复杂需求中找到清晰秩序，并把概念可靠地推进到最终交付。</p><p data-cms-key="home.about.p2">品牌视觉 / 包装 / 插画 / 动画美术 / 数字设计</p></div>:<nav aria-label="项目导航">{panel==='menu'&&<><a href="#works" onClick={()=>setPanel(null)}>Selected Works ↗</a><button onClick={()=>setPanel('about')}>About ↗</button></>}{projects.map(([slug,name],i)=><a href={`${base}/projects/${slug}/`} key={slug}><small>0{i+1}</small>{name} ↗</a>)}</nav>}</dialog>}
  </main>;
}
