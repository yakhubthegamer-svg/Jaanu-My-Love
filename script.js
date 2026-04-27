document.addEventListener('DOMContentLoaded', () => {
    const envelope = document.getElementById('envelope');
    const envelopeContainer = document.getElementById('envelope-container');
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
    
    // Envelope Interaction
    envelope.addEventListener('click', () => {
        envelope.classList.add('open');
        
        // Create an explosion of hearts
        for(let i=0; i<30; i++) {
            setTimeout(createHeart, i * 50);
        }
        
        setTimeout(() => {
            envelopeContainer.style.opacity = '0';
            setTimeout(() => {
                envelopeContainer.style.visibility = 'hidden';
                mainContent.style.visibility = 'visible';
                mainContent.style.opacity = '1';
                
                // Trigger scroll animation check immediately
                checkCards();
            }, 1500);
        }, 1500);
    });

    // Scroll Animation for cards
    const cards = document.querySelectorAll('.card');
    
    function checkCards() {
        const triggerBottom = window.innerHeight * 0.85;
        
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            
            if(cardTop < triggerBottom) {
                card.classList.add('visible');
            }
        });
    }
    
    window.addEventListener('scroll', checkCards);
    
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
