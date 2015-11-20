function CollectionUtils() {

}
CollectionUtils.prototype._binSearch = function(haystack, needle, sortProperty, start, end, equalizer) {
  //debugger;
  var mid = Math.floor((start + end) / 2);

  if (equalizer) {
    if (equalizer(haystack[mid][sortProperty], needle) === true) {
      return haystack[mid];
    }
  } else {
    if ((haystack[mid][sortProperty] === needle)) {
      return haystack[mid];
    }
  }

  if ((needle > haystack[mid][sortProperty]) && (start < end)) {
    return this._binSearch(haystack, needle, sortProperty, mid + 1, end);

  } else if (start < end) {
    return this._binSearch(haystack, needle, sortProperty, start, mid - 1);
  }

};
CollectionUtils.prototype.search = function(haystack, needle, isSorted, sortProperty, isDescending, sorter, equalizer) {
  if (Object.prototype.toString.call(haystack) !== "[object Array]") {
    throw "Haystack must be an Array";
  }
  if (!needle) {
    throw "No Search String!";
  }

  if (haystack.length === 0) {
    throw "Empty Haystack!";
  }

  if ((!sorter) && (haystack[0].hasOwnProperty(sortProperty) === false)) {
    throw "haystack objects do not contain SortProperty:" + sortProperty;
  }

  //if it has the sort property, we need to determine if the property is indeed a sortable one.
  if (!sorter && (typeof(haystack[0][sortProperty]) !== "number") && (typeof(haystack[0][sortProperty]) !== "string")) {
    //debugger;
    throw "SortProperty needs to be Numeric or String for sorting to happen automatically. If you have a nested JSON Object, try giving me a Custom Sorter function as the Last Argument. ";
  }

  isSorted = !!isSorted;
  isDescending = !!isDescending;

  //bail out if sorted is false and sortproperty is not specified, because it is not possible to sort.
  if (isSorted === false && (!sortProperty && !sorter)) {
    throw "sort property is required for un-sorted JSON arrays";
  }
  //bail out if the sorter is not a function
  if (sorter && typeof(sorter) !== "function") {
    throw "The custom sorter Must be a Function";
  }
  //bail out if the sorter is not a function
  if (equalizer && typeof(equalizer) !== "function") {
    throw "The custom equalizer Must be a Function";
  }



  if (isSorted === false) {
    var sorterFunction;
    //now set the sorter function
    if (sorter) {
      sorterFunction = sorter;
    } else if (isDescending === false) {
      sorterFunction = function(a, b) {
        return (a[sortProperty] >= b[sortProperty]);
      };
    } else {
      sorterFunction = function(a, b) {
        return (a[sortProperty] <= b[sortProperty]);
      };
    }
    haystack.sort(sorterFunction);
  }

  //now do the search
  return this._binSearch(haystack, needle, sortProperty, 0, haystack.length - 1, equalizer);
};

var col = new CollectionUtils();
var data = [{
  name: "Nishant",
  age: 30
}, {
  name: "Mohan",
  age: 49
}, {
  name: "Sohan",
  age: 9
}, {
  name: "Ramesh",
  age: 34
}, {
  name: "Meena",
  age: 8
}, {
  name: "Asha",
  age: 09
}, {
  name: "Neha",
  age: 444
}, {
  name: "Chaminda Vaas",
  age: 1
}];
var data2 = [{
  name: "Muthaiya Muralitharan",
  age: 30,
  address: {
    city: "Colombo",
    street: 120
  }
}, {
  name: "Chaminda Vaas",
  age: 20,
  address: {
    city: "Bangalore",
    street: 101
  }
}, {
  name: "Attapattu Marvan",
  age: 33,
  address: {
    city: "Hazaribag",
    street: 160
  }
}, {
  name: "Gunashekhar Kumar",
  age: 34,
  address: {
    city: "Kanpur",
    street: 180
  }
}, {
  name: "Sanath Jayasuriya",
  age: 20,
  address: {
    city: "Katkamsandi",
    street: 190
  }
}, {
  name: "Arvinda D' Silva",
  age: 35,
  address: {
    city: "DaltonGanj",
    street: 103
  }
}, {
  name: "Arjuna Ranatunga",
  age: 90,
  address: {
    city: "Srinagar",
    street: 100
  }
}, {
  name: "Romesh Kaluwitharana",
  age: 130,
  address: {
    city: "Ahmedabad",
    street: 120
  }
}, {
  name: "Russel Arnold",
  age: 303,
  address: {
    city: "Sambalpur",
    street: 510
  }
}, {
  name: "Mahela Jayawardena",
  age: 3320,
  address: {
    city: "Zanskar",
    street: 910
  }
}];


var result = col.search(data, "Chaminda Vaas", false, "name", false);
if (result) {
  console.log("Found!");
  console.debug(result);
} else {
  console.error("Not Found!");
}
var result2 = col.search(data2, "DaltonGanj", false, "address", false, function(a, b) {
  console.log(a.address.city + " <><> " + b.address.city);
  return a.address.city >= b.address.city;
}, function(a, b) {
  console.log(a.city + " = " + b);
  return a.city === b;
});
if (result) {
  console.log("Found!");
  console.debug(result);
} else {
  console.error("Not Found!");
}