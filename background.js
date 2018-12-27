chrome.storage.local.get('domains', function(items) {
        var domains = items.domains || {};
        chrome.browserAction.setBadgeText({text: '' + Object.keys(domains).length});
    });

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    if( message.domains_count  ) {
        chrome.browserAction.setBadgeText({text: '' + message.domains_count});
    }
  }
);

// left click
chrome.browserAction.onClicked.addListener(function(tab) {
    console.log(tab);
    chrome.storage.local.get('domains', function(items) {
        var domains = items.domains || {};
        for(domain in domains) {
            if (domains[domain] == 1 && !domain.endsWith('.lasy.gov.pl') && !domain.endsWith('.praca.gov.pl') && !domain.endsWith('.ssdip.bip.gov.pl')) {
                chrome.tabs.create({'url': 'https://www.google.pl/search?q=site:' + domain, 'selected': true});
                break;
            }
        }
    });
});

// right click - context menu
var print_domains = function(){
    chrome.storage.local.get('domains', function(items) {
        var domains = items.domains || {};
        var domains_csv = "";
        for(domain in domains) {
            domains_csv = domains_csv + domain + ',' + domains[domain] + "\n";
        }
        console.log(domains_csv);
    });
};
var show_statistics = function() {
    chrome.storage.local.get('domains', function(items) {
        var domains = items.domains || {};
        var stats = {}
        for (domain in domains) {
            stats[domains[domain]] = (stats[domains[domain]] || 0) + 1;
        }
        console.log(stats);
    });
};
function processDomains(func){
    chrome.storage.local.get('domains', function(items) {	
	var domains = items.domains || {};

	domains = func(domains);

        chrome.storage.local.set({'domains': domains}, function(){
            console.log('Done!');
        });
    });	
};
function load_csv(text, clear) {
    chrome.storage.local.get('domains', function(items) {
        var rows = text.split("\n");
        var domains = {};
	if (!clear)
		domains = items.domains;

        rows.forEach(function(row) {
            cols = row.split(",");
            domains[cols[0]] = parseInt(cols[1]);
        });

        chrome.storage.local.set({'domains': domains}, function(){
            console.log('Done!');
        });
    });
};

chrome.contextMenus.create({
 title: "Output all domains",
 contexts:["browser_action"],
 onclick: print_domains
});
chrome.contextMenus.create({
 title: "Show statistics",
 contexts:["browser_action"],
 onclick: show_statistics
});
