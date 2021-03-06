//家长问答详细
$(function() {
	tchSubTempFrame.qnaView = {};
	tchSubTempFrame.qnaView.wrapper = $('#wrapper');

	// init
	tchSubTempFrame.qnaView.init = function() {
		
		tchSubTempFrame.qnaView.viewInfoInit();

		$('#wrapper').show();

		setTimeout(function() {
			$('#wrapper').find('.intro').fadeOut(function() {
				showMain(tchSubTempFrame.qnaView);
				if( $(".qna").height()+54>$(window).height()){
					//最后一条增加宽度
		         		$('.qna_list li:last').addClass('style_btn_reply');		
					}
			});
		}, 1500);
		
	}

	// 详细信息
	tchSubTempFrame.qnaView.viewInfoInit = function() {
		tchSubTempFrame.qnaView.editInputController('init');

		var params = {
			pqaid : cts_getParameter('pqaid'),
			scid : cts_getParameter('scid'),
			user_id : localStorage.getItem('TCH_id')
		}

		getAjaxPostDataAsync(
				"tch/getQnaDetail.do?",
				params,
				true,
				function(data) {
					console.info('问答列表 : ', data.resultData);

					if (data.resultcode == '0000') {
						tchSubTempFrame.qnaView.wrapper.find('.qna_list').empty();
						
						for (var i=0; i < data.resultData.commentList.length; i++) {
							var commentDom = '';

							writter = '';
							
							reg_date = cts_split((data.resultData.commentList[i].reg_date_format), ' '), 
							m_days = reg_date.toString().substring(8, 10), 
							m_month = reg_date.toString().substring(5, 7), 
							display_date = (data.resultData.commentList[i].reg_date_format).toString().substring(0, 16);

							// 父亲
							if (data.resultData.commentList[i].reg_type == 'D') {
								writter = '父亲: '
										+ data.resultData.commentList[i].comment_user_name;
							} else if (data.resultData.commentList[i].reg_type == 'M') {
								// 母亲
								writter = '母亲: '
										+ data.resultData.commentList[i].comment_user_name;
							} else if (data.resultData.commentList[i].reg_type == 'E') {
								// 监护人
								writter = '监护人: '
										+ data.resultData.commentList[i].comment_user_name;
							} else if (data.resultData.commentList[i].reg_type == 'T') {
								// 班主任
								writter = '班主任'
										+ data.resultData.commentList[i].comment_user_name;
							} else if (data.resultData.commentList[i].reg_type == 'S') {
								// 校长
								writter = '校长'
										+ data.resultData.commentList[i].comment_user_name;
							}

							commentDom += '<li  data-user="'
									+ data.resultData.commentList[i].comment_user_id
									+ '">';
							commentDom += '	<div class="thum">';
							commentDom += '		<img class="edit_profile_img edit_user_photo myphoto" style="margin-left: 3px;" src="'
									+ (((data.resultData.commentList[i].comment_user_photo_path == "") || (data.resultData.commentList[i].comment_user_photo_path === null)) ? '../'
											+ defaultProfileImgPath
											: lmsUrl
													+ data.resultData.commentList[i].comment_user_photo_path)
									+ '" alt="">';
							commentDom += '	</div>';

							commentDom += '	<div class="list-cnt" >';
							
							commentDom +='<div style="margin-left: 144px";>';
							

							var cancleReply='';
							// 删除我写的最后一条评论
							if ((data.resultData.commentList[i].reg_type == localStorage
									.getItem('TCH_user_type'))) {
								cancleReply += '	<div class="option" style="float:right">';
								cancleReply += ' <a href="javascript:void(0)" class="btn_view_delete" data-cid="'
										+ data.resultData.commentList[i].comment_id
										+ '" data-kor="삭제" style="text-shadow:0px 0px 50px #9C9C9C;margin-right:5px;">取消回复</a>';
								cancleReply += '	</div>';
							}

							commentDom += '		<h4 style="margin-top: 0px; margin-bottom: 22px">'
									+ writter + cancleReply +'</h4>';
					
							commentDom +='<div style="width: 80%; float: left">';
							commentDom += '<p>';
							commentDom += data.resultData.commentList[i].comment;
							commentDom += '</p>';
							commentDom +='</div>';
							commentDom +='<span>';
							// 判断是否是今天 做强调
							if (reg_date[0] == momsToday) {
								commentDom += '		<em style="margin-right: 10px; margin-top: 5px;" class="date timeRight" data-kor="今天">'+reg_date[1].substring(0,5)+'</em>';
							}
							// 判断是否是昨天做强调
							else if (reg_date[0] == GetDateStr(-1)) {
								commentDom += '		<em style="margin-right: 10px; margin-top: 5px;" class="date timeRight" data-kor="昨天">昨天</em>';
							}else {
								commentDom += '		<em style="margin-right: 10px; margin-top: 5px;" class="date timeRight" data-kor="昨天">'+ m_month + '-' + m_days +'</em>';
							}
							commentDom +='</span>';
							commentDom += '	</div>';
							commentDom += '	</div>';
							commentDom += '</li>';

							// 拼接html
							tchSubTempFrame.qnaView.wrapper.find('.qna_list')
									.append(commentDom);

							// 나의 코멘트 중 맨 마지막 코멘트의 수정/삭제 버튼만 남기고 삭제
							if ($('.option').length > 1) {
								$(
										'.option:not(:eq('
												+ ($('.option').length - 1)
												+ '))').remove();
							}
						}

						$('#qnaAdapter').text('');
						
						tchSubTempFrame.qnaView.wrapper
								.find('#qnaAdapter')
								.append(
										'问答对象:['
												+ data.resultData.qnaInfo.student_name
												+ ']的家长');

						// 맨 마지막 댓글이 내가 아니면 수정/삭제 숨김
						if ($('.qna_list li:last').data('user') != localStorage
								.getItem('TCH_id')) {
							$('.option').hide();
						}
					} else {
						// 处理失败提示
						commonAlert('处理失败', false, null, null);
						return;
					}
				});
	}

	// 事件绑定
	tchSubTempFrame.qnaView.eventBind = function() {

		// 删除按钮事件
		tchSubTempFrame.qnaView.wrapper
				.on(
						BIND_EVENT_TYPE,
						'.btn_view_delete',
						function() {
							var $this = $(this);
							// 삭제하시겠습니까?
							commonAlert(
									'请确认是否删除该条回复？',
									true,
									function() {
										var params = {
											comment_id : $this.data('cid')
										}

										getAjaxPostData(
												"tch/deleteParentQaComment.do?",
												params,
												true,
												function(data) {

													if ((data.resultcode == '0000')) {
														if ($('.reply-wrap')
																.children().length == 1) {
															tchSubTempFrame.qnaView
															.viewInfoInit();
														} else {
															// 리스트 갱신
															tchSubTempFrame.qnaView
																	.viewInfoInit();
														}
														if( $(".qna").height()+54>$(window).height()){
															//最后一条增加宽度
												         		$('.qna_list li:last').addClass('style_btn_reply');		
															}
													} else {
														// 처리에 실패하였습니다.
														commonAlert('处理失败',
																false, null,
																null);
													}
												});
									}, null);
						});

		// 再次提问发送按钮事件
		tchSubTempFrame.qnaView.wrapper.on(BIND_EVENT_TYPE, '#btnQaViewSend',
				function() {
					var $this = $(this);

					if ($('textarea[name=qna_view_update_input]').val() == '' ) {
						// 텍스트 없음
						commonAlert('请输入内容', false, null, null);
						return;
					}

					// 参数
					var params = {
						scid : cts_getParameter('scid'),
						user_id : localStorage.getItem('TCH_id'),
						comment : $('textarea[name=qna_view_update_input]')
								.val(),
						pqaid : cts_getParameter('pqaid'),
						reg_type : localStorage.getItem('TCH_user_type')
					}

					getAjaxPostData("tch/insertParentQaComment.do?", params,
							true, function(data) {
								if ((data.resultcode == '0000')
										&& (data.resultData == 1)) {
									// 刷新页面
									tchSubTempFrame.qnaView.viewInfoInit();
									$('#qna_txt_input').val('');
									if( $(".qna").height()+54>$(window).height()){
										//最后一条增加宽度
							         		$('.qna_list li:last').addClass('style_btn_reply');		
										}
								} else {
									// 错误提示
									commonAlert('处理失败', false, null, null);
									return;
								}
							});
				});

	}

	// 输入框
	tchSubTempFrame.qnaView.editInputController = function(type, value) {
		if (type == "show") {
			// 수정폼 보여지기
			$('.qna .qna_write').show();
			$('.qna .group-btn').show();

			// 텍스트 세팅
			$('textarea[name=qna_view_update_input]').val(value);

			scrollTopBottom('bottom');
		} else {
			// 수정폼 숨기기
			$('.qna .qna_write').hide();
			$('.qna .group-btn').hide();

			// 텍스트 초기화
			$('textarea[name=qna_view_update_input]').text('');
		}
	}

	tchSubTempFrame.qnaView.init();
});