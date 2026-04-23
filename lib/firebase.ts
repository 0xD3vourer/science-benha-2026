import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';

// حط الـ Config بتاعك هنا
const firebaseConfig = {
apiKey: "AIzaSyCS0Gu78lBt_sRT268kCznlWipCW0q-oio",
authDomain: "[science-benha-2026.firebaseapp.com](http://science-benha-2026.firebaseapp.com/)",
projectId: "science-benha-2026",
storageBucket: "science-benha-2026.firebasestorage.app",
messagingSenderId: "725961025715",
appId: "1:725961025715:web:bb725210a31406cc8a68c6",
measurementId: "G-HQQVLEXR04"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// دوال مساعدة للتعامل مع قاعدة البيانات

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