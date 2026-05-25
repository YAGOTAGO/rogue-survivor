import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game ,Scale, Types } from 'phaser';
import { Preloader } from './scenes/Preloader';
import RexUIPlugin from 'phaser4-rex-plugins/templates/ui/ui-plugin.js';

const config: Types.Core.GameConfig = {
    type: AUTO,
    width: 640,
    height: 360,
    pixelArt: true,
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
        autoRound: true 
    },
    fps: {
        target: 60
    },
    input: {
        keyboard: true,
        mouse: true,
        touch: true,
        gamepad: true
    },
    parent: 'game-container',
    backgroundColor: '#0e161d',
    plugins: {
        scene: [{
            key: 'rexUI',
            plugin: RexUIPlugin,
            mapping: 'rexUI'
        }]
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver
    ]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
}

export default StartGame;
