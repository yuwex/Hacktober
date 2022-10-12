export class Note extends Phaser.GameObjects.Sprite {
    time: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, time: number) {
        super(scene, x, y, texture);

        // Variable for when the note SHOULD be hit.
        this.time = time;
    }

}