// ========================================
// Utility Functions
// ========================================

const Utils = {
  formatRupiah(n) {
    return 'Rp ' + n.toLocaleString('id-ID');
  },
  formatDate(d) {
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  },
  formatDateShort(d) {
    return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  },
  generateInvoice() {
    const ds = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    return `INV-${ds}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
  },
  sleep(ms) { return new Promise(r => setTimeout(r, ms)); },
  getLast4(phone) { return phone.slice(-4); },
  showToast(msg, type = 'success') {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    t.innerHTML = `<span>${icons[type] || ''}</span> <span>${msg}</span>`;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3000);
  },
  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => this.showToast('Berhasil disalin!')).catch(() => {});
  }
};
