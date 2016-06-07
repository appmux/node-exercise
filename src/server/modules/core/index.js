
export function factory(sm) {
    this.dispatcher = sm.get('dispatcher');

    this.dispatcher.subscribe('onRoute', onRoute);

    return this;
}

function onRoute(req, res, route) {
    console.log('onRoute', route);
}
