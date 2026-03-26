module.exports = async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const {
        firstName,
        lastName,
        company,
        email,
        service,
        origin,
        destination,
        details,
    } = req.body;

    // Basic validation
    if (!firstName || !email || !origin || !destination) {
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
                from: 'CH Logistics Quote Form <onboarding@resend.dev>',
                to: ['simardeepk7@gmail.com'], // TODO: swap to dispatch@chlogistic.ca once domain is verified
                reply_to: email,
                subject: `New Quote Request — ${origin} → ${destination}`,
                html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8"/>
            <style>
              body { font-family: Arial, sans-serif; background: #f4f6fb; margin: 0; padding: 0; }
              .wrapper { max-width: 600px; margin: 32px auto; background: #ffffff; border-radius: 4px; overflow: hidden; border: 1px solid #d0daea; }
              .header { background: #1a2b6d; padding: 28px 32px; }
              .header img { height: 36px; }
              .header-sub { color: #00a8d8; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-top: 8px; }
              .body { padding: 32px; }
              .section-title { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #6b7a99; margin: 24px 0 12px; border-bottom: 1px solid #e8edf7; padding-bottom: 6px; }
              .section-title:first-child { margin-top: 0; }
              .field { margin-bottom: 14px; }
              .field-label { font-size: 11px; color: #6b7a99; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 3px; }
              .field-value { font-size: 15px; color: #1a2340; font-weight: 500; }
              .route-box { background: #f4f6fb; border: 1px solid #d0daea; border-radius: 4px; padding: 16px 20px; margin: 16px 0; }
              .route-city { font-size: 16px; font-weight: 700; color: #1a2b6d; margin-top: 4px; }
              .route-arrow { color: #00a8d8; font-size: 22px; font-weight: 700; text-align: center; padding: 0 16px; }
              .details-box { background: #f4f6fb; border-left: 3px solid #00a8d8; padding: 14px 18px; border-radius: 0 4px 4px 0; font-size: 14px; color: #1a2340; line-height: 1.6; white-space: pre-wrap; }
              .footer { background: #0e1a3f; padding: 18px 32px; text-align: center; font-size: 11px; color: rgba(255,255,255,0.3); letter-spacing: 1px; text-transform: uppercase; }
            </style>
          </head>
          <body>
            <div class="wrapper">
              <div class="header">
                <div style="color:#ffffff; font-size:22px; font-weight:900; letter-spacing:1px;">CH LOGISTICS</div>
                <div class="header-sub">New Quote Request</div>
              </div>
              <div class="body">

                <div class="section-title">Contact</div>
                <div class="field">
                  <div class="field-label">Name</div>
                  <div class="field-value">${firstName} ${lastName}</div>
                </div>
                ${company ? `
                <div class="field">
                  <div class="field-label">Company</div>
                  <div class="field-value">${company}</div>
                </div>` : ''}
                <div class="field">
                  <div class="field-label">Email</div>
                  <div class="field-value"><a href="mailto:${email}" style="color:#00a8d8;">${email}</a></div>
                </div>

                <div class="section-title">Shipment</div>
                <div class="field">
                  <div class="field-label">Service</div>
                  <div class="field-value">${service || 'Not specified'}</div>
                </div>
                <div class="route-box">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="vertical-align:middle; width:42%;">
                        <div class="field-label">From</div>
                        <div class="route-city">${origin}</div>
                      </td>
                      <td class="route-arrow" style="vertical-align:middle; text-align:center; width:16%;">&#8594;</td>
                      <td style="vertical-align:middle; width:42%;">
                        <div class="field-label">To</div>
                        <div class="route-city">${destination}</div>
                      </td>
                    </tr>
                  </table>
                </div>

                ${details ? `
                <div class="section-title">Additional Details</div>
                <div class="details-box">${details}</div>
                ` : ''}

              </div>
              <div class="footer">CH Logistics Inc. &mdash; Burlington, Ontario &mdash; Moving You Forward&hellip;</div>
            </div>
          </body>
          </html>
        `,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Resend error:', error);
            return res.status(500).json({ error: 'Failed to send email.' });
        }

        return res.status(200).json({ success: true });

    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ error: 'Server error.' });
    }
}