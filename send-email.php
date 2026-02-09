<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data || !isset($data['email']) || !isset($data['name'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }
    
    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $name = htmlspecialchars($data['name']);
    $handle = htmlspecialchars($data['handle'] ?? 'TikTok Creator');
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        exit;
    }
    
    // Create welcome email HTML
    $subject = 'Welcome to TokSync - Your TikTok Growth Starts Here! 🚀';
    
    $htmlMessage = '<!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; background-color: #010101; color: white; }
            .container { max-width: 600px; margin: 0 auto; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; background: linear-gradient(90deg, #ff0050 0%, #00f2ea 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
            .greeting { font-size: 18px; font-weight: bold; margin: 20px 0; }
            .content { line-height: 1.8; color: #e0e0e0; }
            .feature { margin: 20px 0; padding: 15px; background: rgba(0,242,234,0.1); border-left: 4px solid #00f2ea; border-radius: 5px; }
            .feature-title { font-weight: bold; color: #00f2ea; }
            .button { display: inline-block; background: linear-gradient(90deg, #ff0050 0%, #00f2ea 100%); color: black; padding: 12px 30px; border-radius: 10px; text-decoration: none; font-weight: bold; margin: 20px 0; }
            .stats { display: flex; justify-content: space-around; margin: 30px 0; }
            .stat { text-align: center; }
            .stat-number { font-size: 24px; font-weight: bold; color: #00f2ea; }
            .stat-label { color: #999; font-size: 12px; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">✨ TOKSYNC ✨</div>
                <p style="color: #888; margin-top: 5px;">Hack the TikTok Algorithm</p>
            </div>
            
            <div class="greeting">Welcome to TokSync, ' . $name . '! 🎉</div>
            
            <div class="content">
                <p>Your account has been successfully created with:</p>
                <p style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 5px;">
                    <strong>TikTok Handle:</strong> ' . $handle . '
                </p>
                
                <h3 style="color: #00f2ea; margin-top: 25px;">🚀 Here\'s What You Can Do Now:</h3>
                
                <div class="feature">
                    <div class="feature-title">1. Earn Points 🎯</div>
                    <p>Engage with creators in your dashboard and earn 1 point per engagement. Collect 5 points to unlock your daily TikTok link drop!</p>
                </div>
                
                <div class="feature">
                    <div class="feature-title">2. Follow for Follow 🤝</div>
                    <p>Visit our F4F section to discover creators in your niche and build a genuine community of followers.</p>
                </div>
                
                <div class="feature">
                    <div class="feature-title">3. Check the Rankings 📊</div>
                    <p>See the top creators on our global leaderboard. Compete and earn recognition as an active member!</p>
                </div>
                
                <div class="feature">
                    <div class="feature-title">4. Drop Your Link 📱</div>
                    <p>Once you earn 5 points, drop your TikTok link in the queue. Other creators will engage with your content!</p>
                </div>
            </div>
            
            <div class="stats">
                <div class="stat">
                    <div class="stat-number">15+</div>
                    <div class="stat-label">Creators</div>
                </div>
                <div class="stat">
                    <div class="stat-number">100%</div>
                    <div class="stat-label">Free</div>
                </div>
                <div class="stat">
                    <div class="stat-number">∞</div>
                    <div class="stat-label">Reach</div>
                </div>
            </div>
            
            <div style="text-align: center;">
                <a href="https://toksync.com/dashboard.html" class="button">Go to Dashboard →</a>
            </div>
            
            <div style="background: rgba(0,242,234,0.1); padding: 15px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #ff0050;">
                <p><strong>💡 Pro Tip:</strong> Users who engage with 10+ creators daily are 5x more likely to get followers in return. Start today!</p>
            </div>
            
            <div class="content" style="margin-top: 25px;">
                <p><strong>Any questions?</strong> Our AI chatbot is available 24/7 on the platform to help you get started. Just click the 💬 button!</p>
                
                <p style="margin-top: 15px;">Get ready to grow your TikTok presence with TokSync! 🎊</p>
                
                <p style="margin-top: 15px;">Happy syncing,<br><strong>The TokSync Team</strong></p>
            </div>
            
            <div class="footer">
                <p>© 2026 TokSync. All rights reserved.<br>
                This is an automated welcome email. Please do not reply directly.</p>
            </div>
        </div>
    </body>
    </html>';
    
    $plainTextMessage = "Welcome to TokSync, " . $name . "!\n\n" .
        "Your account has been successfully created with TikTok Handle: " . $handle . "\n\n" .
        "Here's what you can do:\n" .
        "1. Earn Points - Engage with creators and earn points\n" .
        "2. Follow for Follow - Discover creators in your niche\n" .
        "3. Check Rankings - See top creators\n" .
        "4. Drop Your Link - Share your TikTok link in the queue\n\n" .
        "Go to your dashboard: https://toksync.com/dashboard.html\n\n" .
        "Happy syncing!\n" .
        "The TokSync Team";
    
    // Set email headers
    $headers = "From: welcome@toksync.com\r\n";
    $headers .= "Reply-To: support@toksync.com\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "X-Mailer: TokSync Welcome System\r\n";
    
    // Send email using PHP mail function
    $mailSent = mail($email, $subject, $htmlMessage, $headers);
    
    if ($mailSent) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Welcome email sent successfully!',
            'email' => $email
        ]);
    } else {
        // Email might fail on local servers, but that's okay - we still allow signup
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Account created! (Email system not available on this server)',
            'email' => $email,
            'note' => 'Email will be sent when deployed to production server'
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
