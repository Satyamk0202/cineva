import React,{useState,useEffect,useRef,useCallback} from 'react';

/* ---------- Original, fictional catalogue (poster art is generated, no external images) ---------- */
const mk=(id,title,genre,year,age,mins,desc,a,b)=>({id,title,genre,year,age,mins,desc,a,b});
const T=[
mk(1,'NIGHT CIRCUIT','Thriller',2026,'16+',118,'A courier racing across a sleeping city discovers the package she carries is counting down.',350,280),
mk(2,'SALT & STARLIGHT','Drama',2025,'13+',104,'Two estranged sisters reopen their family lighthouse and the secrets it kept.',200,230),
mk(3,'THE LAST ORBIT','Sci-Fi',2026,'13+',131,'A crew on the final mission to a dying station must decide who gets to come home.',250,200),
mk(4,'HOLLOW CROWN','Fantasy',2024,'16+',2,'A reluctant heir inherits a kingdom whose throne feeds on memories.',30,340),
mk(5,'PAPER TIGERS','Comedy',2025,'13+',96,'A failing startup fakes a product launch and accidentally becomes a movement.',45,15),
mk(6,'COLD HARBOR','Thriller',2023,'18+',112,'A detective returns to her hometown as the tide gives up an old crime.',210,260),
mk(7,'NEON PSALM','Sci-Fi',2026,'16+',124,'In a city lit by borrowed light, a street preacher finds a signal from beyond.',300,190),
mk(8,'THE QUIET HOUR','Drama',2024,'13+',101,'A night-shift nurse and a lonely poet form a bond no one is meant to see.',160,210),
mk(9,'DOUBLE BOOKED','Comedy',2026,'13+',92,'Two weddings, one venue, and a planner who refuses to lose.',330,40),
mk(10,'EMBERFALL','Fantasy',2025,'13+',127,'When the last dragon egg hatches in a mining town, everything must change.',15,50),
mk(11,'MIRROR LAKE','Thriller',2026,'16+',108,'A family vacation unravels as every reflection starts telling a different story.',190,300),
mk(12,'SUNDAY SCHOOL','Comedy',2023,'7+',98,'A chaotic substitute teacher turns detention into the best class of the year.',55,20),
mk(13,'ATLAS PROTOCOL','Sci-Fi',2025,'16+',119,'An AI cartographer begins mapping places that do not exist yet.',230,170),
mk(14,'WINTER LETTERS','Drama',2025,'13+',110,'Decades of unsent letters lead a grandson across a continent in the snow.',215,250),
mk(15,'RUNE & RUST','Fantasy',2024,'13+',123,'A blacksmith forges a sword that can only be wielded by someone who forgives.',5,320),
mk(16,'THIRD SHIFT','Comedy',2024,'13+',95,'The night crew at a 24-hour diner is secretly running the whole town.',100,60)];
T[3].mins=121;
const bg=t=>`linear-gradient(145deg,hsl(${t.a} 70% 38%),hsl(${t.b} 65% 16%))`;
const ROWS=[['Trending Now',T.slice(0,8)],['Sci-Fi',T.filter(t=>t.genre==='Sci-Fi')],['Thrillers',T.filter(t=>t.genre==='Thriller')],['Drama',T.filter(t=>t.genre==='Drama')],['Fantasy',T.filter(t=>t.genre==='Fantasy')],['Comedy',T.filter(t=>t.genre==='Comedy')]];

