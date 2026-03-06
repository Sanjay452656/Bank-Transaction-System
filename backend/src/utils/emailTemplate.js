const welcomeEmailTemplate = (name) => {
  return `
  <div style="font-family: Arial; background:#f4f6f8; padding:40px;">
    
    <div style="max-width:600px; margin:auto; background:white; border-radius:10px; padding:30px;">
      
      <h2 style="color:#2c3e50;">Welcome ${name} 🎉</h2>

      <p style="font-size:16px; color:#555;">
        Thank you for registering with our platform. We are excited to have you!
      </p>

      <div style="text-align:center; margin:30px 0;">
        <a 
          href="http://localhost:3000"
          style="
            background:#4CAF50;
            color:white;
            padding:12px 24px;
            text-decoration:none;
            border-radius:6px;
            font-weight:bold;
          "
        >
          Visit Dashboard
        </a>
      </div>

      <p style="color:#888; font-size:14px;">
        If you didn't create this account, please ignore this email.
      </p>

      <hr/>

      <p style="font-size:12px; color:#aaa;">
        © 2026 Bank App. All rights reserved.
      </p>

    </div>

  </div>
  `;
};

module.exports = { welcomeEmailTemplate };