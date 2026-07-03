/**
 * KinetixBI - Onboarding Flow (Interactive Questionnaire)
 */

const onboarding = {
  currentStep: 1,
  totalSteps: 7,
  data: {
    companyInfo: {},
    objectives: [],
    audience: {},
    brandIdentity: [],
    design: {},
    inspiration: [],
    content: {},
    features: [],
    marketing: {},
    ai: [],
    budget: {}
  },

  steps: [
    {
      title: "Paso 1: Conozcamos tu empresa",
      fields: `
        <div class="input-group">
          <label class="input-label">Nombre de la empresa</label>
          <input type="text" id="q-name" class="input-field" placeholder="Ej. Kinetix Solutions">
        </div>
        <div class="input-group">
          <label class="input-label">¿A qué se dedica tu empresa y qué productos/servicios ofreces?</label>
          <textarea id="q-activity" class="textarea-field" placeholder="Describe brevemente tu actividad..."></textarea>
        </div>
        <div class="input-group">
          <label class="input-label">¿Cuánto tiempo lleva operando?</label>
          <input type="text" id="q-time" class="input-field" placeholder="Ej. 2 años">
        </div>
        <div class="input-group">
          <label class="input-label">¿Cuál es tu principal ventaja frente a la competencia?</label>
          <input type="text" id="q-advantage" class="input-field" placeholder="Ej. Atención al cliente, tecnología propia...">
        </div>
      `
    },
    {
      title: "Paso 2: Define tus objetivos y Público",
      fields: `
        <div class="input-group">
          <label class="input-label" style="margin-bottom: 0.75rem;">¿Qué deseas lograr con esta página?</label>
          <div class="check-card-grid">
            <label class="check-card"><input type="checkbox" name="q-obj" value="Conseguir clientes"><div class="check-indicator"></div><span>Conseguir clientes</span></label>
            <label class="check-card"><input type="checkbox" name="q-obj" value="Vender productos"><div class="check-indicator"></div><span>Vender productos</span></label>
            <label class="check-card"><input type="checkbox" name="q-obj" value="Generar confianza"><div class="check-indicator"></div><span>Generar confianza</span></label>
            <label class="check-card"><input type="checkbox" name="q-obj" value="Automatizar procesos"><div class="check-indicator"></div><span>Automatizar procesos</span></label>
          </div>
        </div>
        <div class="input-group">
          <label class="input-label">¿Quién compra tus servicios? (Edad aproximada, ¿Empresas o personas?)</label>
          <input type="text" id="q-audience" class="input-field" placeholder="Ej. Empresas tecnológicas B2B">
        </div>
      `
    },
    {
      title: "Paso 3: Identidad y Estilo Visual",
      fields: `
        <div class="input-group">
          <label class="input-label" style="margin-bottom: 0.75rem;">¿Cómo quieres que te perciban?</label>
          <div class="check-card-grid">
            <label class="check-card"><input type="checkbox" name="q-brand" value="Profesional"><div class="check-indicator"></div><span>Profesional</span></label>
            <label class="check-card"><input type="checkbox" name="q-brand" value="Innovador"><div class="check-indicator"></div><span>Innovador</span></label>
            <label class="check-card"><input type="checkbox" name="q-brand" value="Premium"><div class="check-indicator"></div><span>Premium</span></label>
            <label class="check-card"><input type="checkbox" name="q-brand" value="Tecnológico"><div class="check-indicator"></div><span>Tecnológico</span></label>
          </div>
        </div>
        <div class="input-group">
          <label class="input-label">¿Qué estilo visual prefieres?</label>
          <select id="q-style" class="input-field">
            <option value="Futurista">Futurista (Dark, Neón)</option>
            <option value="Minimalista">Minimalista (Limpio, Blanco)</option>
            <option value="Corporativo">Corporativo (Clásico, Confiable)</option>
            <option value="Luxury">Luxury (Premium, Elegante)</option>
          </select>
        </div>
        <div class="input-group">
          <label class="input-label">Animaciones (1: Sobria, 5: Muy dinámica)</label>
          <input type="range" id="q-animations" min="1" max="5" value="3" style="width: 100%;">
        </div>
      `
    },
    {
      title: "Paso 4: Funcionalidades",
      fields: `
        <div class="input-group">
          <label class="input-label" style="margin-bottom: 0.75rem;">¿Qué funciones necesitas integrar?</label>
          <div class="check-card-grid">
            <label class="check-card"><input type="checkbox" name="q-features" value="WhatsApp"><div class="check-indicator"></div><span>WhatsApp Bot</span></label>
            <label class="check-card"><input type="checkbox" name="q-features" value="Agenda"><div class="check-indicator"></div><span>Agenda Automática</span></label>
            <label class="check-card"><input type="checkbox" name="q-features" value="Pagos"><div class="check-indicator"></div><span>Pagos Online</span></label>
            <label class="check-card"><input type="checkbox" name="q-features" value="CRM"><div class="check-indicator"></div><span>Panel CRM</span></label>
            <label class="check-card"><input type="checkbox" name="q-features" value="SEO"><div class="check-indicator"></div><span>SEO Avanzado</span></label>
          </div>
        </div>
      `
    },
    {
      title: "Paso 5: Inteligencia Artificial (Diferenciador)",
      fields: `
        <div class="input-group">
          <label class="input-label" style="margin-bottom: 0.75rem;">¿Qué procesos te gustaría que una IA automatice?</label>
          <div class="check-card-grid">
            <label class="check-card"><input type="checkbox" name="q-ai" value="Responder clientes"><div class="check-indicator"></div><span>Responder clientes</span></label>
            <label class="check-card"><input type="checkbox" name="q-ai" value="Generar reportes"><div class="check-indicator"></div><span>Generar reportes</span></label>
            <label class="check-card"><input type="checkbox" name="q-ai" value="Crear contenido"><div class="check-indicator"></div><span>Crear contenido</span></label>
            <label class="check-card"><input type="checkbox" name="q-ai" value="Seguimiento comercial"><div class="check-indicator"></div><span>Seguimiento comercial</span></label>
          </div>
        </div>
      `
    },
    {
      title: "Paso 6: Presupuesto y Tiempos",
      fields: `
        <div class="input-group">
          <label class="input-label">Presupuesto estimado</label>
          <select id="q-budget" class="input-field">
            <option value="500-1000">USD 500 – 1,000</option>
            <option value="1000-3000">USD 1,000 – 3,000</option>
            <option value="+3000">Más de USD 3,000 (Enterprise)</option>
            <option value="proposal">Prefiero recibir propuesta</option>
          </select>
        </div>
        <div class="input-group">
          <label class="input-label">¿Cuándo necesitas el proyecto?</label>
          <select id="q-timeline" class="input-field">
            <option value="asap">Lo antes posible</option>
            <option value="1month">En menos de un mes</option>
            <option value="3months">En 1-3 meses</option>
          </select>
        </div>
      `
    },
    {
      title: "Paso 7: Revisión y Envio",
      fields: `
        <div style="text-align: center; padding: 2rem 0;">
          <h3 style="font-size: 1.5rem; color: var(--accent); margin-bottom: 1rem;">¡Casi listo!</h3>
          <p style="color: var(--text-secondary); margin-bottom: 2rem;">
            Nuestra IA analizará tus respuestas para generar tu Brief Profesional y tu expediente en nuestro CRM interno.
          </p>
          <div class="glass-card" style="display: inline-block; padding: 1rem 2rem; border-color: var(--primary);">
            Al hacer clic en "Enviar", tu proyecto será procesado inmediatamente.
          </div>
        </div>
      `
    }
  ],

  init() {
    this.renderStep();
  },

  renderStep() {
    const stepData = this.steps[this.currentStep - 1];
    document.getElementById('onboarding-step-text').innerText = `Paso ${this.currentStep} de ${this.totalSteps}`;
    
    // Update progress bar
    const progress = (this.currentStep / this.totalSteps) * 100;
    document.getElementById('onboarding-progress').style.width = `${progress}%`;

    // Render fields
    const container = document.getElementById('onboarding-content');
    container.innerHTML = `
      <h3 style="font-size: 1.25rem; color: var(--text-primary); margin-bottom: 1.5rem;">${stepData.title}</h3>
      <div style="animation: fade-in 0.4s ease-out;">
        ${stepData.fields}
      </div>
    `;

    // Buttons visibility
    const prevBtn = document.getElementById('btn-prev-step');
    const nextBtn = document.getElementById('btn-next-step');

    prevBtn.style.visibility = this.currentStep === 1 ? 'hidden' : 'visible';
    
    if (this.currentStep === this.totalSteps) {
      nextBtn.innerText = "✨ Enviar y Generar Brief";
      nextBtn.style.background = "linear-gradient(135deg, var(--accent), var(--primary))";
    } else {
      nextBtn.innerText = "Continuar";
      nextBtn.style.background = "linear-gradient(135deg, var(--primary), var(--secondary))";
    }
  },

  saveCurrentData() {
    // Basic data gathering based on step
    if (this.currentStep === 1) {
      this.data.companyInfo.name = document.getElementById('q-name')?.value || 'Empresa XYZ';
      this.data.companyInfo.activity = document.getElementById('q-activity')?.value || '';
    }
    if (this.currentStep === 2) {
      const objCheckboxes = document.querySelectorAll('input[name="q-obj"]:checked');
      this.data.objectives = Array.from(objCheckboxes).map(cb => cb.value);
    }
    if (this.currentStep === 3) {
      this.data.design.style = document.getElementById('q-style')?.value || 'Futurista';
    }
    if (this.currentStep === 4) {
      const fCheckboxes = document.querySelectorAll('input[name="q-features"]:checked');
      this.data.features = Array.from(fCheckboxes).map(cb => cb.value);
    }
    if (this.currentStep === 6) {
      this.data.budget.amount = document.getElementById('q-budget')?.value || '500-1000';
    }
  },

  nextStep() {
    this.saveCurrentData();
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.renderStep();
    } else {
      this.submitForm();
    }
  },

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.renderStep();
    }
  },

  submitForm() {
    // Pass data to CRM module to simulate AI processing
    if(typeof crm !== 'undefined') {
      crm.processNewClient(this.data);
    }
    // Navigate to CRM Dashboard to show the magic
    app.navigateTo('crm');
    
    // Reset onboarding
    this.currentStep = 1;
    this.renderStep();
  }
};
