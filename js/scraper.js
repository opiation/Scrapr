/*
    require("ng");
    require("ajax");
    require("Pather.js");
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



var currentPageURL = window.location.href;
var xpathExpression = "(//head/title)[1]";

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


Scrapr.scrape(currentPageURL, xpathExpression).then(function (titleNodes) { ng.log(titleNodes[0]); });
