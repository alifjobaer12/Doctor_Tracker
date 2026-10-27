import { spawn } from "child_process";
import path from "path";
import puppeteer from "puppeteer-core";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SCREENSHOTS_DIR = path.resolve("docs/screenshots");

async function waitHttp(url, timeoutMs = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Timeout waiting for ${url}`);
}

async function run() {
  console.log("🚀 Starting backend and frontend servers...");

  // 1. Start Server
  const serverProcess = spawn("npm.cmd", ["run", "dev", "--workspace=server"], {
    stdio: "inherit",
    shell: true,
  });

  // 2. Start Client
  const clientProcess = spawn("npm.cmd", ["run", "dev", "--workspace=client"], {
    stdio: "inherit",
    shell: true,
  });

  const cleanup = () => {
    console.log("🛑 Terminating background processes...");
    try {
      serverProcess.kill();
      clientProcess.kill();
    } catch {}
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  try {
    console.log("⏳ Waiting for server and client to become ready...");
    await waitHttp("http://localhost:5000/health");
    console.log("✓ Server ready on http://localhost:5000");

    await waitHttp("http://localhost:3000");
    console.log("✓ Client ready on http://localhost:3000");

    console.log("🌐 Launching headless Chrome...");
    const browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // 1. Desktop Login
    console.log("📸 Capturing Desktop Login...");
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
    await page.goto("http://localhost:3000/login", { waitUntil: "networkidle0" });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "desktop-login.png") });

    // 2. Mobile Login
    console.log("📸 Capturing Mobile Login...");
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "mobile-login.png") });

    // 3. Login through UI
    console.log("🔑 Logging in as demo admin...");
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
    await page.type("#email", "admin@doctortracker.com");
    await page.type("#password", "Admin@12345");
    await new Promise((r) => setTimeout(r, 300));
    await page.click("button[type='submit']");
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 2000)); // wait for charts to render

    // 4. Desktop Dashboard
    console.log("📸 Capturing Desktop Dashboard...");
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "desktop-dashboard.png") });

    // 5. Mobile Dashboard
    console.log("📸 Capturing Mobile Dashboard...");
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "mobile-dashboard.png") });

    // 6. Desktop Doctors
    console.log("📸 Capturing Desktop Doctors Directory...");
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2, isMobile: false });
    await page.goto("http://localhost:3000/doctors", { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "desktop-doctors.png") });

    // 7. Mobile Doctors
    console.log("📸 Capturing Mobile Doctors Directory...");
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "mobile-doctors.png") });

    // 8. Desktop Doctor Detail
    console.log("📸 Capturing Desktop Doctor Detail...");
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2, isMobile: false });
    await page.waitForSelector("table tbody tr td a", { timeout: 10000 });
    const doctorLink = await page.$("table tbody tr td a");
    if (doctorLink) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle0" }),
        doctorLink.click(),
      ]);
      await new Promise((r) => setTimeout(r, 2000));
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "desktop-doctor-detail.png") });

      // Mobile Doctor Detail
      console.log("📸 Capturing Mobile Doctor Detail...");
      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
      await new Promise((r) => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "mobile-doctor-detail.png") });
    }

    // 9. Desktop Patients Directory
    console.log("📸 Capturing Desktop Patients Directory...");
    await page.goto("http://localhost:3000/patients", { waitUntil: "networkidle0" });
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "desktop-patients.png") });

    // 10. Mobile Patients Directory
    console.log("📸 Capturing Mobile Patients Directory...");
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "mobile-patients.png") });

    console.log("🎉 All screenshots captured successfully in docs/screenshots/!");

    await browser.close();
  } catch (err) {
    console.error("❌ Error during screenshot capture:", err);
  } finally {
    cleanup();
    process.exit(0);
  }
}

run();
