export class NoteLane extends Phaser.GameObjects.GameObject {
    sprite: Phaser.GameObjects.Sprite;

    songPlaying: boolean = false;
    notes: Phaser.GameObjects.Sprite[];
    hittableNoteRangeMin: number = 0;
    hittableNoteRangeMax: number;
    destroyedNotesCount: number = 0;
    bpm: number = 0;
    noteGap: number = 128;

    noteHitX: number = 128;

    score: number = 0;
    scoreDisplay: Phaser.GameObjects.Text;

    // Center of the screen
    centerX: number;
    centerY: number;

    constructor(scene: Phaser.Scene) {
        super(scene, "noteLane");
    }

    // Draws some things on screen
    init(songData: any[]): void {
        this.centerX = this.scene.cameras.main.centerX;
        this.centerY = this.scene.cameras.main.centerY;

        this.notes = [];

        // Draws the lane
        const rectWidth = 128;
        this.scene.add.rectangle(this.centerX, this.centerY, this.centerX * 2, rectWidth, 0xeeeeee);

        // Draws the circle where notes should be when hit
        const noteHitCircle = this.scene.add.circle(this.noteHitX, this.centerY, 64);
        noteHitCircle.setStrokeStyle(4, 0x111111);
        noteHitCircle.setDepth(2);

        // Score text
        this.scoreDisplay = this.scene.add.text(0, 0, '0', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });

        this.startSong(songData);
    }

    update(delta: number): void {
        if(!this.songPlaying) return;
        // if(Phaser.Math.Between(0, 10) === 8)
        //     console.log(delta)

        // Move every note a certain amount to the left each frame
        for(let i = 0; i < this.notes.length; i++) {
            const note = this.notes[i];
            if(!note.active) continue;

            note.x -= (delta / 1000) * (this.bpm / 60) * this.noteGap;
            if(note.x < 0) {
                note.destroy();
                this.destroyedNotesCount++;
            }
        }

        // Stupid workaround. See tryHitNote()
        this.hittableNoteRangeMin = Math.max(0, this.destroyedNotesCount - 4);
        this.hittableNoteRangeMax = Math.min(this.notes.length - 1, this.destroyedNotesCount + 4);

        if(this.destroyedNotesCount >= this.notes.length) {
            this.endSong();
        }
    }

    tryHitNote(note: 1 | 2) {
        let hitNote = false;

        /* The game needs to know which note to test (to see if it's close enough) whenever the Z/X button is hit. 
        Not every note needs to be tested, only the ones closest to the hit zone. To keep track of this there is a
        range of about 8 notes that the game will check on each frame. The reason why we can't only check the most
        recent undestroyed note is because there may be undestroyed notes to the left of the hit zone that are still 
        undestroyed, but shouldn't be checked. */
        for(let i = this.hittableNoteRangeMin; i <= this.hittableNoteRangeMax; i++) {
            const note = this.notes[i];
            if(!note.active) continue;

            // If the note is close to the hit zone, destroy it
            // TODO: Different states based on how close the note is to the hit zone
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

    startSong(songData: any[]) {

        // TODO: replace this with getting data from songData.notes
        // https://github.com/bui/taiko-web/wiki/TJA-format
        this.bpm = Phaser.Math.Between(90, 240);
        
        console.log(`Starting song with BPM of ${this.bpm}.`);

        // Placeholder
        for(let i = 0; i < 9; i++) {
            const note = new Phaser.GameObjects.Sprite(
                this.scene, 
                this.centerX * 2 + this.noteGap * i,
                this.centerY,
                'circle1');

            note.setDepth(1);
            this.scene.add.existing(note);
            this.notes.push(note);
        }

        this.hittableNoteRangeMin = 0;
        this.hittableNoteRangeMax = Math.min(this.notes.length - 1, 4);

        this.songPlaying = true;
    }

    endSong() {
        console.log(`Song ended with score of ${this.score}.`);
        this.songPlaying = false;
        this.notes = [];
        this.score = 0;
        this.destroyedNotesCount = 0;
        this.hittableNoteRangeMin = 0;
        this.hittableNoteRangeMax = 0;

        this.startSong([]);
    }
}