
export default function getRoutes() {
    return [
        {
            url: '/auth/token',
            action: 'token',
            data: {
                test: 'some data'
            }
        }
    ];
}
