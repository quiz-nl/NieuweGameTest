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
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        
        // Zoek naar de turquoise en paarse kleuren van het logo
        let turquoiseCount = 0;
        let purpleCount = 0;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Check voor turquoise (ongeveer RGB: 45, 195, 188)
            if (g > 180 && b > 180 && r < 60) {
                turquoiseCount++;
            }
            
            // Check voor paars (ongeveer RGB: 146, 84, 222)
            if (r > 140 && g < 100 && b > 200) {
                purpleCount++;
            }
        }
        
        // Als we genoeg pixels van beide kleuren vinden
        const totalPixels = width * height;
        const threshold = totalPixels * 0.05; // 5% van de pixels
        
        if (turquoiseCount > threshold && purpleCount > threshold) {
            return 'https://quiz-nl.github.io/TestMODE/player.html';
        }
        
        return null;
    }

    handleScan(url) {
        if (url === 'https://quiz-nl.github.io/TestMODE/player.html') {
            this.scanning = false;
            this.scanResult.style.display = 'block';
            this.scanResult.textContent = 'Logo herkend! Je wordt doorgestuurd...';
            
            setTimeout(() => {
                window.location.href = url;
            }, 1000);
        }
    }
}

// Start de scanner wanneer de pagina laadt
document.addEventListener('DOMContentLoaded', () => {
    const scanner = new PjottersScanner();
    scanner.startScanner();
}); 
