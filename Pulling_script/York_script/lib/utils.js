const request = require('request');

function GET_data(host, endpoint, query, callback){
	var url = url_builder(host, endpoint, query);
	console.log("URL: " + url);
	const options = {
	    url: url,
	    method: 'GET',
	    headers: {
		            'Accept': 'application/json',
					'X-API-KEY': '43879_e986482c6f7640f72db39d1f6a782ca4'//ISBNdb api key
		        }
	};
    //Fire request
   setting = request(options, (error, res, body) =>{
	//Wait for the respond from j-easy engine
	if(error){
		console.error(error);
		return;
	}
	//setting = body;
      	callback(body);
	//console.log("==Repond content:\n" + setting);
	});

}
exports.GET_data = GET_data;

async function Request_data(url, callback){
	return new Promise((resolve, reject) => {
		const options = {
			url: url,
			method: 'GET',
			headers: {
						'Accept': 'application/json',
						'X-API-KEY': '43879_e986482c6f7640f72db39d1f6a782ca4'//ISBNdb api key
					}
		};
		//Fire request
	   setting = request(options, (error, res, body) =>{
		if(error){
			console.error(error);
			return "Error";
		}
		callback(body);
		});
	})
}
exports.Request_data = Request_data

function url_builder(host, endpoint, query){
    var url = "";
    if (host == "ISBNdb")
        return "https://api.isbndb.com/" + endpoint + "/" + query;
    else if (host == "itbook")
        return "https://api.itbook.store/1.0/" + endpoint + "/" + query;
	else if (host == "NYtimes")
		return "https://api.nytimes.com/svc/books/v3/" + endpoint + "?" + query + "&api-key=brTY0m2auZ0wbOvgfQfuQ0QDhFGO0byM";
	else if (host == "Google")
		return "https://www.googleapis.com/books/v1/" + endpoint + "?q=" + query + "&key=AIzaSyACqXL1PUyD2e1EPvSSU2vji9Eu6xnnUkU";
}

exports.url_builder = url_builder
