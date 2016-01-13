
/**
 * @author limchul

 */
function checkBrowerType(){
	var type = navigator.userAgent;
	//alert("type:"+type);
	if(type.toLowerCase().indexOf("chrome") > -1){
		return "chrome";
	}
	if(type.toLowerCase().indexOf("firefox") > -1){
		return "firefox";
	}
	if(type.toLowerCase().indexOf("safari") > -1){
		return "safari";
	}
	if(type.toLowerCase().indexOf("msie") > -1){
		return "msie";
	}
	return false;
}
////true이면 패스 false이면 설치유도
//function checkStartPlayer(ProgId) {
//	var isInstall = false;
//	try {
//		var obj;
//		var browType =checkBrowerType() ; 
//		if (browType == 'msie') {
//			obj = new ActiveXObject(ProgId);
//		}else if(browType == 'chrome'){
//			obj = navigator.plugins.StarPlayer;
//		}
//		if (obj)
//			return true;
//	} catch (e) {
//		return false;
//	}
//	return false;
//}
function getBrowerheight(){
	var type = navigator.userAgent;
	//alert("type:"+type);
	if(type.toLowerCase().indexOf("chrome") > -1){
		return "chrome";
	}
	if(type.toLowerCase().indexOf("firefox") > -1){
		return "firefox";
	}
	if(type.toLowerCase().indexOf("safari") > -1){
		return "safari";
	}
	if(type.toLowerCase().indexOf("msie") > -1){
		return "msie";
	}
	return false;
}


function getAjaxPostData(url, paramData){
	console.debug(paramData);
	var result;
	$.ajax({
		type: "POST",
		url: url,
		dataType: "json",
		cache: false,
		async: false,
		data: paramData,
		success: function(jsonData){
//			console.debug(jsonData);
			result = jsonData;	
		},
		error:function (xhr, ajaxOptions, thrownError){
//			 console.debug(xhr.status + "\nstatusText:" + xhr.statusText + "\nxhr.responseText:"+ xhr.responseText +"\nthrownError:" +thrownError);
			 result = { result: "FAIL"};
			 return result;
		},
		complete: function() {

		}
	});
	return result;
}
function getAjaxGetData(url, paramData){
	var result;
	console.debug(url);
	console.debug(paramData);
	$.ajax({
		type: "GET",
		url: url,
		dataType: "json",
		cache: false,
		async: false,
		data: paramData,
		success: function(jsonData){
			result = jsonData;
		},
		error:function (xhr, ajaxOptions, thrownError){
//			alert(xhr.status + "\nstatusText:" + xhr.statusText + "\nxhr.responseText:"+ xhr.responseText +"\nthrownError:" +thrownError);
			return;
		}   
	});
	return result;
}
function asyncLogData(param){
	$.ajax({
		type: "POST",
		url: "/qsc/isnertLog.do",
		dataType: "json",
		cache: false,
		async: false,
		data: param,
		success: function(jsonData){
			result = jsonData;	
		},
		error:function (xhr, ajaxOptions, thrownError){
//			console.debug(xhr.status + "\nstatusText:" + xhr.statusText + "\nxhr.responseText:"+ xhr.responseText +"\nthrownError:" +thrownError);
			 result = { result: "FAIL"};
		},
		complete: function() {
			return result;
		}
	});
	return result;
}

function isJsonObject(obj){
	if (typeof obj == "object" && obj.length > 0) {
		return true;
	}
	return false;
}
	
function checkLength(str, length){
	if(str.length > length){
		return str.substring(0,length);
	}
	return str;
}


	
	/* */
Array.prototype.remove = function(idx){
	   var temp = new Array();
	   var i = this.length;

	   while(i > idx){
	       var kk = this.pop();
	       temp.push(kk);

	       i--;
	   }

	   for(var i=temp.length - 2; i>=0; i--){
	       this.push(temp[i]);
	   }
}
String.prototype.trim = function() {
	return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}
function replaceAll(str, src1, src2) {
	str = str.split(src1).join(src2);  
	return str;
}
function getCookie( name ) {
	var nameOfCookie = name + "=";
	var x = 0;
	while ( x <= document.cookie.length ) {
		var y = (x+nameOfCookie.length);
		if ( document.cookie.substring( x, y ) == nameOfCookie ) {
			if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
				endOfCookie = document.cookie.length;
			return unescape( document.cookie.substring( y, endOfCookie ) );
		}
		x = document.cookie.indexOf( " ", x ) + 1;
		if ( x == 0 )  break;
	}
	return "";
}
function setCookie( name, value, expiredays ){
	var todayDate = new Date();
	todayDate.setDate( todayDate.getDate() + expiredays );
	document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";"
}

