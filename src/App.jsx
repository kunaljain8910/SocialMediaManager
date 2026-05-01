import { useState, useRef, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line
} from "recharts";
import {
  LayoutDashboard, Building2, CalendarDays, PenSquare, BarChart3, Settings2,
  Plus, Instagram, Facebook, Twitter, Linkedin, Sparkles, Clock, CheckCircle2,
  Eye, Heart, MessageCircle, TrendingUp, Users, Bell, ChevronDown, Loader2,
  X, ChevronLeft, ChevronRight, Send, Hash, Edit3, Trash2, Globe, Target,
  Image as Img, Zap, LogOut, User, RefreshCw, Copy, Check, Menu, MoreHorizontal,
  Calendar, AlertCircle, ArrowUpRight, Layers, Share2, Star
} from "lucide-react";

// ══════════════════════════════════════════════
// DESIGN TOKENS
// ══════════════════════════════════════════════
const T = {
  bg: "#07091A",
  sidebar: "#0B0D1E",
  card: "#10132A",
  cardH: "#141830",
  border: "rgba(255,255,255,0.07)",
  borderH: "rgba(255,255,255,0.14)",
  primary: "#7C3AED",
  primaryH: "#6D28D9",
  primaryGlow: "rgba(124,58,237,0.18)",
  blue: "#3B82F6",
  cyan: "#06B6D4",
  green: "#10B981",
  amber: "#F59E0B",
  red: "#F43F5E",
  pink: "#EC4899",
  text: "#E2E8F0",
  sub: "#94A3B8",
  muted: "#475569",
  dark: "#1E2240",
};

const PLATFORMS = {
  instagram: { name: "Instagram", color: "#E1306C", Icon: Instagram },
  facebook: { name: "Facebook", color: "#1877F2", Icon: Facebook },
  twitter: { name: "X/Twitter", color: "#1DA1F2", Icon: Twitter },
  linkedin: { name: "LinkedIn", color: "#0A66C2", Icon: Linkedin },
};

const NAV = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "stores", label: "My Stores", Icon: Building2 },
  { id: "calendar", label: "Content Calendar", Icon: CalendarDays },
  { id: "create", label: "Create Post", Icon: PenSquare },
  { id: "analytics", label: "Analytics", Icon: BarChart3 },
  { id: "settings", label: "Settings", Icon: Settings2 },
];

// ══════════════════════════════════════════════
// DEMO DATA
// ══════════════════════════════════════════════
const INIT_STORES = [
  { id: 1, name: "Fashion Hub", category: "Fashion & Clothing", platforms: ["instagram","facebook"], followers: 12400, engagement: 4.2, posts: 89, color: "#8B5CF6", avatar: "FH", city: "Indore" },
  { id: 2, name: "Tech Corner", category: "Electronics", platforms: ["instagram","twitter","linkedin"], followers: 8900, engagement: 3.8, posts: 134, color: "#06B6D4", avatar: "TC", city: "Bhopal" },
  { id: 3, name: "Foodie Palace", category: "Restaurant & Food", platforms: ["instagram","facebook"], followers: 23100, engagement: 6.1, posts: 267, color: "#F59E0B", avatar: "FP", city: "Indore" },
];

const INIT_POSTS = [
  { id: 1, storeId: 1, platform: "instagram", caption: "New summer collection is here! ☀️ Check out our latest arrivals — styles that speak for themselves. Visit us in store or shop online.", hashtags: "#fashion #summer #newcollection", status: "published", date: "2025-04-28", likes: 342, comments: 28, reach: 4200 },
  { id: 2, storeId: 1, platform: "facebook", caption: "Weekend SALE! 🎉 30% off on all items. Don't miss this limited offer. Visit us today!", hashtags: "#sale #weekend #discount", status: "published", date: "2025-04-27", likes: 156, comments: 12, reach: 2100 },
  { id: 3, storeId: 1, platform: "instagram", caption: "Behind the scenes 🎬 Watch how our team curates the latest trends just for you!", hashtags: "#bts #fashion #behindthescenes", status: "scheduled", date: "2025-05-03", likes: 0, comments: 0, reach: 0 },
  { id: 4, storeId: 1, platform: "facebook", caption: "Customer spotlight! Thank you for your love 💖 Your support means the world to us.", hashtags: "#customercare #thankyou", status: "scheduled", date: "2025-05-05", likes: 0, comments: 0, reach: 0 },
  { id: 5, storeId: 1, platform: "instagram", caption: "New arrivals every Monday — stay tuned!", hashtags: "#newarrivals #monday #fashion", status: "draft", date: "2025-05-10", likes: 0, comments: 0, reach: 0 },
  { id: 6, storeId: 2, platform: "linkedin", caption: "Exciting news! We just restocked our premium laptop lineup. Best prices in the city guaranteed.", hashtags: "#tech #laptops #electronics", status: "published", date: "2025-04-29", likes: 89, comments: 7, reach: 1800 },
  { id: 7, storeId: 3, platform: "instagram", caption: "Sunday brunch is here 🍳🥑 Come enjoy our special menu. Reservations open!", hashtags: "#brunch #food #restaurant", status: "published", date: "2025-04-30", likes: 521, comments: 44, reach: 7300 },
];

const GROWTH_DATA = [
  { month: "Nov", followers: 8200, engagement: 3.1, posts: 12 },
  { month: "Dec", followers: 9100, engagement: 3.8, posts: 18 },
  { month: "Jan", followers: 9800, engagement: 3.5, posts: 15 },
  { month: "Feb", followers: 10600, engagement: 4.0, posts: 14 },
  { month: "Mar", followers: 11400, engagement: 4.2, posts: 16 },
  { month: "Apr", followers: 12400, engagement: 4.6, posts: 14 },
];

const WEEKLY_DATA = [
  { day: "Mon", reach: 1800, engagement: 4.1 },
  { day: "Tue", reach: 1200, engagement: 3.6 },
  { day: "Wed", reach: 2800, engagement: 5.2 },
  { day: "Thu", reach: 2100, engagement: 4.3 },
  { day: "Fri", reach: 3900, engagement: 6.1 },
  { day: "Sat", reach: 3200, engagement: 5.8 },
  { day: "Sun", reach: 900, engagement: 3.2 },
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ══════════════════════════════════════════════
// UTILITY
// ══════════════════════════════════════════════
function fmtNum(n) {
  if (n >= 1000000) return (n/1000000).toFixed(1)+"M";
  if (n >= 1000) return (n/1000).toFixed(1)+"K";
  return String(n);
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDay(year, month) {
  return new Date(year, month, 1).getDay();
}

// ══════════════════════════════════════════════
// SMALL COMPONENTS
// ══════════════════════════════════════════════
function PlatformBadge({ platform, size = "sm" }) {
  const p = PLATFORMS[platform];
  if (!p) return null;
  const { Icon, color } = p;
  const sz = size === "sm" ? 12 : 16;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"2px 8px", borderRadius:20, background:`${color}18`, border:`0.5px solid ${color}40`, fontSize:11, fontWeight:500, color }}>
      <Icon size={sz} />
      {size !== "xs" && p.name}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    published: { label: "Published", bg: `${T.green}18`, color: T.green, border: `${T.green}40` },
    scheduled: { label: "Scheduled", bg: `${T.amber}18`, color: T.amber, border: `${T.amber}40` },
    draft: { label: "Draft", bg: `${T.sub}18`, color: T.sub, border: `${T.sub}40` },
  };
  const s = map[status] || map.draft;
  return (
    <span style={{ padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:500, background:s.bg, color:s.color, border:`0.5px solid ${s.border}` }}>
      {s.label}
    </span>
  );
}

