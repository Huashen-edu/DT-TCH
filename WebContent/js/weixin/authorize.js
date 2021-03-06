/**
 * 绑定账号画面
 */

$(function() {
    var tchAuthorizeFrame = {};
    tchAuthorizeFrame.wrapper = $('#wrapper');
    tchAuthorizeFrame.wrapper.alert = $('#tch_login_alert');

    // init
    tchAuthorizeFrame.init = function() {
        // 简介 show
        //		if (localStorage.getItem('logout') != 'Y') {
        tchAuthorizeFrame.wrapper.find('.intro').show();
        setTimeout(function() {
            tchAuthorizeFrame.wrapper.find('.intro').fadeOut(function() {
                tchAuthorizeFrame.showLogin();
            });
        }, 1500);
        // 画面初载入
        WXLoad(tchAuthorizeFrame.wrapper.alert, null, true);
        // } else { // 登录注销后 show
        // tchAuthorizeFrame.showLogin();
        // localStorage.clear();
        //		}
    }

    // login show
    tchAuthorizeFrame.showLogin = function() {
        tchAuthorizeFrame.wrapper.removeClass('page-center');
        tchAuthorizeFrame.wrapper.find('#container').fadeIn(function() {
            tchAuthorizeFrame.eventBind();
        });
    }

    // event bind
    tchAuthorizeFrame.eventBind = function() {
        // 登录按钮事件
        tchAuthorizeFrame.wrapper.find('#tch_login_btn').on(
        BIND_EVENT_TYPE, function() {
            var userId = tchAuthorizeFrame.wrapper.find('input[name=userId]').val(); // ID
            var pass = tchAuthorizeFrame.wrapper.find('input[name=pass]').val(); // 密码
            if (userId == '') {
                commonAlert('请输入<strong>用户名</strong>。', false, null, null);
                return;
            }

            // TODO:userId = 'p' + userId;
            userId = userId.toLowerCase();

            if (pass == '') {
                commonAlert('请输入<strong>密码</strong>。', false, null, null);
                return;
            }

            // TODO:获取用户类型
            var userType = 'T';
            // if ($('#tch_student_check').is(':checked')) {
            // // 学生
            // userType = 'S';
            // } else if ($('#tch_teacher_check').is(':checked')) {
            // // 教师
            // userType = 'T';
            // } else {
            // // 家长
            // userType = 'P';
            // }
            var wx_user_id = localStorage.getItem('TCH_wx_user_id');
            var device_id = localStorage.getItem('TCH_device_id');
            tchAuthorizeFrame.authorize(userId, pass, userType, wx_user_id, device_id); // 授权登录
        });

        // 信息提示框 确认按钮事件
        var readyFunc = function onBridgeReady() {
                var curid;
                var curAudioId;
                var playStatus = 0;

                // 关闭当前webview窗口 - closeWindow
                document.querySelector('#tch_authorize_alert_ok_btn').addEventListener('click', function(e) {
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
    }

    // 授权登录
    tchAuthorizeFrame.authorize = function(user_id, pass, user_type, wx_user_id, device_id) {
        var params = {
            user_id: user_id,
            // 用户id
            pass: pass,
            // 密码
            user_type: user_type,
            // 用户类型 S：学生 T：教师 P：父母
            wx_user_id: wx_user_id,
            // 微信userID
            device_id: device_id,
            // 手机设备号
        }

        getAjaxPostData('tch/setAuthorize.do?', params, true, function(data) {
            console.log(data);
            var response = data;

            if (response.resultcode == '0000') {
                if (response.result == 'fail') {
                    commonAlert('请确认<strong>ID</strong>和<strong>密码</strong>是否正确。', false, null, null);
                    tchAuthorizeFrame.wrapper.find('input[name=userId]').focus();
                    return;
                } else if (response.result == 'DBfail') {
                    commonAlert('目前服务器异常，请<strong>稍后</strong>再尝试。', false, null, null);
                    tchAuthorizeFrame.wrapper.find('input[name=userId]').focus();
                    return;
                } else if (response.result == 'IsDelete') {
                    commonAlert('此用户已被系统删除<br>请与<strong>管理员</strong>联系。', false, null, null);
                    tchAuthorizeFrame.wrapper.find('input[name=userId]').focus();
                    return;
                } else if (typeof(response.result) == "object") {
                    localStorage.setObject('s_defaultInfo', response.result);
                    sessionStorage['TCH_id'] = response.result.user_id; // 用户ID
                    localStorage.setItem('TCH_id', response.result.user_id); // 用户ID
                    localStorage.setItem('TCH_pass', response.result.user_pw); // 密码
                    localStorage.setItem('TCH_usertype', response.result.user_type); // 用户类型
                    console.debug("注册资料和信息", data);

                    // 在每个级别设置科目
                    // setMomsSubjectObj(function() {
                    // // 本地存储 在每个级别存储的Obj科目
                    // localStorage.setObject('momsSubjectObj',
                    // momsSubjectObj);
                    //							});
                    tchAuthorizeFrame.wrapper.alert.find('.desc').html('<strong>账号绑定成功</strong><strong></strong>，请关闭此画面。');
                    tchAuthorizeFrame.wrapper.alert.fadeIn();
                    return;
                }
            } else {
                commonAlert('处理失败', false, null, null);
                return;
            }
        });
    };

    tchAuthorizeFrame.init();
});