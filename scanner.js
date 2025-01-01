class PjottersScanner {
    constructor() {
        this.video = document.getElementById('videoElement');
        this.scanResult = document.getElementById('scanResult');
        this.scanning = false;
        this.model = null;
        this.createModel();
    }

    async createModel() {
        // Maak een eigen model met TensorFlow.js
        this.model = tf.sequential({
            layers: [
                tf.layers.conv2d({
                    inputShape: [224, 224, 3],
                    kernelSize: 3,
                    filters: 32,
                    activation: 'relu'
                }),
                tf.layers.maxPooling2d({poolSize: 2}),
                tf.layers.conv2d({kernelSize: 3, filters: 64, activation: 'relu'}),
                tf.layers.maxPooling2d({poolSize: 2}),
                tf.layers.flatten(),
                tf.layers.dense({units: 64, activation: 'relu'}),
                tf.layers.dense({units: 1, activation: 'sigmoid'})
            ]
        });

        // Compileer het model
        this.model.compile({
            optimizer: 'adam',
            loss: 'binaryCrossentropy',
            metrics: ['accuracy']
        });

        console.log('AI model aangemaakt');
        this.trainModel();
    }

    async trainModel() {
        // Laad je trainingsdata
        const trainingData = await this.loadTrainingData();
        const { images, labels } = trainingData;

        // Train het model
        await this.model.fit(images, labels, {
            epochs: 10,
            batchSize: 32,
            validationSplit: 0.2,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    console.log(`Epoch ${epoch + 1}: accuracy = ${logs.acc}`);
                }
            }
        });

        console.log('Model training voltooid');
    }

    async loadTrainingData() {
        // Hier moet je je eigen trainingsdata laden
        // Dit is een voorbeeld van hoe je dat zou kunnen doen
        const images = [];
        const labels = [];

        // Laad positieve voorbeelden (je logo)
        const logoImages = ['logo1.jpg', 'logo2.jpg', 'logo3.jpg'];
        for (const imgPath of logoImages) {
            const img = await this.loadImage(imgPath);
            images.push(this.preprocessImage(img));
            labels.push(1);
        }

        // Laad negatieve voorbeelden (andere afbeeldingen)
        const otherImages = ['other1.jpg', 'other2.jpg', 'other3.jpg'];
        for (const imgPath of otherImages) {
            const img = await this.loadImage(imgPath);
            images.push(this.preprocessImage(img));
            labels.push(0);
        }

        return {
            images: tf.stack(images),
            labels: tf.tensor1d(labels)
        };
    }

    async loadImage(path) {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = path;
            img.onload = () => resolve(img);
        });
    }

    preprocessImage(img) {
        const tensor = tf.browser.fromPixels(img)
            .resizeBilinear([224, 224])
            .toFloat()
            .div(255.0)
            .expandDims();
        return tensor;
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

    async scan() {
        if (!this.scanning || !this.model) return;

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 224;  // MobileNet verwacht 224x224 afbeeldingen
        canvas.height = 224;

        context.drawImage(this.video, 0, 0, canvas.width, canvas.height);
        
        // Converteer canvas naar tensor
        const tensor = tf.browser.fromPixels(canvas)
            .expandDims()
            .toFloat()
            .div(255.0);

        // Voorspelling maken
        const prediction = await this.model.predict(tensor).data();
        
        // Controleer of het logo is gedetecteerd
        if (this.isLogoDetected(prediction)) {
            this.handleScan('https://quiz-nl.github.io/TestMODE/player.html');
        }

        tensor.dispose();
        requestAnimationFrame(() => this.scan());
    }

    isLogoDetected(prediction) {
        // Zoek naar specifieke kenmerken in de voorspelling
        // Deze waarden moet je aanpassen op basis van tests met jouw logo
        const threshold = 0.8;
        const logoFeatures = prediction.slice(0, 10);
        return Math.max(...logoFeatures) > threshold;
    }

    handleScan(url) {
        this.scanning = false;
        this.scanResult.style.display = 'block';
        this.scanResult.textContent = 'Logo herkend! Je wordt doorgestuurd...';
        
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
