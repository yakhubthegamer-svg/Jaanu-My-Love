document.addEventListener('DOMContentLoaded', () => {
    const giantHeart = document.getElementById('giant-heart');
    const heartLockContainer = document.getElementById('heart-lock-container');
    const progressBar = document.getElementById('progress-bar');
    const mainContent = document.getElementById('main-content');
    
    // Create floating hearts
    const heartsContainer = document.getElementById('hearts-container');
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        
        // Randomize properties
        const left = Math.random() * 100;
        const animationDuration = 4 + Math.random() * 6;
        const size = 0.5 + Math.random() * 1.5;
        const delay = Math.random() * 5;
        
        heart.style.left = `${left}vw`;
        heart.style.animationDuration = `${animationDuration}s`;
        heart.style.animationDelay = `${delay}s`;
        heart.style.transform = `scale(${size})`;
        
        heartsContainer.appendChild(heart);
        
        // Remove after animation
        setTimeout(() => {
            heart.remove();
        }, (animationDuration + delay) * 1000);
    }
    
    // Create hearts continuously
    setInterval(createHeart, 300);
    
    // Heart Lock Interaction
    let holdTimer;
    let progress = 0;
    let isHolding = false;

    function startHold() {
        if (!giantHeart) return;
        isHolding = true;
        giantHeart.classList.add('holding');
        
        holdTimer = setInterval(() => {
            progress += 2; // Takes about 2.5 seconds (50 iterations of 50ms)
            progressBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(holdTimer);
                unlockHeart();
            }
        }, 50);
    }

    function endHold() {
        if (!giantHeart || progress >= 100) return;
        isHolding = false;
        giantHeart.classList.remove('holding');
        clearInterval(holdTimer);
        
        // Pause audio if let go early
        const bgMusic = document.getElementById('bg-music');
        if (bgMusic) {
            bgMusic.pause();
            bgMusic.currentTime = 0;
        }

        // Drain progress backwards if let go early
        const drainTimer = setInterval(() => {
            if (isHolding) {
                clearInterval(drainTimer);
                return;
            }
            progress -= 5;
            if (progress <= 0) {
                progress = 0;
                clearInterval(drainTimer);
            }
            progressBar.style.width = `${progress}%`;
        }, 30);
    }

    function unlockHeart() {
        // Create a massive explosion of hearts
        for(let i=0; i<60; i++) {
            setTimeout(createHeart, i * 30);
        }
        
        heartLockContainer.style.opacity = '0';
        setTimeout(() => {
            heartLockContainer.style.visibility = 'hidden';
            mainContent.style.visibility = 'visible';
            mainContent.style.opacity = '1';
            
            // Turn up volume for already playing music
            const bgMusic = document.getElementById('bg-music');
            if (bgMusic) {
                bgMusic.volume = 0.15; // Very low volume as requested
                // Backup play trigger if it somehow didn't start silently
                if (bgMusic.paused) {
                    bgMusic.play().catch(e => console.log("Audio still blocked:", e));
                }
            }
            
            // Trigger scroll animation check immediately
            checkCards();
        }, 1500);
    }

    if (giantHeart) {
        giantHeart.addEventListener('mousedown', startHold);
        giantHeart.addEventListener('mouseup', endHold);
        giantHeart.addEventListener('mouseleave', endHold);
        
        giantHeart.addEventListener('touchstart', (e) => { e.preventDefault(); startHold(); }, {passive: false});
        giantHeart.addEventListener('touchend', endHold);
    }

    // GUARANTEED AUDIO UNLOCKER
    let audioUnlocked = false;
    function unlockAudio() {
        if (audioUnlocked) return;
        const bgMusic = document.getElementById('bg-music');
        if (bgMusic) {
            bgMusic.volume = 0; // Keep it silent until they unlock the heart
            bgMusic.play().then(() => {
                audioUnlocked = true;
            }).catch(e => {});
        }
        document.removeEventListener('touchstart', unlockAudio);
        document.removeEventListener('mousedown', unlockAudio);
        document.removeEventListener('click', unlockAudio);
    }
    document.addEventListener('touchstart', unlockAudio, { once: true });
    document.addEventListener('mousedown', unlockAudio, { once: true });
    document.addEventListener('click', unlockAudio, { once: true });

    // Scroll Animation for cards and boxes
    const fadeElements = document.querySelectorAll('.card, .glass-box, .surprise-box');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        el.classList.add('fade-in-element');
        observer.observe(el);
    });

    // Cursor Sparkles
    document.addEventListener('mousemove', function(e) {
        if(Math.random() > 0.8) {
            const sparkle = document.createElement('div');
            sparkle.classList.add('sparkle');
            sparkle.style.left = e.clientX + 'px';
            sparkle.style.top = e.clientY + 'px';
            document.body.appendChild(sparkle);
            setTimeout(() => { sparkle.remove(); }, 800);
        }
    });

    // 3D Card Tilt Effect
    const cardElements = document.querySelectorAll('.card');
    cardElements.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
        });
    });
    
    // Scratch Card Logic
    const canvas = document.getElementById('scratch-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let isDrawing = false;

        // Fill canvas with silver overlay
        ctx.fillStyle = '#c0c0c0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add "Scratch Me" text
        ctx.font = '20px Poppins';
        ctx.fillStyle = '#555555';
        ctx.textAlign = 'center';
        ctx.fillText('Scratch with finger/mouse!', canvas.width / 2, canvas.height / 2 + 6);

        function scratch(e) {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            // Handle both touch and mouse events
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            const x = clientX - rect.left;
            const y = clientY - rect.top;

            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 15, 0, Math.PI * 2);
            ctx.fill();
        }

        canvas.addEventListener('mousedown', () => isDrawing = true);
        canvas.addEventListener('mousemove', scratch);
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mouseleave', () => isDrawing = false);
        
        canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); }, {passive: false});
        canvas.addEventListener('touchmove', (e) => { e.preventDefault(); scratch(e); }, {passive: false});
        canvas.addEventListener('touchend', () => isDrawing = false);
    }

    // Magic Button Logic
    const magicButton = document.getElementById('magic-button');
    const magicOverlay = document.getElementById('magic-overlay');
    const closeMagic = document.getElementById('close-magic');

    if (magicButton) {
        magicButton.addEventListener('click', () => {
            magicOverlay.classList.add('active');
            // Super explosion of hearts
            for(let i=0; i<100; i++) {
                setTimeout(createHeart, i * 20);
            }
        });
        
        closeMagic.addEventListener('click', () => {
            magicOverlay.classList.remove('active');
        });
    }

    // Surprise 4: Typewriter Letter
    const startTypewriterBtn = document.getElementById('start-typewriter');
    const typewriterText = document.getElementById('typewriter-text');
    const letterContent = "My dearest Jaanu, words can't fully express how much you mean to me. Every single day with you feels like a beautiful dream. You are my sunshine, my moonlight, and my entire universe. I will love you forever and always.\n\nYours forever,\nYakhub Shaik 💕";
    let letterIndex = 0;
    
    if (startTypewriterBtn) {
        startTypewriterBtn.addEventListener('click', () => {
            startTypewriterBtn.style.display = 'none';
            typewriterText.innerHTML = '';
            letterIndex = 0;
            typeWriter();
        });
    }

    function typeWriter() {
        if (letterIndex < letterContent.length) {
            const char = letterContent.charAt(letterIndex);
            if (char === '\n') {
                typewriterText.innerHTML += '<br>';
            } else {
                typewriterText.innerHTML += char;
            }
            letterIndex++;
            setTimeout(typeWriter, 50); // Speed of typing
        }
    }

    // Surprise 5: Catch My Heart
    const runawayHeart = document.getElementById('runaway-heart');
    const catchArea = document.getElementById('catch-area');
    const catchSuccess = document.getElementById('catch-success');

    if (runawayHeart) {
        runawayHeart.addEventListener('mouseover', () => {
            const maxX = catchArea.clientWidth - runawayHeart.clientWidth;
            const maxY = catchArea.clientHeight - runawayHeart.clientHeight;
            
            const randomX = Math.random() * maxX;
            const randomY = Math.random() * maxY;
            
            runawayHeart.style.left = randomX + 'px';
            runawayHeart.style.top = randomY + 'px';
        });

        // Touch support for moving heart
        runawayHeart.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const maxX = catchArea.clientWidth - runawayHeart.clientWidth;
            const maxY = catchArea.clientHeight - runawayHeart.clientHeight;
            const randomX = Math.random() * maxX;
            const randomY = Math.random() * maxY;
            runawayHeart.style.left = randomX + 'px';
            runawayHeart.style.top = randomY + 'px';
        });

        runawayHeart.addEventListener('click', () => {
            runawayHeart.style.display = 'none';
            catchSuccess.classList.remove('hidden');
        });
    }

    // Surprise 6: Digital Gift Box
    const giftBox = document.getElementById('gift-box');
    const giftReveal = document.getElementById('gift-reveal');

    if (giftBox) {
        giftBox.addEventListener('click', () => {
            giftBox.classList.add('shake');
            setTimeout(() => {
                giftBox.style.display = 'none';
                giftReveal.classList.remove('hidden');
                
                // Explode hearts specifically around the gift
                for(let j=0; j<20; j++) {
                    createHeart();
                }
            }, 600); // Wait for shake animation to finish
        });
    }
});
