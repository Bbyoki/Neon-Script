/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Terminal, ShieldAlert, Cpu, CheckCircle, AlertTriangle, RefreshCw, Copy, ExternalLink, Key, Sparkles } from 'lucide-react';
import { cyberpunkSFX } from '../utils/audio';

interface Puzzle {
  id: number;
  title: string;
  subTitle: string;
  problem: string;
  codeTemplate: string;
  options: { text: string; code: string; soundHint?: string }[];
  correctIndex: number;
  explanation: string;
}

const PUZZLES: Puzzle[] = [
  {
    id: 1,
    title: 'PATCH 01: LOOP DE EVASÃO',
    subTitle: 'Segmentador de varredura presa',
    problem: 'O robô de rastreamento do Firewall inimigo está preso em um loop infinito. Corrija o algoritmo para executar a função de bypass exatamente 3 vezes e terminar com sucesso.',
    codeTemplate: `// Corrija o loop para rodar 3 vezes
for (let i = 0; <MISSING>; i++) {
  bypassFirewallNode(i);
}`,
    options: [
      { text: 'i < 3', code: 'i < 3' },
      { text: 'i <= 3', code: 'i <= 3' },
      { text: 'i === 3', code: 'i === 3' },
      { text: 'i > 3', code: 'i > 3' }
    ],
    correctIndex: 0,
    explanation: 'Excelente! Usando i < 3 as execuções ocorrem para i = 0, i = 1 e i = 2, totalizando exatamente 3 iterações de varredura controlada.'
  },
  {
    id: 2,
    title: 'PATCH 02: INJEÇÃO CONDICIONAL',
    subTitle: 'Bypass de Trava Biométrica',
    problem: 'Temos um payload descriptografador. Precisamos checar se o token recebido pelo sistema de segurança é idêntico ao protocolo "SYS_DECRYPT_CORE". Complete a expressão condicional.',
    codeTemplate: `function decryptSystem(token) {
  if (token <MISSING> "SYS_DECRYPT_CORE") {
    grantSystemAccess();
    return true;
  }
  return false;
}`,
    options: [
      { text: '= (Atribuição direta)', code: '=' },
      { text: '!== (Desigualdade estrita)', code: '!==' },
      { text: '=== (Igualdade estrita)', code: '===' },
      { text: '|| (Operador OU)', code: '||' }
    ],
    correctIndex: 2,
    explanation: 'Correto! Em JavaScript/TypeScript, usamos === para avaliar a igualdade estrita de tipo e valor para conferência de autenticação criptografada.'
  },
  {
    id: 3,
    title: 'PATCH 03: MANIPULAÇÃO ASSÍNCRONA',
    subTitle: 'Controle de Servidor Remoto',
    problem: 'Para carregar as credenciais hacker de forma assíncrona sem travar a interface visual do seu Cyber-Deck, qual palavra-chave deve ser utilizada antes de aguardar o processamento da promise?',
    codeTemplate: `async function hijackMainframe() {
  const securityToken = <MISSING> fetchSecureToken();
  injectExploit(securityToken);
}`,
    options: [
      { text: 'defer (Diferir carregamento)', code: 'defer' },
      { text: 'await (Aguardar Promise)', code: 'await' },
      { text: 'timeout (Tempo esgotado)', code: 'timeout' },
      { text: 'promise.then()', code: 'then' }
    ],
    correctIndex: 1,
    explanation: 'Perfeito! A palavra-chave await interrompe temporariamente a execução da função async até que a Promise de rede e do token termine sua decodificação.'
  }
];

interface HackSimulatorProps {
  onAwardCoupon: (couponCode: string, discountPct: number) => void;
  selectedHackerClass?: string;
  hackerHandle?: string;
}

