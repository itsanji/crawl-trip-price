import { chromium, Browser, BrowserContext, Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import UserAgent from 'user-agents';

interface CrawlerConfig {
  url: string;
  outputDir: string;
  headless: boolean;
  timeout: number;
  userAgent?: string;
}

class TripComCrawler {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  page: Page | null = null;
  private config: CrawlerConfig;

  constructor(config: CrawlerConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    console.log('🚀 Initializing Playwright browser with stealth features...');
    
    // Generate random user agent
    const userAgent = new UserAgent({ deviceCategory: 'desktop' });
    const finalUserAgent = this.config.userAgent || userAgent.toString();

    this.browser = await chromium.launch({
      headless: this.config.headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-field-trial-config',
        '--disable-ipc-flooding-protection',
        '--disable-hang-monitor',
        '--disable-prompt-on-repost',
        '--disable-sync',
        '--disable-translate',
        '--disable-windows10-custom-titlebar',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-default-apps',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-client-side-phishing-detection',
        '--disable-component-extensions-with-background-pages',
        '--disable-domain-reliability',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--disable-renderer-backgrounding',
        '--disable-sync',
        '--force-color-profile=srgb',
        '--metrics-recording-only',
        '--no-first-run',
        '--safebrowsing-disable-auto-update',
        '--enable-automation',
        '--password-store=basic',
        '--use-mock-keychain',
        '--disable-blink-features=AutomationControlled',
        '--disable-features=VizDisplayCompositor,VizServiceDisplay',
        '--disable-ipc-flooding-protection',
        '--disable-renderer-backgrounding',
        '--disable-backgrounding-occluded-windows',
        '--disable-features=TranslateUI,BlinkGenPropertyTrees',
        '--disable-hang-monitor',
        '--disable-prompt-on-repost',
        '--disable-sync',
        '--disable-translate',
        '--disable-windows10-custom-titlebar',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-default-apps',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-client-side-phishing-detection',
        '--disable-component-extensions-with-background-pages',
        '--disable-domain-reliability',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--disable-renderer-backgrounding',
        '--disable-sync',
        '--force-color-profile=srgb',
        '--metrics-recording-only',
        '--no-first-run',
        '--safebrowsing-disable-auto-update',
        '--enable-automation',
        '--password-store=basic',
        '--use-mock-keychain'
      ]
    });

    this.context = await this.browser.newContext({
      userAgent: finalUserAgent,
      viewport: { width: 1366, height: 768 },
      locale: 'ja-JP',
      timezoneId: 'Asia/Tokyo',
      extraHTTPHeaders: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'ja-JP,ja;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0'
      }
    });

    // Add stealth scripts to context
    await this.context.addInitScript(() => {
      // Remove webdriver property
      Object.defineProperty((globalThis as any).navigator, 'webdriver', {
        get: () => undefined,
      });

      // Mock plugins
      Object.defineProperty((globalThis as any).navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });

      // Mock languages
      Object.defineProperty((globalThis as any).navigator, 'languages', {
        get: () => ['ja-JP', 'ja', 'en-US', 'en'],
      });

      // Mock permissions
      const originalQuery = (globalThis as any).navigator.permissions.query;
      (globalThis as any).navigator.permissions.query = (parameters: any) => (
        parameters.name === 'notifications' ?
          Promise.resolve({ state: (globalThis as any).Notification.permission }) :
          originalQuery(parameters)
      );

      // Mock chrome runtime
      (globalThis as any).chrome = {
        runtime: {},
        loadTimes: function() {},
        csi: function() {},
        app: {}
      };

      // Override getParameter
      const getParameter = (globalThis as any).WebGLRenderingContext.prototype.getParameter;
      (globalThis as any).WebGLRenderingContext.prototype.getParameter = function(parameter: any) {
        if (parameter === 37445) {
          return 'Intel Inc.';
        }
        if (parameter === 37446) {
          return 'Intel Iris OpenGL Engine';
        }
        return getParameter(parameter);
      };
    });

    this.page = await this.context.newPage();

    // Set additional stealth measures
    await this.page.addInitScript(() => {
      // Remove automation indicators
      delete (globalThis as any).__nightmare;
      delete (globalThis as any).__phantomas;
      delete (globalThis as any).__selenium;
      delete (globalThis as any).__webdriver;
      delete (globalThis as any).__driver;
      delete (globalThis as any).__selenium_unwrapped;
      delete (globalThis as any).__fxdriver;
      delete (globalThis as any).__driver_unwrapped;
      delete (globalThis as any).__webdriver_unwrapped;
      delete (globalThis as any).__webdriver_evaluate;
      delete (globalThis as any).__selenium_evaluate;
      delete (globalThis as any).__fxdriver_evaluate;
      delete (globalThis as any).__webdriver_script_function;
      delete (globalThis as any).__webdriver_script_func;
      delete (globalThis as any).__webdriver_script_fn;
      delete (globalThis as any).__fxdriver_script_function;
      delete (globalThis as any).__driver_unwrapped;
      delete (globalThis as any).__webdriver_unwrapped;
      delete (globalThis as any).__selenium_unwrapped;
      delete (globalThis as any).__fxdriver_unwrapped;
    });

    console.log('✅ Browser initialized with stealth features');
  }

  async crawl(): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not initialized. Call initialize() first.');
    }

    console.log(`🌐 Navigating to: ${this.config.url}`);
    
    try {
      // Add random delay before navigation
      await this.randomDelay(1000, 3000);
      
      const response = await this.page.goto(this.config.url, {
        waitUntil: 'domcontentloaded',
        timeout: this.config.timeout
      });

      if (!response) {
        throw new Error('Failed to load page');
      }

      console.log(`📄 Page loaded with status: ${response.status()}`);

      // Check if redirected to login (anti-bot detection)
      const pageUrl = this.page.url();
      if (pageUrl.includes('login') || pageUrl.includes('signin')) {
        console.log('⚠️  Detected redirect to login page - possible bot detection');
        console.log(`Current URL: ${pageUrl}`);
      }

      // Wait for page to load with shorter timeout
      try {
        await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });
      } catch (error) {
        console.log('⚠️  Page load timeout, continuing with current content...');
      }

      // Wait a bit more for dynamic content to load
      console.log('⏳ Waiting for dynamic content to load...');
      await this.randomDelay(3000, 5000);
      
      // Skip date picker interaction for single crawl

      // Wait for price elements to load
      console.log('💰 Waiting for price elements to load...');
      try {
        await this.page.waitForSelector('.saleRoomItemBox-priceBox-displayPrice__WOTit', { timeout: 10000 });
        console.log('✅ Price elements found');
      } catch (error) {
        console.log('⚠️  Price elements not found, continuing with current content...');
      }

      // Extract prices
      const prices = await this.extractPrices();
      console.log('💵 Extracted prices:', prices);

      // Save prices to file
      const currentUrl = this.page.url();
      const checkInMatch = currentUrl.match(/checkIn=(\d{4}-\d{2}-\d{2})/);
      const bookingDate = checkInMatch ? checkInMatch[1] : new Date().toISOString().split('T')[0];
      
      await this.savePrices(prices, bookingDate);
      
      console.log('✅ Successfully crawled and saved prices');

    } catch (error) {
      console.error('❌ Error during crawling:', error);
      throw error;
    }
  }


  async interactWithDatePickerForNextDay(): Promise<void> {
    if (!this.page) return;

    console.log('📅 Interacting with date picker for next day...');

    try {
      // Get current URL and parse dates
      const currentUrl = this.page.url();
      console.log(`🔗 Current URL: ${currentUrl}`);
      
      // Extract checkIn and checkOut from URL
      const checkInMatch = currentUrl.match(/checkIn=(\d{4}-\d{2}-\d{2})/);
      const checkOutMatch = currentUrl.match(/checkOut=(\d{4}-\d{2}-\d{2})/);
      
      if (!checkInMatch || !checkOutMatch) {
        console.log('⚠️  Could not parse dates from URL');
        return;
      }
      
      const currentCheckIn = checkInMatch[1];
      const currentCheckOut = checkOutMatch[1];
      console.log(`📅 Current dates: ${currentCheckIn} to ${currentCheckOut}`);
      
      // Calculate next dates
      const currentCheckInDate = new Date(currentCheckIn);
      const currentCheckOutDate = new Date(currentCheckOut);
      
      const nextCheckInDate = new Date(currentCheckInDate);
      nextCheckInDate.setDate(currentCheckInDate.getDate() + 1);
      
      const nextCheckOutDate = new Date(currentCheckOutDate);
      nextCheckOutDate.setDate(currentCheckOutDate.getDate() + 1);
      
      const nextCheckIn = nextCheckInDate.toISOString().split('T')[0];
      const nextCheckOut = nextCheckOutDate.toISOString().split('T')[0];
      
      console.log(`📅 Next dates: ${nextCheckIn} to ${nextCheckOut}`);
      
      // Extract day numbers for clicking
      const nextCheckInDay = nextCheckInDate.getDate().toString();
      const nextCheckOutDay = nextCheckOutDate.getDate().toString();
      
      console.log(`🎯 Looking for dates: ${nextCheckInDay} (check-in) and ${nextCheckOutDay} (check-out)`);

      // Step 3: Click date picker to open it
      const dateSelectors = [
        '[class*="checkin"]',
        '[class*="checkIn"]',
        '[class*="check-in"]',
        '[class*="date"]',
        '[class*="calendar"]',
        '[class*="searchBox"]',
        '[class*="destination"]',
        '[data-testid*="checkin"]',
        '[data-testid*="date"]',
        'input[type="date"]',
        'input[placeholder*="日"]',
        'input[placeholder*="date"]',
        'div[class*="calen"]',
        'div[class*="date"]'
      ];

      let dateElement = null;
      for (const selector of dateSelectors) {
        try {
          const elements = await this.page.$$(selector);
          if (elements.length > 0) {
            dateElement = elements[0];
            console.log(`✅ Found date element with selector: ${selector}`);
            break;
          }
        } catch (error) {
          // Continue with next selector
        }
      }

      if (dateElement) {
        await dateElement.click();
        console.log('📅 Date picker opened');
        await this.randomDelay(1000, 2000);

        // Step 4: Click check-in date
        console.log(`📅 Clicking check-in date: ${nextCheckInDay}...`);
        const checkInClicked = await this.clickSpecificDate(nextCheckInDay);
        
        if (!checkInClicked) {
          console.log('⚠️  Check-in date not clicked, aborting');
          return;
        }
        
        await this.randomDelay(1000, 2000);

        // Step 5: Click check-out date
        console.log(`📅 Clicking check-out date: ${nextCheckOutDay}...`);
        const checkOutClicked = await this.clickSpecificDate(nextCheckOutDay);
        
        if (!checkOutClicked) {
          console.log('⚠️  Check-out date not clicked, aborting');
          return;
        }
        
        console.log('✅ Both dates successfully selected');
        await this.randomDelay(1000, 2000);

        // Step 6: Click 検索 button
        console.log('🔍 Clicking search button...');
        await this.clickSearchButton();
        
        console.log('✅ Date picker interaction completed');
      } else {
        console.log('⚠️  Date picker not found');
      }
    } catch (error) {
      console.error('❌ Error interacting with date picker:', error);
    }
  }

  private async clickSpecificDate(dayNumber: string): Promise<boolean> {
    if (!this.page) return false;

    try {
      console.log(`🎯 Looking for date: ${dayNumber}`);
      
      // Based on the HTML structure you provided, look for td elements with span.day containing the date
      const dateSelectors = [
        // Primary selector: td containing span.day with the exact date number
        `td span.day:text("${dayNumber}")`,
        `td:has(span.day:text("${dayNumber}"))`,
        `td span.day:has-text("${dayNumber}")`,
        `td:has(span.day:has-text("${dayNumber}"))`,
        // Fallback selectors
        `td[role="gridcell"] span.day:text("${dayNumber}")`,
        `td[role="gridcell"]:has(span.day:text("${dayNumber}"))`,
        `span.day:text("${dayNumber}")`,
        `[data-d*="${dayNumber}"] span.day`,
        // Generic selectors as last resort
        `[aria-label*="${dayNumber}"]`,
        `td:contains("${dayNumber}")`,
        `span.day:contains("${dayNumber}")`,
        `[class*="day"]:contains("${dayNumber}")`
      ];
      
      let dateClicked = false;
      for (const selector of dateSelectors) {
        try {
          const dateElements = await this.page.$$(selector);
          
          for (const element of dateElements) {
            try {
              const isVisible = await element.isVisible();
              const text = await element.textContent();
              const tagName = await element.evaluate(el => el.tagName);
              const classList = await element.getAttribute('class');
              
              if (isVisible && text && text.trim() === dayNumber) {
                // If it's a span.day, click its parent td instead
                if (tagName === 'SPAN' && classList?.includes('day')) {
                  await element.evaluate(el => {
                    const td = el.closest('td');
                    if (td) td.click();
                  });
                  console.log(`✅ Clicked date: ${dayNumber}`);
                  dateClicked = true;
                  break;
                } else {
                  await element.click();
                  console.log(`✅ Clicked date: ${dayNumber}`);
                  dateClicked = true;
                  break;
                }
              }
            } catch (error) {
              continue;
            }
          }
          
          if (dateClicked) break;
        } catch (error) {
          // Continue with next selector
        }
      }
      
      if (!dateClicked) {
        // Manual search for td elements containing span.day with the exact date
        const allTdElements = await this.page.$$('td[role="gridcell"]');
        
        for (const td of allTdElements) {
          try {
            const spanDay = await td.$('span.day');
            if (spanDay) {
              const dayText = await spanDay.textContent();
              const isVisible = await td.isVisible();
              
              if (dayText && dayText.trim() === dayNumber && isVisible) {
                await td.click();
                console.log(`✅ Clicked date: ${dayNumber}`);
                dateClicked = true;
                break;
              }
            }
          } catch (error) {
            // Continue
          }
        }
      }
      
      return dateClicked;
    } catch (error) {
      console.error('❌ Error clicking date:', error);
      return false;
    }
  }

  private async clickSearchButton(): Promise<void> {
    if (!this.page) return;

    try {
      // Look for the specific search button class you mentioned
      const searchSelectors = [
        'button.tripui-online-btn.tripui-online-btn-large.tripui-online-btn-solid-primary.tripui-online-btn-block',
        '.tripui-online-btn.tripui-online-btn-large.tripui-online-btn-solid-primary.tripui-online-btn-block',
        'button[class="tripui-online-btn tripui-online-btn-large tripui-online-btn-solid-primary tripui-online-btn-block"]',
        '[class="tripui-online-btn tripui-online-btn-large tripui-online-btn-solid-primary tripui-online-btn-block"]',
        'button[class*="tripui-online-btn-large"]',
        'button[class*="tripui-online-btn-solid-primary"]',
        'button[class*="tripui-online-btn-block"]',
        'button[class*="tripui-online-btn"]',
        'button[class*="search"]',
        'button[class*="Search"]',
        'button[type="submit"]',
        'input[type="submit"]',
        '[data-testid*="search"]',
        'button:contains("検索")',
        'button:contains("Search")',
        '[aria-label*="search"]',
        '[title*="search"]'
      ];

      let searchClicked = false;
      for (const selector of searchSelectors) {
        try {
          const searchElements = await this.page.$$(selector);
          if (searchElements.length > 0) {
            await searchElements[0].click();
            console.log(`🔍 Search button clicked`);
            searchClicked = true;
            break;
          }
        } catch (error) {
          // Continue with next selector
        }
      }

      if (!searchClicked) {
        // Try to find button with text "検索"
        const searchButtons = await this.page.$$('button');
        for (const button of searchButtons) {
          try {
            const text = await button.textContent();
            if (text && (text.includes('検索') || text.includes('Search'))) {
              await button.click();
              console.log('🔍 Search button clicked');
              searchClicked = true;
              break;
            }
          } catch (error) {
            // Continue with next button
          }
        }
      }
    } catch (error) {
      console.error('❌ Error clicking search button:', error);
    }
  }


  async randomDelay(min: number, max: number): Promise<void> {
    const delay = Math.random() * (max - min) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  async extractPrices(): Promise<string[]> {
    if (!this.page) return [];

    try {
      // Try to find price elements with the specific class
      const priceElements = await this.page.$$('.saleRoomItemBox-priceBox-displayPrice__WOTit span');
      const prices: string[] = [];

      for (const element of priceElements) {
        const priceText = await element.textContent();
        if (priceText && priceText.trim()) {
          prices.push(priceText.trim());
        }
      }

      // If no prices found with specific class, try alternative selectors
      if (prices.length === 0) {
        console.log('🔍 Trying alternative price selectors...');
        
        // Try common price selectors
        const alternativeSelectors = [
          '[class*="price"]',
          '[class*="Price"]',
          '[class*="displayPrice"]',
          'span:contains("円")',
          'span:contains("¥")',
          '[data-testid*="price"]'
        ];

        for (const selector of alternativeSelectors) {
          try {
            const elements = await this.page.$$(selector);
            for (const element of elements) {
              const text = await element.textContent();
              if (text && (text.includes('円') || text.includes('¥') || /^\d+/.test(text.trim()))) {
                prices.push(text.trim());
              }
            }
          } catch (error) {
            // Continue with next selector
          }
        }
      }

      return [...new Set(prices)]; // Remove duplicates
    } catch (error) {
      console.error('❌ Error extracting prices:', error);
      return [];
    }
  }


  private async savePrices(prices: string[], bookingDate: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `prices-${timestamp}.json`;
    const filepath = path.join(this.config.outputDir, filename);

    const priceData = {
      booking_date: bookingDate,
      url: this.page?.url() || this.config.url,
      prices: prices
    };

    fs.writeFileSync(filepath, JSON.stringify(priceData, null, 2), 'utf8');
    console.log(`💰 Prices saved to: ${filepath}`);
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      console.log('🔒 Browser closed');
    }
  }
}

