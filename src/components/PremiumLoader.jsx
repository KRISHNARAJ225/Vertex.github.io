import React from 'react';
import { Box, Typography, Stack } from '@mui/material';

/**
 * Premium Shimmer/Skeleton Loading Component
 * Variants: 'fullpage', 'table', 'card', 'receipt', 'inline'
 */

const shimmerStyle = {
  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 37%, #f0f0f0 63%)',
  backgroundSize: '400% 100%',
  animation: 'shimmer 1.4s ease infinite',
};

const darkShimmerStyle = {
  background: 'linear-gradient(90deg, #1e1e2d 25%, #2a2a3d 37%, #1e1e2d 63%)',
  backgroundSize: '400% 100%',
  animation: 'shimmer 1.4s ease infinite',
};

// Inject keyframes into document head once
if (typeof document !== 'undefined') {
  const styleId = 'premium-loader-keyframes';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes shimmer {
        0% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulse-glow {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }
      @keyframes logo-breathe {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      @keyframes speed-line {
        from { left: 110%; }
        to { left: -20%; }
      }
      @keyframes truck-bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-2px); }
      }
      @keyframes wheel-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes box-slide {
        0% { transform: translate(-20px, -10px) scale(0); opacity: 0; }
        30% { transform: translate(0, 0) scale(1); opacity: 1; }
        100% { transform: translate(0, 0) scale(1); opacity: 1; }
      }
      @keyframes checkmark-draw {
        0% { stroke-dashoffset: 48; }
        100% { stroke-dashoffset: 0; }
      }
      @keyframes checkmark-circle {
        0% { stroke-dashoffset: 166; }
        100% { stroke-dashoffset: 0; }
      }
      @keyframes checkmark-block {
        0% { transform: scale(0); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes confetti-burst {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-100px) scale(0); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

const ShimmerBlock = ({ width = '100%', height = '16px', borderRadius = '8px', style: extra = {}, dark = false }) => (
  <div
    style={{
      ...(dark ? darkShimmerStyle : shimmerStyle),
      width,
      height,
      borderRadius,
      ...extra,
    }}
  />
);

// ───────────── Multi-Object Premium Loader (Random Selection) ─────────────
const RocketLoader = ({ accentColor = '#6366f1' }) => {
  const [objectType] = React.useState(() => {
    const types = ['superman', 'van', 'rocket'];
    return types[Math.floor(Math.random() * types.length)];
  });

  const renderObject = () => {
    switch (objectType) {
      case 'van':
        return (
          <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="25" width="75" height="42" rx="6" fill={accentColor} />
            <path d="M85 35L105 35C108.314 35 111 37.6863 111 41V67H85V35Z" fill={accentColor} opacity="0.9" />
            <path d="M90 40H102C104.209 40 106 41.7909 106 44V55H90V40Z" fill="white" opacity="0.2" />
            <rect x="25" y="35" width="45" height="22" rx="3" fill="white" opacity="0.1" />
            <text x="32" y="50" fill="white" fontSize="8" fontWeight="900" opacity="0.4">SHOPSY</text>
            <circle cx="35" cy="72" r="8" fill="#1e1e1e" />
            <circle cx="35" cy="72" r="4" fill="#444" style={{ animation: 'wheel-spin 0.5s linear infinite', transformOrigin: '35px 72px' }} />
            <circle cx="90" cy="72" r="8" fill="#1e1e1e" />
            <circle cx="90" cy="72" r="4" fill="#444" style={{ animation: 'wheel-spin 0.5s linear infinite', transformOrigin: '90px 72px' }} />
          </svg>
        );
      case 'rocket':
        return (
          <svg width="140" height="60" viewBox="0 0 140 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Flame — trails on the LEFT */}
            <ellipse cx="14" cy="30" rx="14" ry="7" fill="#FF6B00" opacity="0.9" style={{ animation: 'flame-flicker 0.15s ease-in-out infinite alternate' }} />
            <ellipse cx="10" cy="30" rx="10" ry="4" fill="#FFD700" opacity="0.8" style={{ animation: 'flame-flicker 0.2s ease-in-out infinite alternate-reverse' }} />
            {/* Rocket body */}
            <rect x="28" y="22" width="72" height="16" rx="4" fill="#dc2626" />
            {/* Nose cone — RIGHT side */}
            <path d="M100 22L125 30L100 38Z" fill="#b91c1c" />
            {/* Cockpit window */}
            <circle cx="80" cy="30" r="6" fill="white" opacity="0.3" />
            <circle cx="80" cy="30" r="3" fill="white" opacity="0.5" />
            {/* Top fin */}
            <path d="M45 22L38 10L65 22Z" fill="#b91c1c" opacity="0.85" />
            {/* Bottom fin */}
            <path d="M45 38L38 50L65 38Z" fill="#b91c1c" opacity="0.85" />
          </svg>
        );
      default: // superman
        return (
          <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Cape streaming behind */}
            <path d="M55 30C55 30 30 28 15 38C10 42 12 50 20 48C30 45 50 40 55 40Z" fill="#e11d48" opacity="0.9" />
            <path d="M55 40C55 40 30 45 20 52C14 56 16 64 24 61C34 57 52 50 55 50Z" fill="#9f1239" opacity="0.7" />
            {/* Body / suit */}
            <ellipse cx="70" cy="40" rx="16" ry="12" fill="#1d4ed8" />
            {/* S shield */}
            <rect x="63" y="33" width="14" height="14" rx="3" fill="#FFD700" />
            <text x="70" y="44" fill="#e11d48" fontSize="9" fontWeight="900" textAnchor="middle">S</text>
            {/* Head */}
            <circle cx="90" cy="32" r="10" fill="#FBBF73" />
            {/* Hair */}
            <path d="M82 26C82 26 84 20 90 20C96 20 98 26 98 26C98 26 94 24 90 25C86 24 82 26 82 26Z" fill="#1c1c1c" />
            {/* Arm stretched forward */}
            <path d="M86 36L110 28C113 27 115 29 113 31L90 40Z" fill="#1d4ed8" />
            {/* Fist */}
            <circle cx="112" cy="29" r="5" fill="#FBBF73" />
            {/* Legs streaming back */}
            <path d="M55 42L38 55C35 58 37 62 40 60L58 50Z" fill="#1d4ed8" />
            {/* Boot */}
            <ellipse cx="37" cy="59" rx="5" ry="4" fill="#e11d48" />
          </svg>
        );
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a',
      gap: '32px',
      fontFamily: "'Inter', sans-serif",
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes flame-flicker {
          from { transform: scaleY(1) scaleX(1); }
          to { transform: scaleY(1.15) scaleX(0.9); }
        }
        @keyframes premium-travel {
          0%   { transform: translateX(-120vw); }
          100% { transform: translateX(120vw); }
        }
        @keyframes wheel-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes speed-line {
          from { left: 110%; }
          to { left: -20%; }
        }
        .speed-line {
          position: absolute;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: speed-line 2s linear infinite;
        }
        @keyframes glow-pulse {
          0%, 100% { filter: drop-shadow(0 0 15px rgba(99, 102, 241, 0.4)); }
          50% { filter: drop-shadow(0 0 35px rgba(99, 102, 241, 0.8)); }
        }
      `}</style>
      
      {/* Background Speed Lines */}
      {[...Array(15)].map((_, i) => (
        <div 
          key={i} 
          className="speed-line" 
          style={{
            width: Math.random() * 200 + 200 + 'px',
            top: Math.random() * 100 + '%',
            animationDuration: Math.random() * 1 + 1.5 + 's',
            animationDelay: Math.random() * 3 + 's',
            opacity: Math.random() * 0.3 + 0.1
          }}
        />
      ))}

      <div style={{ 
        position: 'relative', 
        animation: 'premium-travel 3.5s linear forwards, glow-pulse 2s ease-in-out infinite'
      }}>
        {renderObject()}
      </div>

      <div style={{ textAlign: 'center', zIndex: 10 }}>
        <h3 style={{ 
          fontSize: '16px', 
          fontWeight: '900', 
          color: '#ffffff', 
          letterSpacing: '0.4em',
          margin: '0 0 8px 0',
          textTransform: 'uppercase'
        }}>
          {objectType === 'superman' ? 'Shopping Hero' : objectType === 'van' ? 'Dispatching' : 'Launching Now'}
        </h3>
        <p style={{ 
          fontSize: '10px', 
          color: '#94a3b8', 
          fontWeight: '600',
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.2em'
        }}>
          Initializing your premium experience
        </p>
      </div>
    </div>
  );
};

// ───────────── Full Page Loader (Premium Spinning Wheel) ─────────────
const FullPageLoader = ({ accentColor = '#1b2559' }) => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#ffffff',
    gap: '32px',
    fontFamily: "'Inter', sans-serif",
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
  }}>
    <style>{`
      @keyframes premium-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes premium-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(0.95); opacity: 0.8; }
      }
      .premium-spinner {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        position: relative;
        padding: 4px;
        background: conic-gradient(from 0deg, transparent 0%, ${accentColor} 100%);
        animation: premium-spin 0.8s linear infinite;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .premium-spinner::before {
        content: '';
        position: absolute;
        inset: 4px;
        border-radius: 50%;
        background: white;
      }
      .spinner-dot {
        position: absolute;
        top: 0;
        left: 50%;
        width: 6px;
        height: 6px;
        background: ${accentColor};
        border-radius: 50%;
        transform: translateX(-50%);
        box-shadow: 0 0 12px ${accentColor};
      }
    `}</style>
    
    <div style={{ position: 'relative', animation: 'premium-pulse 2s ease-in-out infinite' }}>
      <div className="premium-spinner">
        <div className="spinner-dot"></div>
      </div>
    </div>

    <div style={{ textAlign: 'center' }}>
      <h3 style={{ 
        fontSize: '14px', 
        fontWeight: '800', 
        color: '#1e293b', 
        letterSpacing: '0.05em',
        margin: '0 0 4px 0',
        textTransform: 'uppercase'
      }}>
        Initializing Session
      </h3>
      <p style={{ 
        fontSize: '11px', 
        color: '#94a3b8', 
        fontWeight: '600',
        margin: 0
      }}>
        Securely connecting to StockFlow
      </p>
    </div>
  </div>
);

// ───────────── Table Skeleton ─────────────
const TableLoader = ({ rows = 6, cols = 5, dark = false }) => (
  <div style={{ padding: '24px', animation: 'fadeInUp 0.3s ease' }}>
    {/* Header shimmer */}
    <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
      <ShimmerBlock width="200px" height="36px" borderRadius="10px" dark={dark} />
      <div style={{ flex: 1 }} />
      <ShimmerBlock width="120px" height="36px" borderRadius="10px" dark={dark} />
    </div>

    {/* Stats cards shimmer */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{
          padding: '20px',
          borderRadius: '16px',
          backgroundColor: dark ? '#151521' : '#fff',
          border: `1px solid ${dark ? '#2a2a3d' : '#f1f5f9'}`,
        }}>
          <ShimmerBlock width="40px" height="40px" borderRadius="12px" style={{ marginBottom: '12px' }} dark={dark} />
          <ShimmerBlock width="80px" height="10px" style={{ marginBottom: '8px' }} dark={dark} />
          <ShimmerBlock width="60px" height="20px" dark={dark} />
        </div>
      ))}
    </div>

    {/* Table shimmer */}
    <div style={{
      borderRadius: '16px',
      backgroundColor: dark ? '#151521' : '#fff',
      border: `1px solid ${dark ? '#2a2a3d' : '#f1f5f9'}`,
      overflow: 'hidden',
    }}>
      {/* Search bar */}
      <div style={{ padding: '16px 24px', borderBottom: `1px solid ${dark ? '#2a2a3d' : '#f8fafc'}` }}>
        <ShimmerBlock width="300px" height="36px" borderRadius="10px" dark={dark} />
      </div>

      {/* Header row */}
      <div style={{ display: 'flex', gap: '16px', padding: '12px 24px', borderBottom: `1px solid ${dark ? '#2a2a3d' : '#f8fafc'}` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <ShimmerBlock key={i} width={`${100 / cols}%`} height="12px" dark={dark} />
        ))}
      </div>

      {/* Data rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{
          display: 'flex', gap: '16px', padding: '16px 24px',
          borderBottom: `1px solid ${dark ? '#2a2a3d22' : '#f8fafc'}`,
          animation: `fadeInUp ${0.1 + r * 0.05}s ease`,
        }}>
          {Array.from({ length: cols }).map((_, c) => (
            <ShimmerBlock key={c} width={`${100 / cols}%`} height="14px" borderRadius="6px" dark={dark} />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// ───────────── Card Skeleton ─────────────
const CardLoader = ({ count = 3, dark = false }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: `repeat(${Math.min(count, 3)}, 1fr)`,
    gap: '20px',
    animation: 'fadeInUp 0.3s ease',
  }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} style={{
        padding: '24px',
        borderRadius: '16px',
        backgroundColor: dark ? '#151521' : '#fff',
        border: `1px solid ${dark ? '#2a2a3d' : '#f1f5f9'}`,
        animation: `fadeInUp ${0.1 + i * 0.08}s ease`,
      }}>
        <ShimmerBlock width="48px" height="48px" borderRadius="12px" style={{ marginBottom: '16px' }} dark={dark} />
        <ShimmerBlock width="70%" height="14px" style={{ marginBottom: '10px' }} dark={dark} />
        <ShimmerBlock width="50%" height="10px" style={{ marginBottom: '8px' }} dark={dark} />
        <ShimmerBlock width="90%" height="10px" dark={dark} />
      </div>
    ))}
  </div>
);

// ───────────── Receipt Skeleton ─────────────
const ReceiptLoader = () => (
  <div style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '40px 16px',
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  }}>
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '20px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      padding: '32px',
      width: '100%',
      maxWidth: '640px',
      border: '1px solid #f1f5f9',
      animation: 'fadeInUp 0.4s ease',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <ShimmerBlock width="64px" height="64px" borderRadius="50%" style={{ margin: '0 auto 16px' }} />
        <ShimmerBlock width="200px" height="24px" style={{ margin: '0 auto 8px' }} />
        <ShimmerBlock width="160px" height="14px" style={{ margin: '0 auto' }} />
      </div>

      {/* Order info grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
        {[1, 2, 3].map(i => (
          <div key={i}>
            <ShimmerBlock width="60px" height="8px" style={{ marginBottom: '6px' }} />
            <ShimmerBlock width="100px" height="14px" />
          </div>
        ))}
      </div>

      {/* Customer section */}
      <div style={{ marginBottom: '24px', border: '1px solid #f1f5f9', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
          <ShimmerBlock width="150px" height="14px" />
        </div>
        <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[1, 2].map(i => (
            <div key={i}>
              <ShimmerBlock width="50px" height="8px" style={{ marginBottom: '6px' }} />
              <ShimmerBlock width="120px" height="14px" />
            </div>
          ))}
        </div>
      </div>

      {/* Products section */}
      <div style={{ marginBottom: '24px', border: '1px solid #f1f5f9', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
          <ShimmerBlock width="100px" height="14px" />
        </div>
        <div style={{ padding: '16px' }}>
          {[1, 2].map(i => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <ShimmerBlock width="120px" height="14px" style={{ marginBottom: '4px' }} />
                <ShimmerBlock width="80px" height="10px" />
              </div>
              <ShimmerBlock width="60px" height="14px" />
            </div>
          ))}
        </div>
      </div>

      {/* Total section */}
      <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <ShimmerBlock width="80px" height="12px" />
            <ShimmerBlock width="60px" height="12px" />
          </div>
        ))}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
          <ShimmerBlock width="100px" height="18px" />
          <ShimmerBlock width="80px" height="22px" />
        </div>
      </div>
    </div>
  </div>
);

// ───────────── Confirmation Loader (Celebration) ─────────────
const ConfirmationLoader = ({ accentColor = '#10b981', message = 'Order Confirmed!' }) => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(10px)',
    fontFamily: "'Inter', sans-serif",
    position: 'fixed',
    inset: 0,
    zIndex: 10000,
    animation: 'fadeIn 0.3s ease-out'
  }}>
    <style>{`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      .checkmark-svg {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        display: block;
        stroke-width: 2;
        stroke: #fff;
        stroke-miterlimit: 10;
        box-shadow: inset 0px 0px 0px ${accentColor};
        animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
      }
      .checkmark-circle {
        stroke-dasharray: 166;
        stroke-dashoffset: 166;
        stroke-width: 2;
        stroke-miterlimit: 10;
        stroke: ${accentColor};
        fill: none;
        animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
      }
      .checkmark-check {
        transform-origin: 50% 50%;
        stroke-dasharray: 48;
        stroke-dashoffset: 48;
        animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
      }
      @keyframes stroke {
        100% { stroke-dashoffset: 0; }
      }
      @keyframes scale {
        0%, 100% { transform: none; }
        50% { transform: scale3d(1.1, 1.1, 1); }
      }
      @keyframes fill {
        100% { box-shadow: inset 0px 0px 0px 50px ${accentColor}; }
      }
      .confetti {
        position: absolute;
        width: 10px;
        height: 10px;
        background-color: ${accentColor};
        border-radius: 2px;
      }
    `}</style>

    <div style={{ position: 'relative', marginBottom: '32px' }}>
      <svg className="checkmark-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
        <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
      </svg>
      
      {/* Decorative Particles */}
      {[...Array(12)].map((_, i) => (
        <div 
          key={i}
          className="confetti"
          style={{
            backgroundColor: i % 3 === 0 ? accentColor : i % 3 === 1 ? '#8A2BE2' : '#FFD700',
            left: '50%',
            top: '50%',
            opacity: 0,
            animation: `confetti-burst 1s ease-out ${0.8 + Math.random() * 0.2}s forwards`,
            transform: `translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px) rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}
    </div>

    <div style={{ textAlign: 'center', animation: 'fadeInUp 0.5s ease-out 1s both' }}>
      <h2 style={{ 
        fontSize: '28px', 
        fontWeight: '900', 
        color: '#1e293b', 
        margin: '0 0 8px 0',
        letterSpacing: '-0.02em'
      }}>
        {message}
      </h2>
      <p style={{ 
        fontSize: '16px', 
        color: '#64748b', 
        fontWeight: '500',
        margin: 0
      }}>
        Your transaction has been processed successfully.
      </p>
    </div>
  </div>
);

