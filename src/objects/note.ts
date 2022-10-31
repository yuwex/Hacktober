export class Note extends Phaser.GameObjects.Sprite {
    time: number;
    speed: number;
    scaleFactor: number = 1;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, time: number, speed: number = 1) {
        super(scene, x, y, texture);

        // Variable for when the note SHOULD be hit.
        this.time = time;
        this.speed = speed;
        this.scaleX = this.scaleFactor;
        this.scaleY = this.scaleFactor;
    }

}