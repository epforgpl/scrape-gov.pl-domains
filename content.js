var parser = document.createElement("a");
chrome.storage.local.get('domains', processDomains);

function parseQuery(qstr) {
    var query = {};
    var a = (qstr[0] === '?' ? qstr.substr(1) : qstr).split('&');
    for (var i = 0; i < a.length; i++) {
        var b = a[i].split('=');
        query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
    }
    return query;
}

function processDomains(items) {
    var domains = items.domains || {};

    // get currently searched domain and mark it as done
    var query = parseQuery(window.location.search);
    if (query && query['q']) {
        var site = query['q'].split(':');
        if (site.length == 2 && domains[site[1]]) {
            domains[site[1]] = 2;
        }
    }

    $.map($('h3.r a'), function(el) {
      parser.href = el.href
      if (parser.hostname.endsWith(".gov.pl")) {
        if (parser.hostname.startsWith("www.")) {
 	   domains[parser.hostname] = domains[parser.hostname] || 3;
	   var stripped = parser.hostname.substring(4);
 	   domains[stripped] = domains[stripped] || 1;
	} else {
           domains[parser.hostname] = domains[parser.hostname] || 1;
        }
      }
    });
    var domains_count = Object.keys(domains).length;

    chrome.storage.local.set({'domains': domains}, function(){
        chrome.runtime.sendMessage({domains_count: domains_count});
    });
}
