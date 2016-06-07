
let events = {};

export function subscribe(name, callback) {
    if (!events[name]) {
        events[name] = [];
    }

    events[name].push(callback);
}

export function dispatch(name, ...rest) {
    (events[name] || []).map(subscriber => subscriber.apply(null, rest));
}
