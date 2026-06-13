const axios = require('axios');

async function test() {
  try {
    // Test Create
    const createRes = await axios.post('https://livestock-cost-estimator-backend.onrender.com/api/v1/estimation', {
      livestockType: 'poultry'
    });
    console.log('Create OK:', createRes.data);
    const id = createRes.data.estimation?._id || createRes.data._id || createRes.data.id;
    
    // Test Step 2
    try {
      const step2Res = await axios.patch(`https://livestock-cost-estimator-backend.onrender.com/api/v1/estimation/${id}/step-2`, {
        // trying empty object to see validation errors
      });
      console.log('Step 2 OK:', step2Res.data);
    } catch (err) {
      console.error('Step 2 Error:', err.response?.data);
    }
  } catch (err) {
    console.error('Create Error:', err.response?.data);
  }
}
test();
