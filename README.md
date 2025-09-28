# Trip.com Crawler with Anti-Bot Detection Bypass

A TypeScript + Playwright crawler specifically designed to bypass anti-bot detection on Trip.com hotel pages.

## Features

- **Anti-Bot Detection Bypass**: Advanced stealth features to avoid detection
- **Human-like Behavior**: Simulates real user interactions
- **Stealth Mode**: Removes automation indicators and fingerprints
- **HTML Logging**: Saves page content to output folder
- **Configurable**: Easy to customize for different scenarios

## Installation

```bash
npm install
```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run crawl
```

## Configuration

The crawler can be configured by modifying the `config` object in `src/index.ts`:

```typescript
const config: CrawlerConfig = {
  url: 'https://jp.trip.com/hotels/detail/?cityId=248&hotelId=705327&checkIn=2025-10-03&checkOut=2025-10-04&crn=1&adult=1&children=0',
  outputDir: './output',
  headless: false, // Set to true for production
  timeout: 30000
};
```

## Anti-Bot Detection Features

### 1. Stealth Browser Configuration
- Removes automation indicators (`navigator.webdriver`)
- Mocks browser plugins and languages
- Overrides WebGL parameters
- Removes automation-related properties

### 2. Human-like Behavior
- Random mouse movements
- Realistic scrolling patterns
- Random delays between actions
- Simulates reading behavior

### 3. Request Headers
- Realistic user agent rotation
- Proper Accept headers
- Japanese locale settings
- Timezone configuration

### 4. Browser Arguments
- Disables automation detection features
- Removes automation-related flags
- Optimizes for stealth operation

## Output

The crawler saves the HTML content to the `output` folder with a timestamp:
```
output/trip-com-2024-01-15T10-30-45-123Z.html
```

## Troubleshooting

### Bot Detection
If you get redirected to a login page, the site has detected automation. Try:
1. Increase random delays
2. Use different user agents
3. Enable headless mode
4. Add proxy rotation

### Performance
For better performance:
1. Set `headless: true` for production
2. Adjust timeout values
3. Optimize browser arguments

## Dependencies

- `playwright`: Browser automation
- `user-agents`: Random user agent generation
- `typescript`: Type safety
- `ts-node`: Development execution

## License

MIT
