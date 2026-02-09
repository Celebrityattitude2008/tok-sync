// TokSync Chatbot API for Vercel
// This is a serverless function that handles chatbot requests

class TokSyncChatbot {
  constructor() {
    this.responses = {
      // Greetings
      'hello': 'Hey there! 👋 Welcome to TokSync. How can I help you grow your TikTok today?',
      'hi': 'What\'s up! 🎉 Ready to boost your engagement? Ask me anything!',
      'hey': 'Hey! 👋 I\'m here to help. What would you like to know about TokSync?',
      
      // About TokSync
      'what is toksync': 'TokSync is the ultimate engagement platform for TikTok creators! We help you sync with other creators, earn engagement points, and grow your followers. 🚀',
      'how does toksync work': 'TokSync works in 3 easy steps: 1) Sign up with your TikTok 2) Engage with other creators\' videos 3) Earn points to drop your own link in our queue!',
      'how do i get started': 'Click the "Join The Sync" button to sign up, then head to your dashboard to start engaging with creators!',
      
      // Engagement
      'how do i earn points': 'You earn 1 point for each engagement task (like, comment, follow). Earn 5 points to unlock your daily link drop! 🎯',
      'what can i do with points': 'Points unlock your daily TikTok link drop slot. The more you engage, the more visibility your content gets!',
      'how do i engage': 'Go to your dashboard, click "ENGAGE" on any creator\'s video, verify completion, and boom - +1 point! 💪',
      
      // Features
      'what is f4f': 'F4F (Follow for Follow) is our community growth section. Follow relevant creators and build genuine followers in your niche!',
      'what is the leaderboard': 'The Leaderboard shows top contributors. Get recognition and compete with other creators on the Global Ranks page!',
      'can i filter creators': 'Yes! Browse creators by category - Entertainment, Gaming, Fashion, Fitness, and more!',
      
      // Account
      'how do i sign up': 'Click "Get Started", fill in your name, email, and TikTok profile link. That\'s it! 🎊',
      'how do i logout': 'Go to the "Me" tab and click the Logout button. Your data will be cleared.',
      'is my data safe': 'Yes! We use secure localStorage for data storage. Your info is never shared without permission.',
      
      // Troubleshooting
      'the queue is not loading': 'Try refreshing the page! If that doesn\'t work, clear your browser cache and try again.',
      'i can\'t earn points': 'Make sure you\'re completing the engagement tasks properly. Open the creator\'s TikTok, like/comment, then click VERIFY!',
      'points not saving': 'Check your browser\'s localStorage is enabled. Your points are stored locally on your device.',
      
      // Pricing
      'is toksync free': 'Yes! TokSync is completely free to use. 100% no hidden charges! 🎉',
      'do you charge for premium': 'We\'re completely free for now. All features are available to everyone!',
      
      // General help
      'help': 'I can help with: Getting started, Earning points, F4F, Leaderboard, Account questions, and more. What do you need? 😊',
      'faq': 'Common questions: How to earn points, How F4F works, Account settings, and troubleshooting. What\'s on your mind?',
      'contact': 'You can reach us through Discord or email. Check the footer on our site for contact info! 📧',
    };
  }

  chat(message) {
    const lowerMessage = message.toLowerCase().trim();
    
    // Check for exact matches
    if (this.responses[lowerMessage]) {
      return this.responses[lowerMessage];
    }
    
    // Check for keyword matches
    for (const [key, response] of Object.entries(this.responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    
    // Check for related topics
    if (/point|earn|reward/i.test(message)) {
      return 'Points are the currency of TokSync! Earn 1 point per engagement task. 5 points = 1 daily link drop. Keep grinding! 💪';
    }
    
    if (/follow|f4f|growth/i.test(message)) {
      return 'Head to our F4F section to find creators in your niche. Follow them and grow your community organically! 🌱';
    }
    
    if (/problem|error|bug|broken/i.test(message)) {
      return 'Sorry to hear you\'re having trouble! Try refreshing the page first. If it persists, we\'d love to help - drop a message in our Discord! 🔧';
    }
    
    if (/thanks|thank you|appreciate/i.test(message)) {
      return 'You\'re welcome! Happy to help! 😊 Keep crushing those engagement goals! 🚀';
    }
    
    if (/bye|goodbye|later/i.test(message)) {
      return 'See you later! Keep syncing! 👋 Remember to engage daily for maximum growth!';
    }
    
    // Default response
    return 'Great question! 🤔 I\'m still learning about all topics. Try asking about: Getting started, Earning points, F4F, or Leaderboard. Or type "help" for more info!';
  }
}

// Vercel serverless function handler
export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle POST requests
  if (req.method === 'POST') {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const chatbot = new TokSyncChatbot();
    const response = chatbot.chat(message);

    res.status(200).json({
      success: true,
      message: response,
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
