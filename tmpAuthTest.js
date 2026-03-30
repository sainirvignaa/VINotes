const http = require('http');
function req(path, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const r = http.request(options, (res) => {
      let s = '';
      res.on('data', (c) => (s += c));
      res.on('end', () => resolve({ statusCode: res.statusCode, body: s }));
    });
    r.on('error', reject);
    r.write(body);
    r.end();
  });
}
(async () => {
  try {
    const register = await req('/api/auth/register', { name: 'Test Node', email: 'test-node@example.com', password: 'password123' });
    console.log('REGISTER', register.statusCode, register.body);
    const login = await req('/api/auth/login', { email: 'test-node@example.com', password: 'password123' });
    console.log('LOGIN', login.statusCode, login.body);
  } catch (error) {
    console.error('ERROR', error.message);
  }
})();
