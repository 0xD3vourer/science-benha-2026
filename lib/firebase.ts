import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  doc,
  where,
  deleteDoc
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCS0Gu78lBt_sRT268kCznlWipCW0q-oio",
  authDomain: "science-benha-2026.firebaseapp.com",
  projectId: "science-benha-2026",
  storageBucket: "science-benha-2026.appspot.com", // ✅ مهم
  messagingSenderId: "725961025715",
  appId: "1:725961025715:web:bb725210a31406cc8a68c6",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export { app };

// ========== دوال الرسائل ==========
export const addMessage = async (message: string, name?: string) => {
  return await addDoc(collection(db, 'messages'), {
    message, name: name || 'مجهول', isAnonymous: !name, timestamp: serverTimestamp()
  });
};
export const getMessages = async () => {
  const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteMessage = async (id: string) => { await deleteDoc(doc(db, 'messages', id)); };
export const addJoinRequest = async (data: any) => {
  return await addDoc(collection(db, 'join_requests'), { ...data, status: 'pending', timestamp: serverTimestamp() });
};

export const getAnonymousMessages = async () => {
  const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter((msg: any) => msg.isAnonymous === true);
};


// جلب كل طلبات الانضمام (لـ Admin)
export const getJoinRequests = async () => {
  const q = query(collection(db, 'join_requests'), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
export const approveRequest = async (requestId: string, requestData: any) => {
  await updateDoc(doc(db, 'join_requests', requestId), { status: 'approved', approvedAt: serverTimestamp() });
  await addDoc(collection(db, 'graduates'), {
    name: requestData.fullName, section: requestData.section,
    email: requestData.email || '', approvedAt: serverTimestamp()
  });
};
export const rejectRequest = async (requestId: string) => {
  await updateDoc(doc(db, 'join_requests', requestId), { status: 'rejected', rejectedAt: serverTimestamp() });
};
export const getGraduates = async () => {
  const q = query(collection(db, 'graduates'), orderBy('approvedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// جلب طلبات الانضمام المعلقة فقط
export const getPendingRequests = async () => {
  const q = query(collection(db, 'join_requests'), where('status', '==', 'pending'), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};



// ========== دوال الأسماء البسيطة (للخلف) ==========
export const addName = async (name: string, section?: string, email?: string) => {
  return await addDoc(collection(db, 'graduates'), {
    name,
    section: section || 'غير محدد',
    email: email || '',
    timestamp: serverTimestamp()
  });
};

export const getNames = async () => {
  const q = query(collection(db, 'graduates'), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

