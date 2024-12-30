/**
 * Configure SocialBlade YouTube scrapper.
 */
module.exports = {
    // social blade base url.
    urlBase: 'https://socialblade.com/youtube/channel/',
    // channels base youtube url. used to extract channel name from url.
    channelsUrlBase: 'https://www.youtube.com/@',
    // list of channels in a filename.
    channelsFilename: './channels.txt',
    // number of tabs to open at same time.
    batchLimit: 6,
    // delay before a new batch starts.
    newBatchDelay: 1500,
    // delay before next tab opened.
    newTabDelay: 5000,
    // chromium settings
    chromiumArgs: [
        // use proxy for chromium
        '--proxy-server=127.0.0.1:1080'
    ],
    // sessions dir
    chromiumSessionDataDir: './session/',
    // executable path
    chromiumExePath: '/usr/bin/chromium',
    // heedless chromium, does not work without puppeteer-extra and its plugins
    runHeadless: true,
    // load when browsing images (disable for better performance)
    loadImages: false,
    
}
