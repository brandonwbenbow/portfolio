import { Game } from "./game.js";

export class IdleGame extends Game {
    all_time = new Produce();
    stockpile = new Produce();
    growth = new Produce();

    resources = new Map();
    buildings = new Map();
    producers = new Map();

    constructor(config) { super(config); }

    Start() {
        this.Load();

        this.Tick();
        this._timer = accurateTimer(() => { this.Tick() });

        this.Update();
    }

    // Stop() {} // Handled in Game.js

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

    UseResource(name) {
        let resource = this.resources.get(name);
        if(!resource || resource.count <= 0) { return false; }
        resource.count -= 1; 
        this.AddToPile(resource.produce);
        return true;
    }

    AddResource(resource) {
        if(this.resources.has(resource.name)) { this.resources.get(resource.name).count += 1; return true; }
        this.resources.set(resource.name, resource);
        return true;
    }

    AddProducer(producer) {
        // use resources
        if(this.producers.has(producer.name)) { this.producers.get(producer.name).count += 1; return true; }
        this.producers.set(producer.name, producer);
        return true;
    }

    ConstructDom(config = this.config) {
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

        const createButtonGroup = (id) => {
            let elem = document.createElement('div');
            elem.classList.add('button-group');
            elem.id = id;
            return elem;
        }

        const createResourceButton = (resource, callback) => {
            // custom button with data rendering
            callback = callback ? callback : () => { this.UseResource(resource.name) }

            let elem = document.createElement('div');
            elem.id = `resource-${resource.name}`;
            elem.classList.add('idle-button', 'resource-button');

            let elem2 = document.createElement('p');
            elem2.textContent = resource.name;
            elem.appendChild(elem2);

            elem2 = document.createElement('p');
            elem2.classList.add('count');
            elem2.textContent = resource.count;
            elem.appendChild(elem2);

            elem2 = document.createElement('button');
            elem2.textContent = "Use Resource";
            elem2.setAttribute('title', resource.produce.toTitle());
            elem2.onclick = callback;
            elem.appendChild(elem2);

            return elem;
        }

        const createProducerButton = (producer, callback) => {
            // custom button with data rendering
            callback = callback ? callback : () => { this.AddProducer(producer); }

            let elem = document.createElement('div');
            elem.id = `resource-${producer.name}`;
            elem.classList.add('idle-button', 'producer-button');

            let elem2 = document.createElement('p');
            elem2.textContent = producer.name;
            elem.appendChild(elem2);

            elem2 = document.createElement('p');
            elem2.classList.add('count');
            elem2.textContent = producer.count;
            elem.appendChild(elem2);

            elem2 = document.createElement('button');
            elem2.textContent = "Add Producer"
            elem2.setAttribute('title', producer.toTitle());
            elem2.onclick = () => {
                if(!this.stockpile.has(producer.cost)) { return; }
                this.stockpile.remove(producer.cost); callback();
            }
            elem.appendChild(elem2);

            return elem;
        }

        let group = document.getElementById('buttons');
        let type_group = [];

        const addList = (config_list, case_type) => {
            for(let i = 0; i < config_list?.length ?? 0; i++) {
                let rec = config_list[i];
                if(type_group[rec.type] == undefined) { type_group[rec.type] = createButtonGroup(`type-${rec.type}`); }

                let obj = null;
                switch(case_type) {
                    case 'resources':
                        obj = new Resource(rec.name, new Produce(...rec.produce));
                        type_group[rec.type].appendChild(createResourceButton(obj));
                        break;
                    case 'buildings':
                        break;
                    case 'producers':
                        obj = new Producer(rec.name, new Produce(...rec.produce), new Produce(...rec.cost));
                        type_group[rec.type].appendChild(createProducerButton(obj));
                        break;
                }
            }
        }

        addList(config.resources, 'resources');
        addList(config.buildings, 'buildings');
        addList(config.producers, 'producers');

        for(let i = 0; i < type_group.length; i++) {
            group.appendChild(type_group[i]);
        }
    }

    UpdateStats() {
        let stats = document.getElementById('stats');
        stats.textContent = this.stockpile.toString();
    }

    toJSON() {
        return {
            all_time: this.all_time.toJSON(),
            stockpile: this.stockpile.toJSON(),
            growth: this.growth.toJSON(),

            resources: Array.from(this.resources, ([name, value]) => (value.toJSON())),
            buildings: Array.from(this.buildings, ([name, value]) => (value.toJSON())),
            producers: Array.from(this.producers, ([name, value]) => (value.toJSON())),
        }
    }

