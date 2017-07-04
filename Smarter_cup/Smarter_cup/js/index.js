(function() {
	var data_x = {}
	var data_y = {}
	var data_z = {}
	var Weight_h = {}
	var Water_Date = {}
	var Water_hight = 17;
	var temp_water_height = 17;
	var Cup_hight = 17;
	var temp_y = 0;
	var Timer_num = 1;
	var open_cup = false;

  //var myFirebaseRef = new Firebase("https://realtaiwanstat.firebaseio.com");
  //myFirebaseRef.child("water").limitToLast(1).on("child_added", function(snapshot) {
  //    var raw = snapshot.val();  
  //    var data = JSON.parse(raw);
  //d3.json('http://chihsuan.github.io/data/data.json', function(error, data) {
	  //ExcelRead();
	  visualize();
      getData();
	  
  //);
  
  var requestId = 0;
  setInterval(function() {
	  if(!requestId)
	  {
		  Csv_out();
		  requestId = window.requestAnimationFrame(getData);
	  }
  },15000);
  
  function Csv_out(){
		/*var fileName = "ooooo.csv";//匯出的檔名
		var data = Water_Date;
		var num = Water_hight;
		var blob = new Blob(
			[data], {type : "application/octet-stream"}
		);
		var href = URL.createObjectURL(blob);
		var str = "a";
		
		var link = document.createElement(str);
			document.body.appendChild(link);
			link.href = href;
			link.download = fileName;
			link.click();*/
		
		var data = [[Water_Date, Water_hight]];
		var csvContent = "data:text/csv;charset=utf-8,";
		
		data.forEach(function(infoArray, index){

		dataString = infoArray.join(",");
		csvContent += index < data.length ? dataString+ "\n" : dataString;

		}); 
		var encodedUri = encodeURI(csvContent);
		/*var link = document.createElement("a");
			link.setAttribute("href", encodedUri);
			link.setAttribute("download", "my_data.csv");
			document.body.appendChild(link); // Required for FF

			link.click(); // This will download the data file named "my_data.csv".*/
		console.log('CSV_OUTPUT');
  }
 
  function getData(){
			//requestId =window.requestAnimFrame(this.animate.bind(this));//刷新動畫
			//visualize();//呼叫畫圖的涵式
			//update();	
			//document.write(Water_hight);  
			
			console.log('\n')
			//X軸
			fetch('https://api.thingspeak.com/channels/270368/fields/1.json?results=1', {method: 'GET'})
			.then(res => {return res.json()})
			.then(res => {data_x = res
						console.log('X_axis = ',data_x["feeds"][0]["field1"])})
			.catch(err => {console.log(err)})

			//Y軸
			fetch('https://api.thingspeak.com/channels/270368/fields/2.json?results=1', {method: 'GET'})
			.then(res => {return res.json()})
			.then(res => {data_y = res
						console.log('Y_axis = ',data_y["feeds"][0]["field2"])
						temp_y = data_y["feeds"][0]["field2"];})
			.catch(err => {console.log(err)})

			//Z軸
			fetch('https://api.thingspeak.com/channels/270368/fields/3.json?results=1', {method: 'GET'})
			.then(res => {return res.json()})
			.then(res => {data_z = res
						console.log('Z_axis = ',data_z["feeds"][0]["field3"])})
			.catch(err => {console.log(err)})

			//水高
			fetch('https://api.thingspeak.com/channels/270368/fields/4.json?results=1', {method: 'GET'})
			.then(res => {return res.json()})
			.then(res => {Weight_h = res
						console.log('Weight_Height = ',Weight_h["feeds"][0]["field4"])
						temp_water_height = Weight_h["feeds"][0]["field4"];
						Water_Date = Weight_h["feeds"][0]["created_at"];
						console.log('Date = ', Water_Date)})//將得到的值存起來以供水滴使用
			.catch(err => {console.log(err)})
			//延遲15秒與thingspeak同步
			
			if(open_cup == true)
			{
				//過濾極大誤差值
				if(temp_water_height <= Cup_hight)
				{
					Water_hight = temp_water_height;
				}
				open_cup = false;
			}
			
			if(temp_y < -1.1 || temp_y > -1.0)
			{
				open_cup = true;
			}
			
			visualize();
			
			requestId = 0;
}

  function visualize () {
	  d3.selectAll("svg > *").remove();//每次呼叫svg就會清空畫面
//    configs = {};
  //  for (var reservoirName in data) {
       var reservoirName = 0 ;
       var percentage = 20.0 ;
	   
	   percentage = ( ( Cup_hight - Water_hight )  / Cup_hight ) * 100;
//       var updateAt = data[reservoirName].updateAt;
//       var volumn = data[reservoirName].volumn;
       var id = "reservoir0";
//       var netFlow = -parseFloat(data[reservoirName].daliyNetflow).toFixed(1);
 //      var netPercentageVar;
       
       if (isNaN(percentage)) {
         $('#'+id).parent().remove();
//         continue;
       }
/*      
       if (isNaN(netFlow)) {
          $('#'+id).siblings('.state')
                  .children('h5')
                  .text('昨日水量狀態：待更新');
          $('#'+id).siblings('.state').removeClass();
       }
       else if (netFlow < 0) {
         netPercentageVar = ((-netFlow) / 
            parseFloat(data[reservoirName].baseAvailable)*100).toFixed(2);
         
         var usageDay = Math.round(percentage/netPercentageVar);
         if (data[reservoirName].percentage > 80 && netPercentageVar > 2) {
            usageDay = 60; 
         }
        
         if (usageDay >= 60) {
            usageDay = '預測剩餘天數：60天以上';
         }
         else if (usageDay >= 30) {
            usageDay = '預測剩餘天數：30天-60天';
            $('#'+id).siblings('.dueDay').addClass('red');
         }
         else {
            usageDay = '預測剩餘天數：' + usageDay + '天';
            $('#'+id).siblings('.dueDay').addClass('red');
         }

         $('#'+id).siblings('.dueDay')
                  .children('h5')
                  .text(usageDay);

         $('#'+id).siblings('.state')
                  .children('h5')
                  .text('昨日水量下降：'+ netPercentageVar + '%');
         $('#'+id).siblings('.state').addClass('red');
       }
       else {
         netPercentageVar = ((netFlow) / 
             parseFloat(data[reservoirName].baseAvailable)*100).toFixed(2);
         
         $('#'+id).siblings('.state')
                  .children('h5')
                  .text('昨日水量上升：'+ netPercentageVar + '%');
         $('#'+id).siblings('.state').addClass('blue');
       }
*/ 

       configs = liquidFillGaugeDefaultSettings();
	   configs.waveAnimate = true;
       configs.waveAnimateTime = setAnimateTime(percentage);
       configs.waveOffset = 0.3;
       configs.waveHeight = 0.05;
       configs.waveCount = setWavaCount(percentage);
       setColor(configs, percentage);

       // $('#'+id).siblings('.updateAt').html('<h5>更新時間：'+updateAt+'</h5>');
       // $('#'+id).siblings('.volumn').children('h5').text('有效蓄水量：'+volumn+'萬立方公尺');
       loadLiquidFillGauge(id, percentage, configs);
    

    function setColor(config, percentage) {
      if (percentage < 25) {
        config.circleColor = "#FF7777";
        config.textColor = "#FF4444";
        config.waveTextColor = "#FFAAAA";
        config.waveColor = "#FFDDDD";
      }
      else if (percentage < 50) {
        config.circleColor = "rgb(255, 160, 119)";
        config.textColor = "rgb(255, 160, 119)";
        config.waveTextColor = "rgb(255, 160, 119)";
        config.waveColor = "rgba(245, 151, 111, 0.48)";
      }
    }

    function setWavaCount(percentage) {
      if (percentage > 75) {
        return 3;
      }
      else if (percentage > 50) {
        return 2;
      }
      return 1;
    }

    function setAnimateTime(percentage) {
       if (percentage > 75) {
        return 2000;
      }
      else if (percentage > 50) {
        return 3000;
      }
      else if (percentage > 25) {
        return 4000;
      }
      return 5000;
    }
  }
  
  function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

})();
