# Ngrok Setup for MoMo Payment Testing

This guide explains how to use ngrok for testing MoMo payments in a local development environment.

## Why Ngrok?

When testing MoMo payments locally, there's a challenge with callback URLs:
- Your development server runs on localhost (e.g., http://localhost:5000)
- MoMo needs to send callbacks to your server after payment processing
- MoMo cannot reach your localhost directly

Ngrok creates a secure tunnel to your localhost, providing a public URL that MoMo can reach.

## Setup Instructions (Single Tunnel Approach - Recommended)

Since we only need to expose the backend for MoMo callbacks, we can use a single ngrok tunnel for port 5000.

1. Install ngrok:
   ```bash
   npm install -g ngrok
   ```

2. Run your backend server:
   ```bash
   cd back_end
   npm run dev
   ```

3. In another terminal, start ngrok for backend (port 5000):
   ```bash
   cd back_end
   ngrok http 5000
   ```

4. Note the ngrok URL displayed in the terminal:
   ```
   Forwarding                    https://abcd1234.ngrok-free.dev -> http://localhost:5000
   ```

5. Update your .env file with the ngrok URL:
   ```bash
   NGROK_URL=https://abcd1234.ngrok-free.dev
   ```

## How It Works

The system is configured to work with a single ngrok tunnel:

1. Frontend runs on localhost:3000 and can be accessed directly
2. Backend runs on localhost:5000 and is exposed via ngrok for MoMo callbacks
3. When a user initiates a MoMo payment:
   - Frontend calls backend API to create payment
   - Backend creates MoMo payment with:
     * notifyUrl (ipnUrl): `https://abcd1234.ngrok-free.dev/api/bookings/momo/callback` (ngrok URL)
     * returnUrl (redirectUrl): `http://localhost:3000/payment-result` (direct localhost access)
   - MoMo redirects user back to frontend after payment
   - MoMo calls backend callback URL via ngrok
   - Backend updates booking status
   - Frontend polls backend to get updated status and displays result

## Testing Process

1. Start both frontend and backend servers
2. Run ngrok to expose only the backend (port 5000)
3. Access the frontend at http://localhost:3000
4. Initiate a MoMo payment
5. Complete the payment on your mobile device
6. Verify that:
   - User is redirected back to http://localhost:3000/payment-result
   - MoMo callback is received via ngrok
   - Backend updates booking status
   - Frontend displays updated status

## Troubleshooting

### Callback Not Received
If MoMo callbacks are not reaching your server:

1. Verify that ngrok is running and showing the correct forwarding URL
2. Check that the MoMo callback URL in your backend logs matches the ngrok URL
3. Ensure your firewall is not blocking ngrok connections
4. Check the ngrok inspector at http://localhost:4040 to see incoming requests

### Common Issues
- Make sure you're using the HTTPS ngrok URL, not HTTP
- Ensure the port number matches your local backend server (5000)
- Check that your MoMo developer account is properly configured with the correct callback URL
- Make sure the NGROK_URL is set in your .env file

### Ngrok Subdomain Already in Use (ERR_NGROK_334)
If you see this error:
```
ERR_NGROK_334: The endpoint 'https://xxxx.ngrok-free.dev' is already online
```

Solution:
1. Kill all existing ngrok processes:
   - Windows: `taskkill /f /im ngrok.exe`
   - Mac/Linux: `pkill ngrok`
2. Wait a few minutes for the existing tunnel to expire
3. Restart your ngrok tunnel

### Email Configuration

For email sending during development, we use Ethereal.email service which provides a fake SMTP server for testing:

- Email user: j66lqxxpf4r3bpfw@ethereal.email
- Email password: t7FZDf1FQ1KqF8UyWh

You can view sent emails at: https://ethereal.email/messages

For production, you can configure Gmail credentials in the .env file:
```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
```

Note: If using Gmail with 2-factor authentication, you need to generate an App Password.

## Best Practices

### Network Access
When testing on mobile devices, you can access the frontend using your local network IP address:
- Find your computer's IP address (e.g., 192.168.1.71)
- Access the frontend at: http://192.168.1.71:3000
- This ensures MoMo redirects work correctly on mobile devices

### Clean Up
Always stop ngrok processes when you're done testing to free up resources:
- Press Ctrl+C in the terminal running ngrok
- Or kill the ngrok processes manually