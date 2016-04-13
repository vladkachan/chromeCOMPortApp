function init(entry) {
  $('#butBrushChng').click(butBrushChng_clk);
  $('#cnvs').load(initcnvs);
  $('#cnvs').click(cnvs_mDown);
  $('#cnvs').init(initcnvs);
}


var brash="pen";
var ctx,point;
var scale=25;
var cnvsPositionX,cnvsPositionY;


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
	  //console.dir(document.getElementById('cnvs'));
	};

function cnvs_mDown(e){
      action = "down";
      point = [e.pageX-cnvsPositionX, e.pageY-cnvsPositionY];
	  var pointY=(point[1]-point[1]%scale);
	  var pointX=(point[0]-point[0]%scale);
	  if(brash == "pen")
	  {
		ctx.fillRect(pointX, pointY, scale, scale);
	  }
	  else{
		ctx.clearRect(pointX, pointY, scale, scale);
	  }
};

$(document).ready(init);