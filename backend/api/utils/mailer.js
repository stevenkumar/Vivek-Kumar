import nodemailer from 'nodemailer'

/**
 * Creates a Nodemailer transporter using Gmail SMTP by default.
 * Falls back to a console simulator when credentials are not configured.
 */
const createTransporter = () => {
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS

  if (!user || !pass) {
    console.warn('⚠️ EMAIL_USER or EMAIL_PASS not configured. Emails will be simulated in console.')
    return null
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
}

/**
 * Sends an email using Nodemailer.
 * If credentials are missing, logs the email to console (useful in development).
 */
export const sendMail = async ({ to, subject, text, html, replyTo }) => {
  const transporter = createTransporter()
  const fromAddress = process.env.EMAIL_USER || 'portfolio@local.dev'

  const mailOptions = {
    from: `"Vivek Kumar Portfolio" <${fromAddress}>`,
    to: to || process.env.EMAIL_TO || process.env.EMAIL_USER,
    subject,
    ...(replyTo ? { replyTo } : {}),
    ...(html ? { html } : {}),
    ...(text ? { text } : {}),
  }

  if (!transporter) {
    console.log('\n📧 [SIMULATED EMAIL DISPATCH]')
    console.log(`To: ${mailOptions.to}`)
    console.log(`Reply-To: ${mailOptions.replyTo || 'N/A'}`)
    console.log(`Subject: ${mailOptions.subject}`)
    console.log(`Content:\n${text || 'HTML Content'}\n`)
    return { simulated: true, messageId: 'simulated-' + Date.now() }
  }

  const info = await transporter.sendMail(mailOptions)
  console.log(`✅ Email sent successfully: ${info.messageId}`)
  return info
}
