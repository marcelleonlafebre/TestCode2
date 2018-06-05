const http=require('http');
const url=require('url');
const fs=require('fs');
const querystring = require('querystring');

const mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  : 'audio/mpeg3',
   'mp4'  : 'video/mp4'
};

const servidor=http.createServer((request ,response) => {
   const objecturl = url.parse(request.url);
  let route='public'+objecturl.pathname;
  if (route=='public/')
    route='public/index.html';
  routing(request,response,route);
});

servidor.listen(8888);


function routing (request,response,route) {
  console.log(route);
  switch (route) {
    case 'public/reportFull': {
      reportFull(request,response);
      break;
    }
    case 'public/reportMin': {
      reportMin(request,response);
      break;
    }
    case 'public/reportFilter': {
      reportFilter(request,response);
      break;
    }
    default : {  
      fs.stat(route, error => {
        if (!error) {
        fs.readFile(route,(error, contenido) => {
          if (error) {
            response.writeHead(500, {'Content-Type': 'text/plain'});
            response.write('Error interno');
            response.end();					
          } else {
            const vec = route.split('.');
            const extension=vec[vec.length-1];
            const mimearchivo=mime[extension];
            response.writeHead(200, {'Content-Type': mimearchivo});
            response.write(contenido);
            response.end();
          }
        });	
      } else {
        response.writeHead(404, {'Content-Type': 'text/html'});
        response.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');		
        response.end();
        }
      });	
    }

  }	
}

function reportFull(request,response) {
'use strict';
var https = require('https');


let info = '';
  request.on('data', partialData => {
    info += partialData;
  });
  request.on('end', () => {
    const form = querystring.parse(info);       
    var numberPage = `${form['nextFull']}`;	

	if (numberPage == 'undefined'){
		numberPage = 1;
	}
	

var options = {
    host: 'recruitment-test-api.devsandbox.knetikcloud.com', 
    path: '/devices?page=' + numberPage,
    headers: {'User-Agent': 'request'}
};

https.get(options, function (res) {
    var json = '';
    res.on('data', function (chunk) {
        json += chunk;
    });
    res.on('end', function () {
        if (res.statusCode === 200) {
            try {
                
		var content1 = '<!doctype html><html><head></head><body>';
		content1 = content1 + '<a href="/">Return to home</a>';
		content1 = content1 + '<table border="1" cellpadding="1" cellspacing="1" style="width:800px;">';
	        content1 = content1 + '<caption><H1>List Full Devices</H1></caption>';
	        content1 = content1 + '<thead>';
		content1 = content1 + '<tr>';
		content1 = content1 + '<th scope="col">Id</th>';
		content1 = content1 + '<th scope="col">Location</th>';
		content1 = content1 + '<th scope="col">Mac address</th>';
		content1 = content1 + '<th scope="col">Status connection</th>';
		content1 = content1 + '<th scope="col">Parent location</th>';
		content1 = content1 + '<th scope="col">Update at</th>';
		content1 = content1 + '<th scope="col">Signal</th>';
		content1 = content1 + '</tr>';
		content1 = content1 + '</thead>';
		content1 = content1 + '<tbody>';

		var data = JSON.parse(json);    

	
			for(var i=0;i<data.content.length;i++){
						content1 = content1 + '<tr>';
						content1 = content1 + '<td>' + data.content[i].id + '</td>';
						content1 = content1 + '<td>' + data.content[i].location + '</td>';
						content1 = content1 + '<td>' + data.content[i].mac_address + '</td>';
						if (data.content[i].connected==true)
						{
							content1 = content1 + '<td><img src="https://orig00.deviantart.net/1d1b/f/2010/118/2/3/glowy_power_button_by_inkedicon.gif" width="50" height="50"></td>';
						}else
						{
							content1 = content1 + '<td><img src="http://cliparts101.com/files/956/8C7F2A17C07E3B8664EC13616C0FC3BC/Power_Button_2_States__on_off_.png" width="50" height="50"></td>';
						}
						content1 = content1 + '<td>' + data.content[i].parent_location + '</td>';
						content1 = content1 + '<td>' + data.content[i].updated_at + '</td>';
						content1 = content1 + '<td>' + data.content[i].signal + '</td>';
						content1 = content1 + '</tr>';
 					}
			
		content1 = content1 + '</tbody>';		
		content1 = content1 + '</table>';
		content1 = content1 + '<form name="form1" action="/reportFull" method="post">';	
		numberPage = parseInt(numberPage) + 1;
		if (data.last==false){
			content1 = content1 + '<br>Page number: '
			content1 = content1 + '<input name="nextFull" type="submit" value="' + numberPage + '"/>';
		}
		if (numberPage > 2){
			content1 = content1 + '<input name="lastFull" type="button" onclick="history.back()" value="Previous Page"/>';
		}		
		content1 = content1 + '</form>';
		content1 = content1 + '</body></html>';	
		response.writeHead(200, {'Content-Type': 'text/html'});		
		response.write(content1);
		response.end();    
            } catch (e) {
                console.log('Error parsing JSON!');
            }
        } else {
            console.log('Status:', res.statusCode);
        }
    });
}).on('error', function (err) {
      console.log('Error:', err);
});  
});
}



