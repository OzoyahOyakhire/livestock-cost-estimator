const axios = require('axios');

async function test() {
  try {
    const email = `testuser${Date.now()}@test.com`;
    // Register
    console.log("Registering user...");
    const regRes = await axios.post('https://livestock-cost-estimator-backend.onrender.com/api/v1/auth/register', {
      name: 'Test User',
      email: email,
      password: 'Password123!'
    });
    
    // Some APIs return token in response.data.token, or in cookies.
    // Let's check headers.
    let cookie = regRes.headers['set-cookie'] ? regRes.headers['set-cookie'].join(';') : '';
    
    console.log("Logging in...");
    const loginRes = await axios.post('https://livestock-cost-estimator-backend.onrender.com/api/v1/auth/login', {
      email: email,
      password: 'Password123!'
    }, { headers: cookie ? { Cookie: cookie } : {} });

    if (loginRes.headers['set-cookie']) {
      cookie = loginRes.headers['set-cookie'].join(';');
    }
    const token = loginRes.data.token || regRes.data.token;
    
    const reqHeaders = {};
    if (cookie) reqHeaders.Cookie = cookie;
    if (token) reqHeaders.Authorization = `Bearer ${token}`;

    console.log("Creating estimation...");
    const createRes = await axios.post('https://livestock-cost-estimator-backend.onrender.com/api/v1/estimation', {
      livestockType: 'poultry'
    }, { headers: reqHeaders, withCredentials: true });

    const id = createRes.data._id || createRes.data.estimation?._id || createRes.data.id;
    console.log("Created ID:", id);

    console.log("Probing Step 1 routes...");
    const payload = {
      productionType: 'broiler',
      productionSystem: 'deep litter',
      numberOfAnimals: 500,
      location: 'Test',
      cycleDuration: 10
    };

    const routes = [
      { method: 'patch', url: `/api/v1/estimation/${id}/step-1` },
      { method: 'patch', url: `/api/v1/estimation/${id}/step1` },
      { method: 'patch', url: `/api/v1/estimation/${id}` },
      { method: 'put', url: `/api/v1/estimation/${id}/step-1` },
      { method: 'patch', url: `/api/v1/estimation/${id}/step-2` }
    ];

    for (const route of routes) {
      try {
        console.log(`Trying ${route.method.toUpperCase()} ${route.url}...`);
        await axios[route.method](`https://livestock-cost-estimator-backend.onrender.com${route.url}`, payload, { headers: reqHeaders });
        console.log(`✅ SUCCESS: ${route.method.toUpperCase()} ${route.url}`);
      } catch (err) {
        console.log(`❌ FAILED: ${route.url} - ${err.response?.status} - ${JSON.stringify(err.response?.data)}`);
      }
    }

  } catch (err) {
    console.error('Setup Error:', err.response?.status, JSON.stringify(err.response?.data, null, 2));
  }
}
test();
