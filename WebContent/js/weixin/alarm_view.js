
// 提醒详细数据
$(function() {
	tchSubTempFrame.alarmView = {};
	tchSubTempFrame.alarmView.wrapper = $('#wrapper');

	// init
	tchSubTempFrame.alarmView.init = function(){
		tchSubTempFrame.alarmView.viewInit();
		//tchSubTempFrame.alarmView.eventBind();

		//momsSubTempFrame.alarmView.wrapper.attr('data-color' , localStorage.getObject('parentInfo').parent_type);
	}

	// view init
	tchSubTempFrame.alarmView.viewInit = function(){
		var params = {
			aid : cts_getParameter("key"),
			scid: cts_getParameter("scid"),
			user_id: localStorage.getItem('TCH_id')
		}

		// 获取提醒详细信息
		getAjaxPostData("tch/getAlarmInfo.do?", params, true, function(data){
			if(data.resultcode == '0000'){
				var student_arr = [];
				var student_arrTwo = [];
				//标题
				tchSubTempFrame.alarmView.wrapper.find('.view_title').text(data.result.title);										
				
				tchSubTempFrame.alarmView.wrapper.find('.view_writer').text('老师  ['+ data.result.user_name +']');						// 提醒人
				//为0的时候表示任课老师
				if(data.result.student_list.length == 0){
					tchSubTempFrame.alarmView.wrapper.find('.view_alarm').text('班级  ['+ data.result.teacherClass +'  转发]');
				}else{
					//非0的时候表示任课老师
					if(data.result.student_list.length == 1){
						student_arr.push(data.result.student_list[0].user_name);
						tchSubTempFrame.alarmView.wrapper.find('.view_alarm').text('学生  ['+ student_arr +']');						// 被提醒人
					}
					else if(data.result.student_list.length == 2){
						student_arr.push(data.result.student_list[0].user_name);
						student_arr.push(data.result.student_list[1].user_name);
						tchSubTempFrame.alarmView.wrapper.find('.view_alarm').text('学生  ['+ student_arr +']');						// 被提醒人
					}else{
						student_arrTwo.push(data.result.student_list[0].user_name);
						student_arrTwo.push(data.result.student_list[1].user_name);
						
						for(var i=0; i<data.result.student_list.length; i++){
							student_arr.push(data.result.student_list[i].user_name);
						}
						tchSubTempFrame.alarmView.wrapper.find('.view_alarm').text('学生  ['+ student_arrTwo +'...]');	
					}	
				}
				document.querySelector('.view_alarm').addEventListener('click', function(e) {
					if(data.result.student_list.length == 0){
						location.href = "../weixin/alarm_edit.html?key=" + cts_getParameter("key");
					}else{
						commonAlert(student_arr.join(' , '),false, null, null);
					}
				});
				
				tchSubTempFrame.alarmView.wrapper.find('.view_regDate').text((data.result.reg_date).toString().substring(5,16));	// 时间
				tchSubTempFrame.alarmView.wrapper.find('.cnt-contain .cnt').html(viewMemo(data.result.memo));						// 内容

				//附件
				if(data.result.fileList && data.result.fileList.length > 0){
					var fileListDom = $('<div class="file-download"><div class="fileWrap"></div></div>');
					//获取所有附件
					var are = [];
					data.result.fileList.forEach(function(file){
						var lastO=file.filename.lastIndexOf('.');
						if(/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.filename.substring(lastO,file.filename.length))){
							if(file.filepath && !file.filepath.match("http://")){
								var urlAlarm = "" + lmsUrl.substring(0,(lmsUrl.length-1))+file.filepath + encodeURIComponent(file.filename) + "";
								are.push(urlAlarm );
							}else{
								var urlF = "" + file.filepath + encodeURIComponent(file.filename) + "";
								are.push(urlF);
							}
						}
					})
					
					data.result.fileList.forEach(function(file){
						var lastT=file.filename.lastIndexOf('.');
						
						var f_dom = $('	<div><a href="'+ (file.filepath + file.filename) +'" class="dataType">'+file.filename+'</a></div>');
						f_dom.click(function(e){
							debugger;
							e.preventDefault();
							var url = file.filepath;
							if(file.filepath && !file.filepath.match("http://")){
								url = lmsUrl.substring(0,(lmsUrl.length-1))+file.filepath;
							}

							if(/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.filename.substring(lastT,file.filename.length))){
								if (typeof window.WeixinJSBridge != 'undefined') {
									WeixinJSBridge.invoke("imagePreview",{
										"urls" : are,
										"current" : ""+url + encodeURIComponent(file.filename)+""
									});
								}
							}else{
								OpenDataUrl(file.filename , url);
							}
						});
						fileListDom.find(".fileWrap").append(f_dom);
					});

					tchSubTempFrame.alarmView.wrapper.find('.cnt-contain').append(fileListDom);
				}else{
					// 没有附件
				}
			}else{
				//失败处理.
				commonAlert('处理失败', false , null, null);
				return;
			}
		});
	}

	tchSubTempFrame.alarmView.init();

});


