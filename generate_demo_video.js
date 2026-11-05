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

  console.log('🎬 Initializing High-Definition Video Recorder (Edge/Chromium engine)...');

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await context.newPage();

  // Helper smooth scroll
  async function smoothScroll(distance, steps = 15, delay = 60) {
    for (let i = 0; i < steps; i++) {
      await page.mouse.wheel(0, distance / steps);
      await page.waitForTimeout(delay);
    }
  }

  console.log('📌 Scene 1: Homepage & Brand Architecture...');
  await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await smoothScroll(600, 20, 80);
  await page.waitForTimeout(1500);
  await smoothScroll(800, 25, 80);
  await page.waitForTimeout(2000);
  await smoothScroll(-1400, 20, 50);
  await page.waitForTimeout(1000);

  console.log('📌 Scene 2: Web3 Escrow Dashboard & World ID Verification...');
  await page.goto('http://localhost:8080/escrow', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  // Switch to "Create Escrow" tab
  const createTab = page.locator('button:has-text("Create New Escrow")');
  if (await createTab.count()) {
    await createTab.click();
    await page.waitForTimeout(1500);
  }

  // Click World ID Verify
  const worldIdBtn = page.locator('button:has-text("Verify with World ID")');
  if (await worldIdBtn.count()) {
    await worldIdBtn.click();
    console.log('⚡ Triggered World ID ZK-Proof Verification...');
    await page.waitForTimeout(3000); // Wait for verification badge
  }

  // Click Create Escrow
  const submitEscrowBtn = page.locator('button:has-text("Deploy Milestone Escrow")');
  if (await submitEscrowBtn.count()) {
    await submitEscrowBtn.click();
    console.log('⚡ Deployed Milestone Escrow into smart contract...');
    await page.waitForTimeout(3000);
  }

  console.log('📌 Scene 3: 0G Labs Decentralized Storage & Deliverables...');
  // Inspect active escrows
  await smoothScroll(400, 15, 60);
  await page.waitForTimeout(2000);

  // Click Upload Deliverable if present
  const uploadBtn = page.locator('button:has-text("Upload Deliverable")').first();
  if (await uploadBtn.count()) {
    await uploadBtn.click();
    console.log('⚡ Uploading deliverable to 0G Labs Storage...');
    await page.waitForTimeout(3500); // wait for 0G root hash generation
  }

  // Click Approve Milestone
  const approveBtn = page.locator('button:has-text("Approve & Release Funds")').first();
  if (await approveBtn.count()) {
    await approveBtn.click();
    console.log('⚡ Approving milestone and releasing funds...');
    await page.waitForTimeout(3000);
  }

  console.log('📌 Scene 4: Web3 Direct Pay & Multi-Chain Rails...');
  await page.goto('http://localhost:8080/pay', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await smoothScroll(300, 10, 60);
  await page.waitForTimeout(2000);

  // Select tokens safely
  try {
    const usdtBtn = page.getByRole('button', { name: /USDT/i }).first();
    if (await usdtBtn.count()) {
      await usdtBtn.click();
      await page.waitForTimeout(1500);
    }
    const ethBtn = page.getByRole('button', { name: /ETH Ethereum/i }).first();
    if (await ethBtn.count()) {
      await ethBtn.click();
      await page.waitForTimeout(1500);
    }
  } catch (e) {
    console.log('Token select skipped:', e.message);
  }

  console.log('📌 Scene 5: 4K Presentation Stage & Sponsor Highlights...');
  await page.goto('http://localhost:8080/demo-video', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Click Play on the presentation
  const playBtn = page.locator('button:has-text("1. The")').first();
  if (await playBtn.count()) {
    await playBtn.click();
    await page.waitForTimeout(4000);
  }

  // Slide 2: World ID
  const slide2 = page.locator('button:has-text("2. Sybil-Proof")').first();
  if (await slide2.count()) {
    await slide2.click();
    await page.waitForTimeout(4000);
  }

  // Slide 3: 0G Labs
  const slide3 = page.locator('button:has-text("3. Verifiable")').first();
  if (await slide3.count()) {
    await slide3.click();
    await page.waitForTimeout(4000);
  }

  // Slide 4: Multi-Chain
  const slide4 = page.locator('button:has-text("4. Instant")').first();
  if (await slide4.count()) {
    await slide4.click();
    await page.waitForTimeout(4000);
  }

  // Slide 5: ETHGlobal Summary
  const slide5 = page.locator('button:has-text("5. Decentralized")').first();
  if (await slide5.count()) {
    await slide5.click();
    await page.waitForTimeout(4500);
  }

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
    console.log(`\n🎉 SUCCESS! Generated full demonstration video:`);
    console.log(`📁 File path: ${finalVideo}`);
    console.log(`📊 File size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
  } else {
    console.error('No video file produced.');
  }
}

recordFullDemo().catch((err) => {
  console.error('Recording error:', err);
  process.exit(1);
});
