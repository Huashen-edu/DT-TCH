// api 리스트 현재 페이지 currentPage
var currentPage = 1;

// 公共事件变量
var BIND_EVENT_TYPE = "click";

// momsMain object
var tchSubTempFrame = {};
tchSubTempFrame.alarm = {};
tchSubTempFrame.notice = {};
tchSubTempFrame.qna = {};

// polling object
var moms = {};
// 폴링 카운트 변수
var ALARM_CNT = 0; // 초기 알림 카운트 변수
var NOTICE_CNT = 0; // 초기 공지 카운트 변수
var QA_CNT = 0; // 초기 문의답변 카운트 변수
// 기본프로필 이미지 경로
var defaultProfileImgPath = "images/common/avatar.gif";

// 학년별 과목 담고 있는 obj
var momsSubjectObj = {

}

// 학년별 과목 세팅

function setMomsSubjectObj(callback) {
    var reqData = {
        school_year: "",
        subject: ""
    };

    // 해당 학년 과목정보만 담는다
    reqData.school_year = localStorage.getObject('s_defaultInfo').school_year;
    momsSubjectObj[localStorage.getObject('s_defaultInfo').school_year] = new Array();

    LMSgetAjaxPostData("getSchoolYearSubjectList.do?", reqData, false, function(data) {
        // console.log(data);
        if (data.resultcode == "0000") {
            momsSubjectObj[localStorage.getObject('s_defaultInfo').school_year] = data.result;

            callback();
        } else {
            console.log('此 年级 科目 设置 错误');
        }
    });
}

// MOMS PAGE LOADER

function momsPageLoader(url, container, callback, callback2) {
    var targetWrap = $(container);

    console.log('url>>>>>>>', url);
    console.log('container>>>>>>>', container);
    console.log('callback>>>>>>>', callback);
    console.log('callback2>>>>>>>', callback2);

    targetWrap.empty();
    $('#pageLoadingWrap').show();
    targetWrap.load(url, function(responseTxt, statusTxt, xhr) {
        console.log('Html load');
        if (statusTxt === 'success') {
            // callback 있으면 실행
            if (callback) {
                if (typeof callback === 'function') {
                    callback();
                }
            } else {
                return false;
            }
            $('#pageLoadingWrap').hide();
        } else if (statusTxt === 'error') {
            console.log('에러: ' + xhr.status + '....' + xhr.statusText);
            if (callback2) {
                if (typeof callback2 === 'function') {
                    callback2();
                }
            } else {
                return false;
            }
            $('#pageLoadingWrap').hide();
        }
    });
}

// ajax post

function getAjaxPostData(url, paramData, flag, callback) {
    var result;
    if (flag) {
        loadingWrapTopPosition();
        $('#loadingWrap').show();
    }
    if (!url.match("http://")) {
        url = apiUrl + url;
    }

    $.ajax({
        timeout: (1000 * 60),
        type: "POST",
        url: url,
        dataType: "json",
        // contentType : 'application/json; charset=UTF-8',
        crossDomain: true,
        global: false,
        cache: false,
        async: true,
        data: paramData,
        beforeSend: function() {
            // console.log('before send');
        },
        success: function(jsonData) {
            // console.log('success');
            result = jsonData;
            callback(result);
        },
        error: function(xhr, ajaxOptions, thrownError) {
            result = {
                result: "9999"
            };
            callback(result);
        },
        complete: function() {
            // console.log('complete');
            if (flag) {
                if (!url.match('login.do?')) {
                    $('#loadingWrap').hide();
                }
            }
        }
    });
}

function getAjaxPostDataAsync(url, paramData, flag, callback) {
    var result;
    if (flag) {
        loadingWrapTopPosition();
        $('#loadingWrap').show();
    }
    if (!url.match("http://")) {
        url = apiUrl + url;
    }

    $.ajax({
        timeout: (1000 * 60),
        type: "POST",
        url: url,
        dataType: "json",
        // contentType : 'application/json; charset=UTF-8',
        crossDomain: true,
        global: false,
        cache: false,
        async: false,
        data: paramData,
        beforeSend: function() {
            // console.log('before send');
        },
        success: function(jsonData) {
            // console.log('success');
            result = jsonData;
            callback(result);
        },
        error: function(xhr, ajaxOptions, thrownError) {
            result = {
                result: "9999"
            };
            callback(result);
        },
        complete: function() {
            // console.log('complete');
            if (flag) {
                if (!url.match('login.do?')) {
                    $('#loadingWrap').hide();
                }
            }
        }
    });
}

