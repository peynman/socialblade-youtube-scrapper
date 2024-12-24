/**
 * Configure SocialBlade YouTube scrapper.
 */
module.exports = {
    // social blade base url.
    urlBase: 'https://socialblade.com/youtube/channel/',
    // channels base youtube url. used to extract channel name from url.
    channelsUrlBase: 'https://www.youtube.com/@',
    // list of channels in a filename.
    channelsFilename: './channels5.txt',
    // number of tabs to open at same time.
    batchLimit: 4,
    // delay before a new batch starts.
    newBatchDelay: 1000,
    // delay before next tab opened.
    newTabDelay: 1000,
    // chromium settings
    chromiumArgs: [
        // use proxy for chromium
        '--proxy-server=127.0.0.1:1080'
    ],
    // sessions dir
    chromiumSessionDataDir: './session/',
    // executable path
    chromiumExePath: '/usr/bin/chromium',
    // heedless chromium
    runHeadless: false,
}
