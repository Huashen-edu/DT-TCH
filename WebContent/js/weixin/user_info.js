
$(function() {
	var tchSubTempFrame = {};
	tchSubTempFrame.user_info =$('#wrapper');
	tchSubTempFrame.user_info.user_infoWrap = $('.pr_edit');
	tchSubTempFrame.user_info.alert = $('#tch_alarm_alert');
	// init
	tchSubTempFrame.user_info.init = function(){
		//$('.ctContainer').attr('data-type','user_info');
		// 初始信息 set
		//tchSubTempFrame.user_info.infoSet();

		// event bind
		//tchSubTempFrame.user_info.eventBind();
		
		tchSubTempFrame.user_info.find('.intro').show();
        setTimeout(function() {
        	tchSubTempFrame.user_info.find('.intro').fadeOut(function() {
        		tchSubTempFrame.showLogin();
            });
        }, 1500);
        // 画面初载入
        WXLoad(tchSubTempFrame.user_info.alert, tchSubTempFrame.user_info.infoSet);
	}
	
	tchSubTempFrame.showLogin = function() {
		tchSubTempFrame.user_info.removeClass('page-center');
		tchSubTempFrame.user_info.find('#container').fadeIn(function() {
    		// event bind
    		tchSubTempFrame.user_info.eventBind();
        });
    }
	// 정보 setting
	tchSubTempFrame.user_info.infoSet = function(){
		
		/*var params = {
			user_id : '100007'
		};*/
		console.log(cts_getParameter("user_id"));
		
		if(cts_getParameter("user_id") != undefined){
			var params = {
				user_id : cts_getParameter("user_id"),
				//scid : localStorage.getItem('TCH_scid')
			};
		}else{
			var params = {
				user_id : localStorage.getItem('TCH_id'),
				//	user_id : 100072,
			  	//scid : localStorage.getItem('TCH_scid'),
			  	/*school_year_list : localStorage.getItemS('TCH_school_year_list'),
			  	teacher_subject_list : localStorage.getItem('TCH_teacher_subject_list'),*/
			};
		}
		console.log(params);
		//debugger;
		getAjaxPostData('/tch/getUserPersInfo.do?', params , true, function(data){
			//debugger;
			console.log(data);
			var response = data;
			console.log(response.result.user_id);
			if(response.resultcode == '0000'){
				//debugger;
				tchSubTempFrame.user_info.user_infoWrap.find('.edit_user_id').val(response.result.user_id);
				tchSubTempFrame.user_info.user_infoWrap.find('.edit_user_name').text(response.result.user_name);
				tchSubTempFrame.user_info.user_infoWrap.find('.edit_user_national').text(response.result.national_name);
				tchSubTempFrame.user_info.user_infoWrap.find('.edit_user_originate').text(response.result.originate_name);
				tchSubTempFrame.user_info.user_infoWrap.find('.edit_user_birthday').text(response.result.birthday);
				
				//tchSubTempFrame.user_info.user_infoWrap.find('.edit_user_subject').text(response.result.subject_name);
				/*if(response.result.school_year!="" && response.result.class_no!=""){
					tchSubTempFrame.user_info.user_infoWrap.find('.edit_user_class').text(response.result.school_year+'-'+response.result.class_no);
				}*/
				tchSubTempFrame.user_info.user_infoWrap.find('.edit_user_sex').text(response.result.sex_name);
				//tchSubTempFrame.user_info.user_infoWrap.find('.edit_user_subject').text(response.result1.teacher_subject_list[0].subject_name);

				tchSubTempFrame.user_info.user_infoWrap.find('.address').val(response.result.address);
				tchSubTempFrame.user_info.user_infoWrap.find('.phone01').val(response.result.phone);	
				tchSubTempFrame.user_info.user_infoWrap.find('.email01').val(response.result.user_email);				
				tchSubTempFrame.user_info.user_infoWrap.find('.control1').val(response.result.sns);
				
				//tchSubTempFrame.user_info.user_infoWrap.find('.edit_user_teacher_year').text(response.result.teacher_year);
				//tchSubTempFrame.user_info.user_infoWrap.find('.edit_user_teacher_position').text(response.result.teacher_position_name);
				//tchSubTempFrame.user_info.user_infoWrap.find('.edit_user_teacher_duty').text(response.result.teacher_duty_name);
				//debugger;
				if (response.result.photo_path != "") {
					//edit_user_photo
					tchSubTempFrame.user_info.user_infoWrap.find('.edit_user_photo')[0].src = apiUrl + response.result.photo_path;
				};
				var arr = response.result1.teacher_subject_list;
				var arrlength = response.result1.teacher_subject_list.length;
				var classTotal = "";
				var singleClass = "";
				var doubleClass = "";
				//debugger;
				singleClass = arr[0].subject_name + arr[0].school_year + "-" + arr[0].class_no;
				classTotal += singleClass;
				for (var i = 1; i < arrlength; i++) {
					singleClass = "，"+arr[i].subject_name + arr[i].school_year + "-" + arr[i].class_no;
					classTotal += singleClass;
					singleClass = "";
				};

				if (strlen(classTotal)>12) {
					doubleClass = arr[0].subject_name + arr[0].school_year + "-" + arr[0].class_no 
									+"，"+ arr[1].subject_name + arr[1].school_year + "-" + arr[1].class_no
									+"...";
					tchSubTempFrame.user_info.user_infoWrap.find('.edit_user_subject').text(doubleClass);
					
					tchSubTempFrame.user_info.user_infoWrap.find('.edit_user_subject').on(BIND_EVENT_TYPE,function(){
						commonAlert("老师所任的全部课程是：" + classTotal, false , null, null);
						//alert("老师所任的全部课程是：" + classTotal);
					});
				} else {
					tchSubTempFrame.user_info.user_infoWrap.find('.edit_user_subject').text(classTotal);
				}

				//debugger;
			}else{
				commonAlert('用户信息连接失败。', false , null, null);
				return;
			}
		});
	}

	// event bind
	tchSubTempFrame.user_info.eventBind = function(){
		// input 标记焦点 content 区域 padding-bottom 添加
		tchSubTempFrame.user_info.user_infoWrap.find('input').focusin(function(){
			keyboardScrollSet($(this) , "on", $('#content_container'));
		});

		// input 标记焦点出局 content 区域 padding-bottom 删除值
		tchSubTempFrame.user_info.user_infoWrap.find('input').focusout(function(){
			keyboardScrollSet($(this) , "off", $('#content_container'));
		});

		// 个人信息修改完毕
		tchSubTempFrame.user_info.user_infoWrap.find('.btn_edit_teacher').on(BIND_EVENT_TYPE,function(){
			
			// 检查电子邮件形式的代码
			//emojiCheck(tchSubTempFrame.user_info.user_infoWrap.find('.email01').val(), function(){
				// 电子邮件格式
				/*var user_email = tchSubTempFrame.user_info.user_infoWrap.find('.email01').val();
				if(emailCheck(user_email)){
					//var user_email = tchSubTempFrame.user_info.user_infoWrap.find('.email01').val();
					tchSubTempFrame.user_info.user_infoWrap.find('input[name=user_email]').val(user_email);
				}else{
					//alert('请正确输入邮箱地址！');
					commonAlert('请正确输入邮箱地址！', false , null, null);
					return;;
				}*/
			//});

			// 联系人代码
			//emojiCheck(tchSubTempFrame.user_info.user_infoWrap.find('.phone01').val(), function(){
				// 联系方式
				/*var teacher_phone = tchSubTempFrame.user_info.user_infoWrap.find('.phone01').val();
				if (phoneCheck(teacher_phone)) {
					tchSubTempFrame.user_info.user_infoWrap.find('input[name=phone]').val(teacher_phone);
				} else{
					//alert('请正确输入联系方式！');
					commonAlert('请正确输入联系方式！', false , null, null);
					return;
				};*/
			//});
			
			var params = {
				user_id : tchSubTempFrame.user_info.user_infoWrap.find('.edit_user_id').val(),
				//user_id : localStorage.getItem('TCH_id'),
				address : tchSubTempFrame.user_info.user_infoWrap.find('.address').val(),
				phone : tchSubTempFrame.user_info.user_infoWrap.find('.phone01').val(),
				qq : tchSubTempFrame.user_info.user_infoWrap.find('.control1').val(),
				user_email : tchSubTempFrame.user_info.user_infoWrap.find('.email01').val()
			};
			//var params = $('#fmEdit').serialize();
			//debugger;
			console.log(params);
			//debugger;
			getAjaxPostData('/tch/updateTeacher.do?', params , false, function(data){
				var response = data;

				if(response.resultcode == '0000'){
					console.log('成功!');
					//alert('保存成功！');
					tchSubTempFrame.user_info.alert.find('.desc').html('保存成功！');
					tchSubTempFrame.user_info.alert.fadeIn();
					//commonAlert('保存成功！', false , null, null);
					//debugger;
				}else{
					tchSubTempFrame.user_info.alert.find('.desc').html('处理失败！');
					tchSubTempFrame.user_info.alert.fadeIn();
					//commonAlert('处理失败。', false , null, null);		//处理失败
					return;
				}
			});
		});
	}
	
	// 信息提示框 确认按钮事件
	var readyFunc = function onBridgeReady() {

		// 关闭当前webview窗口 - closeWindow
		document.querySelector('#tch_alarm_alert_ok_btn').addEventListener(
				'click', function(e) {
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
	
	tchSubTempFrame.user_info.init();
});