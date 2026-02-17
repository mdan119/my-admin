import { LayoutDashboard, Users, ShoppingCart, DollarSign } from "lucide-react";

export default function DashboardCard() {
  return (
    <div className="card max-w-md">
      {/* Header */}
      <div className="card-header">
        <div>
          <h3 className="card-title">Statistik Penjualan</h3>
          <p className="card-description">Data harian terbaru</p>
        </div>
        <button className="text-primary text-sm font-semibold">Lihat Semua</button>
      </div>

      {/* Body */}
      <div className="card-body">
        <p>Konten utama statistik kamu akan tampil di sini dengan padding yang pas.</p>
      </div>

      {/* Footer */}
      <div className="card-footer">
        <div className="flex justify-between items-center text-xs text-[var(--muted)]">
          <span>Terakhir diperbarui: 2 menit yang lalu</span>
          <span className="text-green-500 font-medium">+12.5%</span>
        </div>
      </div>
    </div>
  );
}