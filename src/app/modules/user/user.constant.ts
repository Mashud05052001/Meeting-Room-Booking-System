export const userRolesArray = ['user', 'admin'];

export const userRoles = {
  user: 'user',
  admin: 'admin',
} as const;

export type TUserRoles = keyof typeof userRoles;

export const generateForgetEmail = (userName: string, url: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 50px auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding: 10px 0;
            }
            .header img {
                max-width: 150px;
            }
            .content {
                margin: 20px 0;
            }
            .content h1 {
                color: #333333;
            }
            .content p {
                font-size: 16px;
                color: #555555;
            }
            .button {
                display: block;
                width: 200px;
                margin: 30px auto;
                text-align: center;
                background-color: #007bff;
                color: #FFFFFF !important;
                padding: 10px;
                border-radius: 5px;
                text-decoration: none;
                font-size: 16px;
                transition: background-color 0.3s ease, transform 0.3s ease;
            }
            .button:hover {
                background-color: #0056b3; 
                transform: translateY(-2px); 
            }
            .footer {
                text-align: center;
                font-size: 14px;
                color: #aaaaaa;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://res.cloudinary.com/dcub9lrfu/image/upload/v1725122830/meeting-room-email-logo_bepi73.png" alt="Website Logo">
            </div>
            <div class="content">
                <h1>Password Reset Request</h1>
                <p>Hello, <strong> ${userName} </strong></p>
                <p>We received a request to reset your password for your account. Click the button below to reset your password. If you did not request this, please ignore this email.</p>
                <a href="${url}" class="button">Reset Password</a>
                <p>*The link will expire in 10 minutes.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 QueueMeet. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>

`;
};
