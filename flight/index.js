var Flight = function(){
    this.data = {
        number  :   null,
        name    :   null,
        origin  :   null,
        destination :   null,
        departsAt   :   null,
        arrivesAt   :   null
    };

    this.fill = function(info){
        for(prop in this.data){
            console.log("prop: " + prop)
            if(prop !== 'undefined'){
                this.data[prop] =   info[prop];
            }
        }
    };

    this.triggerDepart = function(){
        this.data.departsAt = Date.now();
    };
    this.triggerArrival = function(){
        this.data.arrivesAt = Date.now();
    };

    this.getInfo = function(){
        return this.data;
    };

};

module.exports = function(data){
    var instance = new Flight();
    instance.fill(data);
    return instance;
};
