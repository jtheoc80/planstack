'use client';

import React, { useState, useRef, useEffect } from 'react';

// Room Templates Data
const ROOM_TEMPLATES = {
  'guest-room-a': {
    name: 'Guest Room Type A',
    color: '#4F46E5',
    assemblies: [
      { item: 'Carpet', qty: 250, unit: 'SF', trade: 'Flooring' },
      { item: 'Wall Paint', qty: 80, unit: 'LF', trade: 'Paint' },
      { item: 'Entry Door', qty: 1, unit: 'EA', trade: 'Doors' },
      { item: 'Bathroom Door', qty: 1, unit: 'EA', trade: 'Doors' },
      { item: 'Window - Standard', qty: 2, unit: 'EA', trade: 'Windows' },
    ]
  },
  'guest-room-b': {
    name: 'Guest Room Type B',
    color: '#7C3AED',
    assemblies: [
      { item: 'Carpet', qty: 320, unit: 'SF', trade: 'Flooring' },
      { item: 'Wall Paint', qty: 100, unit: 'LF', trade: 'Paint' },
      { item: 'Entry Door', qty: 1, unit: 'EA', trade: 'Doors' },
      { item: 'Bathroom Door', qty: 1, unit: 'EA', trade: 'Doors' },
      { item: 'Window - Large', qty: 3, unit: 'EA', trade: 'Windows' },
    ]
  },
  'king-suite': {
    name: 'King Suite',
    color: '#EC4899',
    assemblies: [
      { item: 'Carpet', qty: 450, unit: 'SF', trade: 'Flooring' },
      { item: 'Wall Paint', qty: 140, unit: 'LF', trade: 'Paint' },
      { item: 'Entry Door', qty: 1, unit: 'EA', trade: 'Doors' },
      { item: 'Bathroom Door', qty: 2, unit: 'EA', trade: 'Doors' },
      { item: 'Window - Premium', qty: 4, unit: 'EA', trade: 'Windows' },
    ]
  },
  'bathroom-a': {
    name: 'Bathroom Type A',
    color: '#06B6D4',
    assemblies: [
      { item: 'Floor Tile', qty: 48, unit: 'SF', trade: 'Tile' },
      { item: 'Wall Tile', qty: 120, unit: 'SF', trade: 'Tile' },
      { item: 'Toilet', qty: 1, unit: 'EA', trade: 'Plumbing' },
      { item: 'Lavatory', qty: 1, unit: 'EA', trade: 'Plumbing' },
      { item: 'Tub/Shower', qty: 1, unit: 'EA', trade: 'Plumbing' },
    ]
  },
  'bathroom-b': {
    name: 'Bathroom Type B',
    color: '#14B8A6',
    assemblies: [
      { item: 'Floor Tile', qty: 64, unit: 'SF', trade: 'Tile' },
      { item: 'Wall Tile', qty: 160, unit: 'SF', trade: 'Tile' },
      { item: 'Toilet', qty: 1, unit: 'EA', trade: 'Plumbing' },
      { item: 'Lavatory - Double', qty: 1, unit: 'EA', trade: 'Plumbing' },
      { item: 'Walk-in Shower', qty: 1, unit: 'EA', trade: 'Plumbing' },
    ]
  },
  'corridor': {
    name: 'Corridor',
    color: '#F59E0B',
    assemblies: [
      { item: 'Carpet - Commercial', qty: 1, unit: 'SF', trade: 'Flooring', perSqFt: true },
      { item: 'Wall Paint', qty: 1, unit: 'LF', trade: 'Paint', perLF: true },
    ]
  },
  'lobby': {
    name: 'Lobby',
    color: '#EF4444',
    assemblies: [
      { item: 'Porcelain Tile', qty: 1, unit: 'SF', trade: 'Tile', perSqFt: true },
      { item: 'Wall Finish - Premium', qty: 1, unit: 'LF', trade: 'Finishes', perLF: true },
    ]
  }
};

const FIXTURE_TYPES = [
  { id: 'toilet', name: 'Toilet', icon: '🚽', trade: 'Plumbing' },
  { id: 'sink', name: 'Sink/Lavatory', icon: '🚰', trade: 'Plumbing' },
  { id: 'tub', name: 'Tub/Shower', icon: '🛁', trade: 'Plumbing' },
  { id: 'door-single', name: 'Door - Single', icon: '🚪', trade: 'Doors' },
  { id: 'window', name: 'Window', icon: '🪟', trade: 'Windows' },
];

