$(function() {
	tchSubTempFrame.alarmAdd = {};
	
	// init
	tchSubTempFrame.alarmAdd.init = function(){
		getStudentlistByT();
		getAlarmInfo();
	}
	tchSubTempFrame.alarmAdd.init();	 
});

/* 根据班主任，获取学生列表 */
function getStudentlistByT(){
	var para = {
			scid : localStorage.getItem('TCH_scid'),
			class_no : localStorage.getItem('TCH_class_no'),
			school_year : localStorage.getItem('TCH_school_year')
		};
	getAjaxPostData("/tch/getAddressBookStudentsList.do?", para, true, function(data){
		var optshtml='';
		if (data.resultcode == '0000') {
			var user_id = localStorage.getItem('TCH_id');
			for (var i = 0; i < data.result.length; i++) {
				if(user_id != data.result[i].user_id){
					optshtml+='<li data-userid="'+data.result[i].user_id+'">'+data.result[i].user_name+'</li>';
					student_list_all.push({"user_id" : data.result[i].user_id});
				}
			}
			$("#selectwrapper ul").html(optshtml);
		} else {
			commonAlert('<strong>目录信息</strong><br />连接失败。', false,
					null, null); 
			return;
		}
	});
}

/* 获取提醒信息 */
function getAlarmInfo(){
	var params = {
			aid : cts_getParameter("key"),
			scid: localStorage.getItem('TCH_scid'),
			user_id: localStorage.getItem('TCH_id')
		}
	
	// 获取提醒详细信息
	getAjaxPostData("tch/getAlarmInfo.do?", params, true, function(data){
		if(data.resultcode == '0000'){
			$("#title").val(data.result.title);
			$("#memo").val(data.result.memo);
			if(data.result.fileList && data.result.fileList.length > 0){
				
				data.result.fileList.forEach(function(file){
					var lastO=file.filename.lastIndexOf('.');
					if(/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.filename.substring(lastO,file.filename.length))){
						var _attrnum = attrnum++;
						var filehtml='';
						filehtml+='<div class="am-margin-bottom-sm upload-item"><div class="am-g am-margin-bottom-xs"><div class="am-u-sm-9">';
						filehtml+=file.filename;
						filehtml+='</div><div class="am-u-sm-3"><button type="button" class="am-btn am-btn-danger am-btn-xs am-fr am-radius" onclick="uidel(this)">删除</button></div></div><div class="am-progress am-progress-xs"><div id="attr_'+_attrnum+'" class="am-progress-bar" style="width: 100%"></div></div></div>';
						$('#uploadwapper').append(filehtml);
						$('#attr_'+_attrnum+'').attr('data-filepath',file.filepath+file.filename);// 保存上传文件后返回的附件地址
					}
				})
			}
		}else{
			//失败处理.
			commonAlert('处理失败', false , null, null);
			return;
		}
	});
}


var student_list = [],//上传学生列表
student_list_all = [];//所有学生列表缓存（全选时用）
tchSubTempFrame.alert = $('#tch_alarmadd_alert');
var attrnum=0;//添加附件标记--全局变量
var url_addalarm = '/tch/addAlarmMyClass.do';


