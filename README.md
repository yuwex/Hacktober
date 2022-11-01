# Hacktober 🎃

We have created a web-based rhythm game! 

Here is the current version:
https://yuwex.github.io/Hacktober/  

 
# How to change the gameplay
Currently the only way to change game features is to manually change variable values. Here is a quick list of some things that can be easily changed to alter the gameplay: 
### File: src/objects/gameBoard.ts: 
> **numOfLanes**  

controls the number of lanes, currently can be changed between 1 and 3 (to go higher just add another key you would like to use)

### File: src/objects/noteLanes.ts:
> **minSpeed and maxSpeed**

control how fast the notes will move across the screen

> **ScoreToMoveOn**

How high the lane score needs to be to progress

### File: src/scenes/main-scene.ts:
Can change the sprites being loaded and the song being played 


# What features we would want to add
* Easy way to change features in a settings menu 
* Sending notes to correspond to the song playing 
* Create multipliers for point values to use our custom made sprites
* Multiplayer option 


# How to run

1. Get a code editor (IDE). I use Visual Studio Code. 
2. Download the `main` branch from github 
3. Install node.js from their website. On mac, you can just use the terminal and type `brew install node` 
4. Use some sort of terminal to cd into the main branch's folder, wherever that's stored on your computer 
5. run `npm i` to install project dependancies. This will create a new folder called `node_modules` that has all of the dependency code 
6. run `npm run dev` to run the project. Wait for the `webpack compiled successfully` message and then open a browser and go to `localhost:8080`. The game will be running there!😄
7. hit `control+c` in the terminal to shut down the server (edited)


# Important files/folders
> **README.md**  
   
 A file that uses the markdown format to display a bit about the project to other users. 
    
>**assets/**
    
A folder to store assets in! This includes images, sounds, and even css files.
    
> **src/**
    
   Where the actual project code goes!
    
> **src/config.ts**
    
   Stores meta-game variables like screen size and width.
    
> **src/game.ts**
    
   Sets up Phaser and starts the game.
    
> **src/core/inputManager.ts**
    
   Handles game inputs.
    
> **src/interfaces/**
    
   A place for the game's interfaces. An interface is the shape of an object.
    
> **src/objects/**
    
   A place for the game's objects. Some object might include notes, players, animations, etc.
    
> **src/scenes/**
    
  Stores the game's scenes! Scenes are how Phaser stores different game states. This is basically where the main game code goes.   
    
  
## Ignore-able files:

> **.github/workflows/main.yml**
    
   How the website ([https://yuwex.github.io/Hacktober](https://yuwex.github.io/Hacktober "https://yuwex.github.io/Hacktober")) gets auto-generated. Please don't mess with this unless you know what you're doing.
    
> **.gitignore**
     
   A list of folders / files that won't be automatically added to github.
    
> **index.html**
    
   The actual website, not the game.
    
> **package.json & package-lock.json**
    
   This file stores all of the project's dependencies and package information. You shouldn't need to edit it. Adding a dependency via `npm i package_name` will automatically add it here.
    
> **tsconfig.json**
    
   Holds information about how typescript should be compiled into javascript. If you aren't familiar with how typescript works, you can watch this video: [https://youtu.be/ahCwqrYpIuM](https://youtu.be/ahCwqrYpIuM "https://youtu.be/ahCwqrYpIuM")
    
> **webpack.config.json**
    
   Holds information about how webpack works with the rest of the project. I'm not 100% sure about how this works, you can ask Guang-Lin for more info.
    
> **yarn.lock**
    
   Auto-generated file about the project's dependencies. 
    