// ========================================
// Admin Module
// ========================================
const Admin = {
  initLogin() {
    const form = document.getElementById('admin-login-form');
    if (!form) return;
    form.onsubmit = async (e) => {
      e.preventDefault();
      const u = document.getElementById('admin-username').value.trim();
      const p = document.getElementById('admin-password').value;
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = '<div class="payment-spinner" style="width:20px;height:20px;border-width:2px;margin:0 auto"></div>';
      await Utils.sleep(1200);
      if (u === MockData.adminCreds.username && p === MockData.adminCreds.password) {
        App.isAdminLoggedIn = true;
        Utils.showToast('Login berhasil!', 'success');
        App.navigate('admin-dashboard');
      } else {
        Utils.showToast('Username atau password salah', 'error');
        btn.disabled = false;
        btn.innerHTML = '<span class="btn-icon">🔓</span> Masuk';
      }
    };
  },

  initDashboard() {
    this.renderStats();
    this.setupTabs();
    this.renderStockTab();
    this.renderLogTab();
    this.renderApiTab();
    // Setup logout
    const logoutBtn = document.getElementById('admin-logout');
    if (logoutBtn) logoutBtn.onclick = () => { App.isAdminLoggedIn = false; App.navigate('home'); Utils.showToast('Logout berhasil'); };
  },

  renderStats() {
    const s = MockData.getStockStats();
    const todayClaims = MockData.claimLogs.filter(l => new Date(l.claimedAt).toDateString() === new Date().toDateString()).length;
    document.getElementById('admin-stats').innerHTML = `
      <div class="stat-card total"><div class="stat-icon">📦</div><div class="stat-value">${s.total}</div><div class="stat-label">Total Stok</div></div>
      <div class="stat-card available"><div class="stat-icon">✅</div><div class="stat-value">${s.available}</div><div class="stat-label">Available</div></div>
      <div class="stat-card used"><div class="stat-icon">📋</div><div class="stat-value">${s.used}</div><div class="stat-label">Terpakai</div></div>
      <div class="stat-card"><div class="stat-icon">📊</div><div class="stat-value">${MockData.claimLogs.length}</div><div class="stat-label">Total Klaim</div></div>
    `;
  },

  setupTabs() {
    document.querySelectorAll('.admin-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`admin-${tab.dataset.tab}`)?.classList.add('active');
      });
    });
  },

  renderStockTab() {
    const container = document.getElementById('stock-table-body');
    if (!container) return;

    // Upload area
    const uploadArea = document.getElementById('upload-area');
    if (uploadArea) {
      uploadArea.addEventListener('click', () => this.simulateUpload());
      uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
      uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
      uploadArea.addEventListener('drop', (e) => { e.preventDefault(); uploadArea.classList.remove('dragover'); this.simulateUpload(); });
    }

    this.refreshStockTable();
  },

  refreshStockTable() {
    const tbody = document.getElementById('stock-table-body');
    if (!tbody) return;
    tbody.innerHTML = MockData.stockPool.map((s, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${s.email}</td>
        <td>${s.product}</td>
        <td><span class="badge-status ${s.status === 'available' ? 'badge-available' : 'badge-used'}">${s.status}</span></td>
        <td>${Utils.formatDateShort(s.uploadDate)}</td>
        <td>${s.claimedBy || '-'}</td>
      </tr>
    `).join('');
  },

  async simulateUpload() {
    const uploadArea = document.getElementById('upload-area');
    uploadArea.innerHTML = '<div class="payment-spinner" style="width:30px;height:30px;border-width:3px;margin:0 auto 12px"></div><p>Memproses file...</p>';
    await Utils.sleep(1500);

    const newAccounts = [
      { email: 'ytprem_new01@gmail.com', password: 'YtN3w01!', product: 'YouTube Premium 1 Bulan' },
      { email: 'ytprem_new02@gmail.com', password: 'YtN3w02!', product: 'YouTube Premium 1 Bulan' },
      { email: 'ytprem_new03@gmail.com', password: 'YtN3w03!', product: 'YouTube Premium 3 Bulan' },
      { email: 'sptfy_new01@gmail.com', password: 'SpN3w01!', product: 'Spotify Premium 1 Bulan' },
      { email: 'sptfy_new02@gmail.com', password: 'SpN3w02!', product: 'Spotify Premium 3 Bulan' },
    ];
    MockData.addBulkStock(newAccounts);

    uploadArea.innerHTML = `
      <div style="font-size:2.5rem;margin-bottom:12px">✅</div>
      <p style="color:var(--success);font-weight:600">${newAccounts.length} akun berhasil ditambahkan!</p>
      <p style="color:var(--text2);font-size:0.85rem;margin-top:8px">Klik untuk upload lagi</p>
    `;

    this.renderStats();
    this.refreshStockTable();
    Utils.showToast(`${newAccounts.length} akun baru berhasil diupload!`, 'success');

    setTimeout(() => {
      uploadArea.innerHTML = '<div class="upload-icon">📁</div><p>Klik atau drag file CSV/Excel ke sini</p><p style="font-size:0.8rem;color:var(--text2);margin-top:4px">Format: email, password, produk</p>';
    }, 3000);
  },

  renderLogTab() {
    this.refreshLogTable();
    const filterChannel = document.getElementById('filter-channel');
    const filterSearch = document.getElementById('filter-search');
    if (filterChannel) filterChannel.addEventListener('change', () => this.refreshLogTable());
    if (filterSearch) filterSearch.addEventListener('input', () => this.refreshLogTable());
  },

  refreshLogTable() {
    const tbody = document.getElementById('log-table-body');
    if (!tbody) return;
    const channelFilter = document.getElementById('filter-channel')?.value || 'all';
    const searchFilter = (document.getElementById('filter-search')?.value || '').toLowerCase();

    let logs = [...MockData.claimLogs].reverse();
    if (channelFilter !== 'all') logs = logs.filter(l => l.channel === channelFilter);
    if (searchFilter) logs = logs.filter(l => l.orderNo.toLowerCase().includes(searchFilter) || l.email.toLowerCase().includes(searchFilter));

    tbody.innerHTML = logs.map(l => `
      <tr>
        <td>${l.orderNo}</td>
        <td><span class="badge-status ${l.channel === 'Shopee' ? 'badge-shopee' : 'badge-web'}">${l.channel}</span></td>
        <td>${l.product}</td>
        <td>${l.buyerName || '-'}</td>
        <td>${l.email}</td>
        <td>${Utils.formatDate(l.claimedAt)}</td>
        <td>${l.expiryDate}</td>
        <td><span class="badge-status ${l.warrantyStatus === 'Active' ? 'badge-active' : 'badge-expired'}">${l.warrantyStatus}</span></td>
      </tr>
    `).join('') || '<tr><td colspan="8" style="text-align:center;color:var(--text2);padding:24px">Tidak ada data</td></tr>';
  },

  renderApiTab() {
    const testBtn = document.getElementById('api-test-btn');
    if (!testBtn) return;
    testBtn.addEventListener('click', async () => {
      testBtn.disabled = true;
      testBtn.innerHTML = 'Testing...';
      await Utils.sleep(2000);
      const dot = document.getElementById('api-status-dot');
      const text = document.getElementById('api-status-text');
      dot.className = 'status-dot online';
      text.textContent = 'Connected';
      text.style.color = 'var(--success)';
      testBtn.innerHTML = '🔗 Test Connection';
      testBtn.disabled = false;
      Utils.showToast('Koneksi API Shopee berhasil!', 'success');
    });

    const backupBtn = document.getElementById('backup-upload-btn');
    if (backupBtn) {
      backupBtn.addEventListener('click', async () => {
        backupBtn.disabled = true;
        backupBtn.textContent = 'Importing...';
        await Utils.sleep(1500);
        // Add a mock shopee order
        MockData.shopeeOrders.push({
          orderNo: '2406189999ZZZZZ', buyerName: 'Test Import', phone: '089912345678',
          productName: 'YouTube Premium 1 Bulan', claimed: false, orderDate: new Date().toISOString()
        });
        backupBtn.textContent = '📥 Import Excel Pesanan';
        backupBtn.disabled = false;
        Utils.showToast('1 pesanan Shopee berhasil diimport!', 'success');
      });
    }
  }
};
