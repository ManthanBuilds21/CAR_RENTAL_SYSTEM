// ============================================================
//  SearchFilters.js
//  Path: client/src/components/SearchFilters.js
//  Replace your existing SearchFilters.js entirely
// ============================================================

import React, { useState } from 'react';

const BRANDS        = ['Toyota','Hyundai','Mahindra','Maruti','Honda','BMW','Mercedes','Tata','Kia','Ford','Volkswagen'];
const TYPES         = ['SUV','Sedan','Hatchback','MUV','Luxury','Convertible','Pickup'];
const FUELS         = ['Petrol','Diesel','Electric','Hybrid','CNG'];
const TRANSMISSIONS = ['Manual','Automatic'];
const SORT_OPTIONS  = [
  { value: '-createdAt',   label: 'Newest First' },
  { value: 'pricePerDay',  label: 'Price: Low to High' },
  { value: '-pricePerDay', label: 'Price: High to Low' },
  { value: '-rating',      label: 'Top Rated' },
];

/* ── Filter Chip ── */
const FilterChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '.3rem .85rem',
      borderRadius: 20,
      border: `1px solid ${active ? '#171715' : '#ebebea'}`,
      background: active ? '#171715' : '#fff',
      color: active ? '#fff' : '#6b6b69',
      fontSize: '.78rem',
      fontWeight: 500,
      fontFamily: "'DM Sans', sans-serif",
      cursor: 'pointer',
      transition: 'all .2s',
      whiteSpace: 'nowrap',
    }}
    onMouseEnter={e => {
      if (active) return;
      e.currentTarget.style.borderColor = '#171715';
      e.currentTarget.style.color = '#171715';
    }}
    onMouseLeave={e => {
      if (active) return;
      e.currentTarget.style.borderColor = '#ebebea';
      e.currentTarget.style.color = '#6b6b69';
    }}
  >
    {label}
  </button>
);

/* ── Section Label ── */
const SectionLabel = ({ children }) => (
  <p style={{
    fontSize: '.68rem',
    fontWeight: 500,
    letterSpacing: '.12em',
    textTransform: 'uppercase',
    color: '#a0a09e',
    marginBottom: '.6rem',
  }}>
    {children}
  </p>
);

/* ── Input style ── */
const inputStyle = {
  width: '100%',
  background: '#f7f7f5',
  border: '1px solid #ebebea',
  borderRadius: 8,
  padding: '.7rem .9rem',
  fontSize: '.85rem',
  color: '#171715',
  outline: 'none',
  fontFamily: "'DM Sans', sans-serif",
  transition: 'border-color .25s, background .25s',
};

