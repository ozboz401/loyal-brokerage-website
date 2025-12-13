const token = process.env.SUPABASE_ACCESS_TOKEN;
const ref = 'cfcrttsxeaugwfuoirod';
const sql = "ALTER USER postgres WITH PASSWORD 'TempDeployPass_2025!';";

fetch(`https://api.supabase.com/v1/projects/${ref}/query`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
}).then(async r => {
    console.log('Status:', r.status);
    console.log('Response:', await r.text());
});
