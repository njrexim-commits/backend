import Settings from '../models/settingsModel.js';

/**
 * Wraps content in a standardized HTML email template.
 * @param {string} title - The main heading of the email.
 * @param {string} bodyContent - The main body content (HTML allowed).
 * @returns {Promise<string>} - The complete HTML string.
 */
export const generateEmailHtml = async (title, bodyContent) => {
    // Fetch settings for footer configuration
    const settings = await Settings.findOne({});

    // Default values if settings are missing
    const companyName = settings?.siteName || 'NJR EXIM';
    const address = settings?.address ? `${settings.address}, ${settings.city || ''} ${settings.pincode || ''}, ${settings.country || ''}` : 'Your Trusted Export Import Partner';
    const websiteUrl = process.env.CLIENT_URL || 'https://njrexim.com';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f6f9; color: #333333; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background-color: #003B95; padding: 30px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; }
        .content { padding: 40px 30px; line-height: 1.6; font-size: 16px; }
        .content h1 { color: #003B95; font-size: 22px; margin-top: 0; }
        .content p { margin-bottom: 20px; }
        .button { display: inline-block; padding: 12px 24px; background-color: #003B95; color: #ffffff !important; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; border-top: 1px solid #eaeaea; }
        .footer a { color: #003B95; text-decoration: none; }
        @media only screen and (max-width: 600px) {
            .content { padding: 20px; }
        }
    </style>
</head>
<body>
    <div style="padding: 20px 0;">
        <div class="container">
            <div class="header">
                <h1>${companyName}</h1>
            </div>
            <div class="content">
                ${bodyContent}
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
                <p>${address}</p>
                <p>
                    <a href="${websiteUrl}">Visit Website</a> | <a href="mailto:${settings?.contactEmail || 'contact@njrexim.com'}">Contact Support</a>
                </p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
};
