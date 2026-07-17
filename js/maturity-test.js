/**
 * KinetixBI - Digital Maturity Test Module (5 Pillars & Radar Chart Edition)
 */

const maturityTest = {
  currentStep: 1, // 1 to 5 for questionnaire steps, 6 for lead form, 7 for results
  totalSteps: 7,
  answers: {}, // Keyed by question ID: score (0-10)
  
  pillars: {
    1: "Visión y Cultura Digital",
    2: "Infraestructura y Procesos Digitales"
  },

  dimensions: [
    {
      id: "personas",
      pillarId: 1,
      name: "Personas",
      description: "Personas evalúa el compromiso directivo, las competencias digitales de los colaboradores y la gestión del cambio.",
      questions: [
        { id: "per_1", text: "Los directivos están comprometidos y lideran activamente la transformación digital." },
        { id: "per_2", text: "Los colaboradores poseen las competencias digitales necesarias para sus funciones." },
        { id: "per_3", text: "Se gestiona de manera efectiva la resistencia al cambio en el personal." }
      ]
    },
    {
      id: "procesos",
      pillarId: 2,
      name: "Procesos",
      description: "Procesos analiza la eficiencia operativa y el nivel de automatización para evitar flujos manuales y demoras.",
      questions: [
        { id: "pro_1", text: "Se tienen identificados y mapeados los procesos que generan demoras o cuellos de botella." },
        { id: "pro_2", text: "Es eficiente el uso de recursos operativos para el cumplimiento de objetivos." },
        { id: "pro_3", text: "Se están eliminando los procesos manuales repetitivos a través de automatizaciones." }
      ]
    },
    {
      id: "tecnologia",
      pillarId: 2,
      name: "Tecnología",
      description: "Tecnología evalúa si las herramientas actuales y la inversión en software responden a las necesidades del negocio.",
      questions: [
        { id: "tec_1", text: "Se cuenta con un presupuesto anual dedicado a la inversión en tecnología y software." },
        { id: "tec_2", text: "Las herramientas tecnológicas actuales soportan adecuadamente las iniciativas digitales." },
        { id: "tec_3", text: "Las plataformas de hardware y software se integran fácilmente sin crear silos de información." }
      ]
    },
    {
      id: "clientes",
      pillarId: 1,
      name: "Clientes",
      description: "Clientes analiza la digitalización de los canales de venta, servicio y la experiencia de usuario general.",
      questions: [
        { id: "cli_1", text: "Se ofrece una experiencia digital fluida en todos los puntos de contacto con el cliente." },
        { id: "cli_2", text: "Los canales digitales son clave para la captación de clientes y el modelo de negocio." },
        { id: "cli_3", text: "Se recopila y analiza el feedback digital de los clientes para mejorar los productos/servicios." }
      ]
    },
    {
      id: "estrategia",
      pillarId: 1,
      name: "Estrategia",
      description: "La estrategia examina la integración de la transformación digital en el plan estratégico a largo plazo.",
      questions: [
        { id: "est_1", text: "Se cuenta con una estrategia explícita de transformación digital." },
        { id: "est_2", text: "Se está implementando la estrategia de transformación digital." },
        { id: "est_3", text: "Se hace seguimiento y evaluación de la estrategia de transformación digital." }
      ]
    }
  ],

  init() {
    this.resetTest();
  },

  resetTest() {
    this.currentStep = 1;
    this.answers = {};
    // Pre-populate with default value of 5 for each question to avoid unanswered errors
    this.dimensions.forEach(dim => {
      dim.questions.forEach(q => {
        this.answers[q.id] = 5;
      });
    });
    this.render();
  },

  render() {
    const container = document.getElementById('maturity-test-content');
    if (!container) return;

    if (this.currentStep <= 5) {
      this.renderQuestionnaireStep(container);
    } else if (this.currentStep === 6) {
      this.renderLeadFormStep(container);
    } else if (this.currentStep === 7) {
      this.renderResultsStep(container);
    }
  },

  renderQuestionnaireStep(container) {
    const dimIndex = this.currentStep - 1;
    const dim = this.dimensions[dimIndex];
    const pillarName = this.pillars[dim.pillarId];

    // Dynamic Navigation Header
    document.getElementById('maturity-step-text').innerText = `Dimensión ${this.currentStep} de 5`;
    const progressPercent = (this.currentStep / 5) * 100;
    document.getElementById('maturity-progress').style.width = `${progressPercent}%`;

    let html = `
      <div class="maturity-test-container fade-in-element">
        <!-- Pillar Banner -->
        <div class="pillar-header">
          <h4 class="pillar-title">${pillarName}</h4>
        </div>

        <!-- Dimension Block -->
        <div class="dimension-block">
          <div class="dimension-pill">${dim.name}</div>
          <div class="dimension-description">${dim.description}</div>
        </div>

        <!-- Question List -->
        <div class="questions-list">
    `;

    dim.questions.forEach(q => {
      const currentVal = this.answers[q.id];
      html += `
        <div class="question-row">
          <div class="question-text">${q.text}</div>
          <div class="options-scroll-container">
            <div class="options-grid">
      `;

      for (let i = 0; i <= 10; i++) {
        const checked = currentVal === i ? 'checked' : '';
        html += `
          <label class="option-column" onclick="maturityTest.setAnswer('${q.id}', ${i})">
            <div class="radio-dot-wrapper">
              <input type="radio" name="radio-${q.id}" class="radio-dot-input" value="${i}" ${checked}>
              <div class="radio-dot-visual"></div>
            </div>
            <span class="option-number">${i}</span>
          </label>
        `;
      }

      html += `
            </div>
          </div>
        </div>
      `;
    });

    html += `
        </div>

        <!-- Navigation Buttons -->
        <div class="test-navigation">
          <button class="btn btn-outline" id="btn-mt-prev" onclick="maturityTest.prevStep()" ${this.currentStep === 1 ? 'style="visibility:hidden;"' : ''}>Atrás</button>
          <button class="btn btn-primary" id="btn-mt-next" onclick="maturityTest.nextStep()">Siguiente</button>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  setAnswer(qId, val) {
    this.answers[qId] = parseInt(val);
    
    // Explicitly update radio states visually if clicked
    const radioInputs = document.getElementsByName(`radio-${qId}`);
    radioInputs.forEach(input => {
      if (parseInt(input.value) === val) {
        input.checked = true;
      }
    });
  },

  renderLeadFormStep(container) {
    document.getElementById('maturity-step-text').innerText = `Generar Informe`;
    document.getElementById('maturity-progress').style.width = `100%`;

    container.innerHTML = `
      <div class="maturity-test-container fade-in-element lead-form-box" style="text-align: center; padding: 2rem 0;">
        <h3 class="text-gradient" style="font-size: 1.8rem; margin-bottom: 1rem;">¡Test Finalizado!</h3>
        <p style="color: var(--text-secondary); margin-bottom: 2.5rem; line-height: 1.6;">
          Ingresa los datos de tu empresa para procesar los resultados en nuestro CRM e Inteligencia Artificial y generar tu reporte detallado de madurez digital.
        </p>
        
        <div class="glass-card" style="text-align: left; padding: 2rem;">
          <div class="input-group">
            <label class="input-label">Nombre de tu Empresa *</label>
            <input type="text" id="mt-company-name" class="input-field" placeholder="Ej. Kinetix Solutions" required>
          </div>
          <div class="input-group">
            <label class="input-label">Tu Nombre *</label>
            <input type="text" id="mt-user-name" class="input-field" placeholder="Ej. Carlos Mendoza" required>
          </div>
          <div class="input-group">
            <label class="input-label">Correo Electrónico *</label>
            <input type="email" id="mt-email" class="input-field" placeholder="Ej. contacto@tuempresa.com" required>
          </div>

          <div style="margin-top: 2rem; display: flex; justify-content: space-between; gap: 1rem;">
            <button class="btn btn-outline" style="flex: 1;" onclick="maturityTest.prevStep()">Atrás</button>
            <button class="btn btn-primary" style="flex: 2;" onclick="maturityTest.submitLeadForm()">Ver Resultados</button>
          </div>
        </div>
      </div>
    `;
  },

  renderResultsStep(container) {
    document.getElementById('maturity-step-text').innerText = `Resultado del Diagnóstico`;
    document.getElementById('maturity-progress').style.width = `100%`;

    const scores = this.calculateScores();
    const finalScore = scores.finalScore.toFixed(1);
    
    // SVG Radar Chart Pentágono
    const radarSVG = this.generateRadarChartSVG(scores);

    let html = `
      <div class="maturity-test-container results-dashboard fade-in-element">
        <h2 class="text-gradient-cyber" style="font-size: 2.2rem; text-align: center; margin-bottom: 1rem;">Diagnóstico Finalizado</h2>

        <!-- Dashboard Layout: Left descriptive assessment & Radar, Right progress bars & gauge -->
        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 3rem; margin-bottom: 3rem; align-items: start;">
          
          <!-- Column 1: Descriptive assessment and Radar Chart -->
          <div class="glass-card" style="padding: 2rem; text-align: center;">
            <h3 style="font-size: 1.3rem; margin-bottom: 1rem; color: #ffffff; text-align: left;">
              ${scores.tierName}
            </h3>
            <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.7; text-align: justify; margin-bottom: 2rem; font-family: var(--font-body);">
              ${scores.tierDescription}
            </p>

            <!-- Legend similar to the screenshot -->
            <div style="display: flex; align-items: center; justify-content: center; gap: 0.6rem; margin-bottom: 1rem; font-size: 0.85rem;">
              <span style="display: inline-block; width: 22px; height: 11px; border: 2px solid var(--accent); background: rgba(6, 182, 212, 0.15); border-radius: 2px;"></span>
              <span style="color: var(--text-secondary); font-weight: 500;">Puntaje por dimensión</span>
            </div>

            <!-- Radar SVG -->
            <div style="display: flex; justify-content: center;">
              ${radarSVG}
            </div>
          </div>

          <!-- Column 2: Numeric gauge and progress bars -->
          <div class="flex flex-col gap-6">
            <!-- Numeric gauge -->
            <div class="glass-card" style="padding: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 140px; height: 140px;">
                <svg style="width: 140px; height: 140px; transform: rotate(-90deg);">
                  <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="10" />
                  <circle cx="70" cy="70" r="60" fill="none" stroke="url(#results-gauge-gradient)" stroke-width="10" 
                          stroke-dasharray="377" stroke-dashoffset="${377 - (377 * ((scores.finalScore - 1) / 4))}" 
                          stroke-linecap="round" style="transition: stroke-dashoffset 1.5s ease-in-out;" />
                  <defs>
                    <linearGradient id="results-gauge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="var(--accent)" />
                      <stop offset="100%" stop-color="var(--primary)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style="position: absolute; display: flex; flex-direction: column; align-items: center;">
                  <span style="font-size: 2.2rem; font-weight: 800; color: #fff; line-height: 1;">${finalScore}</span>
                  <span style="font-size: 0.75rem; color: var(--text-tertiary); text-transform: uppercase; margin-top: 0.2rem;">de 5.0</span>
                </div>
              </div>
              <div class="maturity-level-badge" style="color: ${scores.tierColor}; border-color: ${scores.tierColor}40; background: ${scores.tierColor}08; margin-top: 1.25rem;">
                Calificación General
              </div>
            </div>

            <!-- Progress Bars -->
            <div class="glass-card" style="padding: 2rem;">
              <h3 style="font-size: 1.1rem; margin-bottom: 1.5rem; color: #fff;">Desglose del Nivel</h3>
              <div class="dimensions-progress-container">
                ${this.dimensions.map((dim, idx) => {
                  const dimAvg = scores.dimensionAvgs[dim.id];
                  const dimNormalized = ((dimAvg / 10) * 4 + 1).toFixed(1);
                  const widthPercent = (dimAvg / 10) * 100;
                  return `
                    <div class="dimension-progress-row">
                      <div class="dimension-progress-label">
                        <span>${dim.name}</span>
                        <span class="dim-score">${dimNormalized} / 5.0</span>
                      </div>
                      <div class="progress-track">
                        <div class="progress-fill dim-${idx}" style="width: ${widthPercent}%"></div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
          
        </div>

        <!-- Personalized Recommendations -->
        <div class="recommendations-box">
          <h3 class="recommendations-title">
            <svg style="width: 22px; height: 22px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364.364l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
            Hoja de Ruta Tecnológica Recomendada
          </h3>
          <ul class="recommendations-list">
            ${scores.recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>

        <!-- CTA Section -->
        <div class="results-cta-card">
          <h3 class="text-gradient" style="font-size: 1.75rem; margin-bottom: 0.75rem;">¿Deseas acelerar tu transformación digital?</h3>
          <p style="color: var(--text-secondary); max-width: 550px; margin: 0 auto 2rem; line-height: 1.6;">
            Hemos guardado tu diagnóstico en nuestro sistema. El equipo comercial de KinetixBI revisará tus resultados y creará un Brief de Consultoría personalizado sin coste alguno.
          </p>
          <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <button class="btn btn-outline" onclick="maturityTest.resetTest()">Reiniciar Test</button>
            <button class="btn btn-primary" onclick="app.navigateTo('onboarding')">Iniciar Consultoría Guiada</button>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  generateRadarChartSVG(scores) {
    const cx = 175;
    const cy = 170;
    const maxR = 100;
    const angles = [];
    // 5 vertices for a pentagon
    for (let i = 0; i < 5; i++) {
      angles.push(-Math.PI / 2 + i * (2 * Math.PI / 5));
    }

    // Grid pentagons for levels 1, 2, 3, 4, 5
    let gridHTML = '';
    for (let j = 1; j <= 5; j++) {
      const r = maxR * (j / 5);
      const points = angles.map(theta => {
        const x = cx + r * Math.cos(theta);
        const y = cy + r * Math.sin(theta);
        return `${x},${y}`;
      }).join(' ');
      
      gridHTML += `<polygon points="${points}" class="radar-grid-line" />\n`;
      
      // Level numbers on vertical axis (theta = -PI/2)
      const labelY = cy - r;
      gridHTML += `<text x="${cx}" y="${labelY + 11}" class="radar-grid-value">${j}</text>\n`;
    }

    // Axis lines
    let axisHTML = '';
    angles.forEach(theta => {
      const x = cx + maxR * Math.cos(theta);
      const y = cy + maxR * Math.sin(theta);
      axisHTML += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" class="radar-axis-line" />\n`;
    });

    // Score Polygon
    // 0: Personas, 1: Procesos, 2: Tecnología, 3: Clientes, 4: Estrategia
    const dimOrder = ["personas", "procesos", "tecnologia", "clientes", "estrategia"];
    const scorePoints = angles.map((theta, i) => {
      const dimId = dimOrder[i];
      const avg = scores.dimensionAvgs[dimId] || 5; // 0 to 10
      const score = (avg / 10) * 5; // 0 to 5
      const r = maxR * (score / 5);
      const x = cx + r * Math.cos(theta);
      const y = cy + r * Math.sin(theta);
      return `${x},${y}`;
    });
    const scorePointsStr = scorePoints.join(' ');
    
    // Dot markers at scores
    let dotsHTML = '';
    angles.forEach((theta, i) => {
      const dimId = dimOrder[i];
      const avg = scores.dimensionAvgs[dimId] || 5;
      const score = (avg / 10) * 5;
      const r = maxR * (score / 5);
      const x = cx + r * Math.cos(theta);
      const y = cy + r * Math.sin(theta);
      dotsHTML += `<circle cx="${x}" cy="${y}" r="4" class="radar-score-dot" />\n`;
    });

    // Labels positioned nicely
    const labels = [
      { text: "Personas", anchor: "middle", offset: 15 },
      { text: "Procesos", anchor: "start", offset: 18 },
      { text: "Tecnología", anchor: "start", offset: 18 },
      { text: "Clientes", anchor: "end", offset: 18 },
      { text: "Estrategia", anchor: "end", offset: 18 }
    ];
    
    let labelsHTML = '';
    angles.forEach((theta, i) => {
      const label = labels[i];
      const x = cx + (maxR + label.offset) * Math.cos(theta);
      const y = cy + (maxR + label.offset) * Math.sin(theta);
      let dy = "0.35em";
      if (i === 0) dy = "-0.2em"; // Top label shifted up
      if (i === 2 || i === 3) dy = "0.80em"; // Bottom labels shifted down
      
      labelsHTML += `<text x="${x}" y="${y}" dy="${dy}" text-anchor="${label.anchor}" class="radar-label">${label.text}</text>\n`;
    });

    return `
      <svg viewBox="0 0 350 340" class="radar-chart-svg" style="width:100%; max-width:320px; height:auto;">
        <defs>
          <radialGradient id="radar-glow-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.15" />
            <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.35" />
          </radialGradient>
        </defs>
        <!-- Grid -->
        ${gridHTML}
        <!-- Axis -->
        ${axisHTML}
        <!-- Score Area -->
        <polygon points="${scorePointsStr}" fill="url(#radar-glow-grad)" class="radar-score-poly" />
        <!-- Score dots -->
        ${dotsHTML}
        <!-- Labels -->
        ${labelsHTML}
      </svg>
    `;
  },

  calculateScores() {
    const dimensionSums = {};
    const dimensionAvgs = {};
    
    // Calculate average for each dimension
    this.dimensions.forEach(dim => {
      let sum = 0;
      dim.questions.forEach(q => {
        sum += this.answers[q.id];
      });
      dimensionSums[dim.id] = sum;
      dimensionAvgs[dim.id] = sum / dim.questions.length; // Average from 0 to 10
    });

    // Total average from 0 to 10
    let totalSum = 0;
    this.dimensions.forEach(dim => {
      totalSum += dimensionAvgs[dim.id];
    });
    const overallAvg = totalSum / this.dimensions.length; // Range 0 to 10
    
    // Normalize to 1-5 scale: (avg / 10) * 4 + 1
    const finalScore = (overallAvg / 10) * 4 + 1;

    // Determine tier, color and descriptions exactly matching the user's slide details
    let tierName = "Nivel Inicial: Reactivo";
    let tierColor = "var(--danger)";
    let tierDescription = "En este nivel, la organización tiene un desarrollo digital incipiente. Los procesos son altamente manuales y no existe una estrategia formal ni presupuesto dedicado a la tecnología. La cultura presenta alta resistencia al cambio y los canales son tradicionales.";
    let tier = "Inicial";

    if (finalScore >= 4.3) {
      tier = "Optimizado / Líder Digital";
      tierName = "Nivel Líder Digital: Optimizado";
      tierColor = "var(--success)";
      tierDescription = "En este nivel, la innovación digital es parte del ADN del negocio. Los procesos están 100% automatizados y optimizados con agentes inteligentes. Existe soberanía tecnológica y una cultura ágil que se adapta instantáneamente a las tendencias del mercado global, liderando el sector en transformación.";
    } else if (finalScore >= 3.5) {
      tier = "Avanzado";
      tierName = "Nivel Avanzado: Integrado";
      tierColor = "var(--accent)";
      tierDescription = "En este nivel, la organización cuenta con procesos integrados y toma decisiones basadas en datos de forma sistemática. Se han implementado automatizaciones clave e Inteligencia Artificial en áreas críticas. La experiencia digital del cliente está consolidada y hay un claro liderazgo enfocado en la evolución continua.";
    } else if (finalScore >= 2.7) {
      tier = "Desarrollado";
      tierName = "Nivel Intermedio: En Desarrollo.";
      tierColor = "#4ea3a3"; // Greenish teal from the slide
      tierDescription = "En este nivel, la organización empieza a fortalecer su transformación digital. La visión está bien definida y alineada con la estrategia general de la organización. La cultura digital está más arraigada con una aceptación generalizada de la digitalización en todos los niveles de la organización. Los líderes son proactivos en la promoción y apoyo a las iniciativas digitales. La infraestructura y los procesos digitales pueden estar bien desarrollados, con tecnologías integradas que permiten una alta eficiencia y una automatización significativa de los procesos operativos. La inversión en tecnología es constante y orientada a largo plazo. Se consolida una gobernanza digital fuerte y hay utilización regular de indicadores digitales para guiar la toma de decisiones. La organización oferta una gama de productos y servicios digitales, y los canales digitales se han convertido en una parte crucial del modelo de negocio.";
    } else if (finalScore >= 1.9) {
      tier = "Básico";
      tierName = "Nivel Básico: Silos Digitales";
      tierColor = "var(--warning)";
      tierDescription = "En este nivel, existen esfuerzos digitales aislados. Se utilizan herramientas básicas en algunos departamentos, pero sin integración ni alineación estratégica. El liderazgo reconoce la importancia de lo digital, pero la cultura aún carece de competencias clave.";
    }

    // Determine recommendations based on lowest dimension scores (< 6 is low maturity)
    const recs = [];
    if (dimensionAvgs["estrategia"] < 6) {
      recs.push("<strong>Estrategia:</strong> Diseñar una hoja de ruta formal de transformación digital a 3 y 5 años con hitos trimestrales y KPIs medibles vinculados al retorno de inversión (ROI).");
    } else {
      recs.push("<strong>Estrategia:</strong> Integrar y automatizar el monitoreo de tus planes estratégicos digitales en tiempo real con tableros de Business Intelligence.");
    }

    if (dimensionAvgs["personas"] < 6) {
      recs.push("<strong>Personas:</strong> Reducir la resistencia al cambio tecnológico mediante talleres prácticos de adopción digital y planes de incentivos que involucren activamente a la plantilla operativa.");
    } else {
      recs.push("<strong>Personas:</strong> Promover el liderazgo digital en puestos intermedios para facilitar la adopción ágil de nuevas herramientas de productividad.");
    }

    if (dimensionAvgs["procesos"] < 6) {
      recs.push("<strong>Procesos:</strong> Romper silos operativos. Auditar los sistemas actuales para consolidar la información mediante APIs y desplegar agentes autónomos de IA para optimizar procesos repetitivos e ineficientes.");
    }

    if (dimensionAvgs["tecnologia"] < 6) {
      recs.push("<strong>Tecnología:</strong> Auditar si las herramientas tecnológicas actuales responden a las necesidades reales del negocio y planificar la migración de sistemas legacy obsoletos.");
    }

    if (dimensionAvgs["clientes"] < 6) {
      recs.push("<strong>Clientes:</strong> Optimizar la experiencia digital del cliente en todos los puntos de contacto e integrar canales de retroalimentación en tiempo real.");
    }

    // fallback
    if (recs.length === 0) {
      recs.push("<strong>Optimización General:</strong> Continuar innovando mediante la experimentación de tecnologías de frontera (Modelos avanzados de Inteligencia Artificial Generativa y Automatización Robótica).");
    }

    return {
      dimensionAvgs,
      finalScore,
      tier,
      tierName,
      tierColor,
      tierDescription,
      recommendations: recs
    };
  },

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.render();
      window.scrollTo(0, 0);
    }
  },

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.render();
      window.scrollTo(0, 0);
    }
  },

  submitLeadForm() {
    const companyName = document.getElementById('mt-company-name')?.value;
    const userName = document.getElementById('mt-user-name')?.value;
    const email = document.getElementById('mt-email')?.value;

    if (!companyName || !userName || !email) {
      alert("Por favor, completa todos los campos requeridos (*).");
      return;
    }

    const scores = this.calculateScores();

    const leadData = {
      isMaturityTest: true,
      companyInfo: {
        name: companyName,
        userName: userName,
        email: email,
        activity: `Cliente registrado mediante el Test de Maduración Digital. Nivel: ${scores.tier}`
      },
      maturityResults: {
        score: scores.finalScore,
        tier: scores.tier,
        dimensionAvgs: scores.dimensionAvgs,
        recommendations: scores.recommendations
      }
    };

    if (typeof crm !== 'undefined') {
      crm.processNewClient(leadData);
    }

    this.currentStep = 7;
    this.render();
  }
};
