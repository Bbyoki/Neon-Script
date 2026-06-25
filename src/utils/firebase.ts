import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const isConfigured = firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey !== 'PLACEHOLDER_KEY_NOT_CONFIGURED';

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface LeadData {
  name: string;
  phone: string;
  email: string;
  hackerHandle: string;
  selectedClass: string;
  unlockedCoupon?: string;
  discountPct?: number;
  registeredMemberId: string;
}

export async function saveLead(leadData: LeadData): Promise<string> {
  if (!isConfigured) {
    throw new Error('CONFIG_NOT_READY: Firebase is not configured yet. Please complete setup in the AI Studio Firebase Configuration panel.');
  }

  // Client-side validations
  if (!leadData.name || leadData.name.trim().length === 0) {
    throw new Error('O Nome é obrigatório.');
  }
  if (!leadData.phone || leadData.phone.trim().length === 0) {
    throw new Error('O Telefone é obrigatório.');
  }
  if (!leadData.email || !leadData.email.includes('@')) {
    throw new Error('E-mail inválido. Por favor, insira um endereço de e-mail correto com @.');
  }
  if (!leadData.hackerHandle || leadData.hackerHandle.trim().length === 0) {
    throw new Error('O Código do Operador (Hacker Handle) é obrigatório.');
  }
  if (!leadData.selectedClass || leadData.selectedClass.trim().length === 0) {
    throw new Error('O Clã / Classe de RPG selecionada é obrigatória.');
  }

  const cleanLeadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const path = `leads/${cleanLeadId}`;

  try {
    const payload: any = {
      name: leadData.name.trim(),
      phone: leadData.phone.trim(),
      email: leadData.email.trim(),
      hackerHandle: leadData.hackerHandle.trim(),
      selectedClass: leadData.selectedClass,
      registeredMemberId: leadData.registeredMemberId,
      createdAt: serverTimestamp(),
    };

    if (leadData.unlockedCoupon) {
      payload.unlockedCoupon = leadData.unlockedCoupon;
    }
    if (leadData.discountPct !== undefined) {
      payload.discountPct = leadData.discountPct;
    }

    const docRef = doc(db, 'leads', cleanLeadId);
    await setDoc(docRef, payload);
    return cleanLeadId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export async function sendLeadToGoogleSheets(leadData: LeadData): Promise<void> {
  const url = 'https://script.google.com/macros/s/AKfycbxLvjARI6ScjgYvKHFO4_GBNVQFa3mEjw0JNJEXJ6t12skiXPdU6JCS5C26w6XPbsTO/exec';
  
  const params = new URLSearchParams();
  
  // Mapeia exatamente as chaves esperadas para corresponderem às colunas da sua planilha (Nome, Email, Telefone)
  params.append('Nome', leadData.name.trim());
  params.append('Email', leadData.email.trim());
  params.append('Telefone', leadData.phone.trim());
  
  // Variações em letras minúsculas adicionais para redundância resiliente
  params.append('nome', leadData.name.trim());
  params.append('email', leadData.email.trim());
  params.append('telefone', leadData.phone.trim());
  
  // Outros dados complementares da inscrição
  params.append('timestamp', new Date().toISOString());
  params.append('hackerHandle', leadData.hackerHandle.trim());
  params.append('selectedClass', leadData.selectedClass);
  params.append('registeredMemberId', leadData.registeredMemberId);
  params.append('unlockedCoupon', leadData.unlockedCoupon || '');
  params.append('discountPct', String(leadData.discountPct || 0));

  try {
    // Realiza uma requisição POST padrão simulando submissão de formulário
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
  } catch (err) {
    console.error('Failed to sync to Google Sheet webhook:', err);
  }
}
