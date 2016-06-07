
export default function getRoutes() {
    return [
        {
            url: '/configurations',
            method: 'GET',
            module: 'configurations',
            action: 'index',
            headers: {'Content-Type': 'application/json'},
            data: {
                authenticate: true
            }
        },
        {
            url: '/configurations',
            method: 'POST',
            module: 'configurations',
            action: 'post',
            headers: {'Content-Type': 'application/json'},
            data: {
                authenticate: true
            }
        },
        {
            url: '/configurations',
            method: 'PUT',
            module: 'configurations',
            action: 'put',
            headers: {'Content-Type': 'application/json'},
            data: {
                authenticate: true
            }
        }
    ];
}