function reportMin(request,response) {
'use strict';
var https = require('https');

let info = '';
  request.on('data', partialData => {
    info += partialData;
  });
  request.on('end', () => {
    const form = querystring.parse(info);       
    var numberPage = `${form['nextMin']}`;	

	if (numberPage == 'undefined'){
		numberPage = 1;
	}

var options = {
    host: 'recruitment-test-api.devsandbox.knetikcloud.com', 
    path: '/devices?page=' + numberPage,
    headers: {'User-Agent': 'request'}
};

https.get(options, function (res) {
    var json = '';
    res.on('data', function (chunk) {
        json += chunk;
    });
    res.on('end', function () {
        if (res.statusCode === 200) {
            try {
                
		var content1 = '<!doctype html><html><head></head><body>';
		content1 = content1 + '<a href="/">Return home</a>';
		content1 = content1 + '<table border="1" cellpadding="1" cellspacing="1" style="width:800px;">';
	        content1 = content1 + '<caption><H1>List Full Devices (minimal information)</H1></caption>';
	        content1 = content1 + '<thead>';
		content1 = content1 + '<tr>';
		content1 = content1 + '<th scope="col">Status connection</th>';
		content1 = content1 + '<th scope="col">Location</th>';
		content1 = content1 + '<th scope="col">Update at</th>';
		content1 = content1 + '</tr>';
		content1 = content1 + '</thead>';
		content1 = content1 + '<tbody>';
		var data = JSON.parse(json);    

	
			for(var i=0;i<data.content.length;i++){
				content1 = content1 + '<tr>';
				if (data.content[i].connected==true)
				{
					content1 = content1 + '<td><img src="https://orig00.deviantart.net/1d1b/f/2010/118/2/3/glowy_power_button_by_inkedicon.gif" width="50" height="50"></td>';
				}else
				{
					content1 = content1 + '<td><img src="http://cliparts101.com/files/956/8C7F2A17C07E3B8664EC13616C0FC3BC/Power_Button_2_States__on_off_.png" width="50" height="50"></td>';
				}
				content1 = content1 + '<td>' + data.content[i].location + '</td>';
				content1 = content1 + '<td>' + data.content[i].updated_at + '</td>';
				content1 = content1 + '</tr>';
 			}
			
		content1 = content1 + '</tbody>';
		content1 = content1 + '<form name="form1" action="/reportMin" method="post">';	
		numberPage = parseInt(numberPage) + 1;
		if (data.last==false){
			content1 = content1 + '<br>Page number: '
			content1 = content1 + '<input name="nextMin" type="submit" value="' + numberPage + '"/>';
		}
		if (numberPage > 2){
			content1 = content1 + '<input name="lastMin" type="button" onclick="history.back()" value="Previous Page"/>';
		}		
		content1 = content1 + '</form>';
		content1 = content1 + '</table>';
		content1 = content1 + '</body></html>';	
		response.writeHead(200, {'Content-Type': 'text/html'});		
		response.write(content1);
		response.end();    
            } catch (e) {
                console.log('Error parsing JSON!');
            }
        } else {
            console.log('Status:', res.statusCode);
        }
    });
}).on('error', function (err) {
      console.log('Error:', err);
});  
});
}



