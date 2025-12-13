// using global fetch
const token = process.env.SUPABASE_ACCESS_TOKEN;
const ref = 'cfcrttsxeaugwfuoirod';

const sql = `
SELECT * FROM pg_policies WHERE tablename = 'contact_messages';
`;

console.log("Inspecting Policies...");
fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
}).then(async r => {
    console.log('Status:', r.status);
    const text = await r.json();
    console.log('Policies:', JSON.stringify(text, null, 2));
});
