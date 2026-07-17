/**
 * KinetixBI - Core App Logic (SPA Router)
 */

const app = {
  currentView: 'landing',

  init() {
    console.log("KinetixBI initialized.");
    // Initial routing based on hash or default to landing
    const hash = window.location.hash.replace('#', '');
    if (['landing', 'onboarding', 'crm', 'hub', 'maturity-test'].includes(hash)) {
      this.navigateTo(hash);
    } else {
      this.navigateTo('landing');
    }

    // Initialize modules
    if (typeof onboarding !== 'undefined') onboarding.init();
    if (typeof crm !== 'undefined') crm.init();
    if (typeof hub !== 'undefined') hub.init();
    if (typeof maturityTest !== 'undefined') maturityTest.init();
    
    this.initScrollAnimations();
  },

  initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.scroll-anim').forEach(el => {
      observer.observe(el);
    });
  },

  navigateTo(viewId) {
    // Hide all views
    document.querySelectorAll('.view-section').forEach(section => {
      section.classList.remove('active');
    });

    // Show target view
    const target = document.getElementById(`view-${viewId}`);
    if (target) {
      target.classList.add('active');
      this.currentView = viewId;
      window.scrollTo(0, 0);
      
      // Update hash silently if needed, or leave it for clean URL
      if(viewId !== 'landing') {
          history.pushState(null, null, `#${viewId}`);
      } else {
          history.pushState(null, null, window.location.pathname);
      }
    }

    // Trigger view-specific refreshes
    if (viewId === 'crm' && typeof crm !== 'undefined') crm.refresh();
    if (viewId === 'hub' && typeof hub !== 'undefined') hub.refresh();
    if (viewId === 'maturity-test' && typeof maturityTest !== 'undefined') maturityTest.render();
  }
};

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
