function _dynamicSortMultiple(attr) {
    var props = arguments;
    return function (obj1, obj2) {
        var i = 0, result = 0, numberOfProperties = props.length;
        /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         */
        while(result === 0 && i < numberOfProperties) {
            result = _dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}
function _dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var f = isNaN(a[property]) ? a[property] : parseFloat(a[property]);
        var s = isNaN(b[property]) ? b[property] : parseFloat(b[property]);
        var result = (f < s) ? -1 : (f > s) ? 1 : 0;
        return result * sortOrder;
    }
}

function _dynamicExpSortMultiple(attr) {
    var props = arguments;
    return function (obj1, obj2) {
        var i = 0, result = 0, numberOfProperties = props.length;
        /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         */
        while(result === 0 && i < numberOfProperties) {
            result = _dynamicExpSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}
function _dynamicExpSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var f = isNaN(a[property].exp) ? a[property].exp : parseFloat(a[property].exp);
        var s = isNaN(b[property].exp) ? b[property].exp : parseFloat(b[property].exp);
        var result = (f < s) ? -1 : (f > s) ? 1 : 0;
        return result * sortOrder;
    }
}

Object.defineProperty(Array.prototype, "sortBy", {
    enumerable: false,
    writable: true,
    value: function() {
        return this.sort(_dynamicSortMultiple.apply(null, arguments));
    }
});


Object.defineProperty(Array.prototype, "sortExpBySkill", {
    enumerable: false,
    writable: true,
    value: function() {
        return this.sort(_dynamicExpSortMultiple.apply(null, arguments));
    }
});