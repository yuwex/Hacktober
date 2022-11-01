import { BaseScene } from './base-scene';
import { GameBoard } from '../objects/gameBoard';
import { AudioPlayer } from '../objects/audioPlayer';

export class MainScene extends BaseScene {
  gameBoard: GameBoard;
  audioPlayer: AudioPlayer

  constructor() {
    super({ key: 'MainScene' });
  }

  preload(): void {
    // sets up our sprites to use later
    this.load.image('circle1', './assets/note.png');
    this.load.image('goal', './assets/goal.png');

    // Load a song
    this.load.audio('siren', './assets/audio/Siren.wav');
  }

  create(): void {
    this.gameBoard  = new GameBoard(this, "TheBoard");
    this.gameBoard.init(this.time);
  }

  update(time: number, delta: number): void {
      this.gameBoard.updateInBoard(time,delta);
  }
}