/** 删除学生 */
function studentlistremove(val){
	for (var i = 0; i < student_list.length; i++) {
        if (student_list[i].user_id == val){
        	student_list.splice(i, 1);
        }
    }
}
/***************************************/
/** 上传进度条 */
function onprogress(evt){
    var loaded = evt.loaded;                  //已经上传大小情况 
    var tot = evt.total;                      //附件总大小 
    var per = Math.floor(100*loaded/tot);      //已经上传的百分比  
    $('#attr_'+attrnum+'').css("width" , per +"%");
}
/** 保存上传文件后返回的附件地址 */
function savefile(path,num,file_path){
	 $('#attr_'+num+'').data('filepath',file_path);
	 $('#attr_'+num+'').data('filepathlocal',path);
}
/** 删除附件 */
function uidel(elem){
	$(elem).parents('.upload-item').remove();
}
/***************************************/
/** Ajax提交表单 */
function ajaxsubmit(){
	if($('#mainform').validator('isFormValid')){
		
		if(student_list.length==0){
			$("#studentlisttxt").removeClass("am-field-valid");
			$("#studentlisttxt").addClass("am-field-error");
			return false;
		}
		
		commonAlert("确认提交吗？",true,function(){
			var title = $('#title').val(),
			memo = $('#memo').val(),
			scid = localStorage.getItem('TCH_scid'),
			class_no = localStorage.getItem('TCH_class_no'),
			school_year = localStorage.getItem('TCH_school_year'),
			user_id = localStorage.getItem('TCH_id'),
			value_user_type = localStorage.getItem('TCH_teacher_type'),
			subject_id = $("#subjectlist").val(),
			class_list = [],
			filelist = $('#uploadwapper .am-progress-bar[data-filepath]'),
		    file_list = [];
    		 filelist.each(function(){
    			 file_list.push({"file_path" : $(this).data('filepath')});
    		 });
    		//================ 提交数据到后台
    		 var para = {
    	    				scid : scid,
    						class_no : class_no,
    						school_year : school_year,
    						user_id : user_id,
    						title : title,
    						memo : memo,
    						student_list : student_list,
    						file_list : file_list
    	    			};	
   	        		
    		getAjaxData(url_addalarm,"post", para,function(data){
    			var optshtml='';
    			if (data.resultcode == '0000') {
//    				lockScreen();
//    				tchSubTempFrame.alert
//					.find('.desc')
//					.html(
//							'添加成功！');
//    				tchSubTempFrame.alert.fadeIn();
    				
    				commonAlert('添加成功！',
							false, function(){
    					location.href = "/weixin/alarm.html?code="+localStorage.getItem("TCH_wx_code");
    				}, null);

    			} else {
    				commonAlert('添加失败！',
							false, null, null);
					return;
    			}
    		},null);
		});
	}else{
		if(student_list.length==0){
			$("#studentlisttxt").removeClass("am-field-valid");
			$("#studentlisttxt").addClass("am-field-error");
		}
	}
}

/** 微信端关闭浏览器 */
var readyFunc = function onBridgeReady() {
	var curid;
	var curAudioId; 
	var playStatus = 0;

// 关闭当前webview窗口 - closeWindow
document.querySelector('#tch_alarmadd_alert_ok_btn')
		.addEventListener('click', function(e) {
			WeixinJSBridge.invoke('closeWindow', {}, function(res) {
				// alert(res.err_msg);
			});
		});
}
if (typeof WeixinJSBridge === "undefined") {
	document.addEventListener('WeixinJSBridgeReady', readyFunc, false);
} else {
	readyFunc();
}

