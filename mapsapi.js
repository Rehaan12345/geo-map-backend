import { ApifyClient } from 'apify-client';

// const dotenv = require('dotenv');
// dotenv.config();

// Initialize the ApifyClient with your Apify API token
// Replace the '<YOUR_API_TOKEN>' with your token
const client = new ApifyClient({
    token: "apify_api_XLuXGbXDaLTQ2wMrbOje5DSnfshRBt1dr6pN",
});

// Prepare Actor input
// const input = {
//     "searchStringsArray": [
//         "tech companies"
//     ],
//     "locationQuery": "New York, USA",
//     "maxCrawledPlacesPerSearch": 50,
//     "language": "en"
// };

export async function runMap(input) {
    // Run the Actor and wait for it to finish
    const run = await client.actor("compass/google-maps-extractor").call(input);

    // Fetch and print Actor results from the run's dataset (if any)
    console.log('Results from dataset');
    console.log(`💾 Check your data here: https://console.apify.com/storage/datasets/${run.defaultDatasetId}`);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    items.forEach((item) => {
        console.dir(item);
    });
    return items;
}

// 📚 Want to learn more 📖? Go to → https://docs.apify.com/api/client/js/docs

export async function crawlWebsite(url) {

    // Prepare Actor input
    const input = {
        "startUrls": [
            {
                "url": url
            }
        ],
        "useSitemaps": false,
        "respectRobotsTxtFile": true,
        "crawlerType": "playwright:adaptive",
        "includeUrlGlobs": [],
        "excludeUrlGlobs": [],
        "initialCookies": [],
        "proxyConfiguration": {
            "useApifyProxy": true
        },
        "keepElementsCssSelector": "",
        "removeElementsCssSelector": `nav, footer, script, style, noscript, svg, img[src^='data:'],
            [role="alert"],
            [role="banner"],
            [role="dialog"],
            [role="alertdialog"],
            [role="region"][aria-label*="skip" i],
            [aria-modal="true"]`,
        "clickElementsCssSelector": "[aria-expanded=\"false\"]"
    };

    // Run the Actor and wait for it to finish
    const run = await client.actor("apify/website-content-crawler").call(input);

    // Fetch and print Actor results from the run's dataset (if any)
    // console.log('Results from dataset');
    // console.log(`💾 Check your data here: https://console.apify.com/storage/datasets/${run.defaultDatasetId}`);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    // items.forEach((item) => {
    //     console.dir(item);
    // });
    return items;
}
