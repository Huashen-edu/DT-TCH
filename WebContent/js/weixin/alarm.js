$(function() {
	var params;
	var Controller;
	currentPage = 1; // 当前页

	tchSubTempFrame.alarm.wrapper = $('.m_alarm');
	tchSubTempFrame.alert = $('#tch_alarm_alert');
	tchSubTempFrame.alarm.sFlag = false;

	// init
	tchSubTempFrame.alarm.init = function() {

		$('#wrapper').show();

		setTimeout(function() {
			$('#wrapper').find('.intro').fadeOut(function() {
				showMain(tchSubTempFrame.alarm);
			});
		}, 1500);

		// 获取微信用户信息信息
		// 获取 授权 回调 code
		WXLoad(tchSubTempFrame.alert, TchParStuAlarm);
	}

	// event bind
	tchSubTempFrame.alarm.eventBind = function() {
		// item click
		
		tchSubTempFrame.alarm.wrapper.off(BIND_EVENT_TYPE, '.alarm_list .cnt');
		tchSubTempFrame.alarm.wrapper
				.on(
						BIND_EVENT_TYPE,
						'.alarm_list .cnt',
						function() {
							var $this = $(this);

							// 未读过的帖子
							if ($this.find('.am-icon-circle').length != 0) {
								// 읽음 api로 전송

								var Tparams = {
									type : $this.attr('data-type'),
									key : $this.attr('data-key'),
									user_id : localStorage.getItem('TCH_id')
								}

								getAjaxPostData(
										"tch/insertRead.do?",
										Tparams,
										false,
										function(data) {
											if (data.resultcode == '0000') {
												// NEW 아이콘 삭제
												$this.find('h4 .new').remove();
												location.href = "../weixin/alarm_view.html?key="
														+ $this
																.attr('data-key')
														+ "&scid="
														+ localStorage
																.getItem('TCH_scid');
											} else {
												console.log('insertRead 오류');
												return;
											}
										});
							} else {
								location.href = "../weixin/alarm_view.html?key="
										+ $this.attr('data-key')
										+ "&scid="
										+ localStorage.getItem('TCH_scid');
							}
						});
	}

	// list init
	tchSubTempFrame.alarm.listInit = function() {
		// 获取提醒列表数据
		currentPage = 1;
		tchSubTempFrame.alarm.sFlag = false;
		params.currentPage = currentPage;
		//初始化与切换
		params.subject_id = localStorage.getItem('TCH_teacher_subject_id');
		if(localStorage.getItem('TCH_teacher_status') == "T"){
			params.school_year = localStorage.getItem('TCH_school_year');
			Controller = "tch/getAlarmListByClassTeacher.do?";
		}else{
			params.school_year = localStorage.getItem('TCH_school_year_rkls');
			Controller = "tch/getAlarmListBySubjectTeacher.do?";
		}
		
		getAjaxPostData(
				Controller,
				params,
				true,
				function(data) {
					if (data.resultcode == '0000') {
						tchSubTempFrame.alarm.wrapper.find('.alarm_list').empty();
						$("#container").removeClass("resultNone");
						tchSubTempFrame.alarm.wrapper.find('#myjsjg').remove();
						// 判断数据为空
						if (data.result.length == 0) {
							$('.m_alarm').addClass('resultNone').append(
									'<dd id="myjsjg">没有检索结果。</dd>');
							return false;
						} else {
							for (var i = 0; i < data.result.length; i++) {
								var listDom = "", 
								reg_date = cts_split((data.result[i].reg_date), ' '), 
								m_days = reg_date.toString().substring(8, 10), 
								m_month = reg_date.toString().substring(5, 7), 
								display_date = (data.result[i].reg_date).toString().substring(0, 16);
								
								listDom += '<dd>';
								
								listDom += '	<div class="cnt" data-type="A" data-key="'
									+ data.result[i].aid + '">';
								
								listDom += '		<h4><span class="na_txt cts_ellipsis">'
										+ data.result[i].title
										+ '			</span>'
										+ ((data.result[i].new_cnt == 0) ? "<li class=am-icon-circle style=color:red;float:right;></li>"
												: "")
										+ ''
										+ ((data.result[i].fileList && data.result[i].fileList.length > 0) ? "<ff class='file'></ff>"
												: "") + '</h4>';
								listDom += '		<div><span class="teacher">'+data.result[i].subject_name+'&nbsp;['
										+ data.result[i].user_name + ']</span>';
								// 判断是否是今天 做强调
								if (reg_date[0] == momsToday) {
									listDom += '		<em class="date timeRight" data-kor="今天">'+reg_date[1].substring(0,5)+'</em>';
								}
								// 判断是否是昨天做强调
								else if (reg_date[0] == GetDateStr(-1)) {
									listDom += '		<em class="date timeRight" data-kor="昨天">昨天</em>';
								}else {
									listDom += '		<em class="date timeRight" data-kor="昨天">'+ m_month + '-' + m_days +'</em>';
								}
								listDom += '	</div>';
								listDom += '	</div>';
								
								listDom += '</dd>';
								
								listDom += '<div style="height:1px;"><hr /></div>';

								tchSubTempFrame.alarm.wrapper.find(
										'.alarm_list').append(listDom);
							}
						}
					} else {
						commonAlert('<strong>目录信息</strong><br />连接失败。', false,
								null, null);
						return;
					}
				});
	}

	// list append
	tchSubTempFrame.alarm.listAppend = function() {
		if (!tchSubTempFrame.alarm.sFlag) {
			currentPage++;

			params.currentPage = currentPage;
			//初始化与切换
			params.subject_id = localStorage.getItem('TCH_teacher_subject_id');
			if(localStorage.getItem('TCH_teacher_status') == "T"){
				params.school_year = localStorage.getItem('TCH_school_year');
				Controller = "tch/getAlarmListByClassTeacher.do?";
			}else{
				params.school_year = localStorage.getItem('TCH_school_year_rkls');
				Controller = "tch/getAlarmListBySubjectTeacher.do?";
			}
			
			
			getAjaxPostData(
					Controller,
					params,
					true,
					function(data) {
						if (data.resultcode == '0000') {
							if (data.result.length != 0) {
								var numCount = tchSubTempFrame.alarm.wrapper
										.find('.alarm_list dd').length; // append

								for (var i = 0; i < data.result.length; i++) {
									var listDom = "", 
									reg_date = cts_split((data.result[i].reg_date), ' '), 
									m_days = reg_date.toString().substring(8, 10), 
									m_month = reg_date.toString().substring(5, 7), 
									display_date = (data.result[i].reg_date).toString().substring(0, 16);
									
									listDom += '<dd>';
									
									listDom += '	<div class="cnt" data-type="A" data-key="'
										+ data.result[i].aid + '">';
									
									listDom += '		<h4><span class="na_txt cts_ellipsis">'
											+ data.result[i].title
											+ '			</span>'
											+ ((data.result[i].new_cnt == 0) ? "<li class=am-icon-circle style=color:red;float:right;></li>"
													: "")
											+ ''
											+ ((data.result[i].fileList && data.result[i].fileList.length > 0) ? "<ff class='file'></ff>"
													: "") + '</h4>';
									listDom += '		<div><span class="teacher">'+data.result[i].subject_name+'&nbsp;['
											+ data.result[i].user_name + ']</span>';
									// 判断是否是今天 做强调
									if (reg_date[0] == momsToday) {
										listDom += '		<em class="date timeRight" data-kor="今天">'+reg_date[1].substring(0,5)+'</em>';
									}
									// 判断是否是昨天做强调
									else if (reg_date[0] == GetDateStr(-1)) {
										listDom += '		<em class="date timeRight" data-kor="昨天">昨天</em>';
									}else {
										listDom += '		<em class="date timeRight" data-kor="昨天">'+ m_month + '-' + m_days +'</em>';
									}
									listDom += '	</div>';
									listDom += '	</div>';
									
									listDom += '</dd>';
									
									listDom += '<div style="height:1px;"><hr /></div>';

									tchSubTempFrame.alarm.wrapper.find(
											'.alarm_list').append(listDom);
								}
							} else {
								tchSubTempFrame.alarm.sFlag = true;
							}
						} else {
							commonAlert('<strong>目录信息</strong><br />连接失败。',
									false, null, null);
							return;
						}
					});
		} else {
			console.log('no more data');
		}
	}

	function TchParStuAlarm() {
		var user_type = localStorage.getItem('TCH_user_type');
		if (user_type == "T" && localStorage.getItem('TCH_teacher_status') == "L") {//任课老师
			params = {
				scid : localStorage.getItem('TCH_scid'),
				user_id : localStorage.getItem('TCH_id'),
				school_year : localStorage.getItem('TCH_school_year'),
				currentPage : currentPage
			};
			Controller = "tch/getAlarmListBySubjectTeacher.do?";
		}
		
		if (user_type == "T" && localStorage.getItem('TCH_teacher_status') == "T") {//班主任
			params = {
				scid : localStorage.getItem('TCH_scid'),
				user_id : localStorage.getItem('TCH_id'),
				school_year : localStorage.getItem('TCH_school_year'),
				class_no : localStorage.getItem('TCH_class_no'),
				currentPage : currentPage
			};
			Controller = "tch/getAlarmListByClassTeacher.do?";
		}

		if (user_type == "P" || user_type == "S") {
			params = {
				type : $('.m_alarm')[0].dataset.natype,
				user_id : localStorage.getItem('TCH_id'),
				currentPage : currentPage
			}
			Controller = "tch/getNoticeList.do?";
		}

		tchSubTempFrame.alarm.eventBind();
		
		// 绑定老师角色列表
		setTeacherStatus(selectTeacherStatus);
		
//		tchSubTempFrame.alarm.listInit();

		// pull to refresh
		$('#container').xpull({
			'callback' : function() {
				tchSubTempFrame.notice.sFlag = false;
				tchSubTempFrame.alarm.listInit();
			}
		});
	}
	
	// TODO:
	function selectTeacherStatus(schoolyear,status,subjectid,classNo){
		localStorage.setItem('TCH_school_year_rkls', schoolyear);
		localStorage.setItem('TCH_teacher_subject_id', subjectid);
		tchSubTempFrame.alarm.listInit();
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

	tchSubTempFrame.alarm.init();

});
