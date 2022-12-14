import { Note } from "./note";
import { GameBoard } from '../objects/gameBoard';


export class NoteLane extends Phaser.GameObjects.GameObject {
    // this chunk at the top are things that may be changed 

    // I lowered these bc we have multi lanes now
    // add in something to scale this to num of lanes?
    minSpeed: integer = 20; 
    maxSpeed: integer = 60;
    // the score needed to progress to next level
    ScoreToMoveOn: number = 100;


    songPlaying: boolean = false;
    notes: Note[];

    hittableNoteRangeMin: number = 0;
    hittableNoteRangeMax: number;
    destroyedNotesCount: number = 0;
    
    songSpeed: number = 1.0;

    clock: Phaser.Time.Clock;
    clockOffset: number = 0;

    noteHitX: number = 128;

    laneScore: number = 0;
    laneScoreDisplay: Phaser.GameObjects.Text;

    accuracyText: Phaser.GameObjects.Text;

    keyToPress: string;
    keyToPressShow: Phaser.GameObjects.Text;

    // text to show when lose the game
    endMessage: Phaser.GameObjects.Text;
    endMessages: string[] = ["Whatever.", "You Tried." , "Git Gud." , "Yikes." , "Could be better" ];
    
    // Center of the screen
    centerX: number;
    centerY: number;

    // create as var so easy to change all at once 
    ourFontFamily: string = 'Georgia, "Goudy Bookletter 1911", Times, serif';

    gameBoard: GameBoard;

    // Var that goes up to 100, representing max difficulty
    difficulty: integer = 1;
    difficutlyIncreaseMin: integer = 3;
    difficultyIncreaseMax: integer = 5;

    constructor(scene: Phaser.Scene) {
        super(scene, "noteLane");
    }

