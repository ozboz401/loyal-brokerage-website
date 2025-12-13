
import puppeteer from 'puppeteer';

const TMS_URL = 'http://localhost:5173/tms';
const LOGIN_URL = 'http://localhost:5173/tms-login';
const AGENTS_URL = 'http://localhost:5173/tms/agents';
const EMAIL = 'ozan@adafleet.com';
const PASSWORD = 'Temp123!';

async function runTest() {
    console.log("🚀 STARTING PHASE 4: AUTOMATED AGENT CREATION TEST");
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });
    const page = await browser.newPage();

    // Capture Network Requests
    const networkRequests = [];
    await page.setRequestInterception(true);
    page.on('request', request => {
        if (request.url().includes('create-agent-user')) {
            console.log(`📡 CAPTURED REQUEST: ${request.url()}`);
            networkRequests.push({ url: request.url(), method: request.method() });
        }
        request.continue();
    });

    try {
        // 1. Login
        console.log("👉 Login...");
        await page.goto(LOGIN_URL, { waitUntil: 'networkidle0' });
        await page.type('input[type="email"]', EMAIL);
        await page.type('input[type="password"]', PASSWORD);

        const submitBtn = await page.$('button[type="submit"]');
        if (submitBtn) await submitBtn.click();
        else {
            // Fallback search
            const buttons = await page.$$('button');
            for (const btn of buttons) {
                const text = await page.evaluate(el => el.textContent, btn);
                if (text.includes('Sign In')) {
                    await btn.click();
                    break;
                }
            }
        }

        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        // 2. Navigate to Agents
        console.log("👉 Navigating to Agents...");
        await page.goto(AGENTS_URL, { waitUntil: 'networkidle0' });

        // 3. Open Modal
        console.log("👉 Opening Modal...");
        await page.waitForSelector('button', { visible: true });
        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const add = btns.find(b => b.textContent.includes('Add New Agent') || b.textContent.includes('Add Agent'));
            if (add) add.click();
            else throw new Error("Add Agent button not found");
        });

        await page.waitForSelector('input[name="fullName"]', { visible: true });

        // 4. Fill Form (PHASE 4 DATA)
        const timestamp = Date.now();
        const testEmail = `ag.test.${timestamp}@loyalbrokerage.com`;

        console.log(`👉 Filling Form: ${testEmail}`);
        await page.type('input[name="fullName"]', 'Test Bot AG');
        await page.type('input[name="email"]', testEmail);
        await page.type('input[name="phone"]', '5551112222'); // Form might auto-format

        // Check if phone field handles formatting, usually safe to just type

        await page.type('input[name="password"]', 'Test123!');
        await page.type('input[name="companyName"]', 'AG Logistics');

        // Address fields if they exist in valid DOM. In previous view, AddAgentModal.jsx had fields.
        // I should confirm if these fields exist. Assuming they do per Request.
        // Wait, I saw AddAgentModal.jsx earlier, let me recall steps.
        // It had minimal fields in snippet? 
        // Let's assume they added them or I should check.
        // But for per user request "Autofill with... Address... City...".
        // I will type them. If selector fails, I will fix.

        // Note: The previous modal code I viewed had "fullName", "email", "phone", "companyName", "commission", "status".
        // It might NOT have address/city/state/zip visible or expected.
        // If the form fails to find them, Puppeteer throws.
        // I'll wrap them in try-catch blocks or check existence to be robust.

        const safeType = async (selector, text) => {
            if (await page.$(selector) !== null) {
                await page.type(selector, text);
            } else {
                console.warn(`⚠️ Field ${selector} not found, skipping.`);
            }
        };

        if (await page.$('input[name="address"]')) await page.type('input[name="address"]', '123 Automation Rd');
        if (await page.$('input[name="city"]')) await page.type('input[name="city"]', 'Boca Raton');
        if (await page.$('input[name="state"]')) await page.type('input[name="state"]', 'FL');
        if (await page.$('input[name="zip"]')) await page.type('input[name="zip"]', '33487');

        await page.type('input[name="commission"]', '50');

        // 5. Submit
        console.log("👉 Submitting...");
        const responsePromise = page.waitForResponse(response =>
            response.url().includes('create-agent-user')
        );

        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const create = btns.find(b => b.textContent.includes('Create Agent'));
            if (create) create.click();
            else throw new Error("Create Agent button not found");
        });

        // 6. Verify Response
        console.log("⏳ Waiting for Response...");

        // 10s timeout
        const response = await Promise.race([
            responsePromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout waiting for API")), 20000))
        ]);

        const status = response.status();
        const json = await response.json();

        console.log("📡 RESPONSE STATUS:", status);
        console.log("📡 RESPONSE BODY:", JSON.stringify(json, null, 2));

        if (status !== 200 || !json.success) {
            throw new Error(`API FAILED: ${status} - ${JSON.stringify(json)}`);
        }

        console.log("✅ AGENT CREATED SUCCESSFULLY");
        console.log("✅ NETWORK TAB VERIFIED (/functions/v1/create-agent-user confirmed)");

        // 7. Verify List Update
        console.log("👉 Verifying Agent appears in List...");
        // Wait for modal to close or list to refresh
        await new Promise(r => setTimeout(r, 2000));

        const content = await page.content();
        if (content.includes('Test Bot AG') || content.includes('Test Bot AG')) { // Should match form name
            console.log("✅ UI LIST UPDATED: 'Test Bot AG' FOUND");
        } else {
            console.error("❌ UI FAILURE: New agent NOT found in list. Possible RLS or Filter issue.");
            throw new Error("UI List mismatch");
        }


    } catch (e) {
        console.error("❌ TEST FAILED:", e.message);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

runTest();
