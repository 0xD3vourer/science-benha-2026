"use client";

import { useState, useEffect } from 'react';
import { collection, onSnapshot, orderBy, query, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

// 👇 الرابط من Apps Script (عدله بالرابط بتاعك)
const SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbxIBSm-6HT_NG-rk58OR9LlGn7JxL54DahapL_3Xj640VpwZK_wACC8vuPxpujJdeWtAg/exec';

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', section: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'graduates'),
      orderBy('approvedAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(data);
      setLoading(false);
    }, (error) => {
      console.error('خطأ:', error);
      toast.error('حدث خطأ في جلب البيانات');
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // دالة للمزامنة مع Google Sheets
  const syncWithGoogleSheets = async (action: string, name: string, section: string) => {
    try {
      await fetch(SHEETS_API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, name, section }),
      });
    } catch (error) {
      console.error("Sync error:", error);
    }
  };

  const handleAdd = async () => {
    if (!newMember.name.trim()) {
      toast.error('الاسم مطلوب');
      return;
    }
    
    const nameParts = newMember.name.trim().split(' ');
    if (nameParts.length < 3) {
      toast.error('الاسم لازم يكون ثلاثي أو رباعي');
      return;
    }
    
    // 🔥 التحقق من التكرار في القائمة الحالية قبل الإضافة
    const existingMember = members.find(
      member => member.name === newMember.name.trim() && member.section === newMember.section
    );
    
    if (existingMember) {
      toast.error(`⚠️ الاسم "${newMember.name}" موجود بالفعل في قسم "${newMember.section || 'غير محدد'}"`);
      return;
    }
    
    setSubmitting(true);
    
    try {
      // 1. إضافة في Firebase
      await addDoc(collection(db, 'graduates'), {
        name: newMember.name.trim(),
        section: newMember.section || 'غير محدد',
        approvedAt: new Date()
      });
      
      // 2. مزامنة مع Google Sheets
      await syncWithGoogleSheets('add', newMember.name.trim(), newMember.section || 'غير محدد');
      
      toast.success(`✅ تمت إضافة ${newMember.name}`);
      setNewMember({ name: '', section: '' });
      setShowAddForm(false);
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'حصل مشكلة، جرب تاني');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (memberId: string, name: string, section: string) => {
    if (!confirm(`متأكد إنك عايز تحذف ${name} (${section})؟`)) return;
    
    setProcessing(memberId);
    try {
      // 1. حذف من Firebase
      await deleteDoc(doc(db, 'graduates', memberId));
      
      // 2. مزامنة مع Google Sheets
      await syncWithGoogleSheets('delete', name, section);
      
      toast.success(`🗑️ تم حذف ${name}`);
    } catch (error: any) {
      console.error(error);
      toast.error('حصل مشكلة في الحذف');
    } finally {
      setProcessing(null);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = filterSection === '' || member.section === filterSection;
    return matchesSearch && matchesSection;
  });

  const sectionsStats = members.reduce((acc: any, member) => {
    const section = member.section || 'غير محدد';
    acc[section] = (acc[section] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return <div className="text-center text-gray-400 py-12"><div className="animate-pulse">جاري التحميل...</div></div>;
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">🎓 أعضاء الدفعة</h2>
          <p className="text-gray-400 text-sm">إجمالي الأعضاء: {members.length}</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-sm font-semibold hover:opacity-90 transition"
        >
          {showAddForm ? '✖ إلغاء' : '+ إضافة عضو جديد'}
        </button>
      </div>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-950/40 to-orange-950/40 rounded-xl p-5 border border-amber-500/20"
        >
          <h3 className="text-lg font-bold text-white mb-4">➕ إضافة عضو جديد</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="الاسم رباعي *"
              value={newMember.name}
              onChange={(e) => setNewMember({...newMember, name: e.target.value})}
              className="w-full bg-white/10 rounded-xl p-3 text-white border border-white/20 focus:border-amber-500 outline-none transition"
            />
            <select
              value={newMember.section}
              onChange={(e) => setNewMember({...newMember, section: e.target.value})}
              className="w-full bg-white/10 rounded-xl p-3 text-white border border-white/20 focus:border-amber-500 outline-none transition"
            >
              <option value="">اختر القسم</option>
              <option value="الحاسب">الحاسب</option>
              <option value="الفيزياء">الفيزياء</option>
              <option value="الكيمياء">الكيمياء</option>
              <option value="الجيولوجيا">الجيولوجيا</option>
              <option value="الرياضيات">الرياضيات</option>
              <option value="النبات">النبات</option>
              <option value="علم الحشرات">علم الحشرات</option>
              <option value="كيمياء حيوية / ميكروبيولوجي">كيمياء حيوية / ميكروبيولوجي</option>                            
              <option value="علوم الحيوان">علوم الحيوان</option>
            </select>
            <button
              onClick={handleAdd}
              disabled={submitting}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 py-2 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {submitting ? 'جاري الإضافة...' : '✅ تأكيد الإضافة'}
            </button>
          </div>
        </motion.div>
      )}

      <div className="flex flex-wrap gap-2">
        {Object.entries(sectionsStats).map(([section, count]) => (
          <span key={section} className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300">
            {section}: {count as number}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="🔍 بحث بالاسم..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] bg-white/10 rounded-xl p-3 text-white border border-white/20 focus:border-amber-500 outline-none transition"
        />
        <select
          value={filterSection}
          onChange={(e) => setFilterSection(e.target.value)}
          className="bg-white/10 rounded-xl p-3 text-white border border-white/20 focus:border-amber-500 outline-none transition"
        >
            <option value="">كل الأقسام</option>
            <option value="الحاسب">الحاسب</option>
            <option value="الفيزياء">الفيزياء</option>
            <option value="الكيمياء">الكيمياء</option>
            <option value="الجيولوجيا">الجيولوجيا</option>
            <option value="الرياضيات">الرياضيات</option>
            <option value="النبات">النبات</option>
            <option value="علم الحشرات">علم الحشرات</option>
            <option value="كيمياء حيوية / ميكروبيولوجي">كيمياء حيوية / ميكروبيولوجي</option>                            
            <option value="علوم الحيوان">علوم الحيوان</option>
        </select>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="text-center text-gray-400 py-12 bg-white/5 rounded-2xl p-8">
          🎉 مفيش أعضاء في القائمة
        </div>
      ) : (
        <div className="space-y-2">
          {filteredMembers.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              className="bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-amber-500/30 transition"
            >
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{member.name}</h3>
                  <div className="flex flex-wrap gap-4 mt-1 text-sm">
                    <p><span className="text-gray-500">القسم:</span> {member.section || 'غير محدد'}</p>
                    <p><span className="text-gray-500">تاريخ الموافقة:</span> {member.approvedAt?.toDate?.().toLocaleDateString('ar-EG') || 'قريباً'}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDelete(member.id, member.name, member.section)}
                  disabled={processing === member.id}
                  className="px-4 py-1.5 bg-red-600/70 hover:bg-red-600 rounded-lg text-sm font-semibold transition disabled:opacity-50"
                >
                  {processing === member.id ? '...' : '🗑️ حذف'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}