const request = require('request');
//"https://api.isbndb.com/book/9781934759486"
//https://api.itbook.store/1.0/search/mongodb
function GET_data(host, endpoint, query, callback){
	var url = url_builder(host, endpoint, query);
	console.log("URL: " + url);
	const options = {
	    url: url,
	    method: 'GET',
	    headers: {
		            'Accept': 'application/json',
					'X-API-KEY': '43879_e986482c6f7640f72db39d1f6a782ca4'
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

function url_builder(host, endpoint, query){
    var url = "";
    if (host == "ISBNdb")
        url = "https://api.isbndb.com";
    else if (host == "itbook")
        url = "https://api.itbook.store";

    return url + "/" + endpoint + "/" + query;
}
