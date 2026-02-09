// Shared app state and functions across all pages
let userPoints = 0;
let userProfile = {
    name: '',
    tiktokHandle: '',
    email: '',
    tiktokUrl: '',
    points: 0
};

function updateUIPoints() {
    const pointsDisplay = document.getElementById('points-display');
    if (pointsDisplay) {
        pointsDisplay.innerText = `${userPoints} pts`;
    }
    
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        const progressPercent = Math.min((userPoints / 5) * 100, 100);
        progressBar.style.width = `${progressPercent}%`;
    }
    
    const progressText = document.getElementById('progress-text');
    if (progressText) {
        progressText.innerText = `${Math.min(userPoints, 5)}/5 Completed`;
    }
    
    const remainingText = document.getElementById('remaining-text');
    if (remainingText) {
        remainingText.innerText = `${Math.max(5 - userPoints, 0)} Remaining`;
    }

    const dropBtn = document.getElementById('drop-btn');
    if (dropBtn) {
        if (userPoints >= 5) {
            dropBtn.removeAttribute('disabled');
            dropBtn.classList.remove('bg-white/5', 'text-gray-600');
            dropBtn.classList.add('tok-gradient', 'text-black', 'shadow-lg');
            dropBtn.innerHTML = '🚀 Drop My TikTok Link';
        }
    }

    localStorage.setItem('userPoints', userPoints);
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
}

function loadUserPoints() {
    const saved = localStorage.getItem('userPoints');
    if (saved) {
        userPoints = parseInt(saved);
        updateUIPoints();
    }
    
    const profile = localStorage.getItem('userProfile');
    if (profile) {
        userProfile = JSON.parse(profile);
    }
}

// Add function to clear all data for fresh start
function clearAllData() {
    localStorage.removeItem('userPoints');
    localStorage.removeItem('userProfile');
    userPoints = 0;
    userProfile = {
        name: '',
        tiktokHandle: '',
        email: '',
        tiktokUrl: '',
        points: 0
    };
}

function startVerification(btn, url) {
    window.open(url, '_blank');
    btn.disabled = true;
    btn.classList.replace('bg-cyan-400', 'bg-zinc-800');
    btn.classList.add('text-gray-500');
    
    let countdown = 10;
    btn.innerText = `WAIT ${countdown}S`;

    const timer = setInterval(() => {
        countdown--;
        btn.innerText = `WAIT ${countdown}S`;
        if (countdown <= 0) {
            clearInterval(timer);
            btn.disabled = false;
            btn.innerText = "VERIFY";
            btn.classList.replace('bg-zinc-800', 'bg-green-500');
            btn.classList.remove('text-gray-500');
            btn.classList.add('text-white');
            btn.onclick = () => awardPoint(btn);
        }
    }, 1000);
}

function awardPoint(btn) {
    userPoints++;
    updateUIPoints();
    btn.innerText = "✅ DONE";
    btn.disabled = true;
    btn.classList.replace('bg-green-500', 'bg-zinc-900');
    btn.onclick = null;
}

function openDropModal() {
    const modal = document.getElementById('drop-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeModal() {
    const modal = document.getElementById('drop-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Load points when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadUserPoints);
} else {
    loadUserPoints();
}
