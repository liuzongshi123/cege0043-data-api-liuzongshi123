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

geoJSON.get('/getGeoJSON/quizquestions/location/:port_id', function (req,res) { 
  pool.connect(function(err,client,done) { 
    if(err){ 
      console.log("not able to get connection "+ err); 
      res.status(400).send(err); 
    } 

    var colnames = "id, question_title, question_text, answer_1,";
        colnames = colnames + "answer_2, answer_3, answer_4, port_id, correct_answer";
        console.log("colnames are " + colnames);

    var port_id = req.params.port_id;

    var querystring = "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM "; 
    querystring = querystring + "(SELECT 'Feature' As type     , ST_AsGeoJSON(lg.location)::json As geometry, ";
    querystring = querystring + "row_to_json((SELECT l FROM (SELECT "+colnames + " ) As l      )) As properties ";
    querystring = querystring + "FROM public.quizquestions As lg where port_id = $1 limit 100  ) As f";
    client.query(querystring,[port_id],function(err,result) { 
      done(); 
      if(err){ 
        console.log(err); 
        res.status(400).send(err); 
      } 
      res.status(200).send(result.rows); 
    }); 
    }); 
  });


geoJSON.get('/quizanswers/:port_id', function (req,res) { 
  pool.connect(function(err,client,done) { 
    if(err){ 
      console.log("not able to get connection "+ err); 
      res.status(400).send(err); 
    } 
    var port_id = req.params.port_id;
    var querystring = "select  array_to_json (array_agg(c)) from (select * from public.quizanswers where port_id = $1) c "; 
    client.query(querystring,[port_id],function(err,result) { 
      done(); 
      if(err){ 
        console.log(err); 
        res.status(400).send(err); 
      } 
      res.status(200).send(result.rows); 
    }); 
    }); 
  });

geoJSON.get('/quizanswers/correctnumber/:port_id', function (req,res) { 
  pool.connect(function(err,client,done) { 
    if(err){ 
      console.log("not able to get connection "+ err); 
      res.status(400).send(err); 
    } 
    var port_id = req.params.port_id;
    var querystring = "select array_to_json (array_agg(c)) from (SELECT COUNT(*) "; 
    querystring = querystring + "AS num_questions from public.quizanswers where ";
    querystring = querystring + "(answer_selected = correct_answer) and port_id = $1) c";
    client.query(querystring,[port_id],function(err,result) { 
      done(); 
      if(err){ 
        console.log(err); 
        res.status(400).send(err); 
      } 
      res.status(200).send(result.rows); 
    }); 
    }); 
  });


geoJSON.get('/quizanswers/ranking/:port_id', function (req,res) { 
  pool.connect(function(err,client,done) { 
    if(err){ 
      console.log("not able to get connection "+ err); 
      res.status(400).send(err); 
    } 
    var port_id = req.params.port_id;
    var querystring = "select array_to_json (array_agg(hh)) from (select c.rank from ";
    querystring = querystring + "(SELECT b.port_id, rank()over (order by num_questions desc) as rank  from ";
    querystring = querystring + "(select COUNT(*) AS num_questions, port_id  from public.quizanswers where ";
    querystring = querystring + "answer_selected = correct_answer group by port_id) b) c where c.port_id = $1) hh";
    client.query(querystring,[port_id],function(err,result) { 
      done(); 
      if(err){ 
        console.log(err); 
        res.status(400).send(err); 
      } 
      res.status(200).send(result.rows); 
    }); 
    }); 
  });


