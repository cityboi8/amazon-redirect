// ==UserScript==
// @name         Amazon.com Redirect
// @namespace    https://greasyfork.org/en/users/1581940-cityboi8
// @version      2.0.1
// @description  Redirects Amazon.com to your local country site automatically
// @author       CityBoi8
// @match        *://*.amazon.*/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const currentUrl = window.location.href;

    const countryMap = {
        "en-ca": "amazon.ca",
        "en-us": "amazon.com",
        "en-gb": "amazon.co.uk",
        "en-za": "amazon.co.za",
        "de-de": "amazon.de",
        "fr-fr": "amazon.fr",
        "it-it": "amazon.it",
        "es-es": "amazon.es",
        "ja-jp": "amazon.co.jp",
        "en-au": "amazon.com.au",
        "en-in": "amazon.in",
        "pt-br": "amazon.com.br",
        "nl-nl": "amazon.nl",
        "sv-se": "amazon.se",
        "pl-pl": "amazon.pl",
        "tr-tr": "amazon.com.tr",
        "ar-ae": "amazon.ae",
        "ar-sa": "amazon.sa",
        "sg": "amazon.sg"
    };

    // Detect user locale
    const userLocale = navigator.language.toLowerCase();

    const forcedDomain = null;
    let targetDomain;

    if (forcedDomain) {
        targetDomain = forcedDomain;
    } else {
        targetDomain = countryMap[userLocale];

        if (!targetDomain) {
            const lang = userLocale.split("-")[0];
            targetDomain = Object.entries(countryMap).find(([key]) =>
                key.startsWith(lang)
            )?.[1];
        }

        if (!targetDomain) {
            targetDomain = "amazon.com";
        }
    }

    // Extract current domain
    const domainMatch = currentUrl.match(/amazon\.[a-z.]+/);
    if (!domainMatch) return;

    const currentDomain = domainMatch[0];

    if (currentDomain === targetDomain) return;

    const newUrl = currentUrl.replace(currentDomain, targetDomain);
    window.location.replace(newUrl);
    return;

    // Auto-click "Continue shopping" button if it appears
    function autoClickContinue() {
        const btn = [...document.querySelectorAll("button, input")]
            .find(el => {
                const text = (el.value || el.innerText || "").toLowerCase();
                return text.includes("continue") && text.includes("shopping");
            });

        if (btn) {
            btn.click();
            console.log("✅ Clicked Continue Shopping");
            return true;
        }
        return false;
    }

    let attempts = 0;
    const interval = setInterval(() => {
        if (autoClickContinue() || attempts > 20) {
            clearInterval(interval);
        }
        attempts++;
    }, 500);

})();