function Request(valuename)    //javascript로 구현한 Request
{
    var rtnval = "";
    var nowAddress = unescape(location.href);
    var parameters = (nowAddress.slice(nowAddress.indexOf("?")+1,nowAddress.length)).split("&");
   
    for(var i = 0 ; i < parameters.length ; i++){
        var varName = parameters[i].split("=")[0];
        if(varName.toUpperCase() == valuename.toUpperCase())
        {
            rtnval = parameters[i].split("=")[1];
            break;
        }
    }
    return rtnval;
}
function Request2(valuename)    //javascript로 구현한 Request
{
    var rtnval = "";
    var nowAddress = location.href;
    var parameters = (nowAddress.slice(nowAddress.indexOf("?")+1,nowAddress.length)).split("&");
   
    for(var i = 0 ; i < parameters.length ; i++){
        var varName = parameters[i].split("=")[0];
        if(varName.toUpperCase() == valuename.toUpperCase())
        {
            rtnval = parameters[i].split("=")[1];
            break;
        }
    }
    return rtnval;
}



//ids = id들의 배열
//values = value들의 배열
//ex)  "{id:"+"'page4obj1'"+"}"
function makeJsonStr(ids,values,type){
	if(type == '배열'){
//		console.debug(type);
//		ids = ['id','name','test'];
//		values = ['vid','vname','vtest'];
	}else if(type == '구분자'){
		
//		console.debug(type);
//		ids = "id*name-test";
//		values = "vid$vname^vtest";
		
		var p = /[\/\,\$\^\*]/gi;
		
		ids = ids.split(p);
		values = values.split(p);
		
		console.debug("asd :" + ids);
		console.debug("asdss :" + values);
		
	}else if(type == 'canvas'){
//		console.debug(type);
//		ids = "id*name-test";
//		values = "vid$vname^vtest";
		
		var p = ",,";
		ids = ids.split(p);
		values = values.split(p);
		console.debug(ids);
		console.debug(values);
	}
	var length = ids.length;
	var jsonstr = '';
	for(var i=0; i < length; i++){
		jsonstr += "'"+ids[i]+"':'"+values[i]+"',";	
	}
	jsonstr = jsonstr.substring(0, jsonstr.length-1);
	jsonstr = "{"+jsonstr+"}";
	console.debug(jsonstr);
	return jsonstr;
}
function JSONtoString(object) {
	var results = "";
	for (var property in object) {
		var value = object[property];
		results = results + property.toString() + ":'" + value +"',";
	}
	results = results.substring(0,results.length-1);
	return "{"+results+"}";
}

Map = function(){
	 this.map = new Object();
};   
Map.prototype = {   
    put : function(key, value){   
        this.map[key] = value;
    },   
    get : function(key){   
        return this.map[key];
    },
    containsKey : function(key){    
     return key in this.map;
    },
    containsValue : function(value){    
     for(var prop in this.map){
      if(this.map[prop] == value) return true;
     }
     return false;
    },
    isEmpty : function(key){    
     return (this.size() == 0);
    },
    clear : function(){   
     for(var prop in this.map){
      delete this.map[prop];
     }
    },
    remove : function(key){    
     delete this.map[key];
    },
    keys : function(){   
        var keys = new Array();   
        for(var prop in this.map){   
            keys.push(prop);
        }   
        return keys;
    },
    values : function(){   
     var values = new Array();   
        for(var prop in this.map){   
         values.push(this.map[prop]);
        }   
        return values;
    },
    size : function(){
      var count = 0;
      for (var prop in this.map) {
        count++;
      }
      return count;
    }
};

function chkStrLength(lvStr) {
	var resultSize = 0;
    if (lvStr == null) return 0;
    for(var i=0; i<lvStr.length; i++){
        var c = escape(lvStr.charAt(i));
        if(c.length == 1) resultSize ++;
        else if(c.indexOf("%u") != -1) resultSize += 2;
        else if(c.indexOf("%") != -1) resultSize += c.length/3;
    }
    return resultSize;
}

function cutStr(str, limit) {
	var tmpStr = str;
	var byte_count = 0;
	var len = str.length;
	var dot = "";

	for (i = 0; i < len; i++) {
		byte_count += chr_byte(str.charAt(i));
		if (byte_count == limit - 1) {
			if (chr_byte(str.charAt(i + 1)) == 2) {
				tmpStr = str.substring(0, i + 1);
				dot = "..";
			} else {
				if (i + 2 != len)
					dot = "..";
				tmpStr = str.substring(0, i + 2);
			}
			break;
		} else if (byte_count == limit) {
			if (i + 1 != len)
				dot = "..";
			tmpStr = str.substring(0, i + 1);
			break;
		}
	}
	return tmpStr + dot;
}
function chr_byte(chr) {
	if (escape(chr).length > 4)
		return 2;
	else
		return 1;
}
	
function htmlExtendCharReplace(str){
//	str = replaceAll(str,'&','&amp;');
//	str = replaceAll(str,' ','&nbsp;');
	str = replaceAll(str,'<','&lt;');
	str = replaceAll(str,'<','&#95;');
	str = replaceAll(str,'>','&gt;');
	str = replaceAll(str,'"','&quot;');
	str = replaceAll(str,"'",'&apos;');
	return str;
}


