"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, updateDoc, doc, addDoc, deleteDoc, where } from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

// ملاحظة: الطلبات المعلقة هنا هتكون من Google Sheets
// بس بما إننا مش بنخزنها في Firebase، هنعمل واجهة لإضافة أعضاء يدوي

export default function PendingPage() {
  const [formData, setFormData] = useState({
    name: '',
    section: ''
  });
  const [loading, setLoading] = useState(false);
  const [existingNames, setExistingNames] = useState<string[]>([]);

  // جلب الأسماء الموجودة لمنع التكرار
  useEffect(() => {
    const loadNames = async () => {
      const snapshot = await getDocs(collection(db, 'graduates'));
      const names = snapshot.docs.map(doc => doc.data().name);
      setExistingNames(names);
    };
    loadNames();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من الاسم
    if (!formData.name.trim()) {
      toast.error('الاسم مطلوب');
      return;
    }
    
    const nameParts = formData.name.trim().split(' ');
    if (nameParts.length < 3) {
      toast.error('الاسم يجب أن يكون ثلاثي أو رباعي');
      return;
    }
    
    // التحقق من التكرار
    if (existingNames.includes(formData.name.trim())) {
      toast.error('⚠️ هذا الاسم موجود بالفعل في قائمة الخريجين');
      return;
    }
    
    setLoading(true);
    
    try {
      await addDoc(collection(db, 'graduates'), {
        name: formData.name.trim(),
        section: formData.section || 'غير محدد',
        approvedAt: new Date()
      });
      
      toast.success(`✅ تمت إضافة ${formData.name} بنجاح`);
      setFormData({ name: '', section: '' });
      
      // تحديث قائمة الأسماء
      setExistingNames(prev => [...prev, formData.name.trim()]);
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">⏳ إضافة عضو جديد</h2>
        <p className="text-gray-400 text-sm">أضف أعضاء الدفعة الجدد يدوياً (أو استخدم Google Forms للتقديم)</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-1">الاسم رباعي *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-white/10 rounded-xl p-3 text-white border border-white/20 focus:border-amber-500 outline-none transition"
              placeholder="مثال: محمد أحمد علي حسن"
            />
            <p className="text-xs text-gray-500 mt-1">الاسم يجب أن يكون ثلاثي أو رباعي</p>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">القسم / الشعبة</label>
            <select
              value={formData.section}
              onChange={(e) => setFormData({...formData, section: e.target.value})}
              className="w-full bg-white/10 rounded-xl p-3 text-white border border-white/20 focus:border-amber-500 outline-none transition"
            >
              <option value="">اختر القسم</option>
              <option value="حاسب آلي">حاسب آلي</option>
              <option value="فيزياء">فيزياء</option>
              <option value="كيمياء">كيمياء</option>
              <option value="جيولوجيا">جيولوجيا</option>
              <option value="رياضيات">رياضيات</option>
              <option value="نبات">نبات</option>
              <option value="حيوان">حيوان</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'جاري الإضافة...' : '✅ إضافة اسم لقائمة الخريجين'}
          </button>
        </form>
      </motion.div>

      <div className="mt-6 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
        <p className="text-sm text-amber-400 text-center">
          📌 ملاحظة: الطلبات من Google Forms تظهر تلقائياً عند الموافقة عليها في الشيت عبر Checkbox.
          <br />
          الأسماء المضافة هنا تظهر مباشرة في قائمة الخريجين.
        </p>
      </div>
    </div>
  );
}