const SearchFilters = ({ params, onFilterChange, onReset }) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (key, value) => {
    onFilterChange({ [key]: value === params[key] ? '' : value, page: 1 });
  };

  const handlePriceChange = (key, value) => {
    onFilterChange({ [key]: value, page: 1 });
  };

  const onFocus = e => { e.target.style.borderColor = '#171715'; e.target.style.background = '#fff'; };
  const onBlur  = e => { e.target.style.borderColor = '#ebebea'; e.target.style.background = '#f7f7f5'; };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <svg style={{ position:'absolute', left:'.9rem', top:'50%', transform:'translateY(-50%)', color:'#a0a09e', pointerEvents:'none' }}
          width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Search brand or model…"
          value={params.search || ''}
          onChange={e => onFilterChange({ search: e.target.value, page: 1 })}
          style={{ ...inputStyle, paddingLeft: '2.4rem' }}
          onFocus={onFocus} onBlur={onBlur}
        />
      </div>

      {/* Sort */}
      <div>
        <SectionLabel>Sort By</SectionLabel>
        <select
          value={params.sort || '-createdAt'}
          onChange={e => onFilterChange({ sort: e.target.value })}
          style={{
            ...inputStyle,
            appearance: 'none',
            WebkitAppearance: 'none',
            paddingRight: '2rem',
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23a0a09e' stroke-width='1.5' fill='none'/%3E%3C/svg%3E\")",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right .75rem center',
            cursor: 'pointer',
          }}
          onFocus={onFocus} onBlur={onBlur}
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Car Type */}
      <div>
        <SectionLabel>Car Type</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
          {TYPES.map(type => (
            <FilterChip key={type} label={type} active={params.type === type} onClick={() => handleChange('type', type)} />
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <SectionLabel>Brand</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
          {BRANDS.map(brand => (
            <FilterChip key={brand} label={brand} active={params.brand === brand} onClick={() => handleChange('brand', brand)} />
          ))}
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <SectionLabel>Fuel Type</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
          {FUELS.map(fuel => (
            <FilterChip key={fuel} label={fuel} active={params.fuelType === fuel} onClick={() => handleChange('fuelType', fuel)} />
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div>
        <SectionLabel>Transmission</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
          {TRANSMISSIONS.map(t => (
            <FilterChip key={t} label={t} active={params.transmission === t} onClick={() => handleChange('transmission', t)} />
          ))}
        </div>
      </div>

      {/* Advanced Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '.4rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '.78rem',
          fontWeight: 500,
          color: '#a0a09e',
          fontFamily: "'DM Sans', sans-serif",
          padding: 0,
          transition: 'color .2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#171715'}
        onMouseLeave={e => e.currentTarget.style.color = '#a0a09e'}
      >
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ transition: 'transform .25s', transform: expanded ? 'rotate(180deg)' : 'none' }}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
        {expanded ? 'Hide advanced filters' : 'Show advanced filters'}
      </button>

      {/* Advanced Section */}
      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingTop: '.25rem' }}>

          {/* Price Range */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
            <div>
              <SectionLabel>Min Price (₹/day)</SectionLabel>
              <input
                type="number" placeholder="1000" min="0"
                value={params.minPrice || ''}
                onChange={e => handlePriceChange('minPrice', e.target.value)}
                style={inputStyle} onFocus={onFocus} onBlur={onBlur}
              />
            </div>
            <div>
              <SectionLabel>Max Price (₹/day)</SectionLabel>
              <input
                type="number" placeholder="50000" min="0"
                value={params.maxPrice || ''}
                onChange={e => handlePriceChange('maxPrice', e.target.value)}
                style={inputStyle} onFocus={onFocus} onBlur={onBlur}
              />
            </div>
          </div>

          {/* Seats */}
          <div>
            <SectionLabel>Seats</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
              {[2, 4, 5, 7, 8].map(s => (
                <FilterChip key={s} label={`${s}+`} active={Number(params.seats) === s} onClick={() => handleChange('seats', s)} />
              ))}
            </div>
          </div>

          {/* Available Only Toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '.75rem', cursor: 'pointer' }}>
            {/* Custom toggle */}
            <div style={{ position: 'relative', width: 40, height: 22, flexShrink: 0 }}>
              <input
                type="checkbox"
                checked={params.available === 'true'}
                onChange={e => onFilterChange({ available: e.target.checked ? 'true' : '', page: 1 })}
                style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
              />
              <div
                onClick={() => onFilterChange({ available: params.available === 'true' ? '' : 'true', page: 1 })}
                style={{
                  width: 40, height: 22, borderRadius: 11,
                  background: params.available === 'true' ? '#171715' : '#d9d9d7',
                  transition: 'background .25s',
                  position: 'relative', cursor: 'pointer',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 3, left: params.available === 'true' ? 21 : 3,
                  width: 16, height: 16,
                  borderRadius: '50%',
                  background: '#fff',
                  transition: 'left .25s',
                  boxShadow: '0 1px 4px rgba(0,0,0,.15)',
                }} />
              </div>
            </div>
            <span style={{ fontSize: '.82rem', fontWeight: 500, color: '#3a3a38' }}>
              Available cars only
            </span>
          </label>
        </div>
      )}

      {/* Divider */}
      <div style={{ height: 1, background: '#f4f4f2' }} />

      {/* Reset */}
      <button
        onClick={onReset}
        style={{
          width: '100%',
          padding: '.75rem',
          border: '1px solid #ebebea',
          borderRadius: 8,
          background: 'transparent',
          fontSize: '.82rem',
          fontWeight: 500,
          color: '#6b6b69',
          fontFamily: "'DM Sans', sans-serif",
          cursor: 'pointer',
          transition: 'all .2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#171715';
          e.currentTarget.style.color = '#171715';
          e.currentTarget.style.background = '#f7f7f5';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#ebebea';
          e.currentTarget.style.color = '#6b6b69';
          e.currentTarget.style.background = 'transparent';
        }}
      >
        Reset All Filters
      </button>

    </div>
  );
};

export default SearchFilters;