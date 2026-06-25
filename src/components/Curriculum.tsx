/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronDown, Folder, Code, Award, Target, BookOpen, Clock, Gamepad2, Layers } from 'lucide-react';
import { cyberpunkSFX } from '../utils/audio';

interface ModuleItem {
  id: string;
  step: string;
  title: string;
  shortDesc: string;
  duration: string;
  level: string;
  gameConcept: string;
  technologies: string[];
  subChapters: string[];
  unlockedPercent: number;
}

const SYLLABUS_DATA: ModuleItem[] = [
  {
    id: 'mod-1',
    step: 'MÓDULO 01',
    title: 'Retro-Núcleo: Sintaxe, Tipagem & Fluxos Elementares',
    shortDesc: 'Aprenda os primeiros compilados de lógica de programação controlando um robô rover em um labirinto bidimensional.',
    duration: '12 horas de imersão',
    level: 'Operador Iniciante',
    gameConcept: 'Code Rover Escape (Labirinto de Instruções)',
    technologies: ['JavaScript ES6', 'Metodologias de Algoritmos', 'Variáveis de Estado'],
    subChapters: [
      'Declaração de Memória: Let vs Const no espaço cyber',
      'Estruturas de Decisão: Condicionais If / Else if / Else',
      'Matrizes Primitivas: Números, Strings e Booleans na rede',
      'Compilação de Labirinto: Operadores lógicos de conjunção e disjunção',
      'Desafio Prático Final: Escrever um roteador lógico para escapar do robô patrulhador'
    ],
    unlockedPercent: 100
  },
  {
    id: 'mod-2',
    step: 'MÓDULO 02',
    title: 'Arena de Repetição: Manipulação de Coleções & Matrizes',
    shortDesc: 'Controle exércitos de drones virtuais e monte inventários de ataques otimizando loops de computação.',
    duration: '18 horas de imersão',
    level: 'Operador Intermediário',
    gameConcept: 'Drone Grid Commander (RPG de Estratégia de Código)',
    technologies: ['Loops For/While', 'Operações de Array', 'Ordenação de Estruturas'],
    subChapters: [
      'Controle Iterativo: Gerenciando pilhas de dados com loops For',
      'Vetores Computados: Métodos nativos essenciais (Map, Filter, Reduce)',
      'Escopo de Comando: Isolamento léxico e controle de funções',
      'Gargalos de Buffer: Otimização de tempo de execução O(n)',
      'Desafio Prático Final: Criar uma fila recursiva de drones combatentes automáticos'
    ],
    unlockedPercent: 85
  },
  {
    id: 'mod-3',
    step: 'MÓDULO 03',
    title: 'Invasão Assíncrona: Eventos, Callbacks & Requisições de Rede',
    shortDesc: 'Rompa e intercepte conexões de firewalls distantes injetando requisições assíncronas assombrosas.',
    duration: '22 horas de imersão',
    level: 'Netrunner Grade II',
    gameConcept: 'Terminal Server Corruptor (Simulador Web API)',
    technologies: ['Promises / Await', 'JSON Data Parsing', 'Manipulação do DOM / CSS Grid'],
    subChapters: [
      'Fluxos Desincronizados: Conceito de concorrência e o Loop de Eventos do JS',
      'Fidelidade de Rede: Consumindo APIs REST externas reais',
      'Aegis de Tratamento: Captura segura com blocos try-catch assíncronos',
      'Multiplexação Dinâmica: Renderização baseada em respostas de servidores',
      'Desafio Prático Final: Construir um client-side decodificador de chat global criptografado'
    ],
    unlockedPercent: 60
  },
  {
    id: 'mod-4',
    step: 'MÓDULO 04',
    title: 'Sistemas Autônomos: Programação de Robôs Orientada a Objetos',
    shortDesc: 'Funda sua própria guilda cibernética parametrizando herofiles persistentes com backends enérgicos e POO.',
    duration: '28 horas de imersão',
    level: 'Cyber Architect',
    gameConcept: 'Mech Constructor Framework (Simulador de Fábrica de Robôs)',
    technologies: ['Classes / Herança', 'Programação Orientada a Objetos', 'Bancos de Dados NoSQL'],
    subChapters: [
      'Fábrica de Matrizes: Classes, Instâncias e métodos construtores',
      'Criptografia de Memória: Encapsulamento, setters e getters',
      'Instanciação Cósmica: Polimorfismo e herança recursiva de combatentes',
      'Persistência Operacional: Guardando conquistas com LocalStorage e NoSQL',
      'Desafio Prático Final: Implementar uma IA de batalha autônoma que performa decisões complexas com OOP'
    ],
    unlockedPercent: 40
  }
];

