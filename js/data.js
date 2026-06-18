// ========================================
// Mock Data - Simulasi Demo
// ========================================

const MockData = {
  products: [
    { id: 1, name: "YouTube Premium", variant: "1 Bulan", price: 15000, duration: 30, icon: "🎬", gradient: "linear-gradient(135deg, #FF0000, #CC0000)", features: ["Tanpa Iklan", "Background Play", "YouTube Music"], popular: false },
    { id: 2, name: "YouTube Premium", variant: "3 Bulan", price: 40000, duration: 90, icon: "🎬", gradient: "linear-gradient(135deg, #FF0000, #CC0000)", features: ["Tanpa Iklan", "Background Play", "YouTube Music", "Hemat 11%"], popular: true },
    { id: 3, name: "YouTube Premium", variant: "6 Bulan", price: 70000, duration: 180, icon: "🎬", gradient: "linear-gradient(135deg, #FF0000, #CC0000)", features: ["Tanpa Iklan", "Background Play", "YouTube Music", "Hemat 22%"], popular: false },
    { id: 4, name: "YouTube Premium", variant: "1 Tahun", price: 120000, duration: 365, icon: "🎬", gradient: "linear-gradient(135deg, #FF0000, #CC0000)", features: ["Tanpa Iklan", "Background Play", "YouTube Music", "Hemat 33%"], popular: false },
    { id: 5, name: "Spotify Premium", variant: "1 Bulan", price: 12000, duration: 30, icon: "🎵", gradient: "linear-gradient(135deg, #1DB954, #148A3C)", features: ["Tanpa Iklan", "Download Offline", "HQ Audio"], popular: false },
    { id: 6, name: "Spotify Premium", variant: "3 Bulan", price: 30000, duration: 90, icon: "🎵", gradient: "linear-gradient(135deg, #1DB954, #148A3C)", features: ["Tanpa Iklan", "Download Offline", "HQ Audio", "Hemat 17%"], popular: false },
  ],

  stockPool: [
    { id: 1, email: "ytprem001@gmail.com", password: "Yt@Pr3m001!", product: "YouTube Premium 1 Bulan", status: "used", uploadDate: "2026-06-01T08:00:00", claimedBy: "2406011234ABCDE" },
    { id: 2, email: "ytprem002@gmail.com", password: "Yt@Pr3m002!", product: "YouTube Premium 1 Bulan", status: "used", uploadDate: "2026-06-01T08:01:00", claimedBy: "INV-260601-0001" },
    { id: 3, email: "ytprem003@gmail.com", password: "Yt@Pr3m003!", product: "YouTube Premium 3 Bulan", status: "available", uploadDate: "2026-06-05T10:00:00", claimedBy: null },
    { id: 4, email: "ytprem004@gmail.com", password: "Yt@Pr3m004!", product: "YouTube Premium 3 Bulan", status: "available", uploadDate: "2026-06-05T10:01:00", claimedBy: null },
    { id: 5, email: "ytprem005@gmail.com", password: "Yt@Pr3m005!", product: "YouTube Premium 6 Bulan", status: "available", uploadDate: "2026-06-10T14:00:00", claimedBy: null },
    { id: 6, email: "ytprem006@gmail.com", password: "Yt@Pr3m006!", product: "YouTube Premium 1 Tahun", status: "available", uploadDate: "2026-06-10T14:01:00", claimedBy: null },
    { id: 7, email: "ytprem007@gmail.com", password: "Yt@Pr3m007!", product: "YouTube Premium 1 Bulan", status: "available", uploadDate: "2026-06-12T09:00:00", claimedBy: null },
    { id: 8, email: "sptfy001@gmail.com", password: "Sp@Pr3m001!", product: "Spotify Premium 1 Bulan", status: "available", uploadDate: "2026-06-12T09:01:00", claimedBy: null },
    { id: 9, email: "sptfy002@gmail.com", password: "Sp@Pr3m002!", product: "Spotify Premium 3 Bulan", status: "available", uploadDate: "2026-06-12T09:02:00", claimedBy: null },
    { id: 10, email: "ytprem008@gmail.com", password: "Yt@Pr3m008!", product: "YouTube Premium 1 Bulan", status: "available", uploadDate: "2026-06-15T11:00:00", claimedBy: null },
  ],

  shopeeOrders: [
    { orderNo: "2406181234ABCDE", buyerName: "Budi Santoso", phone: "081234567890", productName: "YouTube Premium 3 Bulan", claimed: false, orderDate: "2026-06-18T10:30:00" },
    { orderNo: "2406175678FGHIJ", buyerName: "Siti Rahayu", phone: "082198765432", productName: "YouTube Premium 1 Bulan", claimed: false, orderDate: "2026-06-17T14:22:00" },
    { orderNo: "2406169012KLMNO", buyerName: "Ahmad Wijaya", phone: "085312345678", productName: "Spotify Premium 1 Bulan", claimed: false, orderDate: "2026-06-16T09:15:00" },
    { orderNo: "2406151111PQRST", buyerName: "Dewi Lestari", phone: "087899998888", productName: "YouTube Premium 1 Tahun", claimed: true, orderDate: "2026-06-15T16:45:00" },
  ],

  claimLogs: [
    { id: 1, orderNo: "2406011234ABCDE", channel: "Shopee", product: "YouTube Premium 1 Bulan", buyerName: "Rina Marlina", email: "ytprem001@gmail.com", claimedAt: "2026-06-01T10:30:00", expiryDate: "2026-07-01", warrantyStatus: "Active" },
    { id: 2, orderNo: "INV-260601-0001", channel: "Web", product: "YouTube Premium 1 Bulan", buyerName: "Joko Widodo", email: "ytprem002@gmail.com", claimedAt: "2026-06-01T14:22:00", expiryDate: "2026-07-01", warrantyStatus: "Active" },
    { id: 3, orderNo: "2406151111PQRST", channel: "Shopee", product: "YouTube Premium 1 Tahun", buyerName: "Dewi Lestari", email: "ytprem006@gmail.com", claimedAt: "2026-06-15T16:50:00", expiryDate: "2027-06-15", warrantyStatus: "Active" },
  ],

  webOrders: [],

  phoneVerifyAttempts: 0,
  phoneVerifyLocked: false,
  phoneVerifyLockUntil: null,
  rateLimitCount: 0,
  rateLimitTime: null,

  adminCreds: { username: "admin", password: "admin123" },

  getAvailableStock(productName) {
    return this.stockPool
      .filter(s => s.status === "available" && s.product === productName)
      .sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
  },

  claimStock(productName, orderNo, channel, buyerName) {
    const available = this.getAvailableStock(productName);
    if (available.length === 0) return null;
    const account = available[0];
    account.status = "used";
    account.claimedBy = orderNo;
    const product = this.products.find(p => `${p.name} ${p.variant}` === productName);
    const duration = product ? product.duration : 30;
    const now = new Date();
    const expiry = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000);
    this.claimLogs.push({
      id: this.claimLogs.length + 1, orderNo, channel, product: productName,
      buyerName: buyerName || "-", email: account.email,
      claimedAt: now.toISOString(), expiryDate: expiry.toISOString().slice(0, 10), warrantyStatus: "Active"
    });
    return { email: account.email, password: account.password, product: productName, claimedAt: now, expiryDate: expiry, orderNo };
  },

  getStockStats() {
    return {
      total: this.stockPool.length,
      available: this.stockPool.filter(s => s.status === "available").length,
      used: this.stockPool.filter(s => s.status === "used").length,
    };
  },

  addBulkStock(items) {
    items.forEach(item => {
      this.stockPool.push({ id: this.stockPool.length + 1, ...item, status: "available", uploadDate: new Date().toISOString(), claimedBy: null });
    });
  }
};
