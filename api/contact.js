import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config()

const createTransporter = () => {
  const user = process.env.EMAIL_USER || 'vkvseri@gmail.com'
  const rawPass = process.env.EMAIL_PASS || 'mpxacowbungrikmi'
  const pass = rawPass.replace(/\s+/g, '')

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
}

export default async function handler(req, res) {
  // Support CORS if called cross-origin
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    return res.end()
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }))
  }

  try {
    let body = req.body
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      } catch {
        body = {}
      }
    }

    const { name, email, number, message } = body || {}

    if (!name || !email || !message) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      return res.end(
        JSON.stringify({
          success: false,
          message: 'Name, email, and message are required.',
        })
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      return res.end(
        JSON.stringify({
          success: false,
          message: 'Please provide a valid email address.',
        })
      )
    }

    const recipient = process.env.EMAIL_TO || process.env.EMAIL_USER || 'vkvseri@gmail.com'
    const subject = `📬 Portfolio Message from ${name.trim()}`
    const timestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium',
    })

    const plainText = `
New Contact Message from Portfolio
===================================
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
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050505; color: #f4f4f5; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #09090c; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
    .header { background: linear-gradient(135deg, #18181b, #27272a); padding: 32px 24px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08); }
    .header h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0 0; color: #8999b3; font-size: 13px; font-family: monospace; }
    .content { padding: 32px 24px; }
    .field { margin-bottom: 20px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #8999b3; font-weight: 700; margin-bottom: 4px; }
    .value { font-size: 16px; color: #ffffff; font-weight: 500; }
    .value a { color: #60a5fa; text-decoration: none; }
    .message-box { background: #050505; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 18px; color: #e4e4e7; font-size: 15px; line-height: 1.6; white-space: pre-wrap; margin-top: 8px; }
    .footer { background: #050505; border-top: 1px solid rgba(255,255,255,0.06); padding: 16px 24px; text-align: center; font-size: 12px; color: #71717a; }
    .cta-btn { display: inline-block; background: #8999b3; color: #000000; text-decoration: none; padding: 12px 26px; border-radius: 12px; font-weight: 700; font-size: 14px; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Portfolio Inquiry</h1>
      <p>via Vivek Kumar Portfolio</p>
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
        <div class="label">Time (IST)</div>
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
      Automated email dispatch from Vivek Kumar Portfolio.
    </div>
  </div>
</body>
</html>
`

    const transporter = createTransporter()
    const fromAddress = process.env.EMAIL_USER || 'vkvseri@gmail.com'

    await transporter.sendMail({
      from: `"Portfolio Contact" <${fromAddress}>`,
      to: recipient,
      subject,
      text: plainText,
      html: htmlContent,
      replyTo: email.trim(),
    })

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    return res.end(
      JSON.stringify({
        success: true,
        message: "Got it! Your message is in my inbox. I'll get back to you soon! 🚀",
      })
    )
  } catch (error) {
    console.error('Nodemailer send error:', error)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    return res.end(
      JSON.stringify({
        success: false,
        message: error.message || 'Failed to send message via Nodemailer.',
      })
    )
  }
}
