# Plan (Flascii/Flashscii? idk some name that sounds cool)
* The user creates the game loop as a lambda, passes it into the canvas constructor
* Start/stop on the Canvas
* pass in lambda function with clip, each clip's code runs on update()
* declare global functions that the clips can call, a basic API for them to interact with the world. Or maybe not, because the person using the canvas should be doing most of the logic, so it should just be in their code, not in the canvas.