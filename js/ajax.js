/*
    require ("ng");

    Requires:


    Array
    Array.prototype.indexOf

    console.warn

    Error

    Number.isNaN (ng module)
    Number.parseInt (ng module)

    Object.isBottom (ng module)

    Promise
    Promise.prototype.then

    String
    String.isString (ng module)
    String.prototype.format (ng module)
    String.prototype.toLowerCase
    String.prototype.toUpperCase
    String.prototype.trim

    TypeError

    window.isNaN
    window.parseInt

    XMLHttpRequest
    - onerror
    - onload
    - ontimeout
    - response
    - responseType
    - status
    - statusText
    - timeout
    XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.send
*/

(function (exported)
{
    "use strict";

    var acceptableHttpRequestMethods = [
        "DELETE",
        "GET",
        "POST",
        "PUT"
    ],

    acceptableHttpResponseTypes = [
        "",
        "arraybuffer",
        "blob",
        "document",
        "json",
        "text"
    ],

    defaultHttpRequestMethod = "GET",
    defaultHttpRequestTimeout = 10000, // 10 seconds
    defaultHttpResponseType = "", // default if not set according to MDN

    // Console messages use String.prototype.format to template in arguments to send to console
    messages = {
        configBottom : "config for ajax request is null or undefined",
        configOnProgressNotFunction : "config.onprogress must be a function",
        configURLInvalid : "config.url must be a valid URL\nNot: {0}",
        httpRequestFailure : "Request for {0} has failed returning status code {1}\n{2}",
        httpRequestMethodBottom : "HTTP request method is null or undefined",
        httpRequestMethodDefault : "Defaulting to {0} HTTP request method",
        httpRequestMethodUnacceptable : "{0} is not a valid HTTP request method\nPlease use one of the following standard HTTP request methods:\n{1}",
        httpRequestProgress : "XHR progress: {0}%",
        httpRequestSuccess : "Request for {0} was successful and return {1}",
        httpRequestTimedOut : "Request for {0} has timed out after {1} millisecond(s)",
        httpRequestTimeoutDefault : "Defaulting to {0} millisecond HTTP request timeout",
        httpRequestTimeoutMinimum : "{0} was provided but HTTP request timeout duration cannot be less than 0",
        httpRequestTimeoutNaN : "{0} is not a number and cannot be a millisecond timeout duration",
        httpRequestURLBottom : "Request URL is null or undefined",
        httpRequestURLInvalid : "{0} is not a valid URL\nRegular expression test failed",
        httpResponseTypeBottom : "Response type is null or undefined",
        httpResponseTypeDefault : "Defaulting to {0} HTTP response type",
        httpResponseTypeUnacceptable : "{0} is not a valid HTTP reponse type\nPlease use one of the following standard HTTP response types:\n{1}"
    };



    function validateHttpRequestMethod(method)
    {
        if (Object.isBottom(method))
        {
            ng.warn(messages.httpRequestMethodBottom);
            return false;
        }

        if (!String.isString(method))
        {
            method = method.toString.trim();
        }

        method = method.toUpperCase();

        if (acceptableHttpRequestMethods.indexOf(method) < 0)
        {
            ng.warn(messages.httpRequestMethodUnacceptable.format(method, acceptableHttpRequestMethods.join(", ")));
            return false;
        }

        return true;
    }

    function validateHttpRequestTimeout(milliseconds)
    {
        if (Number.isNaN(milliseconds))
        {
            ng.warn(messages.httpRequestTimeoutNaN.format(milliseconds));
            return false;
        }

        milliseconds = Number.parseInt(milliseconds, 10);

        if (milliseconds < 0)
        {
            ng.warn(messages.httpRequestTimeoutMinimum.format(milliseconds));
            return false;
        }

        return true;
    }

    function validateHttpRequestURL(url)
    {
        if (Object.isBottom(url))
        {
            ng.warn(messages.httpRequestURLBottom);
            return false;
        }

        if (!String.isString(url))
        {
            url = url.toString().trim();
        }

        if (/* url fails regex uri test */ false)
        {
            ng.warn(messages.httpRequestURLInvalid.format(url));
            return false;
        }

        return true;
    }

    function validateHttpResponseType(type)
    {
        if (Object.isBottom(type))
        {
            ng.warn(messages.httpResponseTypeBottom);
            return false;
        }

        if (!String.isString(type))
        {
            type = type.toString().trim();
        }

        type = type.toLowerCase();

        if (acceptableHttpResponseTypes.indexOf(type) < 0)
        {
            ng.warn(messages.httpResponseTypeUnacceptable.format(type, acceptableHttpResponseTypes.join(", ")));
            return false;
        }

        return true;
    }



    function validateOrDefaultHttpRequestMethod(method)
    {
        if (validateHttpRequestMethod(method))
        {
            return method.toString().trim().toUpperCase();
        }

        ng.log(messages.httpRequestMethodDefault.format(defaultHttpRequestMethod));
        return defaultHttpRequestMethod;
    }

    function validateOrDefaultHttpRequestTimeout(milliseconds)
    {
        if (validateHttpRequestTimeout(milliseconds))
        {
            return Number.parseInt(milliseconds, 10);
        }

        ng.log(message.httpRequestTimeoutDefault.format(defaultHttpRequestTimeout));
        return defaultHttpRequestTimeout;
    }

    function validateOrDefaultHttpResponseType(type)
    {
        if (validateHttpResponseType(type))
        {
            return type.toString().trim().toLowerCase();
        }

        ng.log(messages.httpResponseTypeDefault.format(defaultHttpResponseType));
        return defaultHttpResponseType;
    }

    function validateConfig(config)
    {
        if (Object.isBottom(config))
        {
            throw new TypeError(messages.configBottom);
        }

        if (!validateHttpRequestURL(config.url))
        {
            throw new TypeError(messages.configURLInvalid(config.url));
        }

        config.method = validateOrDefaultHttpRequestMethod(config.method);
        config.repsonseType = validateOrDefaultHttpResponseType(config.responseType);
        config.timeout = validateOrDefaultHttpRequestTimeout(config.timeout);

        if (Object.isObject(config.onprogress) && !Function.isFunction(config.onprogress))
        {
            ng.warn(messages.configOnProgressNotFunction);
            delete config.onprogress;
        }

        return config;
    }

    function ajax(config)
    {

        // Validate [config] object and various properties
        config = validateConfig(config);



        function executor(resolvePromise, rejectPromise)
        {
            var xhr = new XMLHttpRequest();



            function errorEvent(message)
            {
                message = String.isString(message) ? message : xhr.statusText;
                ng.warn(message);
                rejectPromise(message);
            }

            function loadEvent()
            {
                if (Number.parseInt(xhr.status, 10) === 200)
                {
                    resolvePromise(xhr.response);
                }
                else
                {
                    errorEvent(messages.httpRequestFailure.format(config.url, xhr.status, xhr.statusText));
                }
            }

            function progressEvent(event)
            {
                var progress;

                if (event.lengthComputable)
                {
                    progress = event.loaded / event.total * 100;
                    ng.log(messages.httpRequestProgress.format(progress.toFixed(2)));

                    if (Function.isFunction(config.onprogress))
                    {
                        config.onprogress.call(xhr, event);
                    }
                }
            }

            function successEvent()
            {
                if (window.parseInt(xhr.status, 10) === 200)
                {
                    resolvePromise(xhr.response);
                }

                else
                {
                    rejectPromise(xhr.statusText);
                }
            }

            function timeoutEvent()
            {
                errorEvent(messages.httpRequestTimedOut.format(config.url, config.timeout));
            }



            xhr.onload = loadEvent;
            xhr.onerror = errorEvent;
            xhr.onprogress = progressEvent;
            xhr.ontimeout - timeoutEvent;
            xhr.open(config.method, config.url, true); // ALWAYS ASYNCHRONOUS!
            xhr.timeout = config.timeout;
            xhr.responseType = config.responseType;
            xhr.send();
        }



        return new Promise(executor);
    }



    Object.defineProperties(ajax, {

        "defaultHttpRequestMethod" : {
            "enumerable" : true,
            "get" : function () { return defaultHttpRequestMethod; },
            "set" : function (value) {
                if (validateHttpRequestMethod(value))
                {
                    defaultHttpRequestMethod = value.toString().trim().toUpperCase();
                }
                else
                {
                    ng.warn(messages.httpRequestMethodUnacceptable.format(value, acceptableHttpRequestMethods.join(", ")));
                }
            }
        },

        "defaultHttpRequestTimeout" : {
            "enumerable" : true,
            "get" : function () { return defaultHttpRequestTimeout; },
            "set" : function (value) {
                if (validateHttpRequestTimeout(value))
                {
                    defaultHttpRequestTimeout = Number.parseInt(value, 10);
                }
                else
                {
                    ng.warn(messages.httpRequestTimeoutMinimum.format(value));
                }
            }
        },

        "defaultHttpResponseType" : {
            "enumerable" : true,
            "get" : function () { return defaultHttpResponseType; },
            "set" : function (value) {
                if (validateHttpResponseType(value))
                {
                    defaultHttpResponseType = type.toString().trim().toLowerCase();
                }
                else
                {
                    ng.warn(messages.httpResponseTypeUnacceptable.format(value, acceptableHttpResponseTypes.join(", ")));
                }
            }
        }
    });



    exported.ajax = ajax;
}(ng));
