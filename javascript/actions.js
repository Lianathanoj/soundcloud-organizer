$(document).ready(function() {

var songCount = 0;
var artist;

function loadWidgets(artist, songCount, sortFunc, clearTable) {
    if (clearTable) {
        $("table").children("tr").remove();
    }
    SC.get("/resolve/?url=https://soundcloud.com/" + artist + "/tracks").then(function(tracks) {
        tracks.sort(sortFunc);
        for (var i = songCount; i < songCount + 5; i++) { // TODO: make client-side widget loading interruptable by buttons (possible?)
            setTimeout(2000);
            SC.oEmbed(tracks[i].permalink_url, {maxheight: 200}).then(function(widget) {
                $("<tr class='lazy'><td>" + widget.html + "</td></tr>").appendTo("table");
            });
        }
        songCount += 5;
    });
}

function sortFavorites() {
    return function(x, y) {
        return y.favoritings_count - x.favoritings_count;
    }
}

function sortPlaybacks() {
    return function(x, y) {
        return y.playback_count - x.playback_count;
    }
}

$(function() {
    $('.lazy').lazy({
        combined: false,
        delay: 10000
    });
});


    $("#dropdown").hide();
    $("#add").hide();
    $("#find").click(function() {
        artist = $("#artist").val();
        loadWidgets(artist, 0, null, true);
        $("#dropdown").show();
        $("#add").show();
    });

    $("#add").click(function() {
        loadWidgets(artist, songCount, null, false);
    });

    $('select[name="dropdown"]').change(function() {
        if ($(this).val() == "playbacks") {
            loadWidgets(artist, 0, sortPlaybacks(), true);
        } else if ($(this).val() == "favorites") {
            loadWidgets(artist, 0, sortFavorites(), true);
        } else if ($(this).val() == "none") {
            loadWidgets(artist, 0, null, true);
        }
    });
});


