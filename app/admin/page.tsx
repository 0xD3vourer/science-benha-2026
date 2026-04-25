"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingRequests: 0,
    recentMembers: [] as any[],
    lastUpdate: null as Date | null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // تحميل الإحصائيات الأولية
    loadStats();
    
    // Real-time listener للطلبات المعلقة
    const unsubscribePending = onSnapshot(collection(db, 'pending_requests'), (snapshot) => {
      setStats(prev => ({ ...prev, pendingRequests: snapshot.size }));
    });
    
    // Real-time listener للأعضاء
    const unsubscribeMembers = onSnapshot(collection(db, 'graduates'), (snapshot) => {
      setStats(prev => ({ ...prev, totalMembers: snapshot.size }));
    });
    
    return () => {
      unsubscribePending();
      unsubscribeMembers();
    };
  }, []);

  const loadStats = async () => {
    try {
      // جلب عدد الأعضاء
      const membersSnapshot = await getDocs(collection(db, 'graduates'));
      const totalMembers = membersSnapshot.size;
      
      // جلب عدد الطلبات المعلقة
      const pendingSnapshot = await getDocs(collection(db, 'pending_requests'));
      const pendingRequests = pendingSnapshot.size;

      // جلب آخر 5 أعضاء
      const recentQuery = query(
        collection(db, 'graduates'),
        orderBy('approvedAt', 'desc'),
        limit(5)
      );
      const recentSnapshot = await getDocs(recentQuery);
      const recentMembers = recentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setStats({
        totalMembers,
        pendingRequests,
        recentMembers,
        lastUpdate: new Date()
      });
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-12">
        <div className="animate-pulse">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/20"
        >
          <div className="text-3xl mb-2">🎓</div>
          <div className="text-2xl font-bold text-white">{stats.totalMembers}</div>
          <div className="text-sm text-gray-400">إجمالي أعضاء الدفعة</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20"
        >
          <div className="text-3xl mb-2">⏳</div>
          <div className="text-2xl font-bold text-white">{stats.pendingRequests}</div>
          <div className="text-sm text-gray-400">طلبات معلقة (من Google Forms)</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20"
        >
          <div className="text-3xl mb-2">📅</div>
          <div className="text-xl font-bold text-white">
            {stats.lastUpdate?.toLocaleDateString('ar-EG') || '---'}
          </div>
          <div className="text-sm text-gray-400">آخر تحديث</div>
        </motion.div>
      </div>

      {/* آخر الأعضاء المضافين */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">🆕 آخر الأعضاء المضافين</h2>
          <Link href="/admin/members" className="text-amber-400 text-sm hover:underline">
            عرض الكل
          </Link>
        </div>
        {stats.recentMembers.length === 0 ? (
          <p className="text-gray-400 text-center py-8">لا يوجد أعضاء حتى الآن</p>
        ) : (
          <div className="space-y-2">
            {stats.recentMembers.map((member, idx) => (
              <div key={member.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.section || 'غير محدد'}</p>
                </div>
                <Link 
                  href="/admin/members"
                  className="text-amber-400 text-sm hover:underline"
                >
                  عرض
                </Link>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* روابط سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          href="/admin/pending"
          className="group bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-xl p-6 border border-amber-500/20 text-center hover:border-amber-500/40 transition"
        >
          <div className="text-4xl mb-2 flex items-center justify-center gap-2">
            <span>⏳</span>
            {stats.pendingRequests > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
                {stats.pendingRequests}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition">الطلبات المعلقة</h3>
          <p className="text-sm text-gray-400 mt-1">مراجعة وإدارة الطلبات الجديدة من Google Forms</p>
        </Link>

        <Link 
          href="/admin/members"
          className="group bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-xl p-6 border border-emerald-500/20 text-center hover:border-emerald-500/40 transition"
        >
          <div className="text-4xl mb-2">🎓</div>
          <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">أعضاء الدفعة</h3>
          <p className="text-sm text-gray-400 mt-1">عرض وإدارة جميع أعضاء الدفعة المعتمدين</p>
        </Link>
      </div>
    </div>
  );
}