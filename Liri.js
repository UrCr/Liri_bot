
require("dotenv")
var fs = require('fs');


var spotify = require('node-spotify-api');
var request = require('request');

var keys = require("./keys.js");

var command= process.argv[2];
var inputcommand = process.argv[3];
var defaultMovie = "movie1";
var defaultSong = "song3";









function processCommands(command, inputcommand){


	switch(command){

	case 'concert-this':
		concertThis(); break;
	case 'spotify-this-song':
		
		if(inputcommand === undefined){
			inputcommand = defaultSong;
		}     
		spotifyThis(inputcommand); break;
	case 'movie-this':
		
		if(inputcommand === undefined){
			inputcommand = defaultMovie;
		}    
		movieThis(inputcommand); break;
	case 'do-what-it-says':
		doWhatItSays(); break;
	default: 
		console.log("Invalid command. Please type any of the following commnds: concert-this spotify-this-song movie-this or do-what-it-says");
}


}

function concertThis(artist){

	var region = ""
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist.replace(" ", "+") + "/events?app_id=codingbootcamp"
   
    
    request(queryUrl, function(err, response, body){
        
        if (!err && response.statusCode === 200) {
           
            var concertInfo = JSON.parse(body)
            
            outputData(artist + " concert information:")

            for (i=0; i < concertInfo.length; i++) {
                
                region = concertInfo[i].venue.region
                 
                if (region === "") {
                    region = concertInfo[i].venue.country
                }

                
                outputData("Venue: " + concertInfo[i].venue.name)
                outputData("Location: " + concertInfo[i].venue.city + ", " + region);
                outputData("Date: " + dateFormat(concertInfo[i].datetime, "mm/dd/yyyy"))
            }
        }
    })
}

function spotifyThis(song){

	
	if(song === ""){
		song = "song3";
	}

	spotify.search({ type: 'track', query: song}, function(err, data) {
    if (err) {
        console.log('Error occurred: ' + err);
        return;
    }

    var song = data.tracks.items[0];
    console.log("------Artists-----");
    for(i=0; i<song.artists.length; i++){
    	console.log(song.artists[i].name);
    }

    console.log("------Song Name-----");
    console.log(song.name);

	console.log("-------Preview Link-----");
    console.log(song.preview_url);

    console.log("-------Album-----");
    console.log(song.album.name);

	});

}

function movieThis(movieName){

	console.log(movieName);

	request("https://api.themoviedb.org/3/search/movie?api_key=" + tmdbKey + "&query=" + movieName, function(error, response, body) {

  
  	if (!error && response.statusCode === 200) {

	    
	    var movieID =  JSON.parse(body).results[0].id;
	  
	    var queryURL = "https://api.themoviedb.org/3/movie/" + movieID + "?api_key=" + tmdbKey + "&append_to_response=credits,releases";

	    request(queryURL, function(error, response, body) {
	    	var movieObj = JSON.parse(body);

	    	console.log("--------Title-----------");
	    	console.log(movieObj.original_title);

	    	console.log("--------Year -----------");
	    	console.log(movieObj.release_date.substring(0,4));

	   		console.log("--------Rating-----------");
	   		console.log(movieObj.releases.countries[0].certification);

	   		console.log("--------Country Produced-----------");
	   		for(i=0, j = movieObj.production_countries.length; i<j; i++){
	   			console.log(movieObj.production_countries[i].name);
	   		}
	   		console.log("--------Languages-----------");
	   		for(i=0, j = movieObj.spoken_languages.length; i<j; i++){
	   			console.log(movieObj.spoken_languages[i].name);
	   		}
	   		console.log("--------Plot----------------");
	   		console.log(movieObj.overview);

	   		console.log("--------Actors-----------");
	   		for(i=0, j = movieObj.credits.cast.length; i<j; i++){
	   			console.log(movieObj.credits.cast[i].name);
	   		}
	    	
	    });


  	}else{
  		console.log(error);
  	}

	});
}

function doWhatItSays(){
	fs.readFile('random.txt', 'utf8', function(err, data){

		if (err){ 
			return console.log(err);
		}

		var dataArr = data.split(',');

		processCommands(dataArr[0], dataArr[1]);
	});
}





processCommands(Command, inputcommand);