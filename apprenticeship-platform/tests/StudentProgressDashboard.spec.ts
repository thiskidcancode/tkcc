import { test, expect } from "@playwright/test";

test.describe("StudentProgressDashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test("renders without errors", async ({ page }) => {
    await page.goto("/student-progress");
    
    // Check that the main heading is visible
    await expect(page.getByRole("heading", { name: /My Coding Journey/i })).toBeVisible();
    
    // Check that the stats overview is present
    await expect(page.getByText("Total Points")).toBeVisible();
    await expect(page.getByText("Lessons Done")).toBeVisible();
    await expect(page.getByText("Day Streak")).toBeVisible();
  });

  test("displays all lessons", async ({ page }) => {
    await page.goto("/student-progress");
    
    // Check that all 5 default lessons are present
    await expect(page.getByText("Hello World")).toBeVisible();
    await expect(page.getByText("Variables & Data Types")).toBeVisible();
    await expect(page.getByText("Loops & Iteration")).toBeVisible();
    await expect(page.getByText("Functions")).toBeVisible();
    await expect(page.getByText("Arrays & Objects")).toBeVisible();
  });

  test("toggles lesson completion", async ({ page }) => {
    await page.goto("/student-progress");
    
    // Find and click the first lesson
    const firstLesson = page.getByRole("button", { name: /Hello World/i });
    await firstLesson.click();
    
    // Check that the lesson is marked as complete
    await expect(firstLesson).toHaveAttribute("aria-pressed", "true");
    
    // Check that points increased
    const pointsDisplay = page.getByText(/\d+/).first();
    await expect(pointsDisplay).toHaveText("100");
  });

  test("unlocks achievement after completing first lesson", async ({ page }) => {
    await page.goto("/student-progress");
    
    // Complete the first lesson
    await page.getByRole("button", { name: /Hello World/i }).click();
    
    // Wait for celebration animation
    await page.waitForTimeout(500);
    
    // Check that First Steps achievement is unlocked
    const firstStepsAchievement = page.getByText("First Steps").locator("..");
    await expect(firstStepsAchievement).not.toHaveClass(/grayscale/);
  });

  test("progress bar updates with lesson completion", async ({ page }) => {
    await page.goto("/student-progress");
    
    // Get the progress bar
    const progressBar = page.getByRole("progressbar", { name: /Progress:/i });
    
    // Initially should be 0%
    await expect(progressBar).toHaveAttribute("aria-valuenow", "0");
    
    // Complete first lesson
    await page.getByRole("button", { name: /Hello World/i }).click();
    
    // Progress should be 20% (1 out of 5)
    await expect(progressBar).toHaveAttribute("aria-valuenow", "20");
  });

  test("persists progress in localStorage", async ({ page }) => {
    await page.goto("/student-progress");
    
    // Complete a lesson
    await page.getByRole("button", { name: /Hello World/i }).click();
    
    // Wait for localStorage to save
    await page.waitForTimeout(100);
    
    // Check localStorage
    const progressData = await page.evaluate(() => {
      return localStorage.getItem("studentProgress");
    });
    
    expect(progressData).toBeTruthy();
    const parsed = JSON.parse(progressData!);
    expect(parsed.lessons[0].isComplete).toBe(true);
    expect(parsed.totalPoints).toBe(100);
    
    // Reload the page
    await page.reload();
    
    // Check that progress persisted
    const firstLesson = page.getByRole("button", { name: /Hello World/i });
    await expect(firstLesson).toHaveAttribute("aria-pressed", "true");
  });

  test("displays all achievements", async ({ page }) => {
    await page.goto("/student-progress");
    
    // Check that all achievements are visible
    await expect(page.getByText("First Steps")).toBeVisible();
    await expect(page.getByText("Rising Star")).toBeVisible();
    await expect(page.getByText("Code Warrior")).toBeVisible();
    await expect(page.getByText("Streak Master")).toBeVisible();
  });

  test("unlocks Rising Star after 3 lessons", async ({ page }) => {
    await page.goto("/student-progress");
    
    // Complete 3 lessons
    await page.getByRole("button", { name: /Hello World/i }).click();
    await page.getByRole("button", { name: /Variables & Data Types/i }).click();
    await page.getByRole("button", { name: /Loops & Iteration/i }).click();
    
    // Wait for celebration
    await page.waitForTimeout(500);
    
    // Check that Rising Star is unlocked
    const risingStarAchievement = page.getByText("Rising Star").locator("..");
    await expect(risingStarAchievement).not.toHaveClass(/grayscale/);
  });

  test("unlocks Code Warrior after all lessons", async ({ page }) => {
    await page.goto("/student-progress");
    
    // Complete all 5 lessons
    const lessons = [
      "Hello World",
      "Variables & Data Types",
      "Loops & Iteration",
      "Functions",
      "Arrays & Objects",
    ];
    
    for (const lesson of lessons) {
      await page.getByRole("button", { name: new RegExp(lesson, "i") }).click();
      await page.waitForTimeout(100);
    }
    
    // Wait for celebration
    await page.waitForTimeout(500);
    
    // Check that Code Warrior is unlocked
    const codeWarriorAchievement = page.getByText("Code Warrior").locator("..");
    await expect(codeWarriorAchievement).not.toHaveClass(/grayscale/);
    
    // Check that progress is 100%
    const progressBar = page.getByRole("progressbar", { name: /Progress:/i });
    await expect(progressBar).toHaveAttribute("aria-valuenow", "100");
  });

  test("has proper accessibility attributes", async ({ page }) => {
    await page.goto("/student-progress");
    
    // Check ARIA labels on stat cards
    await expect(page.getByRole("region", { name: "Total points" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Completed lessons" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Current streak" })).toBeVisible();
    
    // Check progress bar has proper ARIA attributes
    const progressBar = page.getByRole("progressbar");
    await expect(progressBar).toHaveAttribute("aria-valuemin", "0");
    await expect(progressBar).toHaveAttribute("aria-valuemax", "100");
    
    // Check lesson buttons have proper ARIA labels
    const firstLesson = page.getByRole("button", { name: /Hello World/i });
    await expect(firstLesson).toHaveAttribute("aria-pressed");
  });

  test("keyboard navigation works", async ({ page }) => {
    await page.goto("/student-progress");
    
    // Tab to first lesson button
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    
    // Press Enter to toggle
    await page.keyboard.press("Enter");
    
    // Wait for update
    await page.waitForTimeout(100);
    
    // Check that lesson was completed
    const firstLesson = page.getByRole("button", { name: /Hello World/i });
    await expect(firstLesson).toHaveAttribute("aria-pressed", "true");
  });

  test("celebration animation appears", async ({ page }) => {
    await page.goto("/student-progress");
    
    // Complete first lesson
    await page.getByRole("button", { name: /Hello World/i }).click();
    
    // Check for celebration message
    const celebration = page.getByRole("alert");
    await expect(celebration).toBeVisible();
    await expect(celebration).toContainText(/First Steps Unlocked/i);
    
    // Wait for animation to disappear
    await page.waitForTimeout(3500);
    await expect(celebration).not.toBeVisible();
  });

  test("is mobile responsive", async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/student-progress");
    
    // Check that elements are still visible
    await expect(page.getByRole("heading", { name: /My Coding Journey/i })).toBeVisible();
    await expect(page.getByText("Total Points")).toBeVisible();
    
    // Check that lesson cards stack vertically (grid should be single column)
    const lessons = page.getByRole("button", { name: /Hello World/i });
    await expect(lessons).toBeVisible();
  });
});