/* ---------- Auth (LOCAL DEMO ONLY: stored in this browser. Replace with a real backend for production) ---------- */
const jget=(s,k,d)=>{try{return JSON.parse(s.getItem(k))??d}catch{return d}};
const jset=(s,k,v)=>{try{s.setItem(k,JSON.stringify(v))}catch{}};
const sha=async(t)=>{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')};
const rnd=()=>[...crypto.getRandomValues(new Uint8Array(12))].map(x=>x.toString(16).padStart(2,'0')).join('');
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const strength=p=>[p.length>=8,/[A-Z]/.test(p),/[0-9]/.test(p),/[^A-Za-z0-9]/.test(p)].filter(Boolean).length;
const Auth={
 async signup(name,email,pw){const u=jget(localStorage,'cv_users',{});const k=email.toLowerCase();if(u[k])throw new Error('An account with this email already exists.');
  const salt=rnd();u[k]={name,salt,hash:await sha(salt+pw),list:[],prog:{}};jset(localStorage,'cv_users',u);return k},
 async login(email,pw){const u=jget(localStorage,'cv_users',{});const k=email.toLowerCase();const r=u[k];
  if(!r||r.hash!==await sha(r.salt+pw))throw new Error('Incorrect email or password.');return k},
 session:()=>jget(sessionStorage,'cv_s',null)||jget(localStorage,'cv_s',null),
 start(k,remember){try{sessionStorage.removeItem('cv_s');localStorage.removeItem('cv_s')}catch{}jset(remember?localStorage:sessionStorage,'cv_s',k)},
 end(){try{sessionStorage.removeItem('cv_s');localStorage.removeItem('cv_s')}catch{}},
 get:k=>jget(localStorage,'cv_users',{})[k],
 patch(k,fn){const u=jget(localStorage,'cv_users',{});if(u[k]){fn(u[k]);jset(localStorage,'cv_users',u)}}};

const useHash=()=>{const [h,setH]=useState(location.hash.slice(2)||'');useEffect(()=>{const f=()=>{setH(location.hash.slice(2)||'');scrollTo(0,0)};addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[]);return h};
const go=p=>{location.hash='#/'+p};

/* ---------- Auth screens ---------- */
function Field({id,label,type='text',value,onChange,error,auto}){const [show,setShow]=useState(false);const pw=type==='password';
 return <><div className="f"><input id={id} type={pw&&show?'text':type} value={value} onChange={e=>onChange(e.target.value)} placeholder=" " autoComplete={auto} aria-invalid={!!error}/><label htmlFor={id}>{label}</label>{pw&&<button type="button" className="eye" onClick={()=>setShow(!show)}>{show?'HIDE':'SHOW'}</button>}</div>{error&&<div className="er" role="alert">{error}</div>}</>}
function AuthPage({mode,onAuth}){
 const signup=mode==='signup';const pre=new URLSearchParams(location.hash.split('?')[1]||'').get('email')||'';
 const [d,setD]=useState({name:'',email:pre,pw:'',pw2:''});const [rem,setRem]=useState(true);const [er,setEr]=useState({});const [msg,setMsg]=useState('');const [busy,setBusy]=useState(false);
 const set=k=>v=>setD(x=>({...x,[k]:v}));
 const submit=async e=>{e.preventDefault();const n={};
  if(signup&&d.name.trim().length<2)n.name='Enter your name.';if(!EMAIL.test(d.email))n.email='Enter a valid email address.';
  if(signup?strength(d.pw)<3||d.pw.length<8:d.pw.length<1)n.pw=signup?'Use 8+ characters with at least 3 of: uppercase, number, symbol.':'Enter your password.';
  if(signup&&d.pw!==d.pw2)n.pw2='Passwords do not match.';setEr(n);setMsg('');if(Object.keys(n).length)return;
  setBusy(true);try{if(!crypto?.subtle)throw new Error('Secure context required (use https).');const k=signup?await Auth.signup(d.name.trim(),d.email,d.pw):await Auth.login(d.email,d.pw);Auth.start(k,rem);onAuth(k)}catch(x){setMsg(x.message)}setBusy(false)};
 const s=strength(d.pw);
 return <div className="auth"><div className="box"><a href="#/" className="logo">CINEVA</a><h1>{signup?'Create your account':'Sign In'}</h1>
 <form onSubmit={submit} noValidate>{msg&&<div className="bad" role="alert">{msg}</div>}
 {signup&&<Field id="n" label="Full name" value={d.name} onChange={set('name')} error={er.name} auto="name"/>}
 <Field id="e" label="Email address" type="email" value={d.email} onChange={set('email')} error={er.email} auto="email"/>
 <Field id="p" label="Password" type="password" value={d.pw} onChange={set('pw')} error={er.pw} auto={signup?'new-password':'current-password'}/>
 {signup&&<><div className="str" aria-hidden="true">{[1,2,3,4].map(i=><i key={i} style={{background:i<=s?['','#ff4d4d','#ffb020','#9ad84a','#46d369'][s]:''}}/>)}</div><Field id="p2" label="Confirm password" type="password" value={d.pw2} onChange={set('pw2')} error={er.pw2} auto="new-password"/></>}
 <button className="btn p" style={{width:'100%'}} disabled={busy}>{busy?'Please wait…':signup?'Create Account':'Sign In'}</button>
 {!signup&&<label style={{display:'flex',gap:8,margin:'16px 0 0',color:'var(--mute)',fontSize:13}}><input type="checkbox" checked={rem} onChange={e=>setRem(e.target.checked)}/> Remember me</label>}</form>
 <p style={{color:'var(--mute)',marginTop:24}}>{signup?'Already have an account? ':'New to CINEVA? '}<a href={signup?'#/login':'#/signup'} style={{color:'#fff',fontWeight:700}}>{signup?'Sign in':'Sign up now'}</a></p>
 <p style={{fontSize:11,color:'#666'}}>Demo auth: accounts are stored only in this browser. Connect Firebase, Supabase or Auth0 for real, multi-device accounts.</p></div></div>}
function Landing(){const [e,setE]=useState('');const [er,setEr]=useState('');
 return <div className="land"><header><span className="logo">CINEVA</span><a className="btn p" href="#/login">Sign In</a></header><main><div><div className="tag" style={{justifyContent:'center',marginBottom:12}}>STREAMING · ORIGINALS · NO CONTRACTS</div><h1>STORIES WITHOUT<br/>LIMITS.</h1><p style={{color:'#ccc',fontSize:18}}>Watch anywhere. Cancel anytime.</p>
 <form onSubmit={x=>{x.preventDefault();if(!EMAIL.test(e))return setEr('Enter a valid email address.');go('signup?email='+encodeURIComponent(e))}} noValidate><div><input aria-label="Email" placeholder="Email address" value={e} onChange={x=>setE(x.target.value)}/>{er&&<div className="er" style={{textAlign:'left'}}>{er}</div>}</div><button className="btn p">Get Started ›</button></form></div></main></div>}

/* ---------- App ---------- */
const Poster=({t,onClick,prog})=><button className="card" style={{background:bg(t)}} onClick={onClick} aria-label={t.title}><span>{t.title}</span>{prog>0&&<em style={{width:prog+'%'}}/>}</button>;
function Row({title,items,open,prog}){const r=useRef();if(!items.length)return null;const sc=d=>r.current.scrollBy({left:d*r.current.clientWidth*.85,behavior:'smooth'});
 return <section className="row"><h2>{title}</h2><button className="arr l" aria-label="Scroll left" onClick={()=>sc(-1)}>‹</button><div className="trk" ref={r}>{items.map(t=><Poster key={t.id} t={t} onClick={()=>open(t)} prog={prog?.[t.id]}/>)}</div><button className="arr r" aria-label="Scroll right" onClick={()=>sc(1)}>›</button></section>}
function Home({user,open}){const [i,setI]=useState(0);const F=T.slice(0,4);useEffect(()=>{const id=setInterval(()=>setI(x=>(x+1)%F.length),8000);return()=>clearInterval(id)},[]);const t=F[i];
 const cont=T.filter(x=>user.prog?.[x.id]>0);
 return <><div className="hero" style={{background:bg(t)}}><div key={t.id}><div className="tag"><span className="logo" style={{fontSize:18}}>ORIGINAL</span></div><h1>{t.title}</h1><div className="tag" style={{marginBottom:14}}><b>{90+t.id*2}% Match</b><span>{t.year}</span><i>{t.age}</i><span>{t.genre}</span></div><p>{t.desc}</p><div style={{display:'flex',gap:12,flexWrap:'wrap'}}><button className="btn w" onClick={()=>open(t,true)}>▶ Play</button><button className="btn g" onClick={()=>open(t)}>ⓘ More Info</button></div></div><div className="dots">{F.map((x,k)=><button key={x.id} aria-label={'Feature '+(k+1)} className={k===i?'on':''} onClick={()=>setI(k)}/>)}</div></div>
 {cont.length>0&&<Row title="Continue Watching" items={cont} open={open} prog={user.prog}/>}{user.list.length>0&&<Row title="My List" items={user.list.map(id=>T.find(t=>t.id===id))} open={open}/>}
 {ROWS.map(([n,it])=><Row key={n} title={n} items={it} open={open} prog={user.prog}/>)}</>}
function Grid({title,items,open,empty}){return <div className="pad"><h1 style={{fontSize:32}}>{title}</h1>{items.length?<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:14,padding:'20px 4%'}}>{items.map(t=><div key={t.id} style={{aspectRatio:'2/3',display:'grid'}}><Poster t={t} onClick={()=>open(t)}/></div>)}</div>:<p style={{padding:'0 4%',color:'var(--mute)'}}>{empty}</p>}</div>}
function Modal({t,user,toggle,close,play}){useEffect(()=>{const f=e=>e.key==='Escape'&&close();addEventListener('keydown',f);return()=>removeEventListener('keydown',f)},[]);const on=user.list.includes(t.id);
 return <div className="modal" onClick={close}><div onClick={e=>e.stopPropagation()} role="dialog" aria-label={t.title} style={{position:'relative'}}><button className="x" aria-label="Close" onClick={close}>✕</button><div className="mh" style={{background:bg(t)}}><div><h2>{t.title}</h2><div style={{display:'flex',gap:10,alignItems:'center'}}><button className="btn w" onClick={play}>▶ Play</button><button className="round" aria-label={on?'Remove from My List':'Add to My List'} onClick={toggle}>{on?'✓':'+'}</button></div></div></div>
 <div className="mb"><div><div className="tag" style={{marginBottom:12}}><b>{90+t.id*2}% Match</b><span>{t.year}</span><i>{t.age}</i><span>{t.mins} min</span></div><p>{t.desc}</p></div><div style={{color:'var(--mute)',fontSize:13}}><p><b style={{color:'#fff'}}>Genre:</b> {t.genre}</p><p><b style={{color:'#fff'}}>Cast:</b> Fictional ensemble</p></div></div></div></div>}
