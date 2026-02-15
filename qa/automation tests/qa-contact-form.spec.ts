import { test, expect } from '@playwright/test';

test.describe('Contact Form Submission', () => {
  test('should successfully fill out and submit the contact form', async ({ page }) => {
    // Navigate to the contact page
    await page.goto('https://www.soundbeyondborders.com/contact');
    
    // Wait for the form to be visible
    await page.waitForSelector('#contact-form', { state: 'visible' });
    
    // Scope all interactions to the main contact form (not the quick-book modal)
    const contactForm = page.locator('#contact-form');
    
    // Fill out required fields
    await contactForm.locator('input[name="name"]').fill('Test User');
    await contactForm.locator('input[name="email"]').fill('test@example.com');
    
    // Fill optional phone field (will be auto-formatted)
    await contactForm.locator('#phone-input').fill('8045551234');
    
    // Fill optional event date
    await contactForm.locator('input[name="date"]').fill('2026-05-15');
    
    // Fill required location field
    await contactForm.locator('input[name="location"]').fill('Washington, DC');
    
    // Handle Instrument multi-select dropdown (these are unique IDs only on the main form)
    // Click to open the instrument dropdown
    await page.locator('#instrument-dropdown-btn').click();
    
    // Wait for dropdown to be visible
    await page.locator('#instrument-dropdown').waitFor({ state: 'visible' });
    
    // Select multiple instruments by checking checkboxes within the dropdown
    await page.locator('#instrument-dropdown input.instrument-checkbox[value="Cümbüş Oud"]').check();
    await page.locator('#instrument-dropdown input.instrument-checkbox[value="Setar"]').check();
    
    // Close dropdown by clicking the main heading
    await page.locator('h1').click();
    await page.locator('#instrument-dropdown').waitFor({ state: 'hidden' });
    
    // Verify pills are displayed
    await expect(page.locator('#instrument-pills .pill:has-text("Cümbüş Oud")')).toBeVisible();
    await expect(page.locator('#instrument-pills .pill:has-text("Setar")')).toBeVisible();
    
    // Handle Genre multi-select dropdown (these are unique IDs only on the main form)
    // Click to open the genre dropdown
    await page.locator('#genre-dropdown-btn').click();
    
    // Wait for dropdown to be visible
    await page.locator('#genre-dropdown').waitFor({ state: 'visible' });
    
    // Select multiple genres within the dropdown
    await page.locator('#genre-dropdown input.genre-checkbox[value="Pop"]').check();
    await page.locator('#genre-dropdown input.genre-checkbox[value="Rock"]').check();
    
    // Close dropdown
    await page.locator('h1').click();
    await page.locator('#genre-dropdown').waitFor({ state: 'hidden' });
    
    // Verify genre pills are displayed
    await expect(page.locator('#genre-pills .pill:has-text("Pop")')).toBeVisible();
    await expect(page.locator('#genre-pills .pill:has-text("Rock")')).toBeVisible();
    
    // Fill required message field
    await contactForm.locator('textarea[name="message"]').fill(
      'This is a test message for booking inquiry. Looking forward to discussing the event details.');
    
    // Verify the honeypot field remains empty (anti-spam measure)
    await expect(contactForm.locator('input[name="honeypot"]')).toHaveValue('');
    
    // Click the submit button (unique to main form)
    await page.locator('#contact-form #submit-btn').click();
    
    // Wait for navigation to the success page
    await page.waitForURL('**/thanks', { 
      timeout: 10000 
    });
    
    // Verify we're on the thanks page
    expect(page.url()).toContain('/thanks');
  });

  test('should handle "Other" genre selection and show custom genre field', async ({ page }) => {
    await page.goto('https://www.soundbeyondborders.com/contact');
    await page.waitForSelector('#contact-form', { state: 'visible' });
    
    // Open genre dropdown
    await page.click('#genre-dropdown-btn');
    await page.waitForSelector('#genre-dropdown', { state: 'visible' });
    
    // Select "Other" genre
    await page.check('input.genre-checkbox[value="Other"]');
    
    // Close dropdown
    await page.click('body');
    
    // Verify the custom genre textarea becomes visible
    await expect(page.locator('#genre-other-wrap')).toBeVisible();
    
    // Fill in custom genre description
    await page.fill('textarea[name="genre_other"]', 
      'mystical, atmospheric, Sufi-inspired, cinematic');
    
    // Verify the text was entered
    await expect(page.locator('textarea[name="genre_other"]')).toHaveValue(
      'mystical, atmospheric, Sufi-inspired, cinematic'
    );
  });

  test('should allow removing selections via pill X buttons', async ({ page }) => {
    await page.goto('https://www.soundbeyondborders.com/contact');
    await page.waitForSelector('#contact-form', { state: 'visible' });
    
    // Select an instrument
    await page.click('#instrument-dropdown-btn');
    await page.check('input.instrument-checkbox[value="Duduk"]');
    await page.click('body');
    
    // Verify pill is visible
    await expect(page.locator('#instrument-pills .pill:has-text("Duduk")')).toBeVisible();
    
    // Click the X button on the pill to remove it
    await page.click('#instrument-pills .pill:has-text("Duduk") button');
    
    // Verify pill is removed
    await expect(page.locator('#instrument-pills .pill:has-text("Duduk")')).not.toBeVisible();
    
    // Verify checkbox is unchecked when dropdown is opened again
    await page.click('#instrument-dropdown-btn');
    await expect(page.locator('input.instrument-checkbox[value="Duduk"]')).not.toBeChecked();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('https://www.soundbeyondborders.com/contact');
    await page.waitForSelector('#contact-form', { state: 'visible' });
    
    // Scope to the main contact form
    const contactForm = page.locator('#contact-form');
    
    // Try to submit without filling required fields
    await contactForm.locator('#submit-btn').click();
    
    // The browser's native validation should prevent submission
    // Check that we're still on the contact page
    await page.waitForTimeout(1000); // Brief wait
    expect(page.url()).toContain('/contact');
    
    // Verify required field indicators (scoped to contact form only)
    await expect(contactForm.locator('input[name="name"]')).toHaveAttribute('required', '');
    await expect(contactForm.locator('input[name="email"]')).toHaveAttribute('required', '');
    await expect(contactForm.locator('input[name="location"]')).toHaveAttribute('required', '');
    await expect(contactForm.locator('textarea[name="message"]')).toHaveAttribute('required', '');
  });

  test('should format phone number automatically', async ({ page }) => {
    await page.goto('https://www.soundbeyondborders.com/contact');
    await page.waitForSelector('#contact-form', { state: 'visible' });
    
    // Scope to the main contact form
    const contactForm = page.locator('#contact-form');
    const phoneInput = contactForm.locator('#phone-input');
    
    // Type in phone number without formatting
    await phoneInput.fill('8045551234');
    
    // Trigger the input event to activate formatting
    await phoneInput.press('Tab');
    
    // Wait a moment for the formatting script to execute
    await page.waitForTimeout(500);
    
    // Verify the phone number is formatted as (804) 555-1234
    const phoneValue = await phoneInput.inputValue();
    expect(phoneValue).toMatch(/\(\d{3}\) \d{3}-\d{4}/);
  });
});