// Main App
export default function PlanStack() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [projects, setProjects] = useState([
    { id: 1, name: 'Hilton Garden Inn - Houston', sheets: 12, status: 'in-progress', created: '2024-01-15' },
    { id: 2, name: 'The Metropolitan Apartments', sheets: 24, status: 'completed', created: '2024-01-10' },
  ]);
  const [activeProject, setActiveProject] = useState(null);
  const [activeSheet, setActiveSheet] = useState(null);

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 32 32" className="w-8 h-8 text-indigo-500">
              <rect x="2" y="8" width="12" height="12" rx="2" fill="currentColor" opacity="0.9"/>
              <rect x="18" y="2" width="12" height="12" rx="2" fill="currentColor" opacity="0.7"/>
              <rect x="10" y="18" width="12" height="12" rx="2" fill="currentColor" opacity="0.5"/>
            </svg>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-transparent">PlanStack</span>
          </div>
        </div>
        
        <nav className="flex-1 p-3 space-y-1">
          <NavButton 
            active={currentView === 'dashboard'} 
            onClick={() => { setCurrentView('dashboard'); setActiveProject(null); }}
            icon={<GridIcon />}
          >
            Projects
          </NavButton>
          
          {activeProject && (
            <>
              <NavButton active={currentView === 'project'} onClick={() => setCurrentView('project')} icon={<FileIcon />}>
                Sheets
              </NavButton>
              <NavButton active={currentView === 'takeoff'} onClick={() => setCurrentView('takeoff')} icon={<LayersIcon />}>
                Takeoff
              </NavButton>
              <NavButton active={currentView === 'export'} onClick={() => setCurrentView('export')} icon={<DownloadIcon />}>
                Export
              </NavButton>
            </>
          )}
          
          <div className="h-px bg-gray-800 my-3" />
          
          <NavButton active={currentView === 'templates'} onClick={() => setCurrentView('templates')} icon={<TemplateIcon />}>
            Templates
          </NavButton>
        </nav>
        
        <div className="p-3 border-t border-gray-800">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/50">
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center font-semibold text-sm">
              JS
            </div>
            <div>
              <div className="font-semibold text-sm">Jimmy</div>
              <div className="text-xs text-gray-500">Estimator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {currentView === 'dashboard' && (
          <Dashboard 
            projects={projects} 
            setProjects={setProjects}
            setActiveProject={setActiveProject}
            setCurrentView={setCurrentView}
          />
        )}
        {currentView === 'project' && activeProject && (
          <ProjectView 
            project={activeProject}
            setActiveSheet={setActiveSheet}
            setCurrentView={setCurrentView}
          />
        )}
        {currentView === 'takeoff' && (
          <TakeoffView 
            sheet={activeSheet || { id: 1, name: 'A201', title: 'Typical Floor Plan' }}
            project={activeProject}
          />
        )}
        {currentView === 'templates' && <TemplatesView />}
        {currentView === 'export' && <ExportView project={activeProject} />}
      </main>
    </div>
  );
}

// Navigation Button
function NavButton({ children, active, onClick, icon }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        active 
          ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/10 text-white ring-1 ring-gray-700' 
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <span className={active ? 'text-indigo-400' : ''}>{icon}</span>
      {children}
    </button>
  );
}

