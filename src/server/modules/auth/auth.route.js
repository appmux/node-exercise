
export default function getRoutes() {
    return [
        {
            url: '/auth',
            module: 'auth',
            action: 'token',
            headers: {'Content-Type': 'application/json'},
            data: {
                test: 'some data'
            }
        }
    ];
}