export default function HackSimulator({ onAwardCoupon, selectedHackerClass, hackerHandle }: HackSimulatorProps) {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'Initializing tactical shell...',
    'Connecting proxy nodes on port 3000...',
    'WARNING: Secure Firewall proxy active (Aegis-v4)',
    'Ready for injection sequence (Módulo de Teste de Invasão).'
  ]);
  const [successCount, setSuccessCount] = useState(0);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [couponUnlocked, setCouponUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);

  const activePuzzle = PUZZLES[currentPuzzleIndex];

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    cyberpunkSFX.playTick(1000 + idx * 80, 0.05);
    setSelectedOption(idx);
  };

  const executePatch = () => {
    if (selectedOption === null || isAnswered) return;

    setIsAnswered(true);
    const isCorrect = selectedOption === activePuzzle.correctIndex;

    if (isCorrect) {
      cyberpunkSFX.playSuccess();
      setSuccessCount((prev) => prev + 1);
      setTerminalLogs((prev) => [
        ...prev,
        `EXECUTANDO DEPATCH: ${activePuzzle.options[selectedOption].code}`,
        `[OK] ASSINATURA VALIDADA DE NO: DESCRIPTOGRAFANDO...`,
        `STATUS: SUCESSO. CONEXÃO ESTÁVEL.`
      ]);
    } else {
      cyberpunkSFX.playGlitch();
      setTerminalLogs((prev) => [
        ...prev,
        `EXECUTANDO DEPATCH: ${activePuzzle.options[selectedOption].code}`,
        `[ERR] SINTAXE DE SEGURANÇA VIOLADA. REJEITADO PELO FIREWALL.`,
        `STATUS: FALHA DE SINCRETISMO - VERIFICAR LOG DE REDE.`
      ]);
    }
  };

  const nextStep = () => {
    cyberpunkSFX.playTick(1200);
    if (currentPuzzleIndex < PUZZLES.length - 1) {
      setCurrentPuzzleIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTerminalLogs((prev) => [
        ...prev,
        `Iniciando ${PUZZLES[currentPuzzleIndex + 1].title}...`,
        `Aguardando injeção de parâmetros estruturais.`
      ]);
    } else {
      // Game end metrics
      setIsGameCompleted(true);
      const winRatio = successCount / PUZZLES.length;
      if (winRatio >= 0.6) {
        cyberpunkSFX.playAccessGranted();
        setCouponUnlocked(true);
        onAwardCoupon('CYBER_PUZZLE_20', 20); // 20% discount
      }
    }
  };

  const restartSimulator = () => {
    cyberpunkSFX.playSuccess();
    setCurrentPuzzleIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setSuccessCount(0);
    setIsGameCompleted(false);
    setCouponUnlocked(false);
    setCopied(false);
    setTerminalLogs([
      'Resetting simulator network node...',
      'Initializing sterile bypass sandbox...',
      'Ready to re-inject code assets.'
    ]);
  };

  const copyCoupon = () => {
    cyberpunkSFX.playAccessGranted();
    navigator.clipboard.writeText('CYBER_PUZZLE_20');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div id="hacker-terminal" className="relative bg-zinc-950 border border-cyan-500/30 rounded-2xl md:p-8 p-4 shadow-[0_0_30px_rgba(6,182,212,0.1)] overflow-hidden">
      
      {/* Visual CRT Scanning Line effect */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-cyan-400/10 pointer-events-none animate-scan-line" />
      
      {/* Upper Terminal Window Bar */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <div className="font-mono text-sm tracking-wider text-zinc-100 flex items-center gap-2">
            <span>mainframe_terminal_bypass.sh</span>
            <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded font-bold uppercase animate-pulse">
              LIVE CONSOLE
            </span>
          </div>
        </div>
        
        {/* Decorative mini buttons */}
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        </div>
      </div>

      {!isGameCompleted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Puzzle detail and editor */}
          <div className="col-span-12 lg:col-span-8 flex flex-col justify-between space-y-4">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-500 uppercase tracking-widest bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded">
                  Puzzle {activePuzzle.id} / {PUZZLES.length}
                </span>
                <span className="text-xs font-mono text-zinc-500">
                  [{activePuzzle.subTitle}]
                </span>
              </div>
              <h4 className="text-lg md:text-xl font-black font-mono text-zinc-100 uppercase tracking-widest leading-tight">
                {activePuzzle.title}
              </h4>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
                {activePuzzle.problem}
              </p>
            </div>

            {/* Simulated IDE Editor Screen */}
            <div className="bg-black/90 border border-zinc-900 rounded-xl p-5 font-mono text-sm leading-relaxed overflow-x-auto relative group">
              <div className="absolute top-3 right-3 text-[10px] text-zinc-600 font-mono select-none">
                ES6 COMPILER
              </div>

              <div className="flex gap-4">
                {/* Simulated line numbers */}
                <div className="text-zinc-700 select-none text-right pr-3 border-r border-zinc-900/60 flex flex-col">
                  <span>01</span>
                  <span>02</span>
                  <span>03</span>
                  <span>04</span>
                  <span>05</span>
                </div>

                {/* Simulated editable code block */}
                <div className="flex-1 text-zinc-300">
                  {activePuzzle.codeTemplate.split('\n').map((line, i) => {
                    if (line.includes('<MISSING>')) {
                      const before = line.split('<MISSING>')[0];
                      const after = line.split('<MISSING>')[1];
                      const optCode = selectedOption !== null ? activePuzzle.options[selectedOption].code : '_______';
                      const optColor = isAnswered 
                        ? (selectedOption === activePuzzle.correctIndex ? 'text-emerald-400 font-bold bg-emerald-900/10' : 'text-red-400 font-bold bg-red-900/10')
                        : 'text-cyan-400 font-black animate-pulse';

                      return (
                        <div key={i} className="py-0.5">
                          <span>{before}</span>
                          <span className={`${optColor} border-b-2 border-dashed border-current px-2 py-0.2 mx-1 rounded`}>
                            {optCode}
                          </span>
                          <span>{after}</span>
                        </div>
                      );
                    }
                    return (
                      <div key={i} className="text-zinc-400 py-0.5">
                        {line}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Interactive Options Choice HUD */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {activePuzzle.options.map((opt, idx) => {
                const isThisSelected = selectedOption === idx;
                const optLetter = ['A', 'B', 'C', 'D'][idx];

                let optionStyles = 'border-zinc-800 bg-zinc-900/20 text-zinc-300 hover:bg-zinc-900/50 hover:text-zinc-100';
                if (isThisSelected) {
                  optionStyles = 'border-cyan-500 bg-cyan-950/20 text-cyan-400 ring-1 ring-cyan-500/20';
                }
                if (isAnswered) {
                  if (idx === activePuzzle.correctIndex) {
                    optionStyles = 'border-emerald-500 bg-emerald-950/20 text-emerald-400 cursor-not-allowed';
                  } else if (isThisSelected && idx !== activePuzzle.correctIndex) {
                    optionStyles = 'border-red-500 bg-red-950/20 text-red-400 cursor-not-allowed';
                  } else {
                    optionStyles = 'border-zinc-900 bg-zinc-900/10 text-zinc-650 cursor-not-allowed pointer-events-none';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleOptionClick(idx)}
                    className={`flex items-center text-left p-3 border rounded-xl font-mono text-sm transition-all cursor-pointer ${optionStyles}`}
                  >
                    <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-xs mr-3 shrink-0 ${
                      isThisSelected 
                        ? 'bg-cyan-500 text-black' 
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {optLetter}
                    </span>
                    <div>
                      <span className="font-extrabold block text-xs">{opt.text}</span>
                      <span className="text-[11px] opacity-70 font-mono mt-0.5 block">{opt.code}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Action Buttons inside Puzzle Deck */}
            <div className="flex items-center gap-4 pt-3">
              {!isAnswered ? (
                <button
                  id="btn-inject-patch"
                  disabled={selectedOption === null}
                  onClick={executePatch}
                  className={`flex-1 font-mono uppercase font-black text-xs tracking-widest text-center py-3.5 rounded-xl transition-all cursor-pointer border ${
                    selectedOption !== null
                      ? 'bg-cyan-400 text-black border-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] scale-[1.01]'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-650 cursor-not-allowed'
                  }`}
                >
                  INJETAR PATCH DE CORREÇÃO
                </button>
              ) : (
                <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-zinc-900/30 border border-zinc-900 p-4 rounded-xl">
                  {/* Correct vs Wrong status flag */}
                  <div className="flex items-center gap-2shrink-0">
                    {selectedOption === activePuzzle.correctIndex ? (
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono text-sm uppercase">
                        <CheckCircle className="w-4 h-4" />
                        Acesso Liberado!
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-red-400 font-bold font-mono text-sm uppercase">
                        <AlertTriangle className="w-4 h-4" />
                        Invasão Detectada!
                      </div>
                    )}
                  </div>
                  
                  {/* Detailed logic solution description */}
                  <p className="text-xs text-zinc-400 flex-1 leading-relaxed">
                    {activePuzzle.explanation}
                  </p>

                  <button
                    id="btn-next-level"
                    onClick={nextStep}
                    className="shrink-0 bg-zinc-100 text-black font-mono uppercase font-black text-xs tracking-wider px-5 py-2.5 rounded-lg hover:bg-white transition-colors cursor-pointer"
                  >
                    {currentPuzzleIndex < PUZZLES.length - 1 ? 'Próximo Script' : 'Finalizar Invasão'}
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Simulated Terminal Debug Logs Console */}
          <div className="col-span-12 lg:col-span-4 flex flex-col bg-black/80 border border-zinc-900 rounded-xl p-4 h-[350px] lg:h-auto overflow-hidden">
            <span className="text-[10px] font-mono text-zinc-500 uppercase pb-2 mb-2 border-b border-zinc-900 flex items-center justify-between">
              <span>DEBUG LOG MONITOR</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </span>
            
            {/* Scroller list for active terminals */}
            <div className="flex-1 space-y-2.5 font-mono text-xs overflow-y-auto pr-1 text-zinc-400 select-none">
              {terminalLogs.map((log, index) => {
                let colorClass = 'text-zinc-500';
                if (log.startsWith('[OK]') || log.includes('SUCESSO')) {
                  colorClass = 'text-emerald-400';
                } else if (log.startsWith('[ERR]') || log.includes('FALHA') || log.includes('WARNING')) {
                  colorClass = 'text-amber-500';
                } else if (log.startsWith('STATUS') || log.includes('Ready') || log.includes('Iniciando')) {
                  colorClass = 'text-cyan-400';
                }

                return (
                  <div key={index} className={`flex items-start gap-1 py-0.5 leading-snug border-b border-zinc-950/60 ${colorClass}`}>
                    <span className="text-zinc-700 shrink-0 select-none">&gt;</span>
                    <span className="break-all">{log}</span>
                  </div>
                );
              })}
            </div>

            {/* Floating class HUD variables indicators */}
            <div className="mt-4 pt-3 border-t border-zinc-900 grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-500">
              <div>
                NODES DE SUCESSO: <span className="text-emerald-400 font-bold">{successCount}/{PUZZLES.length}</span>
              </div>
              <div>
                OPERATOR: <span className="text-cyan-400 font-bold truncate max-w-[80px] inline-block align-bottom">{hackerHandle || 'GUEST'}</span>
              </div>
              <div>
                BUFFER STATE: <span className="text-zinc-400 font-bold">READY</span>
              </div>
              <div>
                CLASS: <span className="text-purple-400 font-bold uppercase">{selectedHackerClass || 'NETRUNNER'}</span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Entire simulation summary / reward claims page */
        <div className="py-8 text-center max-w-2xl mx-auto flex flex-col items-center space-y-6">
          
          {couponUnlocked ? (
            <>
              {/* Massive Award Success Grid */}
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-400 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)] animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-black font-mono text-cyan-400 uppercase tracking-widest">
                  DECODIFICAÇÃO BEM SUCEDIDA
                </h3>
                <p className="text-sm text-zinc-400 font-mono">
                  Você resolveu {successCount} de {PUZZLES.length} vulnerabilidades do terminal de simulação acadêmica!
                </p>
                <div className="inline-block mt-1 py-1 px-3 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400">
                  ID CONEXÃO: <span className="text-cyan-400 font-bold">CYBER-NODE-{Math.floor(1000 + Math.random() * 9000)}</span>
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-cyan-400/30 p-6 rounded-2xl w-full max-w-md relative overflow-hidden backdrop-blur-md">
                {/* Neon coupon card detail */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-cyan-500/5 rounded-full pointer-events-none blur-xl" />
                
                <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-widest mb-1">
                  CÓDIGO DE ACESSO ENCRIPTADO (DESCONTO 20%)
                </span>
                
                <div className="flex items-center justify-between bg-black/90 border border-zinc-800 rounded-lg px-4 py-3.5 tracking-wider font-mono text-lg font-bold text-cyan-400 m-2">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-cyan-500" />
                    <span>CYBER_PUZZLE_20</span>
                  </div>
                  <button
                    id="btn-copy-coupon-terminal"
                    onClick={copyCoupon}
                    className="p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-cyan-400 hover:border-cyan-400/40 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <span className="text-xs text-emerald-400 uppercase px-1">Copiado!</span>
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-zinc-500 mt-3 font-mono leading-relaxed px-4">
                  Este token foi carregado dinamicamente no seu perfil. Um desconto de <span className="text-cyan-400 font-bold">20% está agora ativo</span> nos planos de matrícula do curso ao final da página!
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Failed Puzzle screen with refresh opportunity */}
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/40 flex items-center justify-center text-red-500">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black font-mono text-zinc-200 uppercase tracking-widest">
                  DEEP SCAN FALHOU ({successCount}/{PUZZLES.length})
                </h3>
                <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
                  Quase lá! O sistema de segurança cortou as comunicações antes que a descriptografia final pudesse ser completada. Reinscreva drivers auxiliares e tente de novo para decodificar o token.
                </p>
              </div>
            </>
          )}

          {/* Bottom triggers to clear state/restart */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              id="btn-restart-simulator"
              onClick={restartSimulator}
              className="flex items-center gap-2 font-mono uppercase bg-zinc-900 border border-zinc-800 hover:border-cyan-400/40 text-zinc-300 hover:text-cyan-400 px-6 py-2.5 rounded-lg text-xs tracking-wider transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Resetar Conexão Terminal
            </button>
            <a
              href="#pricing-module"
              className="font-mono uppercase bg-cyan-400 text-black font-extrabold px-6 py-2.5 rounded-lg text-xs tracking-wider hover:bg-cyan-300 transition-colors cursor-pointer"
            >
              Matricular-se Comum
            </a>
          </div>

        </div>
      )}

    </div>
  );
}
