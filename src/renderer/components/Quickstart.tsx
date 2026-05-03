import React from 'react'
import { BookOpen, Map, Users, Sword, Box, Globe, FileText, Palette, Layers, PlayCircle } from 'lucide-react'

interface QuickstartProps {
  onNavigate: (tab: any) => void;
}

const Quickstart: React.FC<QuickstartProps> = ({ onNavigate }) => {
  const SectionLink = ({ icon: Icon, label, tab, children }: any) => (
    <div style={{ marginBottom: '25px' }}>
      <h3 
        onClick={() => onNavigate(tab)}
        style={{ 
          color: '#4ec9b0', 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          fontSize: '1.2rem',
          marginBottom: '8px'
        }}
      >
        <Icon size={20} /> {label}
      </h3>
      <div style={{ paddingLeft: '30px', color: '#ccc', lineHeight: '1.5' }}>
        {children}
      </div>
    </div>
  );

  return (
    <div className="main-area" style={{ overflowY: 'auto' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px 40px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '30px' }}>
          <BookOpen size={32} color="#4ec9b0" /> Quickstart Guide
        </h1>

        <p style={{ fontSize: '1.1rem', marginBottom: '40px', color: '#aaa' }}>
          OpenArthurianX6 (OAX6) follows a structured approach where you define the world, its inhabitants, and the rules of interaction before setting the scenario in motion.
        </p>

        <section style={{ background: '#1e1e1e', padding: '20px', borderRadius: '8px', border: '1px solid #333', marginBottom: '40px' }}>
          <h2 style={{ marginTop: 0, fontSize: '1.1rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>Workflow Approaches</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div style={{ background: '#252526', padding: '15px', borderRadius: '4px' }}>
              <h4 style={{ color: '#4ec9b0', marginTop: 0 }}>A. Use Foundations</h4>
              <p style={{ fontSize: '0.85rem', color: '#999' }}>Focus on NPCs, Scenario, and Maps using existing assets.</p>
            </div>
            <div style={{ background: '#252526', padding: '15px', borderRadius: '4px' }}>
              <h4 style={{ color: '#4ec9b0', marginTop: 0 }}>B. Extend Foundations</h4>
              <p style={{ fontSize: '0.85rem', color: '#999' }}>Define your own Creatures and Items within the OAX universe.</p>
            </div>
            <div style={{ background: '#252526', padding: '15px', borderRadius: '4px' }}>
              <h4 style={{ color: '#4ec9b0', marginTop: 0 }}>C. Create Universe</h4>
              <p style={{ fontSize: '0.85rem', color: '#999' }}>Start with Tilesets and Appearances to build from scratch.</p>
            </div>
          </div>
        </section>

        <SectionLink icon={Globe} label="1. World Configuration" tab="world-config">
          Defines the fundamental metrics of your game world (Tile Size, Chunks) and allows managing the layout of your world by placing map files on the global grid in <strong>Maps</strong>.
        </SectionLink>

        <SectionLink icon={Layers} label="2. Tilesets" tab="tilesets">
          Manage the graphical assets (spritesheets) used in your project. Browse PNG files from your <code>res/</code> directory.
        </SectionLink>

        <SectionLink icon={Palette} label="3. Appearances" tab="appearances">
          Map specific regions of a Tileset to entity IDs. Define how your <strong>Creatures</strong> and <strong>Items</strong> look.
        </SectionLink>

        <SectionLink icon={Users} label="4. Creatures" tab="mobTypes">
          Templates for all living things. Define base stats (HP, Damage, Speed) and assign their <strong>Appearances</strong>.
        </SectionLink>

        <SectionLink icon={Users} label="5. NPCs" tab="npcs">
          Unique character instances with their own <strong>Conversations</strong>, <strong>Schedules</strong>, and <strong>Triggers</strong>.
        </SectionLink>

        <SectionLink icon={Sword} label="6. Items" tab="items">
          Objects lying in the world. Configure stats, weight, and whether they can be thrown.
        </SectionLink>

        <SectionLink icon={Box} label="7. Interactables" tab="objectTypes">
          Fixed map objects players can interact with (signs, switches, decorations).
        </SectionLink>

        <SectionLink icon={PlayCircle} label="8. Cutscenes" tab="cutscenes">
          Dialogue-based story sequences triggered by events or NPC interactions.
        </SectionLink>

        <SectionLink icon={FileText} label="9. Scenario" tab="scenario">
          The entry point of your game. Set the <strong>Starting Position</strong>, <strong>Time</strong>, and <strong>Initial Party</strong>.
        </SectionLink>

        <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid #333', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
          Select any module from the sidebar or click a heading above to get started.
        </div>
      </div>
    </div>
  )
}

export default Quickstart
