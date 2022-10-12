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

    totalScore: number = 0;
    totalScoreDisplay: Phaser.GameObjects.Text;

    levelScore: number = 0;
    levelScoreDisplay: Phaser.GameObjects.Text;

    accuracyText: Phaser.GameObjects.Text;

    // when loose the game
    endMessage: Phaser.GameObjects.Text;
    // the score needed to progress to next level
    ScoreToMoveOn: number = 100;
    
    // Center of the screen
    centerX: number;
    centerY: number;

    // create as var so easy to change all at once 
    ourFontFamily: string = 'Georgia, "Goudy Bookletter 1911", Times, serif';

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
        this.levelScoreDisplay = this.scene.add.text(0, 15, 'level Score: 0', { fontFamily: this.ourFontFamily });
        this.totalScoreDisplay = this.scene.add.text(0, 0, 'total Score: 0', { fontFamily: this.ourFontFamily });

        // Accuracy popup
        this.accuracyText = this.scene.add.text(0, 30, "Start!", { fontFamily: this.ourFontFamily });
        this.accuracyText.setAlpha(1);

        this.startSong(songData);
    }

    update(delta: number): void {
        if(!this.songPlaying) return;
        // if(Phaser.Math.Between(0, 10) === 8)
        //     console.log(delta)

        // Move every note a certain amount to the left each frame
        if (this.accuracyText.alpha > 0) {
            this.accuracyText.setAlpha(this.accuracyText.alpha - (delta / 1000))
        }

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
            // only move on if did well enough 
            if (this.levelScore > this.ScoreToMoveOn){
                this.keepGoing();
                this.startSong([]);
            } else {
                this.endSong();
                // make this nicer, display totalscore and give cool message 
                // rage game element -> have annoying message refrencing the score
                this.endMessage = this.scene.add.text(this.centerX, this.centerY, 'GAME OVER', { fontFamily: this.ourFontFamily  });
                this.endMessage.setColor('#FD7E14');
                this.endMessage.setFontSize(45); // prolly a better way to do this
            }
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
            let accuracy: Number = (1 - Math.abs(this.noteHitX - note.x) / 64) * 100;

            if (accuracy >= 85) {
                this.accuracyPopup('PERFECT');
                this.levelScore += 100;
            } else if (accuracy >= 60) {
                this.accuracyPopup('GOOD');
                this.levelScore += 90;
            } else if (accuracy > 0) {
                this.accuracyPopup('OK');
                this.levelScore += 80;
            }

            if(Math.abs(this.noteHitX - note.x) <= 64) {
                note.destroy();
                hitNote = true;
                break;
            }
        }

        if(hitNote) {
            console.log("HIT");
            this.destroyedNotesCount++;
            
        }
        else {
            this.accuracyPopup('MISS');
            console.log("MISS");
            this.levelScore -= 100;
        }
        
        this.levelScoreDisplay.setText("level Score: " + this.levelScore.toString());
        // maybe also update total score each time instead of at end of level

    }

    startSong(songData: any[]) {

        // TODO: replace this with getting data from songData.notes
        // https://github.com/bui/taiko-web/wiki/TJA-format
        this.bpm = Phaser.Math.Between(90, 240);

        // this.bpm = 30;
        
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
        console.log(`Song ended with score of ${this.totalScore}.`);
        this.songPlaying = false;
        this.notes = [];
        this.levelScore = 0;
        this.totalScore = 0;
        this.destroyedNotesCount = 0;
        this.hittableNoteRangeMin = 0;
        this.hittableNoteRangeMax = 0;
    }

    // Funny animation text
    accuracyPopup(acc: 'PERFECT' | 'GOOD' | 'OK' | 'MISS') {
        this.accuracyText.setAlpha(1);
        this.accuracyText.setColor('#FFFFFF');
        this.accuracyText.setText(acc);
        
        switch (acc) {
            case 'PERFECT':
                this.accuracyText.setColor('#FD7E14');
                break;
            
            case 'GOOD':
                this.accuracyText.setColor('#FFE066');
                break;
            
            case 'OK':
                this.accuracyText.setColor('#FFF3BF');
                break;

            case 'MISS':
                this.accuracyText.setColor('#676767');
                break;
        }

    }


    // feels super janky, most likely a better way
    keepGoing() {
        console.log(`level ended with score of ${this.levelScore}. Next level Coming up!`);
        this.notes = [];
        this.totalScore += this.levelScore;
        this.totalScoreDisplay.setText("total Score: " +this.totalScore.toString());
        this.levelScore = 0;
        this.levelScoreDisplay.setText("level Score: " +this.levelScore.toString());
        this.destroyedNotesCount = 0;
        this.hittableNoteRangeMin = 0;
        this.hittableNoteRangeMax = 0;
    }
}