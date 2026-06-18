// ========================================
// Catalog & Checkout Module
// ========================================
const Catalog = {
  selectedProduct: null,

  init() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = MockData.products.map(p => `
      <div class="product-card ${p.popular ? 'popular' : ''}" data-id="${p.id}">
        ${p.popular ? '<div class="popular-badge">🔥 Terlaris</div>' : ''}
        <span class="product-icon">${p.icon}</span>
        <div class="product-name">${p.name}</div>
        <div class="product-variant">${p.variant}</div>
        <div class="product-price">${Utils.formatRupiah(p.price)}</div>
        <ul class="product-features">
          ${p.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
        <button class="btn btn-primary btn-full btn-buy" data-id="${p.id}">
          <span class="btn-icon">🛒</span> Beli Sekarang
        </button>
      </div>
    `).join('');

    grid.querySelectorAll('.btn-buy').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const product = MockData.products.find(p => p.id === parseInt(btn.dataset.id));
        if (product) App.navigate('checkout', product);
      });
    });
  },

  initCheckout(product) {
    if (product) this.selectedProduct = product;
    if (!this.selectedProduct) { App.navigate('home'); return; }
    const p = this.selectedProduct;

    document.getElementById('checkout-product-info').innerHTML = `
      <div style="font-size:2.5rem;text-align:center;margin-bottom:12px">${p.icon}</div>
      <div class="checkout-product-row"><span>${p.name} — ${p.variant}</span></div>
      <div class="checkout-product-row"><span>Durasi</span><span>${p.duration} hari</span></div>
      <div class="checkout-product-row"><span>Harga</span><span>${Utils.formatRupiah(p.price)}</span></div>
      <div class="checkout-product-row"><span>Biaya Admin</span><span>Rp 0</span></div>
      <div class="checkout-product-row total"><span>Total</span><span>${Utils.formatRupiah(p.price)}</span></div>
    `;

    // Payment method selection
    document.querySelectorAll('.payment-option').forEach(opt => {
      opt.addEventListener('change', () => {
        document.querySelectorAll('.payment-option').forEach(o => o.querySelector('.payment-card').style.borderColor = '');
      });
    });

    const form = document.getElementById('checkout-form');
    form.onsubmit = async (e) => {
      e.preventDefault();
      const name = document.getElementById('checkout-name').value.trim();
      const email = document.getElementById('checkout-email').value.trim();
      const phone = document.getElementById('checkout-phone').value.trim();
      if (!name || !email || !phone) { Utils.showToast('Lengkapi semua data', 'error'); return; }

      await this.processPayment(name, email, phone);
    };
  },

  async processPayment(name, email, phone) {
    const p = this.selectedProduct;
    const productName = `${p.name} ${p.variant}`;

    // Show payment processing page
    App.navigate('payment');
    const statusEl = document.getElementById('payment-status');

    // Step 1: Processing
    statusEl.innerHTML = `
      <div class="payment-spinner"></div>
      <h2>Memproses Pembayaran...</h2>
      <p style="color:var(--text2);margin-top:8px">Menghubungkan ke payment gateway</p>
    `;
    await Utils.sleep(2000);

    // Step 2: Verifying
    statusEl.innerHTML = `
      <div class="payment-spinner"></div>
      <h2>Memverifikasi Pembayaran...</h2>
      <p style="color:var(--text2);margin-top:8px">Pembayaran diterima, memvalidasi pesanan</p>
    `;
    await Utils.sleep(1500);

    // Step 3: Claiming account
    const invoiceNo = Utils.generateInvoice();
    const result = MockData.claimStock(productName, invoiceNo, 'Web', name);

    if (!result) {
      statusEl.innerHTML = `
        <div class="payment-success-icon">❌</div>
        <h2>Stok Habis</h2>
        <p style="color:var(--text2);margin-top:8px">Maaf, stok untuk ${productName} sedang habis. Pembayaran akan direfund.</p>
        <button class="btn btn-outline" style="margin-top:20px" onclick="App.navigate('home')">Kembali ke Beranda</button>
      `;
      return;
    }

    // Step 4: Success!
    statusEl.innerHTML = `
      <div class="payment-success-icon">✅</div>
      <h2 style="color:var(--success)">Pembayaran Berhasil!</h2>
      <p style="color:var(--text2);margin:8px 0 24px">Invoice: <strong>${invoiceNo}</strong></p>
      <div class="result-card">
        <div class="result-row"><span class="result-label">Produk</span><span class="result-value">${productName}</span></div>
        <div class="result-row"><span class="result-label">Email Akun</span><span class="result-value">${result.email} <button class="copy-btn" onclick="Utils.copyToClipboard('${result.email}')">📋</button></span></div>
        <div class="result-row"><span class="result-label">Password</span><span class="result-value">${result.password} <button class="copy-btn" onclick="Utils.copyToClipboard('${result.password}')">📋</button></span></div>
        <div class="result-row"><span class="result-label">Aktif Hingga</span><span class="result-value" style="color:var(--success)">${Utils.formatDate(result.expiryDate)}</span></div>
      </div>
      <p style="font-size:0.8rem;color:var(--text2);margin-top:16px">⚠️ Screenshot halaman ini sebagai bukti. Akun Anda sudah aktif!</p>
      <button class="btn btn-primary" style="margin-top:16px" onclick="App.navigate('home')">Kembali ke Beranda</button>
    `;
    Utils.showToast('Akun premium berhasil diklaim!', 'success');
  }
};
