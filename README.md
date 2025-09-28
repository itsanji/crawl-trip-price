# Trip.com Multi-Hotel Price Crawler

A clean TypeScript + Playwright crawler for extracting hotel prices from multiple Trip.com hotels with anti-bot detection bypass.

## Features

- **Multi-Hotel Crawling**: Crawls multiple hotels simultaneously in parallel
- **Anti-Bot Detection Bypass**: Advanced stealth features to avoid detection
- **Multi-Day Price Collection**: Automatically changes dates and collects prices for 30 days
- **Clean JSON Output**: Organized data with hotel information, booking dates, URLs, and prices
- **Date Picker Automation**: Automatically navigates calendar and selects dates

## Installation

```bash
npm install
```

## Usage

```bash
npm run multi-hotel
```

## Output

The crawler saves clean JSON data to the `output` folder with hotel-organized structure:

```json
[
  {
    "hotel_name": "Hotel 1",
    "hotel_id": "705327",
    "dates": [
      {
        "booking_date": "2025-10-03",
        "url": "https://jp.trip.com/hotels/detail/?cityId=248&hotelId=705327&checkIn=2025-10-03&checkOut=2025-10-04&crn=1&adult=1&children=0",
        "prices": ["20,950円", "23,521円", "26,760円"]
      },
      {
        "booking_date": "2025-10-04",
        "url": "https://jp.trip.com/hotels/detail/?cityId=248&hotelId=705327&checkIn=2025-10-04&checkOut=2025-10-05&crn=1&adult=1&children=0",
        "prices": ["23,491円", "26,707円"]
      }
    ]
  },
  {
    "hotel_name": "Hyatt Regency Tokyo Bay",
    "hotel_id": "35953735",
    "dates": [
      {
        "booking_date": "2025-10-03",
        "url": "https://jp.trip.com/hotels/detail/?cityId=4828&hotelId=35953735&checkIn=2025-10-03&checkOut=2025-10-04&crn=1&adult=1&children=0",
        "prices": ["28,838円", "39,527円", "43,008円"]
      }
    ]
  }
]
```

## How It Works

1. **Parallel Hotel Processing**: Crawls all hotels simultaneously for maximum speed
2. **Initial Price Collection**: Gets Day 1 prices for each hotel in parallel
3. **Date Navigation**: Uses date picker to advance through 30 consecutive days
4. **Price Extraction**: Collects all available room prices for each date
5. **Organized Output**: Saves data grouped by hotel with all dates and prices

## Adding More Hotels

Edit the `hotels` array in `src/index.ts`:

```typescript
const hotels = [
  {
    name: 'Your Hotel Name',
    url: 'https://jp.trip.com/hotels/detail/?cityId=XXX&hotelId=XXX&checkIn=2025-10-03&checkOut=2025-10-04&crn=1&adult=1&children=0'
  }
];
```

## Dependencies

- `playwright`: Browser automation
- `user-agents`: User agent rotation
- `typescript`: Type safety

## License

MIT