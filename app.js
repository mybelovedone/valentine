/* ===================================================================
   VALENTINE'S DAY — APP.JS
   Complete interaction logic with 30-click progression
   =================================================================== */

(function () {
  'use strict';

  // ─── State Management ───
  const state = {
    noClickCount: 0,
    yesButtonScale: 1,
    noButtonScale: 1,
    isComplete: false,
    isDodging: false,
  };

  // ─── 30 Persuasive Messages ───
  const messages = [
    "You're the purr-fect one for me!\nMy heart beats only for you.",
    "Are you sure? 🥺",
    "Pretty please? 💕",
    "Think again... 🤔",
    "I'll be really sad 😢",
    "You're breaking my heart 💔",
    "But I made this for you! 🎁",
    "Just say yes already! 😭",
    "I'll give you chocolates 🍫",
    "And flowers too! 🌹",
    "I promise to be the best! ✨",
    "Don't make the kitty cry 😿",
    "My heart only beats for you 💓",
    "You're the purr-fect one! 🐱",
    "Say yes and I'll stop bugging you 🐛",
    "I'll cook your favorite meal 🍝",
    "I'll watch whatever you want 📺",
    "Even horror movies 👻",
    "I'll carry your bags while shopping 🛍️",
    "Unlimited cuddles included 🤗",
    "Plus forehead kisses 😘",
    "I'll share my dessert with you 🍰",
    "That's how serious I am! 🫡",
    "You're running out of excuses! 😏",
    "The Yes button is RIGHT THERE ➡️",
    "It's getting bigger, can you see it? 👀",
    "Resistance is futile 🤖",
    "Just one little click! ☝️",
    "You know you want to... 😉",
    "Last chance... 🥹",
    "Okay fine, but I still like you 💗",
  ];

  // ─── DOM Elements ───
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  const subtitle = document.getElementById('subtitle');
  const buttonsContainer = document.getElementById('buttonsContainer');
  const successOverlay = document.getElementById('successOverlay');
  const successGif = document.getElementById('successGif');
  const gifLoading = document.getElementById('gifLoading');
  const confettiCanvas = document.getElementById('confettiCanvas');
  const floatingHeartsContainer = document.getElementById('floatingHearts');

  // ─── 1. Initialize App ───
  function initApp() {
    btnYes.addEventListener('click', handleYesClick);
    btnNo.addEventListener('click', handleNoClick);

    // Dodge on hover after 5 clicks
    btnNo.addEventListener('mouseenter', () => {
      if (state.noClickCount >= 5 && !state.isComplete) {
        dodgeNoButton();
      }
    });

    // Touch dodge for mobile
    btnNo.addEventListener('touchstart', (e) => {
      if (state.noClickCount >= 5 && !state.isComplete) {
        e.preventDefault();
        dodgeNoButton();
        // Still trigger the click
        setTimeout(() => handleNoClick(), 100);
      }
    }, { passive: false });

    // Keyboard accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && document.activeElement === btnYes) {
        handleYesClick();
      }
    });

    createFloatingHearts();
  }

  // ─── 2. Handle NO Click ───
  function handleNoClick() {
    if (state.isComplete) return;

    state.noClickCount++;

    // Cap at 30 messages (index 0 is initial, so max index is 30)
    const msgIndex = Math.min(state.noClickCount, messages.length - 1);
    updateSubtitle(msgIndex);

    // Grow YES button
    state.yesButtonScale = getYesScale(state.noClickCount);
    growYesButton(state.yesButtonScale);

    // Shrink NO button
    state.noButtonScale = getNoScale(state.noClickCount);
    shrinkNoButton(state.noButtonScale);

    // Start dodging after 5 clicks
    if (state.noClickCount >= 5) {
      btnNo.classList.add('dodging');
    }

    // Add urgency animations after certain thresholds
    if (state.noClickCount >= 15) {
      btnYes.style.animationDuration = '1s';
    }
    if (state.noClickCount >= 25) {
      btnYes.style.animationDuration = '0.6s';
    }
  }

  // ─── 3. Handle YES Click ───
  function handleYesClick() {
    if (state.isComplete) return;
    state.isComplete = true;
    showSuccessPage();
  }

  // ─── 4. Update Subtitle Message ───
  function updateSubtitle(index) {
    subtitle.classList.add('fade-out');

    setTimeout(() => {
      const msg = messages[index];
      subtitle.innerHTML = msg.replace('\n', '<br>');
      subtitle.classList.remove('fade-out');
      subtitle.classList.add('fade-in');

      setTimeout(() => subtitle.classList.remove('fade-in'), 300);
    }, 250);
  }

  // ─── 5. Grow YES Button ───
  function growYesButton(scale) {
    // Direct scale with spring-like animation
    btnYes.style.transform = `scale(${scale})`;
    btnYes.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';

    // Increase padding slightly too for readability
    const basePadH = 40;
    const basePadV = 16;
    const padH = basePadH + (state.noClickCount * 1.5);
    const padV = basePadV + (state.noClickCount * 0.5);
    btnYes.style.padding = `${padV}px ${padH}px`;

    // Font grows a bit too
    const baseFontSize = 18;
    const fontSize = baseFontSize + (state.noClickCount * 0.5);
    btnYes.style.fontSize = `${Math.min(fontSize, 36)}px`;
  }

  // ─── YES Button Growth Formula ───
  function getYesScale(clickCount) {
    // Exponential-ish growth: starts gentle, gets dramatic
    return 1 + (clickCount * 0.12) + (Math.pow(clickCount, 1.3) * 0.005);
  }

  // ─── NO Button Shrink Formula ───
  function getNoScale(clickCount) {
    return Math.max(0.3, 1 - (clickCount * 0.023));
  }

  // ─── 6. Shrink NO Button ───
  function shrinkNoButton(scale) {
    btnNo.style.transform = `scale(${scale})`;
    btnNo.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';

    // Also reduce opacity slightly
    const opacity = Math.max(0.4, 1 - (state.noClickCount * 0.02));
    btnNo.style.opacity = opacity;
  }

  // ─── 7. Dodge NO Button ───
  function dodgeNoButton() {
    if (state.isDodging) return;
    state.isDodging = true;

    const container = buttonsContainer.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();
    const yesRect = btnYes.getBoundingClientRect();

    // Calculate viewport-safe random position
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    const maxX = viewportW - btnRect.width - 20;
    const maxY = viewportH - btnRect.height - 20;

    let newX, newY;
    let attempts = 0;

    do {
      newX = 20 + Math.random() * maxX;
      newY = 20 + Math.random() * maxY;
      attempts++;
    } while (checkCollision(newX, newY, btnRect.width, btnRect.height, yesRect) && attempts < 20);

    btnNo.style.position = 'fixed';
    btnNo.style.left = `${newX}px`;
    btnNo.style.top = `${newY}px`;
    btnNo.style.zIndex = '100';
    btnNo.style.transition = 'left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';

    setTimeout(() => {
      state.isDodging = false;
    }, 300);
  }

  // ─── 8. Collision Detection ───
  function checkCollision(x, y, w, h, otherRect) {
    const pad = 20; // padding around the YES button
    return !(
      x + w < otherRect.left - pad ||
      x > otherRect.right + pad ||
      y + h < otherRect.top - pad ||
      y > otherRect.bottom + pad
    );
  }

  // ─── 9. Show Success Page ───
  function showSuccessPage() {
    successOverlay.classList.add('active');
    successOverlay.setAttribute('aria-hidden', 'false');

    // Load celebration GIF
    loadCelebrationGif();

    // Start confetti
    setTimeout(() => createConfetti(), 200);

    // Prevent scrolling
    document.body.style.overflow = 'hidden';
  }

  // ─── Load Celebration GIF ───
  function loadCelebrationGif() {
    // Valentine's Day themed GIF fallbacks
    const valentineGifs = [
      'https://media.giphy.com/media/3o7TKoWXm3okO1kgHC/giphy.gif',
      'https://media.giphy.com/media/l0HlGEX1ZORa0aIvu/giphy.gif',
      'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif',
      'https://media.giphy.com/media/l4FGni1RBAR2OWsGk/giphy.gif',
      'https://media.giphy.com/media/xT0GqssRweIhlz209i/giphy.gif',
      'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
    ];

    // Attempt Giphy API first — Valentine's Day themed search
    const giphyApiKey = 'GlVGYHkr3WSBnllca54iNt0yFbjz7L65'; // Giphy public beta key
    const giphyUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=happy+valentines+day+love+hearts&limit=10&rating=g`;

    fetch(giphyUrl)
      .then(res => res.json())
      .then(data => {
        if (data.data && data.data.length > 0) {
          const randomGif = data.data[Math.floor(Math.random() * data.data.length)];
          setGif(randomGif.images.fixed_height.url);
        } else {
          // Fallback to direct URLs
          setGif(valentineGifs[Math.floor(Math.random() * valentineGifs.length)]);
        }
      })
      .catch(() => {
        // Fallback
        setGif(valentineGifs[Math.floor(Math.random() * valentineGifs.length)]);
      });
  }

  function setGif(url) {
    successGif.src = url;
    successGif.onload = () => {
      successGif.classList.add('loaded');
      gifLoading.classList.add('hidden');
    };
    successGif.onerror = () => {
      // If GIF fails, show emoji fallback
      gifLoading.textContent = '💕🥰💕';
      gifLoading.style.fontSize = '48px';
    };
  }

  // ─── 10. Confetti Generator ───
  function createConfetti() {
    const canvas = confettiCanvas;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#E8395A', '#FFB6C8', '#FF6B8A', '#FFD700', '#FFFFFF', '#FF69B4', '#FF1493'];
    const particleCount = 120;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -10 - Math.random() * canvas.height * 0.5,
        w: 4 + Math.random() * 8,
        h: 4 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocityX: (Math.random() - 0.5) * 4,
        velocityY: 2 + Math.random() * 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 0.7 + Math.random() * 0.3,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
      });
    }

    let animationId;
    let frameCount = 0;
    const maxFrames = 600; // ~10 seconds at 60fps

    function animate() {
      if (frameCount >= maxFrames) {
        cancelAnimationFrame(animationId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        // Physics
        p.x += p.velocityX;
        p.y += p.velocityY;
        p.rotation += p.rotationSpeed;
        p.velocityY += 0.05; // gravity
        p.velocityX *= 0.99; // air resistance

        // Fade out near end
        if (frameCount > maxFrames * 0.7) {
          p.opacity *= 0.98;
        }

        // Wrap horizontally
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
      });

      frameCount++;
      animationId = requestAnimationFrame(animate);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  // ─── Create Floating Hearts Background ───
  function createFloatingHearts() {
    const hearts = ['💕', '💗', '💖', '♥', '💓', '🩷', '🤍'];
    const count = 15;

    for (let i = 0; i < count; i++) {
      const heart = document.createElement('span');
      heart.classList.add('floating-heart');
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.fontSize = `${12 + Math.random() * 20}px`;
      heart.style.animationDuration = `${8 + Math.random() * 12}s`;
      heart.style.animationDelay = `${Math.random() * 10}s`;
      floatingHeartsContainer.appendChild(heart);
    }
  }

  // ─── Initialize ───
  document.addEventListener('DOMContentLoaded', initApp);

})();