$(function() {		
	//表单验证
	$('#mainform').validator();

	//全选按钮事件
	$("#chk_selectAll").on('click',function(e){
		if($("#chk_selectAll").is(':checked')){
			$("#selectwrapper li i").remove();
			$("#selectwrapper li").append('<i class="am-icon-check am-fr am-text-success"></i>');
			$("#spn_selectednum_alarm").text($("#selectwrapper li").length);
			student_list = student_list_all.concat();
		}else{
			$("#selectwrapper li i").remove();
			$("#spn_selectednum_alarm").text(0);
			student_list=[];
		}
	});
	
	//上传组件
	$('#doc-form-file').on('change', function() {
		var file = this.files[0];	
		var _file_path = $(this).val();
		//文件格式判断
		if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(_file_path)){
			commonAlert('只支持图片格式文件上传！',false, null, null);
			$(this).val('');//清空file
			return false;
		}
		//文件大小判断
		if(file.size / 1024 > 2000){
			commonAlert('文件不能超过2M！',false, null, null);
			$(this).val('');//清空file
			return false;
		}
		//是否已经上传判断
		var isupload = false;
		if(!iosCheck()){			
			$('#uploadwapper .am-progress-bar').each(function(){
				 if($(this).data('filepathlocal')==_file_path){
					commonAlert('该文件已上传！',false, null, null);
					isupload = true;
					return;
				 }
			});			
		}	
		if(isupload){
			$(this).val('');//清空file
			return;
		}
		
	    var _attrnum = attrnum++;
		var filehtml='';
		filehtml+='<div class="am-margin-bottom-sm upload-item"><div class="am-g am-margin-bottom-xs"><div class="am-u-sm-9">';
		filehtml+=file.name;
		filehtml+='</div><div class="am-u-sm-3"><button type="button" class="am-btn am-btn-danger am-btn-xs am-fr am-radius" onclick="uidel(this)">删除</button></div></div><div class="am-progress am-progress-xs"><div id="attr_'+_attrnum+'" class="am-progress-bar"></div></div></div>';
		$('#uploadwapper').append(filehtml);
		$('#attr_'+_attrnum+'').data('filepathlocal',_file_path);//保存文件本地路径，避免重复上传
	    var formData = new FormData();
	    formData.append("uploadInputFile" , file);
	    formData.append("userId",localStorage.getItem('TCH_id'));
	    $(this).val('');//清空file
	    $.ajax({
	        type: "POST",
	        url: "/tch/fileUpload.do",
	        data: formData ,
	        processData : false,  
	        //必须false才会自动加上正确的Content-Type   
	        contentType : false , 
	        xhr: function(){
	             var xhr = $.ajaxSettings.xhr();
	             if(onprogress && xhr.upload) {
	                 xhr.upload.addEventListener("progress" , function(evt){
	                	 var loaded = evt.loaded;                  //已经上传大小情况 
	                	    var tot = evt.total;                      //附件总大小 
	                	    var per = Math.floor(100*loaded/tot);      //已经上传的百分比  
	                	    $('#attr_'+_attrnum+'').css("width" , per +"%");
	                 }, false);
	                 return xhr;
	             }
	         },
	         success:function(data){
	        	 $('#attr_'+_attrnum+'').attr('data-filepath',data.result);// 保存上传文件后返回的附件地址
	         }   
	     });
	});
    //被提醒人选择页面滚动插件
	var myScroll = this.iScroll = new $.AMUI.iScroll('#selectwrapper', {click: true});
	//被提醒人选择页面打开事件
	$("#studentlisttxt").on('click',function(e){		
		$("#my-popup").modal();
		myScroll.refresh();
	});
	//被提醒人选择页面关闭事件
	$("#btn_close_alarm").on('click',function(e){
		if(student_list.length>0){
			$('#studentlisttxt').val('已选中'+student_list.length+'个');
			$("#studentlisttxt").removeClass("am-field-error");
			$("#studentlisttxt").addClass("am-field-valid");
		}else{
			$('#studentlisttxt').val('');
			$("#studentlisttxt").removeClass("am-field-valid");
			$("#studentlisttxt").addClass("am-field-error");
		}
		$("#my-popup").modal('close');
	});
	//被提醒人选择、取消事件
	$("#selectwrapper").on('click','li',function(e){
		var i = $(this).children('i');
		if(i.length==0){
			$(this).append('<i class="am-icon-check am-fr am-text-success"></i>');
			$("#spn_selectednum_alarm").text(parseInt($("#spn_selectednum_alarm").text())+1);
			student_list.push({"user_id" : $(this).data('userid')});
		}else{
			i.remove();
			$("#spn_selectednum_alarm").text(parseInt($("#spn_selectednum_alarm").text())-1);
			studentlistremove($(this).data('userid'))
		}
		if(student_list.length==student_list_all.length)
		{
			$("#chk_selectAll").prop("checked",true);
		}else{
			$("#chk_selectAll").prop("checked",false);
		}
	});


});
