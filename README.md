# Amber's Chip-8 Emulator

_**[WIP]**_

Just a small little Chip-8 emulator written in Javascript.

I wanted To learn how emulators worked... So I made one

I know very well that this is not strictly an emulator but more of an intepreter, but who cares ? it's close enough

## Current progress

A good part of the graphical rendering is done
(it's not much though, the graphics are very simple)

Currently, 20 out of 35 opcodes are implemented, the rest is documented but has yet to be implemented.
Also you can't load a ROM... So no testing right now, but it's coming quickly i swear

There is no way to load a ROM for now, but it's coming soon, I will need to test the opcodes obviously.

## What is Chip-8 ? 

### In short : 

Chip-8 is a virtual machine, invented mid-1970, by Joseph Weisbecker.
Chip-8 is used to make games, using chip-8's interpreted language.
The language is composed of 35 opcodes, which are interpreted by the emulator

### Details :

#### Memory

Chip-8 was originally designed for 4K systems, which have 4096 memory locations, each can contain a byte.
Originally, the first 512 bytes are reserved for the interpreter, the 256 last bytes (0xF000 to 0xFFFF) are reserved for display, the rest can be used by the game.

However, in modern Chip- implementations, thr system isn't limited by memory size as much, so the limits concerning interpreter and display no longer apply (at least, they don't here)

#### Registers

Chip-8 has 16 registers, each 8 bits long. They are named V0 to VF.
The VF flag is set by some instructions and used as a flag.
There is an address register which is named I.

#### The stack

The stack is only used to stock the subroutines return addresses.

#### Timers

There is two timers, each at 60Hz (of FPS if you prefer).

The first is the Delay timer, it is used to time events, it can be set and read

The second one is the Sound Timer, which play a beeping sound when it's not equal to 0.



#### Graphics

The Chip-8's screen is monochrome and 64*32 pixels.
Sprites are 8pixels wide and up to 16pixel high. They are not pasted onto the screen but XORed, which means each "1" pixel of a sprite will switch the value of the current printed pixel.
While null bits of the sprite do nothing.
An instruction is there to set the screen entirely black.
If a up bit is overwritten by the printing of a sprite, the VF register is set to 1, 0 otherwise. This flag is used for collision detection.

#### Sound

A beeping sound is played when the sound timer is not equal to zero.
