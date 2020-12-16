/**
 ########  CPU  ########
 ====== RedAmber =======
 Created : 15 dec 2020
 Updated : 16 dec 2020

 Defines the CPU of the Chip-8
 Contains the opcode table and
 all the necessary to interpret
 the opcodes, read, and manage
 the memory be ready for a lot
 switch statements and nonsense
 code.

 This is where the magic happens.

 TODO : opcode implementation
 */

const MEMORY_SIZE = 4096;   // Memory from 0x000 to 0xFFF
const START_COUNTER = 512;  // Everything before 0x200 (512) is reserved for the interpreter
const OPCODE_NBR = 35;      // Only 35 different instructions in the standard Chip-8 language


class CPU {
    static memory = new Uint8Array(MEMORY_SIZE);  // Memory
    static V = new Uint8Array(16);          // Register
    static stack = new Uint16Array(16);       // Stocks memory jumps (max 16)

    static opcodes = new Opcodes();

    static I;  // Can Stores Addresses
    static sp; // Stack Pointer
    static pc; // Program Counter
    static dt; // Delay Timer
    static st; // Sound Timer

    static constructor() {
        this.memory.fill(0);
        this.V.fill(0);
        this.stack.fill(0);

        this.pc = START_COUNTER;
        this.I = 0;
        this.sp = 0;
        this.st = 0;
        this.st = 0;
    }



    static countDown() {
        if (this.dt > 0) {
            this.dt--;
        }
        if (this.st > 0) {
            this.st--;
        }
    }

    // opcodes are UInt16, memory is UInt8
    // We need to shift the first to concatenate them
    static getOpcode() {
        return (this.memory[this.pc]<<8)+this.memory[this.pc+1];
    }

    static getAction(opcode) {
        let action;
        for (action = 0; action < OPCODE_NBR; action++) {
            let result = (this.opcodes.mask[action] & opcode);
            if (result === this.opcodes.id[action]) {
                break;
            }
        }
        return action;
    }

