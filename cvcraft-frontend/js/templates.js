const TEMPLATE_LIMITS = {
  classic: { education: 4, experience: 8, skills: 6, languages: 3, certificates: 4, hobbies: 3, description: 'Traditional single-column layout with moderate space for each section.' },
  modern: { education: 5, experience: 10, skills: 8, languages: 4, certificates: 5, hobbies: 4, description: 'Two-column layout with sidebar for skills and languages, main area for experience.' },
  creative: { education: 4, experience: 7, skills: 5, languages: 3, certificates: 4, hobbies: 3, description: 'Colorful gradient design with sections in boxes - limited space per section.' },
  professional: { education: 3, experience: 6, skills: 4, languages: 2, certificates: 3, hobbies: 2, description: 'Corporate design with photo header - compact sections due to header space.' },
  premium: { education: 3, experience: 6, skills: 4, languages: 2, certificates: 3, hobbies: 2, description: 'Elegant design with large header and decorative elements - limited content space.' },
  executive: { education: 3, experience: 5, skills: 4, languages: 2, certificates: 3, hobbies: 2, description: 'Luxury design with prominent header - very limited space for content sections.' },
  traditional: { education: 4, experience: 8, skills: 6, languages: 3, certificates: 4, hobbies: 3, description: 'Classic formal layout with good balance of space for all sections.' },
  ats: { education: 6, experience: 12, skills: 8, languages: 4, certificates: 6, hobbies: 4, description: 'Plain text optimized for ATS systems - most space available for content.' },
  linkedin: { education: 4, experience: 8, skills: 6, languages: 3, certificates: 5, hobbies: 3, description: 'LinkedIn-style with blue header and professional sections layout.' }
};

function getTemplateLimits(template) {
  return TEMPLATE_LIMITS[template] || TEMPLATE_LIMITS.classic;
}

const STANDARD_OPTIONAL_SECTIONS = `
  <div class="cv-section" id="languagesSection" style="display: none;">
    <div class="cv-section-title">Languages</div>
    <div class="cv-section-content" id="previewLanguages"></div>
  </div>
  <div class="cv-section" id="certificatesSection" style="display: none;">
    <div class="cv-section-title">Certificates & Awards</div>
    <div class="cv-section-content" id="previewCertificates"></div>
  </div>
  <div class="cv-section" id="hobbiesSection" style="display: none;">
    <div class="cv-section-title">Hobbies & Interests</div>
    <div class="cv-section-content" id="previewHobbies"></div>
  </div>
`;

function coreSections() {
  return `
    <div class="cv-section">
      <div class="cv-section-title">Education</div>
      <div class="cv-section-content" id="previewEducation">Your education details will appear here</div>
    </div>
    <div class="cv-section">
      <div class="cv-section-title">Skills</div>
      <div class="cv-section-content" id="previewSkills">Your skills will appear here</div>
    </div>
    <div class="cv-section">
      <div class="cv-section-title">Experience</div>
      <div class="cv-section-content" id="previewExperience">Your work experience will appear here</div>
    </div>
    ${STANDARD_OPTIONAL_SECTIONS}
  `;
}

