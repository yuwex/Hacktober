
type PhaserSound = Phaser.Sound.BaseSound & {
    volume: number;
}

export class AudioPlayer extends Phaser.GameObjects.GameObject {

    audio: PhaserSound

    constructor(scene: Phaser.Scene) {
        super(scene, "AudioPlayer");
    }

    // preload() {
        
    // }

    // create() {
        
    // }

    init(song: string) {
        // Some things to think about: https://blog.ourcade.co/posts/2020/phaser-3-web-audio-best-practices-games/
        this.audio = this.scene.sound.add(song) as PhaserSound;

    }

    startAudio() {
        if (!this.audio.isPlaying) {
            this.audio.play();
            this.audio.volume = 0.1;
        }

        
    }


}