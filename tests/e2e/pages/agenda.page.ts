import { Page } from '@playwright/test';

/**
 * Page Object Model for the Agenda Calendar page
 * Implements ISTQB Page Object Pattern for maintainable E2E tests
 */
export class AgendaPage {
  readonly page: Page;

  // Selectors following the Page Object Model pattern
  readonly calendarContainer = '[data-testid="agenda-calendar"]';
  readonly talkEvent = '[data-testid="talk-event"]';
  readonly talkModal = '[data-testid="talk-modal"]';
  readonly modalCloseButton = '[data-testid="modal-close"]';
  readonly filterPanel = '[data-testid="filter-panel"]';
  readonly tagFilter = '[data-testid="tag-filter"]';
  readonly searchInput = '[data-testid="search-input"]';
  readonly loadingSpinner = '[data-testid="loading-spinner"]';
  readonly errorMessage = '[data-testid="error-message"]';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to the agenda page
   * Test Design Technique: State Transition Testing
   */
  async goto() {
    await this.page.goto('/agenda');
    await this.waitForPageLoad();
  }

  /**
   * Wait for the page to fully load
   * Performance validation as per ISO 25010 Performance Efficiency
   */
  async waitForPageLoad() {
    // Wait for calendar to be visible
    await this.page.waitForSelector(this.calendarContainer, { state: 'visible' });
    
    // Wait for any loading spinners to disappear
    await this.page.waitForSelector(this.loadingSpinner, { state: 'hidden' });
  }

  /**
   * Get all talk events displayed in the calendar
   * Test Design Technique: Equivalence Partitioning
   */
  async getTalkEvents() {
    return await this.page.locator(this.talkEvent).all();
  }

  /**
   * Click on a specific talk event by title
   * Test Design Technique: Decision Table Testing
   */
  async clickTalkByTitle(title: string) {
    const talkEvent = this.page.locator(this.talkEvent).filter({ hasText: title });
    await talkEvent.click();
  }

  /**
   * Verify talk modal is displayed with correct information
   * ISO 25010 Functional Suitability - Correctness
   */
  async verifyTalkModal(expectedTitle: string) {
    // Wait for modal to appear
    await this.page.waitForSelector(this.talkModal, { state: 'visible' });
    
    // Verify modal contains expected title
    const modalTitle = this.page.locator(this.talkModal).locator('h2');
    await modalTitle.waitFor({ state: 'visible' });
    
    const title = await modalTitle.textContent();
    return title?.includes(expectedTitle) || false;
  }

  /**
   * Close the talk modal
   * Test Design Technique: State Transition Testing
   */
  async closeTalkModal() {
    await this.page.click(this.modalCloseButton);
    await this.page.waitForSelector(this.talkModal, { state: 'hidden' });
  }

  /**
   * Apply tag filter
   * Test Design Technique: Boundary Value Analysis
   */
  async applyTagFilter(tag: string) {
    const tagFilterButton = this.page.locator(this.tagFilter).filter({ hasText: tag });
    await tagFilterButton.click();
    
    // Wait for filter to be applied
    await this.page.waitForTimeout(500);
  }

  /**
   * Search for talks
   * Test Design Technique: Equivalence Partitioning
   */
  async searchTalks(searchTerm: string) {
    await this.page.fill(this.searchInput, searchTerm);
    await this.page.keyboard.press('Enter');
    
    // Wait for search results
    await this.page.waitForTimeout(500);
  }

  /**
   * Verify calendar displays correct number of talks
   * ISO 25010 Functional Suitability - Completeness
   */
  async verifyTalkCount(expectedCount: number) {
    const talks = await this.getTalkEvents();
    return talks.length === expectedCount;
  }

  /**
   * Verify accessibility compliance
   * ISO 25010 Usability - Accessibility
   */
  async verifyAccessibility() {
    // Check for proper ARIA labels
    const calendar = this.page.locator(this.calendarContainer);
    const ariaLabel = await calendar.getAttribute('aria-label');
    
    // Verify keyboard navigation
    await this.page.keyboard.press('Tab');
    const focusedElement = await this.page.locator(':focus').count();
    
    return ariaLabel !== null && focusedElement > 0;
  }

  /**
   * Verify responsive design on mobile
   * ISO 25010 Compatibility - Co-existence
   */
  async verifyMobileLayout() {
    // Set mobile viewport
    await this.page.setViewportSize({ width: 375, height: 667 });
    
    // Verify calendar adapts to mobile
    const calendar = this.page.locator(this.calendarContainer);
    const boundingBox = await calendar.boundingBox();
    
    return boundingBox && boundingBox.width <= 375;
  }

  /**
   * Measure page performance
   * ISO 25010 Performance Efficiency - Time Behavior
   */
  async measurePagePerformance() {
    const navigationStart = await this.page.evaluate(() => performance.timing.navigationStart);
    const loadEventEnd = await this.page.evaluate(() => performance.timing.loadEventEnd);
    
    const loadTime = loadEventEnd - navigationStart;
    return loadTime;
  }

  /**
   * Verify error handling
   * ISO 25010 Reliability - Fault Tolerance
   */
  async verifyErrorHandling() {
    // Simulate network error
    await this.page.route('**/api/talks', route => route.abort());
    
    // Reload page to trigger error
    await this.page.reload();
    
    // Check if error message is displayed
    const errorMessage = this.page.locator(this.errorMessage);
    return await errorMessage.isVisible();
  }
}