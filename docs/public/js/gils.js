// Risk -> Civ/KC3 -> TFT

// Simple, but Complex Mechanicly, Grand Idle-Lite Strategy Game (GILS)
    // Can play "Real Time" (5 Minutes is a Day in Game) - Slower Civ Style - Strategy - Idle
    // Can play "Fast Mode" (Minute is a Year in Game) - Quick StS Style - Rougelite

// 3 Levels
    // TFT Fights on Borders
    // Government Deck Builder (No Cards Visually but Same Mechanic)
    // Civ-esque Idle Empire Management

// Each Level will have Attribute Combos (TFT)
    // Some will have Multi Level Combos, So will be single level only

// Certain Attributes add new Mechanics to Levels

// Combining TacticGame and IdleGame for the different levels for auto
    // Global Idle for GeneralTicks and MultiLevel Resources
    // Level Based Tactic Logic for Attributes and Level Based Resources

import { IdleGame } from './idle.js';
import { TacticGame } from './tactic.js';

const Config = {
    types: [
        { type: 0, name: "Agriculture", icon: "https://www.svgrepo.com/show/129198/ear-of-wheat.svg" },
        { type: 1, name: "Labor", icon: "https://i.pinimg.com/originals/08/d4/c4/08d4c4232ad5c3b152835810d8339de9.png" },
        { type: 2, name: "Merchent", icon: "https://www.svgrepo.com/show/487221/coin.svg" },
        { type: 3, name: "Research", icon: "https://www.svgrepo.com/show/532481/vial.svg" },
        { type: 4, name: "Culture", icon: "https://www.svgrepo.com/show/281801/paint-brush-art.svg" }
    ]
}

const Empire = new IdleGame(Config);      // "Empire" Global
const Senate = new TacticGame(Config);    // "Government" Level
const People = new TacticGame(Config);    // "City" Level - Multi City Mechanic Later
const Battle = new TacticGame(Config);    // "War" Level

// Starting with Empire Layout
    // Work from Squares to Polygons

const squares = [];

document.addEventListener('DOMContentLoaded', () => {
    // Create DOM
    // Start Game
});