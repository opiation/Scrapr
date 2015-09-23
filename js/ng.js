var ng = (function (exported) {
    "use strict";


    /*
        The ng module provides the following:

        - A thin wrapper for console functions including error, log and warn
        - Type-checking monoid static methods for array, boolean, Date, function, number, object, string types
            These are functions cautiously bound to Array, Boolean, Date, Function, Number, Object, String objects
            They are only bound if said object does not already have this function. They are conditional shims
        - Non-global versions of previously global functions
            decodeURIComponent
            encodeURIComponent
            isFinite
            isNaN
            parseFloat
            parseInt
        - String.prototype.format method for all strings essentially like sprintf
            THIS MODIFIES THE String.prototype
            Remove if it's causing problems

    */



    var debugging = true,
        messagesNotDisplayed = [];



    function flushMessagesToConsole(messages)
    {
        messages.sort(messageTimeSort);
        messages.forEach(function (message) {
            console[message.type](message.text);
        });
    }

    function messageTimeSort(a, b)
    {
        if (a.time < b.time) return -1;
        else if (a.time > b.time) return 1;
        return 0;
    }



    exported.disableDebugging = function ()
    {
        debugging = false;
    };

    exported.error = function (message)
    {
        if (debugging) return console.error.apply(console, arguments);

        messagesNotDisplayed.push({
            "time" : Date.now(),
            "type" : "error",
            "text" : message
        });
    };

    exported.enableDebugging = function ()
    {
        if (!debugging)
        {
            debugging = true;
            if (messagesNotDisplayed.length > 0)
            {
                flushMessagesToConsole(messagesNotDisplayed);
                messagesNotDisplayed = [];
            }
        };

        return exported;
    };

    exported.isDebuggingEnabled = function ()
    {
        return debugging;
    };

    exported.log = function (message)
    {
        if (debugging) return console.log.apply(console, arguments);

        messagesNotDisplayed.push({
            "time" : Date.now(),
            "type" : "log",
            "text" : message
        });
    };

    exported.warn = function (message)
    {
        if (debugging) return console.warn.apply(console, arguments);

        messagesNotDisplayed.push({
            "time" : Date.now(),
            "type" : "warn",
            "text" : message
        });
    };



    // Array augmentation
    Array.isArray = Array.isArray || function isArrayStatic(value)
    {
        return Object.prototype.toString.call(value) === "[object Array]";
    };



    // Boolean augmentation
    Boolean.isBoolean = Boolean.isBoolean || function isBooleanStatic(value)
    {
        return value === true || value === false;
    };



    // Date augmentation
    Date.isDate = Date.isDate || function isDateStatic(value)
    {
        return value instanceof Date;
    };



    // Function augmentation
    Function.blank = Function.blank || function () {};

    Function.isFunction = Function.isFunction || function isFunctionStatic(value)
    {
        return typeof value === "function";
    };



    // Number augmentation
    Number.isFinite = Number.isFinite || function isFiniteStatic(value)
    {
        return Number.isNumber(value) && isFinite(value);
    };

    Number.isNaN = Number.isNaN || function isNaNStatic(value)
    {
        return typeof value === "number" && isNaN(value);
    };

    Number.isNumber = Number.isNumber || function isNumberStatic(value)
    {
        return typeof value === "number";
    };

    Number.parseFloat = Number.parseFloat || parseFloat;

    Number.parseInt = Number.parseInt || parseInt;



    // Object augmentation
    Object.isBottom = Object.isBottom || function isBottomStatic(value)
    {
        return value === undefined || value === null;
    };

    Object.isObject = Object.isObject || function isObjectStatic(value)
    {
        return value !== undefined && value !== null;
    };



    // String augmentation
    String.decodeURIComponent = String.decodeURIComponent || decodeURIComponent;

    String.encodeURIComponent = String.encodeURIComponent || encodeURIComponent;

    String.isString = String.isString || function isStringStatic(value)
    {
        return typeof value === "string";
    };

    String.prototype.format = String.prototype.format || function formatPrototype()
    {
        var args = arguments;

        if (arguments.length < 1)
        {
            return this;
        }

        function replacer(match, number)
        {
            return Object.isBottom(args[number]) ? match : args[number];
        }

        return this.replace(/{(\d+)}/g, replacer);
    };



    return exported;
}(Object.create(null)));
