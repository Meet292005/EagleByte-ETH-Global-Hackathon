const { chromium } = require('C:/ethglobal/Eagle-Byte-main/Eagle-Byte-main/Client/node_modules/@playwright/test');
const fs = require('fs');
const path = require('path');

async function recordFullDemo() {
  const outputDir = path.resolve(__dirname, 'recordings');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Clear previous test recordings
  fs.readdirSync(outputDir).forEach((file) => {
    try {
      fs.unlinkSync(path.join(outputDir, file));
    } catch (e) {}
  });

  console.log('🎬 Initializing 4K Ultra-HD Demo Recorder (3840x2160, ~2-Minute Target)...');

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  // 4K Ultra HD Viewport and Recording Size
  const context = await browser.newContext({
    viewport: { width: 3840, height: 2160 },
    recordVideo: {
      dir: outputDir,
      size: { width: 3840, height: 2160 },
    },
  });

  const page = await context.newPage();

  // Helper: Smooth Animated Scrolling
  async function smoothScroll(distance, steps = 20, delay = 50) {
    for (let i = 0; i < steps; i++) {
      await page.mouse.wheel(0, distance / steps);
      await page.waitForTimeout(delay);
    }
  }

  // Helper: On-Screen Presenter HUD Caption
  async function setPresenterCaption(title, subtitle = '') {
    await page.evaluate(({ title, subtitle }) => {
      let badge = document.getElementById('ethglobal-presenter-badge');
      if (!badge) {
        badge = document.createElement('div');
        badge.id = 'ethglobal-presenter-badge';
        badge.style.position = 'fixed';
        badge.style.top = '40px';
        badge.style.right = '50px';
        badge.style.zIndex = '999999';
        badge.style.padding = '18px 32px';
        badge.style.borderRadius = '24px';
        badge.style.background = 'rgba(10, 15, 28, 0.92)';
        badge.style.backdropFilter = 'blur(20px)';
        badge.style.border = '2px solid rgba(139, 92, 246, 0.5)';
        badge.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(139, 92, 246, 0.35)';
        badge.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        badge.style.pointerEvents = 'none';
        badge.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        document.body.appendChild(badge);
      }
      badge.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
          <span style="display:inline-block; width:14px; height:14px; border-radius:50%; background:#10b981; box-shadow:0 0 16px #10b981;"></span>
          ${title}
        </div>
        ${subtitle ? `<div style="font-size: 18px; color: #a78bfa; margin-top: 6px; font-weight: 500;">${subtitle}</div>` : ''}
      `;
    }, { title, subtitle });
  }

  // Helper: Apply optimal 4K Scaling
  async function apply4KScaling() {
    await page.evaluate(() => {
      document.body.style.zoom = '1.7';
    });
  }

  // =========================================================================
  // SCENE 1: HOMEPAGE & BRAND ARCHITECTURE (~22 seconds)
  // =========================================================================
  console.log('📌 Scene 1: Homepage & Futuristic Brand Ecosystem...');
  await page.goto('http://localhost:8080/', { waitUntil: 'domcontentloaded' });
  await apply4KScaling();
  await setPresenterCaption('EagleByte Protocol', 'Next-Gen Web3 Development & Agentic AI Systems');
  await page.waitForTimeout(3500);

  // Smooth scroll down to services
  await smoothScroll(800, 25, 60);
  await page.waitForTimeout(3000);

  await setPresenterCaption('Full-Stack Web3 & AI', 'Decentralized Architecture, Smart Contracts & Autonomous Agents');
  await smoothScroll(1000, 30, 60);
  await page.waitForTimeout(3500);

  // Smooth scroll back to top
  await smoothScroll(-1800, 25, 40);
  await page.waitForTimeout(2000);

  // =========================================================================
  // SCENE 2: WEB3 ESCROW PROTOCOL & WORLD ID ZK-PROOF (~26 seconds)
  // =========================================================================
  console.log('📌 Scene 2: Web3 Escrow Protocol & World ID Sybil Defense...');
  await page.goto('http://localhost:8080/escrow', { waitUntil: 'domcontentloaded' });
  await apply4KScaling();
  await setPresenterCaption('Smart Contract Milestone Escrow', 'Non-Custodial Trust Layer for International Development');
  await page.waitForTimeout(3500);

  // View existing agreements
  await smoothScroll(450, 15, 60);
  await page.waitForTimeout(3000);

  // Switch to "Create New Escrow" tab
  const createTab = page.locator('button:has-text("Create New Escrow")');
  if (await createTab.count()) {
    await createTab.click();
    await page.waitForTimeout(2500);
  }

  // Trigger World ID Verification
  await setPresenterCaption('World ID ZK-Proof Verification', 'Cryptographic Proof of Humanity (Sybil Resistance)');
  const worldIdBtn = page.locator('button:has-text("Verify with World ID")');
  if (await worldIdBtn.count()) {
    await worldIdBtn.click();
    console.log('⚡ Triggered World ID ZK-Proof Verification...');
    await page.waitForTimeout(4500); // Allow glow and verified badge to settle
  }

  // Deploy Escrow Agreement
  await setPresenterCaption('Deploying Milestone Escrow', 'Locking Capital in Ethereum Sepolia Smart Contract');
  const deployEscrowBtn = page.locator('button:has-text("Deploy Milestone Escrow")');
  if (await deployEscrowBtn.count()) {
    await deployEscrowBtn.click();
    console.log('⚡ Deployed Milestone Escrow into smart contract...');
    await page.waitForTimeout(4000);
  }

  // =========================================================================
  // SCENE 3: 0G LABS DECENTRALIZED STORAGE DA & RELEASE (~24 seconds)
  // =========================================================================
  console.log('📌 Scene 3: 0G Labs Storage DA & Deliverable Settlement...');
  await setPresenterCaption('0G Labs Decentralized Storage', 'Immutable Deliverable Proofs with Zero-Knowledge Verification');
  await smoothScroll(500, 18, 60);
  await page.waitForTimeout(3000);

  // Click Upload Deliverable to 0G Labs
  const uploadDeliverableBtn = page.locator('button:has-text("Upload Deliverable")').first();
  if (await uploadDeliverableBtn.count()) {
    await uploadDeliverableBtn.click();
    console.log('⚡ Uploading deliverable payload to 0G Labs DA layer...');
    await page.waitForTimeout(4500); // Allow Merkle Root CID to generate
  }

  // Click Approve Milestone & Release Funds
  await setPresenterCaption('Milestone Payout Release', 'Automated Non-Custodial Transfer to Developer Wallet');
  const approveFundsBtn = page.locator('button:has-text("Approve & Release Funds")').first();
  if (await approveFundsBtn.count()) {
    await approveFundsBtn.click();
    console.log('⚡ Funds released from smart contract escrow...');
    await page.waitForTimeout(4500);
  }

  // =========================================================================
  // SCENE 4: MULTI-CHAIN WEB3 PAY PORTAL (~24 seconds)
  // =========================================================================
  console.log('📌 Scene 4: Web3 Multi-Chain International Invoicing...');
  await page.goto('http://localhost:8080/pay', { waitUntil: 'domcontentloaded' });
  await apply4KScaling();
  await setPresenterCaption('Borderless Web3 Invoicing', 'Instant Settlement with Sub-Cent Gas vs 5% SWIFT Fees');
  await page.waitForTimeout(3500);

  await smoothScroll(300, 12, 60);
  await page.waitForTimeout(2500);

  // Select Tokens
  try {
    const usdtBtn = page.getByRole('button', { name: /USDT/i }).first();
    if (await usdtBtn.count()) {
      await usdtBtn.click();
      await page.waitForTimeout(2500);
    }

    await setPresenterCaption('Multi-Chain Token Selection', 'Native ETH, USDC, USDT & POL with Real-Time Conversion');
    const ethBtn = page.getByRole('button', { name: /ETH Ethereum/i }).first();
    if (await ethBtn.count()) {
      await ethBtn.click();
      await page.waitForTimeout(3000);
    }
  } catch (e) {
    console.log('Token select note:', e.message);
  }

  // Copy receiver address
  const copyBtn = page.locator('button:has-text("Direct Deposit"), button[title="Copy address"]').first();
  if (await copyBtn.count()) {
    await copyBtn.click();
    await page.waitForTimeout(2500);
  }

  // =========================================================================
  // SCENE 5: EXECUTIVE ADMIN PROTOCOL DASHBOARD (~34 seconds)
  // =========================================================================
  console.log('📌 Scene 5: Executive Admin Protocol Control Center...');
  await page.goto('http://localhost:8080/admin', { waitUntil: 'domcontentloaded' });
  await apply4KScaling();
  await setPresenterCaption('Executive Admin Portal', 'Restricted Authentication Gate (admin@gmail.com)');
  await page.waitForTimeout(3500);

  // Click 1-Click Demo Sign In button
  const demoSignInBtn = page.locator('button:has-text("1-Click Demo Sign In")');
  if (await demoSignInBtn.count()) {
    await demoSignInBtn.click();
    console.log('⚡ Admin authenticated with demo credentials...');
    await page.waitForTimeout(3500);
  }

  // Now in Dashboard: View KPI Cards & Live Web3 Transactions
  await setPresenterCaption('Real-Time Web3 Transactions', 'Multi-Chain Payments, Explorer Hashes & Sepolia Inflow');
  await page.waitForTimeout(3500);
  await smoothScroll(400, 15, 60);
  await page.waitForTimeout(3000);

  // Tab 2: Escrow Works & Deliverables
  const worksTab = page.locator('button:has-text("Escrow Works & Deliverables")');
  if (await worksTab.count()) {
    await worksTab.click();
    await setPresenterCaption('Milestone Governance & 0G CIDs', 'Decentralized Deliverable Proofs & Release Authority');
    await page.waitForTimeout(4000);
    await smoothScroll(300, 12, 60);
    await page.waitForTimeout(3000);
  }

  // Tab 3: Client Inquiries (MongoDB Atlas Sync)
  const inquiriesTab = page.locator('button:has-text("Client Inquiries")');
  if (await inquiriesTab.count()) {
    await inquiriesTab.click();
    await setPresenterCaption('MongoDB Atlas Inquiries', 'Real-Time Lead Tracking & Consultation Queue');
    await page.waitForTimeout(3500);
  }

  // Tab 4: Protocol Infra & System Diagnostics
  const systemTab = page.locator('button:has-text("Protocol Infra")');
  if (await systemTab.count()) {
    await systemTab.click();
    await setPresenterCaption('Protocol Infrastructure Status', 'Connected to Sepolia, 0G Storage DA & MongoDB Cluster0');
    await page.waitForTimeout(3500);
  }

  // Export Audit Report
  const exportBtn = page.locator('button:has-text("Export Audit")');
  if (await exportBtn.count()) {
    await exportBtn.click();
    console.log('⚡ Exported protocol audit JSON snapshot...');
    await page.waitForTimeout(2500);
  }

  // =========================================================================
  // SCENE 6: CONTACT & CONCLUSION (~12 seconds)
  // =========================================================================
  console.log('📌 Scene 6: Contact & Global Consultation...');
  await page.goto('http://localhost:8080/contact', { waitUntil: 'domcontentloaded' });
  await apply4KScaling();
  await setPresenterCaption('EagleByte | Founded by Kartik Parmar', 'Ready for ETHGlobal Hackathon Submission');
  await page.waitForTimeout(3500);
  await smoothScroll(600, 20, 60);
  await page.waitForTimeout(3500);

  console.log('💾 Finalizing video stream and encoding output...');
  await page.waitForTimeout(2000);
  await page.close();
  await context.close();
  await browser.close();

  // Find the generated video file
  const files = fs.readdirSync(outputDir).filter((f) => f.endsWith('.webm'));
  if (files.length > 0) {
    const rawVideo = path.join(outputDir, files[0]);
    const finalVideo = path.resolve(__dirname, 'EagleEscrow_ETHGlobal_Demonstration.webm');
    fs.copyFileSync(rawVideo, finalVideo);
    const stats = fs.statSync(finalVideo);
    console.log(`\n🎉 SUCCESS! Generated 4K demonstration video:`);
    console.log(`📁 File path: ${finalVideo}`);
    console.log(`📊 File size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`⏱️ Duration: ~2 Minutes (Full Multi-Chain & Admin Protocol Walkthrough)`);
  } else {
    console.error('No video file produced.');
  }
}

recordFullDemo().catch((err) => {
  console.error('Recording error:', err);
  process.exit(1);
});
