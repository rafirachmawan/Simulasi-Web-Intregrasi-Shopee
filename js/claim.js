// ========================================
// Claim Engine Module
// ========================================
const Claim = {
  currentOrder: null,

  init() {
    this.setupTabs();
    this.setupShopeeForm();
    this.setupWebForm();
  },

  setupTabs() {
    document.querySelectorAll('.claim-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.claim-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.claim-panel').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
        tab.classList.add('active');
        const panel = document.getElementById(`claim-${tab.dataset.tab}`);
        if (panel) { panel.style.display = 'block'; panel.classList.add('active'); }
      });
    });
    // Reset panels
    document.getElementById('claim-shopee').style.display = 'block';
    document.getElementById('claim-shopee').classList.add('active');
    document.getElementById('claim-verify').style.display = 'none';
    document.getElementById('claim-result').style.display = 'none';
    document.getElementById('claim-web').style.display = 'none';
  },

  setupShopeeForm() {
    const form = document.getElementById('claim-shopee-form');
    if (!form) return;
    form.onsubmit = async (e) => {
      e.preventDefault();
      const orderNo = document.getElementById('claim-shopee-order').value.trim().toUpperCase();
      if (!orderNo) { Utils.showToast('Masukkan nomor pesanan', 'error'); return; }

      // Rate limiting check
      MockData.rateLimitCount++;
      if (MockData.rateLimitCount > 5) {
        Utils.showToast('Terlalu banyak percobaan. Coba lagi dalam 1 menit.', 'warning');
        return;
      }

      const order = MockData.shopeeOrders.find(o => o.orderNo === orderNo);
      if (!order) {
        Utils.showToast('Nomor pesanan tidak ditemukan', 'error');
        return;
      }
      if (order.claimed) {
        Utils.showToast('Nomor pesanan ini sudah mengklaim akun.', 'error');
        return;
      }

      this.currentOrder = order;
      this.showPhoneVerify();
    };
  },

  showPhoneVerify() {
    // Hide all panels, show verify
    document.querySelectorAll('.claim-panel').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
    const verifyPanel = document.getElementById('claim-verify');
    verifyPanel.style.display = 'block';
    verifyPanel.classList.add('active');

    MockData.phoneVerifyAttempts = 0;
    MockData.phoneVerifyLocked = false;

    const last4 = Utils.getLast4(this.currentOrder.phone);
    verifyPanel.innerHTML = `
      <div class="verify-container">
        <div class="verify-icon">📱</div>
        <h3>Verifikasi Nomor HP</h3>
        <p style="color:var(--text2);margin:8px 0 4px">Masukkan <strong>4 digit terakhir</strong> nomor HP yang terdaftar di Shopee</p>
        <p style="color:var(--text2);font-size:0.8rem;margin-bottom:16px">Pesanan: <strong>${this.currentOrder.orderNo}</strong></p>
        <div class="verify-digits">
          <input type="text" maxlength="1" class="digit-input" data-idx="0" inputmode="numeric">
          <input type="text" maxlength="1" class="digit-input" data-idx="1" inputmode="numeric">
          <input type="text" maxlength="1" class="digit-input" data-idx="2" inputmode="numeric">
          <input type="text" maxlength="1" class="digit-input" data-idx="3" inputmode="numeric">
        </div>
        <div id="verify-error" style="min-height:24px"></div>
        <button class="btn btn-primary btn-full" id="verify-submit-btn">🔓 Verifikasi</button>
        <button class="btn btn-outline btn-full" style="margin-top:8px" id="verify-back-btn">← Kembali</button>
        <div class="demo-hint" style="margin-top:16px">
          <p>📋 <strong>Demo:</strong> 4 digit terakhir: <code>${last4}</code></p>
        </div>
      </div>
    `;

    // Auto-focus and auto-advance digits
    const inputs = verifyPanel.querySelectorAll('.digit-input');
    inputs.forEach((inp, i) => {
      inp.addEventListener('input', () => {
        inp.value = inp.value.replace(/\D/g, '');
        if (inp.value && i < 3) inputs[i + 1].focus();
      });
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !inp.value && i > 0) inputs[i - 1].focus();
      });
    });
    inputs[0].focus();

    // Verify button
    document.getElementById('verify-submit-btn').addEventListener('click', () => this.verifyPhone());
    document.getElementById('verify-back-btn').addEventListener('click', () => {
      document.querySelectorAll('.claim-panel').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
      document.getElementById('claim-shopee').style.display = 'block';
      document.getElementById('claim-shopee').classList.add('active');
    });
  },

  async verifyPhone() {
    if (MockData.phoneVerifyLocked) {
      Utils.showToast('Akses terkunci. Tunggu 15 menit.', 'error');
      return;
    }

    const inputs = document.querySelectorAll('.digit-input');
    const entered = Array.from(inputs).map(i => i.value).join('');
    if (entered.length !== 4) { Utils.showToast('Masukkan 4 digit', 'error'); return; }

    const correct = Utils.getLast4(this.currentOrder.phone);
    const errorEl = document.getElementById('verify-error');

    if (entered !== correct) {
      MockData.phoneVerifyAttempts++;
      const remaining = 3 - MockData.phoneVerifyAttempts;

      if (remaining <= 0) {
        MockData.phoneVerifyLocked = true;
        errorEl.innerHTML = `<p class="locked-msg">🔒 Akses terkunci selama 15 menit<br><span style="font-size:0.8rem;font-weight:400">Terlalu banyak percobaan gagal</span></p>`;
        document.getElementById('verify-submit-btn').disabled = true;
        inputs.forEach(i => { i.disabled = true; });
        // Simulate countdown
        let sec = 900;
        const timer = setInterval(() => {
          sec--;
          const m = Math.floor(sec / 60);
          const s = sec % 60;
          errorEl.innerHTML = `<p class="locked-msg">🔒 Terkunci — ${m}:${String(s).padStart(2, '0')}</p>`;
          if (sec <= 0) { clearInterval(timer); MockData.phoneVerifyLocked = false; }
        }, 1000);
        return;
      }

      errorEl.innerHTML = `<p style="color:var(--danger);font-size:0.85rem;font-weight:500">❌ Kode salah. ${remaining} percobaan tersisa.</p>`;
      inputs.forEach(i => { i.value = ''; });
      inputs[0].focus();
      return;
    }

    // Success - claim the account
    this.currentOrder.claimed = true;
    const result = MockData.claimStock(this.currentOrder.productName, this.currentOrder.orderNo, 'Shopee', this.currentOrder.buyerName);
    this.showResult(result);
  },

  setupWebForm() {
    const form = document.getElementById('claim-web-form');
    if (!form) return;
    form.onsubmit = async (e) => {
      e.preventDefault();
      const invoiceNo = document.getElementById('claim-web-invoice').value.trim().toUpperCase();
      if (!invoiceNo) { Utils.showToast('Masukkan nomor invoice', 'error'); return; }

      // Check in claim logs
      const existing = MockData.claimLogs.find(l => l.orderNo === invoiceNo);
      if (existing) {
        Utils.showToast('Nomor pesanan ini sudah mengklaim akun.', 'error');
        return;
      }

      // Check web orders
      const webOrder = MockData.webOrders.find(o => o.invoiceNo === invoiceNo);
      if (!webOrder) {
        Utils.showToast('Nomor invoice tidak ditemukan', 'error');
        return;
      }

      const result = MockData.claimStock(webOrder.productName, invoiceNo, 'Web', webOrder.name);
      if (!result) { Utils.showToast('Stok habis', 'error'); return; }
      this.showResult(result);
    };
  },

  showResult(result) {
    if (!result) {
      Utils.showToast('Stok habis untuk produk ini', 'error');
      return;
    }
    document.querySelectorAll('.claim-panel').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
    const panel = document.getElementById('claim-result');
    panel.style.display = 'block';
    panel.classList.add('active');
    panel.innerHTML = `
      <div class="claim-result">
        <div class="result-success-icon">🎉</div>
        <div class="result-title">Klaim Berhasil!</div>
        <div class="result-card">
          <div class="result-row"><span class="result-label">No. Pesanan</span><span class="result-value">${result.orderNo}</span></div>
          <div class="result-row"><span class="result-label">Produk</span><span class="result-value">${result.product}</span></div>
          <div class="result-row"><span class="result-label">Email Akun</span><span class="result-value">${result.email} <button class="copy-btn" onclick="Utils.copyToClipboard('${result.email}')">📋</button></span></div>
          <div class="result-row"><span class="result-label">Password</span><span class="result-value">${result.password} <button class="copy-btn" onclick="Utils.copyToClipboard('${result.password}')">📋</button></span></div>
          <div class="result-row"><span class="result-label">Aktif Hingga</span><span class="result-value" style="color:var(--success)">${Utils.formatDate(result.expiryDate)}</span></div>
        </div>
        <p style="font-size:0.8rem;color:var(--text2);margin-top:16px">⚠️ Screenshot halaman ini. Akun Anda sudah aktif!</p>
        <div style="display:flex;gap:8px;margin-top:16px">
          <button class="btn btn-outline" style="flex:1" onclick="App.navigate('claim')">← Klaim Lagi</button>
          <button class="btn btn-primary" style="flex:1" onclick="App.navigate('home')">🏠 Beranda</button>
        </div>
      </div>
    `;
    Utils.showToast('Akun premium berhasil diklaim!', 'success');
  }
};
