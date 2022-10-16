export class GameManagerPlugin extends Phaser.Plugins.BasePlugin {
    private currentScene: string = 'MainScene';
    currentCharacterId: string = '';

    constructor(pluginManager: Phaser.Plugins.PluginManager) {
        super(pluginManager);
    }

    changeScene(scene: string) {
        this.game.scene.start(scene);
        this.currentScene = scene;
    }
}