    rehydrateFromJSON(json) {
        super.rehydrateFromJSON(json);

        this.all_time = new Produce(json.all_time);
        this.stockpile = new Produce(json.stockpile);
        this.growth = new Produce(json.growth); // might calculate on load
        
        this.resources = new Map(json.resources?.map((obj) => [obj.name, new Resource(obj)]) ?? []);
        this.buildings = new Map(json.buildings?.map((obj) => [obj.name, new Building(obj)]) ?? []);
        this.producers = new Map(json.producers?.map((obj) => [obj.name, new Producer(obj)]) ?? []);
    }

    Save() {
        // Game State
        window.localStorage.setItem('game', JSON.stringify(this.toJSON()));

        // Refreshing the game speeds up tick time, need to check last tick time on load
        window.localStorage.setItem('last_tick_time', this._last_tick_time);
    }

    // Matches Game.js
    // Load() {
    //     let json = JSON.parse(window.localStorage.getItem('game') ?? '{}');
    //     this.rehydrateFromJSON(json);
    // }
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

    toString() {
        this.roundFloats();
        return `Food: ${this.food} | Work: ${this.work} | Gold: ${this.gold} | Science: ${this.science} | Culture: ${this.culture}`;
    }

    toTitle() {
        const addToString = (str, value, name) => {
            return value > 0 ? `${str.length > 0 ? ', ' : ''}${value} ${name}` : '';
        }

        let str = ''
        str += addToString(str, this.food, 'Food');
        str += addToString(str, this.work, 'Work');
        str += addToString(str, this.gold, 'Gold');
        str += addToString(str, this.science, 'Science');
        str += addToString(str, this.culture, 'Culture');

        return str;
    }
}

class Resource {
    name = "Resource";
    count = 100; // removes instead of adds on use
    produce;
    // unlock maybe?

    constructor(name, produce = new Produce(), count = 1) {
        this.name = name?.name || name || "Resource";
        this.count = name?.count || count;
        this.produce = name?.produce ? name?.produce?.toJSON ? name.produce : new Produce(name.produce) : produce;
    }

    toJSON() {
        return {
            name: this.name,
            count: this.count,
            produce: this.produce?.toJSON()
        }
    }
}

class Building {
    name = 'Building';
    count = 1;
    produce;
    cost;

    constructor() {}

    toJSON() {

    }

    toTitle() {}
}

class Producer {
    name = "Producer";
    count = 1;    
    produce;
    cost;

    // Can Accept Name parameter as Procder toJSON output
    constructor(name, perTick = new Produce(), cost = new Produce, count = 1) {
        this.name = name?.name || name || "Producer";
        this.count = name?.count || count;
        this.produce = name?.produce ? name?.produce?.toJSON ? name.produce : new Produce(name.produce) : perTick;
        this.cost = name?.cost ? name?.cost?.toJSON ? name.cost : new Produce(name.cost) : cost;
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

    toTitle() {
        let str = this.produce.toTitle() + ` per Tick - Cost: ${this.cost.toTitle()}`;
        return str;
    }
}

const game_config = {
    resources: [
        { type: 0, name: 'Tree', produce: [1, 2] },
        { type: 1, name: 'Stone', produce: [0, 4] },
        { type: 2, name: 'Wheat', produce: [3] },
        { type: 3, name: 'Gold', produce: [0, 0, 1] },
        { type: 4, name: 'Book', produce: [0, 0, 0, 2] },
        { type: 5, name: 'Play', produce: [0, 0, 0, 0, 2] }
    ],
    buildings: [

    ],
    producers: [
        { type: 0, name: 'Tree Chopper', produce: [0.2, 0.4], cost: [5, 5] },
        { type: 1, name: 'Stone Cutter', produce: [0, 1], cost: [5, 10] },
        { type: 2, name: 'Farmer', produce: [0.8], cost: [15, 15, 10] },
        { type: 3, name: 'Gold Digger', produce: [0, 0, 0.1], cost: [10, 50, 10] },
        { type: 4, name: 'Researcher', produce: [0, 0, 0, 0.2], cost: [100, 0, 50, 10] },
        { type: 5, name: 'Playwrite', produce: [0, 0, 0, 0, 0.2], cost: [25, 5, 50, 20, 20] }
    ]
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new IdleGame(game_config);
    game.ConstructDom(game_config);
    game.Start();
});