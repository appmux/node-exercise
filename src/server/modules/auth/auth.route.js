
export default function getRoutes() {
    return [
        {
            url: '/auth/token',
            action: 'token',
            method: 'POST'
        },
        {
            url: '/auth/refresh-token',
            action: 'refreshToken',
            method: 'POST'
        },
        {
            url: '/auth/refresh-token',
            action: 'logOut'
        }
    ];
}
