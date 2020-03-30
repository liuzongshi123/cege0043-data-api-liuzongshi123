geoJSON.route('/testGeoJSON').get(function (req,res) { 
	res.json({message:req.originalUrl}); 
});

module.exports = geoJSON;