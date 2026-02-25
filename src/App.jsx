import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";

// ─── JWT ──────────────────────────────────
const JWT={
  b64u:s=>btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''),
  b64d:s=>{try{return atob(s.replace(/-/g,'+').replace(/_/g,'/'));}catch{return null;}},
  SK:"SM_2025",
  sign(p,ex=3600000){const h=this.b64u(JSON.stringify({alg:"HS256",typ:"JWT"}));const b=this.b64u(JSON.stringify({...p,iat:Date.now(),exp:Date.now()+ex}));return`${h}.${b}.${this.b64u(this.SK+"."+h+"."+b)}`;},
  verify(t){if(!t)return null;try{const[h,p,s]=t.split(".");const d=JSON.parse(this.b64d(p));if(d.exp<Date.now())return null;if(s!==this.b64u(this.SK+"."+h+"."+p))return null;return d;}catch{return null;}},
  needsRefresh(t){const p=this.verify(t);return p?(p.exp-Date.now())<900000:false;}
};
const AuthCtx=createContext(null);
const useAuth=()=>useContext(AuthCtx);
function AuthProvider({children}){
  const[token,setToken]=useState(null);const[user,setUser]=useState(null);
  const[creds,setCreds]=useState({salah:{password:"admin123",role:"admin",name:"Salah Mohammed"}});
  useEffect(()=>{if(token){const p=JWT.verify(token);p?setUser(p):(setToken(null),setUser(null));}},[token]);
  useEffect(()=>{if(!token)return;const iv=setInterval(()=>{if(JWT.needsRefresh(token)){const p=JWT.verify(token);if(p)setToken(JWT.sign({sub:p.sub,role:p.role,name:p.name}));}if(!JWT.verify(token)){setToken(null);setUser(null);}},60000);return()=>clearInterval(iv);},[token]);
  const login=useCallback((u,pw)=>{const c=creds[u.toLowerCase()];if(!c||c.password!==pw)return{ok:false};const t=JWT.sign({sub:u,role:c.role,name:c.name});setToken(t);setUser(JWT.verify(t));return{ok:true};},[creds]);
  const changePw=useCallback((cur,nw)=>{if(!user)return{ok:false,err:"Not auth"};const c=creds[user.sub.toLowerCase()];if(!c||c.password!==cur)return{ok:false,err:"Wrong current password"};if(nw.length<6)return{ok:false,err:"Min 6 chars"};setCreds(p=>({...p,[user.sub.toLowerCase()]:{...c,password:nw}}));return{ok:true};},[user,creds]);
  const logout=useCallback(()=>{setToken(null);setUser(null);},[]);
  return (<AuthCtx.Provider value={{token,user,login,logout,changePw,isAuth:!!user}}>{children}</AuthCtx.Provider>);
}

// ─── THEME ────────────────────────────────
const ThemeCtx=createContext(null);
const useTheme=()=>useContext(ThemeCtx);
const PRESETS=[
  {name:"Rose",primary:"#FF4081",secondary:"#FF80AB",nav:"#880E4F"},
  {name:"Indigo",primary:"#6C63FF",secondary:"#B388FF",nav:"#311B92"},
  {name:"Cyan",primary:"#00BCD4",secondary:"#84FFFF",nav:"#006064"},
  {name:"Orange",primary:"#FF6D00",secondary:"#FFAB40",nav:"#BF360C"},
  {name:"Green",primary:"#4CAF50",secondary:"#69F0AE",nav:"#1B5E20"},
  {name:"Purple",primary:"#9C27B0",secondary:"#EA80FC",nav:"#4A148C"},
  {name:"Blue",primary:"#2196F3",secondary:"#82B1FF",nav:"#0D47A1"},
  {name:"Teal",primary:"#009688",secondary:"#A7FFEB",nav:"#004D40"},
];

function getTheme(dark,colors){
  const{primary,secondary,accent2,navColor,contactBgColor,footerBgColor}=colors;
  return dark?{
    bg:"#0a0a0f",bg2:"#12121a",bg3:"#1a1a2e",card:"#12121a",text:"#e0e0e0",text2:"#aaa",text3:"#666",
    border:"rgba(255,255,255,.08)",primary,secondary,accent2:accent2||secondary,
    navBg:navColor||"rgba(10,10,15,.85)",inputBg:"#0a0a0f",inputBorder:"rgba(255,255,255,.12)",
    tagBg:`${primary}18`,tagColor:primary,shadow:"rgba(0,0,0,.3)",
    contactBg:contactBgColor||primary,footerBg:footerBgColor||"#06060a",footerText:"#555",dark:true,
  }:{
    bg:"#FAFAFA",bg2:"#fff",bg3:"#f5f5f5",card:"#fff",text:"#222",text2:"#666",text3:"#999",
    border:"#eee",primary,secondary,accent2:accent2||secondary,
    navBg:navColor||"rgba(255,255,255,.95)",inputBg:"#fff",inputBorder:"#ddd",
    tagBg:`${primary}12`,tagColor:primary,shadow:"rgba(0,0,0,.06)",
    contactBg:contactBgColor||primary,footerBg:footerBgColor||"#222",footerText:"#888",dark:false,
  };
}

// ─── ALL FLOATING SKILL OPTIONS ───────────
const ALL_FLOAT_SKILLS=[
  {id:"dotnet",label:".NET",icon:"⚙️"},
  {id:"csharp",label:"C#",icon:"#️⃣"},
  {id:"sql",label:"SQL",icon:"🗄️"},
  {id:"docker",label:"Docker",icon:"🐳"},
  {id:"redis",label:"Redis",icon:"⚡"},
  {id:"graphql",label:"GraphQL",icon:"◈"},
  {id:"rabbitmq",label:"RabbitMQ",icon:"🐇"},
  {id:"angular",label:"Angular",icon:"🅰️"},
  {id:"js",label:"JavaScript",icon:"📜"},
  {id:"html",label:"HTML5",icon:"🌐"},
  {id:"css",label:"CSS3",icon:"🎨"},
  {id:"git",label:"Git",icon:"🔀"},
  {id:"elastic",label:"Elastic",icon:"🔍"},
  {id:"api",label:"REST API",icon:"🔌"},
  {id:"agile",label:"Agile",icon:"🔄"},
  {id:"postgres",label:"Postgres",icon:"🐘"},
  {id:"oracle",label:"Oracle",icon:"☁️"},
  {id:"kibana",label:"Kibana",icon:"📊"},
  {id:"linq",label:"LINQ",icon:"🔗"},
  {id:"ef",label:"EF Core",icon:"💾"},
  {id:"patterns",label:"Patterns",icon:"🧩"},
  {id:"micro",label:"Microservices",icon:"🧱"},
  {id:"bpm",label:"BPM",icon:"📋"},
  {id:"cicd",label:"CI/CD",icon:"🚀"},
];

