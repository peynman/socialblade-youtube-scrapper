const puppeteer = require('puppeteer');
const utils = require('./utils');
const config = require('./config');

/**
 * Run scrapper
 */
(async () => {
    try {
        // Launch a browser instance
        const browser = await puppeteer.launch({
            args: config.chromiumArgs,
            executablePath: config.chromiumExePath,
            userDataDir: config.chromiumSessionDataDir,
            headless: config.runHeadless,
        });

        // read list of channels from channelsFilename file.
        const channelsList = await utils.readFileLines(config.channelsFilename);
        
        // remove duplicate urls
        const channelsDistNames = channelsList.filter((s, index) => index === channelsList.indexOf(s)).map(url => url.substring(config.channelsUrlBase.length))

        console.log('Found ' + channelsDistNames.length + ' distinct channel names.');

        // scrap data
        const scrappedData = await utils.runScrapBatches(
            browser, 
            channelsDistNames, 
            config.urlBase, 
            config.batchLimit, 
            config.newTabDelay, 
            config.newBatchDelay
        )

        // Close the browser
        await browser.close();

        // write scrapped data to a file.
        const output = config.channelsFilename + '.json';
        console.log('Writing to file: ', output);
        await utils.writeDataToFile(output, scrappedData, 'json')
        console.log('Done')

    } catch (error) {
        console.error('Error scraping:', error);
    }
})();