    /**
     * WHAT A CHONKER !
     * This huge mess of a switch case
     * is the opcode interpreter
     * it will execute the right piece of code
     * according to the opcode
    */
    static InterpretOpcode(opcode) {
        // Get each important nibble
        // OPCODE FORMAT :
        // b4 b3 b2 b1

        let b1 = (opcode & 0x000F);
        let b2 = (opcode & 0x00F0) >> 4;
        let b3 = (opcode & 0x0F00) >> 8;

        let id = this.getAction(opcode);
        switch (id) {
            case 0:
                // 0NNN  -  SYS Addr    //
                // Execute machine language subroutine at address NNN
                //
                // not implemented
                break;
            case 1:
                // 00E0  -  CLS     //
                // Clear the screen
                GPU.clearScreen();
                break;
            case 2:
                // 00EE  -  RET     //
                // Return from a subroutine
                //
                // Decrement stack pointer
                // Set PC to address at the top of the stack
                this.sp--;
                this.pc = this.stack[this.sp]
                break;
            case 3:
                // 1NNN  -  JP Addr     //
                // Jump to location NNN
                //
                // Sets PC to NNN
                this.pc = (b3<<8)+(b2<<4)+b1;
                // Program counter is incremented by 2 at the end of the switch case
                // We need to decrement it now to counter that incrementation.
                this.pc -= 2;
                break;
            case 4:
                // 2NNN  -  CALL Addr     //
                // Call subroutine at NNN
                //
                // increments the stack pointer,
                // put current PC at the top of the stack,
                // then set PC to NNN
                this.stack[this.sp] = this.pc;
                if (this.sp < 15) {
                    this.sp++;
                }
                this.pc = (b3<<8)+(b2<<4)+b1;
                this.pc -= 2; // Counter the increment after switch case
                break;
            case 5:
                // 3XNN  -  SE Vx, Byte     //
                // Skip next instruction if Vx = NN
                //
                // Compares the value of Vx and the byte NN
                // If Equal : Increments the program counter by 2
                if (this.V[b3] === ((b2<<4)+b1)) {
                    this.pc += 2;
                }
                break;
            case 6:
                // 4XNN  -  SNE Vx, Byte     //
                // Skip next instruction if Vx != NN
                //
                // Compares the value of Vx and the byte NN
                // If NOT Equal : Increments the program counter by 2
                if (this.V[b3] !== ((b2<<4)+b1)) {
                    this.pc += 2;
                }
                break;
            case 7:
                // 5XY0  -  SE Vx, Vy     //
                // Skip next instruction if Vx = Vy
                //
                // Compares the value of Vx and Vy
                // If Equal : Increments the program counter by 2
                if (this.V[b3] === this.V[b2]) {
                    this.pc += 2;
                }
                break;
            case 8:
                // 6XNN  -  LD Vx, Byte     //
                // Put the value NN in the register Vx
                this.V[b3] = ((b2<<4)+b1);
                break;
            case 9:
                // 7XNN  -  ADD Vx, Byte     //
                // Add the value of Vx to Byte, then stores the result in Vx
                this.V[b3] = this.V[b3] + ((b2<<4)+b1);
                break;
            case 10:
                // 8XY0  -  LD Vx, Vy     //
                // Store the value of the register Vx in the register Vy
                this.V[b2] = this.V[b3];
                break;
            case 11:
                // 8XY1  -  OR Vx, Vy     //
                // Bitwise OR
                //
                // Performs a bitwise OR between the value of Vx and Vy
                // Stores the result in Vx
                this.V[b3] = (this.V[b3] | this.V[b2]);
                break;
            case 12:
                // 8XY2  -  AND Vx, Vy     //
                // Bitwise AND
                //
                // Performs a bitwise AND between the value of Vx and Vy
                // Stores the result in Vx
                this.V[b3] = (this.V[b3] & this.V[b2]);
                break;
            case 13:
                // 8XY3  -  XOR Vx, Vy     //
                // Bitwise XOR
                //
                // Performs a bitwise XOR between the value of Vx and Vy
                // Stores the result in Vx
                this.V[b3] = (this.V[b3] ^ this.V[b2]);
                break;
            case 14:
                // 8XY4  -  ADD Vx, Vy     //
                // Adds the value of Vx and Vy
                //
                // Add the value of the register Vx to the value of Vy
                // If the result is greater than a byte (255)
                // Then VF is set to 1 (Carry) and only the lowest 8bits are kept
                // Stores the result in Vx
                this.V[b3] = (this.V[b3]+this.V[b2]);
                if (this.V[b3] > 0xFF) {
                    this.V[0xF] = 1; // Carry
                    this.V[b3] = this.V[b3] & 0xFF; // Keep only the 8 least significant bits
                } else {
                    this.V[0xF] = 0; // Not Carry
                }
                break;
            case 15:
                // 8XY5  -  SUB Vx, Vy     //
                // Subtract Vy from Vx
                //
                // If the value of Vy is greater than Vx
                // Then VF is set to 0 (borrow), otherwise 1 (not borrow)
                // Then Vy is subtracted from Vx, the result is stored in Vx
                if (this.V[b3] < this.V[b2]) {
                    this.V[0xF] = 0;
                    this.V[b3] = 0xFF - (this.V[b2] - this.V[b3]);
                } else {
                    this.V[0xF] = 0;
                    this.V[b3] = this.V[b3] - this.V[b2];
                }
                 break;
            case 16:
                // 8XY6  -  SHR Vx     //
                // Shift Right
                //
                // Sets VF to the least significant bit of Vx
                // Then shifts the value of Vx one bit to the right
                // Stores the result in Vx, VF is set to the value of the popped bit
                this.V[0xF] = this.V[b3] & 1;
                this.V[b3] = this.V[b3]>>1;
                break;
            case 17:
                // 8XY7  -  SUBN Vx, Vy     //
                // Subtract Vx from Vy
                //
                // If the value of Vx is greater than Vy
                // Then VF is set to 0 (borrow), otherwise 1 (not borrow)
                // Then Vx is subtracted from Vy, the result is stored in Vx
                if (this.V[b3] > this.V[b2]) {
                    this.V[0xF] = 0;
                    this.V[b3] = 0xFF - (this.V[b3] - this.V[b2]);
                } else {
                    this.V[0xF] = 0;
                    this.V[b3] = this.V[b2] - this.V[b3];
                }
                break;
            case 18:
                // 8XYE  -  SHL Vx     //
                // Shift Left
                //
                // Sets VF to the most significant bit of Vx
                // Then shifts the value of Vx on bit to the left
                // Stores the result in Vx
                this.V[0xF] = this.V[b3] & 0x80; // 0x80 = 0b10000000
                this.V[b3] = this.V[b3]<<1;
                break;
            case 19:
                // 9xy0  -  SNE Vx, Vy     //
                // Skip next instruction if Vx != Vy
                //
                // Compares the value of Vx and the value of Vy
                // If NOT Equal : Increments the program counter by 2
                if (this.V[b3] === this.V[b2]) {
                    this.pc += 2;
                }
                break;
            case 20:
                // ANNN  -  LD I, Addr     //
                // Loads the value NNN in the register I
                this.I = (b3<<8)+(b2<<4)+b1
                break;
            case 21:
                // BNNN  -  JP V0, Addr     //
                // Jump to the NNN + the value of V0
                //
                // Sets the program counter to NNN + V0
                break;
            case 22:
                // CXNN  -  RND Vx, NNN     //
                // Generate Random byte AND NNN
                //
                // The Program will generate a random byte,
                // Then will perform a bitwise AND between the random byte and NNN
                // The result is stored in Vx
                break;
            case 23:
                // DXYN  -  DRW Vx, Vy, Nibble     //
                // Draw a N-byte sprite at coordinates Vx * Vy
                //
                // Read N Bytes of memory, starting at the address stored in I
                // These bytes are displayed displayed at the coordinates stored in Vx and Vy
                // The bytes are XORed with the current bytes on the screen
                // If a pixel is overwritten during the process, the VF register is set to 1 (collision)
                // If the sprite is positioned so it is outside the screen, it wraps on the other side
                break;
            case 24:
                // EX9E  -  SKP Vx     //
                // Skip next instruction if key Vx is pressed
                //
                // Checks the keyboard, if the key with the value of Vx is pressed
                // Then the PC is incremented by 2
                break;
            case 25:
                // EXA1  -  SKNP Vx     //
                // Skip next instruction if key Vx is NOT pressed
                //
                // Checks the keyboard, if the key with the value of Vx is NOT pressed
                // Then the PC is incremented by 2
                break;
            case 26:
                // FX07  -  LD Vx, DT     //
                // Set the value of the register Vx equal to the value of the delay timer
                break;
            case 27:
                // FX0A  -  LD Vx, K     //
                // Wait for a key press, then stores the key value in the Vx register
                break;
            case 28:
                // FX15  -  LD DT, Vx     //
                // Set delay timer to the value of Vx
                break;
            case 29:
                // FX18  -  LD ST, Vx     //
                // Set sound timer to the value of Vx
                break;
            case 30:
                // FX1E  -  ADD I, Vx     //
                // Add Vx to I
                break;
            case 31:
                // FX29  -  LD F, Vx     //
                // Set I = location of sprite for digit Vx.
                //
                // Chip8 has hardcoded sprites for hexadecimal digits
                // This sets I to the address in memory of the sprite corresponding to Vx
                break;
            case 32:
                // FX33  -  LD B, Vx     //
                // Stores BCD representation of Vx in memory locations I, I+1, and I+2.
                //
                // Calculate the Binary Coded Decimal value of Vx
                // Then places the hundreds digit in memory at location in I,
                // the tens digit at location I+1, and the ones digit at location I+2
                break;
            case 33:
                // FX55  -  LD [I], Vx     //
                // Store registers V0 through Vx in memory starting at location I.
                //
                // Copies the values of registers V0 through Vx into memory, starting at the address in I.
                break;
            case 34:
                // FX65  -  LD [I], Vx     //
                // Reads registers V0 through Vx from memory starting at location I.
                //
                // Reads the values of registers V0 through Vx from memory, starting at the address in I.
                break;
        }
        this.pc += 2;
    }
}


