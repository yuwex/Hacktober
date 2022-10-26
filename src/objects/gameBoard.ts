import { NoteLane } from "./noteLane";
import { Note } from "./note";

export class GameBoard extends Phaser.GameObjects.GameObject {

    // this is to help structure our game and allow for multiple lanes

    // create instances of Lanes so that we can have multiple
    // have central things like score and song start/stop in this file

    // put the key press needed into each notelane (pass into constructor for a noteLane)

    // try scale the Gameboard to size instead of hardcoding values

    // will need to modify: gameBoard and noteLanes

    // creating an empty file for now
    // for these written notes and to help with potential merge conflicts

    // hopefully I'll (Andrew) be able to get some time to work on this

    noteLanes: NoteLane[] = [];
    songPlaying = false;

    songSpeed: number = 1.0;

    clock: Phaser.Time.Clock;
    clockOffset: number = 0;

    noteHitX: number = 128;

    totalScore: number = 0;
    totalScoreDisplay: Phaser.GameObjects.Text;

    levelScore: number = 0;
    levelScoreDisplay: Phaser.GameObjects.Text;

    accuracyText: Phaser.GameObjects.Text;

    // text to show when lose the game
    endMessage: Phaser.GameObjects.Text;
    endMessages: string[] = ["Message 1", "Message 2", "Message 3"];
    // the score needed to progress to next level
    ScoreToMoveOn: number = 100;

    centerX: number;
    centerY: number;

    constructor(scene: Phaser.Scene) {
        super(scene, "gameBoard");
    }

    init(songData: any[], clock: Phaser.Time.Clock): void {

        let font: string = 'Georgia, "Goudy Bookletter 1911", Times, serif'
        // Score text
        // find way to not hard core in the position values
        this.levelScoreDisplay = this.scene.add.text(0, 15, 'level Score: 0', { fontFamily: font });
        this.totalScoreDisplay = this.scene.add.text(0, 0, 'total Score: 0', { fontFamily: font });

        // Accuracy popup
        this.accuracyText = this.scene.add.text(0, 30, "Start!", { fontFamily: font });
        this.accuracyText.setAlpha(1);

        this.startSong(songData, clock);

        this.noteLanes.push(new NoteLane(this.scene));
    }

    startSong(songData: any[], clock: Phaser.Time.Clock) {

        this.songSpeed = Phaser.Math.Between(50, 130) / 100;

        console.log(`Starting song with speed multiplier of ${this.songSpeed}.`);

        // Placeholder
        for (const lane of this.noteLanes) {

            for (let i = 0; i < 9; i++) {
                const note = new Note(
                    this.scene,
                    this.centerX * 2,
                    this.centerY,
                    'circle1',
                    (i + 1) * 1000);

                this.scene.add.existing(note);
                lane.notes.push(note);
            }

            lane.init([], this.clock);
        }

        this.clockOffset = clock.now;

        console.log(this.noteLanes);
    }

    update(delta: number, time: number): void {
        for (const lane of this.noteLanes) {
            lane.update(delta, time);
        }
    }

    endSong() {
        console.log(`Song ended with score of ${this.totalScore}.`);
        this.songPlaying = false;
        this.levelScore = 0;
        this.totalScore = 0;

    }

}