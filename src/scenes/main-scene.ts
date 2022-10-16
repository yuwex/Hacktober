import { InputManager } from '../core/inputManager';
import { NoteLane } from '../objects/noteLane';
import { BaseScene } from './base-scene';

// const circle1 = require('/assets/circle1.png');

export class MainScene extends BaseScene {
  noteLane: NoteLane;
  inputManager: InputManager;

  constructor() {
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

    // NOTE: this doesn't work for some reason...
    const scannerButton = this.add.text(456, 4, 'Scan RFID');
    scannerButton.setInteractive();
    scannerButton.on('mouseup', () => {
      console.log('click');
      this.gameManager.changeScene('ScannerScene');
    });
  }

  update(time: number, delta: number): void {
      this.noteLane.update(delta, time);
  }
}
