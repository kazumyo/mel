type ImageSize = {
  width: number;
  height: number;
}

export default class ASCIIHeart {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private characters: string;
  private brightnessMap: number[][] = [];
  private imageSize: ImageSize = { width: 0, height: 0 };
  private animationInterval: number | null = null;

  constructor(canvasElement:  HTMLCanvasElement | null) {
    if (!canvasElement) {
      throw new Error("A canvas should be provided for render matrix effect.");
    }
    this.canvas =  canvasElement;

    const context: CanvasRenderingContext2D | null = this.canvas.getContext("2d"); 
    if (!context) {
      throw new Error("Failed to create Matrix context in canvas");
    }
    this.context = context;
    this.characters = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~i!lI;:,\"^`'. ";
  }

  private getRandomCharSet(length: number): string {
    let result = "";
    const charactersLength = this.characters.length;
    for (let i = 0; i < length; i++) {
      result += this.characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result + " ";
  }

  private setViewport(): void {
    this.canvas.width = 440;
    this.canvas.height = 300;
    this.imageSize.width = this.canvas.width;
    this.imageSize.height = this.canvas.width / 2.2; 
  }

  private preProcessImage(image: HTMLImageElement): void {
    const asciiWidth = 100;
    const asciiHeight = Math.floor(asciiWidth / 2.2);

    this.context.drawImage(image, 0, 0, asciiWidth, asciiHeight);
    const imageData = this.context.getImageData(0, 0, asciiWidth, asciiHeight).data;
    
    this.brightnessMap = [];

    for (let y = 0; y < asciiHeight; y++) {
      let row: number[] = [];
      for (let x = 0; x < asciiWidth; x++) {
        const offset = (y * asciiWidth + x) * 4;
        const r = imageData[offset];
        const g = imageData[offset + 1];
        const b = imageData[offset + 2];
        const a = imageData[offset + 3];

        const alpha = a / 255;
        const rgbBrightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        const finalBrightness = rgbBrightness * alpha + (1 - alpha);

        row.push(finalBrightness);
      }
      this.brightnessMap.push(row);
    }
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private getAsciiString(charSet: string): string {
    let asciiString = "";
    for (let y = 0; y < this.brightnessMap.length; y++) {
      const row = this.brightnessMap[y];
      for (let x = 0; x < row.length; x++) {
        const brightness = row[x];
        
        const charIndex = Math.floor(brightness * (charSet.length - 1));

        asciiString += charSet[charIndex] || " ";
      }
      asciiString += "\n";
    }
    return asciiString;
  }

  private drawText(text: string) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const fontColor: string = "#df2080";
    const fontSize = this.canvas.height / this.brightnessMap.length * 1.1;

    let textLines = text.split("\n");

    this.context.fillStyle = fontColor;
    this.context.font = `bold ${fontSize}px "Courier New", Courier, monospace`;
    this.context.shadowColor = fontColor;
    this.context.shadowBlur = 10;
    this.context.textAlign = "center";

    const x = this.canvas.width / 2;
    const totalTextHeight = textLines.length * (fontSize * 0.9);
    const y = (this.canvas.height - totalTextHeight) / 2;
    
    for (let i = 0; i < textLines.length; i++) {
      this.context.fillText(textLines[i], x, y + i * (fontSize * 0.9));
    }
    
    this.context.shadowBlur = 0;
  }

  private renderFrame(): void {
    const charSet = this.getRandomCharSet(15);
    const asciiString = this.getAsciiString(charSet);
    this.drawText(asciiString);
  }

  public drawHeart(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }

    const image = new Image();
    image.src = "./public/images/valentine.png";
    image.crossOrigin = "Anonymous";

    image.onload = () => {
      this.setViewport();
      this.preProcessImage(image);

      this.animationInterval = setInterval(() => {
        this.renderFrame();
      }, 200);
    };

    image.onerror = () => {
      console.error("Erro ao carregar a imagem do coração.");
    }
  }
}