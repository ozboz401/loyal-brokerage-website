const token = process.env.SUPABASE_ACCESS_TOKEN;
const ref = 'cfcrttsxeaugwfuoirod';
const sql = "SELECT version();";

const endpoints = [
    `https://api.supabase.com/v1/projects/${ref}/query`,
    `https://api.supabase.com/v1/projects/${ref}/database/query`, // This is likely it?
    `https://api.supabase.com/v1/projects/${ref}/sql`,
    `https://api.supabase.com/v1/projects/${ref}/run-sql`,
    `https://api.supabase.io/v1/projects/${ref}/query`
];

async function check() {
    for (const ep of endpoints) {
        console.log(`Checking ${ep}...`);
        try {
            const r = await fetch(ep, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: sql })
            });
            console.log(`Status: ${r.status}`);
            const txt = await r.text();
            console.log(`Body: ${txt.substring(0, 150)}`);
            if (r.ok) {
                console.log("FOUND WORKING ENDPOINT:", ep);
            }
        } catch (e) { console.log(e.message); }
    }
}
check();
