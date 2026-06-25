/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Shield, Zap, Terminal, Database, Cpu, ChevronRight, Binary, Award } from 'lucide-react';
import { cyberpunkSFX } from '../utils/audio';

export interface HackerClass {
  id: string;
  name: string;
  title: string;
  description: string;
  color: string; // Tailwind gold, teal, pink, neon-green
  glowColor: string; // RGBA glow
  skills: { label: string; value: number }[];
  primaryLanguage: string;
  focusTool: string;
}

const HACKER_CLASSES: HackerClass[] = [
  {
    id: 'netrunner',
    name: 'Netrunner',
    title: 'Manipulador Virtual & Especialista em Redes',
    description: 'Bypassa roteadores de segurança injetando scripts assíncronos de alta performance. Seu foco absoluto é Javascript, APIs e manipulação dinâmica de nós.',
    color: 'text-cyan-400 border-cyan-500/50 hover:border-cyan-400/80 bg-cyan-950/20',
    glowColor: 'rgba(34, 211, 238, 0.4)',
    skills: [
      { label: 'Lógica Assíncrona', value: 92 },
      { label: 'Manipulação de APIs', value: 87 },
      { label: 'Velocidade de Injeção', value: 95 },
      { label: 'Evasão de Firewall', value: 78 }
    ],
    primaryLanguage: 'JavaScript / Node.js',
    focusTool: 'Neural Net Deck v4.2'
  },
  {
    id: 'cyber-knight',
    name: 'Cyber-Knight',
    title: 'Guardião Crítico & Engenheiro de Fortificações',
    description: 'Especialista em segurança cibernética e algoritmos complexos. Defende redes criando regras e scripts pesados em Python. Sua força está na modelagem teórica e criptografia.',
    color: 'text-amber-400 border-amber-500/50 hover:border-amber-400/80 bg-amber-950/20',
    glowColor: 'rgba(251, 191, 36, 0.4)',
    skills: [
      { label: 'Lógica Assíncrona', value: 74 },
      { label: 'Manipulação de APIs', value: 80 },
      { label: 'Velocidade de Injeção', value: 83 },
      { label: 'Evasão de Firewall', value: 96 }
    ],
    primaryLanguage: 'Python / Rust',
    focusTool: 'Sentinel Aegis Core'
  },
  {
    id: 'script-phantom',
    name: 'Script Phantom',
    title: 'Fantasma do Terminal & Orquestrador de Automação',
    description: 'Invisível e impiedoso. Automatiza tarefas inteiras com um único comando recursivo de terminal. Domina o Linux, Bash, e arquiteturas de Shell recursivas.',
    color: 'text-fuchsia-400 border-fuchsia-500/50 hover:border-fuchsia-400/80 bg-fuchsia-950/20',
    glowColor: 'rgba(232, 121, 249, 0.4)',
    skills: [
      { label: 'Lógica Assíncrona', value: 85 },
      { label: 'Manipulação de APIs', value: 76 },
      { label: 'Velocidade de Injeção', value: 90 },
      { label: 'Evasão de Firewall', value: 84 }
    ],
    primaryLanguage: 'Bash / Go / Linux Scripting',
    focusTool: 'Ghost-Shell v1.0.9'
  },
  {
    id: 'data-miner',
    name: 'Data Miner',
    title: 'Arqueólogo de Dados & Engenheiro de Inteligência',
    description: 'Estrutura, filtra e destila oceanos de dados em insights brilhantes de IA. Seu reino são bancos de dados complexos, queries relacionais e redes neurais profundas.',
    color: 'text-emerald-400 border-emerald-500/50 hover:border-emerald-400/80 bg-emerald-950/20',
    glowColor: 'rgba(52, 211, 153, 0.4)',
    skills: [
      { label: 'Lógica Assíncrona', value: 80 },
      { label: 'Manipulação de APIs', value: 94 },
      { label: 'Velocidade de Injeção', value: 72 },
      { label: 'Evasão de Firewall', value: 82 }
    ],
    primaryLanguage: 'SQL / Python / Pandas',
    focusTool: 'DeepSynapse Indexer'
  }
];

interface AvatarCreatorProps {
  onClassSelected: (hackerClass: HackerClass, handle: string) => void;
  savedClassId?: string;
  savedHandle?: string;
}

