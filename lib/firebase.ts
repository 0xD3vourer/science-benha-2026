import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp, updateDoc, doc, where, getDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC5G6u78lBt_sRT268kCznIWipCW0q-oio",
  authDomain: "science-benha-2026.firebaseapp.com",
  projectId: "science-benha-2026",
  storageBucket: "science-benha-2026.firebasestorage.app",
  messagingSenderId: "725961025715",
  appId: "1:725961025715:web:bb725210a31406cc8a68c6",
  measurementId: "G-HQQVLEXR04"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ========== دوال الرسائل (القديمة) ==========
export const addMessage = async (message: string, name?: string) => {
  return await addDoc(collection(db, 'messages'), {
    message,
    name: name || 'مجهول',
    isAnonymous: !name,
    timestamp: serverTimestamp()
  });
};

export const getMessages = async () => {
  const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAnonymousMessages = async () => {
  const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter((msg: any) => msg.isAnonymous === true);
};

export const deleteMessage = async (id: string) => {
  await deleteDoc(doc(db, 'messages', id));
};

// ========== دوال الأسماء وطلبات الانضمام ==========

// إضافة طلب انضمام جديد
export const addJoinRequest = async (data: {
  fullName: string;
  seatNumber: string;
  section: string;
  phone?: string;
  imageUrl: string;
}) => {
  return await addDoc(collection(db, 'join_requests'), {
    ...data,
    status: 'pending',
    timestamp: serverTimestamp()
  });
};

// جلب كل طلبات الانضمام (لـ Admin)
export const getJoinRequests = async () => {
  const q = query(collection(db, 'join_requests'), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// جلب طلبات الانضمام المعلقة فقط
export const getPendingRequests = async () => {
  const q = query(collection(db, 'join_requests'), where('status', '==', 'pending'), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// الموافقة على طلب (نقل الاسم لـ graduates)
export const approveRequest = async (requestId: string, requestData: any) => {
  // تحديث حالة الطلب
  await updateDoc(doc(db, 'join_requests', requestId), {
    status: 'approved',
    approvedAt: serverTimestamp()
  });
  
  // إضافة الاسم لقائمة الخريجين
  await addDoc(collection(db, 'graduates'), {
    name: requestData.fullName,
    section: requestData.section,
    seatNumber: requestData.seatNumber,
    approvedAt: serverTimestamp()
  });
};

// رفض الطلب
export const rejectRequest = async (requestId: string) => {
  await updateDoc(doc(db, 'join_requests', requestId), {
    status: 'rejected',
    rejectedAt: serverTimestamp()
  });
};

// جلب قائمة الخريجين المعتمدة
export const getGraduates = async () => {
  const q = query(collection(db, 'graduates'), orderBy('approvedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// رفع صورة
export const uploadImage = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

// ========== دوال الأسماء البسيطة (للخلف) ==========
export const addName = async (name: string, section?: string) => {
  return await addDoc(collection(db, 'graduates'), {
    name,
    section: section || 'غير محدد',
    timestamp: serverTimestamp()
  });
};

export const getNames = async () => {
  const q = query(collection(db, 'graduates'), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};