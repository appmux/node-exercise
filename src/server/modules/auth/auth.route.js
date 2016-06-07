
export default function getRoutes() {
    return [
        {
            url: '/auth',
            action: 'token',
            data: {
                test: 'some data'
            }
        }
    ];
}
