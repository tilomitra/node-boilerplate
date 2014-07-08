var request = require('request'),
    Promise = require('ypromise'),
    FS      = require('q-io/fs'),
    config  = require('./config');

var citiesString = "Paris|New York|Sydney|Barcelona|London|Rome|San Francisco|Bangkok|Cape Town|Istanbul|Melbourne|Hong Kong|Kathmandu|Prague|Vancouver|Buenos Aires|Rio de Janeiro|Berlin|Jerusalem|Montreal|Edinburgh|Venice|Hanoi|Amsterdam|Singapore|Tokyo|Florence|Dublin|Mexico City|Krakow|Toronto|Cairo|Budapest|Chicago|Havana|Madrid|Munich|Athens|New Orleans|Vienna|Ho Chi Minh City|Marrakech|Sarajevo|Seville|Kyoto|Las Vegas|Perth|Shanghai|Los Angeles|Lisbon|Stockholm|Kuala Lumpur|Damascus|Luang Prabang|Seattle|Phnom Penh|St. Petersburg|Cuzco|Dubrovnik|Delhi|Moscow|Salvador da Bahia|Beijing|Helsinki|Kolkata|Santiago de Chile|Fes|Auckland|Manila|Puerto Vallarta|Chiang Mai|Varanasi|Cartagena|Zanzibar|Innsbruck|York|Mumbai|Hamburg|Oaxaca|Galway|Siena|Isfahan|Wellington|Ljubljana|Seoul|San Cristobal|Taipei|Tallinn|Lhasa|Bled|Hobart|Jaipur|Brussels|La Paz|Quebec City|Valparaiso|Naples|Memphis|Heidelberg|Dhaka|Amman|Monaco|Washington D.C.|Quito|Christchurch|Glasgow|Muscat|Panama City|Dakar|Bratislava|San Sebastian|Bern|San Juan|Aleppo|Dubai|Riga|Asmara|Kabul|Bath|Copenhagen|Macau|Sofia|Hoi An|Marseille|Zagreb|Manchester|Antigua|Reykjavik|Yogyakarta|Carcasonne|Lubeck|Tel Aviv|Hiroshima|Mendoza|Nairobi|Beirut|Vilnius|Montevideo|Yangon|Arequipa|Bucharest|Apia|Belgrade|Dar es Salaam|Kiev|Bukhara|Male|Caracas|Tirana|Suva|Tbilisi|Agadez|Ushuaia|Kampala|Bogota|Bridgetown|Ulaanbaatar|Abuja|Christiansted|Sanaa|Livingstone|Alexandria|Belfast|Savannah|Nuuk|Jeddah|Johannesburg|Kairouan|Austin|San Salvador|Cardiff|Minsk|Thimphu|Khartoum|Anchorage|Mecca|Aswan|Yerevan|Luxembourg|Georgetown|Maputo|Baku|Belize City|Essaouira|Santo Domingo|Addis Ababa|Pyongyang|Lahore|Cayenne|Almaty|Mombasa|Valletta|Antananarivo|Miami|Bamako|Saint-Denis|Granada|Beira|Madang|Ashgabat";

var cities = citiesString.split('|');


Promise.all(cities.map(getIdForCity))
    .then(removeBadValues)
    .then(writeToFile)
    .then(function () {
        console.log('all done.');
    })
    .catch(function (err) {
        throw (err);
    });



//-------------------------------------------------------------

function removeBadValues (values) {
    return new Promise (function (resolve, reject) {
        var newArr = [];

        console.log('Removing bad values...\n');

        values.forEach(function (elem) {
            if (elem.id) { newArr.push(elem); }
        })
        if (newArr.length) { resolve (newArr); }
        else {
            reject(new Error("No useful Ids were found for this dataset."));
        }
    });
}

function writeToFile (values) {
    var json = {
        cities: values
    };
    console.log('Writing to file...\n');
    return FS.write("cities.json", JSON.stringify(json));
}

function getIdForCity (city) {
    var topicUrl = 'https://www.googleapis.com/freebase/v1/topic/en/',
        qs      = {
            filter: '/location/citytown',
            key: config.freebase.apiKey
        };

    city = city.toLowerCase().replace(' ', '_');

    return new Promise (function (resolve, reject) {
        request({
            url: topicUrl + city,
            qs: query
        }, function (err, res, body) {
            if (err) { reject (err); }
            body = JSON.parse(body);
            console.log('Got id for ' + city + ': ' + body.id);
            if (!body.id) {
                console.log(body);
            }

            resolve({
                id: body.id,
                city: city
            });
        });
    });
}


