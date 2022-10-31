// this is to help structure our game and allow for multiple lanes

// create instances of Lanes so that we can have multiple
// have central things like score and song start/stop in this file

// put the key press needed into each notelane (pass into constructor for a noteLane)

// try scale the Gameboard to size instead of hardcoding values

// will need to modify: gameBoard and noteLanes

// creating an empty file for now
// for these written notes and to help with potential merge conflicts

// hopefully I'll (Andrew) be able to get some time to work on this


// import { NoteLane } from "./noteLane";
// import { Note } from "./note";
// import { Time } from "phaser";
// // import { InputManager } from "../core/inputManager";


// export class GameBoard extends Phaser.GameObjects.GameObject {

//     // numOfLanes: integer;
//     lanesArray: NoteLane[];
//     // inputManager: InputManager;
//     numOfLanes: integer;


//     init(time: Phaser.Time.Clock ,num:integer): void{
//         this.numOfLanes = num;
//         this.lanesArray = new Array(this.numOfLanes);
//         for (let i = 0; i < this.numOfLanes; i++){
//             this.lanesArray[i] = new NoteLane(this.scene);
//             this.lanesArray[i].init([], time, i, this.numOfLanes);
//             // this.inputManager.addInputEvent('Z', () => this.lanesArray[i].tryHitNote());
//     // this.inputManager.addInputEvent('X', () => this.lanes[1].tryHitNote());
//         }
//     }


//     updateInBoard(time: number, delta: number): void {
//         // this.noteLane.update(delta, time);
//         // this.lanes[0].update(delta, time);
//         // this.lanes[1].update(delta, time);
//         this.lanesArray[0].update(delta,time);
  
//     //     for (let i = 0; i < this.numOfLanes; i++){
//     //         this.lanesArray[i].update(delta, time1);
//     // // this.inputManager.addInputEvent('X', () => this.lanes[1].tryHitNote());
//     //     }
//     }
// }