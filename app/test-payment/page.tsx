'use client';

import { useState } from 'react';

export default function TestPaymentPage() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Checkout session oluştur
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 10000, // 100 TRY (cent cinsinden)
          productName: 'Test Ürün - Premium Plan',
        }),
      });

      const { url } = await response.json();

      if (!url) {
        throw new Error('Stripe yönlendirme adresi alınamadı.');
      }

      window.location.href = url;
    } catch (error) {
      console.error('Ödeme hatası:', error);
      alert('Ödeme başlatılamadı!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Test Ödeme</h1>
        <div className="mb-6">
          <p className="text-gray-600">Ürün: Premium Plan</p>
          <p className="text-2xl font-bold text-green-600">100 TRY</p>
        </div>
        
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Yükleniyor...' : 'Ödeme Yap'}
        </button>
        
        <p className="text-sm text-gray-500 mt-4">
          ⚠️ Test Mode - Gerçek para çekilmeyecek
        </p>
      </div>
    </div>
  );
}
