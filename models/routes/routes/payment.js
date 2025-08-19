const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Webhook من PayPal لتأكيد الدفع
router.post('/paypal-webhook', async (req, res) => {
  const { custom, payment_status } = req.body; // custom = userId
  if (payment_status === 'Completed') {
    await User.findByIdAndUpdate(custom, { hasPaid: true });
  }
  res.sendStatus(200);
});

// إنشاء رابط دفع PayPal
router.get('/create-payment/:userId', (req, res) => {
  const userId = req.params.userId;

  // حط هنا حساب PayPal بتاعك بدلاً من YOUR_PAYPAL_EMAIL
 const payLink = `https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_xclick&business=YOUR_PAYPAL_EMAIL&amount=1&currency_code=USD&custom=${userId}&notify_url=https://cvcraft-pro-production.up.railway.app/success.html`;

  
  // مفيش حاجة ضروري في return_url لو عايز الشكل نفسه، لكن لو عايز يرجع بعد الدفع ممكن تضيف:
  // &return=http://localhost:3000/download/${userId}
  
  res.redirect(payLink);
});

module.exports = router;

