'use strict';

var Promise = require('ypromise'),
    Parse   = require('parse').Parse,

    config  = require('./config'),
    cities  = require('./desc.json').cities;

Parse.initialize(config.parse.appId, config.parse.jsKey);



Promise.all(cities.map(saveToParse)).then(function (values) {
    console.log('All done. Saved ' + values.length + ' items to Parse.');
    console.log('Data Browser available at https://www.parse.com/apps/places--40/collections#class/Place');
}).catch(handleErr);


function saveToParse (city) {
    return new Promise (function (resolve, reject) {
        var Place = Parse.Object.extend("Place");
        var place = new Place();

        place.set({
          name: toTitleCase(city.city),
          mid: city.id,
          description: city.description
        });

        place.save(null, {
            success: function (place) {
                console.log('Saved ' + place.get('name') + ' with objectId: ' + place.id);
                resolve(place);
            },
            error: function (place, error) { reject(error); }
        });
    });
}

function toTitleCase(str)
{
    str = str.replace('_', ' ');
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function handleErr (err) {
    throw (err);
}
