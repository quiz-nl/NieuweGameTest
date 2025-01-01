class PjottersScanner {
    constructor() {
        this.video = document.getElementById('videoElement');
        this.scanResult = document.getElementById('scanResult');
        this.scanning = false;
    }

    async startScanner() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            this.video.srcObject = stream;
            this.scanning = true;
            this.scan();
        } catch (error) {
            console.error('Camera toegang geweigerd:', error);
        }
    }

    scan() {
        if (!this.scanning) return;

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = this.video.videoWidth;
        canvas.height = this.video.videoHeight;

        context.drawImage(this.video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        // Zoek naar het patroon in de afbeelding
        const code = this.detectPattern(imageData);
        
        if (code) {
            this.handleScan(code);
        }

        // Blijf scannen
        requestAnimationFrame(() => this.scan());
    }

    detectPattern(imageData) {
        // Hier implementeren we de patroonherkenning
        // Dit is een vereenvoudigd voorbeeld
        const data = imageData.data;
        let pattern = '';

        // Zoek naar specifieke kleurpatronen
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Zoek naar je specifieke kleurpatroon
            if (this.isPatternColor(r, g, b)) {
                pattern += '1';
            }
        }

        return this.decodePattern(pattern);
    }

    isPatternColor(r, g, b) {
        // Pas dit aan voor jouw specifieke kleurpatroon
        return (r > 200 && g < 50 && b > 200); // Voorbeeld voor paars
    }

    decodePattern(pattern) {
        // Decodeer het patroon naar een URL
        // Dit is waar je je eigen decoderingslogica implementeert
        if (pattern.length > 100) { // Voorbeeld check
            return 'https://pjotters-games.nl';
        }
        return null;
    }

    handleScan(url) {
        this.scanning = false;
        this.scanResult.style.display = 'block';
        this.scanResult.textContent = 'Code gevonden! Doorsturen naar: ' + url;
        
        // Redirect na een korte vertraging
        setTimeout(() => {
            window.location.href = url;
        }, 1000);
    }
}

// Start de scanner wanneer de pagina laadt
document.addEventListener('DOMContentLoaded', () => {
    const scanner = new PjottersScanner();
    scanner.startScanner();
}); 