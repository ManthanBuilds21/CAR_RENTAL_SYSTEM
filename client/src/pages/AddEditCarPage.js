import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import carService from '../services/carService';
import toast from 'react-hot-toast';

const EMPTY = {
  brand:'', model:'', year:'', pricePerDay:'', seats:'',
  fuelType:'Petrol', transmission:'Manual', type:'Sedan',
  available:true, mileage:'', image:'', description:'', features:'',
};

const inp = {
  width:'100%', background:'#f7f7f5', border:'1px solid #ebebea',
  borderRadius:8, padding:'.85rem 1rem', fontSize:'.88rem',
  color:'#171715', outline:'none', fontFamily:"'DM Sans',sans-serif",
  transition:'border-color .25s, background .25s',
};
const onF = e => { e.target.style.borderColor='#171715'; e.target.style.background='#fff'; };
const onB = e => { e.target.style.borderColor='#ebebea'; e.target.style.background='#f7f7f5'; };

const AddEditCarPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    carService.getCarById(id)
      .then(car => setForm({ ...car, features: Array.isArray(car.features) ? car.features.join(', ') : '' }))
      .catch(() => toast.error('Failed to load car'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handle = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await carService.uploadImage(formData);
      setForm(f => ({ ...f, image: res.url }));
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const submit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        pricePerDay: Number(form.pricePerDay),
        seats: Number(form.seats),
        year: Number(form.year) || undefined,
        features: form.features ? form.features.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      if (isEdit) { await carService.updateCar(id, payload); toast.success('Car updated!'); }
      else { await carService.createCar(payload); toast.success('Car added successfully!'); }
      navigate('/admin');
    } catch (err) {
      toast.error(err && err.response && err.response.data && err.response.data.message ? err.response.data.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f7f7f5', paddingTop:72, flexDirection:'column', gap:'1rem' }}>
      <div style={{ width:32, height:32, border:'2px solid #ebebea', borderTopColor:'#171715', borderRadius:'50%', animation:'spin .7s linear infinite' }} />
      <p style={{ color:'#a0a09e', fontSize:'.85rem' }}>Loading car details…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#f7f7f5', paddingTop:72 }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes slideIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        .field-group label{font-size:.75rem;font-weight:500;color:#6b6b69;letter-spacing:.06em;display:block;margin-bottom:.4rem}
        .sel-input{width:100%;background:#f7f7f5;border:1px solid #ebebea;border-radius:8px;padding:.85rem 1rem;font-size:.88rem;color:#171715;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .25s,background .25s;appearance:none;cursor:pointer}
        .sel-input:focus{border-color:#171715;background:#fff}
      `}</style>

      {/* Page header */}
      <div style={{ background:'#fff', borderBottom:'1px solid #ebebea' }}>
        <div style={{ maxWidth:900, margin:'0 auto', padding:'1.25rem 2rem', display:'flex', alignItems:'center', gap:'.75rem' }}>
          <Link to="/admin" style={{ display:'flex', alignItems:'center', gap:'.35rem', fontSize:'.82rem', color:'#a0a09e', textDecoration:'none', transition:'color .2s' }}
            onMouseEnter={e=>e.currentTarget.style.color='#171715'}
            onMouseLeave={e=>e.currentTarget.style.color='#a0a09e'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Dashboard
          </Link>
          <span style={{ color:'#d9d9d7', fontSize:'.8rem' }}>/</span>
          <span style={{ fontSize:'.82rem', color:'#171715', fontWeight:500 }}>{isEdit ? 'Edit Car' : 'Add New Car'}</span>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'2.5rem 2rem', animation:'slideIn .35s ease' }}>

        {/* Title */}
        <div style={{ marginBottom:'2rem' }}>
          <p style={{ fontSize:'.7rem', fontWeight:500, letterSpacing:'.16em', textTransform:'uppercase', color:'#a0a09e', marginBottom:'.3rem' }}>
            {isEdit ? 'Editing' : 'Fleet Management'}
          </p>
          <h1 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1.75rem', fontWeight:500, letterSpacing:'-.02em', color:'#171715' }}>
            {isEdit ? 'Edit Car Details' : 'Add New Car'}
          </h1>
        </div>

        <form onSubmit={submit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }} className="form-grid">

            {/* LEFT COLUMN */}
            <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>

              {/* Basic Info Card */}
              <div style={{ background:'#fff', border:'1px solid #ebebea', borderRadius:14, padding:'1.75rem' }}>
                <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'.95rem', fontWeight:500, color:'#171715', marginBottom:'1.25rem', paddingBottom:'.75rem', borderBottom:'1px solid #f4f4f2' }}>
                  Basic Information
                </h2>
                <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>

                  <div className="field-group">
                    <label>Brand <span style={{ color:'#dc2626' }}>*</span></label>
                    <input name="brand" value={form.brand} onChange={handle} required placeholder="e.g. Mercedes-Benz" style={inp} onFocus={onF} onBlur={onB} />
                  </div>

                  <div className="field-group">
                    <label>Model <span style={{ color:'#dc2626' }}>*</span></label>
                    <input name="model" value={form.model} onChange={handle} required placeholder="e.g. C-Class" style={inp} onFocus={onF} onBlur={onB} />
                  </div>

                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                    <div className="field-group">
                      <label>Year</label>
                      <input type="number" name="year" value={form.year} onChange={handle} placeholder="2024" style={inp} onFocus={onF} onBlur={onB} />
                    </div>
                    <div className="field-group">
                      <label>Seats <span style={{ color:'#dc2626' }}>*</span></label>
                      <input type="number" name="seats" value={form.seats} onChange={handle} required placeholder="5" style={inp} onFocus={onF} onBlur={onB} />
                    </div>
                  </div>

                  <div className="field-group">
                    <label>Price Per Day (₹) <span style={{ color:'#dc2626' }}>*</span></label>
                    <div style={{ position:'relative' }}>
                      <span style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'#6b6b69', fontSize:'.9rem', fontWeight:500 }}>₹</span>
                      <input type="number" name="pricePerDay" value={form.pricePerDay} onChange={handle} required placeholder="5000" style={{ ...inp, paddingLeft:'2rem' }} onFocus={onF} onBlur={onB} />
                    </div>
                  </div>

                  <div className="field-group">
                    <label>Mileage</label>
                    <input name="mileage" value={form.mileage} onChange={handle} placeholder="e.g. 15 km/l" style={inp} onFocus={onF} onBlur={onB} />
                  </div>
                </div>
              </div>

              {/* Specs Card */}
              <div style={{ background:'#fff', border:'1px solid #ebebea', borderRadius:14, padding:'1.75rem' }}>
                <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'.95rem', fontWeight:500, color:'#171715', marginBottom:'1.25rem', paddingBottom:'.75rem', borderBottom:'1px solid #f4f4f2' }}>
                  Specifications
                </h2>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem' }}>
                  {[
                    { name:'fuelType', label:'Fuel Type', options:['Petrol','Diesel','Electric','Hybrid','CNG'] },
                    { name:'transmission', label:'Transmission', options:['Manual','Automatic'] },
                    { name:'type', label:'Car Type', options:['Sedan','SUV','Hatchback','MUV','Luxury','Convertible','Pickup'] },
                  ].map(({ name, label, options }) => (
                    <div key={name} className="field-group">
                      <label>{label}</label>
                      <div style={{ position:'relative' }}>
                        <select name={name} value={form[name]} onChange={handle} className="sel-input">
                          {options.map(o => <option key={o}>{o}</option>)}
                        </select>
                        <svg style={{ position:'absolute', right:'.75rem', top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'#a0a09e' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop:'1rem' }} className="field-group">
                  <label>Features (comma separated)</label>
                  <input name="features" value={form.features} onChange={handle} placeholder="e.g. Sunroof, Leather Seats, GPS" style={inp} onFocus={onF} onBlur={onB} />
                </div>

                {/* Availability toggle */}
                <div style={{ marginTop:'1rem', display:'flex', alignItems:'center', gap:'.75rem', padding:'.9rem 1rem', background:'#f7f7f5', borderRadius:8, border:'1px solid #ebebea' }}>
                  <div
                    onClick={() => setForm(f => ({ ...f, available: !f.available }))}
                    style={{ width:40, height:22, borderRadius:11, background:form.available?'#171715':'#d9d9d7', position:'relative', cursor:'pointer', transition:'background .25s', flexShrink:0 }}
                  >
                    <div style={{ position:'absolute', top:3, left:form.available?20:3, width:16, height:16, borderRadius:'50%', background:'#fff', transition:'left .25s', boxShadow:'0 1px 4px rgba(0,0,0,.2)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize:'.85rem', fontWeight:500, color:'#171715' }}>Available for booking</div>
                    <div style={{ fontSize:'.74rem', color:'#a0a09e' }}>{form.available ? 'Car is visible and bookable' : 'Car is hidden from customers'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>

              {/* Image Upload Card */}
              <div style={{ background:'#fff', border:'1px solid #ebebea', borderRadius:14, padding:'1.75rem' }}>
                <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'.95rem', fontWeight:500, color:'#171715', marginBottom:'1.25rem', paddingBottom:'.75rem', borderBottom:'1px solid #f4f4f2' }}>
                  Car Image
                </h2>

                {/* Preview */}
                {(imagePreview || form.image) ? (
                  <div style={{ position:'relative', borderRadius:10, overflow:'hidden', aspectRatio:'16/10', marginBottom:'1rem', background:'#f4f4f2' }}>
                    <img src={imagePreview || form.image} alt="preview" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    <label htmlFor="img-upload" style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.4)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', opacity:0, transition:'opacity .25s' }}
                      onMouseEnter={e=>e.currentTarget.style.opacity='1'}
                      onMouseLeave={e=>e.currentTarget.style.opacity='0'}
                    >
                      <span style={{ color:'#fff', fontSize:'.82rem', fontWeight:500, background:'rgba(0,0,0,.5)', padding:'.5rem 1rem', borderRadius:8 }}>Change Image</span>
                    </label>
                  </div>
                ) : (
                  <label htmlFor="img-upload"
                    onDragOver={e=>{e.preventDefault();setDragOver(true)}}
                    onDragLeave={()=>setDragOver(false)}
                    onDrop={e=>{e.preventDefault();setDragOver(false);const f=e.dataTransfer.files[0];if(f){handleImageUpload({target:{files:[f]}})}}}
                    style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'.75rem', border:`2px dashed ${dragOver?'#171715':'#d9d9d7'}`, borderRadius:10, padding:'2.5rem 1.5rem', cursor:'pointer', background:dragOver?'#f7f7f5':'transparent', transition:'all .25s', marginBottom:'1rem' }}
                  >
                    <div style={{ width:44, height:44, borderRadius:10, background:'#f4f4f2', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a0a09e" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </div>
                    <div style={{ textAlign:'center' }}>
                      <p style={{ fontSize:'.85rem', fontWeight:500, color:'#171715' }}>Click to upload or drag & drop</p>
                      <p style={{ fontSize:'.76rem', color:'#a0a09e', marginTop:'.2rem' }}>PNG, JPG or WEBP — max 5MB</p>
                    </div>
                  </label>
                )}

                <input id="img-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display:'none' }} />

                {uploading && (
                  <div style={{ display:'flex', alignItems:'center', gap:'.6rem', padding:'.75rem 1rem', background:'#f7f7f5', borderRadius:8, fontSize:'.82rem', color:'#6b6b69' }}>
                    <div style={{ width:16, height:16, border:'2px solid #ebebea', borderTopColor:'#171715', borderRadius:'50%', animation:'spin .7s linear infinite', flexShrink:0 }} />
                    Uploading image…
                  </div>
                )}
              </div>

              {/* Description Card */}
              <div style={{ background:'#fff', border:'1px solid #ebebea', borderRadius:14, padding:'1.75rem' }}>
                <h2 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'.95rem', fontWeight:500, color:'#171715', marginBottom:'1.25rem', paddingBottom:'.75rem', borderBottom:'1px solid #f4f4f2' }}>
                  Description
                </h2>
                <div className="field-group">
                  <label>Car Description</label>
                  <textarea name="description" value={form.description} onChange={handle} rows={5}
                    placeholder="Describe the car — features, condition, any special notes…"
                    style={{ ...inp, resize:'vertical', lineHeight:1.7 }}
                    onFocus={onF} onBlur={onB}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display:'flex', gap:'.75rem' }}>
                <button type="submit" disabled={saving || uploading}
                  style={{ flex:1, padding:'.9rem', background:saving||uploading?'#d9d9d7':'#171715', color:'#fff', border:'none', borderRadius:8, fontSize:'.88rem', fontWeight:500, fontFamily:"'DM Sans',sans-serif", cursor:saving||uploading?'not-allowed':'pointer', transition:'background .25s, transform .2s', display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem' }}
                  onMouseEnter={e=>{if(!saving&&!uploading)e.currentTarget.style.background='#3a3a38'}}
                  onMouseLeave={e=>{if(!saving&&!uploading)e.currentTarget.style.background='#171715'}}
                >
                  {saving && <div style={{ width:16, height:16, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .7s linear infinite' }} />}
                  {saving ? 'Saving…' : isEdit ? 'Update Car' : 'Add Car'}
                </button>
                <button type="button" onClick={() => navigate('/admin')}
                  style={{ padding:'.9rem 1.5rem', background:'transparent', color:'#6b6b69', border:'1px solid #ebebea', borderRadius:8, fontSize:'.88rem', fontWeight:500, fontFamily:"'DM Sans',sans-serif", cursor:'pointer', transition:'all .2s' }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='#171715';e.currentTarget.style.color='#171715';e.currentTarget.style.background='#f7f7f5'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='#ebebea';e.currentTarget.style.color='#6b6b69';e.currentTarget.style.background='transparent'}}
                >Cancel</button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @media(max-width:768px){ .form-grid{grid-template-columns:1fr!important} }
      `}</style>
    </div>
  );
};

export default AddEditCarPage;