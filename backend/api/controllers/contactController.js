import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { sendMail } from '../utils/mailer.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MESSAGES_PATH = path.join(__dirname, '..', 'data', 'messages.json')

const readMessages = () => {
  try {
    if (fs.existsSync(MESSAGES_PATH)) {
      const data = fs.readFileSync(MESSAGES_PATH, 'utf-8')
      return JSON.parse(data)
    }
  } catch (err) {
    console.error('Error reading messages.json:', err)
  }
  return []
}

const writeMessages = (messages) => {
  try {
    fs.writeFileSync(MESSAGES_PATH, JSON.stringify(messages, null, 2), 'utf-8')
  } catch (err) {
    console.error('Error writing messages.json:', err)
  }
}

/**
 * Public Contact Form Submission Handler
 */
export const sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, number, message } = req.body

    // Input validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields.',
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      })
    }

    const recipient = process.env.EMAIL_TO || process.env.EMAIL_USER || 'vkvseri@gmail.com'
    const subject = `📬 New Portfolio Inquiry from ${name.trim()}`
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'medium' })

    // 1. Save message to file-based inbox (Zero database)
    const newMessage = {
      id: Date.now(),
      _id: `msg-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      number: number ? number.trim() : '',
      message: message.trim(),
      createdAt: new Date().toISOString(),
      isRead: false,
    }

    const messages = readMessages()
    messages.unshift(newMessage)
    writeMessages(messages)

    // 2. Format HTML & send via Nodemailer
    const plainText = `
New Contact Form Submission
===========================
Name: ${name.trim()}
Email: ${email.trim()}
Phone: ${number ? number.trim() : 'Not provided'}
Time: ${timestamp}

Message:
--------
${message.trim()}
`

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #f4f4f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #18181b; border: 1px solid #27272a; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px 24px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0 0; color: #e0e7ff; font-size: 13px; }
    .content { padding: 32px 24px; }
    .field { margin-bottom: 20px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #a1a1aa; font-weight: 700; margin-bottom: 4px; }
    .value { font-size: 16px; color: #ffffff; font-weight: 500; }
    .value a { color: #60a5fa; text-decoration: none; }
    .message-box { background: #09090b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; color: #e4e4e7; font-size: 15px; line-height: 1.6; white-space: pre-wrap; margin-top: 8px; }
    .footer { background: #121215; border-top: 1px solid #27272a; padding: 16px 24px; text-align: center; font-size: 12px; color: #71717a; }
    .cta-btn { display: inline-block; background: #3b82f6; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Portfolio Inquiry</h1>
      <p>Received via your website contact form</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Sender Name</div>
        <div class="value">${name.trim()}</div>
      </div>
      <div class="field">
        <div class="label">Sender Email</div>
        <div class="value"><a href="mailto:${email.trim()}">${email.trim()}</a></div>
      </div>
      <div class="field">
        <div class="label">Phone Number</div>
        <div class="value">${number ? number.trim() : '<span style="color:#71717a">Not provided</span>'}</div>
      </div>
      <div class="field">
        <div class="label">Submission Time</div>
        <div class="value" style="font-size:13px; color:#a1a1aa;">${timestamp}</div>
      </div>
      <div class="field">
        <div class="label">Message</div>
        <div class="message-box">${message.trim()}</div>
      </div>
      <div style="text-align: center;">
        <a href="mailto:${email.trim()}?subject=Re: Portfolio Inquiry" class="cta-btn">Reply to ${name.trim()}</a>
      </div>
    </div>
    <div class="footer">
      This is an automated notification sent directly from your Vivek Kumar portfolio backend.
    </div>
  </div>
</body>
</html>
`

    await sendMail({
      to: recipient,
      subject,
      text: plainText,
      html: htmlContent,
      replyTo: email.trim(),
    })

    return res.status(200).json({
      success: true,
      message: "Got it! Your message is in my inbox. I'll get back to you faster than a Mumbai local reaches Dadar! 🚉",
    })
  } catch (error) {
    console.error('❌ Error sending contact message:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later or email me directly at vkvseri@gmail.com.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    })
  }
}

/**
 * GET /api/contact/admin/messages - List all messages
 */
export const getAdminMessages = (req, res) => {
  try {
    const messages = readMessages()
    res.json({ success: true, count: messages.length, data: messages })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve messages' })
  }
}

/**
 * PATCH /api/contact/admin/messages/:id/read - Toggle read/unread
 */
export const toggleMessageRead = (req, res) => {
  try {
    const { id } = req.params
    const messages = readMessages()
    const index = messages.findIndex((m) => String(m.id) === String(id) || String(m._id) === String(id))

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Message not found' })
    }

    messages[index].isRead = req.body.isRead !== undefined ? req.body.isRead : !messages[index].isRead
    writeMessages(messages)

    res.json({ success: true, data: messages[index], message: 'Message status updated' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update message status' })
  }
}

/**
 * DELETE /api/contact/admin/messages/:id - Delete message
 */
export const deleteAdminMessage = (req, res) => {
  try {
    const { id } = req.params
    let messages = readMessages()
    const initialLength = messages.length

    messages = messages.filter((m) => String(m.id) !== String(id) && String(m._id) !== String(id))

    if (messages.length === initialLength) {
      return res.status(404).json({ success: false, message: 'Message not found' })
    }

    writeMessages(messages)
    res.json({ success: true, message: 'Message deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete message' })
  }
}
