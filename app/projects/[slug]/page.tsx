import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { getProject, portfolioProjects } from '@/lib/project-data';

const siteBase = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function generateStaticParams() { return portfolioProjects.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const project = getProject(slug);
  if (!project) return { title: 'Project not found' };
  return { title: `${project.title} — Zoey`, description: project.intro };
}

function DetailSlot({ label, index, shape = 'wide', accent, cmsKey }: { label: string; index: number; shape?: 'wide' | 'portrait' | 'square'; accent: string; cmsKey: string }) {
  return <div className={`detail-slot ${shape} ${accent}`} data-cms-key={cmsKey} data-cms-label={label}><span className="detail-slot-no">{String(index + 1).padStart(2, '0')}</span><div><strong>{label}</strong><small>需要素材 / 建议使用高清项目展示图</small></div><span className="detail-slot-type">IMAGE / VIDEO PLACEHOLDER</span></div>;
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const project = getProject(slug); if (!project) notFound();
  const currentIndex = portfolioProjects.findIndex((item) => item.slug === slug);
  const next = portfolioProjects[(currentIndex + 1) % portfolioProjects.length];
  return <main className="detail-page" id="top">
    <ThemeToggle />
    <header className="detail-header"><a href={`${siteBase}/`} className="brand">ZOEY <span>Visual Designer</span></a><a href={`${siteBase}/#works`} className="detail-back"><ArrowLeft size={15} /> All projects</a><span>{project.no} / 05</span></header>
    <section className="detail-hero"><div className="detail-eyebrow"><span>{project.category}</span><span>{project.year}</span></div><h1>{project.en}<br /><em data-cms-key={`project.${project.slug}.title`}>{project.title}</em></h1><p data-cms-key={`project.${project.slug}.headline`}>{project.headline}</p></section>
    <DetailSlot label={`${project.title} · 项目主视觉`} index={0} shape="wide" accent={project.accent} cmsKey={`project.${project.slug}.media.0`} />
    <section className="detail-overview"><div><span>Overview</span><p data-cms-key={`project.${project.slug}.intro`}>{project.intro}</p></div><div><span>Challenge</span><p data-cms-key={`project.${project.slug}.challenge`}>{project.challenge}</p></div><div><span>Strategy</span><p data-cms-key={`project.${project.slug}.strategy`}>{project.strategy}</p></div><div><span>Role</span><p data-cms-key={`project.${project.slug}.role`}>{project.role}</p></div></section>
    <section className="detail-gallery">
      <div className="detail-chapter"><span>01</span><h2>Context & Direction</h2><p>项目背景、视觉策略与概念探索</p></div>
      <div className="detail-pair"><DetailSlot label={project.gallery[1]} index={1} shape="square" accent={project.accent} cmsKey={`project.${project.slug}.media.1`} /><DetailSlot label={project.gallery[2]} index={2} shape="portrait" accent={project.accent} cmsKey={`project.${project.slug}.media.2`} /></div>
      <DetailSlot label={project.gallery[3]} index={3} shape="wide" accent={project.accent} cmsKey={`project.${project.slug}.media.3`} />
      <div className="detail-chapter"><span>02</span><h2>System & Process</h2><p>从设计规则到可执行的视觉系统</p></div>
      <div className="detail-pair reverse"><DetailSlot label={project.gallery[4]} index={4} shape="portrait" accent={project.accent} cmsKey={`project.${project.slug}.media.4`} /><DetailSlot label={project.gallery[5]} index={5} shape="square" accent={project.accent} cmsKey={`project.${project.slug}.media.5`} /></div>
      <DetailSlot label={project.gallery[6]} index={6} shape="wide" accent={project.accent} cmsKey={`project.${project.slug}.media.6`} />
      <div className="detail-chapter"><span>03</span><h2>Selected Outputs</h2><p>系列成果与关键视觉细节</p></div>
      <div className="detail-trio">{project.gallery.slice(7,10).map((label,i) => <DetailSlot key={label} label={label} index={i+7} shape="portrait" accent={project.accent} cmsKey={`project.${project.slug}.media.${i+7}`} />)}</div>
      <div className="detail-pair">{project.gallery.slice(10,12).map((label,i) => <DetailSlot key={label} label={label} index={i+10} shape="square" accent={project.accent} cmsKey={`project.${project.slug}.media.${i+10}`} />)}</div>
      <div className="detail-chapter"><span>04</span><h2>In Application</h2><p>最终落地、应用场景与项目成果</p></div>
      {project.gallery.slice(12).map((label,i) => <DetailSlot key={label} label={label} index={i+12} shape="wide" accent={project.accent} cmsKey={`project.${project.slug}.media.${i+12}`} />)}
    </section>
    <section className="detail-next"><span>Next project</span><a href={`${siteBase}/projects/${next.slug}/`}><small>{next.no} / {next.category}</small>{next.title}<ArrowRight size={34} /></a></section>
    <footer className="detail-footer"><span>© 2026 Zoey Portfolio</span><a href="#top">Back to top <ArrowUp size={14} /></a></footer>
  </main>;
}
