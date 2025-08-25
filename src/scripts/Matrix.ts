export default class Matrix {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private characters: string;
  private fontSize: number;
  private columns: number;
  private drops: number[];

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
    this.characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    this.fontSize = 18;
    this.columns = canvasElement.width / this.fontSize;
    this.drops = Array(Math.floor(this.columns)).fill(0);
  }

  public drawMatrix(): void {
    setInterval(() => {
      this.drawFrame();
    }, 50);
  }
  
  private drawFrame(): void {
    this.styleContext();
  
    for (let i = 0; i < this.drops.length; i++) {
      const text: string = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
  
      this.context.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
  
      if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
  
      this.drops[i]++;
    }
  }

  private styleContext(): void {
    this.context.fillStyle = "rgba(0, 0, 0, 0.1)";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = "#00ff00";
    this.context.font = this.fontSize + "px monospace";
  }
}