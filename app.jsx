import { useState } from "react";
 
const MATERIALS = [
  "Brick Sand","57 Stone","Rip Rap",
  "ABC (Aggregate Base Course)","Crushed Concrete",
  "Screenings","Dirt / Fill","Haul Away","Other"
];
 
const empty = () => ({
  name: "", company: "", phone: "", email: "",
  address: "", subdivision: "", lot: "",
  material: "", loads: "", tonnage: "",
  date: "", notes: "",
});
 
const STEPS = ["Who's Ordering", "Job Location", "Material & Delivery", "Review & Submit"];
 
export default function OrderForm() {
  const [form, setForm]     = useState(empty());
  const [step, setStep]     = useState(0);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
 
  const canNext = () => {
    if (step === 0) return form.name.trim() && form.phone.trim();
    if (step === 1) return form.address.trim();
    if (step === 2) return !!form.material;
    return true;
  };
 
  const submit = async () => {
    setStatus("submitting");
    try {
      const key = `order:${Date.now()}`;
      const result = await window.storage.set(key, JSON.stringify({ ...form, submittedAt: new Date().toISOString() }), true);
      setStatus(result ? "success" : "error");
    } catch { setStatus("error"); }
  };
 
  // ── Success ───────────────────────────────────────────────────
  if (status === "success") return (
    <Screen>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:24,textAlign:"center"}}>
        <div style={{fontSize:64,marginBottom:16}}>✅</div>
        <div style={{fontSize:24,fontWeight:800,color:"#1E293B",marginBottom:8}}>Order Sent!</div>
        <div style={{color:"#64748B",fontSize:16,lineHeight:1.6,marginBottom:32}}>
          Your order has been sent to Carolina Concrete dispatch. A driver will be assigned shortly.
        </div>
        <div style={{background:"#F8FAFC",borderRadius:14,padding:20,width:"100%",maxWidth:360,textAlign:"left",marginBottom:28}}>
          {[["Material",form.material],["Location",`${form.address}${form.subdivision?` · ${form.subdivision}`:""}`],["Lot",form.lot],["Date",form.date],["Loads",form.loads],["Tonnage",form.tonnage?`${form.tonnage} tons`:""]].filter(([,v])=>v).map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #F1F5F9",fontSize:14}}>
              <span style={{color:"#64748B"}}>{l}</span>
              <span style={{fontWeight:600,color:"#1E293B"}}>{v}</span>
            </div>
          ))}
        </div>
        <button onClick={()=>{ setForm(empty()); setStep(0); setStatus("idle"); }}
          style={btnPrimary}>Submit Another Order</button>
      </div>
    </Screen>
  );
 
  if (status === "error") return (
    <Screen>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:24,textAlign:"center"}}>
        <div style={{fontSize:64,marginBottom:16}}>⚠️</div>
        <div style={{fontSize:22,fontWeight:800,color:"#1E293B",marginBottom:8}}>Something went wrong</div>
        <div style={{color:"#64748B",marginBottom:24}}>Please try again or call dispatch directly.</div>
        <button onClick={()=>setStatus("idle")} style={btnPrimary}>Try Again</button>
      </div>
    </Screen>
  );
 
  return (
    <Screen>
      {/* Header */}
      <div style={{background:"#1E3A5F",padding:"20px 20px 16px",position:"sticky",top:0,zIndex:10}}>
        <div style={{color:"#7DD3FC",fontSize:11,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Carolina Concrete</div>
        <div style={{color:"#fff",fontSize:20,fontWeight:800,marginBottom:14}}>🚛 Material Order</div>
        {/* Progress bar */}
        <div style={{display:"flex",gap:6}}>
          {STEPS.map((s,i)=>(
            <div key={i} style={{flex:1}}>
              <div style={{height:4,borderRadius:4,background: i<=step ? "#F59E0B" : "rgba(255,255,255,.2)",transition:"background .3s"}} />
              <div style={{fontSize:9,color: i<=step ? "#FCD34D" : "rgba(255,255,255,.4)",marginTop:4,fontWeight:600,textTransform:"uppercase",letterSpacing:.5,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s}</div>
            </div>
          ))}
        </div>
      </div>
 
      <div style={{padding:"20px 16px 100px",maxWidth:480,margin:"0 auto"}}>
 
        {/* Step 0 — Who's Ordering */}
        {step === 0 && (
          <div>
            <StepTitle>Who's placing this order?</StepTitle>
            <Field label="Your Name *" val={form.name} onChange={v=>set("name",v)} placeholder="John Smith" autoComplete="name" />
            <Field label="Company" val={form.company} onChange={v=>set("company",v)} placeholder="ABC Construction (optional)" />
            <Field label="Phone *" val={form.phone} onChange={v=>set("phone",v)} placeholder="(919) 555-1234" type="tel" autoComplete="tel" />
            <Field label="Email" val={form.email} onChange={v=>set("email",v)} placeholder="you@example.com" type="email" autoComplete="email" />
          </div>
        )}
 
        {/* Step 1 — Job Location */}
        {step === 1 && (
          <div>
            <StepTitle>Where's the delivery going?</StepTitle>
            <Field label="Job Address *" val={form.address} onChange={v=>set("address",v)} placeholder="123 Main St, Raleigh NC" autoComplete="street-address" />
            <Field label="Subdivision" val={form.subdivision} onChange={v=>set("subdivision",v)} placeholder="e.g. Maplewood Estates" />
            <Field label="Lot #" val={form.lot} onChange={v=>set("lot",v)} placeholder="e.g. 42" />
          </div>
        )}
 
        {/* Step 2 — Material */}
        {step === 2 && (
          <div>
            <StepTitle>What do you need?</StepTitle>
            <div style={{marginBottom:20}}>
              <label style={labelStyle}>Material Type *</label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:8}}>
                {MATERIALS.map(m=>(
                  <button key={m} onClick={()=>set("material",m)}
                    style={{padding:"14px 10px",borderRadius:12,border:"2px solid",fontSize:13,fontWeight:700,cursor:"pointer",textAlign:"center",lineHeight:1.3,
                      borderColor: form.material===m ? "#1E3A5F" : "#E2E8F0",
                      background: form.material===m ? "#1E3A5F" : "#fff",
                      color: form.material===m ? "#fff" : "#475569"}}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Field label="# of Loads" val={form.loads} onChange={v=>set("loads",v)} placeholder="e.g. 5" type="number" />
              <Field label="Tonnage" val={form.tonnage} onChange={v=>set("tonnage",v)} placeholder="e.g. 20" type="number" />
            </div>
            <Field label="Preferred Date" val={form.date} onChange={v=>set("date",v)} type="date" />
            <div style={{marginBottom:12}}>
              <label style={labelStyle}>Notes / Special Instructions</label>
              <textarea value={form.notes} onChange={e=>set("notes",e.target.value)}
                placeholder="Access info, site contact, any special needs…" rows={3}
                style={{width:"100%",border:"1.5px solid #E2E8F0",borderRadius:10,padding:"12px",fontSize:15,fontFamily:"inherit",resize:"none",outline:"none",boxSizing:"border-box",marginTop:6}} />
            </div>
          </div>
        )}
 
        {/* Step 3 — Review */}
        {step === 3 && (
          <div>
            <StepTitle>Review your order</StepTitle>
            <ReviewSection title="👤 Contact">
              {[["Name",form.name],["Company",form.company],["Phone",form.phone],["Email",form.email]].filter(([,v])=>v).map(([l,v])=>(
                <ReviewRow key={l} label={l} value={v} />
              ))}
            </ReviewSection>
            <ReviewSection title="📍 Location">
              {[["Address",form.address],["Subdivision",form.subdivision],["Lot",form.lot]].filter(([,v])=>v).map(([l,v])=>(
                <ReviewRow key={l} label={l} value={v} />
              ))}
            </ReviewSection>
            <ReviewSection title="🪨 Material">
              {[["Material",form.material],["Loads",form.loads],["Tonnage",form.tonnage?`${form.tonnage} tons`:""],["Date",form.date],["Notes",form.notes]].filter(([,v])=>v).map(([l,v])=>(
                <ReviewRow key={l} label={l} value={v} />
              ))}
            </ReviewSection>
            <button onClick={()=>setStep(0)} style={{background:"none",border:"none",color:"#3B82F6",fontSize:14,fontWeight:600,cursor:"pointer",padding:"4px 0",marginBottom:8}}>
              ✏️ Edit order
            </button>
          </div>
        )}
      </div>
 
      {/* Bottom nav */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:"1px solid #E2E8F0",padding:"12px 16px",display:"flex",gap:10,maxWidth:480,margin:"0 auto"}}>
        {step > 0 && (
          <button onClick={()=>setStep(s=>s-1)}
            style={{flex:1,background:"#F1F5F9",color:"#475569",border:"none",borderRadius:12,padding:16,fontSize:16,fontWeight:700,cursor:"pointer"}}>
            ← Back
          </button>
        )}
        {step < 3 ? (
          <button onClick={()=>{ if(canNext()) setStep(s=>s+1); else alert("Please fill in the required fields."); }}
            style={{...btnPrimary, flex:2, opacity: canNext()?1:0.5}}>
            Next →
          </button>
        ) : (
          <button onClick={submit} disabled={status==="submitting"}
            style={{...btnPrimary, flex:2, background: status==="submitting"?"#94A3B8":"#10B981"}}>
            {status==="submitting" ? "Sending…" : "✅ Submit Order"}
          </button>
        )}
      </div>
    </Screen>
  );
}
 
// ── Helpers ───────────────────────────────────────────────────
const btnPrimary = { background:"#1E3A5F", color:"#fff", border:"none", borderRadius:12, padding:"16px", fontSize:16, fontWeight:700, cursor:"pointer", width:"100%", textAlign:"center", textDecoration:"none", display:"block" };
const labelStyle = { display:"block", fontSize:13, fontWeight:700, color:"#475569", marginBottom:2 };
 
function Screen({children}) {
  return <div style={{minHeight:"100vh",background:"#F8FAFC",fontFamily:"'Inter',system-ui,sans-serif"}}>{children}</div>;
}
 
function StepTitle({children}) {
  return <div style={{fontSize:20,fontWeight:800,color:"#1E293B",marginBottom:20,lineHeight:1.3}}>{children}</div>;
}
 
function Field({label, val, onChange, type="text", placeholder="", autoComplete}) {
  return (
    <div style={{marginBottom:14}}>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={val} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        autoComplete={autoComplete}
        style={{width:"100%",border:"1.5px solid #E2E8F0",borderRadius:10,padding:"14px 12px",fontSize:15,fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginTop:4}} />
    </div>
  );
}
 
function ReviewSection({title, children}) {
  return (
    <div style={{background:"#fff",borderRadius:12,padding:16,marginBottom:12,boxShadow:"0 1px 4px rgba(0,0,0,.06)"}}>
      <div style={{fontSize:13,fontWeight:700,color:"#94A3B8",marginBottom:10,textTransform:"uppercase",letterSpacing:.5}}>{title}</div>
      {children}
    </div>
  );
}
 
function ReviewRow({label, value}) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"5px 0",borderBottom:"1px solid #F8FAFC",gap:12}}>
      <span style={{fontSize:14,color:"#64748B",flexShrink:0}}>{label}</span>
      <span style={{fontSize:14,fontWeight:600,color:"#1E293B",textAlign:"right"}}>{value}</span>
    </div>
  );
}
 
