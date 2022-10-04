export class InputManager {
    scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    addInputEvent(key: string, func: () => void) {
        this.scene.input.keyboard.addKey(key).on('down', func);
    }
}