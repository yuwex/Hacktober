import { BaseScene } from './base-scene';
import { GameBoard } from '../objects/gameBoard';

export class MainScene extends BaseScene {
  gameBoard: GameBoard;

  constructor() {
    super({ key: 'MainScene' });
  }

  preload(): void {
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