// ───────────── Inline Loader ─────────────
const InlineLoader = ({ dark = false }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
    <ShimmerBlock width="100%" height="14px" borderRadius="6px" dark={dark} />
  </div>
);

// ───────────── Main Export ─────────────
const PremiumLoader = ({ variant = 'fullpage', accentColor, message, ...props }) => {
  switch (variant) {
    case 'fullpage':
      return <FullPageLoader accentColor={accentColor} {...props} />;
    case 'table':
      return <TableLoader {...props} />;
    case 'card':
      return <CardLoader {...props} />;
    case 'receipt':
      return <ReceiptLoader {...props} />;
    case 'inline':
      return <InlineLoader {...props} />;
    case 'rocket':
      return <RocketLoader accentColor={accentColor} {...props} />;
    case 'truck':
      return (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(12px)',
          fontFamily: "'Inter', sans-serif"
        }}>
          <style>{`
            @keyframes road-move {
              0% { background-position: 0 0; }
              100% { background-position: -100px 0; }
            }
            @keyframes exhaust-puff {
              0% { transform: scale(0.5); opacity: 0.8; }
              100% { transform: scale(2) translate(-20px, -10px); opacity: 0; }
            }
          `}</style>

          <Box sx={{ textAlign: 'center', position: 'relative', width: '100%', maxWidth: 600 }}>
            {/* Moving Road Backdrop */}
            <Box sx={{ 
              position: 'absolute', 
              bottom: 40, 
              left: '10%', 
              right: '10%', 
              height: 4, 
              bgcolor: 'rgba(255,255,255,0.05)',
              borderRadius: 2,
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                backgroundImage: 'linear-gradient(90deg, transparent 0%, transparent 70%, rgba(255,255,255,0.1) 70%, rgba(255,255,255,0.1) 100%)',
                backgroundSize: '40px 100%',
                animation: 'road-move 0.3s linear infinite'
              }
            }} />

            <Box sx={{ 
              position: 'relative', 
              width: 280, 
              height: 140, 
              mx: 'auto',
              mb: 6,
              animation: 'truck-bounce 0.4s ease-in-out infinite'
            }}>
              {/* Exhaust Puffs */}
              {[...Array(3)].map((_, i) => (
                <Box 
                  key={i}
                  sx={{
                    position: 'absolute',
                    bottom: 25,
                    left: 0,
                    width: 12,
                    height: 12,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    filter: 'blur(4px)',
                    animation: `exhaust-puff 0.8s ease-out infinite`,
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}

              {/* Truck Body (Trailer) */}
              <Box sx={{ 
                position: 'absolute', 
                bottom: 30, 
                left: 10, 
                width: 180, 
                height: 80, 
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
                borderRadius: '8px 4px 4px 8px',
                boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.05)', fontSize: 18, fontWeight: 950, letterSpacing: 4, transform: 'rotate(-5deg)' }}>SHOPSY EXPRESS</Typography>
                <Box sx={{ position: 'absolute', top: 0, left: '-50%', width: '150%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)', animation: 'road-move 2s linear infinite' }} />
              </Box>

              {/* Truck Cab */}
              <Box sx={{ 
                position: 'absolute', 
                bottom: 30, 
                right: 10, 
                width: 70, 
                height: 60, 
                background: 'linear-gradient(135deg, #334155 0%, #475569 100%)', 
                borderRadius: '4px 24px 8px 4px',
                border: '1px solid rgba(255,255,255,0.1)',
                zIndex: 2
              }}>
                {/* Windshield */}
                <Box sx={{ 
                  position: 'absolute', 
                  top: 8, 
                  right: 8, 
                  width: 35, 
                  height: 25, 
                  background: 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)', 
                  borderRadius: '2px 18px 2px 2px',
                  opacity: 0.8,
                  overflow: 'hidden'
                }}>
                  <Box sx={{ position: 'absolute', top: 0, left: '-100%', width: '200%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', transform: 'skewX(-20deg)', animation: 'road-move 1.5s linear infinite' }} />
                </Box>
                {/* Door Handle */}
                <Box sx={{ position: 'absolute', bottom: 15, left: 10, width: 8, height: 3, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 1 }} />
              </Box>

              {/* Wheels with complex animation */}
              {[45, 130, 210, 245].map((pos, i) => (
                <Box 
                  key={i}
                  sx={{ 
                    position: 'absolute', 
                    bottom: 15, 
                    left: pos, 
                    width: 28, 
                    height: 28, 
                    bgcolor: '#0f172a', 
                    borderRadius: '50%', 
                    border: '4px solid #1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
                    zIndex: i > 1 ? 3 : 1
                  }}
                >
                  <Box sx={{ 
                    width: '100%', 
                    height: 2, 
                    bgcolor: 'rgba(255,255,255,0.1)', 
                    animation: 'wheel-spin 0.2s linear infinite' 
                  }} />
                  <Box sx={{ 
                    position: 'absolute',
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: '#475569',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }} />
                </Box>
              ))}

              {/* High-quality package floating */}
              <Box sx={{ 
                position: 'absolute', 
                top: -15, 
                left: 100, 
                width: 36, 
                height: 36, 
                bgcolor: '#d97706', 
                borderRadius: 2, 
                animation: 'box-slide 2.5s ease-in-out infinite',
                boxShadow: '0 10px 20px rgba(0,0,0,0.4)',
                zIndex: 5,
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Box sx={{ width: '100%', height: 4, bgcolor: 'rgba(0,0,0,0.1)', mb: 1 }} />
                <Box sx={{ position: 'absolute', inset: 6, border: '1px solid rgba(255,255,255,0.2)', borderRadius: 1 }} />
              </Box>
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 900, color: 'white', letterSpacing: 2, mb: 2, textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
              {message || 'Express Dispatch'}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
              <Box sx={{ width: 40, height: 2, bgcolor: '#05cd99', borderRadius: 1 }} />
              <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3 }}>
                Premium Logistics in Motion
              </Typography>
              <Box sx={{ width: 40, height: 2, bgcolor: '#05cd99', borderRadius: 1 }} />
            </Stack>
          </Box>
        </Box>
      );
    case 'confirmation':
      return <ConfirmationLoader accentColor={accentColor} {...props} />;
    default:
      return <FullPageLoader accentColor={accentColor} {...props} />;
  }
};

export default PremiumLoader;
