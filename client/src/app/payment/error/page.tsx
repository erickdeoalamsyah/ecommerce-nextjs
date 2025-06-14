export default function PaymentErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-100 text-red-800">
      <h1 className="text-3xl font-bold mb-4">Pembayaran Gagal ❌</h1>
      <p className="text-lg">Maaf, terjadi kesalahan saat memproses pembayaran Anda.</p>
    </div>
  );
}
