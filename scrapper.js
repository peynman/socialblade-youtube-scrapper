const puppeteer = require('puppeteer-extra')
const utils = require('./utils')
const config = require('./config')
const process = require('process')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

/**
 * SocialBlade Scrapper.
 * Execute scrapper on a list of youtube urls in config.channelsFilename path.
 * Usage with command line args: node scrapper.js --${config key}={desired value}
 * 
 */

(async () => {
    process.argv.forEach(function (val) {
        Object.keys(config).forEach(key => {
            if (val.startsWith('--' + key)) {
                const configValue = val.substring(val.indexOf('=') + 1)
                if (configValue) {
                    if (key === 'chromiumArgs') {
                        config[key] = JSON.parse(configValue)
                    } else {
                        config[key] = configValue
                    }
                    console.log('Overriding config ' + key + ': ', configValue)
                }
            }
        })
    })

    puppeteer.use(StealthPlugin())
    puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

    try {
        // Launch a browser instance
        const browser = await puppeteer.launch({
            args: config.chromiumArgs,
            executablePath: config.chromiumExePath,
            userDataDir: config.chromiumSessionDataDir,
            headless: config.runHeadless,
        })

        // read list of channels from channelsFilename file.
        try {
            const channelsList = await utils.readFileLines(config.channelsFilename)

            // remove duplicate urls
            const channelsDistNames = channelsList.filter((s, index) => index === channelsList.indexOf(s)).map(url => url.substring(config.channelsUrlBase.length))

            console.log('Found ' + channelsDistNames.length + ' distinct channel names.')

            // scrap data
            const scrappedData = await utils.runScrapBatches(
                browser,
                channelsDistNames,
                data => ({
                    ...data,
                    // format numeric values
                    uploads: utils.formatSocialBladeNumber(data.uploads),
                    subs: utils.formatSocialBladeNumber(data.subs),
                    views: utils.formatSocialBladeNumber(data.views),
                    estMonEarn: utils.formatSocialBladeNumber(data.estMonEarn),
                    estYearEarn: utils.formatSocialBladeNumber(data.estYearEarn),
                    averageDailySubs: utils.formatSocialBladeNumber(data.averageDailySubs),
                    averageDailyViews: utils.formatSocialBladeNumber(data.averageDailyViews),
                    averageDailyEarn: utils.formatSocialBladeNumber(data.averageDailyEarn),
                    averageWeeklySubs: utils.formatSocialBladeNumber(data.averageWeeklySubs),
                    averageWeeklyViews: utils.formatSocialBladeNumber(data.averageWeeklyViews),
                    averageWeeklyEarn: utils.formatSocialBladeNumber(data.averageWeeklyEarn),
                    last30DaySubs: utils.formatSocialBladeNumber(data.last30DaySubs),
                    last30DayViews: utils.formatSocialBladeNumber(data.last30DayViews),
                    last30DayEarn: utils.formatSocialBladeNumber(data.last30DayEarn),
                }),
                config
            )

            // write scrapped data to a file.
            const output = config.channelsFilename + '.json'
            console.log('Writing to file: ', output)
            await utils.writeDataToFile(output, scrappedData)
        } catch (error) {
            console.log('internal error: ', error)
        } finally {
            console.log('Closing browser')
            // Close the browser
            await browser.close()
        }

        console.log('Done')
    } catch (error) {
        console.error('Error scraping:', error)
    }
})()
