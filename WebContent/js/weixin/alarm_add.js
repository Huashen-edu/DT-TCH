$(function() {
	tchSubTempFrame.alarmAdd = {};
	
	// init
	tchSubTempFrame.alarmAdd.init = function(){
		//加载loading页面
		setTimeout(function() {
			$('.intro').fadeOut(function() {
				$('.page-center').removeClass('page-center');
				$('#m_alarm').fadeIn();
			});
		}, 1500);
		
		WXLoad(tchSubTempFrame.alert, pageinit);
	}	

	tchSubTempFrame.alarmAdd.init();	 
});

function pageinit(){
	setTeacherStatus(forminit);
//	if (localStorage.getItem('TCH_teacher_charge') != null && localStorage.getItem('TCH_teacher_charge') == "Y") {
//		url_addalarm = '/tch/addAlarmMyClass.do';
//		getStudentlistByT();
//	}else{
//		getSubjectBySY(localStorage.getObject('TCH_school_year_list')[0].school_year);
//		url_addalarm = '/tch/addAlarm.do';
//		getClasslistByT();
//	}
}
/* 根据学年，获取科目列表*/
function getSubjectBySY(school_year){
	//获取科目列表
	var subjecthtml = '',teacher_subject_list = localStorage.getObject('TCH_teacher_subject_list');
	for (var i = 0; i < teacher_subject_list.length; i++) {
		if(teacher_subject_list[i].school_year==school_year){
			subjecthtml += '<option value="'+teacher_subject_list[i].subject_id+'">'+teacher_subject_list[i].subject_name+'</option>';
		}
	}
	$("#subjectlist").html(subjecthtml);
}
/* 根据班主任，获取学生列表 */
function getStudentlistByT(){
	if(!$(".T-L").hasClass("am-hide")){
		$(".T-L").addClass("am-hide");
	}
	$(".T-T").removeClass("am-hide");
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
/* 根据科目老师，获取班级列表 */
function getClasslistByT(school_year){
	if(!$(".T-T").hasClass("am-hide")){
		$(".T-T").addClass("am-hide");
	}	
	$(".T-L").removeClass("am-hide");
	var para = {
			scid : localStorage.getItem('TCH_scid'),
			subject_id : $("#subjectlist").val(),
			user_id : localStorage.getItem('TCH_id'),
			school_year : school_year
		};
	getAjaxData("/tch/getTeacherClassListBySubjectId.do?","post", para, function(data){
		var classhtml='';
		if (data.resultcode == '0000') {
			for (var i = 0; i < data.result.length; i++) {
				classhtml+='<span class="am-badge am-radius am-text-lg am-margin-right-xs am-margin-bottom-xs" data-class_no="'+data.result[i].class_no+'" data-school_year="'+data.result[i].school_year+'">'+data.result[i].school_year+" - "+data.result[i].class_no+'</span>';
			}
			$("#classlist").html(classhtml);
		} else {
			commonAlert('<strong>目录信息</strong><br />连接失败。', false,
					null, null); 
			return;
		}
	},null);
}

var student_list = [],//上传学生列表
student_list_all = [];//所有学生列表缓存（全选时用）
tchSubTempFrame.alert = $('#tch_alarmadd_alert');
var attrnum=0;//添加附件标记--全局变量
var url_addalarm = '';
var schoolyear='';

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
		if(localStorage.getItem('TCH_teacher_status')=="L"){
			if($("#classlist .am-badge-success").length==0){
				commonAlert('请选择班级！',false, null, null);
				return false;
			}			
		}else{
			if(student_list.length==0){
				$("#studentlisttxt").removeClass("am-field-valid");
				$("#studentlisttxt").addClass("am-field-error");
				return false;
			}
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
        		 var para = {};
        		 if(localStorage.getItem('TCH_teacher_status')=="T"){
        			 para = {
        	    				scid : scid,
        						class_no : class_no,
        						school_year : school_year,
        						user_id : user_id,
        						title : title,
        						memo : memo,
        						student_list : student_list,
        						file_list : file_list
        	    			};	
        		 }else{
        			 $("#classlist span.am-badge-success").each(function(){
        				 class_list.push({"school_year" : $(this).data('school_year'),"class_no":$(this).data('class_no')});
           		  	 });
        			 para = {
        	    				scid : scid,
        	    				value_user_type : value_user_type,
        						user_id : user_id,
        						title : title,
        						subject_id : subject_id,
        						memo : memo,
        						class_list : class_list,
        						file_list : file_list
        	    			};	
        		 }
		        		
        		getAjaxData(url_addalarm,"post", para,function(data){
        			var optshtml='';
        			if (data.resultcode == '0000') {
//        				$('#my-alert .am-modal-bd').text('添加成功！');
//        				$('#my-alert').modal();
        				lockScreen();
        				tchSubTempFrame.alert
						.find('.desc')
						.html(
								'添加成功！');
        				tchSubTempFrame.alert.fadeIn();

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
function forminit(school_year){
	schoolyear=school_year;
	if (localStorage.getItem('TCH_teacher_status')=="T") {
		url_addalarm = '/tch/addAlarmMyClass.do';
		//清除学生列表
		student_list=[];
		student_list_all=[];
		$("#chk_selectAll").prop("checked",false);
		$("#studentlisttxt").val('');
		$("#spn_selectednum_alarm").text(0);
		$("#selectwrapper i").remove();
		//清除附件
		attrnum=0;
		$(".upload-item").remove();		
		//清除表单内容
		$("#title").val('');
		$("#memo").val('');
		
		getStudentlistByT();
	}else{
		//清除附件
		attrnum=0;
		$(".upload-item").remove();
		
		//清除表单内容
		$("#title").val('');
		$("#memo").val('');
		
		url_addalarm = '/tch/addAlarm.do';
		getSubjectBySY(school_year);
		getClasslistByT(school_year);
	}	
}

function formclear(){
	//清除学生列表
	student_list=[];
	$("#chk_selectAll").prop("checked",false);
	$("#studentlisttxt").val('');
	$("#spn_selectednum_alarm").text(0);
	$("#selectwrapper i").remove();
	
	//清除附件
	attrnum=0;
	$(".upload-item").remove();
	
	//清除表单内容
	$("#title").val('');
	$("#memo").val('');
}
//$(window).unload( function () { commonAlert('确定离开页面吗？',true, null, null); } );
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
		if(!/\.(gif|jpg|jpeg|png|doc|docx|txt|xls|xlsx|ppt)$/.test(_file_path.toLowerCase())){
			commonAlert('只支持图片和文档格式文件上传！',false, null, null);
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
	//班级点击事件
	$("#classlist").on('click','span',function(){
		if($(this).hasClass("am-badge-success")){
			$(this).removeClass("am-badge-success");
		}else{
			$(this).addClass("am-badge-success");
		}
	});
	$('#subjectlist').change(function(){ 
		getClasslistByT(schoolyear);
	}); 
	
//	$("#offcanvas li a").click(function(){
//		
//	})


});
