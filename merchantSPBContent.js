'use strict';

(function () {
    // The generator function that interacts with the Chrome extension
    async function run() {
        const iframeUrl = await getIframeUrl();

        // Create the script element and append it to the page
        const scriptElement = document.createElement('script');
        scriptElement.src = window.chrome.runtime.getURL('/checkoutPaypal/merchantSPBResponders.js');
        scriptElement.setAttribute('data-iframeurl', iframeUrl);
        (document.head || document.documentElement).appendChild(scriptElement);
    }

    // Function to get the iframe URL
    async function getIframeUrl() {
        const response = await sendMessage('checkout:action:background', {
            action: 'checkoutGetSetting',
            data: { checkoutSettingKey: 'iFrameOriginUrl' }
        });
        return response;
    }

    // Send a message to the background and return the response
    function sendMessage(type, data) {
        return new Promise((resolve, reject) => {
            const request = {
                content: JSON.stringify(data),
                dest: undefined,
                service: 'messages:cs',
                type: type
            };

            window.chrome.runtime.sendMessage(request, (response) => {
                if (window.chrome.runtime.lastError) {
                    reject(new Error(`Chrome messaging error: ${window.chrome.runtime.lastError.message}`));
                } else if (!response || response.noListeners) {
                    reject(new Error(`No listeners for message of type ${type}`));
                } else if (response.success) {
                    resolve(response.data);
                } else {
                    const error = new Error(response.error && response.error.message);
                    error.data = response.error && response.error.data;
                    error.stack += response.error && response.error.stack;
                    reject(error);
                }
            });
        });
    }

    // Run the script
    run();
})();
