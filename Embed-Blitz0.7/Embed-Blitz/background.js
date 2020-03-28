//prepare GET request with XMLHttpRequest
const xhr = new XMLHttpRequest();
const oEmbedURLTwitter = "https://publish.twitter.com/oembed?url=https%3A%2F%2Ftwitter.com%2FInterior%2Fstatus%2F";
const oEmbedURLInstagram = "https://api.instagram.com/oembed?url=";
const oEmbedURLYoutube = "https://www.youtube.com/oembed?url=";

//GET request
const makeRequest = requestURL => {
    xhr.open("GET", requestURL);
    xhr.onload = () => {
    let embedCode = JSON.parse(xhr.responseText);
    if (embedCode.provider_url === "https://www.youtube.com/") {
        embedCode.html = '<iframe width="100%"' + embedCode.html.slice(19);
        embedCode = embedCode.html;
        copyToClipboard(embedCode);
    } else {
        embedCode = embedCode.html;
        copyToClipboard(embedCode);
    }
    }
    xhr.send();
};

//copy to clipboard
const copyToClipboard = embedCode => {
    const textarea = document.getElementById("clipboard content");
    textarea.value = embedCode;
    textarea.select();
    document.execCommand("copy");
};

//execute if context menu item is clicked. Create endpoint URL
function clickHandler(info, tab) {
    if (info.menuItemId = getEmbedCode) {
        const postURL = info.linkUrl;
        if (postURL.startsWith("https://twitter.com/")) {
            const splitted = postURL.split("status/");
            const tweetID = splitted[splitted.length-1];
            const requestURL = oEmbedURLTwitter+tweetID;
            makeRequest(requestURL);
        } else if (postURL.startsWith("https://www.instagram.com/")) {
            const requestURL = oEmbedURLInstagram+postURL;
            makeRequest(requestURL);
        } else if (postURL.startsWith("https://www.youtube.com/")) {
            const requestURL = oEmbedURLYoutube+postURL;
            makeRequest(requestURL);
        } else {
            console.log("Oops. Something went wrong. Did you copy a Twitter, Instagram or Youtube link?")
        }
    }
};

//set up context menu
getEmbedCode = chrome.contextMenus.create(
    {"title": "Embed-Code kopieren",
    "contexts": ["link"],
    "onclick": clickHandler},
    function () {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message)
        }
    }
);