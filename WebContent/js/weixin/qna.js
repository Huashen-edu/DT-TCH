$(function() {
	var params;

	tchSubTempFrame.qna = {};
	tchSubTempFrame.alert = $('#tch_qna_alert');
	tchSubTempFrame.qna.wrapper = $('.m_qna');
	tchSubTempFrame.qna.sFlag = false;
	currentPage = 1;

	// init
	tchSubTempFrame.qna.init = function() {

		$('#wrapper').show();

		setTimeout(function() {
			$('#wrapper').find('.intro').fadeOut(function() {
				showMain(tchSubTempFrame.qna);
			});
		}, 1500);

		// 获取微信用户信息信息
		// 获取 授权 回调 code
		WXLoad(tchSubTempFrame.alert, TchParStuQna);

	}

	// 事件绑定
	tchSubTempFrame.qna.eventBind = function() {
		// 下拉刷新
		$('#container').xpull({
			'callback' : function() {
				tchSubTempFrame.qna.sFlag = false;
				tchSubTempFrame.qna.listInit();
			}
		});
		// 问答按钮（改功能不需要）
		/*tchSubTempFrame.qna.wrapper.find('#btnQaRegist').off(BIND_EVENT_TYPE);
		tchSubTempFrame.qna.wrapper.find('#btnQaRegist').on(
				BIND_EVENT_TYPE,
				function(e) {
					if (window.jline) {
						window.jline.openPopupWebView(uploadUrl
								+ "./qna_write.html");
					} else {
						window.open("./qna_write.html");
					}
				}

		);*/

		// 点击未读过的帖子
		tchSubTempFrame.qna.wrapper.off(BIND_EVENT_TYPE, '.qna_list li');
		tchSubTempFrame.qna.wrapper
				.on(
						BIND_EVENT_TYPE,
						'.qna_list li',
						function(e) {
							var $this = $(this);

							if ($this.find('h4 .new').length != 0) {
								// 읽음 api로 전송 (New 사라짐)
								var params = {
									type : "Q",
									key : $this.data('pqaid'),
									user_id : localStorage.getItem('TCH_id')
								}

								getAjaxPostData(
										"tch/insertRead.do?",
										params,
										false,
										function(data) {
											if (data.resultcode == '0000') {
												$this.find('h4').removeClass(
														'new');

												// 去除未读标记
												$this.find('h4 .new').remove();
												location.href = "../weixin/qna_view.html?pqaid="
														+ $this.data('pqaid')
														+ "&scid="
														+ localStorage
																.getItem('TCH_scid');
											}

											else {
												console.log('insertRead 错误');
												return;
											}
										});
							} else {
								console.log('이미 읽은 게시글');

								location.href = "../weixin/qna_view.html?pqaid="
										+ $this.data('pqaid')
										+ "&scid="
										+ localStorage.getItem('TCH_scid');
								;
							}
						});

	}

	// qna list init
	tchSubTempFrame.qna.listInit = function() {
		// 获取提醒列表数据
		currentPage = 1;
		tchSubTempFrame.qna.sFlag = false;

		// 测试用参数
		/*
		 * var params = { user_id : "mtbi2", school_year : "08", class_no :
		 * "02", currentPage : currentPage }
		 */

		// 发布用参数
		var params = {
			user_id : localStorage.getItem('TCH_id'),
			school_year : localStorage.getItem('TCH_school_year'),
			class_no : localStorage.getItem('TCH_class_no'),
			currentPage : currentPage
		}

		// 리스트 생성
		getAjaxPostData(
				"tch/getParentQaList.do?",
				params,
				true,
				function(data) {
					console.log('QNA 表 : ', data);

					tchSubTempFrame.qna.wrapper.find('.qna_list').empty();

					if (data.resultcode == '0000') {
						if (data.result.length == 0) {
							tchSubTempFrame.qna.wrapper.find('.emptyMsg')
									.show(); // 리스트 하나도 없을때
						} else {
							tchSubTempFrame.qna.wrapper.find('.emptyMsg')
									.hide(); // empty message hide

							var qaListDom = '';

							for (var i = 0; i < data.result.length; i++) {
										reg_date = cts_split(
												(data.result[i].last_comment_reg_date),
												' '),
										m_days = reg_date.toString().substring(
												8, 10),
										m_month = reg_date.toString()
												.substring(5, 7),
										display_date = (data.result[i].last_comment_reg_date)
												.toString().substring(0, 16);

								qaListDom += '<li  data-pqaid="'
										+ data.result[i].pqaid + '" >';

								qaListDom += '	<div class="list-cnt">';
								qaListDom += '<div style="margin-left: 144px";>';

								var is_new = '';
								if (data.result[i].is_new == true) {
									is_new += '<em class="am-icon-circle" style="color:red;float:right;margin-right:10px;"></em>	';
								}
								// 设置区分父、母、监护人的icon
								if (data.result[i].last_comment_reg_type == 'T') {
									qaListDom += '		<h4  style="margin-top: 0px; margin-bottom: 22px">'
											+ data.result[i].last_comment_user_name
											+ '老师</h4>';
								} else if (data.result[i].last_comment_reg_type == 'M') {
									qaListDom += '		<h4  style="margin-top: 0px; margin-bottom: 22px">'
											+ data.result[i].student_name
											+ '&nbsp<img width="18px" height="18px" src="../images/icon/redicon.png"/>'
											+ is_new + '</h4>'

								} else if (data.result[i].last_comment_reg_type == 'D') {
									qaListDom += '		<h4  style="margin-top: 0px; margin-bottom: 22px">'
											+ data.result[i].student_name
											+ '&nbsp<img width="18px" height="18px" src="../images/icon/blueicon.png"/>'
											+ is_new + '</h4>'
								} else if (data.result[i].last_comment_reg_type == 'E') {
									qaListDom += '		<h4  style="margin-top: 0px; margin-bottom: 22px">'
											+ data.result[i].student_name
											+ '&nbsp<img width="18px" height="18px" src="../images/icon/greenicon.png"/>'
											+ is_new + '</h4>'
								}

								qaListDom += '<div style="width: 80%; float: left">';
								qaListDom += '<p style="text-overflow:ellipsis;" class="na_txt cts_ellipsis">'
										+ data.result[i].last_comment + '</p>';
								;
								qaListDom += '</div>';
								qaListDom += '<span>';

								// 判断是否是今天 做强调
								if (reg_date[0] == momsToday) {
									qaListDom += '		<em class="date timeRight" style="margin-right: 10px; margin-top: 5px;" data-kor="今天">'
											+ reg_date[1].substring(0, 5)
											+ '</em>';
								}
								// 判断是否是昨天做强调
								else if (reg_date[0] == GetDateStr(-1)) {
									qaListDom += '		<em class="date timeRight" style="margin-right: 10px; margin-top: 5px;" data-kor="昨天">昨天</em>';
								} else {
									qaListDom += '		<em class="date timeRight" style="margin-right: 10px; margin-top: 5px;" data-kor="昨天">'
											+ m_month + '-' + m_days + '</em>';
								}
								qaListDom += '</span>';
								qaListDom += '</div>';
								qaListDom += '	</div>';

								// 用户照片，老师的用老师照片，家长的用孩子照片
								if (data.result[i].last_comment_reg_type == 'T') {
									qaListDom += '	<div class="thum">';
									qaListDom += '		<img class="edit_profile_img edit_user_photo myphoto" style="margin-left: 3px;" src="'
											+ (((data.result[i].last_comment_photo_path == "") || (data.result[i].last_comment_photo_path === null)) ? apiUrl
													+ defaultProfileImgPath
													: lmsUrl
															+ data.result[i].last_comment_photo_path)
											+ '" alt="">';
									qaListDom += '	</div>';
								} else {
									qaListDom += '	<div class="thum">';
									qaListDom += '		<img class="edit_profile_img edit_user_photo myphoto" style="margin-left: 3px;" src="'
											+ (((data.result[i].student_photo_path == "") || (data.result[i].student_photo_path === null)) ? apiUrl
													+ defaultProfileImgPath
													: lmsUrl
															+ data.result[i].student_photo_path)
											+ '" alt="">';
									qaListDom += '	</div>';
								}

								qaListDom += '</li>';
							}

							tchSubTempFrame.qna.wrapper.find('.qna_list')
									.append(qaListDom);
						}
					} else {
						commonAlert('<strong>目录信息</strong><br />连接失败。', false,
								null, null); // <strong>리스트정보</strong>를<br />
						// 불러오지못했습니다.
						return;
					}
				});
	}

	// qna list append
	tchSubTempFrame.qna.listAppend = function() {
		if (tchSubTempFrame.qna.wrapper.is(':visible')) {
			if (!tchSubTempFrame.qna.sFlag) {
				currentPage++;

				/*
				 * var params = { user_id : "mtbi2", school_year : "08",
				 * class_no : "02", currentPage : currentPage }
				 */

				var params = {
					user_id : localStorage.getItem('TCH_id'),
					school_year : localStorage.getItem('TCH_school_year'),
					class_no : localStorage.getItem('TCH_class_no'),
					currentPage : currentPage
				}

				getAjaxPostData(
						"tch/getParentQaList.do?",
						params,
						true,
						function(data) {
							console.log('append 데이터 : ', data);
							if (data.resultcode == '0000') {
								if (data.result.length != 0) {
									var qaListDom = '';
									for (var i = 0; i < data.result.length; i++) {
												reg_date = cts_split(
														(data.result[i].last_comment_reg_date),
														' '),
												m_days = reg_date.toString()
														.substring(8, 10),
												m_month = reg_date.toString()
														.substring(5, 7),
												display_date = (data.result[i].last_comment_reg_date)
														.toString().substring(
																0, 16);

										qaListDom += '<li  data-pqaid="'
												+ data.result[i].pqaid + '" >';

										qaListDom += '	<div class="list-cnt">';
										qaListDom += '<div style="margin-left: 144px";>';

										var is_new = '';
										if (data.result[i].is_new == true) {
											is_new += '<em class="am-icon-circle" style="color:red;float:right;margin-right:10px;"></em>	';
										}
										// 设置区分父、母、监护人的icon
										if (data.result[i].last_comment_reg_type == 'T') {
											qaListDom += '		<h4  style="margin-top: 0px; margin-bottom: 22px">'
													+ data.result[i].last_comment_user_name
													+ '老师</h4>';
										} else if (data.result[i].last_comment_reg_type == 'M') {
											qaListDom += '		<h4  style="margin-top: 0px; margin-bottom: 22px">'
													+ data.result[i].student_name
													+ '&nbsp<img width="18px" height="18px" src="../images/icon/redicon.png"/>'
													+ is_new + '</h4>'

										} else if (data.result[i].last_comment_reg_type == 'D') {
											qaListDom += '		<h4  style="margin-top: 0px; margin-bottom: 22px">'
													+ data.result[i].student_name
													+ '&nbsp<img width="18px" height="18px" src="../images/icon/blueicon.png"/>'
													+ is_new + '</h4>'
										} else if (data.result[i].last_comment_reg_type == 'E') {
											qaListDom += '		<h4  style="margin-top: 0px; margin-bottom: 22px">'
													+ data.result[i].student_name
													+ '&nbsp<img width="18px" height="18px" src="../images/icon/greenicon.png"/>'
													+ is_new + '</h4>'
										}

										qaListDom += '<div style="width: 80%; float: left">';
										qaListDom += '<p style="text-overflow:ellipsis;" class="na_txt cts_ellipsis">'
												+ data.result[i].last_comment
												+ '</p>';
										;
										qaListDom += '</div>';
										qaListDom += '<span>';

										// 判断是否是今天 做强调
										if (reg_date[0] == momsToday) {
											qaListDom += '		<em class="date timeRight" style="margin-right: 10px; margin-top: 5px;" data-kor="今天">'
													+ reg_date[1].substring(0,
															5) + '</em>';
										}
										// 判断是否是昨天做强调
										else if (reg_date[0] == GetDateStr(-1)) {
											qaListDom += '		<em class="date timeRight" style="margin-right: 10px; margin-top: 5px;" data-kor="昨天">昨天</em>';
										} else {
											qaListDom += '		<em class="date timeRight" style="margin-right: 10px; margin-top: 5px;" data-kor="昨天">'
													+ m_month
													+ '-'
													+ m_days
													+ '</em>';
										}
										qaListDom += '</span>';
										qaListDom += '</div>';
										qaListDom += '	</div>';

										// 用户照片，老师的用老师照片，家长的用孩子照片
										if (data.result[i].last_comment_reg_type == 'T') {
											qaListDom += '	<div class="thum">';
											qaListDom += '		<img class="edit_profile_img edit_user_photo myphoto" style="margin-left: 3px;" src="'
													+ (((data.result[i].last_comment_photo_path == "") || (data.result[i].last_comment_photo_path === null)) ? apiUrl
															+ defaultProfileImgPath
															: lmsUrl
																	+ data.result[i].last_comment_photo_path)
													+ '" alt="">';
											qaListDom += '	</div>';
										} else {
											qaListDom += '	<div class="thum">';
											qaListDom += '		<img class="edit_profile_img edit_user_photo myphoto" style="margin-left: 3px;" src="'
													+ (((data.result[i].student_photo_path == "") || (data.result[i].student_photo_path === null)) ? apiUrl
															+ defaultProfileImgPath
															: lmsUrl
																	+ data.result[i].student_photo_path)
													+ '" alt="">';
											qaListDom += '	</div>';
										}

										qaListDom += '</li>';
									}
									tchSubTempFrame.qna.wrapper.find(
											'.qna_list').append(qaListDom);
								} else {
									tchSubTempFrame.qna.sFlag = true;
								}
							} else {
								commonAlert('<strong>目录信息</strong><br />连接失败。',
										false, null, null); // <strong>리스트정보</strong>를<br
								// /> 불러오지못했습니다.
								return;
							}
						});
			} else {
				console.log('no more data');
			}
		}
	}

	// 信息提示框 确认按钮事件
	var readyFunc = function onBridgeReady() {

		// 关闭当前webview窗口 - closeWindow
		document.querySelector('#tch_qna_alert_ok_btn').addEventListener(
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

	tchSubTempFrame.qna.init();
});

function TchParStuQna() {
	// 绑定老师角色列表
	setTeacherStatus(selectTeacherStatus);

}

function selectTeacherStatus(schoolyear, status) {
	if (status == "T") {
		tchSubTempFrame.qna.listInit();
	} else {
		commonAlert('<strong>对不起，您没有该权限！</strong>', false, null, null);
	}
}