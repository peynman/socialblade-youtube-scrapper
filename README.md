# SocialBlade YouTube Scrapper
A simple node.js and puppeteer tool to scrap SocialBlade YouTube analytics.

## Dependencies
* NodeJS > 20
* Chromium > 127
* Puppeteer > 23.11

## Usage
* Put all YouTube channels urls you want to scrap in a file, for example (channels.txt).
* Open config.js and configure puppeteer and scrapping environment.
* Install modules: `npm install`
* Run scrapper: `node scrapper.js`

## Output
* A JSON list of scrapped info to a file with same name as channelsFilename with `.json`.
```json
[
    {
        "youtuberName": "Sample",
        "channelName": "@sample",
        "uploads": "xx",
        "subs": "xx",
        "views": "xx",
        "country": "xx",
        "channelType": "xx",
        "dateCreated": "xxx 22nd, 20xx",
        "grade": "xx",
        "estMonEarn": "€xx  -  €xx",
        "estYearEarn": "€xx  -  €xK",
        "averageDailySubs": "+x",
        "averageDailyViews": "+x,xxx",
        "erageDailyEarn": "€x  -  €xx",
        "averageWeeklySubs": "+xx",
        "averageWeeklyViews": "+xx,xx",
        "averageWeeklyEarn": "€8  -  €124",
        "last30DaySubs": "+1.1K",
        "last30DayViews": "+146,522",
        "last30DayEarn": "€33  -  €533",
        "headerBackground": "https://socialblade.dev/api/youtube/xxx",
        "avatar": "https://yt3.ggpht.com/xxx",
        "videosHeaders": [
            "•Date•",
            "Video Title",
            "Views",
            "Rating%",
            "Comments",
            "Est. Earnings"
        ],
        "recentVideos": []
    },
]
```