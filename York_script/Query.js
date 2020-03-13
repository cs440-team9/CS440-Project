//function
const { Request_data, url_builder } = require('./lib/utils');
const ProgressBar = require("./progress-bar");
const fs = require('fs');
const Bar = new ProgressBar();

var i;
var query;
var cur_page = process.argv[3];
var total_sub_page = process.argv[4];
var total_page = process.argv[5];
var url;

async function init_test(query){
    url = url_builder("itbook", "search", query + "*");
    Request_data(url, async function (res_data) {
       try{
       var result = JSON.parse(res_data);
       total_page = result.total;

       for(; cur_page <= total_sub_page; cur_page++){
           fetch();
       }
       cur_page -= 1;
       console.log(cur_page + " out of " + total_page);
       } catch(error){
           console.log("Error in Fetch()" + error);
       }
   });
}


async function init(query){
       for(; cur_page <= total_sub_page; cur_page++){
           fetch();
       }
       cur_page -= 1;
       //console.log("Current progress: " + cur_page + " out of " + total_page);
}



async function detail(object){
    url = url_builder("itbook", "books", object.isbn13);
    //console.log(url);

    //Fetching data
    await Request_data(url, async function (res_data) {
        try{
            var detail = JSON.parse(res_data);
            var data = detail.isbn13 + ", " + detail.title + ", " + detail.year + "," + detail.authors + ", " + detail.publisher + "\n";

            //Write to file
            await fs.appendFile("./data/" + process.argv[2] + ".csv", data, function(err){
                if(err)  console.log("Error append request body to file");
                //console.log("== Content appened");
              });
        }catch(error){
            //console.log("Error in detail() => " + res_data);
            throw error;
        }
    });
}

async function fetch(){
    //console.log("Starting fetch()" + cur_page);
        query = String.fromCharCode(65);
        url = url_builder("itbook", "search", query + "*/" + cur_page);
        //Fetching data
         await Request_data(url, async function (res_data) {
            try{
            var result = JSON.parse(res_data);
            result.books.forEach(function(obj) {detail(obj)});
            } catch(error){
                //console.log("Error in Fetch() => " + res_data);
                throw error;
            }
        });
}

//Execute
init(process.argv[2])
