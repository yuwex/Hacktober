import { InputManager } from '../core/inputManager';
import { NoteLane } from '../objects/noteLane';

// const circle1 = require('/assets/circle1.png');

export class MainScene extends Phaser.Scene {
  noteLane: NoteLane;
  inputManager: InputManager;

  constructor() {
    console.log("new");
    super({ key: 'MainScene' });
  }

  preload(): void {
    // this.load.image('redhat', '../../assets/redhat.png');
    // this.load.image('redParticle', '../../assets/red.png');
    // this.load.image('circle1', circle1);
    this.load.image('circle1', './assets/circle1.png');
  }

  create(): void {
    this.noteLane = new NoteLane(this);
    this.noteLane.init([], this.time);

    this.inputManager = new InputManager(this);
    this.inputManager.addInputEvent('Z', () => this.noteLane.tryHitNote());
    this.inputManager.addInputEvent('X', () => console.log('x'));
  }

  update(time: number, delta: number): void {
      this.noteLane.update(delta, time);
  }
}