function _404ImageToBlank(obj) {
	obj.onerror = null;
	obj.src = "../images/v2/common/lessonplan_thum.png";
}
//404발생한 Image를 Blank image로 변경
//element의 onerror attirubte에 설정
function _replace404ImageToBlank(obj) {
	
    var imgName = obj.src;
    
    // 모든 썸네일이 authortest.vivasam 으로 찾으니 처음은 author로 바꿔서 다시 보내주고, 
    if (imgName.indexOf("http://authortest.vivasam") >= 0) {
    	//obj.src = imgName.replace("http://authortest.vivasam", "http://author.vivasam");
    	imgName = imgName.replace("http://authortest.vivasam", "http://author.vivasam");
    	
    	var img = new Image();
    	
    	img.src = imgName;
    	
    	img.onerror = function(){
//    		console.debug("errrrrrrrrrrrrrrrrrrrrr");
    		obj.onerror = null;
    		obj.src = "../images/v2/common/lessonplan_thum.png";
    	}
    	img.onload = function(){
//    		console.debug("onloaddddddddddddddddd");
        	obj.src = imgName;
    	}

    }
    else if(imgName.indexOf("http://author.vivasam") >= 0){ // author로 들어왔는데 에러가 난경우이니 이경우는 에러 처리함. 
    	obj.onerror = null;
    	obj.src = "../images/v2/common/lessonplan_thum.png";
    	//obj.src = _404ImageToBlank(obj);
    	//obj.src = imgName.replace("http://author.vivasam", "http://authortest.vivasam");
    } else{
    	obj.onerror=_404ImageToBlank(obj);
    }
    

    	
}

function YouTubeRetouch(){
	$('iframe').each(function(){
		var url = $(this).attr("src"), char = url.indexOf("?") != -1 ? '&' : '?';
			if(url.indexOf("youtube") != -1){ 
			$(this).attr("src",url+char+"html5=True&wmode=transparent");
			$(this).attr("wmode","Opaque");
		}
	});
}

// hoon 
// zeroPad(1,10);   //=> 01
function zeroPad(nr,base){
  var  len = (String(base).length - String(nr).length)+1;
  return len > 0? new Array(len).join('0')+nr : nr;
}

function checkLocalStorageVal(key,val){
	var ret = localStorage.getItem(key);
	if(ret == null){
		return true;
	}else if( ret != val){
		return false;
	}else{
		return true;
	}
}
function setLocalStorageVal(key,val){
	localStorage.setItem(key, val);
	return val;
}
function getLocalStorageVal(key,val){
	return localStorage.getItem(key);
}
function getDateString(dd){
	  _date = new Date(dd);
	  _m = _date.getMonth()+1;
	  _m = _m < 10 ? ("0"+_m) : _m;
	  _d = _date.getDate();
	  _d = _d < 10 ? ("0"+_d) : _d;
	  return _m+"."+_d; 
} 
function getDateString2(dd){
	if(dd == '' || dd == null || dd == undefined) return '';
	  _date = new Date(dd);
	  _y = _date.getFullYear();
	  _m = _date.getMonth()+1;
	  _m = _m < 10 ? ("0"+_m) : _m;
	  _d = _date.getDate();
	  _d = _d < 10 ? ("0"+_d) : _d;
	  return _y+"."+_m+"."+_d; 
}




/**
 * 년(YY,YYYY), 월(MM) , 일(DD) , 시간(hh) , 분(mm)
 * @param type 형식 년월일은 대문자(YY/MM/DD) 시간은소문자 hh/mm
 * @param delimiter 사용할구분자
 * ex) getDate("YY/MM/DD" , "/") return '14/02/25'  , getDate("DD/MM/YYYY", ",") return '25,02,2014'
 * ex) getDate("hh/mm" , ";") return '11:45'  , getDate("hh/mm" , "-") return '11-45'
 */
function getJDate(type , delimiter){
    var result    = '';
    var date      = new Date();
    var typeArry  = type.split('/');

    if(typeArry == ''){
        return 'error';
    }

    for(var i in typeArry){
        if(typeArry[i] == "YYYY" || typeArry[i] == "YY"){
            if(typeArry[i].length == 2){
                result += ('0'+date.getFullYear()).substr(-2,2);
            } else{
                result += date.getFullYear();
            }
        }else if(typeArry[i] == "MM"){
            result += ('0'+(date.getMonth()+1)).substr(-2,2);
        }else if(typeArry[i] == "DD"){
            result += ('0'+date.getDate()).substr(-2,2);
        }else if(typeArry[i] == "day"){
            result += date.getDay();
        }else if(typeArry[i] == "hh"){
            result += date.getHours();
        }else if(typeArry[i] == "mm"){
            result += date.getMinutes();
        }

        if(i < typeArry.length -1){
            result += delimiter;
        }
    }
    return result;
}
