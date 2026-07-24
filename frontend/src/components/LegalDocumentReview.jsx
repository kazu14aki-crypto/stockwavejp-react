import { useEffect, useMemo, useRef, useState } from 'react'

export default function LegalDocumentReview({
  documents,
  title,
  description,
  completeLabel,
  completingLabel,
  cancelLabel,
  onComplete,
  onCancel,
  saving=false,
  error='',
}) {
  const [activeIndex,setActiveIndex]=useState(0)
  const [read,setRead]=useState(()=>documents.map(()=>false))
  const [checked,setChecked]=useState(()=>documents.map(()=>false))
  const scrollRef=useRef(null)

  useEffect(()=>{
    setRead(documents.map(()=>false))
    setChecked(documents.map(()=>false))
    setActiveIndex(0)
  },[documents.length])

  useEffect(()=>{
    const node=scrollRef.current
    if(!node)return
    node.scrollTop=0
    const id=requestAnimationFrame(()=>{
      if(node.scrollHeight<=node.clientHeight+8){
        setRead(prev=>prev.map((v,i)=>i===activeIndex?true:v))
      }
    })
    return()=>cancelAnimationFrame(id)
  },[activeIndex])

  const allChecked=checked.every(Boolean)
  const progress=checked.filter(Boolean).length
  const ActiveComponent=documents[activeIndex]?.component

  const markRead=event=>{
    const node=event.currentTarget
    if(node.scrollTop+node.clientHeight>=node.scrollHeight-10){
      setRead(prev=>prev.map((v,i)=>i===activeIndex?true:v))
    }
  }

  const confirmDocument=()=>{
    if(!read[activeIndex])return
    setChecked(prev=>prev.map((v,i)=>i===activeIndex?true:v))
    if(activeIndex<documents.length-1)setActiveIndex(activeIndex+1)
  }

  return <div style={{position:'fixed',inset:0,zIndex:7000,display:'grid',placeItems:'center',padding:'14px',background:'rgba(3,7,15,.88)',backdropFilter:'blur(7px)'}}>
    <div role="dialog" aria-modal="true" style={{width:'min(900px,100%)',maxHeight:'94vh',display:'flex',flexDirection:'column',background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:'14px',overflow:'hidden',boxShadow:'0 24px 80px rgba(0,0,0,.45)'}}>
      <div style={{padding:'18px 20px 12px',borderBottom:'1px solid var(--border)'}}>
        <h2 style={{margin:0,fontSize:'20px',color:'var(--text)'}}>{title}</h2>
        <p style={{margin:'7px 0 0',fontSize:'12px',lineHeight:1.7,color:'var(--text2)'}}>{description}</p>
        <div style={{marginTop:'10px',fontSize:'11px',color:'var(--text3)'}}>{progress} / {documents.length}</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'minmax(150px,210px) minmax(0,1fr)',minHeight:0,flex:1}} className="legal-review-layout">
        <div style={{padding:'12px',borderRight:'1px solid var(--border)',overflowY:'auto'}}>
          {documents.map((doc,index)=><button key={doc.key} type="button" onClick={()=>setActiveIndex(index)} style={{width:'100%',display:'flex',alignItems:'center',gap:'8px',padding:'10px',marginBottom:'6px',borderRadius:'8px',border:activeIndex===index?'1px solid var(--accent)':'1px solid var(--border)',background:activeIndex===index?'rgba(74,158,255,.12)':'var(--bg3)',color:activeIndex===index?'var(--accent)':'var(--text2)',fontFamily:'var(--font)',fontSize:'12px',fontWeight:700,textAlign:'left',cursor:'pointer'}}><span>{checked[index]?'✅':read[index]?'◻️':'📄'}</span><span>{doc.label}</span></button>)}
        </div>
        <div style={{minWidth:0,minHeight:0,display:'flex',flexDirection:'column',padding:'12px'}}>
          <div ref={scrollRef} onScroll={markRead} style={{height:'min(58vh,620px)',overflowY:'auto',overscrollBehavior:'contain',border:'1px solid var(--border)',borderRadius:'10px',background:'var(--bg)',scrollbarGutter:'stable'}}>
            {ActiveComponent&&<ActiveComponent/>}
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'10px',marginTop:'10px',flexWrap:'wrap'}}>
            <span style={{fontSize:'11px',color:read[activeIndex]?'#3ddc84':'var(--text3)'}}>{read[activeIndex]?documents[activeIndex].readMessage:documents[activeIndex].scrollMessage}</span>
            <button type="button" disabled={!read[activeIndex]||checked[activeIndex]} onClick={confirmDocument} style={{padding:'9px 13px',borderRadius:'7px',border:'1px solid '+(read[activeIndex]?'var(--accent)':'var(--border)'),background:read[activeIndex]?'rgba(74,158,255,.12)':'var(--bg3)',color:read[activeIndex]?'var(--accent)':'var(--text3)',fontWeight:700,cursor:read[activeIndex]?'pointer':'not-allowed'}}>{checked[activeIndex]?documents[activeIndex].checkedLabel:documents[activeIndex].checkLabel}</button>
          </div>
        </div>
      </div>
      {error&&<div style={{padding:'0 20px 8px',fontSize:'11px',color:'#ff647c'}}>{error}</div>}
      <div style={{display:'flex',gap:'8px',padding:'12px 20px 18px',borderTop:'1px solid var(--border)'}}>
        {onCancel&&<button type="button" onClick={onCancel} disabled={saving} style={{flex:1,padding:'10px',borderRadius:'8px',border:'1px solid var(--border)',background:'var(--bg3)',color:'var(--text2)',cursor:'pointer'}}>{cancelLabel}</button>}
        <button type="button" disabled={!allChecked||saving} onClick={onComplete} style={{flex:2,padding:'10px',borderRadius:'8px',border:0,background:allChecked?'var(--accent)':'var(--bg3)',color:allChecked?'#fff':'var(--text3)',fontWeight:700,cursor:allChecked&&!saving?'pointer':'not-allowed'}}>{saving?completingLabel:completeLabel}</button>
      </div>
      <style>{`@media(max-width:680px){.legal-review-layout{grid-template-columns:1fr!important}.legal-review-layout>div:first-child{display:flex;gap:5px;overflow-x:auto;border-right:0!important;border-bottom:1px solid var(--border)}.legal-review-layout>div:first-child button{min-width:145px;margin-bottom:0!important}.legal-review-layout>div:last-child>div:first-child{height:52vh!important}}`}</style>
    </div>
  </div>
}
