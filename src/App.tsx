/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { 
  Play, ShieldAlert, Cpu, Heart, CheckCircle2, ChevronDown, 
  Lock, ArrowRight, Volume2, VolumeX, Sparkles, Terminal, 
  HelpCircle, UserCheck, Timer, Bookmark, Send, Copy, Laptop, HelpCircle as FaqIcon, Coins, Award
} from 'lucide-react';

import { cyberpunkSFX } from './utils/audio';
import type { HackerClass } from './components/AvatarCreator';

const AvatarCreator = lazy(() => import('./components/AvatarCreator'));
const HackSimulator = lazy(() => import('./components/HackSimulator'));
const Curriculum = lazy(() => import('./components/Curriculum'));
const ConsoleLogs = lazy(() => import('./components/ConsoleLogs'));
const PreRegistration = lazy(() => import('./components/PreRegistration'));

function TerminalLoader() {
  return (
    <div className="w-full h-48 bg-zinc-950/20 border border-zinc-900 rounded-2xl flex flex-col items-center justify-center font-mono text-xs text-cyan-400 p-6 animate-pulse select-none">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span className="font-bold tracking-widest text-glow-cyan">DECODIFICANDO NODE...</span>
      </div>
      <div className="text-[10px] text-zinc-500 max-w-xs text-center leading-normal">
        Sincronizando chunks criptográficos do console. Por favor, aguarde a montagem da interface do clã.
      </div>
    </div>
  );
}

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Preciso ter conhecimento prévio em programação ou matemática?",
    a: "Absolutamente não! O curso foi desenhado do absoluto zero. Você iniciará dominando a lógica básica de mover objetos e resolver puzzles visuais. Aos poucos, sem perceber, transicionará da solução de quebra-cabeças mecânicos para a escrita de códigos complexos do mundo real."
  },
  {
    q: "Quais linguagens e tecnologias vou aprender exatamente?",
    a: "Nossa trilha principal é focada em JavaScript e TypeScript (as linguagens mais demandadas do ecossistema web moderno) e Python (a linguagem de inteligência artificial e automação). Você também aprenderá Banco de Dados NoSQL e fundamentos cruciais de segurança de servidores."
  },
  {
    q: "Como funcionam esses 'jogos com código' na prática?",
    a: "Em vez de assistir a videoaulas passivas, você trabalha em nossa IDE integrada ao jogo. Para se movimentar, abrir fechaduras eletrônicas ou programar drones para batalhar na arena do jogo, você precisa corrigir ou criar scripts em tempo real. O jogo compila seu código JS/Python e te dá resposta visual instantânea nas telas de RPG."
  },
  {
    q: "O certificado é reconhecido pelo mercado de tecnologia?",
    a: "Sim. Ao concluir os desafios práticos finais de cada módulo, o seu terminal emite uma Badge de Identidade Criptográfica registrada na blockchain de testes do curso. Esse certificado consolida seu portfólio de projetos gamificados comprovando suas qualificações diretamente no LinkedIn e GitHub."
  },
  {
    q: "E se eu me arrepender do investimento?",
    a: "Oferecemos nossa apólice 'Zero Logs' de Garantia Incondicional de 30 dias. Se por qualquer motivo achar que aprender programando por jogos não é seu estilo, basta acionar o botão de auto-destruição no suporte. Reembolsamos 100% do seu pagamento e deletamos quaisquer vestígios de logs do seu usuário."
  }
];