const FLOAT_POSITIONS=[
  {x:"-12%",y:"8%"},{x:"88%",y:"5%"},{x:"92%",y:"40%"},{x:"85%",y:"72%"},
  {x:"-8%",y:"65%"},{x:"5%",y:"90%"},{x:"75%",y:"92%"},{x:"-15%",y:"35%"},
  {x:"50%",y:"-5%"},{x:"-5%",y:"92%"},
];

// ─── ICONS ────────────────────────────────
const Ic={
  Mail:()=><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="16" height="12" rx="2"/><path d="M2 4l8 5 8-5"/></svg>,
  Phone:()=><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2A19.86 19.86 0 013.09 5.18 2 2 0 015.11 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 11.91a16 16 0 006 6l2.27-2.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  Pin:()=><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>,
  Ln:()=><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  Edit:()=><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Plus:()=><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 2v12M2 8h12"/></svg>,
  Trash:()=><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h10M12 6v8a1 1 0 01-1 1H5a1 1 0 01-1-1V6m2 0V4a1 1 0 011-1h2a1 1 0 011 1v2"/></svg>,
  Save:()=><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2H4a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V4l-2-2z"/><path d="M10 2v4H6V2M4 10h8"/></svg>,
  Back:()=><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>,
  Lock:()=><svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="5" y="10" width="12" height="9" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/></svg>,
  Shield:()=><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 1l7 3v5c0 4.5-3 8-7 9.5C5 17.5 2 13.5 2 9V4l7-3z"/><path d="M6 9l2 2 4-4"/></svg>,
  Eye:()=><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 9s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"/><circle cx="9" cy="9" r="2.5"/></svg>,
  EyeOff:()=><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 14A6.5 6.5 0 011 9s2-5 8-5c1 0 2 .3 3 .8M17 9s-.7 1.2-2 2.5M1 1l16 16"/></svg>,
  Logout:()=><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 15H3a1 1 0 01-1-1V4a1 1 0 011-1h3M10 12l3-3-3-3M13 9H5"/></svg>,
  Alert:()=><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 1L1 16h16L9 1zM9 6v4M9 13h.01"/></svg>,
  Key:()=><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="8" cy="8" r="3"/><path d="M11 11l5 5M14 14l2-2"/></svg>,
  Dash:()=><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  User:()=><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 18v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="10" cy="7" r="4"/></svg>,
  Briefcase:()=><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="16" height="11" rx="2"/><path d="M7 7V5a2 2 0 012-2h2a2 2 0 012 2v2"/></svg>,
  Code:()=><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 8l-4 4 4 4M13 8l4 4-4 4"/></svg>,
  Grad:()=><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 10l8-4 8 4-8 4-8-4zM6 12v4c0 1 2 3 4 3s4-2 4-3v-4"/></svg>,
  Layers:()=><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 10l8 4 8-4M2 14l8 4 8-4M2 6l8 4 8-4-8-4-8 4z"/></svg>,
  Sun:()=><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="10" cy="10" r="4"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42"/></svg>,
  Moon:()=><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 12.5A7.5 7.5 0 117.5 3 5.5 5.5 0 0017 12.5z"/></svg>,
  Palette:()=><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="10" cy="10" r="8"/><circle cx="10" cy="6" r="1.2" fill="currentColor"/><circle cx="6.5" cy="9" r="1.2" fill="currentColor"/><circle cx="8" cy="13" r="1.2" fill="currentColor"/><circle cx="13" cy="12" r="1.2" fill="currentColor"/></svg>,
  Sparkle:()=><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg>,
  Check:()=><svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><path d="M2 7l3 3 7-7"/></svg>,
};

// ─── DATA ─────────────────────────────────
const initData={
  personal:{name:"Salah Mohammed",title:"Senior .NET Developer",subtitle:"I build high-performance, scalable applications that power businesses across the globe.",email:"salahmohammed_fci@outlook.com",phone:"+20 101 845 0425",location:"Giza, Egypt",linkedin:"https://www.linkedin.com/in/salah-mohammed-salah/",github:"https://github.com/salah-mohammed",bio:"With 4+ years crafting enterprise-grade solutions in FinTech, e-commerce, and integration systems, I turn complex business challenges into elegant, scalable software. From payment super-apps serving three countries to real-time book distribution platforms — I architect systems that perform under pressure.",photoUrl:"",tagline:"You've got the vision.\nI'll build the tech behind it."},
  experience:[
    {id:1,role:"Senior Software Development Engineer",company:"PaySky Egypt",period:"Jun 2024 – Present",type:"Full-Time",desc:"Leading development on Yalla Super App — a comprehensive payment platform with money transfers, chat, and 3rd-party integrations across Egypt, Emirates, and Pakistan.",techs:".NET Core, RabbitMQ, Redis, GraphQL, Elasticsearch, Docker, Angular, SQL Server"},
    {id:2,role:"Senior Software Development Engineer",company:"Iucon Egypt",period:"Jan 2022 – Jun 2024",type:"Full-Time",desc:"Built Datahub and Approval Plan systems — streamlining book title imports into Elasticsearch with GraphQL APIs.",techs:".NET Core, RabbitMQ, Elasticsearch, GraphQL, Oracle DB, SQL Server, Angular"},
    {id:3,role:"Software Development Engineer",company:"Tribal Credit",period:"May 2021 – Jan 2022",type:"Full-Time",desc:"Developed modern financial tools for startups — corporate cards and advanced spending controls.",techs:".NET Framework, SQL Server, Entity Framework, Web API, Windows Forms"},
    {id:4,role:"Integration Development Engineer",company:"Youxel Technology",period:"Feb 2021 – May 2021",type:"Full-Time",desc:"Built integration solutions using WebMethods for GAZT — automating HR processes with BPM.",techs:"WebMethods, Oracle DB, BPM, REST APIs"},
    {id:5,role:"Full-Stack Developer (.NET)",company:"Deqqa for Software Solutions",period:"Sep 2020 – Feb 2021",type:"Full-Time",desc:"Developed full-stack web applications using ASP.NET Core MVC with Postgres and EF Core.",techs:"ASP.NET Core, MVC, Postgres, EF Core, REST APIs"},
  ],
  projects:[
    {id:1,name:"Yalla Super App",desc:"Comprehensive payment app with money transfers, chat, and 3rd-party integrations across 3 countries.",techs:"RabbitMQ, Redis, Elasticsearch, GraphQL, .NET Core, SQL Server"},
    {id:2,name:"Datahub",desc:"Streamlines book title imports into unified Elasticsearch indices with GraphQL API.",techs:"RabbitMQ, Elasticsearch, GraphQL, .NET Core, SQL Server"},
    {id:3,name:"Newsbooks Solutions",desc:"E-commerce connecting booksellers, publishers, and users for seamless title management.",techs:".NET Core, SQL Server, Oracle, Elasticsearch, jQuery, Bootstrap"},
    {id:4,name:"Approval Plan",desc:"Newsletter system for German booksellers and publishers with Elasticsearch title records.",techs:".NET Framework, SQL Server, Elasticsearch, EF, jQuery"},
    {id:5,name:"Tribal Platform",desc:"Financial tools for startups with corporate cards and spending controls.",techs:".NET Framework, SQL Server, EF, Web API, Windows Forms"},
    {id:6,name:"Citation Index",desc:"Citation process management with .NET Core and Postgres.",techs:".NET Core, Postgres, EF, Web API"},
  ],
  skills:[
    {id:1,category:"Backend",items:".NET Core, ASP.NET Core, ASP.NET Web API, C#, GraphQL, RabbitMQ, Redis"},
    {id:2,category:"Frontend",items:"HTML5, CSS3, JavaScript, jQuery, Bootstrap, AngularJS"},
    {id:3,category:"Database",items:"SQL Server, PostgreSQL, Oracle, Elasticsearch, LINQ, EF Core"},
    {id:4,category:"DevOps & Tools",items:"Docker, Git, Kibana, Agile/Scrum, CI/CD"},
    {id:5,category:"Architecture",items:"Design Patterns, Distributed Systems, Microservices, REST APIs, SDLC"},
    {id:6,category:"Integration",items:"WebMethods, BPM, 3rd Party Integrations, Service Development"},
  ],
  education:[
    {id:1,degree:"BSc in Information Systems",school:"Fayoum University — Faculty of Computers and Information",period:"Sep 2014 – Jun 2018",grade:"Very Good"},
    {id:2,degree:"Full-Stack Web Development (.NET)",school:"ITI — Intensive Training Program",period:"Sep 2020 – Dec 2020",grade:"Completed"},
  ],
};

