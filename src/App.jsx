import { useState, useEffect, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import {
  LayoutDashboard, Building2, CalendarDays, PenSquare, BarChart3, Settings2,
  Plus, Instagram, Facebook, Twitter, Linkedin, Sparkles, Clock, CheckCircle2,
  Eye, Heart, MessageCircle, TrendingUp, Users, Bell, ChevronDown, Loader2,
  ChevronLeft, ChevronRight, Send, Hash, LogOut, RefreshCw, Copy, Check,
  Menu, MoreHorizontal, ArrowUpRight, Share2, Star, Image as ImageIcon,
  Trash2, Pencil, X, AlertTriangle, CheckSquare, Zap, Globe, Filter,
  Search, Download, Upload, ToggleLeft, ToggleRight
} from "lucide-react";

// ═══════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════
const C = {
  bg:       "#080c18", sidebar: "#0b1220", card:    "#0f1929",
  cardHov:  "#111e30", border:  "#1a2844", borderH: "rgba(201,168,76,0.3)",
  gold:     "#c9a84c", goldH:   "#b8952e", goldGlow:"rgba(201,168,76,0.15)",
  cyan:     "#06B6D4", green:   "#10B981", amber:   "#F59E0B",
  red:      "#EF4444", purple:  "#8B5CF6", pink:    "#EC4899",
  text:     "#eee8d5", sub:     "#7a8fa8", muted:   "#334155",
  dark:     "#070b15", overlay: "rgba(0,0,0,0.75)",
};

const PLATFORMS = {
  instagram: { name:"Instagram", short:"IG", color:"#E1306C", Icon:Instagram },
  facebook:  { name:"Facebook",  short:"FB", color:"#1877F2", Icon:Facebook  },
  twitter:   { name:"X/Twitter", short:"X",  color:"#1DA1F2", Icon:Twitter   },
  linkedin:  { name:"LinkedIn",  short:"LI", color:"#0A66C2", Icon:Linkedin  },
};

const NAV = [
  { id:"dashboard", label:"Dashboard",       Icon:LayoutDashboard },
  { id:"stores",    label:"My Stores",        Icon:Building2       },
  { id:"calendar",  label:"Content Calendar", Icon:CalendarDays    },
  { id:"create",    label:"Create Post",      Icon:PenSquare       },
  { id:"analytics", label:"Analytics",        Icon:BarChart3       },
  { id:"settings",  label:"Settings",         Icon:Settings2       },
];

const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];
const TONES  = ["engaging","professional","funny","promotional","informative","inspirational"];
const STATUS_MAP = {
  published:{ label:"Published", bg:`${C.green}18`,  color:C.green,  bd:`${C.green}50`  },
  scheduled: { label:"Scheduled", bg:`${C.amber}18`,  color:C.amber,  bd:`${C.amber}50`  },
  draft:     { label:"Draft",     bg:`${C.sub}18`,    color:C.sub,    bd:`${C.sub}50`    },
};

// ═══════════════════════════════════════
// INITIAL DATA
// ═══════════════════════════════════════
const INIT_STORES = [
  { id:1, name:"Fashion Hub",   category:"Fashion & Clothing",  city:"Indore", color:"#c9a84c", avatar:"FH", platforms:["instagram","facebook"], followers:12400, engagement:4.2 },
  { id:2, name:"Tech Corner",   category:"Electronics",          city:"Bhopal", color:"#06B6D4", avatar:"TC", platforms:["instagram","twitter","linkedin"], followers:8900, engagement:3.8 },
  { id:3, name:"Foodie Palace", category:"Restaurant & Food",   city:"Indore", color:"#10B981", avatar:"FP", platforms:["instagram","facebook"], followers:23100, engagement:6.1 },
];

const INIT_POSTS = [
  { id:1, storeId:1, platform:"instagram", caption:"New summer collection is here! ☀️ Check out our latest arrivals — styles that speak for themselves.", hashtags:"#fashion #summer #newcollection #style", status:"published", date:"2025-04-28", likes:342, comments:28, reach:4200 },
  { id:2, storeId:1, platform:"facebook",  caption:"Weekend SALE! 🎉 30% off on all items. Don't miss this limited offer. Visit us today!", hashtags:"#sale #weekend #discount", status:"published", date:"2025-04-27", likes:156, comments:12, reach:2100 },
  { id:3, storeId:1, platform:"instagram", caption:"Behind the scenes 🎬 Watch how our team curates the latest trends just for you!", hashtags:"#bts #fashion #behindthescenes", status:"scheduled", date:"2025-05-10", likes:0, comments:0, reach:0 },
  { id:4, storeId:1, platform:"facebook",  caption:"Customer spotlight! Thank you for your love 💖 Your support means everything to us.", hashtags:"#customercare #thankyou", status:"draft", date:"2025-05-15", likes:0, comments:0, reach:0 },
  { id:5, storeId:2, platform:"linkedin",  caption:"Exciting news! We just restocked our premium laptop lineup. Best prices in the city guaranteed.", hashtags:"#tech #laptops #electronics", status:"published", date:"2025-04-29", likes:89, comments:7, reach:1800 },
  { id:6, storeId:3, platform:"instagram", caption:"Sunday brunch is here 🍳🥑 Come enjoy our special menu. Reservations open now!", hashtags:"#brunch #food #restaurant", status:"published", date:"2025-04-30", likes:521, comments:44, reach:7300 },
];

// ═══════════════════════════════════════
// UTILS
// ═══════════════════════════════════════
const fmt = n => n>=1e6?(n/1e6).toFixed(1)+"M":n>=1000?(n/1000).toFixed(1)+"K":String(n||0);
const today = new Date();
const todayStr = today.toISOString().split("T")[0];

function loadLS(key, fallback) {
  try { const v=localStorage.getItem(key); return v?JSON.parse(v):fallback; }
  catch { return fallback; }
}
function saveLS(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ═══════════════════════════════════════
// TOAST SYSTEM
// ═══════════════════════════════════════
function Toast({ toasts, remove }) {
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", flexDirection:"column", gap:8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display:"flex", alignItems:"center", gap:10, padding:"12px 16px",
          borderRadius:12, minWidth:260, maxWidth:360,
          background: t.type==="success"?`${C.green}20`:t.type==="error"?`${C.red}20`:`${C.amber}20`,
          border:`0.5px solid ${t.type==="success"?C.green:t.type==="error"?C.red:C.amber}50`,
          backdropFilter:"blur(10px)", animation:"slideIn 0.2s ease",
        }}>
          {t.type==="success" && <CheckCircle2 size={16} color={C.green} />}
          {t.type==="error"   && <AlertTriangle size={16} color={C.red} />}
          {t.type==="info"    && <Zap size={16} color={C.amber} />}
          <span style={{ fontSize:13, color:C.text, flex:1 }}>{t.msg}</span>
          <button onClick={()=>remove(t.id)} style={{ background:"transparent",border:"none",cursor:"pointer",color:C.sub,padding:2 }}><X size={14}/></button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type="success") => {
    const id = Date.now();
    setToasts(p=>[...p,{id,msg,type}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)), 3500);
  },[]);
  const remove = useCallback(id=>setToasts(p=>p.filter(t=>t.id!==id)),[]);
  return { toasts, add, remove };
}

// ═══════════════════════════════════════
// CONFIRM DIALOG
// ═══════════════════════════════════════
function Confirm({ title, msg, onOk, onCancel, danger=true }) {
  return (
    <div style={{ position:"fixed",inset:0,background:C.overlay,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center" }} onClick={onCancel}>
      <div style={{ background:C.card,border:`0.5px solid ${C.border}`,borderRadius:16,padding:"1.5rem",maxWidth:380,width:"90%",margin:16 }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
          <div style={{ width:36,height:36,borderRadius:10,background:`${C.red}18`,display:"flex",alignItems:"center",justifyContent:"center" }}>
            <AlertTriangle size={18} color={C.red}/>
          </div>
          <div style={{ fontSize:15,fontWeight:600,color:C.text }}>{title}</div>
        </div>
        <div style={{ fontSize:13,color:C.sub,marginBottom:20,lineHeight:1.6 }}>{msg}</div>
        <div style={{ display:"flex",gap:10,justifyContent:"flex-end" }}>
          <Btn v="ghost" onClick={onCancel}>Cancel</Btn>
          <Btn v={danger?"danger":"primary"} onClick={onOk}>{danger?"Delete":"Confirm"}</Btn>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// BASE COMPONENTS
// ═══════════════════════════════════════
function Btn({ children, onClick, v="primary", style, disabled, loading, small }) {
  const [hov,setHov]=useState(false);
  const bg=v==="primary"?(hov?C.goldH:C.gold):v==="danger"?(hov?"#c0001e":C.red):v==="ghost"?(hov?`${C.muted}50`:"transparent"):(hov?C.cardHov:C.card);
  const clr=v==="primary"?C.dark:v==="danger"?"#fff":C.text;
  const bd=v==="primary"?C.gold:v==="danger"?C.red:C.border;
  return (
    <button disabled={disabled||loading} onClick={onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:"inline-flex",alignItems:"center",gap:6,
        padding:small?"5px 10px":"8px 16px",borderRadius:9,fontSize:small?11:13,fontWeight:600,
        border:`0.5px solid ${bd}`,background:bg,color:clr,
        cursor:disabled?"not-allowed":"pointer",transition:"all 0.15s",
        opacity:disabled?0.45:1,letterSpacing:"0.2px",...style }}>
      {loading&&<Loader2 size={13} style={{animation:"spin 1s linear infinite"}}/>}
      {children}
    </button>
  );
}

function Input({ label, value, onChange, placeholder, type="text", rows, required, error }) {
  const shared = {
    width:"100%",background:C.dark,border:`0.5px solid ${error?C.red:C.border}`,
    borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,
    outline:"none",boxSizing:"border-box",fontFamily:"inherit",
  };
  return (
    <div>
      {label&&<label style={{fontSize:12,color:C.sub,display:"block",marginBottom:5,fontWeight:500}}>
        {label}{required&&<span style={{color:C.red,marginLeft:2}}>*</span>}
      </label>}
      {rows
        ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={{...shared,resize:"vertical",lineHeight:1.6,colorScheme:"dark"}}/>
        : <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{...shared,colorScheme:"dark"}}/>
      }
      {error&&<div style={{fontSize:11,color:C.red,marginTop:3}}>{error}</div>}
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      {label&&<label style={{fontSize:12,color:C.sub,display:"block",marginBottom:5,fontWeight:500}}>{label}</label>}
      <select value={value} onChange={onChange}
        style={{width:"100%",background:C.dark,border:`0.5px solid ${C.border}`,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,outline:"none",boxSizing:"border-box",colorScheme:"dark"}}>
        {options.map(o=><option key={o.v||o} value={o.v||o}>{o.l||o}</option>)}
      </select>
    </div>
  );
}

function Card({ children, style, onClick, hover }) {
  const [hov,setHov]=useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:hov&&hover?C.cardHov:C.card, border:`0.5px solid ${hov&&hover?C.borderH:C.border}`,
        borderRadius:16,transition:"all 0.2s",cursor:onClick?"pointer":"default",...style }}>
      {children}
    </div>
  );
}

