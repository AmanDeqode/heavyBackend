export const grantsObject = {
  admin: {
    grants: [
      { resource: 'auth', action: ['GET', 'POST', 'PATCH', 'PUT'] },
      { resource: 'users', action: ['GET', 'POST', 'PATCH', 'PUT'] },
    ],
  },
  user: {
    grants: [{ resource: 'auth', action: ['POST', 'GET'] }],
  },
  consumer: {
    grants: [{ resource: 'auth', action: ['POST'] }],
  },
};
