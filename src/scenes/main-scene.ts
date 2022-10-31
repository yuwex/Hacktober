import { InputManager } from '../core/inputManager';
import { AudioPlayer } from '../objects/audioPlayer';
import { NoteLane } from '../objects/noteLane';
import { BaseScene } from './base-scene';

// import { GameBoard } from '../objects/gameBoard';
import { Game } from 'phaser';


// const circle1 = require('/assets/circle1.png');

export class MainScene extends BaseScene {
  noteLane: NoteLane;
  inputManager: InputManager;
  audioPlayer: AudioPlayer;
  lanes: NoteLane[];
  numOfLanes: integer;
  keys: string[] = ["Z","X","C"];

  // gameBoard: GameBoard;

  constructor() {
    super({ key: 'MainScene' });
  }

  preload(): void {
    // this.load.image('redhat', '../../assets/redhat.png');
    // this.load.image('redParticle', '../../assets/red.png');
    // this.load.image('circle1', circle1);
    this.load.image('circle1', './assets/circle1.png');

    // Load a song
    this.load.audio('song', './assets/audio/para_91bpm.mp3');
  }

  create(): void {
    this.numOfLanes = 2;
    this.inputManager = new InputManager(this);


    // this.gameBoard  = new GameBoard(this, "TheBoard");
    // this.gameBoard.init(this.time, this.numOfLanes);

    this.lanes = new Array(this.numOfLanes);
    // this.lanes[0] = new NoteLane(this);
    // this.lanes[0].init([],this.time,1, this.numOfLanes);
    // this.inputManager.addInputEvent('Z', () => this.lanes[0].tryHitNote());

    // this.lanes[1] = new NoteLane(this);
    // this.lanes[1].init([],this.time,2, this.numOfLanes);
    // this.inputManager.addInputEvent('X', () => this.lanes[1].tryHitNote());



    for (let i = 0; i < this.numOfLanes; i++){
      this.lanes[i] = new NoteLane(this);
      this.lanes[i].init([], this.time, i + 1, this.numOfLanes);
      this.inputManager.addInputEvent(this.keys[i], () => this.lanes[i].tryHitNote());
  }

    // this.inputManager.addInputEvent('Z', () => this.lanes[0].tryHitNote());
    // this.inputManager.addInputEvent('X', () => this.lanes[1].tryHitNote());


    // this.lanes[1] = new NoteLane(this);
    // this.lanes[1].init([],this.time);

    // this.noteLane = new NoteLane(this);
    // this.noteLane.init([], this.time);

    this.audioPlayer = new AudioPlayer(this);
    this.audioPlayer.init("song");

    // this.inputManager = new InputManager(this);


    

    // this.inputManager.addInputEvent('X', () => console.log('x'));

    // this.inputManager.addInputEvent('Z', () => this.noteLane.tryHitNote());
    // this.inputManager.addInputEvent('X', () => console.log('x'));

    // // NOTE: this doesn't work for some reason...
    // const scannerButton = this.add.text(456, 4, 'Scan RFID');
    // scannerButton.setInteractive();
    // scannerButton.on('mouseup', () => {
    //   console.log('click');
    //   this.gameManager.changeScene('ScannerScene');
    // });
    
    // Hit P to play audio!
    this.inputManager.addInputEvent('P', () => this.audioPlayer.startAudio());
  }

  update(time: number, delta: number): void {
      // this.noteLane.update(delta, time);

      for (let i = 0; i < this.numOfLanes; i++){
        this.lanes[i].update(delta, time);
      }

      // this.lanes[0].update(delta, time);
      // this.lanes[1].update(delta, time);
      // this.gameBoard.updateInBoard(time,delta);

      // this.gameBoard.lanesArray[0].update(delta,time);
      // this.gameBoard
  }
}
