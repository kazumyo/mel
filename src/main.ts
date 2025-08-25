import "./style.css";
import Matrix from "./scripts/Matrix";
import Terminal from "./scripts/Terminal";

function drawMatrix(): void {
  const canvas: HTMLElement | null = document.getElementById("matrix");

  const matrix: Matrix = new Matrix(canvas as HTMLCanvasElement | null);

  matrix.drawMatrix();
}

function initTerminal(): void {
  const terminalElement: HTMLElement | null = document.getElementById("terminal");

  const terminal: Terminal = new Terminal(terminalElement as HTMLDivElement | null);

  terminal.init();
}

function main(): void {
  drawMatrix();
  initTerminal();
}

main();

