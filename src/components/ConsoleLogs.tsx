/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Quote, MessageSquare, Terminal, Shield, ExternalLink, Star } from 'lucide-react';
import { cyberpunkSFX } from '../utils/audio';

interface Testimonial {
  id: number;
  handle: string;
  classTag: string; // Netrunner, Cyber-Knight, etc.
  avatarAesthetic: string; // colors
  role: string;
  sourceNode: string; // simulated proxy ip
  story: string;
  achievement: string;
  score: number;
}

const DECODED_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    handle: 'null_phantom_x',
    classTag: 'NETRUNNER',
    avatarAesthetic: 'text-cyan-400 border-cyan-400/30 bg-cyan-950/20',
    role: 'Engenheiro Frontend @ FinTech Neon',
    sourceNode: 'proxy_sub_822.41',
    story: 'Eu tinha pavor de algoritmos. Decorar sintaxe seca de loop no YouTube me dava desânimo total. Os jogos do CyberCode transformaram lógica em diversão pura. Quando fiz minha primeira entrevista de emprego real, já sabia de cabeça estruturas assíncronas porque cansei de usá-las para bypassar as defesas do simulador. Recomendo 200%!',
    achievement: 'Aprovado em Teste JS Dinâmico de Primeira',
    score: 5
  },
  {
    id: 2,
    handle: 'krypton_knight_0',
    classTag: 'CYBER-KNIGHT',
    avatarAesthetic: 'text-amber-400 border-amber-400/30 bg-amber-950/20',
    role: 'Analista de Sec @ SecureNet',
    sourceNode: 'gateway_vpx_99',
    story: 'Os puzzles de injeção condicional e tratamento de erros do Módulo 3 foram exatamente as pegadinhas que caíram no meu teste técnico prático. Aprender jogando te força a construir as sinapses de forma intuitiva. Hoje trabalho no terminal o dia todo, os comandos de Linux ensinados caíram como uma luva.',
    achievement: 'Duplicou salário em 4 meses pós-curso',
    score: 5
  },
  {
    id: 3,
    handle: 'data_glitch',
    classTag: 'DATA MINER',
    avatarAesthetic: 'text-emerald-400 border-emerald-400/30 bg-emerald-950/20',
    role: 'Data Engineer @ DeepLearn INC',
    sourceNode: 'node_data_007',
    story: 'O grande trunfo é o feed de problemas realistas do portal de conquistas. Você não esquece as coisas porque elas estavam atreladas a vitórias nos combates lógicos. O suporte e a comunidade interna funcionam como um clã integrado. Aprendi mais banco de dados estructurado jogando aqui do que na faculdade de ADS inteiro.',
    achievement: 'Concluiu portfólio NoSQL gamificado',
    score: 5
  }
];

export default function ConsoleLogs() {
  const [activeIndex, setActiveIndex] = useState(0);

  const selectTestimonial = (idx: number) => {
    cyberpunkSFX.playTick(1100 + idx * 70, 0.04);
    setActiveIndex(idx);
  };

  const activeTest = DECODED_TESTIMONIALS[activeIndex];

  return (
    <div className="relative bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 md:p-8 backdrop-blur-xl overflow-hidden">
      
      {/* Background design elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Text and Selector Buttons */}
        <div className="col-span-12 lg:col-span-4 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase py-0.5 px-2 bg-cyan-950/30 border border-cyan-500/25 rounded inline-block">
              Transmissões Reconectadas
            </span>
            <h4 className="text-xl md:text-2xl font-black text-zinc-100 uppercase tracking-widest leading-none">
              O Feedback dos <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Netrunners</span>
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Consulte relatos reais decodificados do canal interno do Slack/Discord de estudantes que conquistaram cargos e construíram seus Mechs de código.
            </p>
          </div>

          {/* Buttons to switch testimonials */}
          <div className="space-y-2.5">
            {DECODED_TESTIMONIALS.map((t, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={t.id}
                  id={`testimonial-btn-${t.id}`}
                  onClick={() => selectTestimonial(idx)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left font-mono transition-all cursor-pointer ${
                    isActive
                      ? 'border-cyan-500/50 bg-cyan-950/20 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.05)]'
                      : 'border-zinc-900 bg-zinc-950/80 text-zinc-500 hover:text-zinc-300 hover:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Terminal className="w-4 h-4 text-zinc-600 self-center shrink-0" />
                    <div className="truncate">
                      <span className="text-xs font-black block text-zinc-300">@{t.handle}</span>
                      <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-widest">{t.classTag}</span>
                    </div>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse shrink-0 ml-2" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Testimonial Card Display block */}
        <div className="col-span-12 lg:col-span-8 bg-black/60 border border-zinc-900 rounded-xl p-6 flex flex-col justify-between relative min-h-[300px]">
          
          <div className="absolute top-4 right-4 flex items-center gap-1.5">
            {Array.from({ length: activeTest.score }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            ))}
          </div>

          <div className="space-y-5">
            {/* Top info and Class Tag status indicators */}
            <div className="flex items-center gap-3">
              <div className={`p-2.5 border rounded-lg ${activeTest.avatarAesthetic} shrink-0 font-mono text-sm font-extrabold`}>
                {activeTest.handle[0].toUpperCase()}
              </div>
              <div className="font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-zinc-200">@{activeTest.handle}</span>
                  <span className="text-[9px] font-bold py-0.2 px-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 uppercase">
                    {activeTest.sourceNode}
                  </span>
                </div>
                <span className="text-xs text-zinc-400 mt-0.5 block">{activeTest.role}</span>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="relative">
              <Quote className="absolute -top-3 -left-3 w-8 h-8 text-cyan-400/5 rotate-180 pointer-events-none" />
              <p className="text-sm text-zinc-300 leading-relaxed pl-1 pl-4 border-l-2 border-zinc-800">
                {activeTest.story}
              </p>
            </div>
          </div>

          {/* Achievements Footer */}
          <div className="mt-8 pt-4 border-t border-zinc-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono select-none">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block tracking-wider">Conquista Destacada</span>
              <span className="text-xs text-emerald-400 font-black mt-0.5 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-current shrink-0" />
                {activeTest.achievement}
              </span>
            </div>

            <div className="text-xs text-zinc-500 hover:text-cyan-400 decoration-cyan-500/10 hover:decoration-cyan-400/50 underline flex items-center gap-1 cursor-pointer">
              <span>Controle de Ativos</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
