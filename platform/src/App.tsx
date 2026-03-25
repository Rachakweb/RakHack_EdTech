import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

// Simulated Markdown fetcher
function CourseContent({ title, docUrl, children }: { title: string, docUrl: string, children?: React.ReactNode }) {
  const [content, setContent] = useState('Loading payload...');
  // Force re-render animation using a key tied to title
  const [key, setKey] = useState(Date.now());

  useEffect(() => {
    setContent('[SYSTEM]: Initializing secure file transfer...\\n\\n');
    setKey(Date.now()); // Re-trigger glitch animation
    
    // Simulate slight network delay for dramatic hacker effect
    setTimeout(() => {
      fetch(docUrl)
        .then(res => res.text())
        .then(text => setContent(text))
        .catch(() => setContent('Error fetching encrypted data.'));
    }, 400);
  }, [docUrl]);

  return (
    <div key={key} className="bg-[#0f0f0f] border border-[#ff003c]/40 p-6 rounded shadow-[0_0_15px_rgba(255,0,60,0.1)] flex-grow flex flex-col overflow-y-auto relative scanlines animate-glitch-in">
      <h2 className="text-2xl font-bold text-[#ff003c] mb-6 border-b border-[#ff003c]/20 pb-2 uppercase tracking-widest shrink-0">{title}</h2>
      <div className="max-w-none text-gray-300 flex-grow">
        <ReactMarkdown
          components={{
            h1: (props) => <h1 className="text-3xl font-bold text-[#ff003c] mb-4 mt-6 uppercase" {...props} />,
            h2: (props) => <h2 className="text-2xl font-bold text-[#ff003c] mb-3 mt-5 uppercase border-b border-[#ff003c]/30 pb-1" {...props} />,
            h3: (props) => <h3 className="text-xl font-bold text-white mb-2 mt-4" {...props} />,
            p: (props) => <p className="mb-4 leading-relaxed font-sans" {...props} />,
            ul: (props) => <ul className="list-disc pl-5 mb-4 font-sans text-gray-400" {...props} />,
            li: (props) => <li className="mb-1" {...props} />,
            strong: (props) => <strong className="text-white bg-[#ff003c]/20 px-1 rounded" {...props} />,
            code: (props) => <code className="bg-gray-900 text-[#ff003c] px-1 py-0.5 rounded font-mono text-sm border border-gray-800" {...props} />,
            pre: (props) => <pre className="bg-black p-4 rounded border border-gray-800 text-[#ff003c] font-mono text-xs overflow-x-auto my-4" {...props} />
          }}
        >
          {content}
        </ReactMarkdown>
        {children && <div className="mt-10 border-t border-[#ff003c]/20 pt-6">{children}</div>}
      </div>
      <div className="mt-8 pt-4 border-t border-gray-800 flex justify-between items-center text-xs text-gray-600 shrink-0">
        <span className="animate-pulse">System Status: ONLINE</span>
        <span>Secure Connection Established</span>
      </div>
    </div>
  );
}

