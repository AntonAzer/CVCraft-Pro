let currentTemplate = 'classic';
let photoDataUrl = '';
let paymentCompleted = false;
let currentPaymentId = null;
let currentCvId = null;
let lastPaidContent = '';

const inputs = {};
const preview = {};

function bindCvInputs() {
  ['fullName', 'contact', 'headline', 'education', 'skills', 'experience', 'languages', 'certificates', 'hobbies', 'photo'].forEach((id) => {
    inputs[id] = document.getElementById(id);
  });

  Object.keys(inputs).forEach((key) => {
    if (key === 'photo') {
      inputs[key].addEventListener('change', handlePhotoUpload);
    } else {
      inputs[key].addEventListener('input', () => {
        updatePreview();
        checkContentOverflow(inputs, currentTemplate);
        resetPaymentIfContentChanged();
      });
    }
  });

  document.querySelectorAll('.template-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.template-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentTemplate = btn.dataset.template;
      renderTemplate(currentTemplate);
      updatePreview();
      checkContentOverflow(inputs, currentTemplate);
      resetPaymentIfContentChanged();
    });
  });
}

function currentCvData() {
  return {
    fullName: inputs.fullName.value,
    contact: inputs.contact.value,
    headline: inputs.headline.value,
    education: inputs.education.value,
    skills: inputs.skills.value,
    experience: inputs.experience.value,
    languages: inputs.languages.value,
    certificates: inputs.certificates.value,
    hobbies: inputs.hobbies.value,
    photo: photoDataUrl
  };
}

function generateContentHash() {
  return JSON.stringify({ ...currentCvData(), template: currentTemplate });
}

function resetPaymentIfContentChanged() {
  if (paymentCompleted && lastPaidContent && generateContentHash() !== lastPaidContent) {
    paymentCompleted = false;
    lastPaidContent = '';
    currentPaymentId = null;
    document.getElementById('payBtn').style.display = 'block';
    document.getElementById('paymentSuccess').style.display = 'none';
    showNotification('Content changed! Please make a new payment to download the updated CV.', 'info');
  }
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Please select a valid image file (JPG, PNG, GIF, etc.)');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    alert('Image file is too large. Please select an image smaller than 5MB.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    photoDataUrl = e.target.result;
    document.getElementById('photoPreview').innerHTML =
      `<img src="${photoDataUrl}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid #3498db;">`;
    updatePreview();
    resetPaymentIfContentChanged();
  };
  reader.onerror = () => alert('Error reading the image file. Please try again.');
  reader.readAsDataURL(file);
}

function updatePreview() {
  preview.name = document.getElementById('previewName');
  preview.contact = document.getElementById('previewContact');
  preview.headline = document.getElementById('previewHeadline');
  preview.education = document.getElementById('previewEducation');
  preview.skills = document.getElementById('previewSkills');
  preview.experience = document.getElementById('previewExperience');
  preview.languages = document.getElementById('previewLanguages');
  preview.certificates = document.getElementById('previewCertificates');
  preview.hobbies = document.getElementById('previewHobbies');

  const name = inputs.fullName.value || 'Your Name';
  const contact = inputs.contact.value || 'Email: your.email@example.com\nPhone: +1 (555) 123-4567';
  const headline = inputs.headline.value || 'Professional Headline';
  const education = inputs.education.value || 'Your education details will appear here';
  const skills = inputs.skills.value || 'Your skills will appear here';
  const experience = inputs.experience.value || 'Your work experience will appear here';
  const languages = inputs.languages.value;
  const certificates = inputs.certificates.value;
  const hobbies = inputs.hobbies.value;

  if (preview.name) preview.name.textContent = name;
  if (preview.contact) preview.contact.innerHTML = contact.replace(/\n/g, '<br>');
  if (preview.headline) preview.headline.textContent = headline;
  if (preview.education) preview.education.innerHTML = education.replace(/\n/g, '<br>');
  if (preview.skills) preview.skills.innerHTML = skills.replace(/\n/g, '<br>');
  if (preview.experience) preview.experience.innerHTML = experience.replace(/\n/g, '<br>');

  toggleOptionalSection('languagesSection', preview.languages, languages);
  toggleOptionalSection('certificatesSection', preview.certificates, certificates);
  toggleOptionalSection('hobbiesSection', preview.hobbies, hobbies);

  const photoElement = document.getElementById('previewPhoto');
  if (photoElement) {
    if (photoDataUrl) {
      photoElement.src = photoDataUrl;
      photoElement.style.display = 'block';
    } else {
      photoElement.style.display = 'none';
    }
  }
}