function getAjaxData(url, type, paramData, callBack) {
    var result;

    if (typeof paramData == 'object') paramData = JSON.stringify(paramData);

    $.ajax({
        method: type,
        url: url,
        data: paramData,
        contentType: 'application/json; charset=UTF-8',
        dataType: 'json',
        global: false,
        // cache: true,
        cache: false,
        async: false,
        success: function(jsonData) {
            result = jsonData;
            if (callBack) {
                if (typeof callBack == 'function') {
                    callBack(result);
                }
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            result = {
                result: "9999"
            };
            callBack(result);
        }
    });

};

// LMS ajax post

function LMSgetAjaxPostData(url, paramData, flag, callback) {
    console.debug(paramData);
    var result;

    if (flag) {
        loadingWrapTopPosition();
        $('#loadingWrap').show();
    }

    $.ajax({
        timeout: (1000 * 60),
        type: "POST",
        url: lmsApiUrl + url,
        dataType: "json",
        global: false,
        cache: false,
        async: true,
        data: paramData,
        beforeSend: function() {
            // console.log('before send');
        },
        success: function(jsonData) {
            // console.log('success');
            result = jsonData;
            callback(result);
        },
        error: function(xhr, ajaxOptions, thrownError) {
            result = {
                result: "9999"
            };
            callback(result);
        },
        complete: function() {
            // console.log('complete');
            if (flag) {
                $('#loadingWrap').hide();
            }
        }
    });
}

// 휴대폰번호 포맷

function phone_format(num) {
    if (!num) {
        return '';
    } else {
        return num.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, "$1-$2-$3");
    }
}

// 문자열 자르기

function cts_split(data, type) {
    if (!data) {
        return '';
    } else {
        return data.split(type);
    }
}

// 날짜 변환

function cts_Date(c_data, type) {
    if (c_data) {
        var data = cts_split(c_data, ' ');
        var c_date = new Date(data[0]);

        var c_year = c_date.getFullYear();
        var c_month = c_date.getMonth() + 1;
        var c_day = c_date.getDate();

        // c_year = c_year.toString().substring(2,4);
        if (c_month < 10) c_month = "0" + c_month;
        if (c_day < 10) c_day = "0" + c_day;

        return c_year + '.' + c_month + '.' + c_day;
    } else {
        return '';
    }
}

// get 传入的参数

function cts_getParameter(param) {
    var returnValue;
    var url = location.href;

    var parameters = (url.slice(url.indexOf('?') + 1, url.length)).split('&');

    for (var i = 0; i < parameters.length; i++) {
        var varName = parameters[i].split('=')[0];

        if (varName.toUpperCase() == param.toUpperCase()) {
            returnValue = parameters[i].split('=')[1];
            return decodeURIComponent(returnValue);
        }
    }
}

// json to string

function JSONtoString(object) {
    var results = [];
    for (var property in object) {
        var value = object[property];
        if (value) results.push(property.toString() + ': ' + value);
    }

    return '{' + results.join(', ') + '}';
}

// json 만들기

function makeJsonParams(subName, subArr, subVal) {
    var main = new Array(); // json의 전체를 가리키는 배열
    for (var i = 0; i < subVal.length; i++) {
        sub = new Object(); // 객체 값 입력후 main배열의 0번 index에 셋팅
        for (var j = 0; j < subArr.length; j++) {
            sub[subArr[j]] = subVal[i][j];
        }
        main[i] = sub;
    }

    var jsonObject = {}; // jsonObject라는 변수에 json형식으로 key이름은 list, value 배열은
    // 이전에 만들었던 main 배열을 넣는다
    jsonObject[subName] = JSON.stringify(main);

    // json데이터의 값 출력
    for (var k = 0; k < jsonObject[subName].length; k++) {
        var obj = jsonObject[subName][k];
    }

    return jsonObject;
}

// 특정값 삭제

function removeElementArray(arr, value) {
    var i;
    if (arr.indexOf) { // IE9+, 다른 모든 브라우져
        while ((i = arr.indexOf(value)) !== -1) { // 해당 값이 arr에 있는 동안 루프
            arr.splice(i, 1);
        }
    } else { // IE8 이하
        for (i = arr.length; i--;) { // 뒤에서부터 배열을 탐색
            if (arr[i] === value) {
                arr.splice(i, 1);
            }
        }
    }
}

