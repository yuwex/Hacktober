// import { NoteLane } from "./noteLane";
// import { Note } from "./note";
// import { Time } from "phaser";
// // import { InputManager } from "../core/inputManager";
import { InputManager } from '../core/inputManager';
import { AudioPlayer } from '../objects/audioPlayer';
import { NoteLane } from '../objects/noteLane';

export class GameBoard extends Phaser.GameObjects.GameObject {
    done: boolean;
    gameFinished: Phaser.GameObjects.Text;

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


    init(time: Phaser.Time.Clock ): void{
        // this is how many Lanes we have on our board
        this.numOfLanes = 2;

        // inmputManger deals with key presses
        this.inputManager = new InputManager(this.scene);
        this.lanes = new Array(this.numOfLanes);
        
        // creates the numOfLanes number of lanes, puts into array
        for (let i = 0; i < this.numOfLanes; i++){
          this.lanes[i] = new NoteLane(this.scene);
          this.lanes[i].init([], time, i + 1, this.numOfLanes, this, this.keys[i]);
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

        // if at least one lane is still going keeps going 
        // if all lanes are done - game over 
        this.done = true;
        for (let i = 0; i < this.numOfLanes; i++){
            if (this.lanes[i].songPlaying == true){
                this.done = false; 
            }
        }
        // all lanes are done so the whole game is over
        if (this.done) {
            this.wholeGameOver()
        }
    }

    addScore(addThis: number){
        this.levelScore += addThis;
        this.totalScore += addThis;
        this.levelScoreDisplay.setText("level Score: " + this.levelScore.toString());
        this.totalScoreDisplay.setText("total Score: " + this.totalScore.toString());
    }

    wholeGameOver(){
        this.gameFinished = this.scene.add.text(this.scene.cameras.main.centerX * .02  ,this.scene.cameras.main.height * .8 , 'GAME OVER ', { fontFamily: this.ourFontFamily  });
        this.gameFinished.setColor('#FD7E14');
        this.gameFinished.setFontSize(75); // prolly a better way to do this
    }
}



