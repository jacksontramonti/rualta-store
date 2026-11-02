import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect,useState } from 'react';
export default function Gallery({images=[],width='100%',height='auto',radius='20px',showThumbs=false,className='',variant='product',onChange}){
 const [active,setActive]=useState(0);
 useEffect(()=>setActive(0),[images?.[0]?.src]);
 if(!images.length)return null;
 const current=images[Math.min(active,images.length-1)];const isHero=variant==='hero';
 const go=(index)=>{setActive(index);onChange?.(index);};
 return <div className={`gallery gallery--${variant} ${className}`} style={{width,maxWidth:'100%'}}><div className="gallery-stage" style={{height,borderRadius:radius}}><img src={current.src} alt={current.alt||`Foto do produto ${active+1}`} className="gallery-picture"/>
 <button className="gallery-arrow gallery-prev" type="button" disabled={active===0} onClick={()=>go(active-1)} aria-label="Imagem anterior"><ChevronLeft size={24}/></button>
 <button className="gallery-arrow gallery-next" type="button" disabled={active===images.length-1} onClick={()=>go(active+1)} aria-label="Próxima imagem"><ChevronRight size={24}/></button>
 {isHero&&<div className="hero-image-count"><strong>{String(active+1).padStart(2,'0')}</strong><span> / {String(images.length).padStart(2,'0')}</span></div>}</div>
 {showThumbs&&<div className="gallery-thumbnails">{images.map((img,index)=><button type="button" key={img.src} onClick={()=>go(index)} className={`thumb ${index===active?'thumb--active':''}`} aria-label={`Ver foto ${index+1}`} aria-pressed={index===active}><img src={img.src} alt={img.alt||`Miniatura ${index+1}`}/></button>)}</div>}</div>;
}