// 이미지 미리보기

function readImgShow(input, target) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            target.attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// 배열 중복 값 제거

function arrayReduceFunc(input) {
    var tmp = new Array();
    tmp = input.reduce(function(a, b) {
        if (a.indexOf(b) < 0) a.push(b);
        return a;
    }, []);

    return tmp;
}

// 当前时间
var momsToday = todayTime();

function todayTime() {
    var now = new Date();
    var year = now.getFullYear();
    var mon = (now.getMonth() + 1) > 9 ? '' + (now.getMonth() + 1) : '0' + (now.getMonth() + 1);
    var day = now.getDate() > 9 ? '' + now.getDate() : '0' + now.getDate();

    var chan_val = year + '-' + mon + '-' + day;
    return chan_val;
}

//昨天时间
function GetDateStr(AddDayCount) {
	var dd = new Date(); 
	dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
	var y = dd.getFullYear(); 
	var m = dd.getMonth()+1;//获取当前月份的日期 
	var d = dd.getDate(); 
	return y+"-"+m+"-"+d; 
	} 

// 이미지 업로드 확장자 체크

function uploadMimeChk(filename) {
    var file = filename;

    if (file != '') {
        var fileExt = file.substring(file.lastIndexOf(".") + 1);

        var reg = /gif|jpg|jpeg|png/i;

        if (reg.test(fileExt) == false) {
            return 'N'; // 업로드 불가
        } else {
            return 'Y'; // 업로드 가능
        }
    }
}

// 모바일에서 input 포커스할때 키보드 등장시 스크롤 조정 함수

function keyboardScrollSet(target, type, wrapper) {
    switch (type) {
    case "on":
        wrapper.css({
            'padding-bottom': '250px'
        });

        var durationTime = (target.offset().top - 50) + 40;
        $('html,body').animate({
            scrollTop: target.offset().top - 50
        }, durationTime);
        break;
    case "off":
        wrapper.css({
            'padding-bottom': '0px'
        });
        break;
    default:
        break;
    }
}

/* scroll */
$(window).scroll(

function(e) {
    if ($(window).scrollTop() == $(document).height() - $(window).height()) {
        // ajax call get data from server and append to the div
        try {
            var pagingType = $('.m_alarm')[0].dataset.natype;

            switch (pagingType) {
            case 'statistic':
                // 통계
                break;
            case 'notice':
                tchSubTempFrame.notice.listAppend();
                break;
            case 'alarm':
                tchSubTempFrame.alarm.listAppend();
                break;
            case 'qna':
                tchSubTempFrame.qna.listAppend();
                break;
            case 'timetable':
                // 시간표
                break;
            default:
                break;
            }
        } catch (e) {
            // console.error(e);
        }
    }

    if (($('#loadingWrap').is(':visible') || $('#ajax_progress_loading').is(':visible'))) {
        loadingWrapTopPosition();
    }

    var scr_y = $(this).scrollTop();
    var nav_h = $('#navbar').height();
    var gap = ""
    scr_y > nav_h ? gap = '-53px' : gap = '0';
    $('#header').css('-webkit-transform', 'translate3d(0,' + gap + ',0)');
});

// scroll

function scrollTopBottom(type) {
    switch (type) {
    case 'top':
        $('body').scrollTop(0);
        break;
    case 'bottom':
        $('body').scrollTop($(document).height() - $(window).height());
        break;
    default:
        break;
    }
}

// textarea 태그 <> 표시 제거

function textAreaInputChk(input) {
    var ptn = /[<>]/g;

    if (input.match(ptn)) {
        input = input.replace(ptn, '');
    }

    return input;
}

// 변환된 이미지 태그 있을시

function emojiChk(input) {
    console.log(input);
    var ptn = /[<img>]/g;

    var flag = false;

    if (input.match(ptn)) {
        // console.log('매칭됨');
        flag = true;
    }

    return flag;
}

