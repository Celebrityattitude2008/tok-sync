// Random TikTok Queue Database
const tiktokDatabase = [
    {
        handle: '@celebrityattitude1',
        url: 'https://tiktok.com/@celebrityattitude1',
        emoji: '🎬',
        category: 'Entertainment',
        engagement: 9,
        color: 'cyan'
    },
    {
        handle: '@alex_moves',
        url: 'https://tiktok.com/@alex_moves',
        emoji: '🔥',
        category: 'Dance',
        engagement: 4,
        color: 'pink'
    },
    {
        handle: '@daily_fits',
        url: 'https://tiktok.com/@daily_fits',
        emoji: '💫',
        category: 'Fitness',
        engagement: 7,
        color: 'cyan'
    },
    {
        handle: '@fitness_daily',
        url: 'https://tiktok.com/@fitness_daily',
        emoji: '🎯',
        category: 'Health',
        engagement: 8,
        color: 'pink'
    },
    {
        handle: '@comedy_hub',
        url: 'https://tiktok.com/@comedy_hub',
        emoji: '😂',
        category: 'Comedy',
        engagement: 6,
        color: 'cyan'
    },
    {
        handle: '@style_maven',
        url: 'https://tiktok.com/@style_maven',
        emoji: '👗',
        category: 'Fashion',
        engagement: 7,
        color: 'pink'
    },
    {
        handle: '@food_fantasies',
        url: 'https://tiktok.com/@food_fantasies',
        emoji: '🍕',
        category: 'Food',
        engagement: 8,
        color: 'cyan'
    },
    {
        handle: '@girly_bella',
        url: 'https://tiktok.com/@girly_bella',
        emoji: '😂',
        category: 'Comedy',
        engagement: 9,
        color: 'pink'
    },
    {
        handle: '@your_gworl_blossey',
        url: 'https://tiktok.com/@your_gworl_blossey',
        emoji: '🎵',
        category: 'Dance',
        engagement: 8,
        color: 'cyan'
    },
    {
        handle: '@valadahotel',
        url: 'https://tiktok.com/@valadahotel',
        emoji: '✈️',
        category: 'Travel',
        engagement: 7,
        color: 'pink'
    },
    {
        handle: '@everything_biu',
        url: 'https://tiktok.com/@everything_biu',
        emoji: '✨',
        category: 'Educational',
        engagement: 8,
        color: 'cyan'
    },
    {
        handle: '@art_creator',
        url: 'https://tiktok.com/@art_creator',
        emoji: '🎨',
        category: 'Art',
        engagement: 6,
        color: 'pink'
    },
    {
        handle: '@pet_paradise',
        url: 'https://tiktok.com/@pet_paradise',
        emoji: '🐾',
        category: 'Animals',
        engagement: 9,
        color: 'cyan'
    },
    {
        handle: '@tech_insider',
        url: 'https://tiktok.com/@tech_insider',
        emoji: '💻',
        category: 'Technology',
        engagement: 7,
        color: 'pink'
    },
    {
        handle: '@nature_lover',
        url: 'https://tiktok.com/@nature_lover',
        emoji: '🌿',
        category: 'Nature',
        engagement: 6,
        color: 'cyan'
    }
];

function getRandomTiktoks(count = 4) {
    const shuffled = [...tiktokDatabase].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function getTiktoksByCategory(category) {
    return tiktokDatabase.filter(tiktok => tiktok.category === category);
}

function searchTiktoks(query) {
    return tiktokDatabase.filter(tiktok => 
        tiktok.handle.toLowerCase().includes(query.toLowerCase()) ||
        tiktok.category.toLowerCase().includes(query.toLowerCase())
    );
}

function generateTaskCard(tiktok) {
    const engagementText = tiktok.engagement >= 8 ? `${tiktok.engagement}/10 Verified` : `${tiktok.engagement}/5 Verified`;
    const borderColor = tiktok.color === 'cyan' ? 'border-cyan-400' : 'border-pink-500';
    const bgColor = tiktok.color === 'cyan' ? 'bg-cyan-400' : 'bg-pink-500';
    
    return `
        <div class="task-card glass-card rounded-2xl p-4 flex items-center justify-between transition-all duration-300">
            <div class="flex items-center space-x-4">
                <div class="h-12 w-12 bg-zinc-800 rounded-lg flex items-center justify-center border border-white/5 text-xl">${tiktok.emoji}</div>
                <div>
                    <p class="text-sm font-bold">${tiktok.handle}</p>
                    <p class="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">${tiktok.category} • Like + Comment</p>
                </div>
            </div>
            <button onclick="startVerification(this, '${tiktok.url}')" class="${bgColor} text-black font-black px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest hover:opacity-90 transition">
                ENGAGE
            </button>
        </div>
    `;
}

function loadQueueFromDatabase(elementId, count = 4) {
    const taskList = document.getElementById(elementId);
    if (!taskList) return;
    
    const randomTiktoks = getRandomTiktoks(count);
    taskList.innerHTML = randomTiktoks.map(tiktok => generateTaskCard(tiktok)).join('');
}

function refreshQueue(elementId, count = 4) {
    loadQueueFromDatabase(elementId, count);
}
