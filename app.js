var Flight = require('./flight');

var obj = {
    number  :   123,
    name    :   "commitment",
    Origin  :   "Wipro",
    Destination :   "Product Based Company",
};

var flight1 = Flight(obj);
flight1.triggerDepart();
flight1.triggerArrival();

console.log(flight1.getInfo());