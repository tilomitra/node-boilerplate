'use strict';

var request = require('request'),
    Promise = require('ypromise'),
    FS      = require('q-io/fs'),

    config  = require('./config'),
    cities  = require('./cities.json').cities;



Promise.all(cities.map(getDescription))
    .then(removeBadValues)
    .then(writeToFile);


// -----------------------------------

function getDescription (city) {
    return new Promise (function (resolve, reject) {
        var url = 'https://www.googleapis.com/freebase/v1/topic';
        request({
            url: url + city.id,
            qs: {
                key: config.freebase.apiKey
            }
        }, function (err, resp, body) {
            if (err) { reject(err); }
            var data = JSON.parse(body),
                descObject,
                descValues,
                descString = '';

            //try it with the /common/topic/description property
            if (data.property && data.property['/common/topic/description']) {
                descObject = data.property['/common/topic/description'];
                descValues = descObject.values;

                //store the largest value
                descValues.forEach(function (val) {
                    if (descString.length < val.value.length) {
                        descString = val.value;
                    }
                });

                console.log('Got description for city: ' + city.city + ' with id: ' + city.id);
                city.description = descString;
            }

            else {
                console.log('Did not get description for ' + city.city + ' with id: ' + city.id);
                console.log(data);
            }

            resolve(city);
        });
    });
}


function removeBadValues (values) {
    return new Promise (function (resolve, reject) {
        var newArr = [];

        console.log('Removing bad values...\n');

        values.forEach(function (elem) {
            if (elem.description) { newArr.push(elem); }
        });
        if (newArr.length) { resolve (newArr); }
        else {
            reject(new Error("No useful descriptions were found for this dataset."));
        }
    });
}

function writeToFile (values) {
    var json = {
        cities: values
    };
    console.log('Writing to file...\n');
    return FS.write("desc.json", JSON.stringify(json));
}