export default function Curriculum() {
  const [activeMod, setActiveMod] = useState<string>('mod-1');

  const handleSelectMod = (id: string) => {
    cyberpunkSFX.playTick(1300);
    setActiveMod(id);
  };

  return (
    <div className="space-y-8">
      {/* Dynamic Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-mono font-bold text-fuchsia-400 bg-fuchsia-950/30 border border-fuchsia-500/20 px-3 py-1 rounded-full uppercase tracking-widest inline-block select-none">
          TRILHA DE EVOLUÇÃO OPERACIONAL
        </span>
        <h3 className="text-2xl md:text-4xl font-extrabold text-zinc-100 tracking-tight">
          Arquitetura de Aprendizado <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">Por Jogos</span>
        </h3>
        <p className="text-sm md:text-base text-zinc-400">
          Chega de slides chatos de PowerPoint e sintaxe abstrata. No CyberCode, cada linha de código escrita comanda ações, soluciona quebra-cabeças mecânicos e desvenda uma narrativa instigante.
        </p>
      </div>

      {/* Grid Layout Syllabus Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Modular Navigation Selector */}
        <div className="col-span-12 lg:col-span-5 space-y-3.5">
          {SYLLABUS_DATA.map((item) => {
            const isActive = activeMod === item.id;
            
            return (
              <button
                key={item.id}
                id={`curriculum-mod-btn-${item.id}`}
                onClick={() => handleSelectMod(item.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                  isActive
                    ? 'border-fuchsia-500 bg-fuchsia-950/15 shadow-[0_0_15px_rgba(232,121,249,0.08)]'
                    : 'border-zinc-900 bg-zinc-950/50 hover:bg-zinc-900/30 hover:border-zinc-850'
                }`}
              >
                {/* Horizontal progress indicators */}
                <div className={`absolute top-0 left-0 h-0.5 bg-fuchsia-500 transition-all duration-500`} style={{ width: `${item.unlockedPercent}%` }} />

                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono py-0.2 px-1.5 rounded font-black ${
                      isActive 
                        ? 'bg-fuchsia-500 text-black' 
                        : 'bg-zinc-900 text-zinc-500'
                    }`}>
                      {item.step}
                    </span>
                    <span className="text-xs font-mono text-zinc-500 uppercase flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.duration}
                    </span>
                  </div>
                  
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-ping shrink-0" />
                  )}
                </div>

                <h4 className={`text-sm md:text-base font-extrabold font-mono transition-colors uppercase ${
                  isActive ? 'text-zinc-100' : 'text-zinc-400 group-hover:text-zinc-200'
                }`}>
                  {item.title.split(':')[0]}
                </h4>

                <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                  {item.shortDesc}
                </p>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-zinc-900/50 text-[10px] font-mono text-zinc-500">
                  <span>EXP LEVEL: <strong className="text-zinc-400">{item.level}</strong></span>
                  <span>COMPLETO: <strong className="text-fuchsia-400">{item.unlockedPercent}%</strong></span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Module Deep Detail View HUD */}
        <div className="col-span-12 lg:col-span-7 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 md:p-8 flex flex-col justify-between relative min-h-[460px]">
          
          {/* Subtle neon grid backdrop */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] rounded-2xl pointer-events-none" />

          {(() => {
            const activeModItem = SYLLABUS_DATA.find((m) => m.id === activeMod)!;
            return (
              <div className="space-y-6 relative z-10">
                
                {/* Module title & metadata */}
                <div className="border-b border-zinc-900 pb-5">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <span className="text-[10px] font-mono tracking-widest text-fuchsia-400 uppercase py-0.5 px-2 bg-fuchsia-950/20 border border-fuchsia-500/20 rounded">
                      Carga Horária Garantida: {activeModItem.duration}
                    </span>
                    <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
                      <Layers className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{activeModItem.level}</span>
                    </div>
                  </div>
                  
                  <h4 className="text-xl md:text-2xl font-black font-mono text-zinc-100 uppercase tracking-wide">
                    {activeModItem.title}
                  </h4>
                </div>

                {/* Sub-block 1: Interactive Learning Game core */}
                <div className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="w-5 h-5 text-cyan-400" />
                    <span className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider">Jogo Principal do Módulo</span>
                  </div>
                  <div>
                    <h5 className="font-mono text-sm text-cyan-400 font-extrabold">{activeModItem.gameConcept}</h5>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                      {activeModItem.shortDesc} Ative variáveis, parametrize arrays de comandos e resolva enigmas para ganhar conquistas colecionáveis no seu terminal.
                    </p>
                  </div>
                </div>

                {/* Technologies badge deck */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Tecnologias Domadas</span>
                  <div className="flex flex-wrap gap-2">
                    {activeModItem.technologies.map((tech, i) => (
                      <span key={i} className="text-xs font-mono bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 px-3 py-1 rounded transition-colors">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Chapter breakdown list with simulated checkbox status */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Ementa de Arquivos (Subtópicos)</span>
                  
                  <div className="space-y-2.5 font-mono text-xs">
                    {activeModItem.subChapters.map((chap, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-zinc-400 py-1 border-b border-zinc-900/40 last:border-0">
                        <span className="text-fuchsia-400 font-bold select-none shrink-0">[O]</span>
                        <span>{chap}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })()}

          {/* Quick interactive conversion module warning */}
          <div className="mt-8 pt-4 border-t border-zinc-900 flex items-center justify-between text-xs font-mono text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-fuchsia-400 shrink-0" />
              Gera Badge de Operador e Certificado Criptográfico.
            </span>
            <a href="#avatar-module" className="text-cyan-400 text-right underline hover:text-cyan-300">
              Gerar Avatar &gt;
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
