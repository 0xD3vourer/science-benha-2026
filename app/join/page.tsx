"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { addJoinRequest, uploadImage } from '@/lib/firebase';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function JoinPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    seatNumber: '',
    section: '',
    phone: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName.trim()) {
      toast.error('من فضلك اكتب الاسم رباعي');
      return;
    }
    if (!formData.seatNumber.trim()) {
      toast.error('من فضلك اكتب رقم الجلوس');
      return;
    }
    if (!imageFile) {
      toast.error('من فضلك ارفع صورة الكارنيه');
      return;
    }

    setLoading(true);
    
    try {
      // رفع الصورة
      const imageUrl = await uploadImage(
        imageFile, 
        `id_cards/${Date.now()}_${formData.seatNumber}.jpg`
      );
      
      // إضافة طلب الانضمام
      await addJoinRequest({
        fullName: formData.fullName,
        seatNumber: formData.seatNumber,
        section: formData.section || 'غير محدد',
        phone: formData.phone,
        imageUrl
      });
      
      toast.success('🎉 تم إرسال طلبك! في انتظار الموافقة');
      setFormData({ fullName: '', seatNumber: '', section: '', phone: '' });
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ، حاول مرة أخرى');
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
          {/* الاسم */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">الاسم رباعي *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full bg-white/10 rounded-xl p-3 text-white border border-white/20 focus:border-amber-500 outline-none transition"
              placeholder="محمد أحمد علي حسن"
            />
          </div>

          {/* رقم الجلوس */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">رقم الجلوس *</label>
            <input
              type="text"
              value={formData.seatNumber}
              onChange={(e) => setFormData({...formData, seatNumber: e.target.value})}
              className="w-full bg-white/10 rounded-xl p-3 text-white border border-white/20 focus:border-amber-500 outline-none transition"
              placeholder="رقم جلوسك في الكلية"
            />
          </div>

          {/* الشعبة */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">الشعبة / القسم</label>
            <select
              value={formData.section}
              onChange={(e) => setFormData({...formData, section: e.target.value})}
              className="w-full bg-white/10 rounded-xl p-3 text-white border border-white/20 focus:border-amber-500 outline-none transition"
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
          </div>

          {/* رقم التليفون (اختياري) */}
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

          {/* رفع الصورة */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">صورة الكارنيه أو البطاقة *</label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition
                ${isDragActive ? 'border-amber-500 bg-amber-500/10' : 'border-white/20 bg-white/5 hover:bg-white/10'}`}
            >
              <input {...getInputProps()} />
              {imagePreview ? (
                <div className="space-y-2">
                  <img src={imagePreview} alt="Preview" className="max-h-40 mx-auto rounded-lg" />
                  <p className="text-sm text-green-400">✓ تم رفع الصورة</p>
                </div>
              ) : (
                <>
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-gray-400">اسحب الصورة هنا أو اضغط للاختيار</p>
                  <p className="text-xs text-gray-500 mt-1">jpg, png (حد أقصى 5MB)</p>
                </>
              )}
            </div>
          </div>

          {/* زر الإرسال */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'جاري الإرسال...' : '🎓 إرسال طلب الانضمام'}
          </button>

          <p className="text-center text-xs text-gray-500 pt-2">
            طلبك هيراجع من المنظمين، وهتتضاف لقائمة الدفعة بعد الموافقة ✅
          </p>
        </motion.form>
        
        {/* رابط الرجوع */}
        <div className="text-center mt-6">
          <a href="/" className="text-gray-400 hover:text-amber-400 text-sm transition">← رجوع للصفحة الرئيسية</a>
        </div>
      </div>
    </main>
  );
}