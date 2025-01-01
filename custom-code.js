class CustomCodeGenerator {
    constructor() {
        this.canvas = document.getElementById('codeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.baseImage = new Image();
        this.baseImage.src = 'jouw-basis-afbeelding.jpg'; // Vervang met je eigen afbeelding
    }

    generateCode(text) {
        // Reset canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Converteer tekst naar binair
        const binaryData = this.textToBinary(text);
        
        // Teken basis patroon
        this.drawPattern(binaryData);
        
        // Voeg subtiele kleurvariaties toe voor data encoding
        this.encodeData(binaryData);
    }

    textToBinary(text) {
        return text.split('').map(char => 
            char.charCodeAt(0).toString(2).padStart(8, '0')
        ).join('');
    }

    drawPattern(data) {
        const size = 10;
        const rows = this.canvas.height / size;
        const cols = this.canvas.width / size;
        
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < cols; j++) {
                const index = i * cols + j;
                const value = data[index % data.length] || '0';
                
                // Gebruik je eigen afbeelding/patroon hier
                this.ctx.fillStyle = value === '1' ? 
                    `hsla(${(index * 7) % 360}, 70%, 50%, 0.8)` : 
                    `hsla(${(index * 7) % 360}, 70%, 50%, 0.3)`;
                
                this.ctx.fillRect(j * size, i * size, size, size);
            }
        }
    }

    encodeData(data) {
        // Voeg verborgen data toe in subtiele kleurvariaties
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const pixels = imageData.data;

        for(let i = 0; i < data.length && i < pixels.length / 4; i++) {
            const bit = data[i];
            const offset = i * 4;
            
            // Subtiele aanpassing van alpha kanaal
            pixels[offset + 3] = bit === '1' ? 255 : 250;
        }

        this.ctx.putImageData(imageData, 0, 0);
    }

    readCode() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const pixels = imageData.data;
        let binaryData = '';

        // Lees de gecodeerde data
        for(let i = 0; i < pixels.length; i += 4) {
            binaryData += pixels[i + 3] === 255 ? '1' : '0';
        }

        // Converteer binair terug naar tekst
        return this.binaryToText(binaryData.slice(0, 800)); // Beperk lengte voor demo
    }

    binaryToText(binary) {
        const chunks = binary.match(/.{1,8}/g) || [];
        return chunks.map(chunk => 
            String.fromCharCode(parseInt(chunk, 2))
        ).join('');
    }
}

// Initialiseer en gebruik
const generator = new CustomCodeGenerator();

function generateCode() {
    const text = document.getElementById('inputText').value;
    generator.generateCode(text);
}

function readCode() {
    const decodedText = generator.readCode();
    alert('Gedecodeerde tekst: ' + decodedText);
} 