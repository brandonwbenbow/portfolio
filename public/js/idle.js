import { accurateTimer } from "./time.js";

class IdleGame {
    all_time = new Produce();
    stockpile = new Produce();
    growth = new Produce();

    resources = new Map();
    buildings = new Map();
    producers = new Map();

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

        let tick_produce = new Produce();
        let p = Array.from(this.producers, ([name, value]) => value);
        for(let i = 0; i < p.length; i++) {
            // this.stockpile.add(this.producers[i].produce);
            tick_produce.add(p[i].asCount());
        }

        // Add to Game Produce Counts
        this.AddToPile(tick_produce);

        // Save to LocalStorage
        this.Save();

        // console.log("Tick: ", Date.now());
        // cancel tick with this._timer.cancel()
    }

    AddToPile(produce) {
        this.growth = produce;
        this.stockpile.add(produce);
        this.all_time.add(produce);
    }

    AddProducer(producer) {
        if(this.producers.has(producer.name)) { return this.producers.get(producer.name).count += 1; }
        this.producers.set(producer.name, producer);
    }

    ConstructDom() {
        const createButton = (text, title, callback, cost) => {
            let elem = document.createElement('button');
            elem.textContent = text;
            elem.setAttribute('title', title);
            elem.onclick = cost ? () => {
                if(!this.stockpile.has(cost)) { return; }
                this.stockpile.remove(cost); callback();
            } : callback;
            return elem;
        }

        let group = document.getElementById('buttons');

        // Trees
        group.appendChild(createButton("Tree", "1 Food, 2 Work", () => { this.AddToPile(new Produce(1, 2)); }));
        group.appendChild(createButton("Wood Cutter", "0.2 Food, 0.4 Work per Tick", () => {
            this.AddProducer(new Producer("Wood Cutter", new Produce(0.2, 0.4)));
        }, new Produce(10)));
        
        group.appendChild(document.createElement('br'));

        // Rock
        group.appendChild(createButton("Rock", "4 Work", () => { this.AddToPile(new Produce(0, 4)); }));
        group.appendChild(createButton("Stone Cutter", "1 Work per Tick", () => {
            this.AddProducer(new Producer("Stone Cutter", new Produce(0, 1)));
        }, new Produce(10, 10)));

        group.appendChild(document.createElement('br'));

        // Wheat
        group.appendChild(createButton("Wheat", "3 Food", () => { this.AddToPile(new Produce(3)); }));
        group.appendChild(createButton("Farmer", "0.8 Food per Tick", () => {
            this.AddProducer(new Producer("Farmer", new Produce(0.8)));
        }, new Produce(20, 20)));
    }

    UpdateStats() {
        let stats = document.getElementById('stats');
        stats.textContent = this.stockpile.toString();
    }

    Save() {
        let json = {
            all_time: this.all_time.toJSON(),
            stockpile: this.stockpile.toJSON(),
            growth: this.growth.toJSON(),

            resources: Array.from(this.resources, ([name, value]) => (value.toJSON())),
            buildings: Array.from(this.buildings, ([name, value]) => (value.toJSON())),
            producers: Array.from(this.producers, ([name, value]) => (value.toJSON())),
        }

        window.localStorage.setItem('game', JSON.stringify(json));

        // Refreshing the game speeds up tick time, need to check last tick time on load
        window.localStorage.setItem('last_tick_time', this._last_tick_time);
    }

    Load() {
        let json = JSON.parse(window.localStorage.getItem('game') ?? '{}');

        this.all_time = new Produce(json.all_time);
        this.stockpile = new Produce(json.stockpile);
        this.growth = new Produce(json.growth); // might calculate on load
        
        this.resources = new Map(json.resources?.map((obj) => [obj.name, new Resource(obj)]) ?? []);
        this.buildings = new Map(json.buildings?.map((obj) => [obj.name, new Building(obj)]) ?? []);
        this.producers = new Map(json.producers?.map((obj) => [obj.name, new Producer(obj)]) ?? []);

        console.log(this, json, this.producers);
    }
}

class Produce {
    food = 0;
    work = 0;
    gold = 0;
    science = 0;
    culture = 0;

    // Can Accept food 
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

    remove(produce) {
        this.food -= produce.food ?? 0;
        this.work -= produce.work ?? 0;
        this.gold -= produce.gold ?? 0;
        this.science -= produce.science ?? 0;
        this.culture -= produce.culture ?? 0;
    }

    has(produce) {
        return this.food >= produce.food && this.work >= produce.work && this.gold >= produce.gold
            && this.science >= produce.science && this.culture >= produce.culture;
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
    count = 1;
    produce;

    constructor() {}

    toJSON() {}
}

class Building {
    name = 'Building';
    count = 1;
    produce;

    constructor() {}

    toJSON() {}
}

class Producer {
    name = "Producer";
    count = 1;    
    produce;

    // Can Accept Name parameter as Procder toJSON output
    constructor(name, perTick = new Produce(), count = 1) {
        this.name = name?.name || name || "Producer";
        this.count = name?.count || count;
        this.produce = name?.produce ? name?.produce?.toJSON ? name.produce : new Produce(name.produce) : perTick;
    }

    asCount(produce = this.count) {
        return {
            food: this.produce.food * produce,
            work: this.produce.work * produce,
            gold: this.produce.gold * produce,
            science: this.produce.science * produce,
            culture: this.produce.culture * produce,
        }
    }

    toJSON() {
        return {
            name: this.name,
            count: this.count,
            produce: this.produce?.toJSON()
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new IdleGame();
    game.Start();
});