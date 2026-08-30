'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, ExternalLink, ImagePlus, LoaderCircle, RotateCcw, Save, Search, Upload, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cmsFields, cmsGroups } from '@/lib/cms-fields';

type SavedItem = { content_key:string; kind:'text'|'image'|'video'; text_value:string|null; filename:string|null; updated_at:string };

export default function AdminPage() {
  const [items,setItems] = useState<Record<string,SavedItem>>({}); const [drafts,setDrafts] = useState<Record<string,string>>({});
  const [group,setGroup] = useState(cmsGroups[0]); const [query,setQuery] = useState(''); const [busy,setBusy] = useState<string|null>('loading'); const [notice,setNotice] = useState('');
  const load = async () => { const data = await fetch('/api/content').then(r=>r.json()); const map = Object.fromEntries((data.items as SavedItem[]).map(item=>[item.content_key,item])); setItems(map); setDrafts(Object.fromEntries(cmsFields.filter(f=>f.type!=='media').map(f=>[f.key,map[f.key]?.text_value ?? f.defaultValue ?? '']))); setBusy(null); };
  useEffect(()=>{ load().catch(()=>{setBusy(null);setNotice('内容读取失败，请刷新重试。')}); },[]);
  const visible = useMemo(()=>cmsFields.filter(field=>field.group===group && (`${field.label} ${field.key}`).toLowerCase().includes(query.toLowerCase())),[group,query]);
  const saveText = async (key:string) => { setBusy(key); const response=await fetch('/api/content',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key,value:drafts[key]??''})}); if(!response.ok) throw new Error(); await load(); setNotice('文字已保存，前台刷新后生效。'); };
  const uploadMedia = async (key:string,file:File) => { setBusy(key); const form=new FormData(); form.set('key',key); form.set('file',file); const response=await fetch('/api/media',{method:'POST',body:form}); if(!response.ok) throw new Error(); await load(); setNotice('媒体已上传并替换。'); };
  const reset = async (key:string) => { setBusy(key); await fetch(`/api/content?key=${encodeURIComponent(key)}`,{method:'DELETE'}); await load(); setNotice('已恢复网站默认内容。'); };
  return <main className="admin-shell">
    <aside className="admin-sidebar"><div className="admin-logo"><b>ZOEY</b><span>Portfolio CMS</span></div><a href="/" className="admin-back"><ArrowLeft size={15}/> 返回网站</a><nav>{cmsGroups.map(item=><button key={item} className={item===group?'active':''} onClick={()=>setGroup(item)}>{item}<span>{cmsFields.filter(f=>f.group===item).length}</span></button>)}</nav></aside>
    <section className="admin-main"><header className="admin-top"><div><span>CONTENT MANAGEMENT</span><h1>{group}</h1></div><a href="/" target="_blank">查看前台 <ExternalLink size={14}/></a></header>
      <div className="admin-toolbar"><div><Search size={15}/><Input value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索字段" /></div><p>{notice || '修改会持久保存；前台刷新后显示最新内容。'}</p></div>
      {busy==='loading'?<div className="admin-loading"><LoaderCircle className="spin"/> 正在读取内容…</div>:<div className="admin-fields">{visible.map(field=><article className="admin-field" key={field.key}><div className="admin-field-head"><div><span>{field.type==='media'?<ImagePlus size={15}/>:<Check size={15}/>}</span><div><h2>{field.label}</h2><code>{field.key}</code></div></div>{items[field.key]&&<Button variant="ghost" size="sm" onClick={()=>reset(field.key)}><RotateCcw/> 恢复默认</Button>}</div>
        {field.type==='media'?<div className="admin-upload"><div className="admin-media-preview">{items[field.key]?<>{items[field.key].kind==='video'?<Video size={28}/>:<ImagePlus size={28}/>}<b>{items[field.key].filename}</b><small>已于 {new Date(items[field.key].updated_at).toLocaleString('zh-CN')} 更新</small></>:<><Upload size={28}/><b>尚未上传媒体</b><small>选择图片或视频替换前台占位符</small></>}</div><label className="admin-upload-button"><Upload size={15}/>{busy===field.key?'上传中…':'选择文件'}<input type="file" accept={field.accept} disabled={busy===field.key} onChange={e=>{const file=e.target.files?.[0];if(file)uploadMedia(field.key,file).catch(()=>setNotice('上传失败，请检查文件后重试。'))}}/></label></div>:<div className="admin-text-edit">{field.type==='longtext'?<Textarea rows={5} value={drafts[field.key]??''} onChange={e=>setDrafts({...drafts,[field.key]:e.target.value})}/>:<Input value={drafts[field.key]??''} onChange={e=>setDrafts({...drafts,[field.key]:e.target.value})}/>}<Button onClick={()=>saveText(field.key).catch(()=>setNotice('保存失败，请重试。'))} disabled={busy===field.key}>{busy===field.key?<LoaderCircle className="spin"/>:<Save/>} 保存文字</Button></div>}
      </article>)}</div>}
    </section>
  </main>;
}