export default function App() {
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);
  const [discountPct, setDiscountPct] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [selectedClass, setSelectedClass] = useState<HackerClass | null>(null);
  const [hackerHandle, setHackerHandle] = useState('Guest_Operator');
  
  // Checkout simulator triggers
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPlanName, setSelectedPlanName] = useState('');
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [copiedCouponBannerActive, setCopiedCouponBannerActive] = useState(false);

  // Time urgency countdown hooks
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 14, s: 45 });

  useEffect(() => {
    // Dynamic countdown clock of promotional node
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.s > 0) {
          return { ...prev, s: prev.s - 1 };
        } else if (prev.m > 0) {
          return { ...prev, m: prev.m - 1, s: 59 };
        } else if (prev.h > 0) {
          return { h: prev.h - 1, m: 59, s: 59 };
        } else {
          return { h: 12, m: 0, s: 0 }; // resetting node state
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync SFX state with UI changes
  useEffect(() => {
    cyberpunkSFX.setMute(isAudioMuted);
  }, [isAudioMuted]);

  // Safe wrapper for trigger sound click feedback
  const handleGenericClick = (soundType: 'tick' | 'success' | 'granted' | 'glitch' = 'tick') => {
    if (soundType === 'tick') {
      cyberpunkSFX.playTick(1200, 0.05);
    } else if (soundType === 'success') {
      cyberpunkSFX.playSuccess();
    } else if (soundType === 'granted') {
      cyberpunkSFX.playAccessGranted();
    } else if (soundType === 'glitch') {
      cyberpunkSFX.playGlitch();
    }
  };

  const handleToggleMute = () => {
    const nextState = !isAudioMuted;
    setIsAudioMuted(nextState);
    if (!nextState) {
      setTimeout(() => {
        cyberpunkSFX.playSuccess();
      }, 100);
    }
  };

  // Called when child puzzle simulator is cracked with a coupon award
  const handleCouponAwarded = (code: string, pct: number) => {
    setActiveCoupon(code);
    setDiscountPct(pct);
  };

  const handleClassSelection = (hc: HackerClass, handle: string) => {
    setSelectedClass(hc);
    setHackerHandle(handle);
  };

  const triggerCheckoutFlow = (planName: string) => {
    handleGenericClick('granted');
    setSelectedPlanName(planName);
    setShowCheckoutModal(true);
    setCheckoutStep(1);
  };

  // Pricing calculation helper
  const getCalculatedPrice = (baseVal: number): { base: string; desc: string; installment: string } => {
    const discounted = baseVal * (1 - discountPct / 100);
    const installmentVal = (discounted / 12).toFixed(2);
    return {
      base: `R$ ${baseVal.toFixed(2)}`,
      desc: `R$ ${discounted.toFixed(2)}`,
      installment: `R$ ${installmentVal}`
    };
  };

  const lifetimePrice = getCalculatedPrice(997);
  const monthlyPrice = getCalculatedPrice(97);

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-mono selection:bg-cyan-500 selection:text-black antialiased relative overflow-hidden">
      
      {/* CRT Scanning Line overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 animate-scan-line" />

      {/* Ticker System State Announcement Band */}
      <div className="bg-zinc-950 border-b border-zinc-900 text-[10px] py-1.5 px-4 overflow-hidden select-none whitespace-nowrap flex items-center gap-6 text-zinc-500">
        <span className="flex items-center gap-1.5 shrink-0 text-cyan-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          ESTADO DO NODE: SINC_OK
        </span>
        <div className="animate-marquee inline-block whitespace-nowrap space-x-12">
          <span>// PROTOCOLO SECURE SHIELD ATIVO [PORTA 3000] // COMUNIDADE SINCRETIZADA COM 4.195 HACKERS ATIVOS</span>
          <span>// PROMPT DISPONÍVEL: DESAFIE O TERMINAL ABAIXO PARA GANHAR 20% OFF // GARANTIA AUTO-DESTRUIÇÃO ZERO LOGS 30 DIAS</span>
          <span>// CLASSE SELECIONADA: {selectedClass ? selectedClass.name.toUpperCase() : 'NENHUMA'}</span>
        </div>
      </div>

      {/* Global Interactive Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-zinc-900 py-3.5 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand Title */}
          <a
            href="#"
            onClick={() => handleGenericClick()}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-400 via-purple-500 to-fuchsia-500 flex items-center justify-center p-[1px] shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <div className="w-full h-full bg-black rounded-[3px] flex items-center justify-center font-black text-sm text-cyan-400">
                C
              </div>
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-widest text-zinc-100 group-hover:text-cyan-400 transition-colors uppercase">
                CyberCode
              </span>
              <span className="text-[10px] text-zinc-500 block uppercase font-mono tracking-widest -mt-0.5">
                Academy //
              </span>
            </div>
          </a>

          {/* Navigation link anchors desktop-only */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-400">
            <a href="#avatar-module" onClick={() => handleGenericClick()} className="hover:text-cyan-400 font-mono transition-colors uppercase tracking-wider">01. Atributos</a>
            <a href="#hacker-terminal" onClick={() => handleGenericClick()} className="hover:text-cyan-400 font-mono transition-colors uppercase tracking-wider">02. Simulador-Bypass</a>
            <a href="#curriculum-mod-btn-mod-1" onClick={() => handleGenericClick()} className="hover:text-cyan-400 font-mono transition-colors uppercase tracking-wider">03. Ementa-Jogos</a>
            <a href="#leads-registration" onClick={() => handleGenericClick()} className="hover:text-cyan-400 font-mono transition-colors uppercase tracking-wider">04. Pré-Registro</a>
            <a href="#pricing-module" onClick={() => handleGenericClick()} className="hover:text-cyan-500 font-semibold font-mono transition-colors uppercase tracking-wider text-cyan-400">05. Contrato Vaga</a>
          </nav>

          {/* Audio deck controller dashboard element */}
          <div className="flex items-center gap-3">
            <button
              id="btn-toggle-global-audio"
              onClick={handleToggleMute}
              className={`flex items-center gap-2 text-[10px] font-mono tracking-wider font-extrabold uppercase py-1.5 px-3 rounded-lg border transition-all cursor-pointer ${
                isAudioMuted
                  ? 'border-zinc-800 bg-zinc-900/40 text-zinc-550 hover:text-zinc-350 hover:border-zinc-700'
                  : 'border-cyan-500/50 bg-cyan-950/20 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.15)] animate-pulse'
              }`}
            >
              {isAudioMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Áudio: DESL.</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="text-glow-cyan">Áudio: LIGADO COREG</span>
                </>
              )}
            </button>

            {/* Simulated target locator */}
            <div className="text-[10px] text-zinc-500 font-mono hidden sm:block bg-zinc-900/60 border border-zinc-900 px-2 py-1.5 rounded text-right">
              SYSTEM: <strong className="text-zinc-300">ACTIVE</strong>
            </div>
          </div>

        </div>
      </header>

      {/* Main Container contents */}
      <main className="flex-1 space-y-24 px-4 py-12 md:py-16">
        
        {/* HERO SECTION / THE FIRST FOLD */}
        <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 pb-4">
          
          {/* Aesthetic background mesh */}
          <div className="absolute top-0 left-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-6 right-12 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Column 1: Core value proposition and countdown indicator */}
          <div className="col-span-12 lg:col-span-7 space-y-6 text-left">
            
            {/* Urgent node banner */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-950/40 to-zinc-950 border border-cyan-500/20 rounded-full py-1.5 px-3.5 select-none animate-pulse">
              <Timer className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] font-bold text-zinc-300 font-mono uppercase tracking-widest">
                Node Promocional Expira em: <strong className="text-cyan-400 font-black">{timeLeft.h.toString().padStart(2, '0')}h {timeLeft.m.toString().padStart(2, '0')}m {timeLeft.s.toString().padStart(2, '0')}s</strong>
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-100 uppercase leading-none">
              DOMINE A CHAVE MATRIZ.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400">
                APRENDA A PROGRAMAR
              </span><br />
              HACKEANDO JOGOS.
            </h1>

            <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-2xl">
              Cansado de cursos monótonos e intermináveis com sintaxes sem contexto? No <strong>CyberCode Academy</strong> você entra em uma simulação hacker e desenvolve scripts JS, Python e Algoritmos reais para superar quebra-cabeças mecânicos e comandar robôs combatentes.
            </p>

            {/* Quick stats grid display */}
            <div className="grid grid-cols-3 gap-4 py-4 px-5 bg-zinc-950/70 border border-zinc-900 rounded-2xl max-w-xl">
              <div className="text-center font-mono border-r border-zinc-900/80">
                <span className="text-xs text-zinc-500 block uppercase">Nível Alcançado</span>
                <span className="text-lg md:text-xl font-bold text-cyan-400 block mt-0.5">DEV JUNIOR</span>
              </div>
              <div className="text-center font-mono border-r border-zinc-900/80">
                <span className="text-xs text-zinc-500 block uppercase">Foco Prático</span>
                <span className="text-lg md:text-xl font-bold text-fuchsia-400 block mt-0.5">93% CODING</span>
              </div>
              <div className="text-center font-mono">
                <span className="text-xs text-zinc-500 block uppercase">Jogos Reais</span>
                <span className="text-lg md:text-xl font-bold text-amber-400 block mt-0.5">04 PROJETOS</span>
              </div>
            </div>

            {/* Action buttons CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#hacker-terminal"
                onClick={() => handleGenericClick('granted')}
                className="font-mono uppercase bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs tracking-widest text-center py-4 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] scale-[1.01] cursor-pointer"
              >
                ACESSAR TERMINAL DE TESTES
              </a>
              <a
                href="#pricing-module"
                className="font-mono uppercase bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-zinc-300 hover:text-zinc-100 text-xs tracking-widest text-center py-4 px-8 rounded-xl transition-colors cursor-pointer"
              >
                MATRICULAR-SE DIRETO
              </a>
            </div>

            {/* Social urgency guarantee micro indicator */}
            <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-550 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Sincronização 30 dias de Reembolso assegurado sem logs.</span>
            </div>

          </div>

          {/* Column 2: Simulated Cyber-Deck HUD Graphic */}
          <div className="col-span-12 lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
            
            {/* Visual Frame mock of coding compiler */}
            <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-2xl relative select-none">
              
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4 text-[10px] text-zinc-550">
                <span>TERMINAL_MATRIX_STATUS</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  ONLINE
                </span>
              </div>

              {/* Dynamic status variable display */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-550 uppercase">CONEXÃO OPERADOR</span>
                  <div className="bg-black/85 border border-zinc-900 p-2.5 rounded font-mono text-xs text-zinc-300 flex justify-between">
                    <span>HANDLE:</span>
                    <span className="text-cyan-400 font-bold truncate max-w-[120px]">{hackerHandle}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-550 uppercase">CLASSE CONTRATADA</span>
                  <div className="bg-black/85 border border-zinc-900 p-2.5 rounded font-mono text-xs text-zinc-300 flex justify-between">
                    <span>STATUS:</span>
                    <span className="text-purple-400 font-bold uppercase">{selectedClass ? selectedClass.name : 'NENHUMA'}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-zinc-900/20 border border-zinc-900 rounded-xl space-y-2">
                  <span className="text-[10px] font-bold text-zinc-300 block uppercase">STATUS DO HARDware</span>
                  <div className="flex justify-between items-center text-[10px] text-zinc-500">
                    <span>SYNAPSE DRIVE:</span>
                    <span className="text-emerald-400">100% OK</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-zinc-500">
                    <span>COMPILADOR ES12:</span>
                    <span className="text-cyan-400">ATIVO</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-zinc-500">
                    <span>CUPOM REWARD:</span>
                    <span className={`${activeCoupon ? 'text-emerald-400 font-extrabold animate-pulse' : 'text-zinc-650'}`}>
                      {activeCoupon ? 'CYBER_PUZZLE_20 (-20%)' : 'RESTRITO'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-900 flex justify-between items-center">
                  <span className="text-[10px] text-zinc-650">DISTRICT DE REGISTRO</span>
                  <span className="text-[10px] text-zinc-400 font-bold">Node-07_SaoPaulo</span>
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* SECTION 01: INTEL AVATAR CLASS CUSTOMIZER */}
        <section id="avatar-module" className="max-w-7xl mx-auto space-y-6">
          <Suspense fallback={<TerminalLoader />}>
            <AvatarCreator 
              onClassSelected={handleClassSelection} 
              savedClassId={selectedClass?.id}
              savedHandle={hackerHandle}
            />
          </Suspense>
        </section>

        {/* SECTION 02: THE PLAYABLE TERMINAL SIMULATOR */}
        <section className="max-w-7xl mx-auto space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/30 border border-cyan-500/20 px-3 py-1 rounded-full uppercase tracking-widest inline-block select-none">
              Módulo de Penetração Lógica
            </span>
            <h3 className="text-2xl md:text-4xl font-extrabold text-zinc-100 tracking-tight">
              Quebre o Código e <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Bypasse a Trava</span>
            </h3>
            <p className="text-sm md:text-base text-zinc-400">
              Corrija as vulnerabilidades do sistema de firewall simulado abaixo para testar sua aptidão hacker. Concluir os 3 estágios com sucesso vai decodificar e habilitar um <strong className="text-cyan-400">Cupom de 20% de desconto</strong> instantâneo na matrícula!
            </p>
          </div>

          <Suspense fallback={<TerminalLoader />}>
            <HackSimulator 
              onAwardCoupon={handleCouponAwarded}
              hackerHandle={hackerHandle}
              selectedHackerClass={selectedClass?.name}
            />
          </Suspense>
        </section>

        {/* SECTION 03: THE COURSE SYLLABUS TIMELINE */}
        <section className="max-w-7xl mx-auto">
          <Suspense fallback={<TerminalLoader />}>
            <Curriculum />
          </Suspense>
        </section>

        {/* SECTION 04: SOCIAL PROOF AND GRADUATES SPEECHES */}
        <section className="max-w-7xl mx-auto">
          <Suspense fallback={<TerminalLoader />}>
            <ConsoleLogs />
          </Suspense>
        </section>

        {/* SECTION 05: CONVERSION PRICING PANEL */}
        <section id="pricing-module" className="max-w-7xl mx-auto space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/30 border border-amber-500/20 px-3 py-1 rounded-full uppercase tracking-widest inline-block select-none animate-pulse">
              CONTRATAÇÃO DE VAGAS DE ACESSO
            </span>
            <h3 className="text-2xl md:text-4xl font-extrabold text-zinc-100 tracking-tight">
              Habilite Seu Deck de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-red-400">Operador</span>
            </h3>
            <p className="text-sm text-zinc-400">
              Escolha seu nível de infiltração na matriz do aprendizado pelo jogo. Pague em ambiente 100% encriptado e seguro.
            </p>
          </div>

          {/* Quick Notification banner if Coupon is Active */}
          {activeCoupon && (
            <div className="max-w-2xl mx-auto bg-emerald-500/10 border border-emerald-400/40 p-4 rounded-xl text-center font-mono text-xs text-emerald-400 animate-pulse flex items-center justify-center gap-2">
              <Award className="w-5 h-5 shrink-0" />
              <span>
                <strong>SISTEMA ALERTA:</strong> Cupom <strong className="underline">{activeCoupon}</strong> detectado com sucesso no navegador! Preços promocionais de <strong>20% DE DESCONTO</strong> habilitados na tabela abaixo.
              </span>
            </div>
          )}

          {/* Core Pricing cards grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            
            {/* Price Option A: Monthly Subscription */}
            <div className="bg-zinc-950/60 border border-zinc-900 rounded-2xl p-6 md:p-8 flex flex-col justify-between relative group hover:border-zinc-800 transition-colors">
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase block mb-1">
                    Plano Mensal Recorrente
                  </span>
                  <h4 className="text-lg font-black text-zinc-200 uppercase tracking-widest font-mono">
                    HACKER DE ELITE
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Acesso recorrente a todas as trilhas básicas, projetos no console e fórum do clã de estudantes enquanto durar seu plano mensal.
                  </p>
                </div>

                <div className="py-4 border-y border-zinc-900 bg-zinc-950/40 px-3 rounded-lg font-mono">
                  {discountPct > 0 ? (
                    <div className="space-y-1">
                      <span className="text-xs text-zinc-500 line-through block">{monthlyPrice.base}/mês</span>
                      <div className="text-2xl md:text-3xl font-black text-emerald-400 flex items-baseline gap-1.5">
                        <span>{monthlyPrice.desc}</span>
                        <span className="text-[11px] text-zinc-400 font-normal">/mês</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 block font-bold">GANHO REAL DO BYPASS TERMINAL (-20%)</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-2xl md:text-3xl font-black text-zinc-200 flex items-baseline gap-1.5">
                        <span>{monthlyPrice.base}</span>
                        <span className="text-[11px] text-zinc-400 font-normal">/mês</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 block">Assinatura sem fidelidade, cancele a qualquer hora</span>
                    </div>
                  )}
                </div>

                {/* Features included */}
                <ul className="space-y-3 font-mono text-xs text-zinc-400">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Acesso a todas as IDEs de jogos do Módulo 1 e 2</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Compilação básica e suporte comunitário integrado</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Emissão de Badges Básicas de Conquista</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Aulas complementares de sintaxe ao vivo (mensal)</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <button
                  id="btn-buy-monthly"
                  onClick={() => triggerCheckoutFlow('Hacker de Elite (Mensal)')}
                  className="w-full font-mono uppercase bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-cyan-400 py-3.5 rounded-xl text-center text-xs tracking-wider transition-colors cursor-pointer"
                >
                  Contratar Assinatura Mensal
                </button>
              </div>
            </div>

            {/* Price Option B: Ultimate Lifetime (Maximum value and converting focus) */}
            <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl p-6 md:p-8 flex flex-col justify-between relative shadow-[0_0_20px_rgba(245,158,11,0.08)]">
              
              {/* Highlight ribbon */}
              <div className="absolute top-4 right-4 bg-amber-400 text-black font-black text-[9px] tracking-widest px-2.5 py-0.5 rounded-full uppercase select-none animate-pulse">
                MELHOR OPÇÃO VIVAL
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-mono tracking-wider text-amber-400 uppercase block mb-1">
                    Acesso Vitalício &amp; Mentoria Completa
                  </span>
                  <h4 className="text-lg font-black text-zinc-100 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <span>LENDA DO GRID</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Pagamento único para acesso para sempre ao curso, mentoria ativa com engenheiros seniores do clã, projetos de portfólio reais e atualizações gratuitas eternamente.
                  </p>
                </div>

                <div className="py-4 border-y border-zinc-900 bg-amber-950/5 px-3 rounded-lg font-mono">
                  {discountPct > 0 ? (
                    <div className="space-y-1">
                      <span className="text-xs text-zinc-500 line-through block">{lifetimePrice.base} pagamento único</span>
                      <div className="text-2xl md:text-3xl font-black text-amber-400 flex items-baseline gap-1.5">
                        <span>{lifetimePrice.desc}</span>
                        <span className="text-[11px] text-zinc-400 font-normal">à vista</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 mt-0.5 block font-bold">
                        ou em 12x de <strong className="text-amber-400 text-sm font-black">{lifetimePrice.installment}</strong> sem juros
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-2xl md:text-3xl font-black text-amber-400 flex items-baseline gap-1.5">
                        <span>{lifetimePrice.base}</span>
                        <span className="text-[11px] text-zinc-400 font-normal">à vista</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 mt-0.5 block font-bold">
                        ou em 12x de <strong className="text-amber-400 text-sm font-black">R$ 83.08</strong> sem juros
                      </span>
                    </div>
                  )}
                </div>

                {/* Total lists */}
                <ul className="space-y-3 font-mono text-xs text-zinc-400">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>Acesso vitalício a todos os 4 módulos estruturados de jogos</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>Sincronização com o portal exclusivo de vagas de parceiros</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>Controle de Code Review direto com Mentores Seniores</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>Acesso retro-compatível a todos os mini-jogos extras futuros</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-200 font-extrabold">Ficha Técnica: Certificado registrado criptografado</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <button
                  id="btn-buy-lifetime"
                  onClick={() => triggerCheckoutFlow('Lenda do Grid (Vitalício)')}
                  className="w-full font-mono uppercase bg-amber-400 hover:bg-amber-300 text-black font-extrabold py-3.5 rounded-xl text-center text-xs tracking-wider transition-all hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
                >
                  Garantir Acesso Vitalício Lenda
                </button>
              </div>
            </div>

          </div>

          {/* Secure Transaction badge details */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-[10px] text-zinc-550 font-mono select-none pt-4">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-zinc-650" />
              Ambiente Criptografado SSL
            </span>
            <span className="flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-zinc-650" />
              Liberação Imediata nos Servidores
            </span>
            <span className="flex items-center gap-1.5">
              <FaqIcon className="w-3.5 h-3.5 text-zinc-650" />
              Garantia Zero Logs Reembolso 30 Dias
            </span>
          </div>

        </section>

        {/* SECTION 06: PRE-REGISTRATION COMPONENT */}
        <section className="max-w-7xl mx-auto">
          <Suspense fallback={<TerminalLoader />}>
            <PreRegistration 
              unlockedCoupon={activeCoupon || undefined}
              discountPct={discountPct || undefined}
              hackerHandle={hackerHandle}
              selectedClass={selectedClass?.name}
            />
          </Suspense>
        </section>

        {/* SECTION 07: ACCORDION CHRONICLES FAQ */}
        <section className="max-w-4xl mx-auto space-y-8 select-none">
          
          <div className="text-center space-y-2">
            <h3 className="text-xl md:text-3xl font-extrabold text-zinc-100 uppercase tracking-widest font-mono">
              Base de Perguntas Decodificadas
            </h3>
            <p className="text-xs text-zinc-500 font-mono">
              Dúvidas frequentes do nosso setor de comunicações
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="bg-zinc-950/80 border border-zinc-900 rounded-xl overflow-hidden">
                  <button
                    id={`faq-btn-${index}`}
                    onClick={() => {
                      handleGenericClick();
                      setActiveFaq(isOpen ? null : index);
                    }}
                    className="w-full flex items-center justify-between text-left p-5 font-mono cursor-pointer"
                  >
                    <span className="text-xs md:text-sm font-black text-zinc-200 uppercase leading-snug tracking-wide flex items-center gap-3">
                      <HelpCircle className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
                      {item.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <div className={`transition-all duration-300 ${isOpen ? 'max-h-[300px] border-t border-zinc-900 p-5 bg-black/40' : 'max-h-0 overflow-hidden'}`}>
                    <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-mono">
                      {item.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-12 px-6 mt-16 text-zinc-500 selection:bg-zinc-800 text-xs font-mono relative select-none">
        
        {/* Subtle decorative circuit path dots */}
        <div className="absolute top-0 right-12 w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400/45 to-transparent" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          <div className="col-span-12 md:col-span-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#ffffff] tracking-wider text-sm">CYBERCODE_ACADEMY</span>
              <span className="text-[9px] bg-zinc-900 text-cyan-400 font-bold border border-cyan-400/20 px-1.5 py-0.2 rounded leading-none">
                REV_4.6
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Codificando o futuro da educação tech através de RPGs, simulações interativas e soluções em tempo de compilação real.
            </p>
          </div>

          <div className="col-span-12 md:col-span-4 space-y-2">
            <span className="text-xs font-bold text-zinc-450 uppercase block">Canais Protegidos</span>
            <div className="space-y-1 text-zinc-500 text-[11px]">
              <div>GRID CHAT: <span className="text-zinc-400">@cybercode_clã</span></div>
              <div>MAIN NET: <span className="text-zinc-400">contato@cybercodeacademy.com.br</span></div>
              <div>SECURE ENVELOPE: <span className="text-zinc-400">Rua da Cripta Binary_Code, District 07</span></div>
            </div>
          </div>

          {/* ASCII decorative retro hack layout banner */}
          <div className="col-span-12 md:col-span-4 text-left md:text-right font-mono text-[9px] text-zinc-650 leading-tight select-none">
            <pre className="inline-block whitespace-pre">
{`   _____ _    _ ____  ______ _____ 
  / ____| |  | |  _ \\|  ____|  __ \ 
 | |    | |  | | |_) | |__  | |__) |
 | |    | |  | |  _ <|  __| |  _  / 
 | |____| |__| | |_) | |____| | \\ \\ 
  \\_____|\\____/|____/|______|_|  \\_\\`}
            </pre>
            <div className="mt-2 text-[10px]">
              &copy; {new Date().getFullYear()} CyberCode Academy S.A. Todos os direitos reservados.
            </div>
          </div>

        </div>
      </footer>

      {/* CHECKOUT FLOW SIMULATOR ACCORDING TO GUIDELINES (Zero mock-data, full interactive conversions flow) */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-cyan-500/30 rounded-2xl p-6 max-w-md w-full font-mono relative shadow-[0_0_35px_rgba(6,182,212,0.15)]">
            
            {/* Header popup block */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3.5 mb-4 text-xs select-none">
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                CHECKOUT DE VAGA: SECURE_LINK
              </span>
              <button
                id="btn-close-checkout"
                onClick={() => {
                  handleGenericClick();
                  setShowCheckoutModal(false);
                }}
                className="text-zinc-500 hover:text-zinc-300 font-bold uppercase cursor-pointer"
              >
                [X] FECHAR
              </button>
            </div>

            {checkoutStep === 1 ? (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-zinc-550 block uppercase">PLAN ASSIGNMENT</span>
                  <div className="bg-zinc-900 px-3 py-2.5 rounded border border-zinc-900 font-bold text-zinc-200">
                    {selectedPlanName}
                  </div>
                </div>

                <div className="p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-cyan-400 block uppercase">Ativação de Cupom Node</span>
                  
                  {discountPct > 0 ? (
                    <div className="text-xs text-zinc-300">
                      Cupom <strong className="text-emerald-400">CYBER_PUZZLE_20</strong> aplicado com êxito! Você economizou <strong className="text-emerald-400">R$ {selectedPlanName.includes('Vitalício') ? '199,40' : '19,40'}</strong> neste pagamento.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-zinc-400">Possui um cupom de descriptografia do simulador de hack? Insira abaixo:</p>
                      <div className="flex gap-2">
                        <input
                          id="coupon-manual-input"
                          type="text"
                          placeholder="EX: CYBER_PUZZLE_20"
                          defaultValue={activeCoupon || ''}
                          className="bg-black/80 border border-zinc-800 text-cyan-400 text-xs px-3 py-2 rounded focus:border-cyan-400 focus:outline-none flex-1 font-mono"
                          onBlur={(e) => {
                            if (e.target.value.trim() === 'CYBER_PUZZLE_20') {
                              handleCouponAwarded('CYBER_PUZZLE_20', 20);
                            }
                          }}
                        />
                        <button
                          id="btn-apply-manual-coupon"
                          onClick={() => {
                            const val = (document.getElementById('coupon-manual-input') as HTMLInputElement)?.value;
                            if (val?.trim() === 'CYBER_PUZZLE_20') {
                              handleCouponAwarded('CYBER_PUZZLE_20', 20);
                              handleGenericClick('granted');
                            } else {
                              handleGenericClick('glitch');
                            }
                          }}
                          className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:text-cyan-400 px-3 rounded text-xs py-2 cursor-pointer transition-colors font-mono uppercase"
                        >
                          Ativar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Secure warning info */}
                <div className="bg-zinc-900/40 p-3.5 rounded text-xs text-zinc-550 border border-zinc-900 space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold text-zinc-450">{selectedPlanName.includes('Vitalício') ? 'R$ 997,00' : 'R$ 97,00'}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Desconto Puzzle (-20%):</span>
                    <span>-{selectedPlanName.includes('Vitalício') ? 'R$ 199,40' : 'R$ 19,40'}</span>
                  </div>
                  <div className="flex justify-between text-zinc-200 border-t border-zinc-900 pt-1.5 mt-1 font-bold">
                    <span>Total a Pagar:</span>
                    <span className="text-amber-400 font-extrabold">{selectedPlanName.includes('Vitalício') ? lifetimePrice.desc : monthlyPrice.desc}</span>
                  </div>
                </div>

                <button
                  id="btn-confirm-checkout-step-1"
                  onClick={() => {
                    handleGenericClick('success');
                    setCheckoutStep(2);
                  }}
                  className="w-full flex items-center justify-center gap-2 font-mono uppercase bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold py-3.5 rounded-xl text-xs tracking-wider transition-colors cursor-pointer"
                >
                  <span>Proceder para Gateway Seguro</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Simulated Payment processing */
              <div className="py-6 text-center space-y-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>

                <div className="space-y-1.5 select-none">
                  <h4 className="text-lg font-black text-emerald-400 uppercase tracking-widest leading-none">
                    MATRÍCULA SIMULADA COM EXITO!
                  </h4>
                  <p className="text-xs text-zinc-400 font-mono">
                    Node de faturamento procedeu seu link securitizado.
                  </p>
                </div>

                <div className="p-4 bg-zinc-900 rounded-xl space-y-2 text-xs font-mono text-left text-zinc-400 border border-zinc-900">
                  <div>USUÁRIO: <strong className="text-zinc-200">@{hackerHandle || 'GUEST'}</strong></div>
                  <div>PLATAFORMA PLANO: <strong className="text-zinc-200">{selectedPlanName}</strong></div>
                  <div>SISTEMA DE MENTORIA: <strong className="text-emerald-400">CONECTADO</strong></div>
                  <div>ACESSO: <strong className="text-cyan-400">LIBERADO AUTOMÁTICO</strong></div>
                  <div className="pt-2 border-t border-zinc-950 font-bold flex justify-between">
                    <span>VALOR PROCESSADO:</span>
                    <span className="text-amber-400">{selectedPlanName.includes('Vitalício') ? lifetimePrice.desc : monthlyPrice.desc}</span>
                  </div>
                </div>

                <button
                  id="btn-complete-checkout-modal"
                  onClick={() => setShowCheckoutModal(false)}
                  className="w-full font-mono uppercase bg-zinc-100 hover:bg-white text-black font-extrabold py-3.5 rounded-xl text-xs tracking-wider transition-colors cursor-pointer"
                >
                  Acessar Minha Area do Clã
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
