import { InputManager } from '../core/inputManager';
import { AudioPlayer } from '../objects/audioPlayer';
import { NoteLane } from '../objects/noteLane';
import { BaseScene } from './base-scene';

import { GameBoard } from '../objects/gameBoard';
import { Game } from 'phaser';

// const circle1 = require('/assets/circle1.png');

export class MainScene extends BaseScene {
  keys: string[] = ["Z","X","C"];
  gameBoard: GameBoard;

  constructor() {
    super({ key: 'MainScene' });
  }

  preload(): void {
    // this.load.image('redhat', '../../assets/redhat.png');
    // this.load.image('redParticle', '../../assets/red.png');
    // this.load.image('circle1', circle1);

    // sets up our sprites to use later
    this.load.image('circle1', './assets/note.png');
    this.load.image('goal', './assets/goal.png');

    // Load a song
    this.load.audio('song', './assets/audio/para_91bpm.mp3');
  }

  create(): void {
    this.gameBoard  = new GameBoard(this, "TheBoard");
    this.gameBoard.init(this.time);
  }

  update(time: number, delta: number): void {
      this.gameBoard.updateInBoard(time,delta);
  }
}