// Lab Runner Component
function LabRunner() {
  const [status, setStatus] = useState<'idle' | 'starting' | 'running' | 'error'>('idle');
  const [port, setPort] = useState(4000);

  const startLab = async () => {
    setStatus('starting');
    try {
      const res = await fetch('/api/start-sqli-lab');
      const data = await res.json();
      if (data.status === 'started' || data.status === 'running') {
        setStatus('running');
        setPort(data.port);
      } else {
        setStatus('error');
      }
    } catch (e) {
      // Docker Compose Fallback: If Nginx serves the static frontend, the API endpoint disappears.
      // We assume Docker Compose has already bound the isolated DB container persistently to 4000.
      setStatus('running');
      setPort(4000);
    }
  };

  useEffect(() => {
    fetch('/api/status-sqli-lab')
      .then(r => r.json())
      .then(d => {
        if (d.status === 'running') setStatus('running');
      }).catch(() => {});
  }, []);

  return (
    <div className="mt-4 bg-[#0a0a0a] border border-[#ff003c]/30 p-6 rounded shadow-[0_0_15px_rgba(255,0,60,0.1)] relative overflow-hidden shrink-0 animate-glitch-in">
      <div className="absolute inset-0 scanlines opacity-30 pointer-events-none"></div>
      <h3 className="text-white font-bold text-lg mb-4 uppercase tracking-widest relative z-10 border-b border-gray-800 pb-2 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ff003c]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
        Target Deployment: Corporate Portal
      </h3>
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-400">
          {status === 'idle' && "Lab environment is offline. Deploy to begin the assessment."}
          {status === 'starting' && <span className="text-yellow-500 animate-pulse">Provisioning container...</span>}
          {status === 'running' && (
            <span>
              Target is online at <a href={`http://localhost:${port}`} target="_blank" rel="noreferrer" className="text-[#00ffff] font-bold hover:underline">http://localhost:{port}</a>
            </span>
          )}
          {status === 'error' && <span className="text-[#ff003c]">Failed to deploy lab. Ensure ports are clear.</span>}
        </div>
        <button 
          onClick={startLab}
          disabled={status === 'starting' || status === 'running'}
          className={`px-6 py-2 font-bold uppercase tracking-widest transition-colors border ${
            status === 'running' 
              ? 'bg-[#00ffff]/20 text-[#00ffff] border-[#00ffff] cursor-not-allowed' 
              : 'bg-transparent border-[#ff003c] text-[#ff003c] hover:bg-[#ff003c] hover:text-black'
          }`}
        >
          {status === 'running' ? '[ DEPLOYED ]' : '[ DEPLOY_TARGET ]'}
        </button>
      </div>
    </div>
  );
}

// Flag Submission Component
function FlagSubmission({ expectedFlag, onComplete }: { expectedFlag: string, onComplete: () => void }) {
  const [inputFlag, setInputFlag] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputFlag.trim() === expectedFlag) {
      setStatus('success');
      onComplete();
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <div className="mt-4 bg-[#0a0a0a] border border-[#ff003c]/50 p-6 rounded shadow-[0_0_15px_rgba(255,0,60,0.1)] relative overflow-hidden shrink-0 animate-glitch-in">
      <div className="absolute inset-0 scanlines opacity-30 pointer-events-none"></div>
      <h3 className="text-[#ff003c] font-bold text-lg mb-4 uppercase tracking-widest relative z-10 border-b border-gray-800 pb-2 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
        Submit Assessment Flag
      </h3>
      <form onSubmit={handleSubmit} className="relative z-10">
        <div className="flex gap-4">
          <input 
            type="text" 
            value={inputFlag}
            onChange={(e) => setInputFlag(e.target.value)}
            placeholder="RakHack{...}" 
            className="flex-grow bg-[#050505] border border-gray-700 text-white px-4 py-2 font-mono focus:outline-none focus:border-[#ff003c] transition-colors"
          />
          <button type="submit" className="bg-transparent border border-[#ff003c] text-[#ff003c] hover:bg-[#ff003c] hover:text-black font-bold uppercase tracking-widest px-6 py-2 transition-colors">
            [ VERIFY ]
          </button>
        </div>
        {status === 'error' && <div className="mt-3 text-[#ff003c] text-sm animate-pulse glitch" data-text="[!] INVAL1D_FL4G">[!] INVALID_FLAG_DETECTED</div>}
        {status === 'success' && <div className="mt-3 text-[#00ffff] text-sm font-bold shadow-[0_0_10px_#00ffff]/50">[✓] MODULE_COMPLETE: Authentication Bypass Successful</div>}
      </form>
    </div>
  );
}

