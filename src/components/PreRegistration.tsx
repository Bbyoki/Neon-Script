/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Mail, Shield, CheckCircle, ArrowRight, Award, Flame, User, Terminal, Phone } from 'lucide-react';
import { cyberpunkSFX } from '../utils/audio';
import { saveLead, sendLeadToGoogleSheets } from '../utils/firebase';

interface PreRegistrationProps {
  unlockedCoupon?: string;
  discountPct?: number;
  hackerHandle?: string;
  selectedClass?: string;
}

export default function PreRegistration({ unlockedCoupon, discountPct, hackerHandle, selectedClass }: PreRegistrationProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registeredMemberId, setRegisteredMemberId] = useState('');
  const [slotsLeft, setSlotsLeft] = useState(8);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Dynamic countdown timer of active slots
    const interval = setInterval(() => {
      setSlotsLeft((prev) => {
        if (prev <= 2) return 2;
        return Math.random() > 0.75 ? prev - 1 : prev;
      });
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Pre-validation checking
    if (!name || name.trim().length === 0) {
      cyberpunkSFX.playGlitch();
      setErrorMessage('O Nome completo é obrigatório.');
      return;
    }
    if (!phone || phone.trim().length === 0) {
      cyberpunkSFX.playGlitch();
      setErrorMessage('O número de telefone/WhatsApp é obrigatório.');
      return;
    }
    if (!email || !email.includes('@')) {
      cyberpunkSFX.playGlitch();
      setErrorMessage('E-mail inválido. Por favor, digite um e-mail correto com @.');
      return;
    }

    const generatedId = `CO-${Math.floor(1000 + Math.random() * 9000)}-${(selectedClass || 'NET').substring(0, 3).toUpperCase()}`;
    const leadPayload = {
      name,
      phone,
      email,
      hackerHandle: hackerHandle || 'Guest_Operator',
      selectedClass: selectedClass || 'NETRUNNER',
      unlockedCoupon: unlockedCoupon || undefined,
      discountPct: discountPct || undefined,
      registeredMemberId: generatedId
    };

    setIsSubmitting(true);
    cyberpunkSFX.playSuccess();

    try {
      // 1. Sync payload to user's Google Sheet Webhook (always, non-blocking)
      await sendLeadToGoogleSheets(leadPayload);

      // 2. Sync to Firebase Firestore
      try {
        await saveLead(leadPayload);
      } catch (fbError: any) {
        console.warn('Firebase sync status info:', fbError.message);
        
        // Handle pending settings panel (TOS or configuration) and give helpful message
        if (fbError.message.includes('CONFIG_NOT_READY')) {
          setErrorMessage('Módulo Firebase pendente: Seus dados foram salvos no Google Sheets, mas o Firestore necessita de configuração ativa nos painéis da AI Studio.');
          setIsSubmitting(false);
          return;
        } else {
          throw fbError;
        }
      }

      // If both or Firestore succeeded successfully
      setRegisteredMemberId(generatedId);
      localStorage.setItem('cyber_reg_name', name);
      localStorage.setItem('cyber_reg_phone', phone);
      localStorage.setItem('cyber_reg_email', email);
      localStorage.setItem('cyber_reg_member_id', generatedId);
      setIsSubmitted(true);
    } catch (err: any) {
      cyberpunkSFX.playGlitch();
      const rawMsg = err.message || 'Erro desconhecido ao tentar registrar credenciais.';
      let friendlyMsg = rawMsg;
      
      // Try to extract nested JSON error if it has handleFirestoreError scheme
      try {
        const parsed = JSON.parse(rawMsg);
        if (parsed.error) {
          friendlyMsg = `Erro no Firestore (${parsed.operationType.toUpperCase()}): ${parsed.error}`;
        }
      } catch (_) {
        // use raw
      }

      setErrorMessage(friendlyMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="leads-registration" className="relative bg-zinc-950 border border-fuchsia-500/30 rounded-2xl md:p-8 p-4 shadow-[0_0_30px_rgba(217,70,239,0.1)] overflow-hidden">
      
      {/* Absolute visual scanning grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-2xl pointer-events-none" />

      {!isSubmitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Info Side */}
          <div className="col-span-12 lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-ping" />
              <span className="text-xs font-mono text-fuchsia-400 tracking-widest uppercase font-bold">
                PRÉ-REGISTRO NODE SECURE
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-extrabold text-zinc-100 tracking-tight">
              Garanta sua Vaga e Bloqueie seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-amber-300">Desconto Vitalício</span>
            </h3>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-xl">
              Nossas turmas são formadas de maneira escalonada para que nossa inteligência autômata e mentores deem suporte personalizado às batalhas. Registre seu terminal abaixo e segure sua prioridade.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 py-1.5 px-3 bg-zinc-900 border border-zinc-900 rounded-lg">
                <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                <span>LIMITADO: <strong className="text-zinc-300 font-extrabold">{slotsLeft} vagas no bloco</strong></span>
              </div>

              {unlockedCoupon && (
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 py-1.5 px-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg animate-pulse">
                  <Award className="w-4 h-4" />
                  <span>CUPOM VINCULADO: <strong className="font-extrabold">{unlockedCoupon} (-{discountPct}%)</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Form Capture Side */}
          <div className="col-span-12 lg:col-span-5 bg-black/60 border border-zinc-900 rounded-xl p-5 md:p-6 relative">
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1.5">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Neo da Silva"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-fuchsia-500 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-sm font-mono text-zinc-200 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1.5">
                  Telefone / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: (11) 99999-9999"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-fuchsia-500 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-sm font-mono text-zinc-200 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1.5">
                  Seu E-mail de Contato
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="neo@mainframe.com.br"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-fuchsia-500 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-sm font-mono text-zinc-200 transition-colors"
                  />
                </div>
              </div>

              {/* Display customized selection info inside registry */}
              <div className="bg-zinc-950/80 border border-zinc-900/60 rounded-lg p-3 font-mono text-[11px] text-zinc-500 space-y-1">
                <div className="flex justify-between">
                  <span>OPERATOR HANDLE:</span>
                  <span className="text-cyan-400 font-bold truncate max-w-[120px]">{hackerHandle || 'Guest_Operator'}</span>
                </div>
                <div className="flex justify-between">
                  <span>DISC-CLASS:</span>
                  <span className="text-purple-400 font-bold uppercase">{selectedClass || 'NETRUNNER'}</span>
                </div>
                {unlockedCoupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span>APPLIED TOKEN:</span>
                    <span className="font-bold">VALIDATED (20%)</span>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div id="registration-error-banner" className="bg-red-950/20 border border-red-500/30 text-red-400 p-3 rounded-xl font-mono text-[11px] leading-relaxed flex items-start gap-2">
                  <span className="text-red-500 font-bold shrink-0">[ALERTA]:</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                id="btn-submit-registration"
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 font-mono uppercase bg-fuchsia-500 hover:bg-fuchsia-400 text-black font-extrabold py-3.5 rounded-xl text-center text-xs tracking-wider transition-all hover:shadow-[0_0_15px_rgba(217,70,239,0.3)] cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Sincronizando Nodes...</span>
                ) : (
                  <>
                    <span>Sincronizar Credenciais</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <span className="text-[10px] font-mono text-zinc-650 text-center block mt-3 select-none">
              Respeitamos seus dados. Sem spam. Criptografia ponta-a-ponta.
            </span>

          </div>

        </div>
      ) : (
        /* Dynamic Receipt Screen with custom Hacker profile card */
        <div className="py-6 max-w-2xl mx-auto flex flex-col items-center text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
            <CheckCircle className="w-7 h-7" />
          </div>

          <div className="space-y-1.5 select-none">
            <h3 className="text-2xl font-black font-mono text-emerald-400 uppercase tracking-widest">
              CONEXÃO RE-SINCERADA COM SUCESSO!
            </h3>
            <p className="text-sm text-zinc-400 font-mono">
              Suas credenciais foram gravadas no banco de vagas do Bloco Alpha.
            </p>
          </div>

          {/* Glowing Virtual Badge */}
          <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 p-6 rounded-2xl w-full max-w-sm text-left font-mono relative shadow-2xl">
            {/* Visual chip and scanner overlays */}
            <div className="absolute top-6 right-6 w-8 h-8 opacity-20 border-t border-r border-zinc-400 pointer-events-none" />
            <div className="absolute bottom-6 left-12 w-10 h-10 opacity-[0.03] bg-emerald-400 pointer-events-none blur-xl" />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-bold text-zinc-400">CYBERCODE_ACADEMY_ID</span>
              </div>
              <span className="text-[9px] bg-emerald-950/40 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/20 uppercase font-black tracking-widest leading-none select-none">
                ATV_SECURE
              </span>
            </div>

            <div className="space-y-3.5">
              <div>
                <span className="text-[9px] text-zinc-550 block uppercase">CADASTRO HACKER ID</span>
                <span className="text-sm font-black text-zinc-100 tracking-wider">
                  {registeredMemberId}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[9px] text-zinc-550 block uppercase">NOME COMPLETO</span>
                  <span className="text-zinc-200 truncate block font-bold">{name}</span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-550 block uppercase">CÓDIGO/HANDLE</span>
                  <span className="text-cyan-400 font-bold truncate block">{hackerHandle || 'GUEST_OPERATOR'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-zinc-900/60">
                <div>
                  <span className="text-[9px] text-zinc-550 block uppercase">CONTATO / TEL</span>
                  <span className="text-zinc-300 font-bold block">{phone}</span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-550 block uppercase">CLASSE CYBER</span>
                  <span className="text-purple-400 font-bold uppercase truncate block">{selectedClass || 'NETRUNNER'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-900">
                <span className="text-[9px] text-zinc-550 block uppercase">SINC_EMAIL</span>
                <span className="text-xs text-zinc-300 font-bold break-all block">{email}</span>
              </div>

              {unlockedCoupon && (
                <div className="py-1 px-2.5 bg-emerald-950/20 border border-emerald-500/10 rounded text-[10px] text-emerald-300 flex justify-between font-bold">
                  <span>DESCONTO COUPON:</span>
                  <span>{unlockedCoupon} (-{discountPct}%)</span>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-zinc-500 max-w-md leading-relaxed select-mono">
            Enviamos uma chave de verificação securizada para seu e-mail. Utilize-o nas próximas 48 horas para habilitar as salas de teste da trilha de batalhas gratuitas!
          </p>

        </div>
      )}

    </div>
  );
}
