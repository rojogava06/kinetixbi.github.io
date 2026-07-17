/**
 * KinetixBI - Internal CRM & AI Simulation
 */

const crm = {
  clients: [
    // Dummy past clients for the dashboard
    { id: 'DG-2026-0001', name: 'TechLogix', status: 'Entregado', date: '2026-01-15' },
    { id: 'DG-2026-0012', name: 'Restaurante La Estación', status: 'En Diseño', date: '2026-05-20' },
  ],

  init() {
    this.renderClientList();
  },

  refresh() {
    this.renderClientList();
  },

  processNewClient(data) {
    const newId = `DG-2026-00${this.clients.length + 18}`;
    const companyName = data.companyInfo?.name || 'Cliente Nuevo';
    
    let briefData = {};
    
    if (data.isMaturityTest) {
      const rec = data.maturityResults.tier === 'Optimizado / Líder Digital' 
        ? 'Empresa líder. Ofrecer Soporte y Evolución Avanzado.'
        : 'Se requiere optimizar dimensiones con baja puntuación. Ofrecer Consultoría Estratégica.';
        
      briefData = {
        ...data,
        aiAnalysis: {
          complexity: data.maturityResults.score > 3.5 ? 'Baja (Soporte)' : 'Media-Alta (Re-estructuración)',
          recommendation: rec,
          timeEstimate: '4-8 semanas',
          budgetCategory: data.maturityResults.score < 2.5 ? 'Alto (Requiere inversión)' : 'Medio (Evolución)'
        }
      };
    } else {
      // Simulate AI generation of brief
      const complexity = data.features?.length > 3 ? '85%' : '45%';
      const aiRecommendation = data.objectives?.includes('Vender productos') 
        ? 'Proyecto recomendado: E-commerce Corporativo + Meta Ads.'
        : 'Proyecto recomendado: Landing Page Corporativa + SEO Básico.';
      
      const timeEstimate = data.features?.length > 3 ? '6 semanas' : '3 semanas';
      const budgetCategory = data.budget?.amount === '+3000' ? 'Alto (Enterprise)' : 'Estándar';
      
      briefData = {
        ...data,
        aiAnalysis: {
          complexity,
          recommendation: aiRecommendation,
          timeEstimate,
          budgetCategory
        }
      };
    }

    const newClient = {
      id: newId,
      name: companyName,
      status: 'Pendiente',
      date: new Date().toISOString().split('T')[0],
      briefData: briefData
    };

    this.clients.unshift(newClient);
    this.renderClientList();
    this.showClientDetail(newClient.id);
  },

  renderClientList() {
    const listContainer = document.getElementById('crm-client-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    
    this.clients.forEach(client => {
      const statusColor = client.status === 'Pendiente' ? 'var(--warning)' : 
                          client.status === 'En Diseño' ? 'var(--accent)' : 'var(--success)';
                          
      const el = document.createElement('div');
      el.className = 'glass-card';
      el.style.padding = '1rem';
      el.style.cursor = 'pointer';
      el.style.marginBottom = '0.5rem';
      
      el.innerHTML = `
        <div class="flex justify-between items-center mb-2">
          <span style="font-size: 0.75rem; color: var(--text-tertiary);">${client.id}</span>
          <span style="font-size: 0.7rem; padding: 0.2rem 0.5rem; border-radius: 4px; background: rgba(255,255,255,0.05); color: ${statusColor}; border: 1px solid ${statusColor};">${client.status}</span>
        </div>
        <div style="font-weight: 600; font-size: 1rem;">${client.name}</div>
        <div style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 0.5rem;">Fecha: ${client.date}</div>
      `;
      
      el.onclick = () => this.showClientDetail(client.id);
      listContainer.appendChild(el);
    });
  },

  showClientDetail(id) {
    const client = this.clients.find(c => c.id === id);
    const detailContainer = document.getElementById('crm-client-detail');
    if (!detailContainer || !client) return;

    if (!client.briefData) {
      detailContainer.innerHTML = `<div style="text-align: center; color: var(--text-tertiary); padding-top: 5rem;">No hay análisis de IA disponible para expedientes antiguos.</div>`;
      return;
    }

    // Custom view for Maturity Test leads
    if (client.briefData.isMaturityTest) {
      const results = client.briefData.maturityResults;
      const finalScore = results.score.toFixed(1);
      const companyInfo = client.briefData.companyInfo;
      const aiAnalysis = client.briefData.aiAnalysis;

      detailContainer.innerHTML = `
        <div class="flex justify-between items-center" style="margin-bottom: 2rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem;">
          <div>
            <h2 style="font-size: 1.5rem; margin-bottom: 0.25rem;">Expediente: ${client.name}</h2>
            <span style="color: var(--text-tertiary); font-size: 0.85rem;">${client.id} | Lead de Test de Maduración Digital</span>
          </div>
          <button class="btn btn-outline" style="font-size: 0.8rem; padding: 0.5rem 1rem;" onclick="alert('Exportando PDF simulado de diagnóstico...')">📄 Exportar PDF</button>
        </div>

        <!-- Resumen Ejecutivo de Madurez -->
        <div style="margin-bottom: 2rem; background: rgba(6, 182, 212, 0.05); border-left: 3px solid var(--accent); padding: 1.5rem; border-radius: 0 var(--radius-md) var(--radius-md) 0; text-align: left;">
          <h3 style="color: var(--accent); margin-bottom: 1rem; font-size: 1.1rem;">📊 Diagnóstico de Madurez Digital</h3>
          <p style="font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--text-primary);"><strong>Contacto:</strong> ${companyInfo.userName} (${companyInfo.email})</p>
          <p style="font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--text-primary);"><strong>Puntuación Global:</strong> <span style="color: var(--accent); font-weight: 700;">${finalScore} / 5.0</span> (${results.tier})</p>
          <p style="font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--text-primary);"><strong>Recomendación Comercial:</strong> ${aiAnalysis.recommendation}</p>
        </div>

        <!-- Detalle de Puntuaciones por Dimensión -->
        <div class="glass-card" style="background: rgba(255,255,255,0.02); padding: 2rem; margin-bottom: 2rem; text-align: left;">
          <h3 style="color: #fff; margin-bottom: 1.5rem; font-size: 1.2rem;">Puntaje por Dimensiones (Escala 0-10)</h3>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${Object.entries(results.dimensionAvgs).map(([dimId, score]) => {
              const nameMap = {
                estrategia: "Estrategia",
                personas: "Personas",
                procesos: "Procesos",
                tecnologia: "Tecnología",
                clientes: "Clientes"
              };
              const name = nameMap[dimId] || (dimId.charAt(0).toUpperCase() + dimId.slice(1));
              const scoreNormalized = ((score / 10) * 4 + 1).toFixed(1);
              return `
                <div style="display: flex; justify-content: space-between; font-size: 0.9rem; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 0.5rem;">
                  <span style="color: var(--text-secondary);">${name}:</span>
                  <span style="font-weight: 600; color: var(--accent);">${score.toFixed(1)} / 10.0 (${scoreNormalized} / 5.0)</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Recomendaciones Generadas -->
        <div class="glass-card" style="background: rgba(255,255,255,0.02); padding: 2rem; text-align: left;">
          <h3 style="color: #fff; margin-bottom: 1rem; font-size: 1.2rem;">Hoja de Ruta Recomendada</h3>
          <ul style="font-size: 0.9rem; color: var(--text-secondary); padding-left: 1.5rem; list-style-type: square;">
            ${results.recommendations.map(rec => `<li style="margin-bottom: 0.75rem;">${rec}</li>`).join('')}
          </ul>
        </div>
      `;
      return;
    }

    const { aiAnalysis, objectives, features, design } = client.briefData;

    detailContainer.innerHTML = `
      <div class="flex justify-between items-center" style="margin-bottom: 2rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem;">
        <div>
          <h2 style="font-size: 1.5rem; margin-bottom: 0.25rem;">Expediente: ${client.name}</h2>
          <span style="color: var(--text-tertiary); font-size: 0.85rem;">${client.id} | Generado por Inteligencia Artificial</span>
        </div>
        <button class="btn btn-outline" style="font-size: 0.8rem; padding: 0.5rem 1rem;" onclick="alert('Exportando PDF simulado...')">📄 Exportar PDF</button>
      </div>

      <!-- Resumen Ejecutivo -->
      <div style="margin-bottom: 2rem; background: rgba(99, 102, 241, 0.05); border-left: 3px solid var(--primary); padding: 1.5rem; border-radius: 0 var(--radius-md) var(--radius-md) 0;">
        <h3 style="color: var(--primary); margin-bottom: 1rem; font-size: 1.1rem;">⚡ Resumen Ejecutivo (30s)</h3>
        <p style="font-size: 0.95rem; margin-bottom: 0.5rem;"><strong>Recomendación IA:</strong> ${aiAnalysis.recommendation}</p>
        <p style="font-size: 0.95rem; margin-bottom: 0.5rem;"><strong>Nivel de Complejidad:</strong> ${aiAnalysis.complexity} | <strong>Tiempo Estimado:</strong> ${aiAnalysis.timeEstimate}</p>
        <p style="font-size: 0.95rem; margin-bottom: 0;"><strong>Objetivos Clave:</strong> ${objectives && objectives.length ? objectives.join(', ') : 'Definición pendiente'}</p>
      </div>

      <!-- Brief Document -->
      <div class="glass-card" style="background: rgba(255,255,255,0.02); padding: 2.5rem;">
        <div style="text-align: center; margin-bottom: 3rem; border-bottom: 1px solid var(--border-highlight); padding-bottom: 2rem;">
          <h1 style="font-size: 2rem; color: var(--text-primary); letter-spacing: 0.05em; text-transform: uppercase;">Brief de Transformación Digital</h1>
          <p style="color: var(--text-secondary); margin-top: 0.5rem;">Preparado para: <strong>${client.name}</strong></p>
          <p style="color: var(--text-tertiary); font-size: 0.8rem; margin-top: 1rem;">Documento generado automáticamente por KinetixBI AI</p>
        </div>
        
        <h3 style="color: var(--accent); margin-bottom: 1rem; font-size: 1.2rem;">1. Dirección de Diseño</h3>
        <p style="margin-bottom: 2rem; font-size: 0.95rem; color: var(--text-secondary);">
          Estilo seleccionado: <strong>${design?.style || 'No especificado'}</strong>.<br>
          La interfaz será diseñada enfocada en transmitir profesionalismo según la identidad de marca ingresada.
        </p>

        <h3 style="color: var(--accent); margin-bottom: 1rem; font-size: 1.2rem;">2. Arquitectura de Funcionalidades</h3>
        <ul style="margin-bottom: 2rem; font-size: 0.95rem; color: var(--text-secondary); padding-left: 1.5rem; list-style-type: square;">
          ${features && features.length ? features.map(f => `<li style="margin-bottom: 0.5rem;">Integración módulo: ${f}</li>`).join('') : '<li>Solo componentes estándar seleccionados.</li>'}
        </ul>

        <h3 style="color: var(--accent); margin-bottom: 1rem; font-size: 1.2rem;">3. Próximos Pasos (Generados por IA)</h3>
        <p style="font-size: 0.95rem; color: var(--text-secondary);">
          1. El equipo de KinetixBI revisará este brief.<br>
          2. Se enviará una cotización final basada en la estimación de <strong>${aiAnalysis.budgetCategory}</strong>.<br>
          3. Una vez aprobada, el cliente tendrá acceso al <strong>Centro de Seguimiento</strong>.
        </p>
      </div>
    `;
  }
};
