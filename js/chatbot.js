function toggleChatbot() {
  const chatbotWindow = document.getElementById('chatbotWindow');
  chatbotWindow.style.display = chatbotWindow.style.display === 'flex' ? 'none' : 'flex';
}

function handleChatbotEnter(event) {
  if (event.key === 'Enter') sendChatbotMessage();
}

function sendChatbotMessage() {
  const input = document.getElementById('chatbotInput');
  const messagesContainer = document.getElementById('chatbotMessages');
  const message = input.value.trim();
  if (!message) return;

  const userMessage = document.createElement('div');
  userMessage.className = 'chatbot-message user';
  userMessage.textContent = message;
  messagesContainer.appendChild(userMessage);
  input.value = '';
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  setTimeout(() => {
    const botMessage = document.createElement('div');
    botMessage.className = 'chatbot-message bot';
    botMessage.innerHTML = generateBotResponse(message);
    messagesContainer.appendChild(botMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 800);
}

function generateBotResponse(userMessage) {
  const msg = userMessage.toLowerCase();

  if (msg.includes('overflow') || msg.includes('fit') || msg.includes('space')) {
    return "⚠️ <strong>Content Overflow:</strong> each template has a recommended line limit per section. If you type more than that, a red warning appears above the preview. Shorten the text, use bullet points, or switch to a roomier template like ATS Optimized or Modern.";
  }
  if (msg.includes('which template') || msg.includes('recommend')) {
    return "🎯 <strong>Recommendations:</strong> lots of experience → ATS Optimized/Modern · creative field → Creative/Modern · corporate → Professional/Executive · entry level → Classic/Traditional · online applications → ATS Optimized.";
  }
  if (msg.includes('privacy') || msg.includes('secure') || msg.includes('safe')) {
    return "🔒 Your CV data is stored under your account and only visible to you. Passwords are hashed, never stored in plain text.";
  }
  if (msg.includes('payment') || msg.includes('pay') || msg.includes('cost') || msg.includes('refund')) {
    return "💳 CV generation costs $1.00, paid via PayPal. Each payment unlocks one download; editing the CV after paying will require a new payment.";
  }
  if (msg.includes('template') || msg.includes('design')) {
    return "🎨 There are 9 templates: Classic, Modern, Creative, Professional, Premium, Executive, Traditional, ATS Optimized, and LinkedIn — each with different space and style.";
  }
  if (msg.includes('tips') || msg.includes('advice') || msg.includes('write') || msg.includes('resume')) {
    return "✍️ Use bullet points, action verbs, and quantify achievements. Keep to your last ~10 years of experience and match keywords from the job description.";
  }
  if (msg.includes('download') || msg.includes('pdf')) {
    return "📄 After payment, click 'Download Your CV Now' to get a high-resolution PDF sized for A4 printing.";
  }
  if (msg.includes('photo') || msg.includes('picture')) {
    return "📸 Upload a professional headshot (JPG/PNG, under 5MB). Note the ATS template hides photos on purpose, for tracking-system compatibility.";
  }
  if (msg.includes('ats')) {
    return "🤖 The ATS Optimized template uses plain formatting, no photo, and standard headings so applicant tracking systems can parse it reliably.";
  }
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return "👋 Hi! Ask me about templates, content limits, payments, or CV writing tips.";
  }
  if (msg.includes('thank')) {
    return "😊 You're welcome — good luck with the job hunt!";
  }
  return "🤔 I'm not sure about that one, but I can help with template choice, content limits, payments, privacy, or CV writing tips.";
}
