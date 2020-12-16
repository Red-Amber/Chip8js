/**
 ########  MAIN  ########
 ======= RedAmber =======
 Created : 15 dec 2020
 Updated : 16 dec 2020

 Main file, contains the game loop and loads the ROM

 */

const CPU_SPEED = 4;        // Number of op per clock tick
const FPS = 60;             // Ticks per seconds (1000/60 = 16.67ms per tick)

// Useful function
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

var running = True;
GPU.clearScreen();

/**
 * GAME LOOP
 */
while(running) {
    GPU.update();
    sleep(1000/FPS)
}

