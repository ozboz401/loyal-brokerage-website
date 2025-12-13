const token = process.env.SUPABASE_ACCESS_TOKEN;
const ref = 'cfcrttsxeaugwfuoirod';
const sql = "ALTER USER postgres WITH PASSWORD 'TempDeployPass_2025!';";

console.log("Resetting password...");
fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
}).then(async r => {
    console.log('Status:', r.status);
    const text = await r.text();
    console.log('Response:', text);
    if (!r.ok) process.exit(1);
});
