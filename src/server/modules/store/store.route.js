
export default function getRoutes() {
    return [
        {
            url: '/store',
            method: 'DELETE',
            action: 'reset',
            data: {
                // authenticate: true
            }
        }
    ];
}