function toggleOptionalSection(sectionId, previewEl, value) {
  const section = document.getElementById(sectionId);
  if (value && value.trim()) {
    if (previewEl) previewEl.innerHTML = value.replace(/\n/g, '<br>');
    if (section) section.style.display = 'block';
  } else if (section) {
    section.style.display = 'none';
  }
}

/**
 * Payment flow:
 *  1. Save/update the CV in the backend so we have a cv_id.
 *  2. Ask the backend to create a "pending" payment row.
 *  3. Send the user to PayPal.
 *  4. (Simplified) ask the user to confirm they paid, then call the
 *     backend's /confirm endpoint. Replace this with a real PayPal webhook
 *     handler before taking real money - see payment.controller.js.
 */
async function processPayment() {
  if (!Api.isLoggedIn()) {
    showNotification('Please login to make a payment.', 'error');
    showAuthModal('login');
    return;
  }

  try {
    const cv = await saveCurrentCv();
    currentCvId = cv.id;

    const { payment } = await Api.createPendingPayment(currentCvId, 1.0);
    currentPaymentId = payment.id;

    window.open('https://www.paypal.com/ncp/payment/MBNT9PF7SW9CN', '_blank');
    showNotification('Redirecting to PayPal for secure payment...', 'info');

    setTimeout(() => {
      const completed = confirm('Have you completed the PayPal payment? Click OK if payment was successful, or Cancel to try again.');
      if (completed) {
        handlePaymentSuccess();
      } else {
        showNotification('Payment not completed. Please try again when ready.', 'info');
      }
    }, 3000);
  } catch (err) {
    showNotification(err.message || 'Could not start payment.', 'error');
  }
}

async function saveCurrentCv() {
  const name = (inputs.fullName.value || 'Untitled') + ' CV';
  const data = currentCvData();

  if (currentCvId) {
    const { cv } = await Api.updateCV(currentCvId, { name, template: currentTemplate, data });
    return cv;
  }
  const { cv } = await Api.createCV(name, currentTemplate, data);
  return cv;
}

async function handlePaymentSuccess() {
  try {
    if (currentPaymentId) {
      await Api.confirmPayment(currentPaymentId);
    }
    paymentCompleted = true;
    lastPaidContent = generateContentHash();

    document.getElementById('payBtn').style.display = 'none';
    document.getElementById('paymentSuccess').style.display = 'block';
    showNotification('Payment successful! You can now download your CV.', 'success');

    if (typeof loadUserData === 'function') loadUserData();
  } catch (err) {
    showNotification(err.message || 'Could not confirm payment.', 'error');
  }
}

async function downloadPDF() {
  if (!paymentCompleted) {
    alert('Please complete payment first to download your CV.');
    return;
  }

  const element = document.getElementById('cvPreview');
  const name = inputs.fullName.value || 'CV';
  const downloadBtn = document.querySelector('#paymentSuccess .download-btn');
  const originalText = downloadBtn.textContent;
  downloadBtn.textContent = '📄 Generating PDF...';
  downloadBtn.disabled = true;

  try {
    updatePreview();
    await new Promise((resolve) => setTimeout(resolve, 300));

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });

    const pageWidth = 210;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, imgHeight, '', 'FAST');
    pdf.save(`${name.replace(/\s+/g, '_')}_CV.pdf`);

    showNotification('CV downloaded successfully!', 'success');
  } catch (err) {
    console.error('PDF generation failed:', err);
    alert('PDF generation failed. Please try again.');
  } finally {
    downloadBtn.textContent = originalText;
    downloadBtn.disabled = false;
  }
}

function resetCvBuilderState() {
  currentCvId = null;
  currentPaymentId = null;
  paymentCompleted = false;
  lastPaidContent = '';
  document.getElementById('payBtn').style.display = 'block';
  document.getElementById('paymentSuccess').style.display = 'none';
}
