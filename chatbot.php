<?php
// This endpoint has been retired.
// Please use the serverless endpoint: /api/chatbot (JavaScript) instead.
header('Content-Type: application/json');
http_response_code(410);
echo json_encode([
    'success' => false,
    'error' => 'This endpoint has been moved. Use /api/chatbot',
    'note' => 'chatbot.php is deprecated and replaced by /api/chatbot (serverless JS).'
]);
exit;
            
            // About TokSync
            'what is toksync' => 'TokSync is the ultimate engagement platform for TikTok creators! We help you sync with other creators, earn engagement points, and grow your followers. 🚀',
            'how does toksync work' => 'TokSync works in 3 easy steps: 1) Sign up with your TikTok 2) Engage with other creators\' videos 3) Earn points to drop your own link in our queue!',
            'how do i get started' => 'Click the "Join The Sync" button to sign up, then head to your dashboard to start engaging with creators!',
            
            // Engagement
            'how do i earn points' => 'You earn 1 point for each engagement task (like, comment, follow). Earn 5 points to unlock your daily link drop! 🎯',
            'what can i do with points' => 'Points unlock your daily TikTok link drop slot. The more you engage, the more visibility your content gets!',
            'how do i engage' => 'Go to your dashboard, click "ENGAGE" on any creator\'s video, verify completion, and boom - +1 point! 💪',
            
            // Features
            'what is f4f' => 'F4F (Follow for Follow) is our community growth section. Follow relevant creators and build genuine followers in your niche!',
            'what is the leaderboard' => 'The Leaderboard shows top contributors. Get recognition and compete with other creators on the Global Ranks page!',
            'can i filter creators' => 'Yes! Browse creators by category - Entertainment, Gaming, Fashion, Fitness, and more!',
            
            // Account
            'how do i sign up' => 'Click "Get Started", fill in your name, email, and TikTok profile link. That\'s it! 🎊',
            'how do i logout' => 'Go to the "Me" tab and click the Logout button. Your data will be cleared.',
            'is my data safe' => 'Yes! We use secure localStorage for data storage. Your info is never shared without permission.',
            
            // Troubleshooting
            'the queue is not loading' => 'Try refreshing the page! If that doesn\'t work, clear your browser cache and try again.',
            'i can\'t earn points' => 'Make sure you\'re completing the engagement tasks properly. Open the creator\'s TikTok, like/comment, then click VERIFY!',
            'points not saving' => 'Check your browser\'s localStorage is enabled. Your points are stored locally on your device.',
            
            // Pricing
            'is toksync free' => 'Yes! TokSync is completely free to use. 100% no hidden charges! 🎉',
            'do you charge for premium' => 'We\'re completely free for now. All features are available to everyone!',
            
            // General help
            'help' => 'I can help with: Getting started, Earning points, F4F, Leaderboard, Account questions, and more. What do you need? 😊',
            'faq' => 'Common questions: How to earn points, How F4F works, Account settings, and troubleshooting. What\'s on your mind?',
            'contact' => 'You can reach us through Discord or email. Check the footer on our site for contact info! 📧',
        ];
    }
    
    public function chat($message) {
        $message = strtolower(trim($message));
        
        // Check for exact matches
        if (isset($this->responses[$message])) {
            return $this->responses[$message];
        }
        
        // Check for keyword matches
        foreach ($this->responses as $key => $response) {
            if (strpos($message, $key) !== false) {
                return $response;
            }
        }
        
        // Check for related topics
        if (preg_match('/point|earn|reward/i', $message)) {
            return 'Points are the currency of TokSync! Earn 1 point per engagement task. 5 points = 1 daily link drop. Keep grinding! 💪';
        }
        
        if (preg_match('/follow|f4f|growth/i', $message)) {
            return 'Head to our F4F section to find creators in your niche. Follow them and grow your community organically! 🌱';
        }
        
        if (preg_match('/problem|error|bug|broken/i', $message)) {
            return 'Sorry to hear you\'re having trouble! Try refreshing the page first. If it persists, we\'d love to help - drop a message in our Discord! 🔧';
        }
        
        if (preg_match('/thanks|thank you|appreciate/i', $message)) {
            return 'You\'re welcome! Happy to help! 😊 Keep crushing those engagement goals! 🚀';
        }
        
        if (preg_match('/bye|goodbye|later/i', $message)) {
            return 'See you later! Keep syncing! 👋 Remember to engage daily for maximum growth!';
        }
        
        // Default response
        return 'Great question! 🤔 I\'m still learning about all topics. Try asking about: Getting started, Earning points, F4F, or Leaderboard. Or type "help" for more info!';
    }
}

// Handle chat request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['message']) || empty($input['message'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Message is required']);
        exit;
    }
    
    $chatbot = new TokSyncChatbot();
    $response = $chatbot->chat($input['message']);
    
    echo json_encode([
        'success' => true,
        'message' => $response,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
