import { accurateTimer } from "./time.js";

class IdleGame {
    stockpile = new Produce();
    growth = new Produce();

    resources = [];
    buildings = [];
    producers = [];

    constructor() {
        this.ConstructDom();
        this.Load();
    }

    _last_tick_time;
    _timer;
    Start() {
        this.Tick();
        this._timer = accurateTimer(() => { this.Tick() });

        this.Update();
    }

    Stop() {
        this._timer?.cancel();
    }

    // Screen Update
    Update() {
        this.UpdateStats();
        window.requestAnimationFrame(() => { this.Update(); });
    }

    // Tick Loop - Updates Logic
    Tick() {
        this._last_tick_time = Date.now();

        for(let i = 0; i < this.producers.length; i++) {
            this.stockpile.add(this.producers[i].produce);
        }

        // Save to LocalStorage
        this.Save();

        // console.log("Tick: ", Date.now());
        // cancel tick with this._timer.cancel()
    }

    ConstructDom() {
        const createButton = (text, callback) => {
            let elem = document.createElement('button');
            elem.textContent = text;
            elem.onclick = callback;
            return elem;
        }

        let group = document.getElementById('buttons');
        group.appendChild(createButton("Tree", () => { 
            this.stockpile.work += 2; this.stockpile.food += 1; 
        }));

        group.appendChild(createButton("Wood Cutter", () => {
            if(this.stockpile.food < 10) { return; }
            this.stockpile.food -= 10;
            this.producers.push(new Producer("Wood Cutter", new Produce(0.2, 0.4)));
        }));
    }

    UpdateStats() {
        let stats = document.getElementById('stats');
        stats.textContent = this.stockpile.toString();
    }

    Save() {
        let json = {
            stockpile: this.stockpile.toJSON(),
            growth: this.growth.toJSON(),

            resources: this.resources.map((res) => { return res.toJSON() }),
            buildings: this.buildings.map((res) => { return res.toJSON() }),
            producers: this.producers.map((res) => { return res.toJSON() })
        }

        window.localStorage.setItem('game', JSON.stringify(json));

        // Refreshing the game speeds up tick time, need to check last tick time on load
        window.localStorage.setItem('last_tick_time', this._last_tick_time);
    }

    Load() {
        let json = JSON.parse(window.localStorage.getItem('game') ?? {});

        this.stockpile = new Produce(json.stockpile);
        this.growth = new Produce(json.growth); // might calculate on load
        
        this.resources = json.resources?.map((res) => new Resource(res.name, new Produce(res.produce))) ?? [];
        this.buildings = json.buildings?.map((res) => new Building(res.name, new Produce(res.produce))) ?? [];
        this.producers = json.producers?.map((res) => new Producer(res.name, new Produce(res.produce))) ?? [];

        console.log(this, json);
    }
}

class Produce {
    food = 0;
    work = 0;
    gold = 0;
    science = 0;
    culture = 0;

    constructor(food, work, gold, science, culture) {
        this.food = Number(food) || Number(food?.food) || 0;
        this.work = Number(work) || Number(food?.work) || 0;
        this.gold = Number(gold) || Number(food?.gold) || 0;
        this.science = Number(science) || Number(food?.science) || 0;
        this.culture = Number(culture) || Number(food?.culture) || 0;
    }

    roundFloats() {
        const roundDec = (num) => { return Math.round((num + Number.EPSILON) * 100) / 100 }
        this.food = roundDec(this.food);
        this.work = roundDec(this.work);
        this.gold = roundDec(this.gold);
        this.science = roundDec(this.science);
        this.culture = roundDec(this.culture);
    }

    toString() {
        this.roundFloats();
        return `Food: ${this.food} | Work: ${this.work} | Gold: ${this.gold} | Science: ${this.science} | Culture: ${this.culture}`;
    }

    add(produce) {
        this.food += produce.food ?? 0;
        this.work += produce.work ?? 0;
        this.gold += produce.gold ?? 0;
        this.science += produce.science ?? 0;
        this.culture += produce.culture ?? 0;
    }

    toJSON() {
        return {
            food: this.food,
            work: this.work,
            gold: this.gold,
            science: this.science,
            culture: this.culture
        }
    }
}

class Resource {
    name = 'Resource';
    produce;

    constructor() {}

    toJSON() {}
}

class Building {
    name = 'Building';
    produce;

    constructor() {}

    toJSON() {}
}

class Producer {
    name = "Producer";
    produce;

    constructor(name, perTick = new Produce()) {
        this.name = name || "Producer";
        this.produce = perTick;
    }

    toJSON() {
        return {
            name: this.name,
            produce: this.produce?.toJSON()
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new IdleGame();
    game.Start();
});