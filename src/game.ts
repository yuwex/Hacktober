import 'phaser';
import { GameConfig } from './config';

// Probably don't change any of this
export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.addEventListener('load', () => {
  const game = new Game(GameConfig);
});
