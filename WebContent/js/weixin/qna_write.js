$(function() {
	// tchSubTempFrame.qaAdd = {};
	tchSubTempFrame.alert = $('#tch_qna_alert');
	WXLoad(tchSubTempFrame.alert, TchParStuQna);

});
var student_id = null;
/* 根据班主任，获取学生列表 */
function getStudentlistByT() {

	var para = {
		scid : localStorage.getItem('TCH_scid'),
		class_no : localStorage.getItem('TCH_class_no'),
		school_year : localStorage.getItem('TCH_school_year')
	};
	getAjaxPostData("/tch/getAddressBookStudentsList.do?", para, true,
			function(data) {

				if (data.resultcode == '0000') {
					var user_id = localStorage.getItem('TCH_id');
					for (var i = 0; i < data.result.length; i++) {
						if (user_id != data.result[i].user_id) {

							$("#selectStudentList").append(
									"<option value=\data.result[i].user_id\>"
											+ data.result[i].user_name
											+ "</option>");
						}
					}

				} else {
					commonAlert('<strong>目录信息</strong><br />连接失败。', false,
							null, null);
					return;
				}
			});
}

/* 根据选择的学生，获取家长列表 */
function getMyClassStudentParentsList(obj) {
	var reg_type = null;
	var studentName = obj.options[obj.options.selectedIndex].innerHTML;
	$("#D").attr("checked", false);
	$("#M").attr("checked", false);
	$("#E").attr("checked", false);
	var para = {
		scid : localStorage.getItem('TCH_scid'),
		user_id : obj.options[obj.options.selectedIndex].value, // 所选中学生的id
		user_name : obj.options[obj.options.selectedIndex].innerHTML, // 所选中学生的名字
		class_no : localStorage.getItem('TCH_class_no'),
		school_year : localStorage.getItem('TCH_school_year')
	};
	getAjaxPostData("/tch/getMyClassStudentParentsList.do?", para, true,
			function(data) {
				if (data.resultcode == '0000') {

					for (var i = 0; i < data.result.length; i++) {
						if (studentName == data.result[i].user_name) {
							reg_type = data.result[i].reg_type;
							student_id = data.result[i].user_id;
						}
					}

					if (reg_type != null) {
						if (reg_type.indexOf("D") >= 0) {
							$("#D").attr("disabled", false);// 父亲框可编辑
						}
						if (reg_type.indexOf("M") >= 0) {
							$("#M").attr("disabled", false);// 母亲框可编辑
						}
						if (reg_type.indexOf("E") >= 0) {
							$("#E").attr("disabled", false);// 监护人框可编辑
						}
					}

				} else {
					commonAlert('<strong>目录信息</strong><br />连接失败。', false,
							null, null);
					return;
				}
			});

}

// 显示教师的信息
function getQaUserInfo() {
	document.getElementById("teacherName").innerText = "[" + "班主任"
			+ localStorage.getItem('TCH_user_name') + "]";
}

function selectTeacherStatus(schoolyear, status, subjectid, classNo) {
	getStudentlistByT();
	getQaUserInfo();
	// onBridgeReady();
}

// 新建家长问答按钮响应
function addTeacherQna() {
	var StudentList = null;
	var QaContext = null;
	var targetType = null;
	var D = document.getElementById('D'); // 父亲复选框
	var M = document.getElementById('M'); // 母亲复选框
	var E = document.getElementById('E'); // 监护人复选框
	StudentList = document.getElementById("selectStudentList");
	QaContext = document.getElementById("Qa_content");
	if (StudentList.value == "") {
		commonAlert('请选择学生！', false, null, null);
		return false;
	}
	if (!(D.checked | M.checked | E.checked)) {
		commonAlert('请选择要提问的家长！', false, null, null);
		return false;
	}
	if (QaContext.value == "") {
		commonAlert('请输入内容！', false, null, null);
		return false;
	}

	if (D.checked) {
		targetType = "D";
	}
	if (M.checked) {
		if (targetType == null) {
			targetType = "M";
		} else {
			targetType = targetType + "," + "M";
		}
	}
	if (E.checked) {
		if (targetType == null) {
			targetType = "E";
		} else {
			targetType = targetType + "," + "E";
		}
	}

	commonAlert("确认提交吗？", true, function() {

		var para = {
			"scid" : localStorage.getItem('TCH_scid'),
			"user_id" : localStorage.getItem('TCH_id'),
			"student_id" : student_id,
			"school_year" : localStorage.getItem('TCH_school_year'),
			"class_no" : localStorage.getItem('TCH_class_no'),
			"comment" : $("#Qa_content").val(),
			"value_user_type" : "T",
			"target_type" : targetType
		};
		getAjaxPostData("/tch/addTeacherQna.do?", para, true, function(data) {

			if (data.resultcode == '0000') {

				// lockScreen();
				tchSubTempFrame.alert.find('.desc').html('添加成功！');
				tchSubTempFrame.alert.fadeIn();

			} else {
				commonAlert('添加失败', false, null, null);
				return;
			}
		});

	});
}

/** 微信端关闭浏览器 */
var readyFunc = function onBridgeReady() {

	// 关闭当前webview窗口 - closeWindow
	document.querySelector('#tch_qna_alert_ok_btn').addEventListener('click',
			function(e) {
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

function TchParStuQna() {
	// 绑定老师角色列表
	setTeacherStatus(selectTeacherStatus);
	//设置老师头像
	if(localStorage.getItem('TCH_photo_path') == null || localStorage.getItem('TCH_photo_path') == ""){
		$("#imageId").attr("src",apiUrl + defaultProfileImgPath);
	}else{
		$("#imageId").attr("src",lmsUrl + localStorage.getItem('TCH_photo_path'));
	}

}
