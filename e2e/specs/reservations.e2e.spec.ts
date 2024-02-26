describe('Reservations', () => {
  let cookie: string;

  beforeAll(async () => {
    const user = {
      email: 'princejolade@gmail.com',
      password: '%$!$5GFtsgftaTT',
    };

    const res = await fetch('http://auth:3001/auth/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    cookie = res.headers
      .getSetCookie()[0]
      .split('=')[1]
      .split(';')[0] as unknown as string;
  });
  let reservation: { _id: string };

  test('Create', async () => {
    const responseCreate = await fetch(
      'http://reservations:3000/reservations/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `AUTH=${cookie}`,
        },
        body: JSON.stringify({
          startDate: '12/20/2022',
          endDate: '12/25/2022',
          charge: {
            amount: 66,
            card: {
              cvc: '413',
              exp_month: 12,
              exp_year: 2050,
              number: '4242 4242 4242 4242',
            },
          },
        }),
      },
    );

    expect(responseCreate.ok).toBeTruthy();

    reservation = await responseCreate.json();
  });

  test('Get', async () => {
    const responseGet = await fetch(
      `http://reservations:3000/reservations/${reservation._id}`,
      {
        method: 'GET',
        headers: {
          Cookie: `AUTH=${cookie}`,
        },
      },
    );

    expect(responseGet.ok).toBeTruthy();
  });
});
