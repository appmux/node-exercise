
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
            url: '/configurations',
            method: 'POST',
            action: 'post',
            data: {
                authenticate: true
            }
        },
        {
            url: '/configurations',
            method: 'PUT',
            action: 'put',
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
        }
    ];
}
