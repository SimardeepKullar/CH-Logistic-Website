module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    position,
    firstName,
    lastName,
    email,
    phone,
    license,
    notes,
    resume,
    abstract,
  } = req.body;

  // Validation
  if (!position || !firstName || !lastName || !email || !phone || !license || !resume || !abstract) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // TODO: swap once chlogistic.ca is verified in Resend:
        // from: 'CH Logistics Careers <careers@chlogistic.ca>'
        // to: ['dispatch@chlogistic.ca']
        from: 'CH Logistics Careers <onboarding@resend.dev>',
        to: ['simardeepk7@gmail.com'],
        reply_to: email,
        subject: `New Application — ${position} — ${firstName} ${lastName}`,
        attachments: [
          {
            filename: resume.name,
            content: resume.data,
          },
          {
            filename: abstract.name,
            content: abstract.data,
          },
        ],
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8"/>
            <style>
              body { font-family: Arial, sans-serif; background: #f4f6fb; margin: 0; padding: 0; }
              .wrapper { max-width: 600px; margin: 32px auto; background: #ffffff; border-radius: 4px; overflow: hidden; border: 1px solid #d0daea; }
              .header { background: #1a2b6d; padding: 28px 32px; }
              .header-sub { color: #00a8d8; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-top: 8px; }
              .body { padding: 32px; }
              .position-badge { display: inline-block; background: rgba(0,168,216,0.12); border: 1px solid rgba(0,168,216,0.3); color: #00a8d8; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 6px 14px; border-radius: 2px; margin-bottom: 24px; }
              .section-title { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #6b7a99; margin: 24px 0 12px; border-bottom: 1px solid #e8edf7; padding-bottom: 6px; }
              .section-title:first-of-type { margin-top: 0; }
              .field { margin-bottom: 14px; }
              .field-label { font-size: 11px; color: #6b7a99; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 3px; }
              .field-value { font-size: 15px; color: #1a2340; font-weight: 500; }
              .field-value a { color: #00a8d8; text-decoration: none; }
              .attachments-box { background: #f4f6fb; border: 1px solid #d0daea; border-radius: 4px; padding: 14px 18px; margin-top: 16px; }
              .attachment-row { display: flex; align-items: center; gap: 10px; padding: 6px 0; border-bottom: 1px solid #e8edf7; font-size: 13px; color: #1a2340; }
              .attachment-row:last-child { border-bottom: none; padding-bottom: 0; }
              .attachment-icon { color: #00a8d8; font-weight: 700; font-size: 14px; width: 20px; }
              .notes-box { background: #f4f6fb; border-left: 3px solid #00a8d8; padding: 14px 18px; border-radius: 0 4px 4px 0; font-size: 14px; color: #1a2340; line-height: 1.6; white-space: pre-wrap; }
              .footer { background: #0e1a3f; padding: 18px 32px; text-align: center; font-size: 11px; color: rgba(255,255,255,0.3); letter-spacing: 1px; text-transform: uppercase; }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="header">
                <div style="color:#ffffff; font-size:22px; font-weight:900; letter-spacing:1px;">CH LOGISTICS</div>
                <div class="header-sub">New Job Application</div>
              </div>
              <div class="body">

                <div class="position-badge">${position}</div>

                <div class="section-title">Applicant</div>
                <div class="field">
                  <div class="field-label">Name</div>
                  <div class="field-value">${firstName} ${lastName}</div>
                </div>
                <div class="field">
                  <div class="field-label">Email</div>
                  <div class="field-value"><a href="mailto:${email}">${email}</a></div>
                </div>
                <div class="field">
                  <div class="field-label">Phone</div>
                  <div class="field-value"><a href="tel:${phone}">${phone}</a></div>
                </div>
                <div class="field">
                  <div class="field-label">Licence / CVOR Number</div>
                  <div class="field-value">${license}</div>
                </div>

                <div class="section-title">Attachments</div>
                <div class="attachments-box">
                  <div class="attachment-row">
                    <span class="attachment-icon">&#128196;</span>
                    <span><strong>Resume:</strong> ${resume.name}</span>
                  </div>
                  <div class="attachment-row">
                    <span class="attachment-icon">&#128196;</span>
                    <span><strong>Driving Abstract:</strong> ${abstract.name}</span>
                  </div>
                </div>

                ${notes ? `
                <div class="section-title">Additional Notes</div>
                <div class="notes-box">${notes}</div>
                ` : ''}

              </div>
              <div class="footer">CH Logistics Inc. &mdash; Burlington, Ontario &mdash; Careers</div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send application.' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
};