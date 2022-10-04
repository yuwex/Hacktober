import { InputManager } from '../core/inputManager';
import { NoteLane } from '../objects/noteLane';

export class MainScene extends Phaser.Scene {
  noteLane: NoteLane;
  inputManager: InputManager;

  constructor() {
    super({ key: 'MainScene' });
  }

  preload(): void {
    this.load.image('redhat', '../assets/redhat.png');
    this.load.image('redParticle', '../assets/red.png');
    this.load.image('circle1', '../assets/circle1.png');
  }

  create(): void {
    this.noteLane = new NoteLane(this);
    this.noteLane.init([]);

    this.inputManager = new InputManager(this);
    this.inputManager.addInputEvent('Z', () => this.noteLane.tryHitNote(1));
    this.inputManager.addInputEvent('X', () => console.log('x'));
  }

  update(time: number, delta: number): void {
      this.noteLane.update(delta);
  }
}
