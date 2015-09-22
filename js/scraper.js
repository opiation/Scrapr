/*
    Requires
    ng.js
    ajax.js
    Pather.js
*/

var Scrapr = (function (exported) {
    "use strict";

    function scrape(config, xpath)
    {
        config = !String.isString(config) ? url : {
            "method" : "GET",
            "responseType" : "document",
            "timeout" : 10000,
            "url" : config
        };

        function executor(resolve, reject)
        {
            function resolver(doc)
            {
                resolve(ng.resolveXPath(doc, doc, xpath));
            }

            ng.ajax(config).then(resolver, reject);
        }

        return new Promise(executor);
    }



    exported.scrape = scrape;

    return exported;
}(Object.create(null)));



var req = {
    "url" : "http://stackoverflow.com/questions/tagged/google-app-engine",
    "method" : "GET",
    "timeout" : 5000,
    "responseType" : "document"
};

var url = "https://stackoverflow.com/questions/tagged/google-app-engine";

/*var path = {
    "_parent" : "//div[contains(@id,'questions')]/div[contains(@class,'question-summary')]",
    "id" : "string(@id)",
    "answers" : "number(div[contains(@class,'status')]//strong/text())",
    "votes" : "number(div[contains(@class,'votes')]//strong/text())",
    "question" : "string(div[contains(@class,'summary')]/h3/a/text())",
    "tags" : {
        "_parent" : "div[contains(@class,'summary')]/div[contains(@class,'tags')]/a",
        "_value" : "string(text())"
    }
};*/

var path = "//head/title[1]/text()";


Scrapr.scrape(url, path).then(ng.log);
