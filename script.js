// Titel wijzigen naar Somtoday
document.addEventListener('DOMContentLoaded', function() {
    document.title = "Somtoday";
    
    // Game cards animatie
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('click', () => {
            card.style.transform = 'scale(1.02)';
            setTimeout(() => {
                card.style.transform = 'translateY(-5px)';
            }, 200);
        });
    });

    // Dynamische datum in footer
    const footerYear = document.querySelector('.footer p');
    const currentYear = new Date().getFullYear();
    footerYear.innerHTML = `&copy; ${currentYear} Pjotters-Games - Alle rechten voorbehouden`;

    // Scroll to top knop
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-top';
    document.body.appendChild(scrollButton);

    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Toon/verberg scroll knop
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    });

    // Laad meer games functie
    function laadMeerGames() {
        const content = document.querySelector('.content');
        const nieuweGames = [
            {titel: 'Call of Duty', beschrijving: 'Nieuwe season update!'},
            {titel: 'FIFA 24', beschrijving: 'Ultimate Team nieuws'},
            {titel: 'Cyberpunk 2077', beschrijving: 'Nieuwe DLC beschikbaar'}
        ];

        nieuweGames.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            gameCard.innerHTML = `
                <h3>${game.titel}</h3>
                <img src="https://via.placeholder.com/300x200" alt="${game.titel}" style="width: 100%;">
                <p>${game.beschrijving}</p>
            `;
            content.appendChild(gameCard);
        });
    }

    // Laad meer knop
    const laadMeerKnop = document.createElement('button');
    laadMeerKnop.innerHTML = 'Meer Games Laden';
    laadMeerKnop.className = 'laad-meer';
    document.querySelector('.content').appendChild(laadMeerKnop);
    laadMeerKnop.addEventListener('click', laadMeerGames);

    // Screenshot beveiliging
    document.addEventListener('keydown', function(e) {
        // Detecteer screenshot shortcuts
        if (
            (e.ctrlKey && e.shiftKey && e.key === 'I') || // Chrome dev tools
            (e.ctrlKey && e.shiftKey && e.key === 'C') || // Chrome dev tools
            (e.ctrlKey && e.key === 'u') ||              // View source
            (e.ctrlKey && e.key === 'p') ||              // Print/screenshot
            (e.key === 'PrintScreen')                     // Print Screen key
        ) {
            e.preventDefault();
            alert('Screenshots zijn niet toegestaan op deze website!');
            return false;
        }
    });

    // Rechtermuisknop uitschakelen
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Voeg een overlay toe wanneer er wordt geschakeld tussen vensters
    document.addEventListener('visibilitychange', function() {
        const gameCards = document.querySelectorAll('.game-card img');
        if (document.hidden) {
            gameCards.forEach(card => {
                card.style.visibility = 'hidden';
            });
        } else {
            gameCards.forEach(card => {
                card.style.visibility = 'visible';
            });
        }
    });

    // Canvas beveiliging toevoegen
    const protectedImages = document.querySelectorAll('.protected-content img');
    
    protectedImages.forEach(img => {
        img.style.opacity = '0.99'; // Voorkomt direct screenshotten
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        img.parentElement.appendChild(canvas);
        
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Teken de afbeelding op canvas met een subtiel patroon
            ctx.drawImage(img, 0, 0);
            
            // Voeg een onzichtbaar watermerk toe
            ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
            for(let i = 0; i < canvas.width; i += 50) {
                for(let j = 0; j < canvas.height; j += 50) {
                    ctx.fillText('Pjotters-Games', i, j);
                }
            }
        };
    });

    // Extra beveiliging voor het scherm
    setInterval(() => {
        if (window.outerWidth - window.innerWidth > 100 || 
            window.outerHeight - window.innerHeight > 100) {
            document.body.style.opacity = '0.1';
        } else {
            document.body.style.opacity = '1';
        }
    }, 1000);

    // Detecteer screen capture API
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia = async function() {
            alert('Screen recording is niet toegestaan!');
            throw new Error('Screen capture is geblokkeerd');
        };
    }

    // Scherm zwart maken bij screenshot pogingen
    const blackOverlay = document.createElement('div');
    blackOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: black;
        z-index: 10000;
        display: none;
    `;
    document.body.appendChild(blackOverlay);

    // Screenshot detectie voor Mac
    document.addEventListener('keydown', function(e) {
        if (
            (e.metaKey && e.shiftKey && e.key === '5') || // Mac screenshot
            (e.metaKey && e.shiftKey && e.key === '4') || // Mac screenshot
            (e.metaKey && e.shiftKey && e.key === '3')    // Mac screenshot
        ) {
            blackOverlay.style.display = 'block';
            setTimeout(() => {
                blackOverlay.style.display = 'none';
            }, 500);
        }
    });

    // Extra beveiliging voor window focus
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            blackOverlay.style.display = 'block';
        } else {
            setTimeout(() => {
                blackOverlay.style.display = 'none';
            }, 300);
        }
    });
}); 