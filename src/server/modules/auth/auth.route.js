
export default function getRoutes() {
    return [
        {
            url: '/auth/token',
            action: 'token',
            method: 'POST'
        },
        {
            url: '/auth/token',
            action: 'logOut',
            method: 'DELETE',
            data: {
                authenticate: true
            }
        },
        {
            url: '/auth/valid-token',
            action: 'validate',
            data: {
                authenticate: true
            }
        }
    ];
}
