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
  private page: Page | null = null;
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
      const currentUrl = this.page.url();
      if (currentUrl.includes('login') || currentUrl.includes('signin')) {
        console.log('⚠️  Detected redirect to login page - possible bot detection');
        console.log(`Current URL: ${currentUrl}`);
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
      
      // Add human-like behavior
      await this.simulateHumanBehavior();

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

      // Get page content
      const bodyHTML = await this.page.content();
      
      // Save to file
      await this.saveHTML(bodyHTML);
      
      // Save prices to separate file
      await this.savePrices(prices);
      
      console.log('✅ Successfully crawled and saved HTML content');

    } catch (error) {
      console.error('❌ Error during crawling:', error);
      throw error;
    }
  }

  private async simulateHumanBehavior(): Promise<void> {
    if (!this.page) return;

    console.log('🤖 Simulating human behavior...');

    // Random mouse movements
    await this.page.mouse.move(
      Math.random() * 800 + 100,
      Math.random() * 600 + 100
    );

    // Random scroll
    await this.page.evaluate(() => {
      (globalThis as any).scrollTo(0, Math.random() * 500);
    });

    // Random delay
    await this.randomDelay(500, 2000);

    // Simulate reading behavior
    await this.page.evaluate(() => {
      (globalThis as any).scrollTo(0, Math.random() * 1000);
    });

    await this.randomDelay(1000, 3000);
  }

  private async randomDelay(min: number, max: number): Promise<void> {
    const delay = Math.random() * (max - min) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private async extractPrices(): Promise<string[]> {
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

  private async saveHTML(html: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `trip-com-${timestamp}.html`;
    const filepath = path.join(this.config.outputDir, filename);

    // Ensure output directory exists
    if (!fs.existsSync(this.config.outputDir)) {
      fs.mkdirSync(this.config.outputDir, { recursive: true });
    }

    fs.writeFileSync(filepath, html, 'utf8');
    console.log(`💾 HTML saved to: ${filepath}`);
  }

  private async savePrices(prices: string[]): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `prices-${timestamp}.json`;
    const filepath = path.join(this.config.outputDir, filename);

    const priceData = {
      timestamp: new Date().toISOString(),
      url: this.config.url,
      prices: prices,
      count: prices.length
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

async function main() {
  const config: CrawlerConfig = {
    url: 'https://jp.trip.com/hotels/detail/?cityId=248&hotelId=705327&checkIn=2025-10-03&checkOut=2025-10-04&crn=1&adult=1&children=0',
    outputDir: './output',
    headless: true, // Set to false for debugging
    timeout: 60000
  };

  const crawler = new TripComCrawler(config);

  try {
    await crawler.initialize();
    await crawler.crawl();
  } catch (error) {
    console.error('❌ Crawler failed:', error);
  } finally {
    await crawler.close();
  }
}

// Run the crawler
if (require.main === module) {
  main().catch(console.error);
}

export { TripComCrawler, CrawlerConfig };
