var ng = (function (exported) {
    "use strict";



    exported.debug = true;


    
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
    
    
    
    if (exported.debug && Object.isObject(console))
    {
        exported.error = console.error.bind(console);
        exported.log = console.log.bind(console);
        exported.warn = console.warn.bind(console);
    }
    else
    {
        exported.error = exported.log = exported.warn = Function.blank;
    }
    
    
    
    return exported;
}(ng || Object.create(null)));