
export default function getRoutes() {
  return [
    {
      url: '/contacts',
      action: 'index'
    },
    {
      url: '/contacts',
      method: 'POST',
      action: 'create'
    },
    {
      url: '/contacts',
      method: 'DELETE',
      action: 'delete'
    }
  ];
}