function renderTemplate(template) {
  const cvContent = document.getElementById('cvContent');
  cvContent.className = `template-${template}`;

  const simpleHeaderTemplates = {
    executive: `
      <div class="cv-header">
        <img id="previewPhoto" class="cv-photo" style="display: none;">
        <div class="cv-name" id="previewName">Your Name</div>
        <div style="font-style: italic; margin-bottom: 10px; color: rgba(255,255,255,0.8); text-align: center;" id="previewHeadline">Professional Headline</div>
        <div class="cv-contact" id="previewContact">your.email@example.com | +1 (555) 123-4567</div>
      </div>
      <div class="cv-body">${coreSections()}</div>
    `,
    traditional: `
      <div class="cv-header">
        <img id="previewPhoto" class="cv-photo" style="display: none;">
        <div class="cv-name" id="previewName">Your Name</div>
        <div style="font-style: italic; margin-bottom: 10px; color: #666;" id="previewHeadline">Professional Headline</div>
        <div class="cv-contact" id="previewContact">your.email@example.com | +1 (555) 123-4567</div>
      </div>
      ${coreSections()}
    `,
    ats: `
      <div class="cv-header">
        <div class="cv-name" id="previewName">Your Name</div>
        <div style="font-style: italic; margin-bottom: 8px; color: #333;" id="previewHeadline">Professional Headline</div>
        <div class="cv-contact" id="previewContact">your.email@example.com | +1 (555) 123-4567</div>
      </div>
      ${coreSections()}
    `,
    linkedin: `
      <div class="cv-header">
        <div class="cv-header-content">
          <img id="previewPhoto" class="cv-photo" style="display: none;">
          <div class="cv-header-text">
            <div class="cv-name" id="previewName">Your Name</div>
            <div class="cv-headline" id="previewHeadline">Professional Headline</div>
            <div class="cv-contact" id="previewContact">your.email@example.com | +1 (555) 123-4567</div>
          </div>
        </div>
      </div>
      <div class="cv-body">${coreSections()}</div>
    `,
    professional: `
      <div class="cv-header">
        <img id="previewPhoto" class="cv-photo" style="display: none;">
        <div class="cv-header-text">
          <div class="cv-name" id="previewName">Your Name</div>
          <div style="font-style: italic; margin-bottom: 10px; color: rgba(255,255,255,0.8);" id="previewHeadline">Professional Headline</div>
          <div class="cv-contact" id="previewContact">your.email@example.com | +1 (555) 123-4567</div>
        </div>
      </div>
      <div class="cv-body">${coreSections()}</div>
    `,
    premium: `
      <div class="cv-header">
        <img id="previewPhoto" class="cv-photo" style="display: none;">
        <div class="cv-name" id="previewName">Your Name</div>
        <div style="font-style: italic; margin-bottom: 10px; color: rgba(255,255,255,0.8); text-align: center;" id="previewHeadline">Professional Headline</div>
        <div class="cv-contact" id="previewContact">your.email@example.com | +1 (555) 123-4567</div>
      </div>
      <div class="cv-body">${coreSections()}</div>
    `,
    creative: `
      <div class="cv-content">
        <div class="cv-header">
          <img id="previewPhoto" class="cv-photo" style="display: none;">
          <div class="cv-name" id="previewName">Your Name</div>
          <div style="font-style: italic; margin-bottom: 10px; color: rgba(255,255,255,0.9);" id="previewHeadline">Professional Headline</div>
          <div class="cv-contact" id="previewContact">your.email@example.com | +1 (555) 123-4567</div>
        </div>
        ${coreSections()}
      </div>
    `,
    classic: `
      <div class="cv-header">
        <img id="previewPhoto" class="cv-photo" style="display: none;">
        <div class="cv-name" id="previewName">Your Name</div>
        <div style="font-style: italic; margin-bottom: 10px; color: #666;" id="previewHeadline">Professional Headline</div>
        <div class="cv-contact" id="previewContact">Email: your.email@example.com<br>Phone: +1 (555) 123-4567<br>LinkedIn: linkedin.com/in/yourname</div>
      </div>
      ${coreSections()}
    `
  };

  if (template === 'modern') {
    cvContent.innerHTML = `
      <div class="cv-sidebar">
        <img id="previewPhoto" class="cv-photo" style="display: none;">
        <div class="cv-name" id="previewName">Your Name</div>
        <div style="font-style: italic; margin-bottom: 15px; color: rgba(255,255,255,0.8); font-size: 0.9rem; text-align: center;" id="previewHeadline">Professional Headline</div>
        <div class="cv-contact" id="previewContact"><div>your.email@example.com</div><div>+1 (555) 123-4567</div></div>
        <div class="cv-section">
          <div class="cv-section-title">Skills</div>
          <div class="cv-section-content" id="previewSkills">Your skills will appear here</div>
        </div>
        <div class="cv-section" id="languagesSection" style="display: none;">
          <div class="cv-section-title">Languages</div>
          <div class="cv-section-content" id="previewLanguages"></div>
        </div>
      </div>
      <div class="cv-main">
        <div class="cv-section">
          <div class="cv-section-title">Education</div>
          <div class="cv-section-content" id="previewEducation">Your education details will appear here</div>
        </div>
        <div class="cv-section">
          <div class="cv-section-title">Experience</div>
          <div class="cv-section-content" id="previewExperience">Your work experience will appear here</div>
        </div>
        <div class="cv-section" id="certificatesSection" style="display: none;">
          <div class="cv-section-title">Certificates & Awards</div>
          <div class="cv-section-content" id="previewCertificates"></div>
        </div>
        <div class="cv-section" id="hobbiesSection" style="display: none;">
          <div class="cv-section-title">Hobbies & Interests</div>
          <div class="cv-section-content" id="previewHobbies"></div>
        </div>
      </div>
    `;
  } else {
    cvContent.innerHTML = simpleHeaderTemplates[template] || simpleHeaderTemplates.classic;
  }
}

function analyzeContentLines(inputs) {
  const countLines = (text) => (text && text.trim() ? text.trim().split('\n').length : 0);
  return {
    education: countLines(inputs.education.value),
    experience: countLines(inputs.experience.value),
    skills: countLines(inputs.skills.value),
    languages: countLines(inputs.languages.value),
    certificates: countLines(inputs.certificates.value),
    hobbies: countLines(inputs.hobbies.value)
  };
}

function checkContentOverflow(inputs, currentTemplate) {
  const warningDiv = document.getElementById('overflowWarning');
  const messageDiv = document.getElementById('overflowMessage');
  if (!warningDiv || !messageDiv) return;

  const limits = getTemplateLimits(currentTemplate);
  const lines = analyzeContentLines(inputs);
  const labels = {
    education: ['📚', 'Education section'],
    experience: ['💼', 'Work Experience'],
    skills: ['🛠️', 'Skills section'],
    languages: ['🌍', 'Languages section'],
    certificates: ['🏆', 'Certificates section'],
    hobbies: ['🎯', 'Hobbies section']
  };

  const warnings = [];
  Object.keys(labels).forEach((key) => {
    if (lines[key] > limits[key] && lines[key] > 0) {
      const [icon, label] = labels[key];
      warnings.push(`${icon} <strong>${label}:</strong> ${lines[key]} lines (recommended: ${limits[key]} lines max)`);
    }
  });

  if (warnings.length > 0) {
    messageDiv.innerHTML = `
      <div style="margin-bottom: 10px;">Your content may not fit properly in the <strong>${currentTemplate.charAt(0).toUpperCase() + currentTemplate.slice(1)}</strong> template:</div>
      ${warnings.join('<br>')}
      <div style="margin-top: 12px; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 5px; font-size: 0.9rem;">
        <strong>Template Info:</strong> ${limits.description}
      </div>
    `;
    warningDiv.style.display = 'block';
  } else {
    warningDiv.style.display = 'none';
  }
}
