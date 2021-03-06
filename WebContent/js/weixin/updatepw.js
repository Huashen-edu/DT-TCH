$(function() {
	var tchupdateFrame = {};
    tchupdateFrame.wrapper = $('#wrapper');
    tchupdateFrame.wrapper.alert=$('#tch_login_alert');
    
    // init
    tchupdateFrame.init = function() {
    	tchupdateFrame.wrapper.find('.intro').show();
        setTimeout(function() {
        	tchupdateFrame.wrapper.find('.intro').fadeOut(function() {
        		tchupdateFrame.showLogin();
            });
        }, 1500);
        // 画面初载入
       WXLoad(tchupdateFrame.wrapper.alert, tchupdateFrame.updatepw);
           
    
    tchupdateFrame.showLogin = function() {
    	tchupdateFrame.wrapper.removeClass('page-center');
    	tchupdateFrame.wrapper.find('#container').fadeIn(function() {
    	//	tchupdateFrame.eventBind();
        });
    };   
		
    };
    tchupdateFrame.updatepw = function(){
		
		var user_id = localStorage.getItem('TCH_id')
        document.getElementById("user_id").value = user_id;
		

		$('#updatepw_btn').on(BIND_EVENT_TYPE, function(){
			if(($('input[name=pass]').val() == "") || ($('input[name=repass]').val() == "")){
				commonAlert('有未填写项，信息不能为空', false , null, null);
				return;
			}else{
				if(($('input[name=pass]').val().length < 4) || ($('input[name=pass]').val().length < 4)){
					commonAlert('请输入4位数以上的密码', false , null, null);
					return;
				}

				if($('input[name=pass]').val() != $('input[name=repass]').val()){
					commonAlert('两次密码不一致', false , null, null);
					return;
				}


					var params = {
					  user_id : localStorage.getItem('TCH_id'),
						//	user_id : 100072,
						user_pw : $('input[name=pass]').val()
					};

					getAjaxPostData('tch/updatePw.do?', params , true, function(data){
						var response = data;

						if((response.resultcode == '0000') && (response.result !== null)){
							commonAlert('新密码设置成功<br>请重新登录。', false , function(){
								localStorage.setItem('logout','Y');
								window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0784d04a9cf4f728&redirect_uri=http://huashenzhihui.imwork.net/weixin/authorize.html&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect"; ;
							}, null);
							localStorage.clear();
						}else{
							commonAlert('处理失败！', false , null, null);
							return;
						}
					});
				
			}
		});
		
		
		
    };
    tchupdateFrame.init();
    
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
});