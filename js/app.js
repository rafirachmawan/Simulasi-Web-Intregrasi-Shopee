// ========================================
// App Router & Navigation
// ========================================
const App = {
  currentPage: 'home',
  isAdminLoggedIn: false,

  init() {
    this.setupNavigation();
    this.setupMobileMenu();
    this.navigate('home');
    this.createParticles();
  },

  setupNavigation() {
    document.querySelectorAll('[data-navigate]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigate(el.getAttribute('data-navigate'));
      });
    });
  },

  navigate(page, data = null) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`page-${page}`);
    if (!target) return;
    target.classList.add('active');
    this.currentPage = page;

    document.querySelectorAll('.nav-link').forEach(l => {
      l.classList.toggle('active', l.getAttribute('data-navigate') === page);
    });

    // Close mobile menu
    document.querySelector('.nav-links')?.classList.remove('open');
    document.querySelector('.mobile-menu-toggle')?.classList.remove('open');

    switch (page) {
      case 'home': Catalog.init(); break;
      case 'checkout': Catalog.initCheckout(data); break;
      case 'claim': Claim.init(); break;
      case 'admin-login': Admin.initLogin(); break;
      case 'admin-dashboard':
        if (!this.isAdminLoggedIn) { this.navigate('admin-login'); return; }
        Admin.initDashboard(); break;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  createParticles() {
    const c = document.querySelector('.particles');
    if (!c) return;
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 20 + 's';
      p.style.animationDuration = (15 + Math.random() * 20) + 's';
      p.style.width = p.style.height = (2 + Math.random() * 6) + 'px';
      c.appendChild(p);
    }
  },

  setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav-links');
    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        nav.classList.toggle('open');
        toggle.classList.toggle('open');
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
