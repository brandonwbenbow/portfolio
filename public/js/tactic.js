import { Game } from './game.js';

export class TacticGame extends Game {

    attributes = new Set();

    constructor(config) { super(config); }

    Tick() {

    }

    NewAttribute(attribute) {

    }
}

const game_config = {
    attributes: [
        { type: 0, name: "Factory" }
    ]
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new TacticGame(game_config); 
    game.Start();
});