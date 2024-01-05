import { accurateTimer } from "./time";

class IdleGame {
    stockpile = new Produce();
    growth = new Produce();

    constructor() {}

    _timer;
    Start() {
        this.Tick();
    }

    Stop() {
        this._timer?.cancel();
    }

    // Screen Update
    Update() {

    }

    // Tick Loop - Updates Logic
    Tick() {
        // do stuff
        this._timer = accurateTimer(this.Tick());
    }
}

class Building {
    name = 'Building';

    constructor() {}
}

class Produce {
    food = 0;
    work = 0;
    gold = 0;
    science = 0;
    culture = 0;

    constructor(food, work, gold, science, culture) {
        this.food = Number(food) ?? 0;
        this.work = Number(work) ?? 0;
        this.gold = Number(gold) ?? 0;
        this.science = Number(science) ?? 0;
        this.culture = Number(culture) ?? 0;
    }
}

class Resource {
    name = 'Resource';

    constructor() {}
}