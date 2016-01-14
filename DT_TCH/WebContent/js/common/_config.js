var urlFlag = false;
//var urlFlag = false;

if (!urlFlag) {

	// api 요청 url
	var apiUrl = 'http://192.168.200.36:5566/';

	// upload img url
	var uploadUrl = 'http://192.168.200.36:5566/';

	// lms 저장된 이미지 url
	var lmsUrl = 'http://test.happyk9.cn:5050/';

	// LMS API URL
	var lmsApiUrl = 'http://192.168.200.36:5050/lms/';

	// PCM SRVER
	var pcmApiUrl = "http://192.168.200.36:8580/"

	// chart
	var CTS_CHART_HOST = "http://192.168.200.36:6767/";

} else {

	// api 요청 url
	var apiUrl = "http://huashenzhihui.imwork.net/";

	// upload img url
	var uploadUrl = "http://huashenzhihui.imwork.net/";

	// lms 저장된 이미지 url
	var lmsUrl = "http://huashenzhihui.imwork.net/";

	// LMS API URL
	var lmsApiUrl = "http://happyk9.cn:5050/lms/";

	// PCM SRVER
	var pcmApiUrl = "http://happyk9.cn:8580/";

	// chart
	var CTS_CHART_HOST = "http://happyk9.cn:6767/";

}

if (window.jline) {
	apiUrl = window.jline.getMomsServerUrl() + "/tch/";
	uploadUrl = window.jline.getMomsServerUrl();
	lmsUrl = window.jline.getLmsServerUrl();
	lmsApiUrl = window.jline.getLmsServerUrl() + "/lms/";
	CTS_CHART_HOST = window.jline.getStatServerUrl();
}