function Badge({ status }) {
  const s=STATUS_MAP[status]||STATUS_MAP.draft;
  return <span style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:s.bg,color:s.color,border:`0.5px solid ${s.bd}`}}>{s.label}</span>;
}

function PlatBadge({ platform }) {
  const p=PLATFORMS[platform]; if(!p)return null;
  const I=p.Icon;
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:20,background:`${p.color}15`,border:`0.5px solid ${p.color}40`,fontSize:11,color:p.color}}>
      <I size={11}/>{p.name}
    </span>
  );
}

function StatCard({ label, value, sub, Icon, color, trend }) {
  return (
    <Card style={{padding:"1.25rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
        <div style={{width:38,height:38,borderRadius:10,background:`${color}18`,border:`0.5px solid ${color}30`,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Icon size={18} color={color}/>
        </div>
        {trend!==undefined&&(
          <span style={{display:"flex",alignItems:"center",gap:2,fontSize:12,color:trend>=0?C.green:C.red,fontWeight:500}}>
            <ArrowUpRight size={12} style={{transform:trend<0?"rotate(90deg)":""}}/>{Math.abs(trend)}%
          </span>
        )}
      </div>
      <div style={{fontSize:22,fontWeight:700,color:C.text,letterSpacing:"-0.5px",marginBottom:3,fontFamily:"'Cormorant Garamond',serif"}}>{value}</div>
      <div style={{fontSize:12,color:C.sub}}>{label}</div>
      {sub&&<div style={{fontSize:11,color:C.muted,marginTop:3}}>{sub}</div>}
    </Card>
  );
}

// ═══════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════
function Sidebar({ view, setView, store, setStore, stores, col, setCol }) {
  const [open,setOpen]=useState(false);
  return (
    <aside style={{width:col?68:232,minWidth:col?68:232,background:C.sidebar,borderRight:`0.5px solid ${C.border}`,display:"flex",flexDirection:"column",transition:"all 0.25s",position:"relative",zIndex:20}}>
      {/* Logo */}
      <div style={{padding:col?"18px 0":"18px 18px",borderBottom:`0.5px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:col?"center":"space-between"}}>
        {!col&&(
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:30,height:30,borderRadius:8,background:`linear-gradient(135deg,${C.gold},#7a5f28)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:13,fontWeight:700,color:C.dark,fontFamily:"serif"}}>✦</span>
            </div>
            <div>
              <span style={{fontSize:14,fontWeight:700,color:C.text,letterSpacing:"1.5px",fontFamily:"'Cormorant Garamond',serif"}}>RASAYA</span>
              <span style={{fontSize:10,color:C.gold,marginLeft:4,fontWeight:600,letterSpacing:"1px"}}>SOCIAL</span>
            </div>
          </div>
        )}
        {col&&<div style={{width:30,height:30,borderRadius:8,background:`linear-gradient(135deg,${C.gold},#7a5f28)`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:13,fontWeight:700,color:C.dark,fontFamily:"serif"}}>✦</span></div>}
        {!col&&<button onClick={()=>setCol(true)} style={{background:"transparent",border:"none",cursor:"pointer",color:C.sub,padding:3}}><ChevronLeft size={15}/></button>}
      </div>

      {/* Store picker */}
      {!col&&stores.length>0&&(
        <div style={{padding:"10px 10px 0"}}>
          <div onClick={()=>setOpen(!open)} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:10,cursor:"pointer",background:open?C.dark:"transparent",border:`0.5px solid ${open?C.borderH:C.border}`,transition:"all 0.15s"}}>
            <div style={{width:26,height:26,borderRadius:7,background:store?.color||C.gold,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:C.dark,flexShrink:0}}>{store?.avatar}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:500,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{store?.name}</div>
              <div style={{fontSize:10,color:C.sub}}>{store?.category}</div>
            </div>
            <ChevronDown size={13} color={C.sub} style={{transform:open?"rotate(180deg)":"",transition:"transform 0.2s",flexShrink:0}}/>
          </div>
          {open&&(
            <div style={{marginTop:4,background:C.card,border:`0.5px solid ${C.border}`,borderRadius:10,overflow:"hidden",zIndex:50,position:"relative"}}>
              {stores.map(s=>(
                <div key={s.id} onClick={()=>{setStore(s);setOpen(false);}}
                  style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",cursor:"pointer",background:s.id===store?.id?C.dark:"transparent"}}>
                  <div style={{width:20,height:20,borderRadius:5,background:s.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,color:C.dark}}>{s.avatar}</div>
                  <span style={{fontSize:12,color:s.id===store?.id?C.text:C.sub,flex:1}}>{s.name}</span>
                  {s.id===store?.id&&<Check size={11} color={C.gold}/>}
                </div>
              ))}
              <div style={{borderTop:`0.5px solid ${C.border}`,padding:"7px 10px"}}>
                <div onClick={()=>{setOpen(false);setView("stores");}} style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:C.gold,cursor:"pointer"}}>
                  <Plus size={11}/> New Store
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Nav */}
      <nav style={{flex:1,padding:col?"10px 8px":"10px 10px",display:"flex",flexDirection:"column",gap:2,marginTop:col?0:8}}>
        {NAV.map(({id,label,Icon})=>{
          const active=view===id;
          return (
            <button key={id} onClick={()=>setView(id)} title={col?label:""}
              style={{display:"flex",alignItems:"center",gap:9,padding:col?"9px 0":"8px 10px",borderRadius:9,border:"none",cursor:"pointer",
                background:active?`${C.gold}18`:"transparent",color:active?C.gold:C.sub,
                fontSize:12,fontWeight:active?600:400,transition:"all 0.15s",
                justifyContent:col?"center":"flex-start",width:"100%"}}>
              <Icon size={17}/>
              {!col&&label}
              {active&&!col&&<div style={{marginLeft:"auto",width:4,height:4,borderRadius:2,background:C.gold}}/>}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{padding:col?"10px 8px":"10px 10px",borderTop:`0.5px solid ${C.border}`}}>
        {col
          ? <div onClick={()=>setCol(false)} style={{display:"flex",justifyContent:"center",cursor:"pointer"}}><Menu size={16} color={C.sub}/></div>
          : <div style={{display:"flex",alignItems:"center",gap:9,padding:"7px 10px",borderRadius:9}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${C.gold},#7a5f28)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:C.dark,flexShrink:0}}>A</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:500,color:C.text}}>Admin</div>
                <div style={{fontSize:10,color:C.sub}}>admin@rasaya.in</div>
              </div>
              <LogOut size={13} color={C.muted}/>
            </div>
        }
      </div>
    </aside>
  );
}

// ═══════════════════════════════════════
// PAGE HEADER
// ═══════════════════════════════════════
function PageHeader({ title, sub, actions }) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
      <div>
        <h1 style={{fontSize:20,fontWeight:700,color:C.text,margin:0,fontFamily:"'Cormorant Garamond',serif"}}>{title}</h1>
        {sub&&<p style={{fontSize:12,color:C.sub,margin:"3px 0 0"}}>{sub}</p>}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {actions}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// STORE FORM MODAL
// ═══════════════════════════════════════
const COLORS=["#c9a84c","#06B6D4","#F59E0B","#10B981","#EF4444","#8B5CF6","#3B82F6","#F97316","#EC4899","#14B8A6"];
const CATEGORIES=["Fashion & Clothing","Electronics","Restaurant & Food","Beauty & Wellness","Home & Furniture","Sports & Fitness","Books & Education","Travel & Tourism","Health & Medical","Retail & General"];

function StoreModal({ initial, onSave, onClose, toast }) {
  const blank={name:"",category:"",city:"",color:COLORS[0],platforms:[]};
  const [f,setF]=useState(initial||blank);
  const [err,setErr]=useState({});

  function validate(){
    const e={};
    if(!f.name.trim())e.name="Store name required";
    if(!f.category)e.category="Category required";
    if(!f.city.trim())e.city="City required";
    if(f.platforms.length===0)e.platforms="Select at least 1 platform";
    setErr(e);
    return Object.keys(e).length===0;
  }

  function submit(){
    if(!validate())return;
    onSave({
      ...f,
      id:initial?.id||Date.now(),
      avatar:f.name.trim().slice(0,2).toUpperCase(),
      followers:initial?.followers||0,
      engagement:initial?.engagement||0,
    });
    toast(`Store "${f.name}" ${initial?"updated":"created"}!`);
    onClose();
  }

  const togglePlatform=k=>setF(p=>({...p,platforms:p.platforms.includes(k)?p.platforms.filter(x=>x!==k):[...p.platforms,k]}));

  return (
    <div style={{position:"fixed",inset:0,background:C.overlay,zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{background:C.card,border:`0.5px solid ${C.gold}40`,borderRadius:20,padding:"1.75rem",width:500,maxWidth:"95%",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontSize:18,fontWeight:700,color:C.text,fontFamily:"'Cormorant Garamond',serif"}}>{initial?"Edit Store":"Add New Store"}</div>
          <button onClick={onClose} style={{background:C.dark,border:`0.5px solid ${C.border}`,borderRadius:8,padding:6,cursor:"pointer",color:C.sub,display:"flex"}}><X size={15}/></button>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Input label="Store Name" value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))} placeholder="e.g. Fashion Hub" required error={err.name}/>

          <div>
            <label style={{fontSize:12,color:C.sub,display:"block",marginBottom:5,fontWeight:500}}>Category <span style={{color:C.red}}>*</span></label>
            <select value={f.category} onChange={e=>setF(p=>({...p,category:e.target.value}))}
              style={{width:"100%",background:C.dark,border:`0.5px solid ${err.category?C.red:C.border}`,borderRadius:8,padding:"9px 12px",color:f.category?C.text:C.muted,fontSize:13,outline:"none",boxSizing:"border-box",colorScheme:"dark"}}>
              <option value="">Select category...</option>
              {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            {err.category&&<div style={{fontSize:11,color:C.red,marginTop:3}}>{err.category}</div>}
          </div>

          <Input label="City" value={f.city} onChange={e=>setF(p=>({...p,city:e.target.value}))} placeholder="e.g. Indore" required error={err.city}/>

          <div>
            <label style={{fontSize:12,color:C.sub,display:"block",marginBottom:8,fontWeight:500}}>Brand Color</label>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {COLORS.map(c=>(
                <div key={c} onClick={()=>setF(p=>({...p,color:c}))}
                  style={{width:26,height:26,borderRadius:6,background:c,cursor:"pointer",border:`2.5px solid ${f.color===c?"#fff":"transparent"}`,boxSizing:"border-box",transition:"border 0.1s"}}/>
              ))}
            </div>
          </div>

          <div>
            <label style={{fontSize:12,color:C.sub,display:"block",marginBottom:8,fontWeight:500}}>Platforms <span style={{color:C.red}}>*</span></label>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {Object.entries(PLATFORMS).map(([k,p])=>{
                const active=f.platforms.includes(k);
                const PI=p.Icon;
                return (
                  <div key={k} onClick={()=>togglePlatform(k)}
                    style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:9,cursor:"pointer",
                      background:active?`${p.color}20`:C.dark,border:`1px solid ${active?p.color:C.border}`,
                      fontSize:13,color:active?p.color:C.sub,transition:"all 0.15s"}}>
                    <PI size={14}/>{p.name}
                  </div>
                );
              })}
            </div>
            {err.platforms&&<div style={{fontSize:11,color:C.red,marginTop:5}}>{err.platforms}</div>}
          </div>
        </div>

        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:20}}>
          <Btn v="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={submit}>{initial?"Update Store":"Create Store"}</Btn>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// POST FORM MODAL (Edit)
// ═══════════════════════════════════════
function PostModal({ post, onSave, onClose, toast }) {
  const [f,setF]=useState({...post});
  function submit(){
    if(!f.caption.trim()){return;}
    onSave(f);
    toast("Post updated successfully!");
    onClose();
  }
  return (
    <div style={{position:"fixed",inset:0,background:C.overlay,zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{background:C.card,border:`0.5px solid ${C.border}`,borderRadius:20,padding:"1.75rem",width:500,maxWidth:"95%",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontSize:17,fontWeight:700,color:C.text,fontFamily:"'Cormorant Garamond',serif"}}>Edit Post</div>
          <button onClick={onClose} style={{background:C.dark,border:`0.5px solid ${C.border}`,borderRadius:8,padding:6,cursor:"pointer",color:C.sub,display:"flex"}}><X size={15}/></button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div>
            <label style={{fontSize:12,color:C.sub,display:"block",marginBottom:5,fontWeight:500}}>Platform</label>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {Object.entries(PLATFORMS).map(([k,p])=>{
                const PI=p.Icon; const active=f.platform===k;
                return <div key={k} onClick={()=>setF(x=>({...x,platform:k}))}
                  style={{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:8,cursor:"pointer",background:active?`${p.color}20`:C.dark,border:`0.5px solid ${active?p.color:C.border}`,fontSize:12,color:active?p.color:C.sub}}>
                  <PI size={12}/>{p.name}</div>;
              })}
            </div>
          </div>
          <Input label="Caption" value={f.caption} onChange={e=>setF(x=>({...x,caption:e.target.value}))} placeholder="Post caption..." rows={4}/>
          <Input label="Hashtags" value={f.hashtags} onChange={e=>setF(x=>({...x,hashtags:e.target.value}))} placeholder="#tag1 #tag2 #tag3"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Input label="Date" type="date" value={f.date} onChange={e=>setF(x=>({...x,date:e.target.value}))}/>
            <Select label="Status" value={f.status} onChange={e=>setF(x=>({...x,status:e.target.value}))}
              options={[{v:"published",l:"Published"},{v:"scheduled",l:"Scheduled"},{v:"draft",l:"Draft"}]}/>
          </div>
          {f.status==="published"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              <Input label="Likes" type="number" value={String(f.likes||0)} onChange={e=>setF(x=>({...x,likes:parseInt(e.target.value)||0}))}/>
              <Input label="Comments" type="number" value={String(f.comments||0)} onChange={e=>setF(x=>({...x,comments:parseInt(e.target.value)||0}))}/>
              <Input label="Reach" type="number" value={String(f.reach||0)} onChange={e=>setF(x=>({...x,reach:parseInt(e.target.value)||0}))}/>
            </div>
          )}
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:20}}>
          <Btn v="ghost" onClick={onClose}>Cancel</Btn>
          <Btn onClick={submit}>Save Changes</Btn>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════
function Dashboard({ store, posts, setPosts, setView, toast }) {
  const [editPost,setEditPost]=useState(null);
  const [delPost,setDelPost]=useState(null);
  const sp=posts.filter(p=>p.storeId===store.id);
  const pub=sp.filter(p=>p.status==="published");
  const sch=sp.filter(p=>p.status==="scheduled");
  const totalLikes=pub.reduce((a,p)=>a+p.likes,0);
  const totalReach=pub.reduce((a,p)=>a+p.reach,0);

  const growthData=[
    {m:"Nov",f:Math.round(store.followers*0.66)},{m:"Dec",f:Math.round(store.followers*0.73)},
    {m:"Jan",f:Math.round(store.followers*0.79)},{m:"Feb",f:Math.round(store.followers*0.85)},
    {m:"Mar",f:Math.round(store.followers*0.92)},{m:"Apr",f:store.followers},
  ];
  const weeklyData=[
    {d:"Mon",r:Math.round(totalReach*0.14)},{d:"Tue",r:Math.round(totalReach*0.1)},
    {d:"Wed",r:Math.round(totalReach*0.2)},{d:"Thu",r:Math.round(totalReach*0.16)},
    {d:"Fri",r:Math.round(totalReach*0.22)},{d:"Sat",r:Math.round(totalReach*0.13)},
    {d:"Sun",r:Math.round(totalReach*0.05)},
  ];

  function deletePost(p){
    setPosts(prev=>prev.filter(x=>x.id!==p.id));
    toast("Post deleted","info"); setDelPost(null);
  }

  return (
    <div>
      {editPost&&<PostModal post={editPost} onSave={up=>{setPosts(prev=>prev.map(p=>p.id===up.id?up:p));setEditPost(null);}} onClose={()=>setEditPost(null)} toast={toast}/>}
      {delPost&&<Confirm title="Delete Post?" msg={`"${delPost.caption.slice(0,80)}..." — yeh permanently delete ho jayegi.`} onOk={()=>deletePost(delPost)} onCancel={()=>setDelPost(null)}/>}

      <PageHeader title="Dashboard" sub={`${store.name} · ${store.city}`}
        actions={<Btn onClick={()=>setView("create")}><Plus size={14}/>New Post</Btn>}/>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
        <StatCard label="Total Followers" value={fmt(store.followers)} Icon={Users}       color={C.gold}  trend={8.4}/>
        <StatCard label="Engagement Rate" value={`${store.engagement}%`} Icon={TrendingUp} color={C.cyan}  trend={2.1}/>
        <StatCard label="Total Reach"     value={fmt(totalReach)}      Icon={Eye}         color={C.purple} trend={12.3}/>
        <StatCard label="Total Likes"     value={fmt(totalLikes)}       Icon={Heart}       color={C.red}   trend={5.7}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:22}}>
        <Card style={{padding:"1.25rem"}}>
          <div style={{fontSize:15,fontWeight:600,color:C.text,marginBottom:2,fontFamily:"'Cormorant Garamond',serif"}}>Follower Growth</div>
          <div style={{fontSize:11,color:C.sub,marginBottom:14}}>Last 6 months</div>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={growthData} margin={{top:0,right:0,bottom:0,left:-20}}>
              <defs><linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.gold} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={C.gold} stopOpacity={0}/>
              </linearGradient></defs>
              <XAxis dataKey="m" tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false} tickFormatter={fmt}/>
              <Tooltip contentStyle={{background:C.card,border:`0.5px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:12}}/>
              <Area type="monotone" dataKey="f" stroke={C.gold} strokeWidth={2} fill="url(#fg)" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card style={{padding:"1.25rem"}}>
          <div style={{fontSize:15,fontWeight:600,color:C.text,marginBottom:2,fontFamily:"'Cormorant Garamond',serif"}}>Platforms</div>
          <div style={{fontSize:11,color:C.sub,marginBottom:14}}>Post distribution</div>
          <div style={{display:"flex",flexDirection:"column",gap:11}}>
            {store.platforms.map(pk=>{
              const p=PLATFORMS[pk]; if(!p)return null;
              const cnt=sp.filter(x=>x.platform===pk).length;
              const pct=sp.length?Math.round((cnt/sp.length)*100):0;
              const PI=p.Icon;
              return (
                <div key={pk}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <div style={{display:"flex",alignItems:"center",gap:5}}><PI size={13} color={p.color}/><span style={{fontSize:12,color:C.text}}>{p.name}</span></div>
                    <span style={{fontSize:12,color:C.sub}}>{cnt} posts</span>
                  </div>
                  <div style={{height:4,borderRadius:2,background:C.dark}}>
                    <div style={{height:"100%",width:`${pct}%`,borderRadius:2,background:p.color,transition:"width 0.5s"}}/>
                  </div>
                </div>
              );
            })}
            {store.platforms.length===0&&<div style={{fontSize:12,color:C.muted,textAlign:"center",padding:"20px 0"}}>No platforms added</div>}
          </div>
        </Card>
      </div>

      <Card style={{padding:"1.25rem",marginBottom:22}}>
        <div style={{fontSize:15,fontWeight:600,color:C.text,marginBottom:2,fontFamily:"'Cormorant Garamond',serif"}}>Weekly Reach</div>
        <div style={{fontSize:11,color:C.sub,marginBottom:14}}>Estimated daily audience reach</div>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={weeklyData} margin={{top:0,right:0,bottom:0,left:-20}}>
            <XAxis dataKey="d" tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false} tickFormatter={fmt}/>
            <Tooltip contentStyle={{background:C.card,border:`0.5px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:12}}/>
            <Bar dataKey="r" fill={C.cyan} radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card style={{padding:"1.25rem"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontSize:14,fontWeight:600,color:C.text}}>Recent Posts</div>
          <div style={{display:"flex",gap:8}}>
            <span style={{fontSize:12,color:C.sub}}>Published: {pub.length} · Scheduled: {sch.length}</span>
            <Btn v="ghost" small onClick={()=>setView("calendar")}>View All</Btn>
          </div>
        </div>
        {sp.length===0?(
          <div style={{textAlign:"center",padding:"30px 0"}}>
            <ImageIcon size={32} color={C.muted} style={{marginBottom:10}}/>
            <div style={{fontSize:13,color:C.sub,marginBottom:12}}>Koi post nahi hai abhi</div>
            <Btn onClick={()=>setView("create")} small><Plus size={12}/>Pehli Post Banao</Btn>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column"}}>
            {sp.slice(0,5).map((post,i)=>{
              const pl=PLATFORMS[post.platform];
              return (
                <div key={post.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<Math.min(sp.length,5)-1?`0.5px solid ${C.border}`:"none"}}>
                  <div style={{width:34,height:34,borderRadius:9,background:pl?`${pl.color}18`:C.dark,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {pl&&<pl.Icon size={15} color={pl.color}/>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{post.caption}</div>
                    <div style={{fontSize:11,color:C.muted,marginTop:2}}>{post.date}</div>
                  </div>
                  <Badge status={post.status}/>
                  {post.status==="published"&&(
                    <div style={{display:"flex",gap:10,marginLeft:4}}>
                      <span style={{display:"flex",alignItems:"center",gap:3,fontSize:11,color:C.sub}}><Heart size={11}/>{fmt(post.likes)}</span>
                      <span style={{display:"flex",alignItems:"center",gap:3,fontSize:11,color:C.sub}}><Eye size={11}/>{fmt(post.reach)}</span>
                    </div>
                  )}
                  <div style={{display:"flex",gap:4}}>
                    <button onClick={()=>setEditPost(post)} style={{background:"transparent",border:"none",cursor:"pointer",color:C.muted,padding:4,borderRadius:6,display:"flex"}}><Pencil size={12}/></button>
                    <button onClick={()=>setDelPost(post)} style={{background:"transparent",border:"none",cursor:"pointer",color:C.red,padding:4,borderRadius:6,display:"flex",opacity:0.6}}><Trash2 size={12}/></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════
// STORES
// ═══════════════════════════════════════
function Stores({ stores, setStores, store, setStore, setView, posts, toast }) {
  const [showAdd,setShowAdd]=useState(false);
  const [editing,setEditing]=useState(null);
  const [delStore,setDelStore]=useState(null);

  function saveStore(s){
    if(editing){
      setStores(prev=>prev.map(x=>x.id===s.id?s:x));
      if(store.id===s.id)setStore(s);
    } else {
      setStores(prev=>[...prev,s]);
      if(stores.length===0)setStore(s);
    }
  }

  function deleteStore(s){
    const rest=stores.filter(x=>x.id!==s.id);
    setStores(rest);
    if(store.id===s.id)setStore(rest[0]||null);
    toast(`Store "${s.name}" deleted`,"info");
    setDelStore(null);
  }

  return (
    <div>
      {(showAdd||editing)&&<StoreModal initial={editing} onSave={saveStore} onClose={()=>{setShowAdd(false);setEditing(null);}} toast={toast}/>}
      {delStore&&<Confirm title="Delete Store?" msg={`"${delStore.name}" aur uski saari posts delete ho jayengi. Ye undo nahi ho sakta.`} onOk={()=>deleteStore(delStore)} onCancel={()=>setDelStore(null)}/>}

      <PageHeader title="My Stores" sub={`${stores.length} store${stores.length!==1?"s":""} managed`}
        actions={<Btn onClick={()=>{setEditing(null);setShowAdd(true);}}><Plus size={14}/>Add Store</Btn>}/>

      {stores.length===0?(
        <div style={{textAlign:"center",padding:"80px 20px"}}>
          <Building2 size={48} color={C.muted} style={{marginBottom:16}}/>
          <div style={{fontSize:18,color:C.sub,marginBottom:8,fontFamily:"'Cormorant Garamond',serif"}}>Koi store nahi hai</div>
          <div style={{fontSize:13,color:C.muted,marginBottom:20}}>Pehla store banao aur social media manage karna shuru karo</div>
          <Btn onClick={()=>setShowAdd(true)}><Plus size={14}/>Store Banao</Btn>
        </div>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
          {stores.map(s=>{
            const sp=posts.filter(p=>p.storeId===s.id);
            const pub=sp.filter(p=>p.status==="published").length;
            return (
              <Card key={s.id} hover style={{padding:"1.25rem",cursor:"pointer"}} onClick={()=>{setStore(s);setView("dashboard");}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                  <div style={{width:42,height:42,borderRadius:12,background:s.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:C.dark,flexShrink:0}}>{s.avatar}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:1}}>{s.name}</div>
                    <div style={{fontSize:11,color:C.sub}}>{s.category}</div>
                  </div>
                  <div style={{display:"flex",gap:5}}>
                    <button onClick={e=>{e.stopPropagation();setEditing(s);}}
                      style={{background:C.dark,border:`0.5px solid ${C.border}`,borderRadius:7,padding:5,cursor:"pointer",color:C.sub,display:"flex"}} title="Edit">
                      <Pencil size={12}/>
                    </button>
                    <button onClick={e=>{e.stopPropagation();setDelStore(s);}}
                      style={{background:C.dark,border:`0.5px solid ${C.border}`,borderRadius:7,padding:5,cursor:"pointer",color:C.red,display:"flex",opacity:0.7}} title="Delete">
                      <Trash2 size={12}/>
                    </button>
                  </div>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
                  {[
                    {l:"Followers",v:fmt(s.followers),c:C.gold},
                    {l:"Engagement",v:`${s.engagement}%`,c:C.cyan},
                    {l:"Published",v:String(pub),c:C.green},
                    {l:"City",v:s.city||"—",c:C.amber},
                  ].map(({l,v,c})=>(
                    <div key={l} style={{background:C.dark,borderRadius:8,padding:"8px 10px"}}>
                      <div style={{fontSize:10,color:C.muted,marginBottom:2}}>{l}</div>
                      <div style={{fontSize:13,fontWeight:500,color:c}}>{v}</div>
                    </div>
                  ))}
                </div>

                <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:12}}>
                  {s.platforms.length>0?s.platforms.map(p=><PlatBadge key={p} platform={p}/>):<span style={{fontSize:11,color:C.muted}}>No platforms</span>}
                </div>

                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:12,borderTop:`0.5px solid ${C.border}`}}>
                  <span style={{fontSize:12,color:C.gold}}>View Dashboard →</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// CONTENT CALENDAR
// ═══════════════════════════════════════
function Calendar({ store, posts, setPosts, setView, toast }) {
  const [yr,setYr]=useState(today.getFullYear());
  const [mo,setMo]=useState(today.getMonth());
  const [sel,setSel]=useState(null);
  const [editPost,setEditPost]=useState(null);
  const [delPost,setDelPost]=useState(null);
  const [filter,setFilter]=useState("all");
  const sp=posts.filter(p=>p.storeId===store.id);
  const days=new Date(yr,mo+1,0).getDate();
  const firstDay=new Date(yr,mo,1).getDay();

  function postsOnDay(d){
    const ds=`${yr}-${String(mo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    return sp.filter(p=>p.date===ds&&(filter==="all"||p.platform===filter));
  }
  function deletePost(p){
    setPosts(prev=>prev.filter(x=>x.id!==p.id));
    toast("Post deleted","info"); setDelPost(null);
  }

  const monthStr=`${yr}-${String(mo+1).padStart(2,"0")}`;
  const thisMonthPosts=sp.filter(p=>p.date.startsWith(monthStr));

  return (
    <div>
      {editPost&&<PostModal post={editPost} onSave={up=>{setPosts(prev=>prev.map(p=>p.id===up.id?up:p));setEditPost(null);}} onClose={()=>setEditPost(null)} toast={toast}/>}
      {delPost&&<Confirm title="Delete Post?" msg={`"${delPost.caption.slice(0,80)}..."`} onOk={()=>deletePost(delPost)} onCancel={()=>setDelPost(null)}/>}

      <PageHeader title="Content Calendar" sub={`${store.name} · ${sp.length} total posts`}
        actions={<Btn onClick={()=>setView("create")}><Plus size={14}/>Schedule Post</Btn>}/>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
        {[
          {l:"This Month",v:String(thisMonthPosts.length),c:C.gold},
          {l:"Published",v:String(sp.filter(p=>p.status==="published").length),c:C.green},
          {l:"Scheduled",v:String(sp.filter(p=>p.status==="scheduled").length),c:C.amber},
          {l:"Drafts",v:String(sp.filter(p=>p.status==="draft").length),c:C.sub},
        ].map(({l,v,c})=>(
          <Card key={l} style={{padding:"1rem",textAlign:"center"}}>
            <div style={{fontSize:26,fontWeight:700,color:c,fontFamily:"'Cormorant Garamond',serif"}}>{v}</div>
            <div style={{fontSize:11,color:C.sub}}>{l}</div>
          </Card>
        ))}
      </div>

      <Card style={{padding:"1.25rem",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <button onClick={()=>{if(mo===0){setMo(11);setYr(y=>y-1);}else setMo(m=>m-1);}}
            style={{background:C.dark,border:`0.5px solid ${C.border}`,borderRadius:8,padding:"6px 10px",cursor:"pointer",color:C.sub,display:"flex"}}><ChevronLeft size={15}/></button>
          <div style={{fontSize:18,fontWeight:700,color:C.text,fontFamily:"'Cormorant Garamond',serif"}}>{MONTHS[mo]} {yr}</div>
          <button onClick={()=>{if(mo===11){setMo(0);setYr(y=>y+1);}else setMo(m=>m+1);}}
            style={{background:C.dark,border:`0.5px solid ${C.border}`,borderRadius:8,padding:"6px 10px",cursor:"pointer",color:C.sub,display:"flex"}}><ChevronRight size={15}/></button>
        </div>

        {/* Platform filter */}
        <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
          {["all",...store.platforms].map(pk=>{
            const p=PLATFORMS[pk]; const active=filter===pk;
            return (
              <div key={pk} onClick={()=>setFilter(pk)}
                style={{padding:"4px 12px",borderRadius:20,fontSize:11,cursor:"pointer",fontWeight:500,
                  background:active?(pk==="all"?`${C.gold}20`:`${p.color}20`):"transparent",
                  border:`0.5px solid ${active?(pk==="all"?C.gold:p.color):C.border}`,
                  color:active?(pk==="all"?C.gold:p.color):C.sub}}>
                {pk==="all"?"All Platforms":p.name}
              </div>
            );
          })}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:4}}>
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
            <div key={d} style={{fontSize:11,color:C.muted,textAlign:"center",padding:"4px 0",fontWeight:500}}>{d}</div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
          {Array(firstDay).fill(null).map((_,i)=><div key={`e${i}`}/>)}
          {Array(days).fill(null).map((_,i)=>{
            const d=i+1;
            const dp=postsOnDay(d);
            const isToday=d===today.getDate()&&mo===today.getMonth()&&yr===today.getFullYear();
            const isSel=sel===d;
            return (
              <div key={d} onClick={()=>setSel(isSel?null:d)}
                style={{minHeight:60,borderRadius:8,padding:"5px",cursor:"pointer",
                  background:isSel?`${C.gold}18`:isToday?`${C.cyan}10`:"transparent",
                  border:`0.5px solid ${isSel?C.gold:isToday?C.cyan:C.border}`,transition:"all 0.15s"}}>
                <div style={{fontSize:11,fontWeight:isToday?700:400,color:isToday?C.cyan:C.sub,marginBottom:3}}>{d}</div>
                {dp.slice(0,3).map(p=>{
                  const pl=PLATFORMS[p.platform];
                  return <div key={p.id} style={{fontSize:8,padding:"1px 4px",borderRadius:3,marginBottom:1,background:pl?`${pl.color}25`:C.dark,color:pl?pl.color:C.sub,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                    {pl?pl.name.split("/")[0]:p.platform}
                  </div>;
                })}
                {dp.length>3&&<div style={{fontSize:8,color:C.muted}}>+{dp.length-3}</div>}
              </div>
            );
          })}
        </div>
      </Card>

      {sel&&(
        <Card style={{padding:"1.25rem"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontSize:16,fontWeight:600,color:C.text,fontFamily:"'Cormorant Garamond',serif"}}>{MONTHS[mo]} {sel}, {yr}</div>
            <Btn v="ghost" small onClick={()=>setView("create")}><Plus size={12}/>Add Post</Btn>
          </div>
          {postsOnDay(sel).length===0?(
            <div style={{textAlign:"center",padding:"20px 0",color:C.muted,fontSize:13}}>
              Koi post nahi is din. <span onClick={()=>setView("create")} style={{color:C.gold,cursor:"pointer"}}>Create karo →</span>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {postsOnDay(sel).map(p=>{
                const pl=PLATFORMS[p.platform];
                return (
                  <div key={p.id} style={{display:"flex",gap:12,padding:"12px",background:C.dark,borderRadius:10,border:`0.5px solid ${C.border}`}}>
                    <div style={{width:34,height:34,borderRadius:9,background:pl?`${pl.color}18`:C.card,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {pl&&<pl.Icon size={15} color={pl.color}/>}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,color:C.text,marginBottom:3,lineHeight:1.4}}>{p.caption}</div>
                      <div style={{fontSize:11,color:C.muted}}>{p.hashtags}</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0}}>
                      <Badge status={p.status}/>
                      <div style={{display:"flex",gap:5}}>
                        <button onClick={()=>setEditPost(p)} style={{background:"transparent",border:"none",cursor:"pointer",color:C.sub,padding:3,display:"flex"}}><Pencil size={12}/></button>
                        <button onClick={()=>setDelPost(p)} style={{background:"transparent",border:"none",cursor:"pointer",color:C.red,padding:3,display:"flex",opacity:0.7}}><Trash2 size={12}/></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// CREATE POST
// ═══════════════════════════════════════
function CreatePost({ store, posts, setPosts, toast }) {
  const [platform,setPlatform]=useState(store.platforms[0]||"instagram");
  const [caption,setCaption]=useState("");
  const [hashtags,setHashtags]=useState("");
  const [topic,setTopic]=useState("");
  const [tone,setTone]=useState("engaging");
  const [date,setDate]=useState(todayStr);
  const [status,setStatus]=useState("scheduled");
  const [aiLoading,setAiLoading]=useState(false);
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);
  const [copied,setCopied]=useState(false);
  const [aiError,setAiError]=useState("");

  useEffect(()=>{
    if(store.platforms.length>0&&!store.platforms.includes(platform))
      setPlatform(store.platforms[0]);
  },[store]);

  async function generateAI(){
    if(!topic.trim())return;
    setAiLoading(true); setAiError(""); setCaption(""); setHashtags("");
    try {
      const r=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:700,
          messages:[{role:"user",content:`You are a social media expert. Write a ${tone} post for ${PLATFORMS[platform]?.name} for "${store.name}" (${store.category} business in ${store.city}).\n\nTopic: ${topic}\n\nWrite:\n1. An engaging caption with 3-5 relevant emojis, compelling hook, body, and clear CTA\n2. 8 trending hashtags\n\nFormat exactly:\n[caption here]\nHASHTAGS: #tag1 #tag2 #tag3 #tag4 #tag5 #tag6 #tag7 #tag8\n\nOutput ONLY the caption and hashtags line. Nothing else.`}]
        })
      });
      const data=await r.json();
      const text=data.content?.[0]?.text||"";
      const [cap,...rest]=text.split("\nHASHTAGS:");
      setCaption(cap.trim());
      setHashtags(rest.length?rest.join("").trim():"");
      toast("AI ne post generate kiya! ✨");
    } catch(e){
      setAiError("API se connect nahi ho paya. Internet check karo.");
      toast("Generation failed","error");
    }
    setAiLoading(false);
  }

  async function generateHashtags(){
    if(!caption.trim())return;
    setAiLoading(true);
    try {
      const r=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:100,
          messages:[{role:"user",content:`Generate 8 relevant hashtags for this ${PLATFORMS[platform]?.name} post for a ${store.category} business:\n"${caption}"\nOutput ONLY space-separated hashtags.`}]
        })
      });
      const data=await r.json();
      setHashtags(data.content?.[0]?.text?.trim()||"");
      toast("Hashtags generated!");
    } catch{toast("Hashtag generation failed","error");}
    setAiLoading(false);
  }

  function savePost(){
    if(!caption.trim()){toast("Caption required!","error");return;}
    if(!date){toast("Date required!","error");return;}
    setSaving(true);
    setTimeout(()=>{
      const np={id:Date.now(),storeId:store.id,platform,caption:caption.trim(),hashtags:hashtags.trim(),status,date,likes:0,comments:0,reach:0};
      setPosts(p=>[...p,np]);
      toast(`Post ${status==="scheduled"?"scheduled":"saved"} successfully! 🎉`);
      setSaving(false); setSaved(true);
      setTimeout(()=>setSaved(false),2500);
      setCaption(""); setHashtags(""); setTopic(""); setDate(todayStr); setAiError("");
    },600);
  }

  function copy(){
    navigator.clipboard.writeText(`${caption}\n\n${hashtags}`).catch(()=>{});
    setCopied(true); setTimeout(()=>setCopied(false),2000);
  }

  const pl=PLATFORMS[platform];

  return (
    <div>
      <PageHeader title="Create Post" sub={`${store.name} · AI-powered content generation`}/>

      {store.platforms.length===0&&(
        <div style={{background:`${C.amber}15`,border:`0.5px solid ${C.amber}40`,borderRadius:12,padding:"12px 16px",marginBottom:18,fontSize:13,color:C.amber,display:"flex",alignItems:"center",gap:8}}>
          <AlertTriangle size={15}/> Is store mein koi platform nahi. Settings mein jaake platform add karo.
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:20}}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>

          {/* Platform */}
          <Card style={{padding:"1.25rem"}}>
            <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:10}}>Platform Select Karo</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {(store.platforms.length>0?store.platforms:Object.keys(PLATFORMS)).map(pk=>{
                const p=PLATFORMS[pk]; if(!p)return null;
                const PI=p.Icon; const active=platform===pk;
                return (
                  <div key={pk} onClick={()=>setPlatform(pk)}
                    style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:9,cursor:"pointer",
                      background:active?`${p.color}20`:C.dark,border:`1.5px solid ${active?p.color:C.border}`,
                      fontSize:13,color:active?p.color:C.sub,fontWeight:active?600:400,transition:"all 0.15s"}}>
                    <PI size={14}/>{p.name}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* AI Generator */}
          <Card style={{padding:"1.25rem",border:`0.5px solid ${C.gold}30`}}>
            <div style={{display:"flex",alignItems:"center",gap:6,fontSize:13,fontWeight:600,color:C.text,marginBottom:12}}>
              <Sparkles size={15} color={C.gold}/> AI Content Generator
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:12}}>
              <Input label="Topic / Idea" value={topic} onChange={e=>setTopic(e.target.value)}
                placeholder={`e.g., New ${store.category} products, Weekend sale, Customer story...`}/>
              <div>
                <label style={{fontSize:12,color:C.sub,display:"block",marginBottom:6,fontWeight:500}}>Tone</label>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {TONES.map(t=>(
                    <div key={t} onClick={()=>setTone(t)}
                      style={{padding:"4px 12px",borderRadius:20,fontSize:11,cursor:"pointer",textTransform:"capitalize",fontWeight:500,
                        background:tone===t?`${C.gold}20`:C.dark,border:`0.5px solid ${tone===t?C.gold:C.border}`,color:tone===t?C.gold:C.sub}}>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {aiError&&<div style={{fontSize:12,color:C.red,marginBottom:8,background:`${C.red}10`,padding:"8px 12px",borderRadius:8}}>{aiError}</div>}
            <Btn onClick={generateAI} disabled={!topic.trim()||aiLoading} loading={aiLoading} style={{width:"100%",justifyContent:"center"}}>
              <Sparkles size={14}/>{aiLoading?"Generating...":"Generate with AI"}
            </Btn>
          </Card>

          {/* Caption */}
          <Card style={{padding:"1.25rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:600,color:C.text}}>Caption</div>
              <button onClick={copy} style={{background:"transparent",border:"none",cursor:"pointer",color:C.sub,display:"flex",alignItems:"center",gap:4,fontSize:12}}>
                {copied?<Check size={12} color={C.green}/>:<Copy size={12}/>}{copied?"Copied!":"Copy"}
              </button>
            </div>
            <textarea value={caption} onChange={e=>setCaption(e.target.value)}
              placeholder="Caption yahan likho ya AI se generate karo..."
              rows={5}
              style={{width:"100%",background:C.dark,border:`0.5px solid ${caption?"":C.border}`,borderRadius:8,padding:"10px 12px",color:C.text,fontSize:13,outline:"none",resize:"vertical",boxSizing:"border-box",fontFamily:"inherit",lineHeight:1.6,colorScheme:"dark"}}/>
            <div style={{fontSize:11,color:C.muted,marginTop:5,textAlign:"right"}}>{caption.length} chars</div>
          </Card>

          {/* Hashtags */}
          <Card style={{padding:"1.25rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:5,fontSize:13,fontWeight:600,color:C.text}}>
                <Hash size={13}/> Hashtags
              </div>
              <button onClick={generateHashtags} disabled={!caption.trim()||aiLoading}
                style={{background:"transparent",border:"none",cursor:caption.trim()?"pointer":"not-allowed",color:C.gold,fontSize:12,display:"flex",alignItems:"center",gap:4,opacity:caption.trim()?1:0.4}}>
                <RefreshCw size={11}/>{aiLoading?"...":"Auto-generate"}
              </button>
            </div>
            <input value={hashtags} onChange={e=>setHashtags(e.target.value)}
              placeholder="#hashtag1 #hashtag2 #hashtag3..."
              style={{width:"100%",background:C.dark,border:`0.5px solid ${C.border}`,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,outline:"none",boxSizing:"border-box",colorScheme:"dark"}}/>
          </Card>

          {/* Schedule */}
          <Card style={{padding:"1.25rem"}}>
            <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:12}}>Schedule / Save</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
              <Input label="Date" type="date" value={date} onChange={e=>setDate(e.target.value)}/>
              <Select label="Status" value={status} onChange={e=>setStatus(e.target.value)}
                options={[{v:"scheduled",l:"Scheduled"},{v:"draft",l:"Save as Draft"},{v:"published",l:"Mark as Published"}]}/>
            </div>
            <Btn onClick={savePost} disabled={!caption.trim()||!date||saving||store.platforms.length===0} loading={saving} style={{width:"100%",justifyContent:"center"}}>
              {saved?<><Check size={14} color={C.green}/>Saved!</>:<><Send size={14}/>{status==="scheduled"?"Schedule Post":status==="draft"?"Save Draft":"Save Post"}</>}
            </Btn>
          </Card>
        </div>

        {/* Preview */}
        <div>
          <Card style={{padding:"1.25rem",position:"sticky",top:0}}>
            <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:14}}>Live Preview</div>
            <div style={{background:"#000",borderRadius:22,padding:"2px",maxWidth:300,margin:"0 auto",border:"1.5px solid #222"}}>
              <div style={{background:"#111",borderRadius:20,overflow:"hidden"}}>
                <div style={{padding:"10px 14px",borderBottom:"0.5px solid #1a1a1a",display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:26,height:26,borderRadius:"50%",background:store.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:C.dark}}>{store.avatar}</div>
                  <div>
                    <div style={{fontSize:11,fontWeight:500,color:"#fff"}}>{store.name}</div>
                    <div style={{fontSize:9,color:"#555"}}>{pl?.name}</div>
                  </div>
                  <MoreHorizontal size={14} color="#555" style={{marginLeft:"auto"}}/>
                </div>
                <div style={{background:"#0a0a0a",height:180,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:6}}>
                  <ImageIcon size={28} color="#222"/>
                  <span style={{fontSize:10,color:"#333"}}>Image placeholder</span>
                </div>
                <div style={{padding:"8px 14px",display:"flex",gap:12,borderBottom:"0.5px solid #1a1a1a"}}>
                  <Heart size={16} color="#777"/><MessageCircle size={16} color="#777"/><Share2 size={16} color="#777"/>
                  <Star size={16} color="#777" style={{marginLeft:"auto"}}/>
                </div>
                <div style={{padding:"10px 14px 14px"}}>
                  <div style={{fontSize:11,color:"#ddd",lineHeight:1.5,whiteSpace:"pre-wrap",maxHeight:90,overflow:"hidden"}}>
                    {caption?<><span style={{fontWeight:600}}>{store.name.toLowerCase().replace(/ /g,"_")} </span>{caption}</>:<span style={{color:"#333"}}>Caption yahan dikhega...</span>}
                  </div>
                  {hashtags&&<div style={{fontSize:10,color:pl?.color||C.gold,marginTop:6,lineHeight:1.6,wordBreak:"break-all"}}>{hashtags}</div>}
                  {date&&<div style={{fontSize:9,color:"#444",marginTop:8}}>{date}</div>}
                </div>
              </div>
            </div>

            <div style={{marginTop:14,padding:"12px",background:C.dark,borderRadius:10,border:`0.5px solid ${C.gold}30`}}>
              <div style={{fontSize:11,fontWeight:600,color:C.gold,marginBottom:6}}>✦ Best Time to Post</div>
              <div style={{fontSize:11,color:C.sub,lineHeight:1.8}}>
                {platform==="instagram"&&<>📸 Reels: 9 AM–12 PM<br/>❤️ Peak: Tue–Fri<br/>🏷️ 5–10 hashtags ideal</>}
                {platform==="facebook"&&<>📘 Best: 9 AM, 1–4 PM<br/>🎬 Videos: 6x reach<br/>💬 Questions = more comments</>}
                {platform==="twitter"&&<>🐦 1–5 tweets/day<br/>🏷️ Max 2 hashtags<br/>🧵 Threads = 2x reach</>}
                {platform==="linkedin"&&<>💼 Weekdays 8–10 AM<br/>📝 Long posts work best<br/>💡 Industry insights = viral</>}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// ANALYTICS
// ═══════════════════════════════════════
function Analytics({ store, posts }) {
  const [period,setPeriod]=useState("6m");
  const sp=posts.filter(p=>p.storeId===store.id&&p.status==="published");
  const totalLikes=sp.reduce((a,p)=>a+p.likes,0);
  const totalReach=sp.reduce((a,p)=>a+p.reach,0);
  const totalComments=sp.reduce((a,p)=>a+p.comments,0);

  const growthData=[
    {m:"Nov",f:Math.round(store.followers*0.66),e:3.1},{m:"Dec",f:Math.round(store.followers*0.73),e:3.8},
    {m:"Jan",f:Math.round(store.followers*0.79),e:3.5},{m:"Feb",f:Math.round(store.followers*0.85),e:4.0},
    {m:"Mar",f:Math.round(store.followers*0.92),e:4.2},{m:"Apr",f:store.followers,e:store.engagement},
  ];

  const platformData=store.platforms.map(pk=>{
    const p=PLATFORMS[pk]; if(!p)return null;
    const cnt=sp.filter(x=>x.platform===pk).length;
    return {name:p.name,count:cnt,color:p.color};
  }).filter(Boolean);

  const topPosts=[...sp].sort((a,b)=>b.reach-a.reach).slice(0,5);

  return (
    <div>
      <PageHeader title="Analytics" sub={`${store.name} · Performance Overview`}
        actions={
          <div style={{display:"flex",gap:4,background:C.card,border:`0.5px solid ${C.border}`,borderRadius:9,padding:3}}>
            {["1m","3m","6m","1y"].map(p=>(
              <div key={p} onClick={()=>setPeriod(p)}
                style={{padding:"4px 12px",borderRadius:7,fontSize:12,cursor:"pointer",
                  background:period===p?C.gold:"transparent",color:period===p?C.dark:C.sub,
                  fontWeight:period===p?700:400,transition:"all 0.15s"}}>
                {p}
              </div>
            ))}
          </div>
        }/>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
        <StatCard label="Total Reach"    value={fmt(totalReach)}    Icon={Eye}           color={C.cyan}   trend={12.3}/>
        <StatCard label="Total Likes"    value={fmt(totalLikes)}    Icon={Heart}         color={C.red}    trend={8.7}/>
        <StatCard label="Comments"       value={fmt(totalComments)} Icon={MessageCircle} color={C.amber}  trend={5.2}/>
        <StatCard label="Avg Engagement" value={`${store.engagement}%`} Icon={TrendingUp} color={C.gold} trend={2.1}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:14}}>
        <Card style={{padding:"1.25rem"}}>
          <div style={{fontSize:15,fontWeight:600,color:C.text,marginBottom:2,fontFamily:"'Cormorant Garamond',serif"}}>Follower Growth</div>
          <div style={{fontSize:11,color:C.sub,marginBottom:14}}>Audience growth over time</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={growthData} margin={{top:0,right:10,bottom:0,left:-20}}>
              <XAxis dataKey="m" tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:C.muted,fontSize:11}} axisLine={false} tickLine={false} tickFormatter={fmt}/>
              <Tooltip contentStyle={{background:C.card,border:`0.5px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:12}}/>
              <Line type="monotone" dataKey="f" stroke={C.gold} strokeWidth={2.5} dot={{fill:C.gold,r:4}} activeDot={{r:6}}/>
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card style={{padding:"1.25rem"}}>
          <div style={{fontSize:15,fontWeight:600,color:C.text,marginBottom:14,fontFamily:"'Cormorant Garamond',serif"}}>Platform Split</div>
          {platformData.length===0?(
            <div style={{textAlign:"center",padding:"40px 0",color:C.muted,fontSize:12}}>No published posts</div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {platformData.map(({name,count,color})=>{
                const total=sp.length||1;
                const pct=Math.round((count/total)*100);
                return (
                  <div key={name}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span style={{fontSize:12,color:C.text}}>{name}</span>
                      <span style={{fontSize:12,color:C.sub}}>{count} ({pct}%)</span>
                    </div>
                    <div style={{height:6,borderRadius:3,background:C.dark}}>
                      <div style={{height:"100%",width:`${pct}%`,borderRadius:3,background:color,transition:"width 0.5s"}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <Card style={{padding:"1.25rem"}}>
        <div style={{fontSize:15,fontWeight:600,color:C.text,marginBottom:14,fontFamily:"'Cormorant Garamond',serif"}}>Top Performing Posts</div>
        {topPosts.length===0?(
          <div style={{textAlign:"center",padding:"30px 0",color:C.muted,fontSize:13}}>Koi published post nahi hai abhi.</div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {topPosts.map((post,i)=>{
              const pl=PLATFORMS[post.platform];
              return (
                <div key={post.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:C.dark,borderRadius:10,border:`0.5px solid ${C.border}`}}>
                  <div style={{fontSize:16,fontWeight:700,color:C.muted,width:20,textAlign:"center"}}>{i+1}</div>
                  <div style={{width:32,height:32,borderRadius:8,background:pl?`${pl.color}18`:C.card,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {pl&&<pl.Icon size={14} color={pl.color}/>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{post.caption}</div>
                    <div style={{fontSize:10,color:C.muted,marginTop:2}}>{post.date} · {pl?.name}</div>
                  </div>
                  <div style={{display:"flex",gap:14,flexShrink:0}}>
                    <span style={{display:"flex",alignItems:"center",gap:3,fontSize:12,color:C.sub}}><Eye size={11}/>{fmt(post.reach)}</span>
                    <span style={{display:"flex",alignItems:"center",gap:3,fontSize:12,color:C.sub}}><Heart size={11}/>{fmt(post.likes)}</span>
                    <span style={{display:"flex",alignItems:"center",gap:3,fontSize:12,color:C.sub}}><MessageCircle size={11}/>{post.comments}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════
function Settings({ store, stores, setStores, setStore, setPosts, toast }) {
  const [name,setName]=useState("Admin User");
  const [email,setEmail]=useState("admin@rasaya.in");
  const [biz,setBiz]=useState("Rasaya Social");
  const [phone,setPhone]=useState("+91 98765 43210");
  const [saved,setSaved]=useState(false);
  const [confirm,setConfirm]=useState(null);

  function saveAccount(){
    setSaved(true); toast("Account settings saved!");
    setTimeout(()=>setSaved(false),2500);
  }

  function togglePlatform(pk){
    const has=store.platforms.includes(pk);
    const updated={...store,platforms:has?store.platforms.filter(p=>p!==pk):[...store.platforms,pk]};
    setStore(updated);
    setStores(prev=>prev.map(s=>s.id===store.id?updated:s));
    toast(`${PLATFORMS[pk]?.name} ${has?"disconnected":"connected"}!`);
  }

  function resetToDemo(){
    setStores(INIT_STORES); setPosts(INIT_POSTS); setStore(INIT_STORES[0]);
    saveLS("rasaya_stores",INIT_STORES); saveLS("rasaya_posts",INIT_POSTS);
    toast("Demo data restored!"); setConfirm(null);
  }

  function clearAll(){
    setStores([]); setPosts([]); setStore(null);
    saveLS("rasaya_stores",[]); saveLS("rasaya_posts",[]);
    toast("All data cleared","info"); setConfirm(null);
  }

  return (
    <div>
      {confirm==="reset"&&<Confirm title="Reset to Demo?" msg="Aapka saara data hat jayega aur demo data wapas aa jayega." onOk={resetToDemo} onCancel={()=>setConfirm(null)} danger={false}/>}
      {confirm==="clear"&&<Confirm title="Clear All Data?" msg="Saare stores aur posts permanently delete ho jayenge. Ye undo nahi ho sakta!" onOk={clearAll} onCancel={()=>setConfirm(null)}/>}

      <PageHeader title="Settings" sub={`${store?.name||"No store selected"}`}/>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>

          <Card style={{padding:"1.5rem"}}>
            <div style={{fontSize:16,fontWeight:700,color:C.text,marginBottom:16,fontFamily:"'Cormorant Garamond',serif"}}>Account Settings</div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <Input label="Full Name" value={name} onChange={e=>setName(e.target.value)}/>
              <Input label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
              <Input label="Business Name" value={biz} onChange={e=>setBiz(e.target.value)}/>
              <Input label="Phone" value={phone} onChange={e=>setPhone(e.target.value)}/>
            </div>
            <div style={{marginTop:16}}>
              <Btn onClick={saveAccount}>{saved?<><Check size={13} color={C.green}/>Saved!</>:"Save Changes"}</Btn>
            </div>
          </Card>

          {store&&(
            <Card style={{padding:"1.5rem"}}>
              <div style={{fontSize:16,fontWeight:700,color:C.text,marginBottom:4,fontFamily:"'Cormorant Garamond',serif"}}>Connected Platforms</div>
              <div style={{fontSize:12,color:C.sub,marginBottom:16}}>Current store: <strong style={{color:C.gold}}>{store.name}</strong></div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {Object.entries(PLATFORMS).map(([k,p])=>{
                  const connected=store.platforms.includes(k);
                  const PI=p.Icon;
                  return (
                    <div key={k} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:C.dark,borderRadius:10,border:`0.5px solid ${connected?`${p.color}40`:C.border}`}}>
                      <div style={{width:36,height:36,borderRadius:9,background:`${p.color}15`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <PI size={18} color={p.color}/>
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:500,color:C.text}}>{p.name}</div>
                        <div style={{fontSize:11,color:connected?C.green:C.muted}}>{connected?"● Connected":"○ Not connected"}</div>
                      </div>
                      <Btn v={connected?"ghost":"primary"} small onClick={()=>togglePlatform(k)}>
                        {connected?"Disconnect":"Connect"}
                      </Btn>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          <Card style={{padding:"1.5rem",border:`0.5px solid ${C.red}25`}}>
            <div style={{fontSize:16,fontWeight:700,color:C.red,marginBottom:4,fontFamily:"'Cormorant Garamond',serif"}}>Danger Zone</div>
            <div style={{fontSize:12,color:C.sub,marginBottom:16}}>In actions ko undo nahi kar sakte</div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <Btn v="ghost" style={{fontSize:12,color:C.amber,borderColor:`${C.amber}50`}} onClick={()=>setConfirm("reset")}>
                <RefreshCw size={12}/> Demo Data Restore karo
              </Btn>
              <Btn v="danger" style={{fontSize:12}} onClick={()=>setConfirm("clear")}>
                <Trash2 size={12}/> Saara Data Delete karo
              </Btn>
            </div>
          </Card>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <Card style={{padding:"1.5rem"}}>
            <div style={{fontSize:16,fontWeight:700,color:C.text,marginBottom:4,fontFamily:"'Cormorant Garamond',serif"}}>Current Plan</div>
            <div style={{padding:"16px",background:`${C.gold}12`,border:`0.5px solid ${C.gold}35`,borderRadius:12,marginBottom:14,marginTop:10}}>
              <div style={{fontSize:16,fontWeight:700,color:C.gold,marginBottom:4,fontFamily:"'Cormorant Garamond',serif"}}>✦ Pro Plan</div>
              <div style={{fontSize:24,fontWeight:700,color:C.text,fontFamily:"'Cormorant Garamond',serif"}}>₹999<span style={{fontSize:13,fontWeight:400,color:C.sub}}>/month</span></div>
              <div style={{fontSize:11,color:C.sub,marginTop:3}}>Next billing: June 1, 2026</div>
            </div>
            {["Up to 5 stores","Unlimited posts","AI content generator","Full analytics","Priority support"].map(f=>(
              <div key={f} style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:C.sub,marginBottom:8}}>
                <CheckCircle2 size={13} color={C.green}/>{f}
              </div>
            ))}
            <Btn style={{width:"100%",justifyContent:"center",marginTop:12}}>Upgrade to Agency</Btn>
          </Card>

          <Card style={{padding:"1.5rem"}}>
            <div style={{fontSize:16,fontWeight:700,color:C.text,marginBottom:14,fontFamily:"'Cormorant Garamond',serif"}}>Stats Overview</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[
                {l:"Total Stores",v:String(stores.length),c:C.gold},
                {l:"Total Posts",v:String(posts?.length||0),c:C.cyan},
              ].map(({l,v,c})=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 12px",background:C.dark,borderRadius:8,border:`0.5px solid ${C.border}`}}>
                  <span style={{fontSize:12,color:C.sub}}>{l}</span>
                  <span style={{fontSize:14,fontWeight:700,color:c,fontFamily:"'Cormorant Garamond',serif"}}>{v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════
function Footer() {
  return (
    <footer style={{borderTop:`0.5px solid ${C.border}`,padding:"20px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:6,marginTop:28}}>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,fontWeight:700,letterSpacing:"4px",color:C.gold}}>✦ RASAYA SOCIAL ✦</div>
      <div style={{fontSize:10,color:C.muted,letterSpacing:"2px"}}>SMART POSTING · STRONGER GROWTH</div>
      <div style={{fontSize:11,color:C.muted}}>
        © {new Date().getFullYear()} Rasaya Social · Developed by <span style={{color:C.gold}}>Kunal Jain</span> · <span style={{color:C.gold}}>rasayacrm.in</span>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════
export default function App() {
  const [view,setView]=useState("dashboard");
  const [col,setCol]=useState(false);
  const { toasts, add:toast, remove:removeToast } = useToast();

  const [stores,setStores]=useState(()=>loadLS("rasaya_stores",INIT_STORES));
  const [posts, setPosts] =useState(()=>loadLS("rasaya_posts", INIT_POSTS));
  const [store, setStore] =useState(()=>{
    const saved=loadLS("rasaya_stores",INIT_STORES);
    return saved[0]||INIT_STORES[0];
  });

  useEffect(()=>{ saveLS("rasaya_stores",stores); },[stores]);
  useEffect(()=>{ saveLS("rasaya_posts",posts); },[posts]);

  // keep active store in sync
  useEffect(()=>{
    if(store&&!stores.find(s=>s.id===store.id)){
      setStore(stores[0]||null);
    }
  },[stores]);

  const currentStore=store||stores[0]||INIT_STORES[0];

  return (
    <div style={{display:"flex",height:"100vh",background:C.bg,color:C.text,fontFamily:"'Outfit','Segoe UI',system-ui,sans-serif",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;}
        input,textarea,select{color-scheme:dark;}
        input::placeholder,textarea::placeholder{color:#334155;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#1a2844;border-radius:2px;}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes slideIn{from{opacity:0;transform:translateX(20px);}to{opacity:1;transform:translateX(0);}}
      `}</style>

      <Sidebar view={view} setView={setView} store={currentStore} setStore={setStore} stores={stores} col={col} setCol={setCol}/>

      <main style={{flex:1,overflow:"auto",padding:"24px 28px"}}>
        {view==="dashboard" && <Dashboard store={currentStore} posts={posts} setPosts={setPosts} setView={setView} toast={toast}/>}
        {view==="stores"    && <Stores stores={stores} setStores={setStores} store={currentStore} setStore={setStore} setView={setView} posts={posts} toast={toast}/>}
        {view==="calendar"  && <Calendar store={currentStore} posts={posts} setPosts={setPosts} setView={setView} toast={toast}/>}
        {view==="create"    && <CreatePost store={currentStore} posts={posts} setPosts={setPosts} toast={toast}/>}
        {view==="analytics" && <Analytics store={currentStore} posts={posts}/>}
        {view==="settings"  && <Settings store={currentStore} stores={stores} setStores={setStores} setStore={setStore} setPosts={setPosts} toast={toast} posts={posts}/>}
        <Footer/>
      </main>

      <Toast toasts={toasts} remove={removeToast}/>
    </div>
  );
}