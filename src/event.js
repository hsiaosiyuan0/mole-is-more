import EventEmitter from "events";

export const EventBus = new EventEmitter();

export const EVENT_WASM_READY = "wasm_ready";