async function crawlMultipleDays() {
  const baseUrl = 'https://jp.trip.com/hotels/detail/?cityId=248&hotelId=705327&checkIn=2025-10-03&checkOut=2025-10-04&crn=1&adult=1&children=0';
  const days = 2;
  
  const allPrices: { date: string; prices: string[]; url: string }[] = [];

  // Initialize browser once
  const config: CrawlerConfig = {
    url: baseUrl,
    outputDir: './output',
    headless: false, // Visible browser for debugging
    timeout: 60000
  };

  const crawler = new TripComCrawler(config);

  try {
    // Step 1: Open browser and load initial page
    console.log('🚀 Opening browser and loading initial page...');
    await crawler.initialize();
    await crawler.page!.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    
    // Wait for page to load
    await crawler.randomDelay(3000, 5000);
    
    // Step 2: Get initial prices (Day 1)
    console.log('\n🗓️  Day 1: Getting initial prices...');
    const initialPrices = await crawler.extractPrices();
    allPrices.push({
      date: '2025-10-03',
      prices: initialPrices,
      url: baseUrl
    });
    console.log(`✅ Day 1 completed. Found ${initialPrices.length} prices.`);

    // Step 3-8: For each additional day, change dates and get new prices
    for (let i = 1; i < days; i++) {
      console.log(`\n🗓️  Day ${i + 1}: Changing dates and getting new prices...`);
      
      // Step 3: Click date picker
      await crawler.interactWithDatePickerForNextDay();
      
      // Step 4: Wait for new prices to load
      await crawler.randomDelay(3000, 5000);
      
      // Step 5: Get new prices
      const newPrices = await crawler.extractPrices();
      const currentDate = new Date('2025-10-03');
      currentDate.setDate(currentDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      allPrices.push({
        date: dateStr,
        prices: newPrices,
        url: crawler.page!.url()
      });
      
      console.log(`✅ Day ${i + 1} completed. Found ${newPrices.length} prices.`);
    }
    
  } catch (error) {
    console.error('❌ Multi-day crawling failed:', error);
  } finally {
    await crawler.close();
  }
  
  // Save all prices to a summary file
  await saveAllPrices(allPrices);
  console.log('\n🎉 Multi-day crawling completed!');
}

async function saveAllPrices(allPrices: { date: string; prices: string[]; url: string }[]) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `multi-day-prices-${timestamp}.json`;
  const filepath = path.join('./output', filename);

  const cleanData = allPrices.map(day => ({
    booking_date: day.date,
    url: day.url,
    prices: day.prices
  }));

  fs.writeFileSync(filepath, JSON.stringify(cleanData, null, 2), 'utf8');
  console.log(`📊 Summary saved to: ${filepath}`);
}


// Run the crawler
if (require.main === module) {
  crawlMultipleDays().catch(console.error);
}

export { TripComCrawler, CrawlerConfig };
