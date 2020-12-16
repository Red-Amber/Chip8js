/**
 ########  GPU  ########
 ====== RedAmber =======
 Created : 15 dec 2020
 Updated : 15 dec 2020

 All the code necessary to
 print stuff on the screen
 Honestly the simplest part
 of all this bunch of crap.
 */

const BLACK = 0;        // Value of black pixels
const WHITE = 1;        // Value of white pixels
const W = 64;           // Width in pixels
const H = 32;           // Height in pixels
const SCL = 8;          // Scale
const WIDTH = W*SCL;    // Width of screen
const HEIGHT = H*SCL;   // Height of screen

class Vector2 {
    constructor(x=0, y=0) {
        this.x = x;
        this.y = y;
    }
}

class Pixel {
    constructor(x, y, color) {
        this.pos = new Vector2(x, y);
        this.color = color;
    }

    draw(ctx) {
        if (this.color === BLACK) {
            ctx.fillStyle = "black";
        } else if (this.color === WHITE) {
            ctx.fillStyle = "white";
        }
        ctx.fillRect(this.pos.x*SCL, this.pos.y*SCL, SCL, SCL);
    }
}

class GPU {
    static  constructor() {

        this.screen = document.createElement("canvas");
        this.ctx = this.screen.getContext("2d");

        this.screen.id = "chip8_screen";
        this.screen.width = WIDTH;
        this.screen.height = HEIGHT;
        this.screen.style.position = "absolute";
        // -- DEBUG --
        this.screen.style.border = "1px solid red";

        document.getElementById("chip8").appendChild(this.screen);

        this.pixels = [];
        for (let i=0; i<W; i++) {
            this.pixels[i] = [];
            for (let j=0; j<H; j++) {
                // this.pixels[i][j] = new Pixel(i, j, BLACK);

                // -- DEBUG --
                if (i%(j+1) === 0) {
                    this.pixels[i][j] = new Pixel(i, j, BLACK);
                } else {
                    this.pixels[i][j] = new Pixel(i, j, WHITE);
                }

            }
        }
    }

    // Sets all pixels to black
    static clearScreen() {
        for (let i=0; i<W; i++) {
            for (let j=0; j<H; j++) {
                this.pixels[i][j].color = BLACK;
            }
        }
    }

    // Prints the screen on the canvas
    static update() {
        for (let i=0; i<W; i++) {
            for (let j=0; j<H; j++) {
                this.pixels[i][j].draw(this.ctx);
            }
        }
    }

}

