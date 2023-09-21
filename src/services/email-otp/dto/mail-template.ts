export const emailTemplate = (otpNumber: string, emailSend?: string): string => {
    return `<!DOCTYPE html>
    <html>
    <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .otp-box {
        background-color: #f2f2f2;
        border-radius: 5px;
        padding: 10px;
        text-align: center;
        font-size: 24px;
      }
      .footer {
        text-align: center;
        margin-top: 20px;
        color: #999999;
      }
    </style>
    </head>
    <body>
    
    <div class="container">
      <div class="header">
        <h1>Your One-Time Passcode</h1>
      </div>
      <div class="otp-box">
        <p>Your OTP:</p>
        <p style="font-size: 36px; font-weight: bold; color: #3498db;">${otpNumber}</p>
      </div>
      <div class="footer">
        <p>This passcode is valid for a single use and will expire in the next 1 minutes. If you didn't initiate this request, please ignore this email.</p>
        [${emailSend}]
      </div>
    </div>
    
    </body>
    </html>    
    `;
};