// 커서 맨끝
jQuery.fn.putCursorAtEnd = function() {

    return this.each(function() {

        $(this).focus()

        // If this function exists...
        if (this.setSelectionRange) {
            // ... then use it (Doesn't work in IE)
            // Double the length because Opera is inconsistent about whether a
            // carriage return is one character or two. Sigh.
            var len = $(this).val().length * 2;

            this.setSelectionRange(len, len);

        } else {
            // ... otherwise replace the contents with itself
            // (Doesn't work in Google Chrome)
            $(this).val($(this).val());

        }

        // Scroll to the bottom, in case we're in a tall textarea
        // (Necessary for Firefox and Google Chrome)
        this.scrollTop = 999999;

    });

};

// IOS 检查设备

function iosCheck() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
}

// 모바일 테블릿 체크
window.mobileAndTabletcheck = function() {
    var check = false;
    (function(a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

// replace All prototype 선언
String.prototype.replaceAll = function(org, dest) {
    return this.split(org).join(dest);
}

function viewMemo(memoData) {
    var memoContent = memoData;
    memoContent = memoContent.replace(/\n/g, '<br>');
    memoContent = memoContent.replaceAll("\u0020", '&nbsp;');

    var memoTxt = '';
    memoTxt += '<p>';
    memoTxt += memoContent;
    memoTxt += '</p>';

    return memoTxt;
}

/* Storage 확장 */
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    return this.getItem(key) && JSON.parse(this.getItem(key));
}

function getFileExtToDTChinaTypeExt(filename) {
    _extSplit = filename.split('.');
    _extType = _extSplit[_extSplit.length - 1];
    if (_extType == 'jpg' || _extType == 'gif' || _extType == 'png' || _extType == 'bmp') {
        _extType = 'img';
    }
    return _extType;
}

function OpenDataUrl(filename, filepath) {
    window.location.href = filepath + filename;
    /*
     * var fileType = getFileExtToDTChinaTypeExt(filename); var encodeFileName =
     * encodeURI(filename); var fileLocation = filepath + "/" + encodeFileName;
     * console .warn("파일을 엽니다. fileType : " + fileType + " url : " +
     * fileLocation); // cts.util.openExternalApplicationData(url, fileType,
     * filename);
     * 
     * 
     * if (window.jline) { var result =
     * window.jline.openExternalApplicationData(fileLocation, fileType,
     * 'downloadState', filename); } else { console.warn('window.jline 없음'); }
     */
};

function downloadState(result) {
    var ret = JSON.parse(result);

    if (ret.state == "downloadStart") {
        downloadingProgress.show();
    } else if (ret.state == "downloading") {
        downloadingProgress.show();
        downloadingProgress.charge(ret.percentage);
    } else if (ret.state == "downloadFinish") {
        downloadingProgress.complete();
    }

    if (ret.state == "downloadError") {
        downloadingProgress.hide();

        commonAlert('下载错误。', false, null, null);
        return false;
    }
    // console.debug("downloadState" , arguments);
    console.debug("downloadState : " + result);
    return result;
}

/* 파일다운로드 프로그레스 */
var downloadingProgress = {};
(function(prog) {
    var view = $("#ajax_progress_loading");
    var bar = view.find("[progress]");
    var state = view.find(".ajax_progress_state_text");
    var chargeText = view.find(".progresscharge");
    prog.init = function() {
        if (!view[0]) view = $("#ajax_progress_loading");
        if (!bar[0]) bar = view.find("[progress]");
        if (!state[0]) state = view.find(".ajax_progress_state_text");
        if (!chargeText[0]) chargeText = view.find(".progresscharge");
        bar.width(0);
        // state.text("");
        chargeText.text("");
    }
    prog.show = function() {
        if (!view[0]) view = $("#ajax_progress_loading");
        if (!bar[0]) bar = view.find("[progress]");
        if (!state[0]) state = view.find(".ajax_progress_state_text");
        if (!chargeText[0]) chargeText = view.find(".progresscharge");
        loadingWrapTopPosition();
        view.show();
    };
    prog.hide = function() {
        view.fadeOut(50);
    };
    prog.charge = function(per) {
        per = (parseInt(per) > 100) ? 100 : per;
        bar.width(per + "%");
        chargeText.text(per + "%");
    };
    prog.complete = function(callback) {
        prog.hide();
        prog.init();
        if (callback && typeof callback == "function") callback();
    };
})(downloadingProgress);

// 로딩창 top position set

function loadingWrapTopPosition() {
    var topPosition = window.pageYOffset || document.documentElement.scrollTop;

    if ($('#loadingWrap').is(':visible')) {
        $('#loadingWrap').css({
            top: topPosition + 'px'
        });
    } else if ($('#ajax_progress_loading').is(':visible')) {
        $('#ajax_progress_loading').css({
            top: topPosition + 'px'
        });
    }
}

// 공통 alert 알림창
// [params]
// msg - 텍스트 메세지
// type - 버튼 1개 (false) , 버튼 2개 (true)
// callback1, callback2 - 확인/취소 콜백
// headerMsg - 헤더에 메세지 들어갈떄
// footerType - 하단 버튼에 텍스트가 바뀔때

function commonAlert(msg, type, callback1, callback2, headerMsg, footerType) {
    var alertWrapper = $('#main_common_alert');
    var alertDom = '';

    if (headerMsg) {
        alertDom += '<header class="header" data-kor="">' + headerMsg + '</header>';
    }

    alertDom += '<p class="desc block" style="max-height:200px;overflow:auto;" data-kor=""></p>';
    alertDom += '<div class="group-btn">';

    if (footerType) {
        alertDom += '	<a href="javascript:void(0)" class="main_common_alert_ok" data-kor="이어서 작성">继续填写</a>';
        alertDom += '	<a href="javascript:void(0)" class="marginleft50 main_common_alert_cancel" data-kor="나가기">退出</a>';
    } else {
        if (type) {
            alertDom += '	<a href="javascript:void(0)" class="main_common_alert_ok" data-kor="확인">确定</a>';
            alertDom += '	<a href="javascript:void(0)" class="marginleft50 main_common_alert_cancel" data-kor="취소">取消</a>';
        } else {
            alertDom += '	<a href="javascript:void(0)" class="main_common_alert_ok" data-kor="확인">确定</a>';
        }
    }

    alertDom += '</div>';

    alertWrapper.html(alertDom);

    $('#wrapper').append('<div id="commonAlertDim"></div>');

    alertWrapper.show();
    lockScreen();
    alertWrapper.find('.desc').html(msg);

    // OK 버튼
    alertWrapper.find('.main_common_alert_ok').off(BIND_EVENT_TYPE);
    alertWrapper.find('.main_common_alert_ok').on(BIND_EVENT_TYPE, function() {
    	alertWrapper.hide();
        var blackBg = document.getElementById("blackBg");
        blackBg && document.body.removeChild(blackBg);

        $('#commonAlertDim').remove();
        if (callback1 || typeof(callback1) == 'function') {
            callback1();
        }

        
    });

    // 취소 버튼
    alertWrapper.find('.main_common_alert_cancel').off(BIND_EVENT_TYPE);
    alertWrapper.find('.main_common_alert_cancel').on(BIND_EVENT_TYPE, function() {
    	 alertWrapper.hide();
         var blackBg = document.getElementById("blackBg");
         blackBg && document.body.removeChild(blackBg);

         $('#commonAlertDim').remove();
        if (callback2 || typeof(callback2) == 'function') {
            callback2();
        }

       
    });
}
// 弹出框遮罩

function lockScreen() {
    var clientH = document.body.offsetHeight; // body高度
    var clientW = document.body.offsetWidth; // body宽度
    var docH = document.body.scrollHeight; // 浏览器高度
    var docW = document.body.scrollWidth; // 浏览器宽度
    var bgW = clientW > docW ? clientW : docW; // 取有效宽
    var bgH = clientH > docH ? clientH : docH; // 取有效高
    var blackBg = document.createElement("div");
    blackBg.id = "blackBg";
    blackBg.style.position = "absolute";
    blackBg.style.zIndex = "9999";
    blackBg.style.top = "0";
    blackBg.style.left = "0";
    blackBg.style.width = bgW + "px";
    blackBg.style.height = bgH + "px";
    blackBg.style.opacity = "0.4";
    blackBg.style.backgroundColor = "#333";
    document.body.appendChild(blackBg);
}
// emoji 체크 로직

function emojiCheck(textInput, callback) {
    // textarea 입력 변환
    // 이모티콘 체크
    if (checkEmoji(textInput)) {
        commonAlert('此环境不支持表情，<br/>请删除表情。', false, null, null); // 이모티콘을 삭제하고 다시
        // 입력하세요.
        return;
    } else {
        callback();
    }
}

/**
 * 获取URL参数
 * 
 * @param name
 *            键名
 * @returns 键值
 */

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

// 获取微信用户信息信息

function WXLoad(alert, callback, isAuthorize) {
    // 获取 授权 回调 code
    var wxcode = GetQueryString("code");

    if (localStorage.getItem("TCH_wx_code") != wxcode) {
        // 获取 用户 useid
        var paramsCode = {
            code: wxcode
        };
        // 获取 微信userinfo
        getAjaxPostData('tch/getWXUserInfo.do?', paramsCode, true, function(data) {
            var response = data;
            if (response.resultcode == '0000' && typeof(response.result) == "object") {
                // 存code做判断
                localStorage.setItem("TCH_wx_code", wxcode);

                // 菜单按钮序号
                localStorage.setItem("TCH_index", 0);
                // 获取用户微信信息和用户信息
                localStorage.setItem('TCH_wx_user_id', response.result.wx_user_id); // 用户微信ID
                localStorage.setItem('TCH_device_id', response.result.device_id); // 手机设备ID
                if (response.result.user_id != null) {
                    // 判断用户是否禁用
                    if (response.result.is_used != null && response.result.is_used == 'N' && !isAuthorize) {
                        lockScreen();
                        alert.find('.desc').html('<strong>您的账号已与其他微信号绑定！</strong><br>为了您的账号安全，请在更新系统密码后，重新在<strong>[更多]</strong>-<strong>[绑定账号]</strong>进行绑定。');
                        alert.fadeIn();
                        return;
                    }

                    if (response.result.scid == null || response.result.user_type == null) {
                        commonAlert('用户信息数据出现异常。', false, null, null);
                        return;
                    }
                    localStorage.setItem('TCH_id', response.result.user_id); // 用户ID
                    localStorage.setItem('TCH_scid', response.result.scid); // 学校ID
                    localStorage.setItem('TCH_user_name', response.result.user_name); // 用户名称
                    localStorage.setItem('TCH_photo_path', response.result.photo_path); // 用户头像路径
                    localStorage.setItem('TCH_teacher_charge', response.result.teacher_charge); // 班主任标示
                    localStorage.setItem('TCH_user_type', response.result.user_type); // 用户类型
                    localStorage.setObject('TCH_teacher_subject_list', response.result.teacher_subject_list); // 所有科目列表
                    var school_year_list = response.result.school_year_list; // 所有学年
                    localStorage.setObject('TCH_school_year_list', school_year_list);
                    if (response.result.teacher_charge != null && response.result.teacher_charge == "Y") {
                        localStorage.setItem('TCH_class_no', response.result.class_no); // 班级
                        localStorage.setItem('TCH_school_year', response.result.school_year); // 学年
                        localStorage.setItem('TCH_teacher_status', "T"); // 当前切换教师角色是班主任还是任科老师
                    } else {
                        // 默认选择第一学年
                        localStorage.setItem('TCH_school_year', school_year_list[0].school_year);
                        localStorage.setItem('TCH_teacher_status', "L"); // 当前切换教师角色是班主任还是任科老师
                    }

                    // TODO:自动登录
                    localStorage.setObject('s_defaultInfo', response.result);
                    sessionStorage['TCH_id'] = response.result.user_id;
                    console.debug("注册资料和信息", data);

                    if (callback || typeof(callback) == 'function') {
                        callback();
                    }

                } else if (isAuthorize) {
                    return;
                } else {
                    lockScreen();
                    alert.find('.desc').html('您还没有进行账号绑定！<br>关闭此画面，在<strong>[更多]</strong>-<strong>[绑定账号]</strong>进行绑定。');
                    alert.fadeIn();
                    return;
                }
            }
        });
    } else {
        if (callback || typeof(callback) == 'function') {
            callback();
        }
    }
}

// 右侧菜单切换共通事件

function setTeacherStatus(callback) {
    // 获取控件对象
    var selTeacherStatus = $("#selTeacherStatus");
    var txtTeacherStatus = $("#txtTeacherStatus");

    // 左侧选择项目
    var html = "<li class=\"am-nav-header\">教师身份选择</li>";
    selTeacherStatus.append(html);

    var teacher_charge = localStorage.getItem("TCH_teacher_charge"); // 班主任标示
    if (teacher_charge == "Y") {
        // title 名称
        var btnName = localStorage.getItem("TCH_school_year") + "-" + localStorage.getItem("TCH_class_no") + "班 班主任";
        txtTeacherStatus.html(btnName);
        localStorage.setItem("TCH_teacher_subject_id", "00"); // 出事科目ID
        // 班主任选项
        var button = $("<li class=\"am-active\"><a href='javascript:'>" + btnName + "</a></li>");
        // 绑定按钮参数
        button.data("btnName", btnName);
        button.data("schoolyear", localStorage.getItem("TCH_school_year"));
        button.data("index", 0);
        button.click(function() {
            // TODO:刷新列表事件未处理
            localStorage.setItem('TCH_teacher_status', "T"); // 当前切换教师角色是班主任还是任科老师
            localStorage.setItem("TCH_index", $(this).data("index"));
            callback($(this).data("schoolyear"), "T", "00");
            txtTeacherStatus.html($(this).data("btnName"));
            $(this).addClass('am-active').siblings().removeClass('am-active');
            $('#doc-oc-demo2').offCanvas("close");
        });
        selTeacherStatus.append(button);
    }

    // 任课老师选项
    var school_year_list = localStorage.getObject("TCH_school_year_list"); // 所有学年
    var teacher_subject_list = localStorage.getObject("TCH_teacher_subject_list"); // 所有科目
    for (var i = 0; i < school_year_list.length; i++) {
        var btnName = school_year_list[i].school_year + "年级 科目老师";
        var subjectid = getSubjectId(teacher_subject_list, school_year_list[i].school_year);
        var classStyle = "";
        var index = 0;
        if (teacher_charge != "Y" && i == 0) {
            // 默认第一个选项
            classStyle = "class=\"am-active\"";
            localStorage.setItem("TCH_teacher_subject_id", subjectid); // 出事科目ID
            txtTeacherStatus.html(btnName);
        }

        // 菜单按钮序号
        if (teacher_charge == "Y") {
            index = i + 1;
        }
        var button = $("<li><a href='javascript:' " + classStyle + ">" + btnName + "</a></li>");
        // 绑定按钮参数
        button.data("btnName", btnName);
        button.data("schoolyear", school_year_list[i].school_year);
        button.data("subjectid", subjectid);
        button.data("index", index);
        button.click(function() {
            // TODO:刷新列表事件未处理
            localStorage.setItem('TCH_teacher_status', "L"); // 当前切换教师角色是班主任还是任科老师
            localStorage.setItem("TCH_index", $(this).data("index"));
            callback($(this).data("schoolyear"), "L", $(this).data("subjectid"));
            txtTeacherStatus.html($(this).data("btnName"));
            $(this).addClass('am-active').siblings().removeClass('am-active');
            $('#doc-oc-demo2').offCanvas("close");
        });
        selTeacherStatus.append(button);
    }

    $("#selTeacherStatus a")[localStorage.getItem("TCH_index")].click();

}

// 获取subject_id 从teacher_subject_list列表中

function getSubjectId(teacher_subject_list, school_year) {
    for (var i = 0; i < teacher_subject_list.length; i++) {
        var subject = teacher_subject_list[i];
        if (subject.school_year == school_year) return subject.subject_id;
    }
}

// Loading特效

function showMain(div) {
    $('#wrapper').removeClass('page-center');
    $('#container').fadeIn(function() {
        div.eventBind();
    });
}

/**
 * Check email format
 */
function emailCheck(email) {
	var pattern = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
	if (email != "") {
		if (!pattern.test(email)) {
			return false;
		}
	};
	return true;
}

//判断电话号码格式(包括手机号码)
function phoneCheck(phone){
  	var tel = /(^[0-9]{3,4}\-[0-9]{7,8}$)|(^[0-9]{7,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)|(13\d{9}$)|(15[0135-9]\d{8}$)|(18[267]\d{8}$)/;
  	if(phone != "") {
   		if (!tel.exec(phone)) {
   			return false;
   			//alert("电话号码格式不对，正确格式如下：\n座机号码：021-4213550(或)\n手机号码：13635456878");
   		}
  	}
  	return true;
}

//获取字符串长度
function strlen(str){
    var len = 0;
    for (var i=0; i<str.length; i++) { 
        var c = str.charCodeAt(i); 
        //单字节加1 
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) { 
            len++; 
        } 
        else { 
            len+=2; 
        } 
    } 
    return len;
}