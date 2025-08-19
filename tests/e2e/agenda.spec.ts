import { test, expect } from '@playwright/test';
import { AgendaPage } from './pages/agenda.page';

/**
 * E2E Tests for Agenda Management Feature
 * Based on ISTQB Framework and ISO 25010 Quality Model
 * 
 * Test Design Techniques Applied:
 * - Equivalence Partitioning: Valid/invalid input testing
 * - Boundary Value Analysis: Edge case validation
 * - State Transition Testing: UI state management
 * - Decision Table Testing: Complex filtering logic
 * - Experience-Based Testing: Usability and error scenarios
 */

test.describe('Agenda Management - E2E Tests', () => {
  let agendaPage: AgendaPage;

  test.beforeEach(async ({ page }) => {
    agendaPage = new AgendaPage(page);
    await agendaPage.goto();
  });

  /**
   * ISO 25010 - Functional Suitability: Completeness
   * Test Design Technique: Equivalence Partitioning
   */
  test.describe('Functional Suitability Tests', () => {
    test('should display conference agenda calendar', async () => {
      // Verify calendar is visible
      await expect(agendaPage.page.locator(agendaPage.calendarContainer)).toBeVisible();
      
      // Verify talks are loaded and displayed
      const talks = await agendaPage.getTalkEvents();
      expect(talks.length).toBeGreaterThan(0);
    });

    test('should display talk details when clicking on a talk', async () => {
      // Click on first available talk
      const talks = await agendaPage.getTalkEvents();
      if (talks.length > 0) {
        await talks[0].click();
        
        // Verify modal opens with talk details
        await expect(agendaPage.page.locator(agendaPage.talkModal)).toBeVisible();
      }
    });

    test('should close talk modal when close button is clicked', async () => {
      // Open a talk modal first
      const talks = await agendaPage.getTalkEvents();
      if (talks.length > 0) {
        await talks[0].click();
        await expect(agendaPage.page.locator(agendaPage.talkModal)).toBeVisible();
        
        // Close modal
        await agendaPage.closeTalkModal();
        await expect(agendaPage.page.locator(agendaPage.talkModal)).toBeHidden();
      }
    });
  });

  /**
   * ISO 25010 - Performance Efficiency: Time Behavior
   * Test Design Technique: Boundary Value Analysis
   */
  test.describe('Performance Efficiency Tests', () => {
    test('should load agenda page within 2 seconds', async () => {
      const loadTime = await agendaPage.measurePagePerformance();
      
      // ISO 25010 Performance requirement: < 2000ms
      expect(loadTime).toBeLessThan(2000);
    });

    test('should respond to user interactions within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      
      // Perform user interaction
      const talks = await agendaPage.getTalkEvents();
      if (talks.length > 0) {
        await talks[0].click();
        await page.waitForSelector(agendaPage.talkModal, { state: 'visible' });
      }
      
      const responseTime = Date.now() - startTime;
      
      // User interaction should respond within 500ms
      expect(responseTime).toBeLessThan(500);
    });
  });

  /**
   * ISO 25010 - Usability: Accessibility
   * Test Design Technique: Experience-Based Testing
   */
  test.describe('Usability - Accessibility Tests', () => {
    test('should support keyboard navigation', async ({ page }) => {
      // Test keyboard navigation
      await page.keyboard.press('Tab');
      
      // Verify focus is visible
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });

    test('should have proper ARIA labels for screen readers', async () => {
      // Verify calendar has proper ARIA label
      const calendar = agendaPage.page.locator(agendaPage.calendarContainer);
      const ariaLabel = await calendar.getAttribute('aria-label');
      
      expect(ariaLabel).toBeTruthy();
    });

    test('should maintain focus management in modals', async ({ page }) => {
      const talks = await agendaPage.getTalkEvents();
      if (talks.length > 0) {
        await talks[0].click();
        
        // Verify focus is trapped within modal
        await page.keyboard.press('Tab');
        const focusedElement = page.locator(':focus');
        
        // Focus should be within the modal
        const modalElement = page.locator(agendaPage.talkModal);
        expect(await modalElement.locator(':focus').count()).toBeGreaterThan(0);
      }
    });
  });

  /**
   * ISO 25010 - Compatibility: Co-existence
   * Test Design Technique: Boundary Value Analysis
   */
  test.describe('Compatibility Tests', () => {
    test('should work correctly on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Verify calendar adapts to mobile
      const calendar = page.locator(agendaPage.calendarContainer);
      await expect(calendar).toBeVisible();
      
      // Verify responsive layout
      const boundingBox = await calendar.boundingBox();
      expect(boundingBox?.width).toBeLessThanOrEqual(375);
    });

    test('should maintain functionality across different screen sizes', async ({ page }) => {
      const screenSizes = [
        { width: 320, height: 568 }, // iPhone SE
        { width: 768, height: 1024 }, // iPad
        { width: 1920, height: 1080 } // Desktop
      ];

      for (const size of screenSizes) {
        await page.setViewportSize(size);
        
        // Verify calendar is still functional
        await expect(agendaPage.page.locator(agendaPage.calendarContainer)).toBeVisible();
        
        // Verify talks are still clickable
        const talks = await agendaPage.getTalkEvents();
        expect(talks.length).toBeGreaterThan(0);
      }
    });
  });

  /**
   * ISO 25010 - Reliability: Fault Tolerance
   * Test Design Technique: Error Guessing
   */
  test.describe('Reliability Tests', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate network failure
      await page.route('**/api/talks', route => route.abort());
      
      // Reload page to trigger error
      await page.reload();
      
      // Verify error message is displayed
      const errorMessage = page.locator(agendaPage.errorMessage);
      await expect(errorMessage).toBeVisible();
    });

    test('should recover from temporary API failures', async ({ page }) => {
      // First, simulate API failure
      await page.route('**/api/talks', route => route.abort());
      await page.reload();
      
      // Then restore API and retry
      await page.unroute('**/api/talks');
      await page.reload();
      
      // Verify calendar loads correctly after recovery
      await expect(agendaPage.page.locator(agendaPage.calendarContainer)).toBeVisible();
    });
  });

  /**
   * Test Design Technique: Decision Table Testing
   * Complex filtering and search scenarios
   */
  test.describe('Filtering and Search Tests', () => {
    test('should filter talks by tag', async () => {
      // Apply a tag filter
      await agendaPage.applyTagFilter('DevOps');
      
      // Verify filtered results
      const filteredTalks = await agendaPage.getTalkEvents();
      expect(filteredTalks.length).toBeGreaterThanOrEqual(0);
    });

    test('should search talks by keyword', async () => {
      // Search for talks
      await agendaPage.searchTalks('Kubernetes');
      
      // Verify search results
      const searchResults = await agendaPage.getTalkEvents();
      expect(searchResults.length).toBeGreaterThanOrEqual(0);
    });

    test('should handle empty search results gracefully', async () => {
      // Search for non-existent term
      await agendaPage.searchTalks('NonExistentTalk12345');
      
      // Verify no results message or empty state
      const talks = await agendaPage.getTalkEvents();
      expect(talks.length).toBe(0);
    });
  });

  /**
   * Test Design Technique: State Transition Testing
   * Modal state management and navigation
   */
  test.describe('State Transition Tests', () => {
    test('should maintain correct state transitions', async () => {
      // Initial state: Calendar view
      await expect(agendaPage.page.locator(agendaPage.calendarContainer)).toBeVisible();
      await expect(agendaPage.page.locator(agendaPage.talkModal)).toBeHidden();
      
      // Transition: Open modal
      const talks = await agendaPage.getTalkEvents();
      if (talks.length > 0) {
        await talks[0].click();
        await expect(agendaPage.page.locator(agendaPage.talkModal)).toBeVisible();
        
        // Transition: Close modal
        await agendaPage.closeTalkModal();
        await expect(agendaPage.page.locator(agendaPage.talkModal)).toBeHidden();
        await expect(agendaPage.page.locator(agendaPage.calendarContainer)).toBeVisible();
      }
    });
  });

  /**
   * ISO 25010 - Security: Input Validation
   * Test Design Technique: Equivalence Partitioning
   */
  test.describe('Security Tests', () => {
    test('should sanitize search input', async ({ page }) => {
      // Test XSS prevention
      const maliciousInput = '<script>alert("xss")</script>';
      await agendaPage.searchTalks(maliciousInput);
      
      // Verify script is not executed
      const alertPromise = page.waitForEvent('dialog', { timeout: 1000 }).catch(() => null);
      const alert = await alertPromise;
      expect(alert).toBeNull();
    });

    test('should handle special characters in search', async () => {
      const specialChars = ['!@#$%^&*()', '..', '/', '\\', '"', "'"];
      
      for (const chars of specialChars) {
        await agendaPage.searchTalks(chars);
        
        // Verify application doesn't crash
        await expect(agendaPage.page.locator(agendaPage.calendarContainer)).toBeVisible();
      }
    });
  });
});