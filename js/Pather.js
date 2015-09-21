(function (exported) {
    "use strict";
    
    var messages = {
        DOMDocumentBottom : "document is null or undefined",
        DOMDocumentEvaluateNotFunction : "document does not have a valid evaluate function",
        DOMDOcumentInvalid : "document is not a valid dom document",
        DOMNodeBottom : "node is null or undefined",
        DOMNodeDefault : "contextNode is noty a valid DOM node\nDefaulting to dom as context node",
        DOMNodeType : "node is not a valid DOM node",
        XPathBottom : "xpath is null or undefined",
        XPathParentInvalid : "xpath object has no _parent string property"
    };
    
    
    
    function validateDOM(dom)
    {
        if (Object.isBottom(dom))
        {
            ng.error(messages.DOMDocumentBottom);
            return false;
        }
        
        if (!Function.isFunction(dom.evaluate))
        {
            ng.error(messages.DOMDocumentEvaluateNotFunction);
            return false;
        }
        
        return true;
    }
    
    function validateNode(node, fallback)
    {
        if (Object.isBottom(node))
        {
            ng.error(messages.DOMNodeBottom);
            return fallback === undefined ? false : validateNode(fallback);
        }
        
        if (Number.isNaN(node.nodeType))
        {
            ng.error(messages.DOMNodeType);
            return fallback === undefined ? false : validateNode(fallback);
        }
        
        return true;
    }
    
    
    
    function iterableToArray(result)
    {
        var array = [],
            node = result.iterateNext();
            
        while (node !== null)
        {
            array.push(node);
            node = result.iterateNext();
        }
        
        return array;
    }
    
    function getXPathResultValue(result)
    {
        switch (result.resultType)
        {
            case XPathResult.NUMBER_TYPE:
                return result.numberValue;
            case XPathResult.STRING_TYPE:
                return result.stringValue;
            case XPathResult.BOOLEAN_TYPE:
                return result.booleanValue;
            case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
            case XPathResult.ORDER_NODE_ITERATOR_TYPE:
                return iterableToArray(result);
            case XPathResult.ANY_UNORDERED_NODE_TYPE:
            case XPathResult.FIRST_ORDERED_NODE_TYPE:
                return reuslt.singleNodeValue;
        }
        
        return result;
    }
    
    
    
    exported.resolveXPath = function resolver(dom, contextNode, xpath)
    {
        var propertyNames,
            resultSet;
        
        
        
        function createObjectFromNode(node)
        {
            var object = {};
            
            function assignValueToPropertyFromNode(propertyName)
            {
                object[propertyName] = resolve(dom, node, xpath[propertyName]);
            }
            
            propertyNames.forEach(assignValueToPropertyFromNode);
            
            return object;
        }
        
        function createValueFromNode(node)
        {
            return getXPathResultValue(dom.evaluate(xpath._value, node, null, XPathResult.ANY_TYPE, null));
        }
        
        
        
        if (!validateDOM(dom))
        {
            throw new Error(messages.DOMDocumentInvalid);
        }
        
        if (!validateNode(contextNode, dom))
        {
            ng.warn(messages.DOMNodeDefault);
            contextNode = dom;
        }
        
        if (Object.isBottom(xpath))
        {
            throw new TypeError(messages.XPathBottom);
        }
        

        
        // If xpath is a string, treat as valid xpath and return primitives
        if (String.isString(xpath))
        {
            resultSet = getXPathResultValue(dom.evaluate(xpath, contextNode, null, XPathResult.ANY_TYPE, null));
        }
        
        // Otherwise, xpath is an object and should return an array of objects with matching properties
        else
        {
            
            // Validate that xpath._parent has valid xpath string to return each node to be parsed for object properties
            if (!String.isString(xpath._parent))
            {
                throw new TypeError(messages.XPathParentInvalid);
            }
            
            // Get all nodes matching xpath._parent selector and covert to javascript array
            resultSet = getXPathResultValue(dom.evaluate(xpath._parent, contextNode, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null));
            //console.log("Found " + nodeCollection.length + " nodes match xpath parent string: " + xpath._parent);
            
            if (String.isString(xpath._value))
            {
                resultSet = resultSet.map(createValueFromNode);
            }
            else
            {
                // Get all remaining object properties
                propertyNames = Object.keys(xpath);
                
                // Delete xpath._parent property so it doesn't show up in keys to iterate through
                propertyNames.splice(propertyNames.indexOf("_parent"), 1);
                //console.log("Iterating through properties: " + propertyNames.join(", "));
                
                // For each parent node
                resultSet = resultSet.map(createObjectFromNode);
            }
            
        }
        
        
        
        return resultSet;
    }
    
    
    return exported;
}(ng));