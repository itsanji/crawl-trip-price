# Trip.com Price Crawler

A clean TypeScript + Playwright crawler for extracting hotel prices from Trip.com with anti-bot detection bypass.

## Features

- **Anti-Bot Detection Bypass**: Advanced stealth features to avoid detection
- **Multi-Day Price Collection**: Automatically changes dates and collects prices
- **Clean JSON Output**: Only exports essential data (booking_date, url, prices)
- **Date Picker Automation**: Automatically navigates calendar and selects dates

## Installation

```bash
npm install
```

## Usage

```bash
npm run multi-day
```

## Output

The crawler saves clean JSON data to the `output` folder:

```json
[
  {
    "booking_date": "2025-10-03",
    "url": "https://jp.trip.com/hotels/detail/?cityId=248&hotelId=705327&checkIn=2025-10-03&checkOut=2025-10-04&crn=1&adult=1&children=0",
    "prices": [
      "20,950円",
      "23,521円",
      "26,760円"
    ]
  },
  {
    "booking_date": "2025-10-04", 
    "url": "https://jp.trip.com/hotels/detail/?cityId=248&hotelId=705327&checkIn=2025-10-04&checkOut=2025-10-05&crn=1&adult=1&children=0",
    "prices": [
      "23,491円",
      "26,707円"
    ]
  }
]
```

## How It Works

1. Opens browser and loads initial hotel page
2. Extracts prices for Day 1
3. Opens date picker and selects next day dates
4. Clicks search button to load new prices
5. Extracts prices for Day 2
6. Saves clean JSON with booking dates, URLs, and prices

## Dependencies

- `playwright`: Browser automation
- `user-agents`: User agent rotation
- `typescript`: Type safety

## License

MIT