geoJSON.get('/topscorers', function (req,res) { 
  pool.connect(function(err,client,done) { 
    if(err){ 
      console.log("not able to get connection "+ err); 
      res.status(400).send(err); 
    } 
    var querystring = "select array_to_json (array_agg(c)) from ";
    querystring = querystring + "(select rank() over (order by num_questions desc) as rank , port_id ";
    querystring = querystring + "from (select COUNT(*) AS num_questions, port_id ";
    querystring = querystring + "from public.quizanswers where answer_selected = correct_answer group by port_id) b limit 5) c";
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


geoJSON.get('/quizanswers/participationrate/my/:port_id', function (req,res) { 
  pool.connect(function(err,client,done) { 
    if(err){ 
      console.log("not able to get connection "+ err); 
      res.status(400).send(err); 
    } 
    var port_id = req.params.port_id;
    var querystring = "select array_to_json (array_agg(c)) from ";
    querystring = querystring + "(select * from public.participation_rates where port_id = $1) c";
    client.query(querystring,[port_id],function(err,result) { 
      done(); 
      if(err){ 
        console.log(err); 
        res.status(400).send(err); 
      } 
      res.status(200).send(result.rows); 
    }); 
    }); 
  });


geoJSON.get('/quizanswers/participationrate/all', function (req,res) { 
  pool.connect(function(err,client,done) { 
    if(err){ 
      console.log("not able to get connection "+ err); 
      res.status(400).send(err); 
    } 
    var querystring = "select array_to_json (array_agg(c)) from ";
    querystring = querystring + "(select day, sum(questions_answered) as questions_answered, sum(questions_correct) as questions_correct ";
    querystring = querystring + "from public.participation_rates group by day) c";
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

geoJSON.get('/questionAdded/Lastweek', function (req,res) { 
  pool.connect(function(err,client,done) { 
    if(err){ 
      console.log("not able to get connection "+ err); 
      res.status(400).send(err); 
    } 
    var querystring = "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM ";
    querystring = querystring + "(SELECT 'Feature' As type     , ST_AsGeoJSON(lg.location)::json As geometry, ";
    querystring = querystring + "row_to_json((SELECT l FROM (SELECT id, question_title, question_text, answer_1, ";
    querystring = querystring + "answer_2, answer_3, answer_4, port_id, correct_answer) As l ";
    querystring = querystring + ")) As properties FROM public.quizquestions As ";
    querystring = querystring + "lg where timestamp > NOW()::DATE-EXTRACT(DOW FROM NOW())::INTEGER-7  limit 100  ) As f";
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

geoJSON.post('/FiveClosestPoint', function (req,res) {
  console.dir(req.body);
  pool.connect(function(err,client,done) { 
    if(err){ 
      console.log("not able to get connection "+ err); 
      res.status(400).send(err); 
    } 
    var querystring = "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM ";
    querystring = querystring + "(SELECT 'Feature' As type     , ST_AsGeoJSON(lg.location)::json As geometry, ";
    querystring = querystring + "row_to_json((SELECT l FROM (SELECT id, question_title, question_text, answer_1, answer_2, ";
    querystring = querystring + "answer_3, answer_4, port_id, correct_answer) As l )) As properties ";
    querystring = querystring + "FROM   (select c.* from public.quizquestions c ";
    querystring = querystring + "inner join (select id, st_distance(a.location, st_geomfromtext('POINT("+req.body.longitude+ " "+req.body.latitude +")',4326)) as distance ";
    querystring = querystring + "from public.quizquestions a order by distance asc limit 5) b on c.id = b.id ) as lg) As f";
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

geoJSON.get('/FiveDifficultPoint', function (req,res) {
  pool.connect(function(err,client,done) { 
    if(err){ 
      console.log("not able to get connection "+ err); 
      res.status(400).send(err); 
    } 
    var querystring = "select array_to_json (array_agg(d)) from ";
    querystring = querystring + "(select c.* from public.quizquestions c inner join ";
    querystring = querystring + "(select count(*) as incorrectanswers, question_id from public.quizanswers where ";
    querystring = querystring + "answer_selected <> correct_answer group by question_id ";
    querystring = querystring + "order by incorrectanswers desc limit 5) b on b.question_id = c.id) d";
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

geoJSON.get('/LastFiveQuestionsAnsewred/:port_id', function (req,res) {
  pool.connect(function(err,client,done) { 
    if(err){ 
      console.log("not able to get connection "+ err); 
      res.status(400).send(err); 
    } 
    var port_id = req.params.port_id;
    var querystring = "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM ";
    querystring = querystring + "(SELECT 'Feature' As type     , ST_AsGeoJSON(lg.location)::json As geometry, ";
    querystring = querystring + "row_to_json((SELECT l FROM (SELECT id, question_title, question_text, answer_1, answer_2, ";
    querystring = querystring + "answer_3, answer_4, port_id, correct_answer, answer_correct) As l )) As properties ";
    querystring = querystring + "FROM (select a.*, b.answer_correct from public.quizquestions a inner join ";
    querystring = querystring + "(select question_id, answer_selected=correct_answer as answer_correct from public.quizanswers ";
    querystring = querystring + "where port_id = $1 order by timestamp desc limit 5) b on a.id = b.question_id) as lg) As f";
    client.query(querystring,[port_id],function(err,result) { 
      done(); 
      if(err){ 
        console.log(err); 
        res.status(400).send(err); 
      } 
      res.status(200).send(result.rows); 
    }); 
    }); 
  });

geoJSON.get('/AnsweredWrong/:port_id', function (req,res) {
  pool.connect(function(err,client,done) { 
    if(err){ 
      console.log("not able to get connection "+ err); 
      res.status(400).send(err); 
    } 
    var port_id = req.params.port_id;
    var querystring = "SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM ";
    querystring = querystring + "(SELECT 'Feature' As type     , ST_AsGeoJSON(lg.location)::json As geometry, ";
    querystring = querystring + "row_to_json((SELECT l FROM (SELECT id, question_title, question_text, answer_1, answer_2, ";
    querystring = querystring + "answer_3, answer_4, port_id, correct_answer) As l )) As properties ";
    querystring = querystring + "FROM (select * from public.quizquestions where id in ( select question_id from public.quizanswers ";
    querystring = querystring + "where port_id = $1 and answer_selected <> correct_answer union all select id from public.quizquestions ";
    querystring = querystring + "where id not in (select question_id from public.quizanswers) and port_id = $2) ) as lg) As f";
    client.query(querystring,[port_id,port_id],function(err,result) { 
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
