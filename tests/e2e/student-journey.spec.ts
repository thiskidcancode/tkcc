import { test, expect } from '@playwright/test';

test.describe('Student Learning Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to apprenticeship platform
    await page.goto('/');
  });

  test('should complete GitHub onboarding wizard', async ({ page }) => {
    // Test the CodingAdventureWizard flow
    await test.step('Start wizard', async () => {
      await page.click('[data-testid="start-wizard"]');
      await expect(page.locator('h1')).toContainText('Welcome to Your Coding Adventure');
    });

    await test.step('GitHub account setup', async () => {
      await page.click('[data-testid="github-setup"]');
      // Mock GitHub OAuth flow
      await expect(page.locator('[data-testid="github-status"]')).toContainText('Connected');
    });

    await test.step('First repository creation', async () => {
      await page.fill('[data-testid="repo-name"]', 'my-first-project');
      await page.click('[data-testid="create-repo"]');
      await expect(page.locator('[data-testid="repo-created"]')).toBeVisible();
    });

    await test.step('Complete wizard', async () => {
      await page.click('[data-testid="finish-wizard"]');
      await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
    });
  });

  test('should navigate quest system', async ({ page }) => {
    // Assume student is logged in
    await page.goto('/dashboard');

    await test.step('View available quests', async () => {
      await expect(page.locator('[data-testid="quest-list"]')).toBeVisible();
      await expect(page.locator('[data-testid="quest-item"]')).toHaveCount.greaterThan(0);
    });

    await test.step('Start first quest', async () => {
      await page.click('[data-testid="quest-item"]:first-child');
      await expect(page.locator('[data-testid="quest-content"]')).toBeVisible();
    });

    await test.step('Complete quest step', async () => {
      await page.click('[data-testid="complete-step"]');
      await expect(page.locator('[data-testid="step-completed"]')).toBeVisible();
    });
  });

  test('should build and deploy project', async ({ page }) => {
    await page.goto('/projects/new');

    await test.step('Create new project', async () => {
      await page.fill('[data-testid="project-name"]', 'Student Portfolio');
      await page.selectOption('[data-testid="project-type"]', 'website');
      await page.click('[data-testid="create-project"]');
    });

    await test.step('Code in browser', async () => {
      // Test Codespaces integration
      await expect(page.locator('[data-testid="code-editor"]')).toBeVisible();
      await page.fill('[data-testid="code-editor"]', '<h1>Hello World</h1>');
    });

    await test.step('Deploy to GitHub Pages', async () => {
      await page.click('[data-testid="deploy-button"]');
      await expect(page.locator('[data-testid="deployment-success"]')).toBeVisible();
      await expect(page.locator('[data-testid="live-url"]')).toBeVisible();
    });
  });
});