function reportFilter(request,response) {
  let info = '';
  request.on('data', partialData => {
    info += partialData;
  });
  request.on('end', () => {
    const form = querystring.parse(info);    
    var numberPage = `${form['nextFilter']}`;	

	if (numberPage == 'undefined'){
		numberPage = 1;
	}

    const location = `${form['location']}`;
    const pLocation = `${form['pLocation']}`;
    const connected = `${form['connected']}`;   
    //location Solo vale en este contexto var o const

    if (location == 'S' && pLocation == 'S'){
    	var path = 'connected:' + connected + '&page=' + numberPage;
	var report = 'Connected = ' + connected ;
    }
    if (location == 'S' && connected == 'S'){
    	var path = 'parent_location:' + pLocation + '&page=' + numberPage;
	var report = 'Parent Location = ' + pLocation;
    }
    if (pLocation == 'S' && connected == 'S'){
    	var path = 'location:' + location + '&page=' + numberPage;
	var report = 'Location';
    }

'use strict';
var https = require('https');

var options = {
    host: 'recruitment-test-api.devsandbox.knetikcloud.com', 
    path: '/devices?filter=' + path,
    headers: {'User-Agent': 'request'}
};

https.get(options, function (res) {
    var json = '';
    res.on('data', function (chunk) {
        json += chunk;
    });
    res.on('end', function () {
        if (res.statusCode === 200) {
            try {
                
		var content1 = '<!doctype html><html><head></head><body>';
		content1 = content1 + '<a href="/">Return home</a>';
		content1 = content1 + '<table border="1" cellpadding="1" cellspacing="1" style="width:800px;">';
	        content1 = content1 + '<caption><H1>List Devices by Filter: ' + report + '</H1></caption>';
	        content1 = content1 + '<thead>';
		content1 = content1 + '<tr>';
		content1 = content1 + '<th scope="col">Status connection</th>';
		content1 = content1 + '<th scope="col">Location</th>';
		content1 = content1 + '<th scope="col">Update at</th>';
		content1 = content1 + '</tr>';
		content1 = content1 + '</thead>';
		content1 = content1 + '<tbody>';
		var data = JSON.parse(json);           
		for(var i=0;i<data.content.length;i++){
			content1 = content1 + '<tr>';
			if (data.content[i].connected==true)
			{
				content1 = content1 + '<td><img src="https://orig00.deviantart.net/1d1b/f/2010/118/2/3/glowy_power_button_by_inkedicon.gif" width="50" height="50"></td>';
			}else
			{
				content1 = content1 + '<td><img src="http://cliparts101.com/files/956/8C7F2A17C07E3B8664EC13616C0FC3BC/Power_Button_2_States__on_off_.png" width="50" height="50"></td>';
			}
			content1 = content1 + '<td>' + data.content[i].location + '</td>';
			content1 = content1 + '<td>' + data.content[i].updated_at + '</td>';
			content1 = content1 + '</tr>';
 		}	
		
		content1 = content1 + '</tbody>';

		content1 = content1 + '<form name="form1" action="/reportFilter" method="post">';	
		numberPage = parseInt(numberPage) + 1;
		if (data.last==false){
			content1 = content1 + '<br>Page number: '
			content1 = content1 + '<input name="nextFilter" type="submit" value="' + numberPage + '"/>';
			content1 = content1 + '<input name="location" type="hidden" value="' + location + '"/>';
			content1 = content1 + '<input name="pLocation" type="hidden" value="' + pLocation + '"/>';
			content1 = content1 + '<input name="connected" type="hidden" value="' + connected + '"/>';
		}
		if (numberPage > 2){
			content1 = content1 + '<input name="lastFilter" type="button" onclick="history.back()" value="Previous Page"/>';
		}		
		content1 = content1 + '</form>';

		content1 = content1 + '</table>';
		content1 = content1 + '</body></html>';	
		response.writeHead(200, {'Content-Type': 'text/html'});		
		response.write(content1);
		response.end();    
            } catch (e) {
                console.log('Error parsing JSON!');
            }
        } else {
            console.log('Status:', res.statusCode);
        }
    });
}).on('error', function (err) {
      console.log('Error:', err);
});  


  });	//este es el final de formulario
  
}
     

console.log('Servidor web iniciado');