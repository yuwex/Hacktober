import { GameManagerPlugin } from "../core/gameManagerPlugin";

export abstract class BaseScene extends Phaser.Scene {
    gameManager!: GameManagerPlugin
}