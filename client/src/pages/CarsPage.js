  // ============================================================
  //  CarsPage.js
  //  Path: client/src/pages/CarsPage.js
  //  Replace your existing CarsPage.js entirely
  // ============================================================

  import React, { useState } from 'react';
  import { useSearchParams } from 'react-router-dom';
  import CarCard from '../components/CarCard';
  import SearchFilters from '../components/SearchFilters';
  import { CarCardSkeleton } from '../components/Loader';
  import Pagination from '../components/Pagination';
  import useCars from '../hooks/useCars';

  const CarsPage = () => {
    const [searchParams] = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);
    const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

    const initialParams = {
      search: searchParams.get('search') || '',
      type: searchParams.get('type') || '',
      page: 1,
      limit: 9,
      sort: '-createdAt',
    };

    const { cars, loading, error, pagination, params, updateParams } = useCars(initialParams);

    const handleFilterChange = newFilters => updateParams(newFilters);

    const handleReset = () => {
      setSearchInput('');
      updateParams({
        search: '', type: '', brand: '', fuelType: '',
        transmission: '', minPrice: '', maxPrice: '',
        seats: '', available: '', page: 1, sort: '-createdAt',
      });
    };

    const handleSearch = e => {
      e.preventDefault();
      updateParams({ search: searchInput, page: 1 });
    };

    const activeFilterCount = ['search','type','brand','fuelType','transmission','minPrice','maxPrice','seats','available']
      .filter(k => params[k]).length;

    const SORT_OPTIONS = [
      { value:'-createdAt', label:'Newest First' },
      { value:'pricePerDay', label:'Price: Low to High' },
      { value:'-pricePerDay', label:'Price: High to Low' },
      { value:'-rating', label:'Top Rated' },
    ];

    return (
      <div style={{ background:'#f7f7f5', minHeight:'100vh', paddingTop:72 }}>

        {/* ── Page Header ── */}
        <div style={{ background:'#fff', borderBottom:'1px solid #ebebea' }}>
          <div style={{ maxWidth:1280, margin:'0 auto', padding:'2rem 2rem 1.5rem' }}>

            {/* Title row */}
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', marginBottom:'1.25rem' }}>
              <div>
                <p style={{ fontSize:'.72rem', fontWeight:500, letterSpacing:'.16em', textTransform:'uppercase', color:'#a0a09e', marginBottom:'.3rem' }}>
                  Fleet
                </p>
                <h1 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'clamp(1.5rem,3vw,2rem)', fontWeight:500, letterSpacing:'-.02em', color:'#171715' }}>
                  Browse All Cars
                </h1>
              </div>
              <p style={{ fontSize:'.85rem', color:'#a0a09e' }}>
                {loading ? 'Searching…' : `${pagination?.total || 0} cars available`}
              </p>
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearch} style={{ display:'flex', gap:'.75rem', flexWrap:'wrap' }}>
              <div style={{ position:'relative', flex:1, minWidth:200 }}>
                <svg style={{ position:'absolute', left:'.9rem', top:'50%', transform:'translateY(-50%)', color:'#a0a09e', pointerEvents:'none' }}
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Search by brand, model, or type…"
                  style={{
                    width:'100%', paddingLeft:'2.5rem', paddingRight:'1rem',
                    height:42, border:'1px solid #ebebea', borderRadius:8,
                    fontSize:'.88rem', color:'#171715', outline:'none',
                    fontFamily:"'DM Sans',sans-serif", background:'#f7f7f5',
                    transition:'border-color .25s, background .25s',
                  }}
                  onFocus={e=>{ e.target.style.borderColor='#171715'; e.target.style.background='#fff'; }}
                  onBlur={e=>{ e.target.style.borderColor='#ebebea'; e.target.style.background='#f7f7f5'; }}
                />
              </div>

              {/* Sort */}
              <select
                value={params.sort}
                onChange={e => updateParams({ sort: e.target.value, page: 1 })}
                style={{
                  height:42, padding:'0 2rem 0 .9rem', border:'1px solid #ebebea',
                  borderRadius:8, fontSize:'.84rem', color:'#171715', outline:'none',
                  fontFamily:"'DM Sans',sans-serif", background:'#f7f7f5',
                  cursor:'pointer', appearance:'none', WebkitAppearance:'none',
                  backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23a0a09e' stroke-width='1.5' fill='none'/%3E%3C/svg%3E\")",
                  backgroundRepeat:'no-repeat', backgroundPosition:'right .75rem center',
                  transition:'border-color .25s',
                }}
                onFocus={e=>e.target.style.borderColor='#171715'}
                onBlur={e=>e.target.style.borderColor='#ebebea'}
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>

              <button type="submit" style={{
                height:42, padding:'0 1.5rem',
                background:'#171715', color:'#fff',
                border:'none', borderRadius:8,
                fontSize:'.84rem', fontWeight:500,
                fontFamily:"'DM Sans',sans-serif", cursor:'pointer',
                transition:'background .25s',
                whiteSpace:'nowrap',
              }}
                onMouseEnter={e=>e.target.style.background='#3a3a38'}
                onMouseLeave={e=>e.target.style.background='#171715'}
              >
                Search
              </button>

              {/* Mobile filter toggle */}
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  height:42, padding:'0 1.1rem',
                  border:'1px solid #ebebea', borderRadius:8,
                  background: showFilters ? '#171715' : '#fff',
                  color: showFilters ? '#fff' : '#6b6b69',
                  fontSize:'.84rem', fontWeight:500,
                  fontFamily:"'DM Sans',sans-serif", cursor:'pointer',
                  display:'flex', alignItems:'center', gap:'.5rem',
                  transition:'all .25s', position:'relative',
                }}
                className="filter-toggle-btn"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span style={{
                    position:'absolute', top:-6, right:-6,
                    width:18, height:18, borderRadius:'50%',
                    background:'#171715', color:'#fff',
                    fontSize:'.65rem', fontWeight:700,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    border:'2px solid #fff',
                  }}>
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </form>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:'.5rem', marginTop:'1rem' }}>
                <span style={{ fontSize:'.74rem', color:'#a0a09e', fontWeight:500 }}>Active:</span>
                {params.search      && <Chip label={`"${params.search}"`}    onRemove={() => { setSearchInput(''); updateParams({ search:'' }); }} />}
                {params.type        && <Chip label={params.type}              onRemove={() => updateParams({ type:'' })} />}
                {params.brand       && <Chip label={params.brand}             onRemove={() => updateParams({ brand:'' })} />}
                {params.fuelType    && <Chip label={params.fuelType}          onRemove={() => updateParams({ fuelType:'' })} />}
                {params.transmission&& <Chip label={params.transmission}      onRemove={() => updateParams({ transmission:'' })} />}
                {params.available   && <Chip label="Available only"           onRemove={() => updateParams({ available:'' })} />}
                {params.minPrice    && <Chip label={`Min ₹${params.minPrice}`}onRemove={() => updateParams({ minPrice:'' })} />}
                {params.maxPrice    && <Chip label={`Max ₹${params.maxPrice}`}onRemove={() => updateParams({ maxPrice:'' })} />}
                {params.seats       && <Chip label={`${params.seats} seats`}  onRemove={() => updateParams({ seats:'' })} />}
                <button onClick={handleReset} style={{ fontSize:'.74rem', color:'#dc2626', background:'none', border:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", marginLeft:'.25rem' }}>
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'2rem', display:'flex', gap:'1.5rem', alignItems:'flex-start' }}>

          {/* ── Sidebar Filters ── */}
          <aside style={{
            width:260, flexShrink:0,
            display: showFilters ? 'block' : 'none',
            position:'sticky', top:88,
          }} className="filter-sidebar">
            <div style={{ background:'#fff', border:'1px solid #ebebea', borderRadius:12, overflow:'hidden' }}>
              <div style={{ padding:'1.1rem 1.25rem', borderBottom:'1px solid #ebebea', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:'.95rem', fontWeight:500 }}>Filters</span>
                {activeFilterCount > 0 && (
                  <button onClick={handleReset} style={{ fontSize:'.76rem', color:'#dc2626', background:'none', border:'none', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
                    Reset all
                  </button>
                )}
              </div>
              {/* SearchFilters renders its own UI — we apply a light theme override */}
              <div className="filters-light-wrap">
                <SearchFilters
                  params={params}
                  onFilterChange={handleFilterChange}
                  onReset={handleReset}
                />
              </div>
            </div>
          </aside>

          {/* ── Car Grid ── */}
          <div style={{ flex:1, minWidth:0 }}>

            {/* Error */}
            {error && (
              <div style={{ textAlign:'center', padding:'5rem 2rem' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>😕</div>
                <p style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1rem', fontWeight:500, marginBottom:'.4rem' }}>Failed to load cars</p>
                <p style={{ fontSize:'.85rem', color:'#a0a09e' }}>{error}</p>
              </div>
            )}

            {/* Grid */}
            {!error && (
              <>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.25rem' }}>
                  {loading
                    ? Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)
                    : cars.map(car => <CarCard key={car._id} car={car} />)
                  }
                </div>

                {/* Empty state */}
                {!loading && cars.length === 0 && (
                  <div style={{ textAlign:'center', padding:'6rem 2rem', background:'#fff', borderRadius:12, border:'1px solid #ebebea' }}>
                    <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>🚘</div>
                    <h3 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'1.1rem', fontWeight:500, marginBottom:'.5rem' }}>No cars found</h3>
                    <p style={{ fontSize:'.86rem', color:'#a0a09e', marginBottom:'1.5rem' }}>Try adjusting your filters or search terms.</p>
                    <button onClick={handleReset} style={{
                      background:'#171715', color:'#fff', border:'none',
                      padding:'.75rem 1.75rem', borderRadius:8,
                      fontSize:'.84rem', fontWeight:500,
                      fontFamily:"'DM Sans',sans-serif", cursor:'pointer',
                    }}>
                      Reset Filters
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {!loading && pagination?.pages > 1 && (
                  <div style={{ marginTop:'2rem' }}>
                    <PaginationBar
                      currentPage={pagination.currentPage}
                      totalPages={pagination.pages}
                      onPageChange={p => updateParams({ page: p })}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <style>{`
          /* Always show sidebar on desktop */
          @media(min-width:1024px){
            .filter-sidebar{ display:block !important; }
            .filter-toggle-btn{ display:none !important; }
          }
          @media(max-width:600px){
            .filter-sidebar{ width:100% !important; position:static !important; }
          }

          /* Override SearchFilters dark styles to light */
          .filters-light-wrap label { color:#6b6b69 !important; font-size:.8rem !important; }
          .filters-light-wrap input,
          .filters-light-wrap select {
            background:#f7f7f5 !important;
            border:1px solid #ebebea !important;
            color:#171715 !important;
            border-radius:8px !important;
            font-family:'DM Sans',sans-serif !important;
          }
          .filters-light-wrap input:focus,
          .filters-light-wrap select:focus {
            border-color:#171715 !important;
            background:#fff !important;
            outline:none !important;
          }
          .filters-light-wrap button {
            font-family:'DM Sans',sans-serif !important;
          }
          .filters-light-wrap { padding:1.25rem; }
        `}</style>
      </div>
    );
  };

  /* ── Filter Chip ── */
  const Chip = ({ label, onRemove }) => (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:'.4rem',
      padding:'.3rem .75rem',
      background:'#f7f7f5', border:'1px solid #d9d9d7',
      borderRadius:20, fontSize:'.74rem', fontWeight:500, color:'#3a3a38',
    }}>
      {label}
      <button onClick={onRemove} style={{
        background:'none', border:'none', cursor:'pointer',
        color:'#a0a09e', fontSize:'.75rem', lineHeight:1,
        padding:0, display:'flex', alignItems:'center',
        transition:'color .2s',
      }}
        onMouseEnter={e=>e.target.style.color='#171715'}
        onMouseLeave={e=>e.target.style.color='#a0a09e'}
      >✕</button>
    </span>
  );

  /* ── Skeleton Card ── */
  const SkeletonCard = () => (
    <div style={{ background:'#fff', border:'1px solid #ebebea', borderRadius:16, overflow:'hidden' }}>
      <div style={{ aspectRatio:'16/10', background:'#f4f4f2', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent 0%,rgba(255,255,255,.6) 50%,transparent 100%)', animation:'shimmer 1.4s infinite' }} />
      </div>
      <div style={{ padding:'1.4rem 1.5rem' }}>
        {[['60%','0.7rem'],['80%','1rem'],['100%','0.75rem'],['50%','0.75rem']].map(([w,h],i)=>(
          <div key={i} style={{ height:h, background:'#f4f4f2', borderRadius:4, marginBottom:'.7rem', width:w, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent 0%,rgba(255,255,255,.6) 50%,transparent 100%)', animation:`shimmer 1.4s ${i*.15}s infinite` }} />
          </div>
        ))}
      </div>
      <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
    </div>
  );

  /* ── Pagination ── */
  const PaginationBar = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const btnBase = {
      width:36, height:36, border:'1px solid #ebebea', borderRadius:8,
      background:'transparent', cursor:'pointer', display:'flex',
      alignItems:'center', justifyContent:'center',
      fontSize:'.84rem', fontFamily:"'DM Sans',sans-serif",
      transition:'all .2s',
    };
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'.4rem', flexWrap:'wrap' }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ ...btnBase, color: currentPage===1 ? '#d9d9d7' : '#6b6b69', cursor: currentPage===1 ? 'not-allowed' : 'pointer' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>

        {pages.map(p => (
          <button key={p} onClick={() => onPageChange(p)} style={{
            ...btnBase,
            background: p === currentPage ? '#171715' : 'transparent',
            color:       p === currentPage ? '#fff' : '#6b6b69',
            borderColor: p === currentPage ? '#171715' : '#ebebea',
            fontWeight:  p === currentPage ? 500 : 400,
          }}>{p}</button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{ ...btnBase, color: currentPage===totalPages ? '#d9d9d7' : '#6b6b69', cursor: currentPage===totalPages ? 'not-allowed' : 'pointer' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    );
  };

  export default CarsPage;