    // Draws some things on screen
    init(songData: any[], clock: Phaser.Time.Clock, whichLane: integer, numOfLanes: integer, gb: GameBoard, key: string): void {
        this.gameBoard = gb;
        this.centerX = this.scene.cameras.main.centerX;
        this.centerY = (this.scene.cameras.main.centerY / numOfLanes) * whichLane;
        this.notes = [];
        this.clock = clock;
        this.keyToPress = key;

        // Draws the lane
        const rectWidth = 128;
        this.scene.add.rectangle(this.centerX, this.centerY, this.centerX * 2, rectWidth, 0xeeeeee);

        // Draws the circle where notes should be when hit
        // const noteHitCircle = this.scene.add.circle(this.noteHitX, this.centerY, 64);
        // noteHitCircle.setStrokeStyle(4, 0x111111);

        const noteHitCircle = this.scene.add.image(this.noteHitX, this.centerY, "goal")
        this.keyToPressShow = this.scene.add.text(this.noteHitX , this.centerY , this.keyToPress, { fontFamily: this.ourFontFamily });
        this.keyToPressShow.setColor('#0000FF');

        noteHitCircle.setDepth(0);

        this.accuracyText = this.scene.add.text(0, this.centerY , "Start!", { fontFamily: this.ourFontFamily });
        this.accuracyText.setAlpha(1);

        this.laneScoreDisplay = this.scene.add.text(0, this.centerY - 25   , "0" , { fontFamily: this.ourFontFamily });
        this.laneScoreDisplay.setColor('#000000');
        this.laneScoreDisplay.setFontSize(20);
        // this.endMessage.setFontSize(25); // prolly a better way to do this

        this.laneScoreDisplay.setAlpha(1);

        // this.startSong(songData, clock);
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
                this.addScore(-100);
            }
        }

        // Stupid workaround. See tryHitNote()
        this.hittableNoteRangeMin = Math.max(0, this.destroyedNotesCount - 4);
        this.hittableNoteRangeMax = Math.min(this.notes.length - 1, this.destroyedNotesCount + 4);

        if(this.destroyedNotesCount >= this.notes.length) {
            // only move on if did well enough 
            if (this.laneScore > this.ScoreToMoveOn){
                this.keepGoing();
                this.startSong([], this.clock);
            } else {
                // stop this lane, bc its score was too low
                this.endSong();
                this.endMessage = this.scene.add.text(this.centerX, this.centerY, this.pickRandom(this.endMessages), { fontFamily: this.ourFontFamily  });
                this.endMessage.setColor('#FD7E14');
                this.endMessage.setFontSize(25); // prolly a better way to do this
            }
        }
    }

    tryHitNote() {

        if (!this.gameBoard.started) {
            return;
        }

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
    }

    addScore(addThis: number){
        this.gameBoard.addScore(addThis); // for the scores for the whole gameBoard
        this.laneScore += addThis;
        this.laneScoreDisplay.setText(this.laneScore.toString());
    }

    createNote(type: string, time: number) {
        const note = new Note(
            this.scene, 
            this.centerX * 2,
            this.centerY,
            type,
            time
        );

        note.setDepth(1);
        this.scene.add.existing(note);
        this.notes.push(note);
    }

    startSong(songData: any[], clock: Phaser.Time.Clock) {
        // TODO: replace this with getting data from songData.notes
        // https://github.com/bui/taiko-web/wiki/TJA-format

        // I don't think we should use tja format--> 
        // we aren't necesarily making a taiko clone,
        // and tja format has a bunch of taiko-specific stuff.
        // It also would be v hard to map out our own songs with tja format. (i've tried)

        this.songSpeed = (Phaser.Math.Between(this.minSpeed, this.maxSpeed) + this.difficulty) / 100; 
        
        console.log(`Starting song with speed multiplier of ${this.songSpeed}.`);

        // Chance: num btwn 1 - 100. 1 = 1% chance true, 100 = 100% chance true
        function chance(chance: number) {
            return (chance >= Phaser.Math.Between(1, 100))
        }

        // Placeholder
        for(let i = 0; i <= 32; i++) {

            if (this.gameBoard.totalScore == 0) {
                if (i % 4 == 0) {
                    this.createNote("basicNote", (i + 1) * 250 + 1000);
                }
                continue;
            }

            if (i % 4 == 0 && chance(90)){
                this.createNote("basicNote", (i + 1) * 250 + 1000);
                continue;
            }

            if (i % 2 == 0 && chance(this.difficulty * 2)) {
                this.createNote("basicNote", (i + 1) * 250 + 1000);
                continue;
            }

            if (chance(this.difficulty / 2)) {
                this.createNote("basicNote", (i + 1) * 250 + 1000);
                continue;
            }

        }

        this.hittableNoteRangeMin = 0;
        this.hittableNoteRangeMax = Math.min(this.notes.length - 1, 4);

        this.clockOffset = clock.now;
        this.songPlaying = true;
    }

    // Funny animation text
    // change colors here so its easier to read on white ?
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
        console.log(`level ended with score of ${this.gameBoard.levelScore}. Next level Coming up!`);
        this.notes = [];
        // this.totalScore += this.levelScore;
        // this.totalScoreDisplay.setText("total Score: " +this.totalScore.toString());
        this.gameBoard.levelScore = 0;
        this.laneScore = 0;
        this.laneScoreDisplay.setText(this.laneScore.toString());
        this.gameBoard.levelScoreDisplay.setText("level Score: " +this.gameBoard.levelScore.toString());
        this.destroyedNotesCount = 0;
        this.hittableNoteRangeMin = 0;
        this.hittableNoteRangeMax = 0;

        // Increase difficulty every time complete level
        this.difficulty += Phaser.Math.Between(this.difficutlyIncreaseMin, this.difficultyIncreaseMax);
    }

    endSong() {
        console.log(`Song ended with score of ${this.gameBoard.totalScore}.`);
        this.songPlaying = false;
        this.notes = [];
        this.gameBoard.levelScore = 0;
        this.gameBoard.totalScore = 0;
        this.destroyedNotesCount = 0;
        this.hittableNoteRangeMin = 0;
        this.hittableNoteRangeMax = 0;
        this.laneScore = 0;
    }

    // returns random element from array - used to select message
    pickRandom(arr: any[]){
        return arr[Math.floor(Math.random() * (arr.length))];
    }
}