export class InputHandler {
    constructor() {
        this.left = false;
        this.right = false;
        this.jump = false;

        window.addEventListener("keydown", e => {
            if (e.key === "ArrowLeft" || e.key === "a") this.left = true;
            if (e.key === "ArrowRight" || e.key === "d") this.right = true;
            if (e.key === " " || e.key === "w" || e.key === "ArrowUp") this.jump = true;
        });

        window.addEventListener("keyup", e => {
            if (e.key === "ArrowLeft" || e.key === "a") this.left = false;
            if (e.key === "ArrowRight" || e.key === "d") this.right = false;
            if (e.key === " " || e.key === "w" || e.key === "ArrowUp") this.jump = false;
        });
    }
}
