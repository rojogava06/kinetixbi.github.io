/**
 * KinetixBI - Client Project Hub
 */

const hub = {
  currentStage: 0,
  
  stages: [
    { title: "Descubrimos tu negocio", desc: "Etapa de consultoría y levantamiento de requerimientos." },
    { title: "Diseñamos la estrategia", desc: "Elaboración del plan de transformación digital." },
    { title: "Construimos tu solución digital", desc: "Desarrollo de la plataforma y configuración tecnológica." },
    { title: "Validación y Optimización", desc: "Presentación del proyecto y ajustes finales." },
    { title: "Lanzamiento del Proyecto", desc: "Entrega oficial y despliegue a producción." },
    { title: "Tu empresa ya forma parte del ecosistema digital", desc: "¡Transformación exitosa!" }
  ],

  init() {
    this.render();
  },

  refresh() {
    this.render();
  },

  setStage(stageIndex) {
    if(stageIndex >= 0 && stageIndex < this.stages.length) {
      this.currentStage = stageIndex;
      this.render();
    }
  },

  render() {
    this.renderTimeline();
    this.renderInfoCard();
  },

  renderTimeline() {
    const timelineContainer = document.getElementById('hub-timeline');
    if (!timelineContainer) return;

    let html = '';
    
    this.stages.forEach((stage, index) => {
      let statusClass = 'pending';
      if (index < this.currentStage) statusClass = 'completed';
      if (index === this.currentStage) statusClass = 'active';

      html += `
        <div class="timeline-item ${statusClass}">
          <div class="timeline-icon"></div>
          <div class="timeline-content">
            <h4>${stage.title}</h4>
            ${statusClass === 'active' ? `<p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem;">${stage.desc}</p>` : ''}
          </div>
        </div>
      `;
    });

    timelineContainer.innerHTML = html;
  },

  renderInfoCard() {
    const infoContainer = document.getElementById('hub-info-card');
    if (!infoContainer) return;

    // Calculate percentage based on current stage (0 to 5)
    let percentage = (this.currentStage / (this.stages.length - 1)) * 100;
    
    // Custom logic for specific stages as requested by user
    let headerHtml = `
      <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.5rem; color: var(--text-primary); margin-bottom: 0.5rem;">
          Bienvenido, Cliente 👋
        </h3>
        <p style="color: var(--text-tertiary); font-size: 0.9rem;">
          Empresa: <strong>Tu Empresa XYZ</strong> | Proyecto: <strong>Transformación Digital</strong>
        </p>
      </div>
    `;

    let progressHtml = `
      <div style="margin-bottom: 2rem;">
        <div class="flex justify-between items-end mb-2">
          <span style="font-size: 0.9rem; font-weight: 500; color: var(--text-secondary);">Estado General</span>
          <span style="font-size: 1.25rem; font-weight: 700; color: var(--accent);">${Math.round(percentage)}%</span>
        </div>
        <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden;">
          <div style="height: 100%; width: ${percentage}%; background: linear-gradient(90deg, var(--primary), var(--accent)); transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);"></div>
        </div>
      </div>
    `;

    let bodyHtml = '';

    // Stage 3 is "Validación y Optimización" (Index 3)
    if (this.currentStage === 3) {
      bodyHtml = `
        <div class="glass-card" style="background: rgba(99, 102, 241, 0.05); border-color: var(--primary);">
          <h4 style="color: var(--primary); font-size: 1.2rem; margin-bottom: 1rem;">Validación del Proyecto</h4>
          <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.95rem;">
            Tu solución digital ya se encuentra prácticamente terminada. En esta etapa realizaremos una única reunión virtual para presentarte el resultado y será necesaria tu aprobación para continuar.
          </p>
          <div class="flex gap-4">
            <button class="btn btn-primary" onclick="hub.handleValidation('approve')">✅ Aprobar y Lanzar</button>
            <button class="btn btn-outline" onclick="hub.handleValidation('changes')">📝 Solicitar Cambios</button>
          </div>
          <p id="validation-msg" style="margin-top: 1rem; font-size: 0.85rem; color: var(--warning); display: none;"></p>
        </div>
      `;
    } 
    // Stage 5 is "Tu empresa ya forma parte del ecosistema digital" (Final - Index 5)
    else if (this.currentStage === 5) {
      bodyHtml = `
        <div style="text-align: center; padding: 2rem 0; animation: fade-in 1s ease-out;">
          <div style="font-size: 4rem; margin-bottom: 1rem; animation: float 3s infinite;">🚀</div>
          <h4 style="color: var(--success); font-size: 1.5rem; margin-bottom: 1rem;">¡Proyecto Finalizado con Éxito!</h4>
          <p style="color: var(--text-secondary); max-width: 400px; margin: 0 auto; font-size: 1rem;">
            Tu transformación digital ha sido completada con éxito. ¡Bienvenido al ecosistema digital!
          </p>
          <div class="glass-card" style="margin-top: 2rem; display: inline-block; padding: 1rem 2rem; border-color: var(--success);">
            Contáctanos con tu código de proyecto (<strong>DG-2026-0018</strong>) y te entregamos todo lo necesario para poner en marcha tu negocio. ¡Da el gran paso!
          </div>
        </div>
      `;
    } 
    // Other stages
    else {
      bodyHtml = `
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
          <h4 style="font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--text-primary);">
            Etapa Actual: ${this.stages[this.currentStage].title}
          </h4>
          <p style="color: var(--text-tertiary); font-size: 0.95rem;">
            Nuestro equipo se encuentra trabajando en esta fase. En este momento no es necesaria ninguna acción por tu parte. Te notificaremos cuando avancemos.
          </p>
        </div>
      `;
    }

    infoContainer.innerHTML = headerHtml + progressHtml + bodyHtml;
  },

  handleValidation(action) {
    const msgEl = document.getElementById('validation-msg');
    if(action === 'approve') {
      msgEl.style.color = 'var(--success)';
      msgEl.innerText = "✅ Proyecto aprobado. Nuestro equipo iniciará la etapa de lanzamiento.";
      msgEl.style.display = 'block';
      setTimeout(() => {
        this.setStage(4); // Move to launch
      }, 2000);
    } else {
      msgEl.style.color = 'var(--warning)';
      msgEl.innerText = "📝 Cambios registrados. Nuestro equipo implementará los ajustes...";
      msgEl.style.display = 'block';
    }
  }
};
