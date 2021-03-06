// 通知详细数据
$(function() {
	tchSubTempFrame.noticeView = {};
	tchSubTempFrame.noticeView.wrapper = $('#wrapper');

	// init
	tchSubTempFrame.noticeView.init = function() {
		tchSubTempFrame.noticeView.viewInit();
		// tchSubTempFrame.noticeView.eventBind();
		// tchSubTempFrame.noticeView.wrapper.attr('data-color' ,
		// localStorage.getObject('parentInfo').parent_type);
	}

	// view init
	tchSubTempFrame.noticeView.viewInit = function() {
		var params = {
			nid : cts_getParameter("key")
		}

		// 公告详细信息
		getAjaxPostData(
				"tch/getNoticeInfo.do?",
				params,
				true,
				function(data) {
					if (data.resultcode == '0000') {
						// 标题
						tchSubTempFrame.noticeView.wrapper.find('.view_title')
								.text(data.result.title);
						// 时间
						/*
						 * tchSubTempFrame.noticeView.wrapper.find('#td2').text((data.result.reg_date).toString().substring(0,10));
						 * tchSubTempFrame.noticeView.wrapper.find('#td3').text((data.result.reg_date).toString().substring(11,16));
						 */
						if (localStorage.getItem('TCH_teacher_status') == "T") {
							tchSubTempFrame.noticeView.wrapper.find(
									'.view_regDate').text(
									(data.result.reg_date).toString()
											.substring(5, 16)
											+ " "
											+ localStorage.getItem('TCH_user_name')
											+ '[班主任]');
						} else {
							tchSubTempFrame.noticeView.wrapper.find(
									'.view_regDate').text(
									(data.result.reg_date).toString()
											.substring(5, 16)
											+ "     "
											+ localStorage.getItem('TCH_user_name')
											+ '[任课老师]');
						}

						var n_dom = '';
						// 老师
						if ((data.result.target)
								&& (data.result.target).match('T')) {
							// n_dom += '<pt>[致老师的公告。]</pt>';
							n_dom += viewMemo(data.result.memo);
						}

						tchSubTempFrame.noticeView.wrapper.find(
								'.cnt-contain .cnt').html(n_dom); // 内容
						// 附件
						if (data.result.fileList
								&& data.result.fileList.length > 0) {
							var fileListDom = $('<div class="file-download"></div>');

							// 获取所有图片附件
							var are = [];
							data.result.fileList
									.forEach(function(file) {
										var lastO = file.filename
												.lastIndexOf('.');
										if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/
												.test(file.filename.substring(
														lastO,
														file.filename.length))) {
											if (file.filepath
													&& !file.filepath
															.match("http://")) {
												var urlAlarm = ""
														+ lmsUrl
																.substring(
																		0,
																		(lmsUrl.length - 1))
														+ file.filepath
														+ encodeURIComponent(file.filename) + "";
												are.push(urlAlarm);
											} else {
												var urlF = "" + file.filepath
														+ encodeURIComponent(file.filename) + "";
												are.push(urlF);
											}
										}
									});

							data.result.fileList
									.forEach(function(file) {
										var lastT = file.filename
												.lastIndexOf('.');
										var f_dom = $('	<div><a href="'
												+ (file.filepath + file.filename)
												+ '" class="dataType" rel="N">'
												+ file.filename + '</a></div>');

										f_dom
												.click(function(e) {
													e.preventDefault();
													var url = file.filepath;
													if (file.filepath
															&& !file.filepath
																	.match("http://")) {
														url = lmsUrl
																+ file.filepath;
													}
													if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/
															.test(file.filename
																	.substring(
																			lastT,
																			file.filename.length))) {
														if (typeof window.WeixinJSBridge != 'undefined') {
															WeixinJSBridge
																	.invoke(
																			"imagePreview",
																			{
																				"urls" : are,
																				"current" : ""
																						+ url
																						+ encodeURIComponent(file.filename)
																						+ ""
																			});
														}
													} else {
														OpenDataUrl(
																file.filename,
																url);
													}
												});

										fileListDom.append(f_dom);
									});
							tchSubTempFrame.noticeView.wrapper.find(
									'.cnt-contain').append(fileListDom);
						} else {
							// 파일 없음
						}
					} else {
						commonAlert('处理失败', false, null, null); // 处理失败
						return;
					}
				});
	}

	tchSubTempFrame.noticeView.init();
});
