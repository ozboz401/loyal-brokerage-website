
import { agentHandler } from "../supabase/functions/create-agent-user/index.ts";

// MOCK ENVIRONMENT
Deno.env.set('SUPABASE_URL', 'https://mock.supabase.co');
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'mock-key');
Deno.env.set('MAILGUN_DOMAIN', 'mock.mailgun.org');
Deno.env.set('MAILGUN_API_KEY', 'mock-mg-key');

// MOCK FETCH
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
    const url = input.toString();

    // 1. Mock Auth Create User
    if (url.includes('/auth/v1/admin/users')) {
        console.log(`[MOCK FETCH] POST Auth Create User`);
        return new Response(JSON.stringify({
            user: { id: "mock-auth-id-123", email: "test@example.com" }
        }), { status: 200 });
    }

    // 2. Mock Agent Insert
    if (url.includes('/rest/v1/agents')) {
        console.log(`[MOCK FETCH] POST DB Insert Agents`);
        return new Response(JSON.stringify({
            id: "mock-agent-id-999",
            email: "test@example.com",
            full_name: "Test Agent"
        }), { status: 201 }); // Or 200 depending on select
    }

    // 3. Mock Delete User (Rollback)
    if (url.includes('admin/users/') && init?.method === 'DELETE') {
        console.log(`[MOCK FETCH] DELETE Auth User`);
        return new Response(JSON.stringify({}), { status: 200 });
    }

    // 4. Mock Mailgun
    if (url.includes('api.mailgun.net')) {
        console.log(`[MOCK FETCH] POST Mailgun`);
        return new Response("Queued. Thank you.", { status: 200 });
    }

    return originalFetch(input, init);
};

// RUN TEST
console.log("=== STARTING AUTONOMOUS TEST (MOCKED) ===");

const reqBody = {
    email: "test@example.com",
    password: "password123",
    fullName: "Test Agent",
    companyName: "Test Corp",
    commission: 50
};

const req = new Request("http://localhost/functions/v1/create-agent-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqBody)
});

console.log("Invoking Handler...");
const res = await agentHandler(req);
const data = await res.json();

console.log("RESPONSE:", JSON.stringify(data, null, 2));

if (data.success && data.agent_id === "mock-agent-id-999") {
    console.log("✅ TEST PASSED: Full flow success.");
} else {
    console.error("❌ TEST FAILED: Response invalid.");
    Deno.exit(1);
}

// TEST ROLLBACK SCENARIO?
// Optional: Mock DB failure and see if deleteUser is called.
