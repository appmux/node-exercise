
export default function getRoutes() {
    return [
        {
            url: '/configurations',
            action: 'index',
            data: {
                authenticate: true
            }
        },
        {
            url: '/configurations/:host',
            action: 'details',
            data: {
                authenticate: true
            }
        },
        {
            url: '/configurations',
            method: 'POST',
            action: 'create',
            data: {
                authenticate: true
            }
        },
        {
            url: '/configurations/:host',
            method: 'PUT',
            action: 'update',
            data: {
                authenticate: true
            }
        },
        {
            url: '/configurations/:host',
            method: 'DELETE',
            action: 'delete',
            data: {
                authenticate: true
            }
        }
    ];
}
