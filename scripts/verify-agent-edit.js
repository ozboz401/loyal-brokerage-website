import puppeteer from 'puppeteer';

const TMS_URL = 'http://localhost:5173/tms';
const LOGIN_URL = 'http://localhost:5173/tms-login';
const AGENTS_URL = 'http://localhost:5173/tms/agents';
const EMAIL = 'ozan@adafleet.com';
const PASSWORD = 'Temp123!';

async function runEditTest() {
    console.log("🚀 STARTING AGENT EDIT VERIFICATION");
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });
    const page = await browser.newPage();

    // Capture Network Requests
    const networkRequests = [];
    await page.setRequestInterception(true);
    page.on('request', request => {
        if (request.url().includes('update-agent')) {
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
            // Fallback
            const buttons = await page.$$('button');
            for (const btn of buttons) {
                if ((await page.evaluate(el => el.textContent, btn)).includes('Sign In')) {
                    await btn.click();
                    break;
                }
            }
        }

        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        // 2. Navigate to Agents
        console.log("👉 Navigating to Agents...");
        await page.goto(AGENTS_URL, { waitUntil: 'networkidle0' });

        await page.waitForSelector('button[title="Edit"]', { visible: true, timeout: 5000 });
        console.log("✅ Agents List Loaded");

        // 3. Click Edit on the first agent
        console.log("👉 Clicking Edit on first agent...");
        const editButtons = await page.$$('button[title="Edit"]');
        if (editButtons.length === 0) throw new Error("No agents found to edit");

        await editButtons[0].click();

        // 4. Wait for Modal
        await page.waitForSelector('input[name="fullName"]', { visible: true });
        // Verify Header says "Edit Agent"
        const header = await page.evaluate(() => document.querySelector('h2').textContent);
        if (!header.includes('Edit Agent')) throw new Error(`Modal Header Mismatch: ${header}`);
        console.log("✅ Edit Modal Opened");

        // 5. Change Name
        const currentName = await page.$eval('input[name="fullName"]', el => el.value);
        const newName = currentName.includes('EDITED') ? currentName.replace(' EDITED', '') : currentName + ' EDITED';

        console.log(`👉 Changing Name: '${currentName}' -> '${newName}'`);

        // Clear and Type
        await page.click('input[name="fullName"]', { clickCount: 3 });
        await page.type('input[name="fullName"]', newName);

        // 6. Submit
        console.log("👉 Submitting...");
        const responsePromise = page.waitForResponse(response =>
            response.url().includes('update-agent')
        );

        // Click "Update Agent" button
        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const update = btns.find(b => b.textContent.includes('Update Agent'));
            if (update) update.click();
            else throw new Error("Update button not found");
        });

        // 7. Verify Network
        const response = await responsePromise;
        const status = response.status();
        const json = await response.json();

        console.log(`📡 RESPONSE STATUS: ${status}`);
        console.log(`📡 RESPONSE BODY:`, json);

        if (status !== 200 || !json.success) {
            throw new Error(`API FAILED: ${status} - ${json.error}`);
        }
        console.log("✅ API Success");

        // 8. Verify UI Update
        console.log("👉 Verifying UI Update...");
        await new Promise(r => setTimeout(r, 2000)); // Wait for refresh

        const content = await page.content();
        if (content.includes(newName)) {
            console.log(`✅ UI VERIFIED: Found '${newName}' in list`);
        } else {
            console.error("❌ UI FAILURE: Name did not update in list");
            throw new Error("UI List mismatch");
        }

    } catch (e) {
        console.error("❌ TEST FAILED:", e.message);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

runEditTest();
