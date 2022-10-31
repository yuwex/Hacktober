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
import { InputManager } from '../core/inputManager';
import { AudioPlayer } from '../objects/audioPlayer';
import { NoteLane } from '../objects/noteLane';


export class GameBoard extends Phaser.GameObjects.GameObject {

    lanes: NoteLane[];
    numOfLanes: integer;
    audioPlayer: AudioPlayer;

    // each added lane gets the next letter 
    keys: string[] = ["Z","X","C"];

    inputManager: InputManager;

    totalScore: number = 0;
    totalScoreDisplay: Phaser.GameObjects.Text;

    levelScore: number = 0;
    levelScoreDisplay: Phaser.GameObjects.Text;
    ourFontFamily: string = 'Georgia, "Goudy Bookletter 1911", Times, serif';


    init(time: Phaser.Time.Clock ,num:integer): void{
        this.numOfLanes = num;
        this.inputManager = new InputManager(this.scene);
        this.lanes = new Array(this.numOfLanes);
        
        for (let i = 0; i < this.numOfLanes; i++){
          this.lanes[i] = new NoteLane(this.scene);
          this.lanes[i].init([], time, i + 1, this.numOfLanes, this);
          this.inputManager.addInputEvent(this.keys[i], () => this.lanes[i].tryHitNote());
        }
        
        this.audioPlayer = new AudioPlayer(this.scene);
        this.audioPlayer.init("song");
        // P for Audio
        this.inputManager.addInputEvent('P', () => this.audioPlayer.startAudio());

        this.levelScoreDisplay = this.scene.add.text(0, 15, 'level Score: 0', { fontFamily: this.ourFontFamily });
        this.totalScoreDisplay = this.scene.add.text(0, 0, 'total Score: 0', { fontFamily: this.ourFontFamily });
    }

    updateInBoard(time: number, delta: number): void {
        for (let i = 0; i < this.numOfLanes; i++){
            this.lanes[i].update(delta, time);
        }
    }

    addScore(addThis: number){
        this.levelScore += addThis;
        this.totalScore += addThis;
        this.levelScoreDisplay.setText("level Score: " + this.levelScore.toString());
        this.totalScoreDisplay.setText("total Score: " + this.totalScore.toString());
    }
}