// ─── LOGIN ────────────────────────────────
function LoginPage({onNav}){
  const{login}=useAuth();const T=useTheme();
  const[u,setU]=useState("");const[pw,setPw]=useState("");const[show,setShow]=useState(false);
  const[err,setErr]=useState("");const[loading,setLoading]=useState(false);
  const[att,setAtt]=useState(0);const[locked,setLocked]=useState(false);const[timer,setTimer]=useState(0);
  useEffect(()=>{if(locked&&timer>0){const t=setTimeout(()=>setTimer(v=>v-1),1000);return()=>clearTimeout(t);}if(locked&&timer<=0){setLocked(false);setAtt(0);}},[locked,timer]);
  const submit=async()=>{if(locked)return;if(!u.trim()||!pw.trim()){setErr("Enter both fields");return;}setLoading(true);setErr("");await new Promise(r=>setTimeout(r,500));const res=login(u.trim(),pw);setLoading(false);if(res.ok)onNav("admin");else{const n=att+1;setAtt(n);if(n>=5){setLocked(true);setTimer(30);setErr("Locked 30s.");}else setErr(`Invalid. ${5-n} left.`);}};
  const inp={width:"100%",padding:"12px 14px",borderRadius:10,border:`1px solid ${T.inputBorder}`,background:T.inputBg,color:T.text,fontSize:".9rem",outline:"none",fontFamily:"inherit"};
  return (
    <div style={{background:T.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <div style={{width:400,padding:"2.5rem",background:T.card,borderRadius:24,border:`1px solid ${T.border}`,boxShadow:`0 20px 60px ${T.shadow}`}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{width:56,height:56,borderRadius:"50%",background:T.primary,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 1rem",color:"#fff"}}><Ic.Lock/></div>
          <h1 style={{fontSize:"1.4rem",fontWeight:800,color:T.text}}>Admin Login</h1>
          <p style={{color:T.text3,fontSize:".82rem"}}>Enter credentials to access dashboard</p>
        </div>
        {err&&<div style={{padding:"10px",borderRadius:10,background:T.dark?"rgba(255,70,70,.1)":"#FFF0F0",border:"1px solid rgba(255,70,70,.2)",marginBottom:"1rem",color:"#E53935",fontSize:".85rem",display:"flex",gap:8,alignItems:"center"}}><Ic.Alert/>{err}</div>}
        <div style={{display:"grid",gap:"1rem"}}>
          <div><label style={{fontSize:".78rem",color:T.text3,display:"block",marginBottom:4,fontWeight:600}}>Username</label><input value={u} onChange={e=>setU(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Username" disabled={locked||loading} style={{...inp,opacity:locked?.5:1}}/></div>
          <div><label style={{fontSize:".78rem",color:T.text3,display:"block",marginBottom:4,fontWeight:600}}>Password</label><div style={{position:"relative"}}><input type={show?"text":"password"} value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Password" disabled={locked||loading} style={{...inp,paddingRight:44,opacity:locked?.5:1}}/><button onClick={()=>setShow(!show)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:T.text3,cursor:"pointer"}}>{show?<Ic.EyeOff/>:<Ic.Eye/>}</button></div></div>
          <button onClick={submit} disabled={locked||loading} style={{width:"100%",padding:13,borderRadius:12,background:locked?"#888":T.primary,color:"#fff",border:"none",cursor:locked?"not-allowed":"pointer",fontWeight:700,fontSize:".95rem",opacity:loading?.7:1,fontFamily:"inherit"}}>{loading?"Authenticating...":locked?`Locked (${timer}s)`:"Sign In"}</button>
        </div>
        <button onClick={()=>onNav("portfolio")} style={{display:"flex",alignItems:"center",gap:6,margin:"1.5rem auto 0",background:"none",border:"none",color:T.text3,cursor:"pointer",fontSize:".82rem"}}><Ic.Back/> Back to Portfolio</button>
      </div>
    </div>
  );
}

// ─── PORTFOLIO ────────────────────────────
function Portfolio({data,onNav,floatingSkills}){
  const{isAuth}=useAuth();const T=useTheme();
  const[scrolled,setScrolled]=useState(false);
  useEffect(()=>{const h=()=>setScrolled(window.scrollY>50);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);},[]);
  const go=id=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  const SH=({tag,title})=>(<div style={{textAlign:"center",marginBottom:"3rem"}}><span style={{color:T.primary,fontSize:".8rem",fontWeight:800,textTransform:"uppercase",letterSpacing:3}}>{tag}</span><h2 style={{fontSize:"2.2rem",fontWeight:900,color:T.text,marginTop:8}}>{title}</h2><div style={{width:60,height:4,background:`linear-gradient(90deg,${T.primary},${T.secondary})`,borderRadius:2,margin:"12px auto 0"}}/></div>);

  const activeFloats=ALL_FLOAT_SKILLS.filter(s=>floatingSkills.includes(s.id));

  return (
    <div style={{background:T.bg,color:T.text,fontFamily:"'Segoe UI',system-ui,sans-serif",minHeight:"100vh"}}>
      <nav style={{position:"fixed",top:0,width:"100%",padding:scrolled?".6rem 2rem":".9rem 2rem",display:"flex",justifyContent:"space-between",alignItems:"center",background:scrolled?T.navBg:"transparent",backdropFilter:scrolled?"blur(12px)":"none",borderBottom:scrolled?`1px solid ${T.border}`:"none",zIndex:100,transition:"all .4s"}}>
        <div style={{fontSize:"1.4rem",fontWeight:900,color:T.text}}>Salah<span style={{color:T.primary}}>.</span>dev</div>
        <div style={{display:"flex",gap:"1.8rem",alignItems:"center"}}>
          {["about","experience","projects","skills","contact"].map(n=><a key={n} onClick={()=>go(n)} style={{color:T.text2,textDecoration:"none",fontSize:".82rem",cursor:"pointer",textTransform:"uppercase",fontWeight:700,letterSpacing:"1px"}} onMouseOver={e=>e.target.style.color=T.primary} onMouseOut={e=>e.target.style.color=T.text2}>{n}</a>)}
          <button onClick={()=>onNav(isAuth?"admin":"login")} style={{background:`linear-gradient(135deg,${T.primary},${T.secondary})`,border:"none",color:"#fff",padding:"7px 18px",borderRadius:50,fontSize:".78rem",cursor:"pointer",fontWeight:700,display:"flex",alignItems:"center",gap:6}}>{isAuth?<><Ic.Dash/> DASHBOARD</>:<><Ic.Lock/> ADMIN</>}</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",padding:"0 4rem",paddingTop:80,position:"relative",overflow:"hidden",maxWidth:1400,margin:"0 auto"}}>
        <div style={{flex:"0 0 42%",display:"flex",justifyContent:"center",position:"relative"}}>
          {data.personal.photoUrl ? <img src={data.personal.photoUrl} alt="" style={{width:"100%",maxWidth:400,aspectRatio:"3/4",borderRadius:30,objectFit:"cover",position:"relative",zIndex:2}}/> : <div style={{width:"100%",maxWidth:400,aspectRatio:"3/4",borderRadius:30,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"8rem",fontWeight:900,color:T.primary,opacity:.2,background:T.bg3,position:"relative",zIndex:2}}>SM</div>}
          {activeFloats.map((s,i)=>{
            const pos=FLOAT_POSITIONS[i%FLOAT_POSITIONS.length];
            return (
              <div key={s.id} style={{position:"absolute",left:pos.x,top:pos.y,zIndex:3,background:T.card,borderRadius:12,padding:"6px 12px",display:"flex",alignItems:"center",gap:6,boxShadow:`0 4px 20px ${T.shadow}`,border:`1px solid ${T.border}`,animation:`float${i%2===0?'A':'B'} 3s ease-in-out infinite`,animationDelay:`${i*0.4}s`,whiteSpace:"nowrap"}}>
                <span style={{fontSize:"1rem"}}>{s.icon}</span>
                <span style={{fontSize:".72rem",fontWeight:700,color:T.text}}>{s.label}</span>
              </div>
            );
          })}
          <style>{`@keyframes floatA{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}@keyframes floatB{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}`}</style>
        </div>
        <div style={{flex:1,paddingLeft:"4rem"}}>
          <h1 style={{fontSize:"clamp(2.2rem,4.5vw,3.8rem)",fontWeight:900,lineHeight:1.1,color:T.text,marginBottom:".5rem",letterSpacing:"-1px"}}>{data.personal.tagline?.split("\n")[0]}</h1>
          <h2 style={{fontSize:"clamp(1.2rem,2.5vw,2rem)",fontWeight:900,background:`linear-gradient(135deg,${T.primary},${T.secondary})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1.2,marginBottom:"1.5rem",textTransform:"uppercase",letterSpacing:"1px"}}>{data.personal.tagline?.split("\n")[1]}</h2>
          <p style={{fontSize:"1.05rem",color:T.text2,lineHeight:1.7,maxWidth:480,marginBottom:"1.5rem"}}>{data.personal.subtitle}</p>
          <p style={{fontSize:".9rem",color:T.text3,marginBottom:"2rem",fontStyle:"italic"}}>Senior .NET Developer • 4+ years • FinTech & Enterprise</p>
          <div style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
            <button onClick={()=>go("contact")} style={{padding:"13px 32px",borderRadius:50,background:`linear-gradient(135deg,${T.primary},${T.secondary})`,color:"#fff",fontWeight:800,fontSize:".9rem",border:"none",cursor:"pointer",textTransform:"uppercase",letterSpacing:".5px",boxShadow:`0 4px 20px ${T.primary}44`}}>Let's Work Together →</button>
            <button onClick={()=>go("projects")} style={{padding:"13px 32px",borderRadius:50,background:"transparent",color:T.text,fontWeight:700,fontSize:".9rem",border:`2px solid ${T.border}`,cursor:"pointer"}} onMouseOver={e=>{e.currentTarget.style.borderColor=T.primary;e.currentTarget.style.color=T.primary;}} onMouseOut={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.text;}}>View My Work</button>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" style={{maxWidth:1100,margin:"0 auto",padding:"6rem 2rem"}}>
        <SH tag="About Me" title="The Developer Behind the Code"/>
        <div style={{maxWidth:700,margin:"0 auto",textAlign:"center"}}>
          <p style={{fontSize:"1.05rem",color:T.text2,lineHeight:1.8}}>{data.personal.bio}</p>
          <div style={{display:"flex",justifyContent:"center",gap:"3rem",marginTop:"2.5rem",flexWrap:"wrap"}}>
            {[{n:"4+",l:"Years"},{n:"6+",l:"Projects"},{n:"5+",l:"Companies"},{n:"3",l:"Countries"}].map(s=><div key={s.l}><div style={{fontSize:"2.5rem",fontWeight:900,background:`linear-gradient(135deg,${T.primary},${T.secondary})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{s.n}</div><div style={{fontSize:".8rem",color:T.text3,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>{s.l}</div></div>)}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" style={{background:T.bg2,padding:"6rem 2rem"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <SH tag="Career" title="Work Experience"/>
          {data.experience.map((x,i)=>(
            <div key={x.id} style={{display:"flex",gap:"2rem",marginBottom:"2.5rem"}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
                <div style={{width:16,height:16,borderRadius:"50%",background:i===0?`linear-gradient(135deg,${T.primary},${T.secondary})`:T.bg3,border:i===0?"none":`3px solid ${T.primary}`,flexShrink:0}}/>{i<data.experience.length-1&&<div style={{width:2,flex:1,background:T.border,marginTop:4}}/>}
              </div>
              <div style={{flex:1,paddingBottom:"1rem"}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}><div><h3 style={{fontSize:"1.1rem",fontWeight:800,color:T.text}}>{x.role}</h3><p style={{color:T.primary,fontWeight:700,fontSize:".9rem"}}>{x.company}</p></div><span style={{fontSize:".78rem",color:T.text3,background:T.bg3,padding:"4px 14px",borderRadius:50,fontWeight:600}}>{x.period}</span></div>
                <p style={{color:T.text2,fontSize:".88rem",lineHeight:1.6,margin:"8px 0 10px"}}>{x.desc}</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{x.techs.split(",").map((t,j)=><span key={j} style={{fontSize:".72rem",padding:"3px 10px",borderRadius:50,background:T.tagBg,color:T.tagColor,fontWeight:600}}>{t.trim()}</span>)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" style={{maxWidth:1100,margin:"0 auto",padding:"6rem 2rem"}}>
        <SH tag="Portfolio" title="Featured Projects"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))",gap:"1.5rem"}}>
          {data.projects.map(p=>(
            <div key={p.id} style={{background:T.card,borderRadius:20,padding:"2rem",boxShadow:`0 2px 20px ${T.shadow}`,border:`1px solid ${T.border}`,transition:"all .3s",cursor:"pointer",position:"relative",overflow:"hidden"}} onMouseOver={e=>e.currentTarget.style.transform="translateY(-6px)"} onMouseOut={e=>e.currentTarget.style.transform="translateY(0)"}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:`linear-gradient(90deg,${T.primary},${T.secondary})`}}/>
              <h3 style={{fontSize:"1.05rem",fontWeight:800,color:T.text,marginBottom:8,marginTop:4}}>{p.name}</h3>
              <p style={{color:T.text2,fontSize:".85rem",lineHeight:1.6,marginBottom:14}}>{p.desc}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>{p.techs.split(",").map((t,j)=><span key={j} style={{fontSize:".7rem",padding:"3px 10px",borderRadius:50,background:T.bg3,color:T.text2,fontWeight:600}}>{t.trim()}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section id="skills" style={{background:T.bg2,padding:"6rem 2rem"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <SH tag="Expertise" title="Skills & Technologies"/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"1.2rem"}}>
            {data.skills.map(s=>(
              <div key={s.id} style={{padding:"1.5rem",borderRadius:16,background:T.bg,border:`1px solid ${T.border}`}}>
                <h3 style={{fontSize:".9rem",fontWeight:800,color:T.primary,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>{s.category}</h3>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{s.items.split(",").map((t,j)=><span key={j} style={{fontSize:".78rem",padding:"5px 14px",borderRadius:50,background:T.card,color:T.text2,border:`1px solid ${T.border}`,fontWeight:500}}>{t.trim()}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section style={{maxWidth:1100,margin:"0 auto",padding:"6rem 2rem"}}>
        <SH tag="Education" title="Academic Background"/>
        <div style={{display:"grid",gap:"1rem",maxWidth:700,margin:"0 auto"}}>
          {data.education.map(e=>(
            <div key={e.id} style={{background:T.card,borderRadius:16,padding:"1.5rem 2rem",display:"flex",gap:"1.2rem",alignItems:"center",boxShadow:`0 2px 12px ${T.shadow}`,border:`1px solid ${T.border}`}}>
              <div style={{width:50,height:50,borderRadius:12,background:T.tagBg,display:"flex",alignItems:"center",justifyContent:"center",color:T.primary,flexShrink:0}}><Ic.Grad/></div>
              <div><h3 style={{fontWeight:800,color:T.text,fontSize:"1rem"}}>{e.degree}</h3><p style={{color:T.text2,fontSize:".85rem"}}>{e.school}</p><div style={{display:"flex",gap:"1rem",marginTop:4}}><span style={{fontSize:".78rem",color:T.primary,fontWeight:600}}>{e.period}</span><span style={{fontSize:".78rem",color:T.text3}}>Grade: {e.grade}</span></div></div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{maxWidth:1100,margin:"0 auto",padding:"6rem 2rem"}}>
        <SH tag="Contact" title="Let's Build Something Great"/>
        <p style={{textAlign:"center",fontSize:"1.05rem",color:T.text2,maxWidth:500,margin:"-1.5rem auto 2.5rem"}}>Have a project? Let's connect and make it happen.</p>
        <div style={{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:600,margin:"0 auto"}}>
          {[{ic:<Ic.Mail/>,v:data.personal.email,h:`mailto:${data.personal.email}`},{ic:<Ic.Phone/>,v:data.personal.phone,h:`tel:${data.personal.phone.replace(/\s/g,'')}`},{ic:<Ic.Pin/>,v:data.personal.location},{ic:<Ic.Ln/>,v:data.personal.linkedin,h:data.personal.linkedin}].map((c,i)=>(
            <a key={i} href={c.h||"#"} target={c.h?"_blank":""} rel="noopener noreferrer" style={{background:T.card,borderRadius:14,padding:"1.2rem 1.5rem",textDecoration:"none",color:T.text,display:"flex",alignItems:"center",gap:14,border:`1px solid ${T.border}`,boxShadow:`0 2px 12px ${T.shadow}`,transition:"all .3s",overflow:"hidden"}} onMouseOver={e=>{e.currentTarget.style.borderColor=T.primary;e.currentTarget.style.transform="translateX(6px)";}} onMouseOut={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="translateX(0)";}}>
              <div style={{width:44,height:44,borderRadius:12,background:T.tagBg,display:"flex",alignItems:"center",justifyContent:"center",color:T.primary,flexShrink:0}}>{c.ic}</div>
              <span style={{fontSize:".95rem",fontWeight:600,color:T.text,wordBreak:"break-all"}}>{c.v}</span>
            </a>
          ))}
        </div>
      </section>
      <footer style={{textAlign:"center",padding:"2rem",background:T.footerBg,color:T.footerText,fontSize:".8rem"}}>© 2026 {data.personal.name}.</footer>
    </div>
  );
}

// ─── ADMIN ────────────────────────────────
function Admin({data,setData,onNav,dark,setDark,colors,setColors,floatingSkills,setFloatingSkills}){
  const{user,logout,token,changePw}=useAuth();const T=useTheme();
  const[tab,setTab]=useState("personal");const[editItem,setEditItem]=useState(null);
  const[toast,setToast]=useState(null);
  const[pwF,setPwF]=useState({c:"",n:"",cf:""});const[pwE,setPwE]=useState("");const[pwOk,setPwOk]=useState(false);
  const fileRef=useRef(null);
  const showT=m=>{setToast(m);setTimeout(()=>setToast(null),2500);};
  const handlePhoto=e=>{const f=e.target.files?.[0];if(!f||!f.type.startsWith("image/"))return;const r=new FileReader();r.onload=ev=>{setData(p=>({...p,personal:{...p.personal,photoUrl:ev.target.result}}));showT("Photo updated!");};r.readAsDataURL(f);};
  const handlePw=()=>{setPwE("");setPwOk(false);if(!pwF.c||!pwF.n||!pwF.cf){setPwE("All fields required");return;}if(pwF.n!==pwF.cf){setPwE("Passwords don't match");return;}const r=changePw(pwF.c,pwF.n);if(r.ok){setPwOk(true);setPwF({c:"",n:"",cf:""});showT("Password changed!");}else setPwE(r.err);};

  const tabs=[{id:"personal",l:"Personal Info",ic:<Ic.User/>},{id:"experience",l:"Experience",ic:<Ic.Briefcase/>},{id:"projects",l:"Projects",ic:<Ic.Code/>},{id:"skills",l:"Skills",ic:<Ic.Layers/>},{id:"education",l:"Education",ic:<Ic.Grad/>},{id:"appearance",l:"Appearance",ic:<Ic.Palette/>},{id:"security",l:"Security",ic:<Ic.Shield/>}];
  const upd=(s,id,f,v)=>{if(s==="personal")setData(p=>({...p,personal:{...p.personal,[f]:v}}));else setData(p=>({...p,[s]:p[s].map(x=>x.id===id?{...x,[f]:v}:x)}));};
  const add=s=>{const t={experience:{role:"New Role",company:"Company",period:"2024 – Present",type:"Full-Time",desc:"...",techs:".NET Core"},projects:{name:"New Project",desc:"...",techs:".NET Core"},skills:{category:"Category",items:"Skill 1, Skill 2"},education:{degree:"Degree",school:"School",period:"2024",grade:"N/A"}};const nid=Math.max(0,...data[s].map(i=>i.id))+1;setData(p=>({...p,[s]:[...p[s],{id:nid,...t[s]}]}));showT("Added");};
  const del=(s,id)=>{setData(p=>({...p,[s]:p[s].filter(i=>i.id!==id)}));showT("Deleted");};
  const fMap={experience:["role","company","period","type","desc","techs"],projects:["name","desc","techs"],skills:["category","items"],education:["degree","school","period","grade"]};
  const tkP=JWT.verify(token);const tkE=tkP?new Date(tkP.exp).toLocaleTimeString():"N/A";
  const inp={width:"100%",padding:"10px 14px",borderRadius:10,border:`1px solid ${T.inputBorder}`,background:T.inputBg,color:T.text,fontSize:".9rem",outline:"none",fontFamily:"inherit"};
  const lbl={fontSize:".78rem",color:T.text3,marginBottom:4,display:"block",fontWeight:600};

  const toggleFloat=id=>{setFloatingSkills(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id].slice(0,10));};

  const ColorRow=({label,colorKey})=>(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:28,height:28,borderRadius:8,background:colors[colorKey],border:`1px solid ${T.border}`}}/>
        <span style={{fontSize:".88rem",fontWeight:600,color:T.text}}>{label}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <input type="color" value={colors[colorKey]} onChange={e=>setColors(p=>({...p,[colorKey]:e.target.value}))} style={{width:36,height:28,border:"none",borderRadius:6,cursor:"pointer",background:"transparent"}}/>
        <code style={{fontSize:".72rem",color:T.text3,background:T.bg3,padding:"2px 8px",borderRadius:4}}>{colors[colorKey]}</code>
      </div>
    </div>
  );

  const renderPersonal=()=>(
    <div style={{display:"grid",gap:"1rem"}}>
      <div><label style={lbl}>Profile Photo</label><div style={{display:"flex",alignItems:"center",gap:16}}>
        <div style={{width:80,height:80,borderRadius:16,background:T.bg3,border:`1px solid ${T.border}`,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{data.personal.photoUrl?<img src={data.personal.photoUrl} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:"2rem",color:T.primary,fontWeight:700}}>SM</span>}</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}><input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{display:"none"}}/><button onClick={()=>fileRef.current?.click()} style={{padding:"8px 16px",borderRadius:8,background:T.tagBg,color:T.primary,border:`1px solid ${T.primary}33`,cursor:"pointer",fontSize:".82rem",fontWeight:600}}>Upload</button>{data.personal.photoUrl&&<button onClick={()=>{setData(p=>({...p,personal:{...p.personal,photoUrl:""}}));showT("Removed");}} style={{padding:"6px 12px",borderRadius:8,background:"rgba(255,70,70,.08)",color:"#E53935",border:"1px solid rgba(255,70,70,.2)",cursor:"pointer",fontSize:".75rem"}}>Remove</button>}</div>
      </div><div style={{marginTop:6}}><label style={lbl}>Or URL</label><input value={data.personal.photoUrl} onChange={e=>upd("personal",null,"photoUrl",e.target.value)} placeholder="https://..." style={inp}/></div></div>
      {Object.entries(data.personal).filter(([k])=>k!=="photoUrl").map(([k,v])=>(<div key={k}><label style={lbl}>{k.charAt(0).toUpperCase()+k.slice(1).replace(/([A-Z])/g,' $1')}</label>{(k==="bio"||k==="tagline")?<textarea value={v} onChange={e=>upd("personal",null,k,e.target.value)} style={{...inp,minHeight:k==="bio"?100:60,resize:"vertical"}}/>:<input value={v} onChange={e=>upd("personal",null,k,e.target.value)} style={inp}/>}</div>))}
      <button onClick={()=>showT("Saved!")} style={{padding:"10px 24px",borderRadius:10,background:`linear-gradient(135deg,${T.primary},${T.secondary})`,color:"#fff",border:"none",cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:8,width:"fit-content"}}><Ic.Save/> Save</button>
    </div>
  );

  const renderList=s=>(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"1rem"}}><span style={{color:T.text3,fontSize:".85rem"}}>{data[s].length} items</span><button onClick={()=>add(s)} style={{padding:"8px 18px",borderRadius:10,background:T.tagBg,color:T.primary,border:`1px solid ${T.primary}33`,cursor:"pointer",fontWeight:600,fontSize:".85rem",display:"flex",alignItems:"center",gap:6}}><Ic.Plus/> Add</button></div>
      <div style={{display:"grid",gap:"1rem"}}>{data[s].map(item=>(
        <div key={item.id} style={{background:T.card,borderRadius:14,padding:"1.2rem",border:`1px solid ${T.border}`}}>
          {editItem===`${s}-${item.id}`?(
            <div style={{display:"grid",gap:10}}>{fMap[s].map(f=><div key={f}><label style={lbl}>{f}</label>{(f==="desc"||f==="items")?<textarea value={item[f]} onChange={e=>upd(s,item.id,f,e.target.value)} style={{...inp,minHeight:70,resize:"vertical"}}/>:<input value={item[f]||""} onChange={e=>upd(s,item.id,f,e.target.value)} style={inp}/>}</div>)}<div style={{display:"flex",gap:8}}><button onClick={()=>{setEditItem(null);showT("Saved!");}} style={{padding:"8px 18px",borderRadius:8,background:T.primary,color:"#fff",border:"none",cursor:"pointer",fontWeight:600,fontSize:".82rem"}}><Ic.Save/> Save</button><button onClick={()=>setEditItem(null)} style={{padding:"8px 18px",borderRadius:8,background:T.bg3,color:T.text3,border:`1px solid ${T.border}`,cursor:"pointer",fontSize:".82rem"}}>Cancel</button></div></div>
          ):(
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}><div><h4 style={{color:T.text,fontWeight:700,fontSize:".95rem"}}>{item[fMap[s][0]]}</h4><p style={{color:T.text3,fontSize:".82rem",marginTop:2}}>{item[fMap[s][1]]}</p></div><div style={{display:"flex",gap:6,flexShrink:0}}><button onClick={()=>setEditItem(`${s}-${item.id}`)} style={{width:34,height:34,borderRadius:8,background:T.tagBg,color:T.primary,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic.Edit/></button><button onClick={()=>del(s,item.id)} style={{width:34,height:34,borderRadius:8,background:"rgba(255,70,70,.08)",color:"#E53935",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic.Trash/></button></div></div>
          )}
        </div>
      ))}</div>
    </div>
  );

  const renderAppearance=()=>(
    <div style={{maxWidth:560}}>
      {/* Dark Mode */}
      <div style={{background:T.card,borderRadius:16,padding:"1.5rem",border:`1px solid ${T.border}`,marginBottom:"1.5rem"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:44,height:44,borderRadius:12,background:T.tagBg,display:"flex",alignItems:"center",justifyContent:"center",color:T.primary}}>{dark?<Ic.Moon/>:<Ic.Sun/>}</div>
            <div><h3 style={{fontSize:"1rem",fontWeight:700,color:T.text}}>Dark Mode</h3><p style={{fontSize:".78rem",color:T.text3}}>Toggle light/dark theme</p></div>
          </div>
          <button onClick={()=>setDark(!dark)} style={{width:56,height:30,borderRadius:15,background:dark?T.primary:"#ccc",border:"none",cursor:"pointer",position:"relative",transition:"background .3s"}}><div style={{width:24,height:24,borderRadius:12,background:"#fff",position:"absolute",top:3,left:dark?29:3,transition:"left .3s",boxShadow:"0 1px 4px rgba(0,0,0,.2)"}}/></button>
        </div>
      </div>

      {/* Preset Themes */}
      <div style={{background:T.card,borderRadius:16,padding:"1.5rem",border:`1px solid ${T.border}`,marginBottom:"1.5rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.2rem"}}>
          <div style={{width:44,height:44,borderRadius:12,background:T.tagBg,display:"flex",alignItems:"center",justifyContent:"center",color:T.primary}}><Ic.Sparkle/></div>
          <div><h3 style={{fontSize:"1rem",fontWeight:700,color:T.text}}>Quick Themes</h3><p style={{fontSize:".78rem",color:T.text3}}>One-click color presets</p></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
          {PRESETS.map(p=>(
            <button key={p.name} onClick={()=>{setColors(c=>({...c,primary:p.primary,secondary:p.secondary,navColor:p.nav+"CC"}));showT(`${p.name} theme applied!`);}} style={{padding:"10px",borderRadius:12,background:T.bg,border:colors.primary===p.primary?`2px solid ${T.text}`:`1px solid ${T.border}`,cursor:"pointer",textAlign:"center",transition:"all .2s"}} onMouseOver={e=>e.currentTarget.style.transform="scale(1.05)"} onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}>
              <div style={{display:"flex",gap:4,justifyContent:"center",marginBottom:6}}>
                <div style={{width:16,height:16,borderRadius:"50%",background:p.primary}}/>
                <div style={{width:16,height:16,borderRadius:"50%",background:p.secondary}}/>
              </div>
              <span style={{fontSize:".72rem",fontWeight:700,color:T.text}}>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Individual Colors */}
      <div style={{background:T.card,borderRadius:16,padding:"1.5rem",border:`1px solid ${T.border}`,marginBottom:"1.5rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1rem"}}>
          <div style={{width:44,height:44,borderRadius:12,background:T.tagBg,display:"flex",alignItems:"center",justifyContent:"center",color:T.primary}}><Ic.Palette/></div>
          <div><h3 style={{fontSize:"1rem",fontWeight:700,color:T.text}}>Custom Colors</h3><p style={{fontSize:".78rem",color:T.text3}}>Fine-tune each color individually</p></div>
        </div>
        <ColorRow label="Primary Color" colorKey="primary"/>
        <ColorRow label="Secondary / Gradient" colorKey="secondary"/>
        <ColorRow label="Contact Section" colorKey="contactBgColor"/>
        <ColorRow label="Footer Background" colorKey="footerBgColor"/>
        <ColorRow label="Nav Background" colorKey="navColor"/>
        <div style={{marginTop:"1rem"}}><button onClick={()=>{setColors({primary:"#FF4081",secondary:"#FF80AB",contactBgColor:"#FF4081",footerBgColor:dark?"#06060a":"#222",navColor:dark?"rgba(10,10,15,.85)":"rgba(255,255,255,.95)"});showT("Reset to defaults!");}} style={{padding:"8px 16px",borderRadius:8,background:T.bg3,color:T.text3,border:`1px solid ${T.border}`,cursor:"pointer",fontSize:".8rem",fontWeight:600}}>Reset to Defaults</button></div>
      </div>

      {/* Floating Skills */}
      <div style={{background:T.card,borderRadius:16,padding:"1.5rem",border:`1px solid ${T.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1rem"}}>
          <div style={{width:44,height:44,borderRadius:12,background:T.tagBg,display:"flex",alignItems:"center",justifyContent:"center",color:T.primary}}><Ic.Code/></div>
          <div><h3 style={{fontSize:"1rem",fontWeight:700,color:T.text}}>Floating Skill Icons</h3><p style={{fontSize:".78rem",color:T.text3}}>Select up to 10 skills to float around your photo</p></div>
        </div>
        <p style={{fontSize:".78rem",color:T.primary,fontWeight:600,marginBottom:10}}>{floatingSkills.length}/10 selected</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {ALL_FLOAT_SKILLS.map(s=>{
            const active=floatingSkills.includes(s.id);
            const disabled=!active&&floatingSkills.length>=10;
            return (
              <button key={s.id} onClick={()=>!disabled&&toggleFloat(s.id)} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:10,background:active?`${T.primary}18`:T.bg,border:`1.5px solid ${active?T.primary:T.border}`,cursor:disabled?"not-allowed":"pointer",opacity:disabled?.4:1,transition:"all .2s",fontSize:".82rem",fontWeight:active?700:500,color:active?T.primary:T.text2}}>
                <span>{s.icon}</span>{s.label}
                {active&&<span style={{width:16,height:16,borderRadius:4,background:T.primary,display:"flex",alignItems:"center",justifyContent:"center",marginLeft:2}}><Ic.Check/></span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderSecurity=()=>(
    <div style={{maxWidth:480}}>
      <div style={{background:T.card,borderRadius:16,padding:"1.5rem",border:`1px solid ${T.border}`,marginBottom:"1.5rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"1.2rem"}}><div style={{width:40,height:40,borderRadius:10,background:T.tagBg,display:"flex",alignItems:"center",justifyContent:"center",color:T.primary}}><Ic.Key/></div><div><h3 style={{fontSize:"1rem",fontWeight:700,color:T.text}}>Change Password</h3><p style={{fontSize:".78rem",color:T.text3}}>Update admin password</p></div></div>
        {pwE&&<div style={{padding:"10px",borderRadius:10,background:"rgba(255,70,70,.08)",border:"1px solid rgba(255,70,70,.2)",marginBottom:"1rem",color:"#E53935",fontSize:".85rem",display:"flex",gap:8,alignItems:"center"}}><Ic.Alert/>{pwE}</div>}
        {pwOk&&<div style={{padding:"10px",borderRadius:10,background:"rgba(68,187,136,.08)",border:"1px solid rgba(68,187,136,.2)",marginBottom:"1rem",color:"#2E7D32",fontSize:".85rem",display:"flex",gap:8,alignItems:"center"}}><Ic.Shield/>Changed!</div>}
        <div style={{display:"grid",gap:"1rem"}}><div><label style={lbl}>Current</label><input type="password" value={pwF.c} onChange={e=>setPwF(p=>({...p,c:e.target.value}))} style={inp}/></div><div><label style={lbl}>New (min 6)</label><input type="password" value={pwF.n} onChange={e=>setPwF(p=>({...p,n:e.target.value}))} style={inp}/></div><div><label style={lbl}>Confirm</label><input type="password" value={pwF.cf} onChange={e=>setPwF(p=>({...p,cf:e.target.value}))} style={inp}/></div>
          <button onClick={handlePw} style={{padding:"10px 24px",borderRadius:10,background:T.primary,color:"#fff",border:"none",cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:8,width:"fit-content"}}><Ic.Save/> Update</button>
        </div>
      </div>
      <div style={{background:T.card,borderRadius:16,padding:"1.5rem",border:`1px solid ${T.border}`}}>
        <h3 style={{fontSize:"1rem",fontWeight:700,color:T.text,marginBottom:"1rem"}}>Session</h3>
        {[{l:"User",v:user?.name,c:T.text},{l:"Role",v:user?.role,c:T.primary},{l:"Expires",v:tkE,c:"#E53935"},{l:"Auth",v:"JWT HS256",c:"#2E7D32"}].map((r,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<3?`1px solid ${T.border}`:"none"}}><span style={{color:T.text3,fontSize:".85rem"}}>{r.l}</span><span style={{color:r.c,fontSize:".85rem",fontWeight:600}}>{r.v}</span></div>)}
      </div>
    </div>
  );

  return (
    <div style={{background:T.bg,color:T.text,fontFamily:"'Segoe UI',system-ui,sans-serif",minHeight:"100vh",display:"flex"}}>
      <aside style={{width:250,background:T.bg2,borderRight:`1px solid ${T.border}`,padding:"1.5rem 1rem",position:"sticky",top:0,height:"100vh",display:"flex",flexDirection:"column",overflowY:"auto"}}>
        <button onClick={()=>onNav("portfolio")} style={{display:"flex",alignItems:"center",gap:8,color:T.text3,background:"none",border:"none",cursor:"pointer",fontSize:".85rem",marginBottom:"1rem"}} onMouseOver={e=>e.currentTarget.style.color=T.primary} onMouseOut={e=>e.currentTarget.style.color=T.text3}><Ic.Back/> Portfolio</button>
        <div style={{fontSize:"1.1rem",fontWeight:900,color:T.text,marginBottom:"1.5rem"}}>Admin<span style={{color:T.primary}}>.</span></div>
        <div style={{padding:12,borderRadius:12,background:T.tagBg,marginBottom:"1.2rem"}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${T.primary},${T.secondary})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".75rem",fontWeight:700,color:"#fff"}}>SM</div><div><div style={{fontSize:".82rem",fontWeight:600,color:T.text}}>{user?.name}</div><div style={{fontSize:".7rem",color:T.primary}}>{user?.role}</div></div></div></div>
        <div style={{display:"flex",flexDirection:"column",gap:3}}>{tabs.map(t=><button key={t.id} onClick={()=>{setTab(t.id);setEditItem(null);}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:10,background:tab===t.id?T.tagBg:"transparent",color:tab===t.id?T.primary:T.text3,border:"none",cursor:"pointer",fontSize:".85rem",fontWeight:tab===t.id?700:400,textAlign:"left"}}>{t.ic} {t.l}</button>)}</div>
        <div style={{marginTop:"auto",paddingTop:"1rem",borderTop:`1px solid ${T.border}`,display:"flex",flexDirection:"column",gap:8}}>
          <button onClick={()=>onNav("portfolio")} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"10px",borderRadius:10,background:`linear-gradient(135deg,${T.primary},${T.secondary})`,color:"#fff",border:"none",cursor:"pointer",fontWeight:600,fontSize:".85rem",justifyContent:"center"}}><Ic.Eye/> Preview</button>
          <button onClick={()=>{logout();onNav("portfolio");}} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"10px",borderRadius:10,background:"rgba(255,70,70,.08)",color:"#E53935",border:"1px solid rgba(255,70,70,.2)",cursor:"pointer",fontWeight:600,fontSize:".85rem",justifyContent:"center"}}><Ic.Logout/> Logout</button>
        </div>
      </aside>
      <main style={{flex:1,padding:"2rem 3rem",maxWidth:900,overflowY:"auto"}}>
        <h1 style={{fontSize:"1.5rem",fontWeight:800,color:T.text,marginBottom:".3rem"}}>{tabs.find(t=>t.id===tab)?.l}</h1>
        <p style={{color:T.text3,fontSize:".85rem",marginBottom:"1.5rem"}}>{tab==="personal"?"Update your info":tab==="security"?"Account security":tab==="appearance"?"Customize your portfolio look":`Manage ${tab}`}</p>
        {tab==="personal"?renderPersonal():tab==="security"?renderSecurity():tab==="appearance"?renderAppearance():renderList(tab)}
      </main>
      {toast&&<div style={{position:"fixed",bottom:30,right:30,padding:"12px 24px",borderRadius:12,background:`linear-gradient(135deg,${T.primary},${T.secondary})`,color:"#fff",fontWeight:600,fontSize:".9rem",boxShadow:`0 8px 30px ${T.primary}44`,zIndex:200,animation:"fi .3s ease"}}>{toast}</div>}
      <style>{`@keyframes fi{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

// ─── APP ──────────────────────────────────
export default function App(){
  const[data,setData]=useState(initData);
  const[view,setView]=useState("portfolio");
  const[dark,setDark]=useState(false);
  const[colors,setColors]=useState({primary:"#FF4081",secondary:"#FF80AB",contactBgColor:"#FF4081",footerBgColor:"#222",navColor:"rgba(255,255,255,.95)"});
  const[floatingSkills,setFloatingSkills]=useState(["dotnet","csharp","sql","docker","redis","graphql","rabbitmq","angular"]);
  const theme=getTheme(dark,colors);

  return (
    <AuthProvider>
      <ThemeCtx.Provider value={{...theme,dark}}>
        <Rtr data={data} setData={setData} view={view} setView={setView} dark={dark} setDark={setDark} colors={colors} setColors={setColors} floatingSkills={floatingSkills} setFloatingSkills={setFloatingSkills}/>
      </ThemeCtx.Provider>
    </AuthProvider>
  );
}

function Rtr({data,setData,view,setView,dark,setDark,colors,setColors,floatingSkills,setFloatingSkills}){
  const{isAuth}=useAuth();
  const nav=v=>setView(v);
  if(view==="login") return <LoginPage onNav={nav}/>;
  if(view==="admin") return isAuth ? <Admin data={data} setData={setData} onNav={nav} dark={dark} setDark={setDark} colors={colors} setColors={setColors} floatingSkills={floatingSkills} setFloatingSkills={setFloatingSkills}/> : <LoginPage onNav={nav}/>;
  return <Portfolio data={data} onNav={nav} floatingSkills={floatingSkills}/>;
}