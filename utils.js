const fs = require('fs').promises
const path = require('path')

/**
 * Reads a text file and extracts each line into a list.
 * 
 * @param {string} filePath - The path to the text file.
 * @returns {Promise<string[]>} - A promise that resolves to a list of lines.
 */
async function readFileLines(filePath) {
    try {
        // Read the file content
        const fileContent = await fs.readFile(filePath, 'utf-8')

        // Split content into lines
        const lines = fileContent.split(/\r?\n/)

        return lines
    } catch (error) {
        console.error(`Error reading file: ${error.message}`)
        throw error // Rethrow to handle it in the caller function
    }
}

/**
 * Writes data to a file as JSON or CSV.
 * 
 * @param {string} filePath - The file path to save the data.
 * @param {Object[]} data - The data to write, as an array of objects.
 * @returns {Promise<void>}
 */
async function writeDataToFile(filePath, data) {
    const output = JSON.stringify(data, null, 2)
    // Write the output to the specified file
    await fs.writeFile(path.resolve(filePath), output, 'utf8', (err) => {
        if (err) {
            throw err
        }
    })
}

/**
 * scrap data from a channel
 * 
 * @param {any} browser puppeteer browser.
 * @param {string} url social blade url to open.
 * @param {String} name youtube channel name.
 * @param {ConfigOptions} config config object.
 * @returns {Promise<ScrappedData>} scrapped page data.
 * @throws {Error}
 */