// Course Catalog Landing
function CourseCatalog({ onSelectCourse }: { onSelectCourse: (id: string) => void }) {
  return (
    <div className="w-full animate-glitch-in">
      <h2 className="text-3xl font-bold text-white mb-8 border-b border-gray-800 pb-4 uppercase tracking-widest">
        <span className="text-[#ff003c]">{'>'}_</span> Available Training Curriculums
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Main Course Summary Card */}
        <div className="bg-[#0a0a0a] border border-[#ff003c]/50 rounded p-6 hover:shadow-[0_0_25px_rgba(255,0,60,0.2)] transition-all group relative overflow-hidden flex flex-col justify-between">
          <div className="scanlines absolute inset-0 opacity-50 z-0"></div>
          <div className="relative z-10">
            <span className="px-2 py-0.5 text-[10px] bg-[#ff003c] text-black font-bold mb-4 inline-block">CORE MODULE</span>
            <h3 className="text-3xl font-black text-white mb-4 group-hover:text-[#ff003c] transition-colors glitch" data-text="Reverse Engineering">
              Reverse Engineering Fundamentals
            </h3>
            <p className="text-sm text-gray-400 font-sans mb-6 leading-relaxed">
              Master the execution flow of vulnerable Windows binaries. This curriculum covers Ghidra installation, manual disassembly, identifying hardcoded secrets, and memory patching tactics.
            </p>
            <ul className="text-xs text-gray-500 font-sans mb-8 space-y-2">
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#ff003c]"></div> Modules: 3 (Tools, Intel, Execution)</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#ff003c]"></div> Assessment: Mario & Snake Payloads</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#ff003c]"></div> Difficulty: BEGINNER/INTERMEDIATE</li>
            </ul>
          </div>
          <button 
            onClick={() => onSelectCourse('re')}
            className="relative z-10 w-full bg-transparent border border-[#ff003c] hover:bg-[#ff003c] text-[#ff003c] hover:text-black font-bold uppercase tracking-widest py-3 mt-auto transition-colors"
          >
            [ INITIATE_COURSE ]
          </button>
        </div>

        {/* Web Pen Testing Course Card */}
        <div className="bg-[#0a0a0a] border border-[#ff003c]/50 rounded p-6 hover:shadow-[0_0_25px_rgba(255,0,60,0.2)] transition-all group relative overflow-hidden flex flex-col justify-between">
          <div className="scanlines absolute inset-0 opacity-50 z-0"></div>
          <div className="relative z-10">
            <span className="px-2 py-0.5 text-[10px] bg-[#ff003c] text-black font-bold mb-4 inline-block">ADVANCED MODULE</span>
            <h3 className="text-3xl font-black text-white mb-4 group-hover:text-[#ff003c] transition-colors glitch" data-text="Web Penetration Testing">
              Web Penetration Testing
            </h3>
            <p className="text-sm text-gray-400 font-sans mb-6 leading-relaxed">
              Explore vulnerabilities in web application architectures. You will learn web fundamentals, data manipulation, and exploit real-world injection scenarios including SQLi and XSS.
            </p>
            <ul className="text-xs text-gray-500 font-sans mb-8 space-y-2">
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#ff003c]"></div> Modules: 3 (Web 101, SQLi, XSS)</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#ff003c]"></div> Assessment: Corporate Login Bypass</li>
              <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#ff003c]"></div> Difficulty: INTERMEDIATE</li>
            </ul>
          </div>
          <button 
            onClick={() => onSelectCourse('web')}
            className="relative z-10 w-full bg-transparent border border-[#ff003c] hover:bg-[#ff003c] text-[#ff003c] hover:text-black font-bold uppercase tracking-widest py-3 mt-auto transition-colors"
          >
            [ INITIATE_COURSE ]
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [activeCourseId, setActiveCourseId] = useState<'re' | 'web'>('re');
  const [currentModule, setCurrentModule] = useState(0);

  interface Module {
    id: number;
    title: string;
    docUrl: string;
    status: string;
    flag?: string;
    hasLab?: boolean;
  }

  interface Course {
    title: string;
    identifier: string;
    hasPayloads?: boolean;
    modules: Module[];
  }

  const coursesData: Record<'re' | 'web', Course> = {
    're': {
      title: 'Reverse Engineering',
      identifier: 'CL-REV',
      hasPayloads: true,
      modules: [
        { id: 0, title: 'MOD 00: Environment Prep', docUrl: '/tool-setup-guide.md', status: 'UNLOCKED' },
        { id: 1, title: 'MOD 01: Ghidra Basics', docUrl: '/mario-re-guide.md', status: 'UNLOCKED' },
        { id: 2, title: 'MOD 02: Engine Manipulation', docUrl: '/snake-re-guide.md', status: 'UNLOCKED' }
      ]
    },
    'web': {
      title: 'Web Penetration Testing',
      identifier: 'CL-WEB',
      modules: [
        { id: 0, title: 'MOD 00: Web Applications 101', docUrl: '/web-intro-guide.md', status: 'UNLOCKED' },
        { id: 1, title: 'MOD 01: SQL Injection (SQLi)', docUrl: '/sqli-guide.md', status: 'UNLOCKED', flag: 'RakHack{SQLi_M4st3r_2026}', hasLab: true },
        { id: 2, title: 'MOD 02: Cross-Site Scripting', docUrl: '/xss-guide.md', status: 'UNLOCKED' }
      ]
    }
  };

  const activeCourse = coursesData[activeCourseId];
  const modules = activeCourse.modules;

  // Global app-load glitch trigger
  const [appKey, setAppKey] = useState(0);
  useEffect(() => {
    // Triggers glitch when the app mounts, or tab switches
    setAppKey(prev => prev + 1);
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col font-mono selection:bg-[#ff003c] selection:text-white bg-[#020202]">
      {/* Header */}
      <header className="border-b border-[#ff003c]/50 bg-black sticky top-0 z-50 shadow-[0_4px_20px_rgba(255,0,60,0.15)] overflow-hidden">
        <div className="scanlines absolute inset-0 opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('catalog')}>
            <span className="text-3xl font-extrabold text-white tracking-tighter glitch" data-text="RakHack">RakHack</span>
            <span className="text-[10px] px-2 py-1 mt-1 bg-[#ff003c]/20 text-[#ff003c] border border-[#ff003c]/50 rounded animate-pulse shadow-[0_0_8px_#ff003c]">EDTECH_SYS v2.0</span>
          </div>
          <nav className="flex gap-8">
            <button 
              onClick={() => setActiveTab('catalog')}
              className={`transition-all uppercase tracking-widest text-sm hover:text-[#ff003c] ${activeTab === 'catalog' ? 'text-[#ff003c] font-bold border-b-2 border-[#ff003c] pb-1' : 'text-gray-500'}`}
            >
              [ Course_Catalog ]
            </button>
            <button 
              onClick={() => { setActiveTab('course'); setCurrentModule(0); }}
              className={`transition-all uppercase tracking-widest text-sm hover:text-[#ff003c] ${activeTab === 'course' ? 'text-[#ff003c] font-bold border-b-2 border-[#ff003c] pb-1' : 'text-gray-500'}`}
            >
              [ Active_Terminal ]
            </button>
          </nav>
        </div>
      </header>

      {/* Main Layout Area - Mount Glitch animation tied to appKey */}
      <main key={appKey} className="flex-grow max-w-7xl w-full mx-auto px-6 py-8 flex gap-8 animate-glitch-in">
        
        {activeTab === 'catalog' && (
          <CourseCatalog onSelectCourse={(courseId) => {
            setActiveCourseId(courseId as 're' | 'web');
            setActiveTab('course');
            setCurrentModule(0);
          }}/>
        )}

        {activeTab === 'course' && (
          <>
            <aside className="w-80 shrink-0 flex flex-col gap-4">
              <div className="bg-[#0f0f0f] border border-gray-800 p-4 rounded mb-2 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                <h3 className="text-[#ff003c] text-[10px] uppercase mb-1 tracking-widest flex justify-between">
                  <span>Target Identifier</span>
                  <span className="text-gray-500 border border-gray-700 px-1">{activeCourse.identifier}</span>
                </h3>
                <div className="text-white text-lg font-bold">{activeCourse.title}</div>
                <div className="w-full bg-gray-900 h-1.5 mt-3 rounded overflow-hidden">
                  <div 
                    className="bg-[#ff003c] h-full shadow-[0_0_10px_#ff003c] transition-all duration-700" 
                    style={{ width: `${((currentModule + 1) / modules.length) * 100}%` }}
                  ></div>
                </div>
                <div className="text-right text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                  {Math.round(((currentModule + 1) / modules.length) * 100)}% Synchronized
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {modules.map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => setCurrentModule(mod.id)}
                    className={`text-left p-4 rounded border transition-all relative overflow-hidden group ${currentModule === mod.id ? 'bg-[#ff003c]/10 border-[#ff003c] text-white shadow-[inset_4px_0_0_#ff003c]' : 'bg-[#0a0a0a] border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300'}`}
                  >
                    {currentModule === mod.id && <div className="absolute inset-0 scanlines opacity-30 pointer-events-none"></div>}
                    <div className="flex justify-between items-center mb-1 relative z-10">
                      <span className="text-[10px] uppercase tracking-wider text-[#ff003c]">{mod.status === 'UNLOCKED' ? '[OPEN]' : ''}</span>
                      <span className="text-[10px] px-1 bg-gray-900 border border-gray-700 rounded font-bold">LVL_{mod.id}</span>
                    </div>
                    <div className="font-bold relative z-10">{mod.title}</div>
                  </button>
                ))}
                
                {activeCourse.hasPayloads && (
                  <button
                    onClick={() => setCurrentModule(-1)}
                    className={`mt-4 text-left p-4 rounded border transition-all relative overflow-hidden group ${currentModule === -1 ? 'bg-[#ff003c]/10 border-[#ff003c] text-white shadow-[inset_4px_0_0_#ff003c]' : 'bg-[#0a0a0a] border-[#ff003c]/30 text-[#ff003c] hover:border-[#ff003c] hover:bg-[#ff003c]/5'}`}
                  >
                    {currentModule === -1 && <div className="absolute inset-0 scanlines opacity-30 pointer-events-none"></div>}
                    <div className="flex justify-between items-center mb-1 relative z-10">
                      <span className="text-[10px] uppercase tracking-wider text-[#ff003c]">{'[DOWNLOAD]'}</span>
                      <span className="text-[10px] px-1 bg-[#ff003c] text-black rounded font-bold">ASSETS</span>
                    </div>
                    <div className="font-bold relative z-10 tracking-widest uppercase">Raw Payloads</div>
                  </button>
                )}
              </div>
            </aside>

            <section className="flex-grow h-[calc(100vh-140px)]">
              {currentModule === -1 && activeCourse.hasPayloads && (
                <div className="bg-[#0a0a0a] border border-[#ff003c]/40 p-10 rounded shadow-[0_0_15px_rgba(255,0,60,0.1)] h-full overflow-y-auto animate-glitch-in scanlines relative">
                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-white mb-8 border-b border-[#ff003c]/30 pb-4 uppercase tracking-widest flex items-center gap-3">
                      <span className="bg-[#ff003c] text-black px-2 py-1 text-sm">{'>'}RAW</span> Deployment Payloads
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <AssetCard 
                        title="mario.exe [x86]" 
                        description="Vulnerable C++ executable. Analyze logic flow to manipulate memory health integers." 
                        exeUrl="/mario.exe" 
                        size="1.44 MB"
                      />
                      <AssetCard 
                        title="snake.exe [x86]" 
                        description="Dynamic memory challenge. Patch the increment loop for immediate system win states." 
                        exeUrl="/snake.exe" 
                        size="1.83 MB"
                      />
                    </div>
                  </div>
                </div>
              )}

              {modules.map((mod) => (
                <div key={mod.id} className={currentModule === mod.id ? 'h-full' : 'hidden'}>
                  {currentModule === mod.id && (
                    <CourseContent title={mod.title} docUrl={mod.docUrl}>
                      {mod.hasLab && <LabRunner />}
                      {mod.flag && (
                        <FlagSubmission 
                          expectedFlag={mod.flag} 
                          onComplete={() => console.log('Module completed!')} 
                        />
                      )}
                    </CourseContent>
                  )}
                </div>
              ))}
            </section>
          </>
        )}

      </main>
    </div>
  );
}

function AssetCard({ title, description, exeUrl, size }: { title: string, description: string, exeUrl: string, size: string }) {
  return (
    <div className="bg-[#080808] border border-gray-800 rounded p-6 hover:border-[#ff003c]/80 hover:shadow-[0_0_20px_rgba(255,0,60,0.15)] transition-all group relative overflow-hidden flex flex-col h-full">
      <div className="absolute inset-0 scanlines opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none"></div>
      <div className="absolute top-0 right-0 p-2 bg-gray-900 text-[10px] text-gray-400 font-bold border-b border-l border-gray-800 rounded-bl tracking-widest">
        SIZE:{size}
      </div>
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#ff003c] transition-colors uppercase tracking-widest relative z-10">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 font-sans relative z-10 leading-relaxed">{description}</p>
      
      <div className="mt-auto relative z-10">
        <a 
          href={exeUrl} download
          className="inline-flex w-full items-center justify-center gap-2 bg-transparent border border-[#ff003c] hover:bg-[#ff003c] text-[#ff003c] hover:text-black font-bold px-4 py-3 rounded text-sm transition-all uppercase tracking-widest"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          PULL_FILE
        </a>
      </div>
    </div>
  );
}

export default App;
