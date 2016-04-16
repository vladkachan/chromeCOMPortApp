function init(entry) {
  $('#butBrushChng').click(butBrushChng_clk);
  $('#cnvs').load(initcnvs);
  $('#cnvs').click(cnvs_mDown);
  $('#cnvs').init(initcnvs);
  $('#port').click(findPorts);
  $('#connect').click(toConnect);
  $('#stop-connection').click(disconnect);
  chrome.serial.onReceive.addListener(onReceiveCallback);
  $('#send').click(printing);
  $('#right').click(moveRightB);
  $('#left').click(moveLeftB);
  $('#up').click(moveUpB);
  $('#down').click(moveDownB);
}

var dotArray;
var brash="pen";
var ctx,point;
var scale=25;
var cnvsPositionX,cnvsPositionY;
var connectionId;
var step=15;
var arrX,arrY,doing="non";

var onReceiveCallback = function(info) {
    if (info.connectionId == connectionId && info.data) {
    	var data = info.data;
        data = new Uint8Array(data);
        console.dir(data);
        $('h2').html(data[0]);
        console.log(doing);
        if(doing!="non")
        {
        	printing();
        }
    }
};


function moveRightB(){
	moveRight(document.getElementById('mRight').value);	
}

function moveLeftB(){
	moveLeft(document.getElementById('mLeft').value);	

}

function moveUpB(){
	moveUp(document.getElementById('mUp').value);
}

function moveDownB(){
	moveDown(document.getElementById('mDown').value);
}

function moveRight(param){
	if(!document.getElementById('reverseM').checked)
	{
		sendInf(String.fromCharCode(1,param));
	}else
	{
		sendInf(String.fromCharCode(2,param));
	}
}

function moveLeft(param){
	if(document.getElementById('reverseM').checked)
	{
		sendInf(String.fromCharCode(1,param));
	}else
	{
		sendInf(String.fromCharCode(2,param));
	}
}

function moveUp(param){
	sendInf(String.fromCharCode(3,param));
}

function moveDown(param){
	sendInf(String.fromCharCode(4,param));
}

function sendInf(str){
	chrome.serial.send(connectionId, convertStringToArrayBuffer(str), function(){});

}
function starPrnt(){
	doing="non";
	printing();
}
function printing(){
	console.log(doing);
		switch(doing)
		{
			case "non":
				arrX=0;
				arrY=0;
				doing="move";
				console.log(doing);
				traectoryMove();
			break
			case "move":
				doing="put";
				moveDown(250);
			break
			case "put":
				doing ="up";
				moveUp(200);
			break;
			case "up":
				doing="move";
				traectoryMove();
			break
		}
		console.log(doing);
}

function traectoryMove()
{
	//for(i=0;i<16;i++)
	//{
	for(ii=arrX+1;ii<16;ii++)
		{
			if(dotArray[0][ii]==1){
				moveRight((ii-arrX)*step);
				arrX=ii;
				break;
			}
		}
		if(ii==15)
		{
			doing="non";
		}
	//}
}


var convertStringToArrayBuffer=function(str) {
  var buf=new ArrayBuffer(str.length);
  var bufView=new Uint8Array(buf);
  for (var i=0; i<str.length; i++) {
    bufView[i]=str.charCodeAt(i);
  }
  return buf;
}


function disconnect(){
	if(connectionId)
	{
		chrome.serial.disconnect(connectionId, onDisconnect);
		connectionId=null;
	}else{
		$('h2').html("Has no connection");
		console.log("not connected");
	}
}




function toConnect(){
	if(connectionId){
		$('h2').html("Disconnect first");
		return;
	}
	var opts = {
        bitrate: Number(document.getElementById('bitrate').value),
        dataBits: document.getElementById('dataBits').value,
        parityBit: document.getElementById('parityBit').value,
        stopBits: document.getElementById('stopBits').value,
    }
    var path=document.getElementById('port').value;
	chrome.serial.connect(path, opts, function(connectionInfo) {
        if (connectionInfo) {
            connectionId=connectionInfo.connectionId;
            $('h2').html("Connected");
        } else {
            $('h2').html("Try one more time");
        }
    });

}

var onDisconnect = function(result) {
  if (result) {
    console.log("Disconnected from the serial port");
    $('h2').html("Disconnected");
  } else {
  	$('h2').html("Disconnect failed");
    console.log("Disconnect failed");
  }
}


function findPorts(){
	//clear portlist
	var select = document.getElementById("port");
	var length = select.options.length;
	for (i = 0; i < length; i++) {
  		select.options[i] = null;
	}
	chrome.serial.getDevices(onGetDevices);
}

var onGetDevices = function(ports) {
  for (var i=0; i<ports.length; i++) {
    var option = document.createElement("option");
	option.text = ports[i].path;
	document.getElementById('port').add(option);
  }
}

function butBrushChng_clk() {
    $('textarea').val("qwer");
    if(brash == "pen")
		{
			brash="erase";
			document.getElementById('butBrushChng').value="Pen";
		}
		else
		{
			brash="pen";
			document.getElementById('butBrushChng').value="Eraser";
		}
}

function initcnvs(){
      ctx = document.getElementById('cnvs').getContext('2d');
      ctx.globalAlpha = 1;
	  ctx.lineWidth = 10;
	  cnvsPositionX=document.getElementById('cnvs').offsetLeft;
	  cnvsPositionY=document.getElementById('cnvs').offsetTop;
	  dotArray=new Array(16);
	  for(i=0;i<dotArray.length;i++)
	  {
	  	dotArray[i]= new Array(16).fill(0);
	  }
	};

function cnvs_mDown(e){
      action = "down";
      point = [e.pageX-cnvsPositionX, e.pageY-cnvsPositionY];
	  var pointY=(point[1]-point[1]%scale);
	  var pointX=(point[0]-point[0]%scale);
	  if(brash == "pen")
	  {
		ctx.fillRect(pointX, pointY, scale, scale);
		dotArray[pointY/scale][pointX/scale]=1;
	  }
	  else{
		ctx.clearRect(pointX, pointY, scale, scale);
		dotArray[pointY/scale][pointX/scale]=0;
	  }
};



$(document).ready(init);