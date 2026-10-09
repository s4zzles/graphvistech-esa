"use strict";

class Spritesheet {
    constructor(numberOfFrames, frameWidth, frameHeight, sheetX) {
        this.numberOfFrames = numberOfFrames; // total number of frames in sheet
        this.frameWidth = frameWidth; // width of a sprite in px
        this.frameHeight = frameHeight; // height of sprite in px
        this.sheetX = sheetX; // number of sprites in x direction
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
        let yPos = Math.floor(this.currentFrame / this.sheetX);

        return `${-this.frameWidth * xPos}px ${-this.frameHeight * yPos}px`;
    }
}

let drehscheibe = document.getElementById("ds");
drehscheibe.style.backgroundImage = 'url("../img/Drehscheibe/spritesheet.png")';
let drehscheibeIsAnimating = false;

let pixelguy = document.getElementById("pixelguy");
pixelguy.style.backgroundImage = 'url("../img/Pixelguy/spritesheet.png")';

let drehscheibeSheet = new Spritesheet(24, 512, 512, 5);
let pixelguySheet = new Spritesheet(12, 320, 380, 4);



document.addEventListener("keydown", function(event) {
    if ((event.code === "KeyL" || event.code === "ArrowLeft") && !drehscheibeIsAnimating) {
        drehscheibe.style.backgroundPosition = drehscheibeSheet.getFrameCoord(-1);
    }
    else if ((event.code === "KeyR" || event.code === "ArrowRight") && !drehscheibeIsAnimating) {
        drehscheibe.style.backgroundPosition = drehscheibeSheet.getFrameCoord(1);
    }
    else if (event.code === "KeyA") {
        drehscheibeIsAnimating = !drehscheibeIsAnimating;
    }
});

setInterval(() => {
    pixelguy.style.backgroundPosition = pixelguySheet.getFrameCoord(1);
    if (drehscheibeIsAnimating) {
        drehscheibe.style.backgroundPosition = drehscheibeSheet.getFrameCoord(1);
    }
}, 100);