// Dashboard View
function Dashboard({ projects, setProjects, setActiveProject, setCurrentView }) {
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');

  const createProject = () => {
    if (newName.trim()) {
      setProjects([{ id: Date.now(), name: newName, sheets: 0, status: 'new', created: new Date().toISOString().split('T')[0] }, ...projects]);
      setNewName('');
      setShowModal(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="p-6 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-gray-400 mt-1">Manage your construction takeoff projects</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20">
          <PlusIcon /> New Project
        </button>
      </header>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(project => (
          <div 
            key={project.id} 
            onClick={() => { setActiveProject(project); setCurrentView('project'); }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 cursor-pointer hover:border-gray-700 hover:-translate-y-1 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="mb-3">
              <span className={`text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded ${
                project.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                project.status === 'in-progress' ? 'bg-amber-500/20 text-amber-400' :
                'bg-cyan-500/20 text-cyan-400'
              }`}>
                {project.status === 'completed' ? 'Completed' : project.status === 'in-progress' ? 'In Progress' : 'New'}
              </span>
            </div>
            <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
            <div className="text-gray-500 text-sm">{project.sheets} sheets • Created {project.created}</div>
            <div className="mt-4 pt-3 border-t border-gray-800">
              <span className="text-indigo-400 text-sm font-medium">Open Project →</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2 className="text-xl font-bold mb-4">Create New Project</h2>
          <input 
            type="text" 
            placeholder="e.g., Hilton Garden Inn - Houston"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg mb-4 focus:outline-none focus:border-indigo-500"
            autoFocus
          />
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800">Cancel</button>
            <button onClick={createProject} className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500">Create Project</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Project View
function ProjectView({ project, setActiveSheet, setCurrentView }) {
  const sheets = [
    { id: 1, name: 'A101', title: 'Floor Plan - Level 1', status: 'detected' },
    { id: 2, name: 'A102', title: 'Floor Plan - Level 2', status: 'pending' },
    { id: 3, name: 'A201', title: 'Typical Floor Plan', status: 'detected' },
    { id: 4, name: 'A301', title: 'Roof Plan', status: 'pending' },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="p-6 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
        <div>
          <div className="text-gray-500 text-sm mb-1">Projects / {project.name}</div>
          <h1 className="text-2xl font-bold">Drawing Sheets</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition-all">
          <UploadIcon /> Upload Drawings
        </button>
      </header>

      <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sheets.map(sheet => (
          <div 
            key={sheet.id}
            onClick={() => { setActiveSheet(sheet); setCurrentView('takeoff'); }}
            className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden cursor-pointer hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all"
          >
            <div className="aspect-[4/3] bg-gray-800 flex items-center justify-center border-b border-gray-700">
              <svg className="w-12 h-12 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="9" y1="9" x2="9" y2="21"/>
              </svg>
            </div>
            <div className="p-3">
              <div className="font-mono text-indigo-400 font-bold text-sm">{sheet.name}</div>
              <div className="text-gray-400 text-sm mt-1">{sheet.title}</div>
              <div className={`text-xs mt-2 ${sheet.status === 'detected' ? 'text-emerald-400' : 'text-gray-500'}`}>
                {sheet.status === 'detected' ? '✓ Elements Detected' : 'Pending Detection'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Takeoff View
function TakeoffView({ sheet, project }) {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('select');
  const [scale, setScale] = useState(null);
  const [calibrating, setCalibrating] = useState(false);
  const [calibPoints, setCalibPoints] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [drawingRoom, setDrawingRoom] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRoomModal, setShowRoomModal] = useState(false);

  // Draw floor plan
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#1a1a20';
    ctx.fillRect(0, 0, 800, 500);
    
    ctx.strokeStyle = '#2a2a35';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 800; i += 20) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 500); ctx.stroke();
    }
    for (let i = 0; i < 500; i += 20) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(800, i); ctx.stroke();
    }
    
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, 700, 400);
    
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(50, 220); ctx.lineTo(750, 220); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(50, 280); ctx.lineTo(750, 280); ctx.stroke();
    
    for (let i = 0; i < 4; i++) {
      ctx.beginPath(); ctx.moveTo(190 + i * 140, 50); ctx.lineTo(190 + i * 140, 220); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(190 + i * 140, 280); ctx.lineTo(190 + i * 140, 450); ctx.stroke();
    }
    
    rooms.forEach(room => {
      const template = ROOM_TEMPLATES[room.type];
      ctx.fillStyle = template ? `${template.color}44` : '#4F46E533';
      ctx.strokeStyle = template ? template.color : '#4F46E5';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(room.points[0].x, room.points[0].y);
      room.points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.closePath(); ctx.fill(); ctx.stroke();
      
      const cx = room.points.reduce((s, p) => s + p.x, 0) / room.points.length;
      const cy = room.points.reduce((s, p) => s + p.y, 0) / room.points.length;
      ctx.fillStyle = template ? template.color : '#4F46E5';
      ctx.font = 'bold 11px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(template?.name || 'Room', cx, cy);
      ctx.font = '10px system-ui';
      ctx.fillText(`${room.area} SF`, cx, cy + 14);
    });
    
    fixtures.forEach(f => {
      ctx.fillStyle = '#10B981';
      ctx.beginPath(); ctx.arc(f.x, f.y, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = '10px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const type = FIXTURE_TYPES.find(t => t.id === f.type);
      ctx.fillText(type?.icon || '?', f.x, f.y);
    });
    
    if (drawingRoom && drawingRoom.length > 0) {
      ctx.strokeStyle = '#4F46E5';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(drawingRoom[0].x, drawingRoom[0].y);
      drawingRoom.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.stroke();
      ctx.setLineDash([]);
      drawingRoom.forEach(p => {
        ctx.fillStyle = '#4F46E5';
        ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2); ctx.fill();
      });
    }
    
    calibPoints.forEach((p, i) => {
      ctx.fillStyle = '#EF4444';
      ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = 'bold 10px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(i + 1), p.x, p.y);
    });
    
    if (calibPoints.length === 2) {
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(calibPoints[0].x, calibPoints[0].y);
      ctx.lineTo(calibPoints[1].x, calibPoints[1].y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [rooms, fixtures, drawingRoom, calibPoints]);

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (calibrating) {
      if (calibPoints.length < 2) {
        const newPoints = [...calibPoints, { x, y }];
        setCalibPoints(newPoints);
        if (newPoints.length === 2) {
          setTimeout(() => {
            const dist = prompt('Enter the real-world distance between points (feet):');
            if (dist) {
              const px = Math.sqrt(Math.pow(newPoints[1].x - newPoints[0].x, 2) + Math.pow(newPoints[1].y - newPoints[0].y, 2));
              setScale((px / parseFloat(dist)).toFixed(2));
              setCalibrating(false);
            }
            setCalibPoints([]);
          }, 100);
        }
      }
    } else if (tool === 'room') {
      if (!drawingRoom) {
        setDrawingRoom([{ x, y }]);
      } else {
        const first = drawingRoom[0];
        const dist = Math.sqrt(Math.pow(first.x - x, 2) + Math.pow(first.y - y, 2));
        if (dist < 15 && drawingRoom.length >= 3) {
          const area = Math.abs(drawingRoom.reduce((sum, p, i) => {
            const j = (i + 1) % drawingRoom.length;
            return sum + p.x * drawingRoom[j].y - drawingRoom[j].x * p.y;
          }, 0) / 2);
          const sqft = scale ? Math.round(area / (scale * scale)) : Math.round(area / 100);
          const newRoom = { id: Date.now(), points: drawingRoom, type: null, area: sqft };
          setRooms([...rooms, newRoom]);
          setSelectedRoom(newRoom);
          setShowRoomModal(true);
          setDrawingRoom(null);
        } else {
          setDrawingRoom([...drawingRoom, { x, y }]);
        }
      }
    } else if (tool === 'fixture') {
      setFixtures([...fixtures, { id: Date.now(), x, y, type: 'toilet' }]);
    }
  };

  const runDetection = () => {
    setFixtures([
      { id: 1, x: 120, y: 135, type: 'toilet' }, { id: 2, x: 120, y: 170, type: 'sink' },
      { id: 3, x: 260, y: 135, type: 'toilet' }, { id: 4, x: 260, y: 170, type: 'sink' },
      { id: 5, x: 400, y: 135, type: 'toilet' }, { id: 6, x: 400, y: 170, type: 'sink' },
      { id: 7, x: 120, y: 365, type: 'toilet' }, { id: 8, x: 120, y: 400, type: 'sink' },
      { id: 9, x: 260, y: 365, type: 'toilet' }, { id: 10, x: 260, y: 400, type: 'sink' },
    ]);
  };

  const assignRoomType = (typeId) => {
    setRooms(rooms.map(r => r.id === selectedRoom.id ? { ...r, type: typeId } : r));
    setShowRoomModal(false);
    setSelectedRoom(null);
  };

  const takeoffSummary = React.useMemo(() => {
    const summary = {};
    rooms.forEach(room => {
      if (room.type && ROOM_TEMPLATES[room.type]) {
        ROOM_TEMPLATES[room.type].assemblies.forEach(a => {
          const key = `${a.trade}-${a.item}`;
          if (!summary[key]) summary[key] = { ...a, totalQty: 0 };
          summary[key].totalQty += a.perSqFt ? room.area : (a.perLF ? Math.sqrt(room.area) * 4 : a.qty);
        });
      }
    });
    fixtures.forEach(f => {
      const type = FIXTURE_TYPES.find(t => t.id === f.type);
      if (type) {
        const key = `${type.trade}-${type.name}`;
        if (!summary[key]) summary[key] = { item: type.name, unit: 'EA', trade: type.trade, totalQty: 0 };
        summary[key].totalQty += 1;
      }
    });
    return Object.values(summary);
  }, [rooms, fixtures]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="p-4 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
        <div>
          <h2 className="font-semibold">{sheet?.name} - {sheet?.title}</h2>
          <span className="text-gray-500 text-sm">{project?.name}</span>
        </div>
        <div className="flex items-center gap-4">
          {scale && <span className="font-mono text-sm text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded">Scale: {scale} px/ft</span>}
          <button onClick={runDetection} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700">
            🔍 Run Detection
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-14 bg-gray-900 border-r border-gray-800 p-2 flex flex-col items-center gap-1">
          <ToolButton active={tool === 'select'} onClick={() => setTool('select')} title="Select"><CursorIcon /></ToolButton>
          <div className="h-px w-8 bg-gray-800 my-2" />
          <ToolButton active={calibrating} onClick={() => { setCalibrating(!calibrating); setCalibPoints([]); }} title="Calibrate"><TargetIcon /></ToolButton>
          <ToolButton active={tool === 'room'} onClick={() => setTool('room')} title="Draw Room"><SquareIcon /></ToolButton>
          <ToolButton active={tool === 'fixture'} onClick={() => setTool('fixture')} title="Add Fixture"><CirclePlusIcon /></ToolButton>
        </div>

        <div className="flex-1 bg-gray-950 p-4 overflow-auto relative">
          {calibrating && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium z-10 animate-pulse">
              Click two points on a known dimension ({calibPoints.length}/2)
            </div>
          )}
          <canvas ref={canvasRef} width={800} height={500} onClick={handleCanvasClick} className="rounded-lg shadow-2xl cursor-crosshair" />
        </div>

        <div className="w-72 bg-gray-900 border-l border-gray-800 overflow-y-auto">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Room Types</h3>
            <div className="space-y-2">
              {rooms.length === 0 ? (
                <p className="text-gray-500 text-sm italic">Draw rooms on the plan</p>
              ) : rooms.map(room => {
                const template = room.type ? ROOM_TEMPLATES[room.type] : null;
                return (
                  <div key={room.id} className="flex items-center gap-2 p-2 bg-gray-800 rounded text-sm">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: template?.color || '#6b7280' }} />
                    <span>{template?.name || 'Unassigned'}</span>
                    <span className="ml-auto font-mono text-gray-500 text-xs">{room.area} SF</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Detected Fixtures</h3>
            <div className="space-y-2">
              {fixtures.length === 0 ? (
                <p className="text-gray-500 text-sm italic">Run detection or add manually</p>
              ) : FIXTURE_TYPES.map(type => {
                const count = fixtures.filter(f => f.type === type.id).length;
                if (count === 0) return null;
                return (
                  <div key={type.id} className="flex justify-between p-2 bg-gray-800 rounded text-sm">
                    <span>{type.icon} {type.name}</span>
                    <span className="font-mono text-emerald-400 font-semibold">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Takeoff Summary</h3>
            <div className="space-y-1">
              {takeoffSummary.length === 0 ? (
                <p className="text-gray-500 text-sm italic">Assign room types to generate</p>
              ) : takeoffSummary.map((item, i) => (
                <div key={i} className="flex justify-between items-start p-2 bg-gray-800 rounded text-xs">
                  <div>
                    <span className="text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase">{item.trade}</span>
                    <div className="mt-1">{item.item}</div>
                  </div>
                  <span className="font-mono font-semibold">{Math.round(item.totalQty)} {item.unit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showRoomModal && (
        <Modal onClose={() => setShowRoomModal(false)}>
          <h2 className="text-xl font-bold mb-2">Assign Room Type</h2>
          <p className="text-gray-400 mb-4">Select a type for this {selectedRoom?.area} SF area</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {Object.entries(ROOM_TEMPLATES).map(([id, t]) => (
              <button key={id} onClick={() => assignRoomType(id)} className="flex items-center gap-2 p-3 bg-gray-800 border-2 border-gray-700 rounded-lg hover:border-indigo-500 transition-all text-left">
                <div className="w-5 h-5 rounded" style={{ backgroundColor: t.color }} />
                <span className="text-sm">{t.name}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setShowRoomModal(false)} className="w-full py-2 border border-gray-700 rounded-lg hover:bg-gray-800">Cancel</button>
        </Modal>
      )}
    </div>
  );
}

// Templates View
function TemplatesView() {
  return (
    <div className="flex-1 overflow-y-auto">
      <header className="p-6 border-b border-gray-800 bg-gray-900/50">
        <h1 className="text-2xl font-bold">Room Templates</h1>
        <p className="text-gray-400 mt-1">Define assemblies for room types</p>
      </header>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(ROOM_TEMPLATES).map(([id, t]) => (
          <div key={id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-4" style={{ backgroundColor: t.color }}><h3 className="font-semibold text-white">{t.name}</h3></div>
            <div className="p-4">
              <table className="w-full text-sm">
                <thead><tr className="text-gray-500 text-xs"><th className="text-left pb-2">Item</th><th className="text-left pb-2">Qty</th><th className="text-left pb-2">Unit</th></tr></thead>
                <tbody className="text-gray-400">
                  {t.assemblies.map((a, i) => (
                    <tr key={i} className="border-t border-gray-800"><td className="py-2">{a.item}</td><td className="py-2">{a.perSqFt || a.perLF ? 'Var' : a.qty}</td><td className="py-2">{a.unit}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Export View
function ExportView({ project }) {
  const [format, setFormat] = useState('xlsx');
  return (
    <div className="flex-1 overflow-y-auto">
      <header className="p-6 border-b border-gray-800 bg-gray-900/50">
        <h1 className="text-2xl font-bold">Export Takeoff</h1>
        <p className="text-gray-400 mt-1">Download your quantities</p>
      </header>
      <div className="p-6 max-w-2xl">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h3 className="font-semibold mb-4">Export Format</h3>
          <div className="flex gap-4">
            {['xlsx', 'csv'].map(f => (
              <button key={f} onClick={() => setFormat(f)} className={`flex-1 p-4 border-2 rounded-lg transition-all ${format === f ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-700 hover:border-gray-600'}`}>
                <FileIcon /><span className="block mt-2 font-medium">{f.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h3 className="font-semibold mb-4">Preview</h3>
          <table className="w-full text-sm">
            <thead><tr className="text-gray-500 border-b border-gray-800"><th className="text-left p-2">Trade</th><th className="text-left p-2">Item</th><th className="text-left p-2">Qty</th><th className="text-left p-2">Unit</th></tr></thead>
            <tbody className="text-gray-400">
              <tr className="border-b border-gray-800"><td className="p-2">Flooring</td><td className="p-2">Carpet</td><td className="p-2">5,700</td><td className="p-2">SF</td></tr>
              <tr className="border-b border-gray-800"><td className="p-2">Tile</td><td className="p-2">Floor Tile</td><td className="p-2">480</td><td className="p-2">SF</td></tr>
              <tr className="border-b border-gray-800"><td className="p-2">Plumbing</td><td className="p-2">Toilet</td><td className="p-2">20</td><td className="p-2">EA</td></tr>
              <tr><td className="p-2">Plumbing</td><td className="p-2">Lavatory</td><td className="p-2">20</td><td className="p-2">EA</td></tr>
            </tbody>
          </table>
        </div>
        <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold flex items-center justify-center gap-2">
          <DownloadIcon /> Download {format.toUpperCase()}
        </button>
      </div>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function ToolButton({ children, active, onClick, title }) {
  return (
    <button onClick={onClick} title={title} className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>{children}</button>
  );
}

function GridIcon() { return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>; }
function FileIcon() { return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>; }
function LayersIcon() { return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>; }
function DownloadIcon() { return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>; }
function TemplateIcon() { return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>; }
function PlusIcon() { return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function UploadIcon() { return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>; }
function CursorIcon() { return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>; }
function TargetIcon() { return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>; }
function SquareIcon() { return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>; }
function CirclePlusIcon() { return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>; }
