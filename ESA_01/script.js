"use strict";

class Spritesheet {
    constructor(numberOfFrames, frameWidth, frameHeight, sheetX, sheetY) {
        this.numberOfFrames = numberOfFrames;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.sheetX = sheetX;
        this.sheetY = sheetY;
        this.currentFrame = 0;
    }

    getFrameCoord(delta) {
        // Determine frame while checking for wrap around in both directions
        this.currentFrame = (this.currentFrame + delta) % this.numberOfFrames;
        if (this.currentFrame < 0) {
            this.currentFrame = this.numberOfFrames + this.currentFrame;
        }

        // Determine X and Y positions in spritesheet
        let xPos = this.currentFrame % this.sheetX;
        let yPos = Math.floor(this.currentFrame / this.sheetY);

        return new String(-this.frameWidth * xPos + "px " + -this.frameHeight * yPos + "px");
    }
}

let drehscheibe = document.getElementById("ds");
let drehscheibeSheet = new Spritesheet(24, 512, 512, 5, 5);

document.addEventListener("keydown", function(event) {
    if (event.code === "KeyL" || event.code === "ArrowLeft") {
        drehscheibe.style.backgroundPosition = drehscheibeSheet.getFrameCoord(-1);
    }
    else if (event.code === "KeyR" || event.code === "ArrowRight") {
        drehscheibe.style.backgroundPosition = drehscheibeSheet.getFrameCoord(1);
    }
});