function Card({ children, style, onClick, hover }) {
  const [isHov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: isHov && hover ? T.cardH : T.card,
        border: `0.5px solid ${isHov && hover ? T.borderH : T.border}`,
        borderRadius: 16,
        transition: "all 0.2s",
        cursor: onClick ? "pointer" : "default",
        ...style
      }}
    >
      {children}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", style, disabled, loading }) {
  const [hov, setHov] = useState(false);
  const bg = variant === "primary"
    ? (hov ? T.primaryH : T.primary)
    : variant === "ghost"
    ? (hov ? T.dark : "transparent")
    : T.card;
  return (
    <button
      disabled={disabled || loading}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:"inline-flex", alignItems:"center", gap:6,
        padding:"8px 16px", borderRadius:10, fontSize:13, fontWeight:500,
        border: `0.5px solid ${variant === "primary" ? T.primary : T.border}`,
        background: bg, color: variant === "primary" ? "#fff" : T.text,
        cursor: disabled ? "not-allowed" : "pointer", transition:"all 0.15s",
        opacity: disabled ? 0.5 : 1,
        ...style
      }}
    >
      {loading && <Loader2 size={14} style={{ animation:"spin 1s linear infinite" }} />}
      {children}
    </button>
  );
}

function StatCard({ label, value, sub, icon: Icon, color, trend }) {
  return (
    <Card style={{ padding: "1.25rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <div style={{ width:38, height:38, borderRadius:10, background:`${color}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon size={18} color={color} />
        </div>
        {trend !== undefined && (
          <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:12, color: trend >= 0 ? T.green : T.red }}>
            <ArrowUpRight size={12} style={{ transform: trend < 0 ? "rotate(90deg)" : "" }} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div style={{ fontSize:24, fontWeight:600, color:T.text, letterSpacing:"-0.5px", marginBottom:3 }}>{value}</div>
      <div style={{ fontSize:13, color:T.sub }}>{label}</div>
      {sub && <div style={{ fontSize:11, color:T.muted, marginTop:3 }}>{sub}</div>}
    </Card>
  );
}

// ══════════════════════════════════════════════
// SIDEBAR
// ══════════════════════════════════════════════
function Sidebar({ view, setView, store, setStore, stores, collapsed, setCollapsed }) {
  const [storeOpen, setStoreOpen] = useState(false);
  return (
    <aside style={{
      width: collapsed ? 72 : 240,
      minWidth: collapsed ? 72 : 240,
      background: T.sidebar,
      borderRight: `0.5px solid ${T.border}`,
      display:"flex", flexDirection:"column",
      transition:"all 0.25s ease",
      position:"relative", zIndex:10,
    }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? "20px 0" : "20px 20px", borderBottom:`0.5px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent: collapsed ? "center" : "space-between" }}>
        {!collapsed && (
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:30, height:30, borderRadius:8, background:`linear-gradient(135deg,${T.primary},${T.cyan})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Zap size={16} color="#fff" />
            </div>
            <span style={{ fontSize:16, fontWeight:700, color:T.text, letterSpacing:"-0.3px" }}>SocialFlow <span style={{ color:T.primary }}>AI</span></span>
          </div>
        )}
        {collapsed && (
          <div style={{ width:30, height:30, borderRadius:8, background:`linear-gradient(135deg,${T.primary},${T.cyan})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Zap size={16} color="#fff" />
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{ background:"transparent", border:"none", cursor:"pointer", color:T.sub, padding:4, borderRadius:6, display: collapsed ? "none" : "flex" }}>
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Store selector */}
      {!collapsed && (
        <div style={{ padding:"12px 12px 0" }}>
          <div
            onClick={() => setStoreOpen(!storeOpen)}
            style={{
              display:"flex", alignItems:"center", gap:10, padding:"10px 10px",
              borderRadius:10, cursor:"pointer", background: storeOpen ? T.dark : "transparent",
              border:`0.5px solid ${storeOpen ? T.borderH : T.border}`,
              transition:"all 0.15s",
            }}
          >
            <div style={{ width:28, height:28, borderRadius:7, background:store.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff", flexShrink:0 }}>
              {store.avatar}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:500, color:T.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{store.name}</div>
              <div style={{ fontSize:11, color:T.sub }}>{store.category}</div>
            </div>
            <ChevronDown size={14} color={T.sub} style={{ transform: storeOpen ? "rotate(180deg)" : "", transition:"transform 0.2s", flexShrink:0 }} />
          </div>

          {storeOpen && (
            <div style={{ marginTop:4, background:T.card, border:`0.5px solid ${T.border}`, borderRadius:10, overflow:"hidden" }}>
              {stores.map(s => (
                <div
                  key={s.id}
                  onClick={() => { setStore(s); setStoreOpen(false); }}
                  style={{
                    display:"flex", alignItems:"center", gap:8, padding:"9px 10px",
                    cursor:"pointer", background: s.id === store.id ? T.dark : "transparent",
                    transition:"background 0.15s",
                  }}
                >
                  <div style={{ width:22, height:22, borderRadius:5, background:s.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"#fff" }}>
                    {s.avatar}
                  </div>
                  <span style={{ fontSize:12, color: s.id === store.id ? T.text : T.sub }}>{s.name}</span>
                  {s.id === store.id && <Check size={12} color={T.primary} style={{ marginLeft:"auto" }} />}
                </div>
              ))}
              <div style={{ borderTop:`0.5px solid ${T.border}`, padding:"8px 10px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:T.primary, cursor:"pointer" }}>
                  <Plus size={12} /> Add new store
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex:1, padding: collapsed ? "12px 8px" : "12px 12px", display:"flex", flexDirection:"column", gap:2 }}>
        {NAV.map(({ id, label, Icon }) => {
          const active = view === id;
          return (
            <NavItem key={id} id={id} label={label} Icon={Icon} active={active} collapsed={collapsed} onClick={() => setView(id)} />
          );
        })}
      </nav>

      {/* Bottom: User */}
      <div style={{ padding: collapsed ? "12px 8px" : "12px 12px", borderTop:`0.5px solid ${T.border}` }}>
        {collapsed ? (
          <div onClick={() => setCollapsed(false)} style={{ display:"flex", justifyContent:"center", cursor:"pointer" }}>
            <Menu size={18} color={T.sub} />
          </div>
        ) : (
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", borderRadius:10, cursor:"pointer" }}>
            <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,${T.primary},${T.pink})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#fff" }}>A</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:500, color:T.text }}>Admin</div>
              <div style={{ fontSize:11, color:T.sub }}>admin@socialflow.ai</div>
            </div>
            <LogOut size={14} color={T.muted} />
          </div>
        )}
      </div>
    </aside>
  );
}

function NavItem({ id, label, Icon, active, collapsed, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={collapsed ? label : ""}
      style={{
        display:"flex", alignItems:"center", gap:10,
        padding: collapsed ? "10px 0" : "9px 10px",
        borderRadius:10, border:"none", cursor:"pointer",
        background: active ? `${T.primary}20` : (hov ? T.dark : "transparent"),
        color: active ? T.primary : (hov ? T.text : T.sub),
        fontSize:13, fontWeight: active ? 500 : 400,
        transition:"all 0.15s",
        justifyContent: collapsed ? "center" : "flex-start",
        width:"100%",
      }}
    >
      <Icon size={18} />
      {!collapsed && label}
      {active && !collapsed && <div style={{ marginLeft:"auto", width:4, height:4, borderRadius:2, background:T.primary }} />}
    </button>
  );
}

// ══════════════════════════════════════════════
// HEADER
// ══════════════════════════════════════════════
function Header({ title, store, actions }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
      <div>
        <h1 style={{ fontSize:20, fontWeight:600, color:T.text, margin:0, letterSpacing:"-0.3px" }}>{title}</h1>
        <p style={{ fontSize:13, color:T.sub, margin:"3px 0 0" }}>
          {store.name} · {store.city}
        </p>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {actions}
        <div style={{ width:34, height:34, borderRadius:9, background:T.card, border:`0.5px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", position:"relative" }}>
          <Bell size={16} color={T.sub} />
          <div style={{ position:"absolute", top:7, right:7, width:6, height:6, borderRadius:3, background:T.red, border:`1.5px solid ${T.bg}` }} />
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// DASHBOARD VIEW
// ══════════════════════════════════════════════
function DashboardView({ store, posts, setView }) {
  const storePosts = posts.filter(p => p.storeId === store.id);
  const published = storePosts.filter(p => p.status === "published");
  const scheduled = storePosts.filter(p => p.status === "scheduled");
  const totalLikes = published.reduce((a, p) => a + p.likes, 0);
  const totalReach = published.reduce((a, p) => a + p.reach, 0);

  return (
    <div>
      <Header title="Dashboard" store={store} actions={
        <Btn onClick={() => setView("create")} style={{ gap:6 }}>
          <Plus size={14} /> New Post
        </Btn>
      } />

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        <StatCard label="Total Followers" value={fmtNum(store.followers)} icon={Users} color={T.primary} trend={8.4} />
        <StatCard label="Engagement Rate" value={`${store.engagement}%`} icon={TrendingUp} color={T.cyan} trend={2.1} />
        <StatCard label="Posts Published" value={String(published.length)} icon={CheckCircle2} color={T.green} sub="This month" />
        <StatCard label="Posts Scheduled" value={String(scheduled.length)} icon={Clock} color={T.amber} sub="Upcoming" />
      </div>

      {/* Charts row */}
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:16, marginBottom:24 }}>
        <Card style={{ padding:"1.25rem" }}>
          <div style={{ fontSize:14, fontWeight:500, color:T.text, marginBottom:4 }}>Follower Growth</div>
          <div style={{ fontSize:12, color:T.sub, marginBottom:16 }}>Last 6 months</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={GROWTH_DATA} margin={{ top:0, right:0, bottom:0, left:-20 }}>
              <defs>
                <linearGradient id="fGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={T.primary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={T.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill:T.muted, fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:T.muted, fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v => fmtNum(v)} />
              <Tooltip contentStyle={{ background:T.card, border:`0.5px solid ${T.border}`, borderRadius:8, color:T.text, fontSize:12 }} />
              <Area type="monotone" dataKey="followers" stroke={T.primary} strokeWidth={2} fill="url(#fGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card style={{ padding:"1.25rem" }}>
          <div style={{ fontSize:14, fontWeight:500, color:T.text, marginBottom:4 }}>Platforms</div>
          <div style={{ fontSize:12, color:T.sub, marginBottom:16 }}>Active connections</div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {store.platforms.map(p => {
              const pl = PLATFORMS[p];
              const pPosts = storePosts.filter(x => x.platform === p);
              const pct = Math.round((pPosts.length / Math.max(storePosts.length, 1)) * 100);
              return (
                <div key={p}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <pl.Icon size={14} color={pl.color} />
                      <span style={{ fontSize:12, color:T.text }}>{pl.name}</span>
                    </div>
                    <span style={{ fontSize:12, color:T.sub }}>{pPosts.length} posts</span>
                  </div>
                  <div style={{ height:4, borderRadius:2, background:T.dark, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${pct}%`, borderRadius:2, background:pl.color, transition:"width 0.5s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Weekly reach */}
      <Card style={{ padding:"1.25rem", marginBottom:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:500, color:T.text, marginBottom:2 }}>Weekly Reach</div>
            <div style={{ fontSize:12, color:T.sub }}>Audience reached per day</div>
          </div>
          <span style={{ fontSize:12, color:T.sub }}>This week</span>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={WEEKLY_DATA} margin={{ top:0, right:0, bottom:0, left:-20 }}>
            <XAxis dataKey="day" tick={{ fill:T.muted, fontSize:11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:T.muted, fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v => fmtNum(v)} />
            <Tooltip contentStyle={{ background:T.card, border:`0.5px solid ${T.border}`, borderRadius:8, color:T.text, fontSize:12 }} />
            <Bar dataKey="reach" fill={T.cyan} radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent Posts */}
      <Card style={{ padding:"1.25rem" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ fontSize:14, fontWeight:500, color:T.text }}>Recent Posts</div>
          <Btn variant="ghost" style={{ fontSize:12, padding:"4px 10px" }} onClick={() => setView("calendar")}>View All</Btn>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
          {storePosts.slice(0,4).map(post => (
            <div key={post.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:`0.5px solid ${T.border}` }}>
              <div style={{ width:36, height:36, borderRadius:9, background:`${PLATFORMS[post.platform]?.color}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {PLATFORMS[post.platform] && <PLATFORMS[post.platform].Icon size={16} color={PLATFORMS[post.platform].color} />}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, color:T.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{post.caption}</div>
                <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{post.date}</div>
              </div>
              <StatusBadge status={post.status} />
              {post.status === "published" && (
                <div style={{ display:"flex", gap:12, marginLeft:8 }}>
                  <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:T.sub }}><Heart size={12} /> {fmtNum(post.likes)}</span>
                  <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:T.sub }}><Eye size={12} /> {fmtNum(post.reach)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════
// STORES VIEW
// ══════════════════════════════════════════════
function StoresView({ stores, setStores, setStore, setView }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newStore, setNewStore] = useState({ name:"", category:"", city:"", platforms:[], color:"#7C3AED" });

  function addStore() {
    if (!newStore.name || !newStore.category) return;
    const s = {
      ...newStore,
      id: Date.now(), followers: 0, engagement: 0, posts: 0,
      avatar: newStore.name.slice(0,2).toUpperCase(),
    };
    setStores(prev => [...prev, s]);
    setShowAdd(false);
    setNewStore({ name:"", category:"", city:"", platforms:[], color:"#7C3AED" });
  }

  const colors = ["#7C3AED","#06B6D4","#F59E0B","#10B981","#F43F5E","#EC4899","#3B82F6","#F97316"];

  return (
    <div>
      <Header title="My Stores" store={stores[0] || {name:"",city:""}} actions={
        <Btn onClick={() => setShowAdd(true)}><Plus size={14} /> Add Store</Btn>
      } />

      {showAdd && (
        <Card style={{ padding:"1.5rem", marginBottom:20, border:`0.5px solid ${T.primary}40` }}>
          <div style={{ fontSize:15, fontWeight:500, color:T.text, marginBottom:16 }}>Add New Store</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
            {[["Store Name","name"],["Category","category"],["City","city"]].map(([label, key]) => (
              <div key={key}>
                <label style={{ fontSize:12, color:T.sub, display:"block", marginBottom:5 }}>{label}</label>
                <input value={newStore[key]} onChange={e => setNewStore(p => ({...p,[key]:e.target.value}))}
                  style={{ width:"100%", background:T.dark, border:`0.5px solid ${T.border}`, borderRadius:8, padding:"8px 12px", color:T.text, fontSize:13, outline:"none", boxSizing:"border-box" }} />
              </div>
            ))}
            <div>
              <label style={{ fontSize:12, color:T.sub, display:"block", marginBottom:5 }}>Brand Color</label>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {colors.map(c => (
                  <div key={c} onClick={() => setNewStore(p => ({...p, color:c}))}
                    style={{ width:22, height:22, borderRadius:5, background:c, cursor:"pointer", border:`2px solid ${newStore.color === c ? "#fff" : "transparent"}`, transition:"border 0.15s" }} />
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:12, color:T.sub, display:"block", marginBottom:5 }}>Platforms</label>
            <div style={{ display:"flex", gap:8 }}>
              {Object.entries(PLATFORMS).map(([key, p]) => {
                const active = newStore.platforms.includes(key);
                return (
                  <div key={key} onClick={() => setNewStore(prev => ({ ...prev, platforms: active ? prev.platforms.filter(x=>x!==key) : [...prev.platforms,key] }))}
                    style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:8, cursor:"pointer", background: active ? `${p.color}20` : T.dark, border:`0.5px solid ${active ? p.color : T.border}`, fontSize:12, color: active ? p.color : T.sub, transition:"all 0.15s" }}>
                    <p.Icon size={12} /> {p.name}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn onClick={addStore}>Save Store</Btn>
            <Btn variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Btn>
          </div>
        </Card>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {stores.map(s => (
          <Card key={s.id} hover style={{ padding:"1.25rem", cursor:"pointer" }} onClick={() => { setStore(s); setView("dashboard"); }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{ width:42, height:42, borderRadius:12, background:s.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#fff" }}>
                {s.avatar}
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:500, color:T.text }}>{s.name}</div>
                <div style={{ fontSize:12, color:T.sub }}>{s.category}</div>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
              {[
                { label:"Followers", value:fmtNum(s.followers), color:T.primary },
                { label:"Engagement", value:`${s.engagement}%`, color:T.cyan },
                { label:"Posts", value:String(s.posts), color:T.green },
                { label:"City", value:s.city, color:T.amber },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background:T.dark, borderRadius:8, padding:"8px 10px" }}>
                  <div style={{ fontSize:11, color:T.muted, marginBottom:2 }}>{label}</div>
                  <div style={{ fontSize:13, fontWeight:500, color }}>{value}</div>
                </div>
              ))}
            </div>

            <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
              {s.platforms.map(p => <PlatformBadge key={p} platform={p} />)}
            </div>

            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:12, paddingTop:12, borderTop:`0.5px solid ${T.border}` }}>
              <span style={{ fontSize:12, color:T.sub }}>View Dashboard</span>
              <ChevronRight size={14} color={T.muted} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// CALENDAR VIEW
// ══════════════════════════════════════════════
function CalendarView({ store, posts, setView, setPosts }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(null);

  const storePosts = posts.filter(p => p.storeId === store.id);
  const days = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);

  function postsOnDate(d) {
    const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    return storePosts.filter(p => p.date === dateStr);
  }

  const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  return (
    <div>
      <Header title="Content Calendar" store={store} actions={
        <Btn onClick={() => setView("create")}><Plus size={14} /> Schedule Post</Btn>
      } />

      {/* Month nav */}
      <Card style={{ padding:"1.25rem", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <button onClick={() => { if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1); }} style={{ background:T.dark, border:`0.5px solid ${T.border}`, borderRadius:8, padding:"6px 10px", cursor:"pointer", color:T.sub, display:"flex", alignItems:"center" }}>
            <ChevronLeft size={16} />
          </button>
          <div style={{ fontSize:16, fontWeight:500, color:T.text }}>{MONTHS[month]} {year}</div>
          <button onClick={() => { if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1); }} style={{ background:T.dark, border:`0.5px solid ${T.border}`, borderRadius:8, padding:"6px 10px", cursor:"pointer", color:T.sub, display:"flex", alignItems:"center" }}>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Day headers */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:4 }}>
          {DAYS.map(d => <div key={d} style={{ fontSize:11, color:T.muted, textAlign:"center", padding:"4px 0", fontWeight:500 }}>{d}</div>)}
        </div>

        {/* Calendar grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
          {Array(firstDay).fill(null).map((_,i) => <div key={`e${i}`} />)}
          {Array(days).fill(null).map((_,i) => {
            const d = i+1;
            const dayPosts = postsOnDate(d);
            const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isSel = selected === d;
            return (
              <div
                key={d}
                onClick={() => setSelected(isSel ? null : d)}
                style={{
                  minHeight:64, borderRadius:8, padding:"6px", cursor:"pointer",
                  background: isSel ? `${T.primary}20` : (isToday ? T.dark : "transparent"),
                  border: `0.5px solid ${isSel ? T.primary : (isToday ? T.borderH : T.border)}`,
                  transition:"all 0.15s",
                }}
              >
                <div style={{ fontSize:12, fontWeight: isToday ? 600 : 400, color: isToday ? T.primary : T.sub, marginBottom:4 }}>{d}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                  {dayPosts.slice(0,2).map(p => (
                    <div key={p.id} style={{ fontSize:9, padding:"2px 4px", borderRadius:3, background:`${PLATFORMS[p.platform]?.color}30`, color: PLATFORMS[p.platform]?.color, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                      {PLATFORMS[p.platform]?.name?.split(" ")[0]}
                    </div>
                  ))}
                  {dayPosts.length > 2 && <div style={{ fontSize:9, color:T.muted }}>+{dayPosts.length-2}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Selected day posts */}
      {selected && (
        <Card style={{ padding:"1.25rem" }}>
          <div style={{ fontSize:14, fontWeight:500, color:T.text, marginBottom:12 }}>
            Posts on {MONTHS[month]} {selected}, {year}
          </div>
          {postsOnDate(selected).length === 0 ? (
            <div style={{ textAlign:"center", padding:"20px 0", color:T.muted, fontSize:13 }}>
              No posts scheduled. <span onClick={() => setView("create")} style={{ color:T.primary, cursor:"pointer" }}>Create one →</span>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {postsOnDate(selected).map(p => (
                <div key={p.id} style={{ display:"flex", gap:12, padding:"12px", background:T.dark, borderRadius:10, border:`0.5px solid ${T.border}` }}>
                  <div style={{ width:36, height:36, borderRadius:9, background:`${PLATFORMS[p.platform]?.color}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {PLATFORMS[p.platform] && <PLATFORMS[p.platform].Icon size={16} color={PLATFORMS[p.platform].color} />}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, color:T.text, marginBottom:4 }}>{p.caption}</div>
                    <div style={{ fontSize:11, color:T.muted }}>{p.hashtags}</div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Monthly summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginTop:16 }}>
        {[
          { label:"Total Posts", value: String(storePosts.filter(p=>p.date.startsWith(`${year}-${String(month+1).padStart(2,"0")}`)).length), color:T.primary },
          { label:"Published", value: String(storePosts.filter(p=>p.status==="published" && p.date.startsWith(`${year}-${String(month+1).padStart(2,"0")}`)).length), color:T.green },
          { label:"Scheduled", value: String(storePosts.filter(p=>p.status==="scheduled").length), color:T.amber },
          { label:"Drafts", value: String(storePosts.filter(p=>p.status==="draft").length), color:T.sub },
        ].map(({ label, value, color }) => (
          <Card key={label} style={{ padding:"1rem", textAlign:"center" }}>
            <div style={{ fontSize:22, fontWeight:600, color, marginBottom:4 }}>{value}</div>
            <div style={{ fontSize:12, color:T.sub }}>{label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// CREATE POST VIEW (AI-powered)
// ══════════════════════════════════════════════
function CreatePostView({ store, posts, setPosts }) {
  const [platform, setPlatform] = useState(store.platforms[0] || "instagram");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("engaging");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("scheduled");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const TONES = ["engaging","professional","funny","promotional","informative","inspirational"];

  async function generateWithAI() {
    if (!topic.trim()) return;
    setLoading(true);
    setCaption(""); setHashtags("");
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 600,
          messages: [{
            role: "user",
            content: `Write a ${tone} social media post caption for ${PLATFORMS[platform]?.name || platform} for a ${store.category} business called "${store.name}".

Topic/Idea: ${topic}

Requirements:
- Write an engaging caption with relevant emojis (3-5 emojis max)
- Keep it natural and platform-appropriate
- End with a clear call-to-action
- Then on a new line write exactly "HASHTAGS:" followed by 6-8 relevant hashtags on the same line

Format your response EXACTLY as:
[Caption text here with emojis and CTA]
HASHTAGS: #tag1 #tag2 #tag3 #tag4 #tag5 #tag6

Only output the caption and hashtags, nothing else.`
          }]
        })
      });
      const data = await resp.json();
      const text = data.content?.[0]?.text || "";
      const parts = text.split("HASHTAGS:");
      setCaption((parts[0] || "").trim());
      setHashtags(parts[1] ? "HASHTAGS: " + parts[1].trim() : "");
    } catch (err) {
      setCaption("Sorry, could not generate content. Please try again.");
    }
    setLoading(false);
  }

  async function generateHashtags() {
    if (!caption.trim()) return;
    setLoading(true);
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 150,
          messages: [{
            role: "user",
            content: `Generate 8 highly relevant hashtags for this ${PLATFORMS[platform]?.name} post for a ${store.category} business:\n\n"${caption}"\n\nOutput only hashtags separated by spaces, no explanation.`
          }]
        })
      });
      const data = await resp.json();
      setHashtags(data.content?.[0]?.text?.trim() || "");
    } catch (err) {}
    setLoading(false);
  }

  function savePost() {
    if (!caption.trim() || !date) return;
    setSaving(true);
    setTimeout(() => {
      const newPost = {
        id: Date.now(), storeId: store.id, platform, caption,
        hashtags, status, date, likes:0, comments:0, reach:0,
      };
      setPosts(p => [...p, newPost]);
      setSaving(false); setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      setCaption(""); setHashtags(""); setTopic(""); setDate("");
    }, 800);
  }

  function copyCaption() {
    navigator.clipboard.writeText(`${caption}\n\n${hashtags}`).catch(()=>{});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const pl = PLATFORMS[platform];

  return (
    <div>
      <Header title="Create Post" store={store} />

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* Left: Editor */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Platform select */}
          <Card style={{ padding:"1.25rem" }}>
            <div style={{ fontSize:13, fontWeight:500, color:T.text, marginBottom:10 }}>Select Platform</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {store.platforms.map(p => {
                const plt = PLATFORMS[p];
                const active = platform === p;
                return (
                  <div key={p} onClick={() => setPlatform(p)}
                    style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:9, cursor:"pointer", background: active ? `${plt.color}20` : T.dark, border:`1px solid ${active ? plt.color : T.border}`, fontSize:13, color: active ? plt.color : T.sub, transition:"all 0.15s", fontWeight: active ? 500 : 400 }}>
                    <plt.Icon size={14} /> {plt.name}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* AI Generator */}
          <Card style={{ padding:"1.25rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:500, color:T.text, marginBottom:12 }}>
              <Sparkles size={15} color={T.primary} /> AI Content Generator
            </div>
            <div style={{ marginBottom:10 }}>
              <label style={{ fontSize:12, color:T.sub, display:"block", marginBottom:5 }}>Post Topic / Idea</label>
              <input
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder={`e.g., New ${store.category} products, Weekend offers, Behind the scenes...`}
                style={{ width:"100%", background:T.dark, border:`0.5px solid ${T.border}`, borderRadius:8, padding:"9px 12px", color:T.text, fontSize:13, outline:"none", boxSizing:"border-box" }}
              />
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:12, color:T.sub, display:"block", marginBottom:5 }}>Tone</label>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {TONES.map(t => (
                  <div key={t} onClick={() => setTone(t)}
                    style={{ padding:"4px 10px", borderRadius:20, fontSize:11, cursor:"pointer", background: tone===t ? `${T.primary}25` : T.dark, border:`0.5px solid ${tone===t ? T.primary : T.border}`, color: tone===t ? T.primary : T.sub, transition:"all 0.15s", textTransform:"capitalize" }}>
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <Btn onClick={generateWithAI} disabled={!topic.trim() || loading} loading={loading} style={{ width:"100%", justifyContent:"center" }}>
              <Sparkles size={14} /> {loading ? "Generating..." : "Generate with AI"}
            </Btn>
          </Card>

          {/* Caption Editor */}
          <Card style={{ padding:"1.25rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div style={{ fontSize:13, fontWeight:500, color:T.text }}>Caption</div>
              <div style={{ display:"flex", gap:6 }}>
                <button onClick={copyCaption} style={{ background:"transparent", border:"none", cursor:"pointer", color:T.sub, display:"flex", alignItems:"center", gap:4, fontSize:12 }}>
                  {copied ? <Check size={12} color={T.green} /> : <Copy size={12} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Write your caption here or use AI to generate..."
              rows={5}
              style={{ width:"100%", background:T.dark, border:`0.5px solid ${T.border}`, borderRadius:8, padding:"10px 12px", color:T.text, fontSize:13, outline:"none", resize:"vertical", boxSizing:"border-box", fontFamily:"inherit", lineHeight:1.6 }}
            />
            <div style={{ fontSize:11, color:T.muted, marginTop:6, textAlign:"right" }}>{caption.length} characters</div>
          </Card>

          {/* Hashtags */}
          <Card style={{ padding:"1.25rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, fontWeight:500, color:T.text }}>
                <Hash size={14} /> Hashtags
              </div>
              <button onClick={generateHashtags} disabled={!caption.trim() || loading} style={{ background:"transparent", border:"none", cursor:"pointer", color:T.primary, fontSize:12, display:"flex", alignItems:"center", gap:4 }}>
                <RefreshCw size={11} /> {loading ? "..." : "Auto-generate"}
              </button>
            </div>
            <input
              value={hashtags}
              onChange={e => setHashtags(e.target.value)}
              placeholder="#hashtag1 #hashtag2 #hashtag3..."
              style={{ width:"100%", background:T.dark, border:`0.5px solid ${T.border}`, borderRadius:8, padding:"9px 12px", color:T.text, fontSize:13, outline:"none", boxSizing:"border-box" }}
            />
          </Card>

          {/* Schedule */}
          <Card style={{ padding:"1.25rem" }}>
            <div style={{ fontSize:13, fontWeight:500, color:T.text, marginBottom:12 }}>Schedule</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
              <div>
                <label style={{ fontSize:12, color:T.sub, display:"block", marginBottom:5 }}>Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  style={{ width:"100%", background:T.dark, border:`0.5px solid ${T.border}`, borderRadius:8, padding:"8px 12px", color:T.text, fontSize:13, outline:"none", boxSizing:"border-box", colorScheme:"dark" }} />
              </div>
              <div>
                <label style={{ fontSize:12, color:T.sub, display:"block", marginBottom:5 }}>Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)}
                  style={{ width:"100%", background:T.dark, border:`0.5px solid ${T.border}`, borderRadius:8, padding:"8px 12px", color:T.text, fontSize:13, outline:"none", boxSizing:"border-box" }}>
                  <option value="scheduled">Scheduled</option>
                  <option value="draft">Save as Draft</option>
                </select>
              </div>
            </div>
            <Btn
              onClick={savePost}
              disabled={!caption.trim() || !date || saving}
              loading={saving}
              style={{ width:"100%", justifyContent:"center" }}
            >
              {saved ? <><Check size={14} color={T.green} /> Saved!</> : <><Send size={14} /> {status === "scheduled" ? "Schedule Post" : "Save Draft"}</>}
            </Btn>
          </Card>
        </div>

        {/* Right: Preview */}
        <div>
          <Card style={{ padding:"1.25rem", position:"sticky", top:0 }}>
            <div style={{ fontSize:13, fontWeight:500, color:T.text, marginBottom:16 }}>Post Preview</div>

            {/* Mock phone */}
            <div style={{ background:"#000", borderRadius:24, padding:"2px", maxWidth:320, margin:"0 auto", border:"2px solid #333" }}>
              <div style={{ background:"#1a1a1a", borderRadius:22, overflow:"hidden" }}>
                {/* Platform header */}
                <div style={{ padding:"10px 14px", borderBottom:"0.5px solid #2a2a2a", display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", background:store.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff" }}>
                    {store.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:500, color:"#fff" }}>{store.name}</div>
                    <div style={{ fontSize:10, color:"#666" }}>{pl?.name}</div>
                  </div>
                  <div style={{ marginLeft:"auto" }}>
                    <MoreHorizontal size={16} color="#666" />
                  </div>
                </div>

                {/* Image placeholder */}
                <div style={{ background:"#111", height:200, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                  <div style={{ textAlign:"center" }}>
                    <Img size={32} color="#333" />
                    <div style={{ fontSize:11, color:"#444", marginTop:6 }}>Post Image</div>
                  </div>
                  <div style={{ position:"absolute", bottom:8, right:10, display:"flex", gap:4 }}>
                    <div style={{ width:6, height:6, borderRadius:3, background: pl?.color || T.primary }} />
                    <div style={{ width:6, height:6, borderRadius:3, background:"#333" }} />
                    <div style={{ width:6, height:6, borderRadius:3, background:"#333" }} />
                  </div>
                </div>

                {/* Actions */}
                <div style={{ padding:"10px 14px", display:"flex", gap:14, borderBottom:"0.5px solid #2a2a2a" }}>
                  <Heart size={18} color="#888" />
                  <MessageCircle size={18} color="#888" />
                  <Share2 size={18} color="#888" />
                  <Star size={18} color="#888" style={{ marginLeft:"auto" }} />
                </div>

                {/* Caption preview */}
                <div style={{ padding:"10px 14px 16px" }}>
                  <div style={{ fontSize:12, color:"#fff", lineHeight:1.5, whiteSpace:"pre-wrap", maxHeight:100, overflow:"hidden" }}>
                    {caption ? (
                      <><span style={{ fontWeight:500 }}>{store.name.toLowerCase().replace(/ /g,"_")}</span> {caption}</>
                    ) : (
                      <span style={{ color:"#555" }}>Your caption will appear here...</span>
                    )}
                  </div>
                  {hashtags && (
                    <div style={{ fontSize:11, color: pl?.color || T.primary, marginTop:6, lineHeight:1.5 }}>{hashtags}</div>
                  )}
                  {date && <div style={{ fontSize:10, color:"#555", marginTop:8 }}>{date}</div>}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div style={{ marginTop:16, padding:"12px", background:T.dark, borderRadius:10, border:`0.5px solid ${T.border}` }}>
              <div style={{ fontSize:11, fontWeight:500, color:T.amber, marginBottom:6 }}>💡 Best Practices</div>
              <div style={{ fontSize:11, color:T.sub, lineHeight:1.7 }}>
                {platform === "instagram" && "• Post between 6-9 PM for best reach\n• Use 5-10 hashtags for optimal visibility\n• Reels get 3x more reach than photos"}
                {platform === "facebook" && "• Post at 9 AM or 1-4 PM\n• Videos get 6x more engagement\n• Ask questions to boost comments"}
                {platform === "twitter" && "• Tweet 1-5 times per day\n• Use 1-2 hashtags only\n• Threads perform 2x better"}
                {platform === "linkedin" && "• Post on weekdays 8-10 AM\n• Long-form content performs best\n• Share industry insights for more reach"}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// ANALYTICS VIEW
// ══════════════════════════════════════════════
function AnalyticsView({ store, posts }) {
  const [period, setPeriod] = useState("6m");
  const storePosts = posts.filter(p => p.storeId === store.id && p.status === "published");
  const totalLikes = storePosts.reduce((a,p)=>a+p.likes,0);
  const totalReach = storePosts.reduce((a,p)=>a+p.reach,0);
  const totalComments = storePosts.reduce((a,p)=>a+p.comments,0);
  const avgEngagement = store.engagement;

  return (
    <div>
      <Header title="Analytics" store={store} actions={
        <div style={{ display:"flex", gap:4, background:T.card, border:`0.5px solid ${T.border}`, borderRadius:9, padding:3 }}>
          {["1m","3m","6m","1y"].map(p => (
            <div key={p} onClick={() => setPeriod(p)} style={{ padding:"4px 12px", borderRadius:7, fontSize:12, cursor:"pointer", background: period===p ? T.primary : "transparent", color: period===p ? "#fff" : T.sub, transition:"all 0.15s" }}>
              {p}
            </div>
          ))}
        </div>
      } />

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        <StatCard label="Total Reach" value={fmtNum(totalReach)} icon={Eye} color={T.cyan} trend={12.3} />
        <StatCard label="Total Likes" value={fmtNum(totalLikes)} icon={Heart} color={T.pink} trend={8.7} />
        <StatCard label="Comments" value={fmtNum(totalComments)} icon={MessageCircle} color={T.amber} trend={5.2} />
        <StatCard label="Avg Engagement" value={`${avgEngagement}%`} icon={TrendingUp} color={T.green} trend={2.1} />
      </div>

      {/* Growth chart */}
      <Card style={{ padding:"1.25rem", marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:500, color:T.text, marginBottom:2 }}>Follower Growth</div>
            <div style={{ fontSize:12, color:T.sub }}>Audience growth over time</div>
          </div>
          <div style={{ display:"flex", gap:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:T.sub }}><div style={{ width:8, height:2, background:T.primary, borderRadius:1 }} /> Followers</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={GROWTH_DATA} margin={{ top:0, right:10, bottom:0, left:-20 }}>
            <XAxis dataKey="month" tick={{ fill:T.muted, fontSize:11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:T.muted, fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>fmtNum(v)} />
            <Tooltip contentStyle={{ background:T.card, border:`0.5px solid ${T.border}`, borderRadius:8, color:T.text, fontSize:12 }} />
            <Line type="monotone" dataKey="followers" stroke={T.primary} strokeWidth={2.5} dot={{ fill:T.primary, r:4 }} activeDot={{ r:6 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        {/* Engagement trend */}
        <Card style={{ padding:"1.25rem" }}>
          <div style={{ fontSize:14, fontWeight:500, color:T.text, marginBottom:4 }}>Engagement Rate</div>
          <div style={{ fontSize:12, color:T.sub, marginBottom:16 }}>Monthly average %</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={GROWTH_DATA} margin={{ top:0, right:0, bottom:0, left:-25 }}>
              <defs>
                <linearGradient id="eGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={T.green} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={T.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill:T.muted, fontSize:10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:T.muted, fontSize:10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background:T.card, border:`0.5px solid ${T.border}`, borderRadius:8, color:T.text, fontSize:12 }} />
              <Area type="monotone" dataKey="engagement" stroke={T.green} strokeWidth={2} fill="url(#eGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Platform breakdown */}
        <Card style={{ padding:"1.25rem" }}>
          <div style={{ fontSize:14, fontWeight:500, color:T.text, marginBottom:4 }}>Platform Breakdown</div>
          <div style={{ fontSize:12, color:T.sub, marginBottom:16 }}>Posts by platform</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {store.platforms.map(p => {
              const pl = PLATFORMS[p];
              const cnt = storePosts.filter(x=>x.platform===p).length;
              const pct = storePosts.length ? Math.round((cnt/storePosts.length)*100) : 0;
              return (
                <div key={p}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <pl.Icon size={13} color={pl.color} />
                      <span style={{ fontSize:12, color:T.text }}>{pl.name}</span>
                    </div>
                    <span style={{ fontSize:12, color:T.sub }}>{pct}%</span>
                  </div>
                  <div style={{ height:6, borderRadius:3, background:T.dark, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${pct}%`, borderRadius:3, background:pl.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Best performing posts */}
      <Card style={{ padding:"1.25rem" }}>
        <div style={{ fontSize:14, fontWeight:500, color:T.text, marginBottom:16 }}>Top Performing Posts</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {storePosts.sort((a,b)=>b.reach-a.reach).slice(0,4).map(post => (
            <div key={post.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 12px", background:T.dark, borderRadius:10, border:`0.5px solid ${T.border}` }}>
              <div style={{ width:34, height:34, borderRadius:9, background:`${PLATFORMS[post.platform]?.color}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {PLATFORMS[post.platform] && <PLATFORMS[post.platform].Icon size={15} color={PLATFORMS[post.platform].color} />}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, color:T.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{post.caption}</div>
                <div style={{ fontSize:11, color:T.muted }}>{post.date}</div>
              </div>
              <div style={{ display:"flex", gap:14, flexShrink:0 }}>
                <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:12, color:T.sub }}><Eye size={11} /> {fmtNum(post.reach)}</span>
                <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:12, color:T.sub }}><Heart size={11} /> {fmtNum(post.likes)}</span>
                <span style={{ display:"flex", alignItems:"center", gap:3, fontSize:12, color:T.sub }}><MessageCircle size={11} /> {post.comments}</span>
              </div>
            </div>
          ))}
          {storePosts.length === 0 && (
            <div style={{ textAlign:"center", padding:"20px 0", color:T.muted, fontSize:13 }}>No published posts yet.</div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════
// SETTINGS VIEW
// ══════════════════════════════════════════════
function SettingsView({ store }) {
  const [saved, setSaved] = useState(false);
  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }
  return (
    <div>
      <Header title="Settings" store={store} />
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Profile */}
          <Card style={{ padding:"1.5rem" }}>
            <div style={{ fontSize:14, fontWeight:500, color:T.text, marginBottom:16 }}>Account Settings</div>
            <div style={{ display:"grid", gap:12 }}>
              {[["Full Name","Admin User"],["Email","admin@socialflow.ai"],["Business Name","SocialFlow Agency"],["Phone","+91 98765 43210"]].map(([label, val]) => (
                <div key={label}>
                  <label style={{ fontSize:12, color:T.sub, display:"block", marginBottom:5 }}>{label}</label>
                  <input defaultValue={val} style={{ width:"100%", background:T.dark, border:`0.5px solid ${T.border}`, borderRadius:8, padding:"9px 12px", color:T.text, fontSize:13, outline:"none", boxSizing:"border-box" }} />
                </div>
              ))}
            </div>
            <Btn onClick={save} style={{ marginTop:16 }}>
              {saved ? <><Check size={14} color={T.green} /> Saved!</> : "Save Changes"}
            </Btn>
          </Card>

          {/* Platform connections */}
          <Card style={{ padding:"1.5rem" }}>
            <div style={{ fontSize:14, fontWeight:500, color:T.text, marginBottom:16 }}>Connected Platforms</div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {Object.entries(PLATFORMS).map(([key, pl]) => {
                const connected = store.platforms.includes(key);
                return (
                  <div key={key} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:T.dark, borderRadius:10, border:`0.5px solid ${connected ? `${pl.color}40` : T.border}` }}>
                    <div style={{ width:36, height:36, borderRadius:9, background:`${pl.color}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <pl.Icon size={18} color={pl.color} />
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:500, color:T.text }}>{pl.name}</div>
                      <div style={{ fontSize:11, color: connected ? T.green : T.muted }}>
                        {connected ? "✓ Connected" : "Not connected"}
                      </div>
                    </div>
                    <Btn variant={connected ? "ghost" : "primary"} style={{ padding:"5px 14px", fontSize:12 }}>
                      {connected ? "Disconnect" : "Connect"}
                    </Btn>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right: Subscription */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <Card style={{ padding:"1.5rem" }}>
            <div style={{ fontSize:14, fontWeight:500, color:T.text, marginBottom:4 }}>Current Plan</div>
            <div style={{ padding:"16px", background:`${T.primary}15`, border:`0.5px solid ${T.primary}40`, borderRadius:12, marginBottom:14, marginTop:10 }}>
              <div style={{ fontSize:22, fontWeight:700, color:T.primary, marginBottom:2 }}>Pro Plan</div>
              <div style={{ fontSize:24, fontWeight:600, color:T.text }}>₹999<span style={{ fontSize:13, fontWeight:400, color:T.sub }}>/month</span></div>
              <div style={{ fontSize:11, color:T.sub, marginTop:4 }}>Billed monthly · Next: June 1, 2025</div>
            </div>
            {["Up to 5 stores","Unlimited posts","AI content generator","Analytics dashboard","Priority support"].map(f => (
              <div key={f} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:T.sub, marginBottom:8 }}>
                <CheckCircle2 size={13} color={T.green} /> {f}
              </div>
            ))}
            <Btn style={{ width:"100%", justifyContent:"center", marginTop:12, background:`linear-gradient(135deg,${T.primary},${T.cyan})`, border:"none" }}>
              Upgrade to Agency
            </Btn>
          </Card>

          <Card style={{ padding:"1.5rem" }}>
            <div style={{ fontSize:14, fontWeight:500, color:T.text, marginBottom:12 }}>Notifications</div>
            {[["Post published","When posts go live"],["Weekly report","Every Monday 9 AM"],["Engagement alerts","When post goes viral"],["New followers","Daily summary"]].map(([label, desc]) => (
              <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`0.5px solid ${T.border}` }}>
                <div>
                  <div style={{ fontSize:12, color:T.text }}>{label}</div>
                  <div style={{ fontSize:11, color:T.muted }}>{desc}</div>
                </div>
                <div style={{ width:36, height:20, borderRadius:10, background:T.primary, cursor:"pointer", position:"relative" }}>
                  <div style={{ position:"absolute", right:2, top:2, width:16, height:16, borderRadius:8, background:"#fff" }} />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════
export default function App() {
  const [view, setView] = useState("dashboard");
  const [stores, setStores] = useState(INIT_STORES);
  const [store, setStore] = useState(INIT_STORES[0]);
  const [posts, setPosts] = useState(INIT_POSTS);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display:"flex", height:"100vh", background:T.bg, color:T.text, fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif", overflow:"hidden" }}>
      <style>{`
        * { box-sizing: border-box; }
        input, textarea, select { color-scheme: dark; }
        input::placeholder, textarea::placeholder { color: #475569; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2d3554; border-radius: 2px; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <Sidebar
        view={view} setView={setView}
        store={store} setStore={setStore}
        stores={stores}
        collapsed={collapsed} setCollapsed={setCollapsed}
      />

      <main style={{ flex:1, overflow:"auto", padding:"28px 32px" }}>
        {view === "dashboard" && <DashboardView store={store} posts={posts} setView={setView} />}
        {view === "stores" && <StoresView stores={stores} setStores={setStores} setStore={setStore} setView={setView} />}
        {view === "calendar" && <CalendarView store={store} posts={posts} setView={setView} setPosts={setPosts} />}
        {view === "create" && <CreatePostView store={store} posts={posts} setPosts={setPosts} />}
        {view === "analytics" && <AnalyticsView store={store} posts={posts} />}
        {view === "settings" && <SettingsView store={store} />}
      </main>
    </div>
  );
}
