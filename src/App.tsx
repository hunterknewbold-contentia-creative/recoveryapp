/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Calendar, 
  LayoutDashboard, 
  Settings, 
  Plus, 
  Flame,
  Wind,
  Coffee,
  Utensils,
  MessageCircle,
  TrendingUp,
  History as HistoryIcon
} from 'lucide-react';
import { UserState, CheckIn, Mood } from './types';
import { getState, saveState, addCheckIn } from './lib/storage';

// --- Sub-components ---

function StatCard({ label, value, icon: Icon, colorClass, isStreak }: { label: string, value: string | number, icon: any, colorClass: string, isStreak?: boolean }) {
  if (isStreak) {
    return (
      <div className="streak-gradient text-white px-8 py-6 rounded-3xl shadow-lg flex items-center gap-4">
        <div className="text-3xl">🔥</div>
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider opacity-80">{label}</span>
          <span className="text-2xl font-bold">{value} Days</span>
        </div>
      </div>
    );
  }
  return (
    <div className="card flex items-center gap-4 p-8">
      <div className={`p-4 rounded-2xl ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

// --- Main Views ---

export default function App() {
  const [view, setView] = useState<'dashboard' | 'checkin' | 'history' | 'insights'>('dashboard');
  const [state, setState] = useState<UserState>(getState());
  const [showCheckIn, setShowCheckIn] = useState(false);

  useEffect(() => {
    setState(getState());
  }, [showCheckIn, view]);

  const handleCheckInComplete = (checkIn: CheckIn) => {
    addCheckIn(checkIn);
    setShowCheckIn(false);
    setView('dashboard');
  };

  const currentStreak = state.streak;
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pl-24 bg-slate-50">
      {/* Sleek Sidebar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 md:top-0 md:w-24 md:border-t-0 md:border-r h-20 md:h-full px-4 md:py-10 flex md:flex-col justify-around md:justify-start gap-12">
        <div className="hidden md:flex items-center justify-center mb-8">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-200">
            S
          </div>
        </div>
        
        <NavButton active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={LayoutDashboard} label="Home" />
        <NavButton active={view === 'history'} onClick={() => setView('history')} icon={HistoryIcon} label="Log" />
        <NavButton active={view === 'insights'} onClick={() => setView('insights')} icon={TrendingUp} label="Stats" />
        
        <div className="md:mt-auto flex justify-center">
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <Settings size={24} />
          </button>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto p-6 md:p-12">
        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                  <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Good Morning</h1>
                  <p className="text-slate-500 font-medium mt-1">{today}</p>
                </div>
                <StatCard 
                  label="Clean Streak" 
                  value={currentStreak} 
                  icon={Flame} 
                  colorClass="" 
                  isStreak
                />
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="md:col-span-2 space-y-12">
                  <section className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-slate-100 flex flex-col items-center text-center justify-center">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8">
                      <Heart size={40} className="text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Daily Check-in</h2>
                    <p className="text-slate-500 mb-10 max-w-sm text-lg">Your progress matters. Take a moment to log your state.</p>
                    <button 
                      onClick={() => setShowCheckIn(true)}
                      className="btn-primary"
                    >
                      Check in Now
                    </button>
                  </section>

                  <section className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">What helps now?</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <CopingButton icon={Wind} label="Walk" description="10 mins" onClick={() => {}} />
                      <CopingButton icon={Coffee} label="Shower" description="Warm water" onClick={() => {}} />
                      <CopingButton icon={Utensils} label="Eat" description="Nourish" onClick={() => {}} />
                      <button 
                        onClick={() => {}}
                        className="bg-rose-50 border border-rose-100 p-6 rounded-3xl flex flex-col items-center justify-center text-center gap-3 text-rose-700 font-bold hover:bg-rose-100 transition-all transition-colors"
                      >
                        <span className="text-2xl p-2 bg-white rounded-full shadow-sm">💬</span>
                        <span className="text-sm">Clinician</span>
                      </button>
                    </div>
                  </section>
                </div>

                {/* Sidebar area */}
                <aside className="space-y-8">
                  <div className="card space-y-8">
                    <h3 className="text-lg font-bold text-slate-800">Weekly Overview</h3>
                    <div className="flex flex-col gap-6">
                      <OverviewItem label="Avg. Cravings" value={state.checkIns.length > 0 ? "Normal" : "N/A"} status="Low" color="emerald" />
                      <OverviewItem label="Total Records" value={state.checkIns.length} status="Active" color="blue" />
                      <OverviewItem label="Meds Taken" value="95%" status="Good" color="slate" />
                    </div>
                    
                    {/* Tiny Chart Mockup from Design */}
                    <div className="mt-8 h-24 flex items-end gap-2 px-2">
                       {Array.from({length: 7}).map((_, i) => (
                         <div key={i} className={`flex-1 rounded-t-lg transition-all ${[60, 40, 70, 50, 90, 80, 20][i] > 50 ? 'bg-emerald-500' : 'bg-slate-200'}`} style={{ height: `${[60, 40, 70, 50, 90, 80, 20][i]}%` }} />
                       ))}
                    </div>
                  </div>

                  <div className="bg-indigo-600 rounded-[2rem] p-8 text-white flex flex-col gap-4 shadow-xl shadow-indigo-100">
                    <div className="text-4xl">💡</div>
                    <h4 className="font-bold text-xl leading-snug">Recovery Tip</h4>
                    <p className="text-indigo-100 text-sm opacity-90 leading-relaxed">Consistency is better than perfection. Each check-in strengthens your commitment.</p>
                  </div>
                </aside>
              </div>
            </motion.div>
          )}

          {view === 'history' && <HistoryView checkIns={state.checkIns} />}
          {view === 'insights' && <InsightsView checkIns={state.checkIns} />}
        </AnimatePresence>
      </main>

      {/* Check-in Modal */}
      <AnimatePresence>
        {showCheckIn && (
          <CheckInModal 
            onClose={() => setShowCheckIn(false)} 
            onComplete={handleCheckInComplete} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function OverviewItem({ label, value, status, color }: { label: string, value: string | number, status: string, color: string }) {
  const colorMap: any = {
    emerald: 'bg-emerald-100 text-emerald-700',
    blue: 'bg-blue-100 text-blue-700',
    slate: 'bg-slate-100 text-slate-700'
  };
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500 text-sm font-medium">{label}</span>
      <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${colorMap[color]}`}>{status}</span>
    </div>
  );
}

function NavButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex md:w-full flex-col items-center gap-2 px-2 py-4 rounded-2xl transition-all ${
        active ? 'text-emerald-600 md:bg-emerald-50/50' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'
      }`}
    >
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}

function CopingButton({ icon: Icon, label, description, onClick }: { icon: any, label: string, description: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="glass p-6 rounded-[2rem] flex flex-col items-center justify-center text-center gap-3 hover:bg-white transition-all group"
    >
      <div className="text-2xl p-2 bg-emerald-50 rounded-full group-hover:bg-emerald-100 transition-colors">
        <Icon size={24} className="text-emerald-600" />
      </div>
      <div>
        <p className="font-bold text-slate-800 text-sm">{label}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{description}</p>
      </div>
    </button>
  );
}

// --- Feature Views ---

function CheckInModal({ onClose, onComplete }: { onClose: () => void, onComplete: (checkIn: CheckIn) => void }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<CheckIn>>({
    cravingLevel: 5,
    mood: 'okay',
    sleepHours: 7,
    didUse: false,
    tookMeds: true,
    triggerNote: '',
    nextAction: '',
    notes: '',
  });

  const moods: { label: string, value: Mood, emoji: string }[] = [
    { label: 'Great', value: 'great', emoji: '🌟' },
    { label: 'Good', value: 'good', emoji: '😊' },
    { label: 'Okay', value: 'okay', emoji: '😐' },
    { label: 'Tough', value: 'tough', emoji: '😔' },
    { label: 'Very Hard', value: 'very-hard', emoji: '🆘' },
  ];

  const handleFinish = () => {
    onComplete({
      ...data,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    } as CheckIn);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl overflow-hidden border border-slate-100"
      >
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Check-in</h2>
          <span className="bg-slate-50 px-4 py-1 rounded-full text-xs font-bold text-slate-400 uppercase tracking-widest border border-slate-100">Step {step} of 3</span>
        </div>

        <div className="min-h-[320px]">
          {step === 1 && (
            <div className="space-y-10">
              <div className="space-y-6">
                <label className="block text-xl font-bold text-slate-800">Cravings intensity?</label>
                <input 
                  type="range" 
                  min="0" max="10" 
                  value={data.cravingLevel}
                  onChange={(e) => setData({ ...data, cravingLevel: parseInt(e.target.value) })}
                  className="w-full h-2 bg-emerald-50 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>None</span>
                  <span className="text-emerald-600 text-2xl font-black">{data.cravingLevel}</span>
                  <span>Extreme</span>
                </div>
              </div>

              <div className="space-y-6">
                <label className="block text-xl font-bold text-slate-800">Current mood?</label>
                <div className="grid grid-cols-5 gap-3">
                  {moods.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setData({ ...data, mood: m.value })}
                      className={`flex flex-col items-center p-4 rounded-3xl border-2 transition-all ${
                        data.mood === m.value ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-100' : 'border-slate-50 bg-slate-50/50'
                      }`}
                    >
                      <span className="text-3xl mb-2">{m.emoji}</span>
                      <span className="text-[10px] uppercase font-black text-slate-500">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="block text-xl font-bold text-slate-800">Sleep hours</label>
                <input 
                  type="number" 
                  value={data.sleepHours}
                  onChange={(e) => setData({ ...data, sleepHours: parseFloat(e.target.value) })}
                  className="w-full p-6 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-emerald-100 outline-none transition-all font-bold text-lg"
                  placeholder="0.0"
                />
              </div>

              <div className="flex items-center justify-between p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100/50">
                <div>
                  <p className="font-bold text-emerald-900">Meds taken</p>
                  <p className="text-xs font-bold text-emerald-600/70 uppercase tracking-wider">As scheduled today</p>
                </div>
                <button
                  onClick={() => setData({ ...data, tookMeds: !data.tookMeds })}
                  className={`w-14 h-8 rounded-full p-1 transition-colors ${data.tookMeds ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full transition-transform ${data.tookMeds ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-6 bg-rose-50/50 rounded-3xl border border-rose-100/50">
                <div>
                  <p className="font-bold text-rose-900">Had a lapse?</p>
                  <p className="text-xs font-bold text-rose-600/70 uppercase tracking-wider">Honesty builds strength</p>
                </div>
                <button
                  onClick={() => setData({ ...data, didUse: !data.didUse })}
                  className={`w-14 h-8 rounded-full p-1 transition-colors ${data.didUse ? 'bg-rose-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full transition-transform ${data.didUse ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Flame size={20} className="text-orange-500" />
                  Urge Triggers
                </label>
                <textarea 
                  value={data.triggerNote}
                  onChange={(e) => setData({ ...data, triggerNote: e.target.value })}
                  className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 h-24 focus:bg-white focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-sm leading-relaxed"
                  placeholder="What sparked the urge today?"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-lg font-bold text-slate-800">Action Plan</label>
                <input 
                  type="text"
                  value={data.nextAction}
                  onChange={(e) => setData({ ...data, nextAction: e.target.value })}
                  className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 focus:bg-white focus:ring-4 focus:ring-emerald-100 outline-none transition-all font-medium"
                  placeholder="One thing you'll do next..."
                />
              </div>

              <div className="space-y-3">
                <textarea 
                  value={data.notes}
                  onChange={(e) => setData({ ...data, notes: e.target.value })}
                  className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-100 h-24 focus:bg-white focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-sm italic"
                  placeholder="Final thoughts, wins, or patterns..."
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 flex gap-4">
          {step > 1 && (
            <button 
              onClick={() => setStep(step - 1)}
              className="flex-1 py-5 font-bold text-slate-400 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"
            >
              Back
            </button>
          )}
          <button 
            onClick={() => step < 3 ? setStep(step + 1) : handleFinish()}
            className="flex-[2] py-5 font-bold bg-slate-900 text-white rounded-2xl shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all hover:-translate-y-1 active:translate-y-0"
          >
            {step === 3 ? 'Save Record' : 'Continue'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function HistoryView({ checkIns }: { checkIns: CheckIn[] }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10"
    >
      <header>
        <h2 className="text-4xl font-bold text-slate-800 tracking-tight">Recovery Log</h2>
        <p className="text-slate-500 font-medium mt-2">Patterns over time reveal your path forward.</p>
      </header>
      
      {checkIns.length === 0 ? (
        <div className="card text-center py-20 flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
            <HistoryIcon size={32} />
          </div>
          <p className="text-slate-500 font-medium max-w-xs">No records yet. Your consistency journey begins with your first log.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {checkIns.map((ci) => (
            <motion.div 
              key={ci.id} 
              className="card group hover:border-emerald-200 hover:shadow-xl transition-all"
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-xl text-slate-800">{new Date(ci.timestamp).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${ci.didUse ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                      {ci.didUse ? 'Lapse' : 'Clean'}
                    </span>
                    <span className="bg-slate-50 text-slate-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-slate-100">
                      Craving: {ci.cravingLevel}/10
                    </span>
                  </div>
                </div>
                <span className="text-4xl bg-slate-50 p-2 rounded-2xl group-hover:bg-emerald-50 transition-colors">
                  {ci.mood === 'great' ? '🌟' : ci.mood === 'good' ? '😊' : ci.mood === 'okay' ? '😐' : ci.mood === 'tough' ? '😔' : '🆘'}
                </span>
              </div>
              
              <div className="space-y-4">
                {ci.triggerNote && (
                  <div className="p-4 bg-orange-50/50 rounded-2xl text-sm border border-orange-100/50">
                    <p className="font-black text-orange-800 text-[10px] uppercase tracking-widest mb-1">Trigger Found</p>
                    <p className="text-orange-900 font-medium">{ci.triggerNote}</p>
                  </div>
                )}
                {ci.nextAction && (
                  <div className="p-4 bg-emerald-50/50 rounded-2xl text-sm border border-emerald-100/50">
                    <p className="font-black text-emerald-800 text-[10px] uppercase tracking-widest mb-1">Next Step</p>
                    <p className="text-emerald-900 font-medium">{ci.nextAction}</p>
                  </div>
                )}
                {ci.notes && (
                  <p className="text-slate-500 text-sm italic leading-relaxed pl-2 border-l-2 border-slate-100">
                    "{ci.notes}"
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function InsightsView({ checkIns }: { checkIns: CheckIn[] }) {
  const last7Days = checkIns.slice(0, 7);
  const avgCraving = last7Days.reduce((acc, curr) => acc + curr.cravingLevel, 0) / (last7Days.length || 1);
  const cleanPercentage = (last7Days.filter(ci => !ci.didUse).length / (last7Days.length || 1)) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      <header>
        <h2 className="text-4xl font-bold text-slate-800 tracking-tight">Recovery Insights</h2>
        <p className="text-slate-500 font-medium mt-2">Visualizing your progress over the last 7 sessions.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card border-0 bg-slate-900 text-white shadow-2xl shadow-slate-200">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Weekly Consistency</p>
          <div className="flex items-end gap-3">
            <span className="text-6xl font-black text-emerald-400">{Math.round(cleanPercentage)}%</span>
            <span className="text-slate-500 font-bold pb-2 uppercase text-[10px] tracking-tight">Clean Rate</span>
          </div>
        </div>
        <div className="card glass">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Craving Load</p>
          <div className="flex items-end gap-3">
            <span className="text-6xl font-black text-orange-500">{avgCraving.toFixed(1)}</span>
            <span className="text-slate-400 font-bold pb-2 uppercase text-[10px] tracking-tight">Avg. Intensity</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section className="space-y-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Mood Distribution</h3>
          <div className="card h-64 flex items-end gap-4 p-10 justify-between bg-white border-slate-50">
            {['very-hard', 'tough', 'okay', 'good', 'great'].map(m => {
              const count = last7Days.filter(ci => ci.mood === m).length;
              const height = (count / (last7Days.length || 1)) * 100;
              return (
                <div key={m} className="flex-1 flex flex-col items-center gap-4 group">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height * 1.5, 8)}%` }}
                    className={`w-full ${m === 'great' ? 'bg-emerald-500' : m === 'good' ? 'bg-emerald-400' : 'bg-slate-200'} rounded-2xl group-hover:bg-slate-300 transition-colors shadow-sm`}
                  />
                  <span className="text-2xl opacity-80 group-hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                    {m === 'great' ? '🌟' : m === 'good' ? '😊' : m === 'okay' ? '😐' : m === 'tough' ? '😔' : '🆘'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Identified Triggers</h3>
          <div className="space-y-4">
            {last7Days.filter(ci => ci.triggerNote).map(ci => (
              <div key={ci.id} className="p-6 bg-white border border-slate-50 rounded-3xl shadow-sm flex gap-6 hover:border-emerald-100 transition-colors">
                <div className="w-1 bg-gradient-to-b from-orange-400 to-rose-400 rounded-full" />
                <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{new Date(ci.timestamp).toDateString()}</p>
                  <p className="text-slate-800 font-medium leading-relaxed">{ci.triggerNote}</p>
                </div>
              </div>
            ))}
            {last7Days.filter(ci => ci.triggerNote).length === 0 && (
              <div className="card bg-emerald-50/30 border-dashed border-emerald-200 text-center py-12">
                <p className="text-emerald-700 font-bold">No triggers recorded this week.</p>
                <p className="text-emerald-600/60 text-sm mt-1">Keep staying mindful.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
