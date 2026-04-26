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
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ✅ القيم دي مأخوذة من Firebase Console مباشرة.
//    أي fallback هنا متطابق مع الـ console.
const firebaseConfig = {
  apiKey: "AIzaSyCS0Gu78lBt_sRT268kCznlWipCW0q-oio",
  authDomain: "science-benha-2026.firebaseapp.com",
  projectId: "science-benha-2026",
  storageBucket: "science-benha-2026.firebasestorage.app",
  messagingSenderId: "725961025715",
  appId: "1:725961025715:web:bb725210a31406cc8a68c6",
  measurementId: "G-HQQVLEXR04"
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export { app };

// ========== هيلبر موحَّد لحالة اليوزر ==========
//   ده يبقى الـ source of truth لأي صفحة محتاجة تتأكد من اليوزر.
export type UserStatus = 'approved' | 'pending' | 'unknown';

export const getUserStatusByEmail = async (
  email: string
): Promise<{ status: UserStatus; data?: any }> => {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) return { status: 'unknown' };

  // 1) approved (في graduates)
  const gq = query(
    collection(db, 'graduates'),
    where('email', '==', cleanEmail)
  );
  const gSnap = await getDocs(gq);
  if (!gSnap.empty)
    return { status: 'approved', data: gSnap.docs[0].data() };

  // 2) pending
  const pq = query(
    collection(db, 'pending_requests'),
    where('email', '==', cleanEmail)
  );
  const pSnap = await getDocs(pq);
  if (!pSnap.empty) return { status: 'pending', data: pSnap.docs[0].data() };

  return { status: 'unknown' };
};

// ========== دوال الرسائل ==========
export const addMessage = async (message: string, name?: string) =>
  addDoc(collection(db, 'messages'), {
    message,
    name: name || 'مجهول',
    isAnonymous: !name,
    timestamp: serverTimestamp(),
  });

export const getMessages = async () => {
  const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const deleteMessage = async (id: string) =>
  deleteDoc(doc(db, 'messages', id));

export const addJoinRequest = async (data: any) =>
  addDoc(collection(db, 'join_requests'), {
    ...data,
    status: 'pending',
    timestamp: serverTimestamp(),
  });

export const getAnonymousMessages = async () => {
  const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((msg: any) => msg.isAnonymous === true);
};

// ========== Admin: طلبات الانضمام ==========
export const getJoinRequests = async () => {
  const q = query(collection(db, 'join_requests'), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const approveRequest = async (requestId: string, requestData: any) => {
  const email = (requestData.email || '').toString().trim().toLowerCase();
  if (!email) throw new Error('الإيميل مطلوب علشان يعرف يعمل login');

  await updateDoc(doc(db, 'join_requests', requestId), {
    status: 'approved',
    approvedAt: serverTimestamp(),
  });
  await addDoc(collection(db, 'graduates'), {
    name: requestData.fullName || requestData.name,
    section: requestData.section,
    email, // ✅ مهم
    status: 'approved',
    approvedAt: serverTimestamp(),
  });
};

export const rejectRequest = async (requestId: string) =>
  updateDoc(doc(db, 'join_requests', requestId), {
    status: 'rejected',
    rejectedAt: serverTimestamp(),
  });

export const getGraduates = async () => {
  const q = query(collection(db, 'graduates'), orderBy('approvedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getPendingRequests = async () => {
  const q = query(
    collection(db, 'join_requests'),
    where('status', '==', 'pending'),
    orderBy('timestamp', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// ========== دوال الأسماء البسيطة ==========
export const addName = async (name: string, section?: string, email?: string) =>
  addDoc(collection(db, 'graduates'), {
    name,
    section: section || 'غير محدد',
    email: email?.toLowerCase() || '',
    status: 'approved',
    timestamp: serverTimestamp(),
  });

export const getNames = async () => {
  const q = query(collection(db, 'graduates'), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