class Opcodes {
    constructor() {
        this.mask = new Uint16Array(OPCODE_NBR);
        this.id = new Uint16Array(OPCODE_NBR);
        this.mask[0]= 0x0000;   this.id[0]=0x0FFF;          /* 0NNN */
        this.mask[1]= 0xFFFF;   this.id[1]=0x00E0;          /* 00E0 */
        this.mask[2]= 0xFFFF;   this.id[2]=0x00EE;          /* 00EE */
        this.mask[3]= 0xF000;   this.id[3]=0x1000;          /* 1NNN */
        this.mask[4]= 0xF000;   this.id[4]=0x2000;          /* 2NNN */
        this.mask[5]= 0xF000;   this.id[5]=0x3000;          /* 3XNN */
        this.mask[6]= 0xF000;   this.id[6]=0x4000;          /* 4XNN */
        this.mask[7]= 0xF00F;   this.id[7]=0x5000;          /* 5XY0 */
        this.mask[8]= 0xF000;   this.id[8]=0x6000;          /* 6XNN */
        this.mask[9]= 0xF000;   this.id[9]=0x7000;          /* 7XNN */
        this.mask[10]= 0xF00F;  this.id[10]=0x8000;         /* 8XY0 */
        this.mask[11]= 0xF00F;  this.id[11]=0x8001;         /* 8XY1 */
        this.mask[12]= 0xF00F;  this.id[12]=0x8002;         /* 8XY2 */
        this.mask[13]= 0xF00F;  this.id[13]=0x8003;         /* BXY3 */
        this.mask[14]= 0xF00F;  this.id[14]=0x8004;         /* 8XY4 */
        this.mask[15]= 0xF00F;  this.id[15]=0x8005;         /* 8XY5 */
        this.mask[16]= 0xF00F;  this.id[16]=0x8006;         /* 8XY6 */
        this.mask[17]= 0xF00F;  this.id[17]=0x8007;         /* 8XY7 */
        this.mask[18]= 0xF00F;  this.id[18]=0x800E;         /* 8XYE */
        this.mask[19]= 0xF00F;  this.id[19]=0x9000;         /* 9XY0 */
        this.mask[20]= 0xF000;  this.id[20]=0xA000;         /* ANNN */
        this.mask[21]= 0xF000;  this.id[21]=0xB000;         /* BNNN */
        this.mask[22]= 0xF000;  this.id[22]=0xC000;         /* CXNN */
        this.mask[23]= 0xF000;  this.id[23]=0xD000;         /* DXYN */
        this.mask[24]= 0xF0FF;  this.id[24]=0xE09E;         /* EX9E */
        this.mask[25]= 0xF0FF;  this.id[25]=0xE0A1;         /* EXA1 */
        this.mask[26]= 0xF0FF;  this.id[26]=0xF007;         /* FX07 */
        this.mask[27]= 0xF0FF;  this.id[27]=0xF00A;         /* FX0A */
        this.mask[28]= 0xF0FF;  this.id[28]=0xF015;         /* FX15 */
        this.mask[29]= 0xF0FF;  this.id[29]=0xF018;         /* FX18 */
        this.mask[30]= 0xF0FF;  this.id[30]=0xF01E;         /* FX1E */
        this.mask[31]= 0xF0FF;  this.id[31]=0xF029;         /* FX29 */
        this.mask[32]= 0xF0FF;  this.id[32]=0xF033;         /* FX33 */
        this.mask[33]= 0xF0FF;  this.id[33]=0xF055;         /* FX55 */
        this.mask[34]= 0xF0FF;  this.id[34]=0xF065;         /* FX65 */
    }
}