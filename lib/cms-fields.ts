import { portfolioProjects } from '@/lib/project-data';

export type CmsField = { key: string; label: string; group: string; type: 'text' | 'longtext' | 'media'; defaultValue?: string; accept?: string };

const homeFields: CmsField[] = [
  { key:'home.hero.title', label:'首页主标题', group:'首页 / 首屏', type:'longtext', defaultValue:'把复杂的商业信息，转化为清晰而有记忆点的视觉。' },
  { key:'home.hero.subtitle', label:'首页英文定位', group:'首页 / 首屏', type:'longtext', defaultValue:'Visual design, illustration & art direction for ambitious consumer brands.' },
  { key:'home.hero.media', label:'首页主视觉', group:'首页 / 首屏', type:'media', accept:'image/*,video/*' },
  { key:'home.about.title', label:'About 标题', group:'首页 / About', type:'text', defaultValue:'审美成熟，但不止于好看。' },
  { key:'home.about.p1', label:'About 介绍 01', group:'首页 / About', type:'longtext', defaultValue:'我是一名专注于消费品牌与视觉叙事的平面设计师。擅长从复杂需求中找到清晰秩序，并把概念可靠地推进到最终交付。' },
  { key:'home.about.p2', label:'About 介绍 02', group:'首页 / About', type:'longtext', defaultValue:'服务于品牌团队、创意机构与有明确愿景的创业公司，覆盖包装、海报、插画、动画美术与数字设计。' },
  { key:'home.about.media', label:'设计师肖像 / 工作照', group:'首页 / About', type:'media', accept:'image/*' },
  { key:'home.contact.title', label:'联系区标题', group:'首页 / Contact', type:'text', defaultValue:'Let’s make it visible.' },
];

const projectFields = portfolioProjects.flatMap<CmsField>((project) => {
  const group = `${project.no} / ${project.title}`;
  return [
    { key:`project.${project.slug}.title`, label:'项目标题', group, type:'text', defaultValue:project.title },
    { key:`project.${project.slug}.headline`, label:'项目核心描述', group, type:'longtext', defaultValue:project.headline },
    { key:`project.${project.slug}.intro`, label:'项目简介', group, type:'longtext', defaultValue:project.intro },
    { key:`project.${project.slug}.challenge`, label:'Challenge', group, type:'longtext', defaultValue:project.challenge },
    { key:`project.${project.slug}.strategy`, label:'Strategy', group, type:'longtext', defaultValue:project.strategy },
    { key:`project.${project.slug}.role`, label:'Role', group, type:'longtext', defaultValue:project.role },
    ...project.gallery.map((label, index) => ({ key:`project.${project.slug}.media.${index}`, label:`展示媒体 ${String(index + 1).padStart(2,'0')} · ${label}`, group, type:'media' as const, accept:'image/*,video/*' })),
  ];
});

export const cmsFields = [...homeFields, ...projectFields];
export const cmsGroups = Array.from(new Set(cmsFields.map((field) => field.group)));
