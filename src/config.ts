import { GameManagerPlugin } from './core/gameManagerPlugin';
import { MainScene } from './scenes/main-scene';
import { ScannerScene } from './scenes/scanner-scene';

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Webpack-Boilerplate',
  url: 'https://github.com/digitsensitive/phaser3-typescript',
  version: '2.0',
  width: 800,
  height: 600,
  backgroundColor: 0x3a404d,
  type: Phaser.AUTO,
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  plugins: {
    global: [
      { key: 'GameManagerPlugin', plugin: GameManagerPlugin, mapping: 'GameManager', start: true }
    ]
  },
  scene: [
    MainScene,
    ScannerScene
  ]
};
