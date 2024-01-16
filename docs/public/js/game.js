import { accurateTimer } from "./time.js";

export class Game {
    config; _config;
    state; _state;

    _last_tick_time;
    _timer;
    constructor(config) {
        this._config = config;
        this.config = {
            tick_rate: config?.tick_rate ?? 1000,
            ...config
        }

        this.Load();
    }

    Start() {
        this.Load();

        this.Tick();
        this._timer = accurateTimer(() => { this.Tick() }, this.config?.tick_rate); // Configurable Fixed Tick

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
    }

    toJSON() {
        return this._state;
    }

    rehydrateFromJSON(state, keep_alive = true) {
        this._state = state;
        this.state = {
            running: keep_alive ?? false,
        }
    }

    Save() {
        // Game State
        window.localStorage.setItem('game', JSON.stringify(this.toJSON()));

        // Refreshing the game speeds up tick time, need to check last tick time on load
        window.localStorage.setItem('last_tick_time', this._last_tick_time);
    }

    Load() {
        let json = JSON.parse(window.localStorage.getItem('game') ?? '{}');
        this.rehydrateFromJSON(json);
    }
}