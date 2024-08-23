export default class CanvasHandler {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.isDrawing = false;
        this.setupCanvas();
    }

    setupCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.context.lineWidth = 2;
    }

    startDrawing(x, y) {
        console.log("start");

        this.context.beginPath();
        this.context.moveTo(x, y);
    }

    drawPath(x, y) {        
        console.log("drawin");
        
        this.context.lineTo(x, y);
        this.context.stroke();
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    changeColor(color) {
        this.context.strokeStyle = color;
    }

    changeLineWidth(width) {
        this.context.lineWidth = width;
    }
}
