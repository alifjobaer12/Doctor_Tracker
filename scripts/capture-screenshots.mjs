import { spawn } from "child_process";
import path from "path";
import puppeteer from "puppeteer-core";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const SCREENSHOTS_DIR = path.resolve("docs/screenshots");

async function isUrlAlive(url) {
  try {
    const res = await fetch(url);
    return res.ok || res.status === 404 || res.status === 307;
  } catch {
    return false;
  }
}

async function findClientUrl(timeoutMs = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isUrlAlive("http://localhost:3000")) return "http://localhost:3000";
    if (await isUrlAlive("http://localhost:3001")) return "http://localhost:3001";
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("Timeout waiting for client on port 3000 or 3001");
}

async function waitHttp(url, timeoutMs = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isUrlAlive(url)) return true;
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Timeout waiting for ${url}`);
}

async function setDarkMode(page, enableDark = true) {
  await page.evaluate((dark) => {
    if (dark) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, enableDark);
  await new Promise((r) => setTimeout(r, 800));
}

async function run() {
  console.log("🚀 Starting backend and frontend dev servers...");

  let serverProcess = null;
  let clientProcess = null;

  if (!(await isUrlAlive("http://localhost:5000/health"))) {
    console.log("Starting server process...");
    serverProcess = spawn("npm.cmd", ["run", "dev", "--workspace=server"], {
      stdio: "inherit",
      shell: true,
    });
  }

  const clientRunning = (await isUrlAlive("http://localhost:3000")) || (await isUrlAlive("http://localhost:3001"));
  if (!clientRunning) {
    console.log("Starting client process...");
    clientProcess = spawn("npm.cmd", ["run", "dev", "--workspace=client"], {
      stdio: "inherit",
      shell: true,
    });
  }

  const cleanup = () => {
    console.log("🛑 Terminating background processes...");
    try {
      if (serverProcess?.pid) {
        spawn("taskkill", ["/pid", serverProcess.pid.toString(), "/T", "/F"], { stdio: "ignore" });
      }
      if (clientProcess?.pid) {
        spawn("taskkill", ["/pid", clientProcess.pid.toString(), "/T", "/F"], { stdio: "ignore" });
      }
    } catch {}
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  try {
    console.log("⏳ Waiting for server and client to become ready...");
    await waitHttp("http://localhost:5000/health");
    console.log("✓ Server ready on http://localhost:5000");

    const clientUrl = await findClientUrl();
    console.log(`✓ Client ready on ${clientUrl}`);

    console.log("🌐 Launching headless Chrome...");
    const browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const cdp = await page.target().createCDPSession();
    await cdp.send("Network.clearBrowserCookies");

    // 1. Desktop Login (Light)
    console.log("📸 Navigating to Desktop Login...");
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2, isMobile: false });
    await page.goto(`${clientUrl}/login`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForSelector("#email", { timeout: 45000 });
    await new Promise((r) => setTimeout(r, 1200));
    console.log("📸 Capturing Desktop Login (Light)...");
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "desktop-login.png") });

    // 2. Desktop Login (Dark)
    console.log("📸 Capturing Desktop Login (Dark)...");
    await setDarkMode(page, true);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "desktop-login-dark.png") });

    // 3. Mobile Login
    console.log("📸 Capturing Mobile Login (Dark)...");
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "mobile-login.png") });

    // Reset to desktop viewport for login action
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2, isMobile: false });
    await new Promise((r) => setTimeout(r, 500));

    // 4. Login through UI
    console.log("🔑 Logging in using Quick Fill Demo Admin...");
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const quickFill = btns.find((b) => b.textContent && b.textContent.includes("Quick Fill"));
      if (quickFill) {
        quickFill.click();
      }
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.click("button[type='submit']");
    await new Promise((r) => setTimeout(r, 2000));
    await page.goto(`${clientUrl}/dashboard`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 3000)); // wait for charts to render

    // 5. Desktop Dashboard (Dark)
    console.log("📸 Capturing Desktop Dashboard (Dark)...");
    await setDarkMode(page, true);
    await new Promise((r) => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "desktop-dashboard-dark.png") });

    // 6. Desktop Dashboard (Light)
    console.log("📸 Capturing Desktop Dashboard (Light)...");
    await setDarkMode(page, false);
    await new Promise((r) => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "desktop-dashboard.png") });

    // 7. Mobile Dashboard
    console.log("📸 Capturing Mobile Dashboard...");
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "mobile-dashboard.png") });

    // 8. Desktop Doctors (Light & Dark)
    console.log("📸 Capturing Desktop Doctors Directory (Light)...");
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2, isMobile: false });
    await page.goto(`${clientUrl}/doctors`, { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "desktop-doctors.png") });

    console.log("📸 Capturing Desktop Doctors Directory (Dark)...");
    await setDarkMode(page, true);
    await new Promise((r) => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "desktop-doctors-dark.png") });

    // 9. Mobile Doctors
    console.log("📸 Capturing Mobile Doctors Directory...");
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "mobile-doctors.png") });

    // 10. Desktop Doctor Detail (Light & Dark)
    console.log("📸 Capturing Desktop Doctor Detail...");
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2, isMobile: false });
    await page.goto(`${clientUrl}/doctors`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("table tbody tr td a", { timeout: 15000 });
    const doctorHref = await page.$eval("table tbody tr td a", (el) => el.getAttribute("href"));
    if (doctorHref) {
      await page.goto(`${clientUrl}${doctorHref}`, { waitUntil: "domcontentloaded" });
      await new Promise((r) => setTimeout(r, 2500));
      await setDarkMode(page, false);
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "desktop-doctor-detail.png") });

      console.log("📸 Capturing Desktop Doctor Detail (Dark)...");
      await setDarkMode(page, true);
      await new Promise((r) => setTimeout(r, 1200));
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "desktop-doctor-detail-dark.png") });

      // Mobile Doctor Detail
      console.log("📸 Capturing Mobile Doctor Detail...");
      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
      await new Promise((r) => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "mobile-doctor-detail.png") });
    }

    // 11. Desktop Patients Directory (Light & Dark)
    console.log("📸 Capturing Desktop Patients Directory (Light)...");
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2, isMobile: false });
    await page.goto(`${clientUrl}/patients`, { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 2000));
    await setDarkMode(page, false);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "desktop-patients.png") });

    console.log("📸 Capturing Desktop Patients Directory (Dark)...");
    await setDarkMode(page, true);
    await new Promise((r) => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "desktop-patients-dark.png") });

    // 12. Mobile Patients Directory
    console.log("📸 Capturing Mobile Patients Directory...");
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
    await new Promise((r) => setTimeout(r, 800));
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
