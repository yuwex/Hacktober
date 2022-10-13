import { Time } from "phaser";
import { Note } from "./note";

export class NoteLane extends Phaser.GameObjects.GameObject {
    sprite: Phaser.GameObjects.Sprite;

    songPlaying: boolean = false;
    notes: Note[];
    hittableNoteRangeMin: number = 0;
    hittableNoteRangeMax: number;
    destroyedNotesCount: number = 0;
    
    songSpeed: number = 1.0;

    clock: Phaser.Time.Clock;
    clockOffset: number = 0;

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

    endMessages: string[] = ["Message 1", "Message 2" , "Message 3"];

    constructor(scene: Phaser.Scene) {
        super(scene, "noteLane");
    }

    // Draws some things on screen
    init(songData: any[], clock: Phaser.Time.Clock): void {
        this.centerX = this.scene.cameras.main.centerX;
        this.centerY = this.scene.cameras.main.centerY;

        this.notes = [];
        this.clock = clock;

        // Draws the lane
        const rectWidth = 128;
        this.scene.add.rectangle(this.centerX, this.centerY, this.centerX * 2, rectWidth, 0xeeeeee);

        // Draws the circle where notes should be when hit
        const noteHitCircle = this.scene.add.circle(this.noteHitX, this.centerY, 64);
        noteHitCircle.setStrokeStyle(4, 0x111111);
        noteHitCircle.setDepth(2);

        // Score text
        // find way to not hard core in the position values
        this.levelScoreDisplay = this.scene.add.text(0, 15, 'level Score: 0', { fontFamily: this.ourFontFamily });
        this.totalScoreDisplay = this.scene.add.text(0, 0, 'total Score: 0', { fontFamily: this.ourFontFamily });

        // Accuracy popup
        this.accuracyText = this.scene.add.text(0, 30, "Start!", { fontFamily: this.ourFontFamily });
        this.accuracyText.setAlpha(1);

        this.startSong(songData, clock);
    }

    update(delta: number, time: number): void {
        if(!this.songPlaying) return;

        time = time - this.clockOffset;

        // Change accuracy opacity
        if (this.accuracyText.alpha > 0) {
            this.accuracyText.setAlpha(this.accuracyText.alpha - (delta / 1000));
        }

        // For every note, if offscreen, delete it
        for(let i = 0; i < this.notes.length; i++) {
            const note = this.notes[i];
            if(!note.active) continue;
            
            // Position notes
            note.x = (note.time - time) * (this.songSpeed + note.speed - 1) + this.noteHitX;
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
            // console.log(`LevelScore: ${this.levelScore}, ScoreToMoveOn: ${this.ScoreToMoveOn}`)
            if (this.levelScore > this.ScoreToMoveOn){
                this.keepGoing();
                this.startSong([], this.clock);
            } else {
                this.endSong();
                // make this nicer, display totalscore and give cool message 
                // rage game element -> have annoying message refrencing the score
                this.endMessage = this.scene.add.text(this.centerX, this.centerY, 'GAME OVER ' + this.pickRandom(this.endMessages), { fontFamily: this.ourFontFamily  });
                this.endMessage.setColor('#FD7E14');
                this.endMessage.setFontSize(25); // prolly a better way to do this
            }
        }
    }

    tryHitNote() {
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
            let accuracy: number = (1 - Math.abs(this.noteHitX - note.x) / 64) * 100;

            if (accuracy >= 85) {
                this.addScore(100);

            } else if (accuracy >= 60) {
                this.addScore(90);

            } else if (accuracy > 0) {
                this.addScore(80);

            }

            this.accuracyPopup(accuracy);

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
            console.log("MISS");
            this.addScore(-100);
        }
        
        this.levelScoreDisplay.setText("level Score: " + this.levelScore.toString());
        // maybe also update total score each time instead of at end of level
        // this.levelScoreDisplay.setText("level Score: " + this.levelScore.toString());

    }

    startSong(songData: any[], clock: Phaser.Time.Clock) {

        // TODO: replace this with getting data from songData.notes
        // https://github.com/bui/taiko-web/wiki/TJA-format

        // I don't think we should use tja format--> 
        // we aren't necesarily making a taiko clone,
        // and tja format has a bunch of taiko-specific stuff.
        // It also would be v hard to map out our own songs with tja format. (i've tried)

        this.songSpeed = Phaser.Math.Between(50, 130) / 100; 
        
        console.log(`Starting song with speed multiplier of ${this.songSpeed}.`);

        // Placeholder
        for(let i = 0; i < 9; i++) {
            const note = new Note(
                this.scene, 
                this.centerX * 2,
                this.centerY,
                'circle1',
                (i + 1) * 1000);

            note.setDepth(1);
            this.scene.add.existing(note);
            this.notes.push(note);
        }

        this.hittableNoteRangeMin = 0;
        this.hittableNoteRangeMax = Math.min(this.notes.length - 1, 4);

        this.clockOffset = clock.now;
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
    accuracyPopup(acc: number) {
        this.accuracyText.setAlpha(1);
        
        if (acc >= 85) {
            this.accuracyText.setColor('#FD7E14');
            this.accuracyText.setText("PERFECT");
        } else if (acc >= 60) {
            this.accuracyText.setColor('#FFE066');
            this.accuracyText.setText("GOOD");
        } else if (acc >= 0) {
            this.accuracyText.setColor('#FFF3BF');
            this.accuracyText.setText("OK");
        } else {
            this.accuracyText.setColor('#676767');
            this.accuracyText.setText("MISS");
        }
    }


    // feels super janky, most likely a better way
    keepGoing() {
        console.log(`level ended with score of ${this.levelScore}. Next level Coming up!`);
        this.notes = [];
        // this.totalScore += this.levelScore;
        // this.totalScoreDisplay.setText("total Score: " +this.totalScore.toString());
        this.levelScore = 0;
        this.levelScoreDisplay.setText("level Score: " +this.levelScore.toString());
        this.destroyedNotesCount = 0;
        this.hittableNoteRangeMin = 0;
        this.hittableNoteRangeMax = 0;
    }

    // adds to both level and toal 
    addScore(addThis: number){
        this.levelScore += addThis;
        this.totalScore += addThis;
        this.levelScoreDisplay.setText("level Score: " + this.levelScore.toString());
        this.totalScoreDisplay.setText("total Score: " + this.totalScore.toString());
    }

    // returns random message from array
    pickRandom(arr: any[]){
        return arr[Math.floor(Math.random() * (arr.length))];
    }
}