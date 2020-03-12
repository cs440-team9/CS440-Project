//Server
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
//Setting up parameter
const app = express();
const port = process.env.PORT || 80;

//function
const { GET_data } = require('./lib/utils');

//Other
const fs = require('fs');
const logger = require('./lib/logger');

//File
const record = require('./record');
//variable

app.use(bodyParser.json());
app.use(logger);
app.use(cors());

//Endpoint that returns hisotry data
app.get('/record', (req, res, next) => {
	res.status(200).send(record);
});

//Endpoint that returns specific hisotry data
app.get('/record/:id', (req, res, next) => {
	console.log("  -- req.params:", req.params);
	const id = req.params.id;
	if(id == 0)
		res.status(400).send("Please input the id /job-history/{id}");
	else if (id > record.length)
		res.status(400).send("Invalid id");
	else
		res.status(200).send(record[id-1]);
});

app.post('/new-job', (req, res, next) => {
  //console.log("  -- req.body:", req.body);
  const id = record.length + 1;

  if (req.body) {
	//Parse output_data
	//Get data from API
	GET_data(req.body.host, req.body.endpoint, req.body.query, async function(res_data) {
		console.log("==Repond content:\n" + res_data);
		//res_data.image = res_data.image.replace("/","");
		var saved_data = res_data.replace(/\\/g,"");
		//Saving return data to file
		record.push(saved_data);
		//history.push(res_data);
		//res.status(201).send({id: id});
		res.status(201).type('json').send(saved_data);

	await fs.writeFile("./record.json", JSON.stringify(record, null, 2).replace("[\\n\\t ]",''), function(err){
		if(err)  console.log("Error append request body to file");
		console.log("== Content appened");
	  });
	});

  } else {
    res.status(400).send({
      err: "Request needs a body"
    });
  }
});

app.use('*', (req, res, next) => {
  res.status(404).send({
    err: "The path " + req.originalUrl + " doesn't exist"
  });
});

app.listen(port, () => {
  console.log("== Server is listening on port:", port);
});
