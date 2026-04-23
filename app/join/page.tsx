"use client";

import { useState } from 'react';
import { addJoinRequest } from '@/lib/firebase';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function JoinPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    seatNumber: '',
    section: '',
    phone: ''
  });
  const [errors, setErrors] = useState({
    fullName: '',
    seatNumber: '',
    section: ''
  });
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {
      fullName: '',
      seatNumber: '',
      section: ''
    };
    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'الاسم رباعي مطلوب';
      isValid = false;
    } else if (formData.fullName.trim().split(' ').length < 3) {
      newErrors.fullName = 'الاسم يجب أن يكون ثلاثي أو رباعي';
      isValid = false;
    }

    if (!formData.seatNumber.trim()) {
      newErrors.seatNumber = 'رقم الجلوس مطلوب';
      isValid = false;
    } else if (formData.seatNumber.length < 4) {
      newErrors.seatNumber = 'رقم الجلوس غير صحيح';
      isValid = false;
    }

    if (!formData.section) {
      newErrors.section = 'من فضلك اختر الشعبة';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('من فضلك املأ جميع البيانات المطلوبة');
      return;
    }

    setLoading(true);
    
    try {
      await addJoinRequest({
        fullName: formData.fullName.trim(),
        seatNumber: formData.seatNumber.trim(),
        section: formData.section,
        phone: formData.phone
      });
      
      toast.success('🎉 تم إرسال طلبك بنجاح! في انتظار الموافقة');
      
      setFormData({ fullName: '', seatNumber: '', section: '', phone: '' });
      
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'حدث خطأ، حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 py-12 px-4">
      <Toaster position="top-center" />
      
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            انضم لقائمة الدفعة 🎓
          </h1>
          <p className="text-gray-400 mt-2">أضف اسمك لسجل خريجين علوم بنها 2026</p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit}
          className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10 space-y-5"
        >
          <div>
            <label className="block text-sm text-gray-300 mb-1">الاسم رباعي *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => {
                setFormData({...formData, fullName: e.target.value});
                setErrors(prev => ({ ...prev, fullName: '' }));
              }}
              className={`w-full bg-white/10 rounded-xl p-3 text-white border ${
                errors.fullName ? 'border-red-500' : 'border-white/20'
              } focus:border-amber-500 outline-none transition`}
              placeholder="محمد أحمد علي حسن"
            />
            {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">رقم الجلوس *</label>
            <input
              type="text"
              value={formData.seatNumber}
              onChange={(e) => {
                setFormData({...formData, seatNumber: e.target.value});
                setErrors(prev => ({ ...prev, seatNumber: '' }));
              }}
              className={`w-full bg-white/10 rounded-xl p-3 text-white border ${
                errors.seatNumber ? 'border-red-500' : 'border-white/20'
              } focus:border-amber-500 outline-none transition`}
              placeholder="رقم جلوسك في الكلية"
            />
            {errors.seatNumber && <p className="text-red-400 text-xs mt-1">{errors.seatNumber}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">الشعبة / القسم *</label>
            <select
              value={formData.section}
              onChange={(e) => {
                setFormData({...formData, section: e.target.value});
                setErrors(prev => ({ ...prev, section: '' }));
              }}
              className={`w-full bg-white/10 rounded-xl p-3 text-white border ${
                errors.section ? 'border-red-500' : 'border-white/20'
              } focus:border-amber-500 outline-none transition`}
            >
              <option value="">اختر الشعبة</option>
              <option value="حاسب آلي">حاسب آلي</option>
              <option value="فيزياء">فيزياء</option>
              <option value="كيمياء">كيمياء</option>
              <option value="جيولوجيا">جيولوجيا</option>
              <option value="رياضيات">رياضيات</option>
              <option value="نبات">نبات</option>
              <option value="حيوان">حيوان</option>
            </select>
            {errors.section && <p className="text-red-400 text-xs mt-1">{errors.section}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">رقم التليفون (اختياري)</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full bg-white/10 rounded-xl p-3 text-white border border-white/20 focus:border-amber-500 outline-none transition"
              placeholder="للتواصل عند الحاجة"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'جاري الإرسال...' : '🎓 إرسال طلب الانضمام'}
          </button>

          <p className="text-center text-xs text-gray-500 pt-2">
            المنظمين هيتأكدوا من بياناتك قبل الموافقة ✅
          </p>
        </motion.form>
        
        <div className="text-center mt-6">
          <a href="/" className="text-gray-400 hover:text-amber-400 text-sm transition">← رجوع للصفحة الرئيسية</a>
        </div>
      </div>
    </main>
  );
}