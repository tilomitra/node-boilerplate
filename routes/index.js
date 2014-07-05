var Parse = require('parse').Parse,
    request = require('request'),
    config = require('../config');

Parse.initialize(config.parse.appId, config.parse.jsKey);

var cache;

module.exports = {
    home: function (req, res, next) {

        //Get all the Places objects from Parse and send it out with express state

        var Place = Parse.Object.extend("Place");
        var queryObject = new Parse.Query(Place);
        var cities = [];
        queryObject.limit(200);

        res.expose(config.flickr.apiKey, 'keys.flickr');

        if (cache) {
            res.expose(cache, "cities");
            res.render('home', {
                cities: cache
            });
        }

        else {
            queryObject.find({
                success: function (results) {

                    results.forEach(function (city) {
                        cities.push(city.toJSON());
                    });

                    cities.sort(function(a, b){
                        if(a.name < b.name) return -1;
                        if(a.name > b.name) return 1;
                        return 0;
                    });

                    cache = cities;

                    res.expose(cities, "Cities");
                    res.render('home', {
                        cities: cities
                    });
                },
                error: function (error) {
                    throw (error);
                }
            });
        }
    }
}