async function scrapYouTubeUsername(browser, url, name, config) {
    const pageData = {}
    const page = await browser.newPage()

    try {
        if (!config.loadImages) {
            await page.setRequestInterception(true)
            page.on('request', request => {
                if (request.resourceType() === 'image') {
                    request.abort()
                } else {
                    request.continue()
                }
            })
        }
    
        try {
            console.log(url)
            // go to social blade url
            await page.goto(url, {
                waitForSelector: 'div#socialblade-user-content',
                timeout: 60000,
            })
        } catch (error) {
            console.warn('error loading page ' + name, error)
            return false
        }

        try {
            // click accept, if notice popup window is opened
            const hasNotice = await page.$('div#sp_message_container_919751')
            if (hasNotice) {
                console.log(' > has notice')
                const elementHandle = await page.waitForSelector("div#sp_message_container_919751 iframe")
                const frame = await elementHandle.contentFrame()
                await frame.waitForSelector('button')
                const acc = await frame.$('button[title=Accept]')
                if (acc) {
                    await acc.click()
                    await delay(2000)
                }
            }
        } catch (error) { console.warn('scrap internal err: ' + name, error) }
        
        // extract user details
        try { pageData.youtuberName = await page.$eval('div#YouTubeUserTopInfoBlockTop h1', (element) => element.textContent.trim()) } catch (error) { console.warn('scrap internal err: ' + name, error) }
        try { pageData.channelName = await page.$eval('div#YouTubeUserTopInfoBlockTop h4', (element) => element.textContent.trim()) } catch (error) { console.warn('scrap internal err: ' + name, error) }
        try { pageData.uploads = await page.$eval('span#youtube-stats-header-uploads', (element) => element.textContent.trim()) } catch (error) { console.warn('scrap internal err: ' + name, error) }
        try { pageData.subs = await page.$eval('span#youtube-stats-header-subs', (element) => element.textContent.trim()) } catch (error) { console.warn('scrap internal err: ' + name, error) }
        try { pageData.subs = await page.$eval('span#youtube-stats-header-subs', (element) => element.textContent.trim()) } catch (error) { console.warn('scrap internal err: ' + name, error) }
        try { pageData.views = await page.$eval('span#youtube-stats-header-views', (element) => element.textContent.trim()) } catch (error) { console.warn('scrap internal err: ' + name, error) }
        try { pageData.country = await page.$eval('span#youtube-stats-header-country', (element) => element.textContent.trim()) } catch (error) { console.warn('scrap internal err: ' + name, error) }
        try { pageData.channelType = await page.$eval('span#youtube-stats-header-channeltype', (element) => element.textContent.trim()) } catch (error) { console.warn('scrap internal err: ' + name, error) }
        try { pageData.dateCreated = await page.$$eval('div.YouTubeUserTopInfo span', (elements) => elements[elements.length - 1].textContent.trim()) } catch (error) { console.warn('scrap internal err: ' + name, error) }
        try { pageData.grade = await page.$eval('div#socialblade-user-content div div div', (element) => element.textContent.trim()) } catch (error) { console.warn('scrap internal err: ' + name, error) }

        try { pageData.estMonEarn = await page.$eval('div#socialblade-user-content > div:nth-child(3) > div:nth-child(2) > p:nth-child(1)', (element) => element.textContent.trim()) } catch (error) { console.warn('scrap internal err: ' + name, error) }
        try { pageData.estYearEarn = await page.$eval('div#socialblade-user-content > div:nth-child(5) > div:nth-child(1) > div:nth-child(2) > p:nth-child(1)', (element) => element.textContent.trim()) } catch (error) { console.warn('scrap internal err: ' + name, error) }

        try { pageData.averageDailySubs = await page.$eval('div#averagedailysubs', (element) => element.textContent.trim()) } catch (error) { console.warn('scrap internal err: ' + name, error) }
        try { pageData.averageDailyViews = await page.$eval('div#averagedailyviews', (element) => element.textContent.trim()) } catch (error) { console.warn('scrap internal err: ' + name, error) }
        try { pageData.averageDailyEarn = await page.$eval('div#socialblade-user-content > div:nth-child(21) > div:nth-child(4)', (element) => element.textContent.trim()) } catch (error) { console.warn('scrap internal err: ' + name, error) }

        try { pageData.averageWeeklySubs = await page.$eval('div#socialblade-user-content > div:nth-child(22) > div:nth-child(2) > span:nth-child(1)', (element) => element.textContent.trim()) } catch (error) { console.warn('scrap internal err: ' + name, error) }
        try { pageData.averageWeeklyViews = await page.$eval('div#socialblade-user-content > div:nth-child(22) > div:nth-child(3) > span:nth-child(1)', (element) => element.textContent.trim()) } catch (error) { console.warn('scrap internal err: ' + name, error) }
        try { pageData.averageWeeklyEarn = await page.$eval('div#socialblade-user-content > div:nth-child(22) > div:nth-child(4)', (element) => element.textContent.trim()) } catch (error) { console.warn('scrap internal err: ' + name, error) }

        try { pageData.last30DaySubs = await page.$eval('div#socialblade-user-content > div:nth-child(23) > div:nth-child(2) > span:nth-child(1)', (element) => element.textContent.trim()) } catch (error) { console.warn('scrap internal err: ' + name, error) }
        try { pageData.last30DayViews = await page.$eval('div#socialblade-user-content > div:nth-child(23) > div:nth-child(3) > span:nth-child(1)', (element) => element.textContent.trim()) } catch (error) { console.warn('scrap internal err: ' + name, error) }
        try { pageData.last30DayEarn = await page.$eval('div#socialblade-user-content > div:nth-child(23) > div:nth-child(4)', (element) => element.textContent.trim()) } catch (error) { console.warn('scrap internal err: ' + name, error) }

        try { pageData.headerBackground = await page.$eval('div#YouTubeUserTopHeaderBackground', (element) => window.getComputedStyle(element).backgroundImage.match(/url\("(.*)"/)[1]) } catch (error) { console.warn('scrap internal err: ' + name, error) }
        try { pageData.avatar = await page.$eval('img#YouTubeUserTopInfoAvatar', (element) => element.getAttribute('src')) } catch (error) { console.warn('scrap internal err: ' + name, error) }

        try {
            // navigate to user videos
            await page.$eval('div#YouTubeUserMenu > a:nth-child(6)', (element) => element.click())
            await page.waitForSelector('div.RowRecentTable')

            const recentVideosElements = await page.$$('div.RowRecentTable')
            pageData.recentVideos = []

            // extract recent videos
            for (let el of recentVideosElements) {
                const videoStat = await el.$$eval('div.TableMonthlyStats', (columns) => columns.map((column) => column.textContent.trim()))
                const videoLink = await el.$eval('div.TableMonthlyStats a', (column) => column.getAttribute('href'))
                pageData.recentVideos.push([...videoStat, videoLink])
            }

            // navigate to most watched videos
            await page.$eval('#InPageMenuWrap > a:nth-child(2)', (element) => element.click())
            await delay(1000)
            await page.waitForSelector('div.RowRecentTable')

            // extract most watched videos
            const watchedVideosElements = await page.$$('div.RowRecentTable')
            pageData.mostViewedVideos = []

            for (let el of watchedVideosElements) {
                const videoStat = await el.$$eval('div.TableMonthlyStats', (columns) => columns.map((column) => column.textContent.trim()))
                const videoLink = await el.$eval('div.TableMonthlyStats a', (column) => column.getAttribute('href'))
                pageData.mostViewedVideos.push([...videoStat, videoLink])
            }
        } catch (error) { console.warn('scrap internal err: ' + name, error) }
    } catch (error) {
        console.error('Could not scrap for ', name, error)
    } finally {
        await page.close()
    }

    return pageData
}

/**
 * Run scrap on each channel name in batches of batchLimit tabs.
 * 
 * @param {any} browser puppeteer browser.
 * @param {string[]} channelsDistNames distinct name of youtube channels.
 * @param {Function} formatter callback function that all objects all passed.
 * @param {ConfigOptions} config config object.
 * @returns {ScrappedData[]} scrapped data for all channel names.
 */
async function runScrapBatches(browser, channelsDistNames, formatter, config) {
    const scrappedData = []

    const batchesCount = Math.floor(channelsDistNames.length / config.batchLimit) + 1

    for (var i = 0; i < batchesCount; i++) {
        const batchPromises = []
        console.log('Scrapping batch ', i, ' of ', batchesCount)

        for (var j = 0; j < config.batchLimit; j++) {
            const itemIndex = i * config.batchLimit + j
            if (itemIndex < channelsDistNames.length) {
                if (config.newTabDelay > 0 & j > 0) {
                    await delay(config.newTabDelay)
                }

                const channelName = channelsDistNames[itemIndex]

                console.log('Scrapping batch ' + i + ' item at index', itemIndex, channelName)
                try {
                    batchPromises.push(scrapYouTubeUsername(browser, config.urlBase + channelName, channelName, config))
                } catch (error) {
                    console.log('Error scrapping ', channelName, error)
                }
            }
        }
        const batchResponses = await Promise.all(batchPromises).then(responses => formatter ? responses.map(v => formatter(v)) : responses)
        scrappedData.push(...batchResponses)
        console.log('Done batch ', i, ' of ', batchesCount)

        if (config.newBatchDelay > 0) {
            await delay(config.newBatchDelay)
        }
    }

    return scrappedData
}

/**
 * Format SocialBlade single number,
 * 
 * @param {string} number SocialBlade single number to format.
 * @returns {{number, unit}} formatted number
 */
function formatSocialBladeNumber(number) {
    if (typeof number !== 'string') {
        return number
    }

    if (number.includes('-') && !number.trim().startsWith('-')) {
        const parts = number.split('-')
        return [formatSocialBladeNumber(parts[0]), formatSocialBladeNumber(parts[1])]
    }

    const trimmed = number.trim().replaceAll(/ /gi, '').toLocaleLowerCase()

    let multiplier = 1
    let numberEndIndex = trimmed.length
    if (trimmed.endsWith('m')) {
        multiplier = 1000000
        numberEndIndex = trimmed.length - 1
    } else if (trimmed.endsWith('k')) {
        multiplier = 1000
        numberEndIndex = trimmed.length - 1
    } else if (trimmed.endsWith('b')) {
        multiplier = 1000000000
        numberEndIndex = trimmed.length - 1
    }

    let numberStartIndex = 0
    let unit = ''
    if (isNaN(trimmed.substring(0, 1))) {
        unit = trimmed.substring(0, 1)
        if (unit === '+') {
            unit = ''
        } else if (unit === '-') {
            unit = ''
            multiplier = multiplier * -1
        }
        numberStartIndex = 1
    }

    const trimmedNumber = trimmed.substring(numberStartIndex, numberEndIndex).replaceAll(/,/gi, '')

    if (isNaN(trimmedNumber)) {
        if (trimmed === '--') {
            return 0
        }

        console.log('Error formatting: ', trimmedNumber, '>>', trimmed, '>>', number)
        return number
    }

    return parseFloat(trimmedNumber) * multiplier
}

/**
 * Delay current thead.
 * 
 * @param {*} time 
 * @returns 
 */
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    })
}

module.exports = {
    readFileLines,
    writeDataToFile,
    scrapYouTubeUsername,
    runScrapBatches,
    formatSocialBladeNumber,

    delay,
}