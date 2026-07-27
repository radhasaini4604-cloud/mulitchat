/**
 * 1. First-Time User Signup Email Template for Nothric
 */
export function getWelcomeEmailHtml(firstName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Nothric</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      width: 100%;
      background-color: #f4f4f6;
      color: #111111;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-spacing: 0;
      width: 100%;
    }
    td {
      padding: 0;
    }
    .wrapper {
      width: 100%;
      background-color: #f4f4f6;
      padding: 40px 16px;
    }
    .main-card {
      background-color: #ffffff;
      margin: 0 auto;
      width: 100%;
      max-width: 520px;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
      border: 1px solid #e8e8ed;
    }
    .header-dome {
      background: #000000;
      color: #ffffff;
      padding: 44px 32px 40px 32px;
      text-align: center;
      border-radius: 0 0 50% 50% / 0 0 32px 32px;
    }
    .dome-logo {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.2);
      margin-bottom: 18px;
    }
    .dome-logo-char {
      font-family: Georgia, serif;
      font-weight: 700;
      font-size: 22px;
      color: #ffffff;
    }
    .dome-title {
      font-size: 28px;
      font-weight: 600;
      letter-spacing: -0.03em;
      color: #ffffff;
      margin: 0 0 8px 0;
    }
    .dome-subtitle {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
      font-weight: 400;
      letter-spacing: 0.02em;
    }
    .body-content {
      padding: 40px 36px 36px 36px;
    }
    .greeting-title {
      font-size: 20px;
      font-weight: 600;
      color: #111111;
      margin-bottom: 12px;
      letter-spacing: -0.02em;
    }
    .greeting-text {
      font-size: 15px;
      line-height: 1.6;
      color: #555559;
      margin-bottom: 32px;
    }
    .section-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #88888d;
      margin-bottom: 18px;
    }
    .steps-container {
      margin-bottom: 36px;
    }
    .step-card {
      background: #f8f8fa;
      border: 1px solid #ebebee;
      border-radius: 16px;
      padding: 18px;
      margin-bottom: 12px;
    }
    .step-badge {
      display: inline-block;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #000000;
      color: #ffffff;
      text-align: center;
      line-height: 28px;
      font-size: 13px;
      font-weight: 700;
      margin-right: 12px;
    }
    .step-title {
      display: inline;
      font-size: 14px;
      font-weight: 600;
      color: #111111;
    }
    .step-desc {
      font-size: 13px;
      color: #66666c;
      line-height: 1.45;
      margin-top: 6px;
      margin-left: 40px;
    }
    .btn-wrap {
      text-align: center;
      margin-bottom: 28px;
    }
    .btn-pill {
      display: inline-block;
      background-color: #000000;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      padding: 15px 36px;
      border-radius: 999px;
      letter-spacing: -0.01em;
    }
    .mail-footer {
      border-top: 1px solid #ebebee;
      padding-top: 24px;
      text-align: center;
    }
    .mail-footer p {
      font-size: 12px;
      color: #99999e;
      margin: 0 0 6px 0;
    }
    .mail-footer a {
      color: #555559;
      text-decoration: underline;
    }
    @media only screen and (max-width: 600px) {
      .body-content { padding: 32px 24px !important; }
      .dome-title { font-size: 24px !important; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="main-card">
      <tr>
        <td>
          <div class="header-dome">
            <div class="dome-logo">
              <span class="dome-logo-char">n</span>
            </div>
            <h1 class="dome-title">Welcome to Nothric</h1>
            <p class="dome-subtitle">Your private AI workspace is ready</p>
          </div>

          <div class="body-content">
            <div class="greeting-title">Hi ${firstName}, we're glad you're here.</div>
            <p class="greeting-text">
              Your Nothric account is officially active. We built Nothric to bring your favorite AI models into one clean, seamless workspace. Here is how to get started in seconds:
            </p>

            <div class="section-label">Quick Start Guide</div>

            <div class="steps-container">
              <div class="step-card">
                <div>
                  <span class="step-badge">1</span>
                  <span class="step-title">Launch Your Workspace</span>
                </div>
                <div class="step-desc">Open your workspace dashboard to access your main conversation studio.</div>
              </div>

              <div class="step-card">
                <div>
                  <span class="step-badge">2</span>
                  <span class="step-title">Select Your Preferred AI</span>
                </div>
                <div class="step-desc">Switch effortlessly between Gemini, Groq, Mistral, and Nvidia anytime.</div>
              </div>

              <div class="step-card">
                <div>
                  <span class="step-badge">3</span>
                  <span class="step-title">Start Creating & Collaborating</span>
                </div>
                <div class="step-desc">Ask questions, invite teammates to group rooms, or generate visual art.</div>
              </div>
            </div>

            <div class="btn-wrap">
              <a href="https://nothric.space" target="_blank" class="btn-pill">
                Open Workspace &rarr;
              </a>
            </div>

            <div class="mail-footer">
              <p>&copy; ${new Date().getFullYear()} Nothric. Designed for creators & builders.</p>
              <p><a href="https://nothric.space/privacy" target="_blank">Privacy Policy</a> &bull; <a href="https://nothric.space/support" target="_blank">Support</a></p>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}