function Player({t,close,save}){const [p,setP]=useState(0);useEffect(()=>{const id=setInterval(()=>setP(x=>{const n=Math.min(100,x+1);return n},300));return()=>clearInterval(id)},[]);useEffect(()=>()=>{},[]);
 useEffect(()=>{const f=e=>e.key==='Escape'&&(save(p),close());addEventListener('keydown',f);return()=>removeEventListener('keydown',f)},[p]);
 return <div className="player" style={{background:bg(t)}}><button className="btn g" style={{position:'absolute',top:20,left:20}} onClick={()=>{save(p);close()}}>← Back</button><div><div className="logo" style={{fontSize:56}}>{t.title}</div><p style={{maxWidth:460,color:'#ddd'}}>Player placeholder. Connect your licensed video source (HLS/MP4 or a streaming CDN) here to enable real playback.</p><div style={{height:4,background:'#fff3',borderRadius:2,maxWidth:460,margin:'20px auto'}}><div style={{height:'100%',width:p+'%',background:'var(--acc)'}}/></div></div></div>}
function Shell({k,route,onOut}){
 const [user,setUser]=useState(()=>Auth.get(k));const [sel,setSel]=useState(null);const [play,setPlay]=useState(null);const [sc,setSc]=useState(false);const [menu,setMenu]=useState(false);const [q,setQ]=useState('');const [so,setSo]=useState(false);const [toast,setToast]=useState('');const [load,setLoad]=useState(true);
 useEffect(()=>{const t=setTimeout(()=>setLoad(false),500);const f=()=>setSc(scrollY>30);addEventListener('scroll',f,{passive:true});return()=>{clearTimeout(t);removeEventListener('scroll',f)}},[]);
 const upd=fn=>{Auth.patch(k,fn);setUser(Auth.get(k))};const say=m=>{setToast(m);setTimeout(()=>setToast(''),2000)};
 const open=(t,p)=>p?setPlay(t):setSel(t);
 const toggle=t=>{const on=user.list.includes(t.id);upd(u=>{u.list=on?u.list.filter(x=>x!==t.id):[...u.list,t.id]});say(on?'Removed from My List':'Added to My List')};
 const rs=T.filter(t=>(t.title+t.genre+t.desc).toLowerCase().includes(q.toLowerCase().trim()));
 let page;if(load)page=<div style={{paddingTop:80}}><div className="sk" style={{height:'70vh'}}/></div>;else if(q.trim())page=<Grid title={`${rs.length} result${rs.length===1?'':'s'} for “${q}”`} items={rs} open={open} empty="No titles match your search. Try a different word."/>;
 else if(route==='mylist')page=<Grid title="My List" items={user.list.map(id=>T.find(t=>t.id===id))} open={open} empty="Titles you add will appear here."/>;else page=<Home user={user} open={open}/>;
 return <><nav className={sc?'sc':''}><a href="#/browse" className="logo">CINEVA</a><div className="l"><a href="#/browse" className={route!=='mylist'?'on':''}>Home</a><a href="#/mylist" className={route==='mylist'?'on':''}>My List</a></div>
 <div className="r"><div className={'sbox'+(so||q?' o':'')}><button aria-label="Search" onClick={()=>setSo(!so)}>🔍</button><input aria-label="Search titles" placeholder="Titles, genres" value={q} onChange={e=>setQ(e.target.value)} onBlur={()=>!q&&setSo(false)} autoFocus={so}/></div>
 <button className="av" aria-label="Account menu" aria-expanded={menu} onClick={()=>setMenu(!menu)}>{user.name[0].toUpperCase()}</button></div>{menu&&<div className="menu"><div>{user.name}</div><button onClick={()=>{setMenu(false);go('mylist')}}>My List</button><button onClick={onOut}>Sign out</button></div>}</nav>
 <main>{page}</main>{sel&&<Modal t={sel} user={user} toggle={()=>toggle(sel)} close={()=>setSel(null)} play={()=>{setPlay(sel);setSel(null)}}/>}
 {play&&<Player t={play} close={()=>setPlay(null)} save={p=>upd(u=>{u.prog={...u.prog,[play.id]:Math.max(u.prog?.[play.id]||0,p)}})}/>}{toast&&<div className="toast" role="status">{toast}</div>}</>}
export default function App(){
 const route=useHash();const [k,setK]=useState(()=>{const s=Auth.session();return s&&Auth.get(s)?s:null});
 const out=()=>{Auth.end();setK(null);go('login')};
 const base=route.split('?')[0];
 useEffect(()=>{if(k&&['','login','signup'].includes(base))go('browse');if(!k&&['browse','mylist'].includes(base))go('login')},[k,base]);
 if(!k)return base==='login'?<AuthPage mode="login" onAuth={x=>{setK(x);go('browse')}}/>:base==='signup'?<AuthPage mode="signup" onAuth={x=>{setK(x);go('browse')}}/>:<Landing/>;
 return <Shell key={k} k={k} route={base} onOut={out}/>}
