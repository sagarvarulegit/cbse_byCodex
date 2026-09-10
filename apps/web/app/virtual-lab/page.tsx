import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import StudentTopbar from '../../components/StudentTopbar';
import { getStudentSession } from '../../lib/auth';
import VirtualLabWorkbench from '../../components/virtual-lab/VirtualLabWorkbench';

export const metadata: Metadata = {
  title: 'CBSE Class 10 3D Virtual Science Lab | Interactive NCERT Experiments & Apparatus',
  description:
    'Experience CBSE Class 10 NCERT Science practical experiments in interactive 3D: Magnesium Ribbon Combustion, Glass Prism Dispersion, and Human Heart Double Circulation with 36 3D laboratory apparatus models.',
};

export default async function VirtualLabPage() {
  const session = await getStudentSession();

  return (
    <div className="virtual-lab-page-shell" style={{ minHeight: '100vh', background: '#fbf8f3' }}>
      <StudentTopbar contextLabel="🔬 3D Virtual Science Lab" session={session} />

      <main style={{ width: '100%', maxWidth: '1240px', margin: '0 auto', padding: '1.5rem 1rem 4rem 1rem' }}>
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumbs"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.82rem',
            color: '#6f665c',
            marginBottom: '1.25rem',
          }}
        >
          <Link href="/dashboard" style={{ color: '#6f665c', textDecoration: 'none' }}>
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/activities-and-diagrams" style={{ color: '#6f665c', textDecoration: 'none' }}>
            NCERT Activities
          </Link>
          <span>/</span>
          <span style={{ color: '#bd4f10', fontWeight: 700 }}>3D Virtual Lab</span>
        </nav>

        {/* Hero Banner (Platform Study Remix Style) */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            borderRadius: '20px',
            padding: '2.5rem 2rem',
            color: '#ffffff',
            marginBottom: '1.75rem',
            boxShadow: '0 15px 34px rgba(67, 45, 24, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              right: '-50px',
              top: '-50px',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(243, 136, 59, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '850px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
              <span
                style={{
                  background: '#f3883b',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  padding: '0.25rem 0.65rem',
                  borderRadius: '999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                🔬 3D PRACTICAL STUDIO
              </span>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: '#cbd5e1',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.65rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                Class 10 CBSE Science Practical Mastery
              </span>
            </div>

            <h1
              style={{
                fontSize: '2.25rem',
                fontWeight: 950,
                letterSpacing: '-0.035em',
                lineHeight: 1.2,
                margin: '0 0 0.85rem 0',
                color: '#ffffff',
              }}
            >
              Interactive 3D Science Laboratory &amp; Apparatus Explorer
            </h1>

            <p
              style={{
                fontSize: '1rem',
                color: '#cbd5e1',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              <strong>15 to 20 marks</strong> in CBSE Science board examinations come directly from practical activities, chemical reaction observations, and diagram ray tracing. Rotate 3D experimental setups, step through reactions, and inspect 36 standardized lab apparatus.
            </p>
          </div>
        </div>

        {/* 3D VIRTUAL LAB WORKBENCH */}
        <section style={{ marginBottom: '2.5rem' }}>
          <VirtualLabWorkbench mode="full" initialExperiment="magnesium" />
        </section>

        {/* 3 HIGH-YIELD ACTIVITY CARDS (STUDY REMIX WARM CARD STYLE) */}
        <div style={{ marginBottom: '1rem' }}>
          <h2
            style={{
              fontSize: '1.35rem',
              fontWeight: 900,
              letterSpacing: '-0.025em',
              color: '#181612',
              marginBottom: '1rem',
            }}
          >
            Featured Class 10 High-Yield 3D Practicals
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {/* Card 1: Magnesium */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #d9c7b4',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 14px rgba(67, 45, 24, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#fff3df',
                    border: '1px solid rgba(243, 136, 59, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                  }}
                >
                  🔥
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#bd4f10', textTransform: 'uppercase' }}>
                    Chapter 1 · Chemistry
                  </span>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#181612', margin: 0 }}>
                    Activity 1.1 — Magnesium Ribbon
                  </h3>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#6f665c', lineHeight: 1.55, margin: 0 }}>
                Ignite the Bunsen burner, heat the sandpaper-cleaned ribbon, observe dazzling white flame emission, and trace 2-electron valence transfer creating ionic MgO powder.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f4ede2', fontSize: '0.75rem', color: '#9a3412', fontWeight: 700 }}>
                <span>🎯 Guaranteed 3-Mark Question</span>
                <span>2Mg + O₂ → 2MgO</span>
              </div>
            </div>

            {/* Card 2: Prism */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #d9c7b4',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 14px rgba(67, 45, 24, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#f0f9ff',
                    border: '1px solid rgba(2, 132, 199, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                  }}
                >
                  🌈
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase' }}>
                    Chapter 11 · Physics
                  </span>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#181612', margin: 0 }}>
                    Activity 11.2 — Glass Prism
                  </h3>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#6f665c', lineHeight: 1.55, margin: 0 }}>
                Trace incident, refracted, and emergent light rays through an equilateral triangular glass prism. Calculate angle of deviation (\(\delta\)) and 7-color VIBGYOR dispersion.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f4ede2', fontSize: '0.75rem', color: '#0369a1', fontWeight: 700 }}>
                <span>🎯 Guaranteed 5-Mark Ray Diagram</span>
                <span>A + δ = i + e</span>
              </div>
            </div>

            {/* Card 3: Heart */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #d9c7b4',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 14px rgba(67, 45, 24, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#fff1f2',
                    border: '1px solid rgba(225, 29, 72, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                  }}
                >
                  ❤️
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#be123c', textTransform: 'uppercase' }}>
                    Chapter 5 · Biology
                  </span>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#181612', margin: 0 }}>
                    Life Processes — Human Heart
                  </h3>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#6f665c', lineHeight: 1.55, margin: 0 }}>
                Inspect the 4-chambered heart cross-section with pulsing lub-dub animation. Toggle pulmonary vs systemic circuits to understand double circulation and oxygen efficiency.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f4ede2', fontSize: '0.75rem', color: '#be123c', fontWeight: 700 }}>
                <span>🎯 Guaranteed 5-Mark Organ Diagram</span>
                <span>4 Chambers · Double Loop</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
