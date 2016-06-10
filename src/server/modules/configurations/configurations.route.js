
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
            url: '/configurations/:name',
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
            url: '/configurations/:name',
            method: 'PUT',
            action: 'update',
            data: {
                authenticate: true
            }
        },
        {
            url: '/configurations/:name',
            method: 'DELETE',
            action: 'delete',
            data: {
                authenticate: true
            }
        }
    ];
}