export default function AvatarCreator({ onClassSelected, savedClassId, savedHandle }: AvatarCreatorProps) {
  const [selectedClass, setSelectedClass] = useState<HackerClass>(
    HACKER_CLASSES.find((c) => c.id === savedClassId) || HACKER_CLASSES[0]
  );
  const [handle, setHandle] = useState(savedHandle || 'Guest_Operator_#8005');
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccessMessage, setSavedSuccessMessage] = useState(false);

  useEffect(() => {
    onClassSelected(selectedClass, handle);
    localStorage.setItem('cyber_hacker_class', selectedClass.id);
    localStorage.setItem('cyber_hacker_handle', handle);
  }, [selectedClass, handle]);

  const selectClass = (hc: HackerClass) => {
    cyberpunkSFX.playTargetAcquired();
    setSelectedClass(hc);
  };

  const generateRandomHandle = () => {
    cyberpunkSFX.playTick(1500, 0.04);
    const prefixes = ['Neo', 'Null', 'Phreak', 'Acid', 'Voxel', 'Synapse', 'Cortex', 'Quantum', 'Glitch', 'Krypton'];
    const suffixes = ['Dev', 'Zero', 'Ghost', 'Pointer', 'Storm', 'Shell', 'Strike', 'Loop', 'Pulse', 'Cyber'];
    const num = Math.floor(100 + Math.random() * 900);
    const randomName = `${prefixes[Math.floor(Math.random() * prefixes.length)]}_${suffixes[Math.floor(Math.random() * suffixes.length)]}_#${num}`;
    setHandle(randomName);
  };

  const handleHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHandle(e.target.value.replace(/[^a-zA-Z0-9_#\-]/g, ''));
  };

  return (
    <div id="avatar-module" className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 md:p-8 backdrop-blur-xl overflow-hidden">
      
      {/* Absolute Tech Grid Background Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Title & Introductory Terminal Subheading */}
      <div className="col-span-12 flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-6 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase">Módulo 01: Identidade Operacional</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-zinc-100 tracking-tight">
            Escolha Sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400">Classe Cyber</span>
          </h3>
        </div>
        
        {/* User Handle HUD Creator */}
        <div className="mt-4 md:mt-0 flex items-center gap-3 bg-zinc-900/80 border border-zinc-800 rounded-lg px-4 py-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Assinatura de Rede</span>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={handle}
                  maxLength={25}
                  onChange={handleHandleChange}
                  onBlur={() => {
                    setIsEditing(false);
                    cyberpunkSFX.playSuccess();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsEditing(false);
                      cyberpunkSFX.playSuccess();
                    }
                  }}
                  autoFocus
                  className="bg-black/50 border border-cyan-500/50 text-cyan-400 text-sm font-mono focus:outline-none px-2 py-0.5 rounded"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-cyan-400 font-bold">{handle}</span>
                <button
                  id="btn-edit-handle"
                  onClick={() => {
                    cyberpunkSFX.playTick();
                    setIsEditing(true);
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-300 underline font-mono cursor-pointer"
                >
                  [RE-ASSINAR]
                </button>
              </div>
            )}
          </div>
          <button
            id="btn-random-handle"
            onClick={generateRandomHandle}
            title="Sintetizar identificação randômica"
            className="p-1 text-zinc-400 hover:text-cyan-400 bg-zinc-800 hover:bg-zinc-750 rounded transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Class Selector Left Section (4 classes selection) */}
      <div className="col-span-12 lg:col-span-6 space-y-4 flex flex-col justify-between">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {HACKER_CLASSES.map((hc) => {
            const isSelected = selectedClass.id === hc.id;
            return (
              <button
                key={hc.id}
                id={`class-card-${hc.id}`}
                onClick={() => selectClass(hc)}
                className={`relative flex flex-col p-4 text-left border rounded-xl transition-all duration-300 cursor-pointer overflow-hidden group ${
                  isSelected
                    ? `${hc.color} shadow-lg shadow-${hc.id === 'netrunner' ? 'cyan' : hc.id === 'cyber-knight' ? 'amber' : hc.id === 'script-phantom' ? 'fuchsia' : 'emerald'}-500/10 scale-[1.02]`
                    : 'border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
                }`}
                style={{
                  boxShadow: isSelected ? `0 0 16px ${hc.glowColor}` : 'none'
                }}
              >
                {/* Visual highlights inside button */}
                <span className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl opacity-[0.05] rounded-bl-full transition-opacity group-hover:opacity-10`} />

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {hc.id === 'netrunner' && <Zap className="w-5 h-5 text-cyan-400" />}
                    {hc.id === 'cyber-knight' && <Shield className="w-5 h-5 text-amber-500" />}
                    {hc.id === 'script-phantom' && <Cpu className="w-5 h-5 text-fuchsia-400" />}
                    {hc.id === 'data-miner' && <Database className="w-5 h-5 text-emerald-400" />}
                    <span className="font-extrabold font-mono text-base uppercase tracking-wider">{hc.name}</span>
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  )}
                </div>

                <p className="text-xs text-zinc-400 line-clamp-3 mb-2 leading-relaxed h-[54px]">
                  {hc.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-zinc-900/50 text-[10px] font-mono">
                  <span className="text-zinc-500">PROTOC.:</span>
                  <span className="text-zinc-300 uppercase tracking-widest">{hc.primaryLanguage.split(' ')[0]}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bonus Gamification info HUD bottom left */}
        <div className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl flex items-center gap-4 mt-2">
          <div className="w-10 h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center text-cyan-400 shrink-0 border border-cyan-400/20">
            <Award className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase">Multiplicador Inicial de XP</h4>
            <p className="text-xs text-zinc-500 mt-0.5">Sua classe concede <span className="text-cyan-400 font-bold font-mono">1.5x de bônus</span> na trilha de jogos de {selectedClass.primaryLanguage.split(' ')[0]}.</p>
          </div>
        </div>
      </div>

      {/* Class Statistics HUD Right Section */}
      <div className="col-span-12 lg:col-span-6 flex flex-col justify-between border border-zinc-900 bg-black/60 rounded-xl p-5 md:p-6">
        
        {/* Dynamic header stats relative to selected class */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className={`text-[10px] font-mono tracking-widest uppercase py-0.5 px-2 bg-zinc-800 border border-zinc-700 rounded mr-2`}>
                Deck Ativo
              </span>
              <span className="text-xs font-mono text-zinc-500">
                {selectedClass.focusTool}
              </span>
              <h4 className="text-xl font-black text-zinc-100 uppercase tracking-widest mt-2">
                FICHA OPERATOR: {selectedClass.name}
              </h4>
              <p className="text-xs text-zinc-400 italic mt-0.5">
                "{selectedClass.title}"
              </p>
            </div>
            
            {/* Visual Badge representing current class */}
            <div className={`p-3 border rounded-xl flex items-center justify-center`}
                 style={{
                   borderColor: selectedClass.id === 'netrunner' ? 'rgba(34, 211, 238, 0.4)' : selectedClass.id === 'cyber-knight' ? 'rgba(251, 191, 36, 0.4)' : selectedClass.id === 'script-phantom' ? 'rgba(232, 121, 249, 0.4)' : 'rgba(52, 211, 153, 0.4)',
                   backgroundColor: 'rgba(0, 0, 0, 0.8)',
                   boxShadow: `0 0 10px ${selectedClass.glowColor}`
                 }}>
              {selectedClass.id === 'netrunner' && <Zap className="w-8 h-8 text-cyan-400" />}
              {selectedClass.id === 'cyber-knight' && <Shield className="w-8 h-8 text-amber-400" />}
              {selectedClass.id === 'script-phantom' && <Cpu className="w-8 h-8 text-fuchsia-400" />}
              {selectedClass.id === 'data-miner' && <Database className="w-8 h-8 text-emerald-400" />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-3 border-y border-zinc-900 bg-zinc-950/40 px-3 rounded-lg">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Trilha Principal</span>
              <div className="font-mono text-sm text-zinc-200 mt-0.5 flex items-center gap-1.5">
                <Binary className="w-3.5 h-3.5 text-zinc-400" />
                {selectedClass.primaryLanguage}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Rank Inicial</span>
              <div className="font-mono text-sm text-zinc-200 mt-0.5 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                Level 1 [Novato Core]
              </div>
            </div>
          </div>

          {/* Stats Bar Container (Power bars) */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider">Atributos de Decodificação</span>
            
            {selectedClass.skills.map((skill, index) => {
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-zinc-400">{skill.label}</span>
                    <span className="text-zinc-200 font-bold">{skill.value}%</span>
                  </div>
                  {/* Grid gauge with segmented progress effect */}
                  <div className="h-2 w-full bg-zinc-900 rounded overflow-hidden flex gap-[2px]">
                    {Array.from({ length: 10 }).map((_, segmentIdx) => {
                      const fillPct = (segmentIdx + 1) * 10;
                      const hasFill = fillPct <= skill.value;
                      const activeColorBg = 
                        selectedClass.id === 'netrunner' ? 'bg-cyan-400' :
                        selectedClass.id === 'cyber-knight' ? 'bg-amber-400' :
                        selectedClass.id === 'script-phantom' ? 'bg-fuchsia-400' : 'bg-emerald-400';

                      return (
                        <div
                          key={segmentIdx}
                          className={`h-full flex-1 transition-all duration-500 ${
                            hasFill ? activeColorBg : 'bg-zinc-900/90'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA prompt */}
        <div className="mt-5 pt-4 border-t border-zinc-900 text-center">
          <p className="text-[11px] font-mono text-zinc-500">
            Sincronização HUD estabelecida. Avance para o <a href="#hacker-terminal" className="text-cyan-400 underline hover:text-cyan-300">Simulador de Terminal</a> para demonstrar seu potencial inicial.
          </p>
        </div>

      </div>

    </div>
  );
}
