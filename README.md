# SocialBlade YouTube Scrapper
A simple node.js and puppeteer tool to scrap SocialBlade YouTube analytics.

## Requirements
* NodeJS > 20
* Chromium > 127

## Dependencies
* Puppeteer > 23.11
* puppeteer-extra > 3.3
* puppeteer-extra-plugin-stealth

## Usage
* Put all YouTube channels urls you want to scrap in a file, for example (`channels.txt`).
* Open config.js and configure puppeteer and scrapping environment.
    * You need specify chromium executable path.
    * Remove proxy from args if you don not use one.
    * Avoiding headless Chrome helps when u need to verify YOU ARE HUMAN, since you are going to hit limits when scrapping large lists.
    * Use `batchLimit` to set number of maximum tabs to open when scrapping.
    * Use `newBatchDelay` and `newTabDelay` to avoid hitting limitations.
    * Keeping sessions consistent between runs allows you to better mimic real browser behavior with `chromiumSessionDataDir`.
* Install modules: `npm install`
* Run scrapper: `node scrapper.js` or `npm run scrapper`
    * start with custom channelsFilename: `node scrapper.js --channelsFilename=./my-custom-list.txt`

## Output
* A JSON list of scrapped info to a file with same name as `channelsFilename` with `.json` as extension (`channels.txt.json`).
```json
[
    {
        "youtuberName": "Sample",
        "channelName": "@sample",
        "uploads": 238,
        "subs": 1000000,
        "views": 100000000,
        "country": "xx",
        "channelType": "xx",
        "dateCreated": "xxx 22nd, 20xx",
        "grade": "xx",
        "estMonEarn": [1000, 12000],
        "estYearEarn": [1000, 12000],
        "averageDailySubs": -100,
        "averageDailyViews": 10000,
        "averageDailyEarn": [1000, 12000],
        "averageWeeklySubs": 1000,
        "averageWeeklyViews": -100000,
        "averageWeeklyEarn": [1000, 12000],
        "last30DaySubs": 10000,
        "last30DayViews": -100000,
        "last30DayEarn": [1000, 12000],
        "headerBackground": "https://socialblade.dev/api/youtube/xxx",
        "avatar": "https://yt3.ggpht.com/xxx",
        "recentVideos": [],
        "mostViewedVideos": [],
    },
]
```

## Tutorial on building your own scrapper
[SocialBlade YouTube Scrapper](https://gist.github.com/peynman/9724a0ecd483f4e806e1f90a7589a870)