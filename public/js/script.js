var cityHead = $('#city-name-head'),
    flickrInput = $('#flickr-input'),
    flickrSubmit = $('#flickr-btn'),
    flickrApiUrl = 'https://api.flickr.com/services/rest';

Parse.initialize("4gtMGZtQJQJxcuA4fhDvYM3nMZHe5iXNlGJ3rDcn", "OHVYUmJ1RijwIbvtutpvrGap1hSNmvRUvRBZ02cq");

function getPhotoId (url) {
    var s = url.replace('https://www.flickr.com/photos/', '');
    return s.split('/')[1];
}

function renderFlickrPanel (data, photoId) {
    var source   = $('#flickr-panel-template').html(),
        template = Handlebars.compile(source),
        html     = template({photo: data, id: photoId}),
        panelContainer = $('.flickr-panel-container');

    panelContainer.html(html);
}

// Clicking on the city list.
$('.city-list').delegate( '.city', 'click', function() {

    //only one active elem at a time.
    $('.active').removeClass('active');
    $( this ).toggleClass('active');

    //update text on right hand side
    $('.select').removeClass('hidden');
    cityHead.text($(this).text());

    //empty the panelContainer
    $('.flickr-panel-container').empty();

    if ($(this).hasClass('has-photo')) {
        $('.has-photo-alert').removeClass('hidden');
    }
    else {
        $('.has-photo-alert').addClass('hidden');
    }
});

// Clicking on the "Get from Flickr" button
flickrSubmit.on('click', function (e) {
    e.preventDefault();

    $.jGrowl("Contacting Flickr for image data..");

    //get the image from Flickr
    var flickrUrl = flickrInput.val(),
        photoId = getPhotoId(flickrUrl),
        qs = {
            method: 'flickr.photos.getSizes',
            photo_id: photoId,
            format: 'json',
            nojsoncallback: 1,
            api_key: Place.keys.flickr
        };

    $.getJSON(flickrApiUrl, qs)
        .done(function (data) {
            //render the image
            renderFlickrPanel(data, photoId);
        })
        .fail(function () {
            var err = textStatus + ", " + error;
            console.log(err);
            $.jGrowl("Error when contacting Flickr for image data. Check console.");
        });

});


// Save to Parse
$(document).on('click', '#parse-btn', function(){

    $.jGrowl("Contacting Flickr for image data..");

    //Get the image ID again
    var photoId = $('.flickr-panel').data('photo'),
        photoUrl = $('.size-radio:checked').val(),
        qs = {
            method: 'flickr.photos.getInfo',
            photo_id: photoId,
            format: 'json',
            nojsoncallback: 1,
            api_key: Place.keys.flickr
        };

    // Get photo data from Flickr
    $.getJSON(flickrApiUrl, qs)
        .done(function (photoData) {
            //If photo data is successful, save it to Parse against the selected city.
            $.jGrowl("Received image data from Flickr. Saving to Parse..");

            photoData.photo.selectedUrl = photoUrl;

            var activeCity = $('.city.active');
            var placeId = activeCity.data('id');
            var Place = Parse.Object.extend("Place");
            var query = new Parse.Query(Place);
            query.get(placeId, {
              success: function(place) {
                // The place was retrieved successfully.
                // Add the photo to an array
                place.set('photos', [photoData]);
                place.save(null, {
                    success: function (place) {
                        $.jGrowl("Saved the photo for " + place.get('name') + " on Parse");
                        activeCity.addClass('has-photo');
                    },

                    error: function (place, error) {
                        $.jGrowl("Could not save this photo on Parse.");
                        console.log(place);
                        console.log(err);
                    }
                });
              },
              error: function(object, error) {
                $.jGrowl("Could not find this place with id: " + placeId + " on Parse.");
                console.log(object);
                console.log(err);
              }
            });


        })
        .fail(function () {
            var err = textStatus + ", " + error;
            console.log(err);
            $.jGrowl("Error when contacting Flickr for image data. Check console.");
        });
});




