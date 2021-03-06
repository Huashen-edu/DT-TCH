$(function() {
	currentPage = 1; // 当前页
	var params;

	tchSubTempFrame.notice.wrapper = $('.m_notice');
	tchSubTempFrame.alert = $('#tch_notice_alert');
	tchSubTempFrame.notice.sFlag = false;

	// init
	tchSubTempFrame.notice.init = function() {
		// 简介 show
		// $('.page-center').fadeIn();
		$('#wrapper').show();

		setTimeout(function() {
			$('#wrapper').find('.intro').fadeOut(function() {
				showMain(tchSubTempFrame.notice);
			});
		}, 1500);

		// 获取微信用户信息信息
		// 获取 授权 回调 code
		WXLoad(tchSubTempFrame.alert, TchParStuNotice);
	}

	// event bind
	tchSubTempFrame.notice.eventBind = function() {
		// item click
		tchSubTempFrame.notice.wrapper
				.off(BIND_EVENT_TYPE, '.notice_list .cnt');
		tchSubTempFrame.notice.wrapper
				.on(
						BIND_EVENT_TYPE,
						'.notice_list .cnt',
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
												location.href = "../weixin/notice_view.html?key="
														+ $this
																.attr('data-key');
												$this.find('h4 .new').remove();

											} else {
												console.log('insertRead 오류');
												return;
											}
										});
							} else {
								// 已读帖子
								location.href = "../weixin/notice_view.html?key="
										+ $this.attr('data-key');
							}
						});

	}

	// 初始化列表
	tchSubTempFrame.notice.listInit = function() {
		// 获取通知公告列表数据
		currentPage = 1;
		tchSubTempFrame.alarm.sFlag = false;
		params.currentPage = currentPage;

		getAjaxPostData(
				Controller,
				params,
				true,
				function(data) {
					if (data.resultcode == '0000') {
						tchSubTempFrame.notice.wrapper.find('.notice_list')
								.empty();// 删除元素中的内容
						// 判断数据为空
						if (data.result.length == 0) {
							$('.notice_list').addClass('resultNone').append(
									'<dd>没有检索结果。</dd>');
							return false;
						} else {
							for (var i = 0; i < data.result.length; i++) {
								var listDom = "", 
								reg_date = cts_split((data.result[i].reg_date), ' '), 
								m_days = reg_date.toString().substring(8, 10), 
								m_month = reg_date.toString().substring(5, 7), 
								display_date = (data.result[i].reg_date).toString().substring(0, 16);
								
								listDom += '<dd>';
								
								listDom += '	<div class="cnt" data-type="N" data-key="'
									+ data.result[i].nid + '">';
								
								listDom += '		<h4><span class="na_txt cts_ellipsis">'
										+ data.result[i].title
										+ '			</span>'
										+ ((data.result[i].new_cnt == 0) ? "<li class=am-icon-circle style=color:red;float:right;></li>"
												: "")
										+ ''
										+ ((data.result[i].fileList && data.result[i].fileList.length > 0) ? "<ff class='file'></ff>"
												: "") + '</h4>';
								listDom += '		<span class="teacher">['
									+ data.result[i].speaker + ']</span>';
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

								tchSubTempFrame.notice.wrapper.find(
								'.notice_list').append(listDom);
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
	tchSubTempFrame.notice.listAppend = function() {
		if (!tchSubTempFrame.notice.sFlag) {
			currentPage++;

			params.currentPage = currentPage;

			getAjaxPostData(
					Controller,
					params,
					true,
					function(data) {
						if (data.resultcode == '0000') {
							if (data.result.length != 0) {
								var numCount = tchSubTempFrame.notice.wrapper
										.find('.notice_list dd').length; // append
								for (var i = 0; i < data.result.length; i++) {
									var listDom = "", 
									reg_date = cts_split((data.result[i].reg_date), ' '), 
									m_days = reg_date.toString().substring(8, 10), 
									m_month = reg_date.toString().substring(5, 7), 
									display_date = (data.result[i].reg_date).toString().substring(0, 16);
									
									listDom += '<dd>';
									
									listDom += '	<div class="cnt" data-type="N" data-key="'
										+ data.result[i].aid + '">';
									
									listDom += '		<h4><span class="na_txt cts_ellipsis">'
											+ data.result[i].title
											+ '			</span>'
											+ ((data.result[i].new_cnt == 0) ?  "<li class=am-icon-circle style=color:red;float:right;></li>"
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

									tchSubTempFrame.notice.wrapper.find(
										'.notice_list').append(listDom);
								}
							} else {
								tchSubTempFrame.notice.sFlag = true;
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

	function TchParStuNotice() {

		var user_type = localStorage.getItem('TCH_user_type');
		if (user_type == "T") {
			params = {
				scid : localStorage.getItem('TCH_scid'),
				user_id : localStorage.getItem('TCH_id'),
				currentPage : currentPage
			};
			Controller = "tch/getTchNoticeList.do?";
		}

		if (user_type == "P" || user_type == "S") {
			params = {
				type : $('.m_notice')[0].dataset.natype,
				user_id : localStorage.getItem('TCH_id'),
				currentPage : currentPage
			}
			Controller = "tch/getNoticeList.do?";
		}

		tchSubTempFrame.notice.eventBind();
		tchSubTempFrame.notice.listInit();

		// pull to refresh
		$('#container').xpull({
			'callback' : function() {
				tchSubTempFrame.notice.sFlag = false;
				tchSubTempFrame.notice.listInit();
			}
		});
	}

	// 信息提示框 确认按钮事件
	var readyFunc = function onBridgeReady() {

		// 关闭当前webview窗口 - closeWindow
		document.querySelector('#tch_notice_alert_ok_btn').addEventListener(
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

	tchSubTempFrame.notice.init();

});
