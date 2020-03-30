var express = require('express'); 
var pg = require('pg'); 
var fs = require('fs'); 
var geoJSON = require('express').Router(); 
var configtext = ""+fs.readFileSync("/home/studentuser/certs/postGISConnection.js");

 // now convert the configruation file into the correct format -i.e. a name/value pair array
var configarray = configtext.split(","); 
var config = {}; 
for (var i = 0; i < configarray.length; i++) { 
	var split = configarray[i].split(':'); 
	config[split[0].trim()] = split[1].trim(); 
} 
var pool = new pg.Pool(config); 
console.log(config);

geoJSON.route('/testGeoJSON').get(function (req,res) { 
	res.json({message:req.originalUrl}); 
});

geoJSON.get('/postgistest', function (req,res) { 
pool.connect(function(err,client,done) { 
	if(err){ 
		console.log("not able to get connection "+ err); 
		res.status(400).send(err);
		} 
		client.query('SELECT name FROM london_counties' ,function(err,result) { 
			done(); 
			if(err){ 
				console.log(err); 
				res.status(400).send(err); } 
			res.status(200).send(result.rows);
		}); 
	});
});

geoJSON.get('/getPOI', function (req,res) { 
	pool.connect(function(err,client,done) { 
		if(err){ 
			console.log("not able to get connection "+ err); 
			res.status(400).send(err); 
		} 
		 var querystring = " SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM "; 
		 querystring = querystring + "(SELECT 'Feature' As type , ST_AsGeoJSON(lg.geom)::json As geometry, "; 
		 querystring = querystring + "row_to_json((SELECT l FROM (SELECT id, name, category) As l )) As properties"; 
		 querystring = querystring + " FROM london_poi As lg limit 100 ) As f"; 
		client.query(querystring,function(err,result) { 
			done(); 
			if(err){ 
				console.log(err); 
				res.status(400).send(err); 
			} 
			res.status(200).send(result.rows); 
		}); 
	  }); 
	});
module.exports = geoJSON;

