export class NoteLane extends Phaser.GameObjects.GameObject {
    sprite: Phaser.GameObjects.Sprite;

    notes: Phaser.GameObjects.Sprite[];
    hittableNoteRangeMin: number = 0;
    hittableNoteRangeMax: number;
    destroyedNotesCount: number = 0;
    noteHitX: number = 128;

    score: number = 0;
    scoreDisplay: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {
        super(scene, "noteLane");
    }

    init(songData: any[]): void {
        const centerX = this.scene.cameras.main.centerX;
        const centerY = this.scene.cameras.main.centerY;

        this.notes = [];

        const rectWidth = 128;
        this.scene.add.rectangle(centerX, centerY, centerX * 2, rectWidth, 0xeeeeee);

        const noteHitCircle = this.scene.add.circle(this.noteHitX, centerY, 64);
        noteHitCircle.setStrokeStyle(4, 0x111111);
        noteHitCircle.setDepth(2);

        this.scoreDisplay = this.scene.add.text(0, 0, '0', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });

        const noteGap = 128;
        for(let i = 0; i < 9; i++) {
            const note = new Phaser.GameObjects.Sprite(
                this.scene, 
                centerX * 2 + noteGap * i,
                centerY,
                'circle1');

            note.setDepth(1);
            this.scene.add.existing(note);
            this.notes.push(note);
        }

        this.hittableNoteRangeMax = Math.min(this.notes.length - 1, 4);
    }

    update(delta: number): void {
        for(let i = 0; i < this.notes.length; i++) {
            const note = this.notes[i];
            if(!note.active) continue;

            note.x -= delta * 0.15;
            if(note.x < 0) {
                note.destroy();
                this.destroyedNotesCount++;
            }
        }

        this.hittableNoteRangeMin = Math.max(0, this.destroyedNotesCount - 4);
        this.hittableNoteRangeMax = Math.min(this.notes.length - 1, this.destroyedNotesCount + 4);
    }

    tryHitNote(note: 1 | 2) {
        let hitNote = false;

        for(let i = this.hittableNoteRangeMin; i <= this.hittableNoteRangeMax; i++) {
            const note = this.notes[i];
            if(!note.active) continue;

            if(Math.abs(this.noteHitX - note.x) <= 64) {
                note.destroy();
                hitNote = true;
                break;
            }
        }

        if(hitNote) {
            console.log("HIT");
            this.destroyedNotesCount++;
            this.score += 100;
        }
        else {
            console.log("MISS");
            this.score -= 100;
        }
        
        this.scoreDisplay.setText(this.score.toString());
    }
}