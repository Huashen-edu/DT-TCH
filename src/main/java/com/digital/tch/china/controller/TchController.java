package com.digital.tch.china.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.DefaultTransactionDefinition;
import org.springframework.ui.Model;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.digital.tch.china.service.TchService;
import com.digital.tch.china.util.CommonUtil;
import com.digital.tch.china.util.WeixinUtil;
import com.digital.tch.china.vo.AccessToken;
import com.digital.tch.china.vo.Alarm;
import com.digital.tch.china.vo.AlarmFile;
import com.digital.tch.china.vo.Notice;
import com.digital.tch.china.vo.NoticeFile;
import com.digital.tch.china.vo.ParentQa;
import com.digital.tch.china.vo.SearchCondition;
import com.digital.tch.china.vo.User;
import com.digital.tch.china.vo.WXUserInfo;
import com.digital.tch.common.property.CommonProperties;
import com.digital.tch.common.util.JSONObject;

@Transactional(propagation = Propagation.SUPPORTS)
@Controller
@RequestMapping(value = "/tch")
public class TchController {
	private final Log logger = LogFactory.getLog(this.getClass());

	@Autowired
	TchService service;

	@Autowired
	PlatformTransactionManager transactionManager;

	@RequestMapping(value = "/fileUpload", method = RequestMethod.POST)
	public @ResponseBody Model fileUpload(Model model,
			HttpServletRequest request, HttpSession session,
			@RequestParam String userId, HttpServletResponse response) {

		String fileName = "";
		int width = 0;
		int height = 0;
		String rootPath = "";
		rootPath = CommonProperties.getProperty("fileUploadRoot");

		String fileStorePath = CommonUtil.getSaveLocation(userId);

		logger.debug("savePath :" + rootPath + fileStorePath);
		String org_file_name = null;
		String save_file_name = null;
		String ext = "";
		long insertResult = 0;

		try {
			MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;

			MultipartFile uploadInputFile = multipartRequest
					.getFile("uploadInputFile");
			logger.debug("uploadInputFile:" + uploadInputFile);
			if (uploadInputFile != null) {
				if (!new File(rootPath + fileStorePath).exists()) {
					new File(rootPath + fileStorePath).mkdirs();
				}
				org_file_name = uploadInputFile.getOriginalFilename();
				logger.debug("org_file_name :" + org_file_name);
				ext = org_file_name.substring(
						org_file_name.lastIndexOf(".") + 1,
						org_file_name.length());
				save_file_name = System.currentTimeMillis() + "." + ext;
				File destination = new File(rootPath + fileStorePath + "/"
						+ save_file_name);
				FileCopyUtils.copy(uploadInputFile.getInputStream(),
						new FileOutputStream(destination));
				logger.debug("destination:" + destination);

			}
			String fileUrl = new StringBuilder("").append("/")
					.append(CommonProperties.getProperty("uploadContext"))
					.append("/").append(fileStorePath).append(save_file_name)
					.toString();
			// String returnValue="{\"url\" :\"" + fileUrl
			// +"\" ,\"fileName\":\"" +org_file_name+ "\" ,\"fileType\":\""
			// +ext+ "\"}";

			logger.debug("returnValue:" + fileUrl);
			model.addAttribute("result", fileUrl);

			model.addAttribute("resultcode",
					CommonProperties.getProperty("error.success.code"));

		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e.getMessage());
			model.addAttribute("resultcode",
					CommonProperties.getProperty("error.etc.code"));
			model.addAttribute("result",
					CommonProperties.getProperty("error.etc.msg"));
		}
		response.addHeader("Access-Control-Allow-Origin", "*");
		return model;
	}

	/**
	 * 获取微信用户信息
	 * 
	 * @Title: getWXUserInfo
	 * @Description: 获取微信用户信息
	 * @param model
	 * @param code
	 *            微信CODE【获取微信信息】
	 * @param response
	 * @param session
	 * @return
	 * @author 曾鸣 zengming@edujoy.com.cn
	 */
	@RequestMapping(value = "/getWXUserInfo")
	@ResponseBody
	public Model getWXUserInfo(Model model, @RequestParam String code,
			HttpServletResponse response, HttpSession session) {

		try {
			WXUserInfo wxUserInfo = new WXUserInfo();
			// 获取服务号、企业号标示
			if ("true".equals(CommonProperties.getProperty("isFWH"))) {
				// 服务号
				// 获取web.xml中配置的参数
				String appid = CommonProperties.getProperty("appid");
				String appsecret = CommonProperties.getProperty("appsecret");
				
				// 调用微信接口获取userid等信息
//				wxUserInfo = WeixinUtil.getUserInfoFromFWH(appid, appsecret,
//						code);
//				System.out.println("微信返回code:" + code);
				wxUserInfo.setUser_id("mtbi2");
				wxUserInfo.setWx_user_id("111111");
			} else {
				// 企业号
				// 从DB中获取AccessToken
				AccessToken accessToken = service.getAccessToken();
				// 调用微信接口获取userid等信息
				wxUserInfo = WeixinUtil.getUserInfo(
						accessToken.getAccess_token(), code);
				System.out.println("微信返回code:" + code);				
			}
			
			// 判断获取结果
			if (wxUserInfo == null || "".equals(wxUserInfo.getWx_user_id())) {
				model.addAttribute("resultcode",
						CommonProperties.getProperty("error.etc.code"));
				model.addAttribute("result", wxUserInfo);
			} else {
				// 调用数据库获取用户信息
				
				wxUserInfo.setWx_user_id(wxUserInfo.getWx_user_id());
				WXUserInfo relWXUserInfo = service.getWXUserInfo(wxUserInfo);
				if (relWXUserInfo == null) {
					relWXUserInfo = new WXUserInfo();
					relWXUserInfo.setWx_user_id(wxUserInfo.getWx_user_id());
					relWXUserInfo.setDevice_id(wxUserInfo.getDevice_id());
				} else {
					User user = new User();
					user.setUser_id(relWXUserInfo.getUser_id());
					User info = service.getUserInfo(user);
					if (info != null) {
						relWXUserInfo.setScid(info.getScid());
						relWXUserInfo.setSchool_year(info.getSchool_year());
						relWXUserInfo.setClass_no(info.getClass_no());
						relWXUserInfo.setTeacher_charge(info
								.getTeacher_charge());
						relWXUserInfo.setUser_name(info.getUser_name());
						relWXUserInfo.setPhoto_path(info.getPhoto_path());

						// 调用数据库获取用户负责班级信息
						Map<String, String> map = new HashMap<String, String>();
						map.put("scid", String.valueOf(info.getScid()));
						map.put("user_id", info.getUser_id());
						List<Map<String, String>> schoolYearList = service
								.getTeacherDutySchoolYear(map);
						relWXUserInfo.setSchool_year_list(schoolYearList);

						// 调用数据库获取老师负责科目信息
						Map<String, String> mapSubject = new HashMap<String, String>();
						mapSubject.put("scid", String.valueOf(info.getScid()));
						mapSubject.put("user_id", info.getUser_id());
						List<Map<String, String>> teacherSubjectList = service
								.getTeacherSubjectList(mapSubject);
						relWXUserInfo
								.setTeacher_subject_list(teacherSubjectList);
					}
				}
				model.addAttribute("resultcode",
						CommonProperties.getProperty("error.success.code"));
				model.addAttribute("result", relWXUserInfo);

				System.out.println("获取wxUserInfo成功，wx_user_id:"
						+ relWXUserInfo.getWx_user_id() + " device_id:"
						+ relWXUserInfo.getDevice_id());
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e.getMessage());
			model.addAttribute("resultcode",
					CommonProperties.getProperty("error.etc.code"));
			model.addAttribute("result", e.getMessage());
		}
		response.addHeader("Access-Control-Allow-Origin", "*");
		return model;
	}

	/**
	 * 授权登录
	 * 
	 * @Title: setAuthorize
	 * @Description: 授权登录
	 * @param model
	 * @param user_id
	 *            用户ID
	 * @param pass
	 *            密码
	 * @param user_type
	 *            用户类型
	 * @param wx_user_id
	 *            微信Uid
	 * @param device_id
	 *            用户设备信息
	 * @param response
	 * @param session
	 * @return
	 * @author 曾鸣 zengming@edujoy.com.cn
	 */
	@RequestMapping(value = "/setAuthorize")
	@ResponseBody
	public Model setAuthorize(Model model, @RequestParam String user_id,
			@RequestParam String pass, @RequestParam String user_type,
			@RequestParam String wx_user_id, @RequestParam String device_id,
			HttpServletResponse response, HttpSession session) {

		WXUserInfo wxUserInfo = new WXUserInfo();
		wxUserInfo.setUser_id(user_id);
		wxUserInfo.setUser_type(user_type);
		wxUserInfo.setWx_user_id(wx_user_id);
		wxUserInfo.setDevice_id(device_id);

		User parent = new User();
		parent.setUser_id(user_id);
		parent.setUser_pw(pass);
		parent.setUser_type(user_type);

		try {
			// 判断密码是否正确
			User user = service.getUserFromWX(parent);
			model.addAttribute("resultcode",
					CommonProperties.getProperty("error.success.code"));
			// 账号验证成功
			if (user != null) {
				// 判断此人是否删除
				if ("Y".equals(user.getIs_delete())) {
					// 用户已被删除
					model.addAttribute("result", "IsDelete");
				} else {
					// 授权
					int i = service.setAuthorize(wxUserInfo);
					if (i == 0) {
						// 授权失败
						model.addAttribute("result", "DBfail");
					} else {
						// 授权成功
						model.addAttribute("result", user);
					}
				}
			} else {
				// 密码错误
				model.addAttribute("result", "fail");
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e.getMessage());
			model.addAttribute("resultcode",
					CommonProperties.getProperty("error.etc.code"));
			model.addAttribute("result", e.getMessage());
		}
		response.addHeader("Access-Control-Allow-Origin", "*");
		return model;
	}

	/**
	 * 获取学校公告/老师提醒列表(家长)
	 * 
	 * @param model
	 * @param type
	 * @param user_id
	 * @param currentPage
	 * @param response
	 * @param session
	 * @return model
	 */
	@RequestMapping(value = "/getNoticeList", method = RequestMethod.POST)
	@ResponseBody
	public Model getNoticeList(Model model, @RequestParam String type,
			@RequestParam String user_id, int currentPage,
			HttpServletResponse response, HttpSession session) {
		List<Notice> noticeList = null;
		List<Alarm> alarmList = null;
		SearchCondition cond = new SearchCondition();
		cond.setUser_id(user_id);

		int recordCnt = Integer.parseInt(CommonProperties
				.getProperty("bbs.record.count"));
		cond.setCurrentPage((currentPage - 1) * recordCnt);
		cond.setRecordCnt(recordCnt);

		try {
			if ("notice".equals(type)) {
				noticeList = service.getNoticeList(cond);
				for (Notice notice : noticeList) {
					notice.setFileList(service.getNoticeFileList(notice));
				}
				model.addAttribute("result", noticeList);
			} else {
				alarmList = service.getAlarmList(cond);
				for (Alarm alarm : alarmList) {
					alarm.setFileList(service.getAlarmFileList(alarm));
				}
				model.addAttribute("result", alarmList);
			}
			model.addAttribute("resultcode",
					CommonProperties.getProperty("error.success.code"));

		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e.getMessage());
			model.addAttribute("resultcode",
					CommonProperties.getProperty("error.etc.code"));
			model.addAttribute("result", e.getMessage());
		}
		response.addHeader("Access-Control-Allow-Origin", "*");
		return model;
	}

	/**
	 * 获取提醒列表(任课教师)
	 * 
	 * @param request
	 * @param response
	 * @param session
	 * @param model
	 * @param scid
	 *            (学校ID)
	 * @param user_id
	 *            (用户ID)
	 * @param school_year
	 *            (年级)
	 * @param class_no
	 *            (班级)
	 * @param currentPage
	 *            (分页)
	 * @return
	 */

	@RequestMapping(value = "/getAlarmListBySubjectTeacher")
	@ResponseBody
	public Model getAlarmListBySubjectTeacher(HttpServletRequest request,
			HttpServletResponse response, HttpSession session, Model model,
			@RequestParam String scid, @RequestParam String user_id,
			@RequestParam String school_year, /* @RequestParam String class_no, */
			@RequestParam String subject_id, @RequestParam int currentPage) {

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("scid", scid);
		map.put("user_id", user_id);
		map.put("school_year", school_year);
		// map.put("class_no", class_no);
		map.put("search_word", "");
		map.put("search_key", "all");
		map.put("subject_id", subject_id);// 00代表任课老师
		ArrayList<AlarmFile> list = new ArrayList<AlarmFile>();
		AlarmFile af = new AlarmFile();
		af.setFilename("true");
		list.add(af);// 只是为了跟前端家长端保持一致

		if (scid != null && user_id != null) {
			try {
				List<Alarm> getAlarmListBySubjectTeacher = null;
				int recordCnt = Integer.parseInt(CommonProperties
						.getProperty("bbs.record.count"));
				int startRowCount = (currentPage - 1) * recordCnt;
				map.put("currentPage", (startRowCount));
				map.put("recordCnt", (recordCnt));
				getAlarmListBySubjectTeacher = service
						.getAlarmListBySubjectTeacher(map);
				for (Alarm alarm : getAlarmListBySubjectTeacher) {
					if ("true".equals(alarm.getIsFile())) {
						alarm.setFileList(list);// true表示存在附件
					}
				}

				model.addAttribute("resultcode",
						CommonProperties.getProperty("error.success.code"));
				model.addAttribute("result", getAlarmListBySubjectTeacher);
			} catch (Exception e) {
				e.printStackTrace();
				model.addAttribute("resultcode",
						CommonProperties.getProperty("error.success.code"));
				model.addAttribute("result", e.getMessage());
			}
		} else {
			model.addAttribute("resultcode",
					CommonProperties.getProperty("error.success.code"));
			model.addAttribute("result", "Username or school can not be empty");
		}
		return model;
	}

	/**
	 * 获取提醒列表(班主任教师)
	 * 
	 * @param request
	 * @param response
	 * @param session
	 * @param model
	 * @param scid
	 *            (学校ID)
	 * @param user_id
	 *            (用户ID)
	 * @param school_year
	 *            (学年)
	 * @param class_no
	 *            (班级)
	 * @param currentPage
	 *            (分页)
	 * @return
	 */
	@RequestMapping(value = "/getAlarmListByClassTeacher", method = RequestMethod.POST)
	@ResponseBody
	public Model getAlarmListByClassTeacher(HttpServletRequest request,
			HttpServletResponse response, HttpSession session, Model model,
			@RequestParam String scid, @RequestParam String user_id,
			@RequestParam String school_year, @RequestParam String class_no,
			@RequestParam int currentPage) {

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("scid", scid);
		map.put("user_id", user_id);
		map.put("search_key", "all");
		map.put("search_word", "");
		map.put("school_year", school_year);
		map.put("class_no", class_no);
		ArrayList<AlarmFile> list = new ArrayList<AlarmFile>();
		AlarmFile af = new AlarmFile();
		af.setFilename("true");
		list.add(af);// 只是为了跟前端家长端保持一致

		if (scid != null && user_id != null) {
			try {
				List<Alarm> getAlarmListByClassTeacher = null;
				int recordCnt = Integer.parseInt(CommonProperties
						.getProperty("bbs.record.count"));
				int startRowCount = (currentPage - 1) * recordCnt;
				map.put("currentPage", (startRowCount));
				map.put("recordCnt", (recordCnt));

				Map<String, String> pagingInfo = null;
				getAlarmListByClassTeacher = service
						.getAlarmListByClassTeacher(map);
				for (Alarm alarm : getAlarmListByClassTeacher) {
					if ("true".equals(alarm.getIsFile())) {
						alarm.setFileList(list);// true表示存在附件
					}
				}

				model.addAttribute("resultcode",
						CommonProperties.getProperty("error.success.code"));
				model.addAttribute("result", getAlarmListByClassTeacher);

			} catch (Exception e) {
				model.addAttribute("resultcode",
						CommonProperties.getProperty("error.success.code"));
				model.addAttribute("result", e.getMessage());
			}
		} else {
			model.addAttribute("resultcode",
					CommonProperties.getProperty("error.success.code"));
			model.addAttribute("result", "Username or school can not be empty");
		}

		return model;
	}

	/**
	 * 获取公告列表(教师)
	 * 
	 * @param request
	 * @param response
	 * @param session
	 * @param model
	 * @param user_id
	 *            (用户ID)
	 * @param scid
	 *            (学校ID)
	 * @param currentPage
	 *            (分页)
	 * @return
	 */
	@RequestMapping(value = "/getTchNoticeList")
	@ResponseBody
	public Model getTchNoticeList(HttpServletRequest request,
			HttpServletResponse response, HttpSession session, Model model,
			@RequestParam String user_id, @RequestParam String scid,
			@RequestParam int currentPage) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("scid", scid);
		map.put("user_id", user_id);

		ArrayList<NoticeFile> list = new ArrayList<NoticeFile>();
		NoticeFile nf = new NoticeFile();
		nf.setFilename("true");
		list.add(nf);// 只是为了跟前端家长端保持一致

		if (scid != null && user_id != null) {
			try {
				int recordCnt = Integer.parseInt(CommonProperties
						.getProperty("bbs.record.count"));
				int startRowCount = (currentPage - 1) * recordCnt;
				map.put("currentPage", (startRowCount));
				map.put("recordCnt", (recordCnt));

				List<Notice> getTchNoticeList = null;
				getTchNoticeList = service.getTchNoticeList(map);
				for (Notice notice : getTchNoticeList) {
					if ("true".equals(notice.getFile_added())) {
						notice.setFileList(list);// 表示存在附件
					}
				}

				model.addAttribute("resultcode",
						CommonProperties.getProperty("error.success.code"));
				model.addAttribute("result", getTchNoticeList);
			} catch (Exception e) {
				e.printStackTrace();
				model.addAttribute("resultcode",
						CommonProperties.getProperty("error.etc.code"));
				model.addAttribute("result", e.getMessage());
			}
		} else {
			model.addAttribute("resultcode",
					CommonProperties.getProperty("error.etc.code"));
			model.addAttribute("result", "Username or school can not be empty");
		}
		return model;
	}

	/**
	 * 获取公告详细信息
	 * 
	 * @param model
	 * @param nid
	 *            (公告ID)
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/getNoticeInfo")
	@ResponseBody
	public Model getNoticeInfo(Model model, @RequestParam long nid,
			HttpServletResponse response, HttpSession session) {
		System.err.println(session.getId());
		try {
			Notice not = new Notice();
			not.setNid(nid);
			Notice notice = service.getNoticeInfo(not);
			notice.setFileList(service.getNoticeFileList(notice));

			model.addAttribute("resultcode",
					CommonProperties.getProperty("error.success.code"));
			model.addAttribute("result", notice);

		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e.getMessage());
			model.addAttribute("resultcode",
					CommonProperties.getProperty("error.etc.code"));
			model.addAttribute("result", e.getMessage());
		}
		response.addHeader("Access-Control-Allow-Origin", "*");
		return model;
	}

	/**
	 * 获取提醒详细信息
	 * 
	 * @param model
	 * @param aid
	 *            (提醒ID)
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/getAlarmInfo")
	@ResponseBody
	public Model getAlarmInfo(Model model, @RequestParam int aid,
			@RequestParam String scid, @RequestParam String user_id,
			HttpServletResponse response, HttpSession session) {

		try {
			Map<String, String> map = new HashMap<String, String>();
			map.put("scid", scid);
			map.put("aid", String.valueOf(aid));
			map.put("user_id", user_id);
			// TODO 可优化
			Alarm alm = new Alarm();
			alm.setAid(aid);
			Alarm alarm = service.getAlarmInfo(alm);
			// 获取附件
			alarm.setFileList(service.getAlarmFileList(alarm));
			// 获取被提醒人
			List<Map<String, String>> getAlarmDetailByClassTeacher_receivedStudents = service
					.getAlarmDetailByClassTeacher_receivedStudents(map);
			alarm.setStudent_list(getAlarmDetailByClassTeacher_receivedStudents);
			// 任课老师提醒的班级
			Map<String, String> getAlarmDetailByClassTeacher = service
					.getAlarmDetailByClassTeacher(map);
			alarm.setTeacherClass(/*
								 * getAlarmDetailByClassTeacher
								 * .get("teacher_name") +
								 */"("
					+ getAlarmDetailByClassTeacher.get("target_school_year")
					+ "-" + getAlarmDetailByClassTeacher.get("target_class_no")
					+ ")");

			model.addAttribute("resultcode",
					CommonProperties.getProperty("error.success.code"));
			model.addAttribute("result", alarm);

		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e.getMessage());
			model.addAttribute("resultcode",
					CommonProperties.getProperty("error.etc.code"));
			model.addAttribute("result", e.getMessage());
		}
		response.addHeader("Access-Control-Allow-Origin", "*");
		return model;
	}

	/**
	 * 点击未读过的帖子
	 * 
	 * @param model
	 * @param key
	 *            (公告或提醒ID)
	 * @param user_id
	 *            (用户ID)
	 * @param type
	 *            (公告或提醒)
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/insertRead")
	@ResponseBody
	public Model insertRead(Model model, @RequestParam long key,
			String user_id, String type, HttpServletResponse response,
			HttpSession session) {

		try {
			SearchCondition cond = new SearchCondition();
			cond.setKey(key);
			cond.setUser_id(user_id);
			int result = 0;
			if ("N".equals(type))
				result = service.insertNoticeRead(cond);
			else if ("A".equals(type))
				result = service.insertAlarmRead(cond);
			else if ("Q".equals(type))
				result = service.insertParentQaRead(cond);
			model.addAttribute("resultcode",
					CommonProperties.getProperty("error.success.code"));
			model.addAttribute("result", result);

		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e.getMessage());
			model.addAttribute("resultcode",
					CommonProperties.getProperty("error.etc.code"));
			model.addAttribute("result", e.getMessage());
		}
		response.addHeader("Access-Control-Allow-Origin", "*");
		return model;
	}

	/**
	 * 
	 * getAddressBookStudentsList(获取学生列表)
	 * 
	 * @param model
	 * @param scid
	 *            (学校id)
	 * @param school_year
	 *            (年份)
	 * @param class_no
	 *            (班级id)
	 * @param response
	 * @param session
	 * @return Model
	 * @exception
	 * @since 1.0.0
	 */
	@RequestMapping(value = "/getAddressBookStudentsList", method = RequestMethod.POST)
	@ResponseBody
	public Model getAddressBookStudentsList(Model model,
			@RequestParam String scid, @RequestParam String school_year,
			@RequestParam String class_no, HttpServletResponse response,
			HttpSession session) {

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("scid", scid);
		map.put("school_year", school_year);
		map.put("class_no", class_no);

		if (scid != null && school_year != null && class_no != null) {
			try {
				List<User> getAddressBookStudentsList = service
						.getAddressBookStudentsList(map);
				model.addAttribute("resultcode",
						CommonProperties.getProperty("error.success.code"));
				model.addAttribute("result", getAddressBookStudentsList);
			} catch (Exception e) {
				e.printStackTrace();
				model.addAttribute("resultcode",
						CommonProperties.getProperty("error.dberror.code"));
				model.addAttribute("result",
						CommonProperties.getProperty("error.dberror.msg"));
			}
		} else {
			model.addAttribute("resultcode",
					CommonProperties.getProperty("error.jsonparse.code"));
			model.addAttribute("result",
					CommonProperties.getProperty("error.jsonparse.msg"));
		}

		return model;
	}
	
	
	/**
	 * 
	 * getMyClassStudentParentsList(获取家长列表)
	 * 
	 * @param model
	 * @param scid
	 *            (学校id)
	 * @param user_id
	 *            (学生id)
	 * @param user_name
	 *             (学生姓名)
	 * @param school_year
	 *            (年份)
	 * @param class_no
	 *            (班级id)
	 * 
	 * @param response
	 * @param session
	 * @return Model
	 * @exception
	 * @since 1.0.0
	 */
	@RequestMapping(value = "/getMyClassStudentParentsList", method = RequestMethod.POST)
	@ResponseBody
	public Model getMyClassStudentParentsList(Model model,
			@RequestParam String scid, @RequestParam String user_id, 
			@RequestParam String user_name,@RequestParam String school_year,
			@RequestParam String class_no, HttpServletResponse response,
			HttpSession session) {

		Map<String, String> map = new HashMap<String, String>();
		map.put("scid", scid);
		map.put("user_id", user_id);
		map.put("user_name", user_name);
		map.put("school_year", school_year);
		map.put("class_no", class_no);

		if (scid != null && user_id != null && school_year != null && class_no != null) {
			try {
				
				List<Map<String,String>> getMyClassStudentParentsList = service.getMyClassStudentParentsList(map);
				
				
				model.addAttribute("resultcode", CommonProperties.getProperty("error.success.code"));
				model.addAttribute("result", getMyClassStudentParentsList);
				
				
			} catch (Exception e) {
				e.printStackTrace();
				model.addAttribute("resultcode",
						CommonProperties.getProperty("error.dberror.code"));
				model.addAttribute("result",
						CommonProperties.getProperty("error.dberror.msg"));
			}
		} else {
			model.addAttribute("resultcode",
					CommonProperties.getProperty("error.jsonparse.code"));
			model.addAttribute("result",
					CommonProperties.getProperty("error.jsonparse.msg"));
		}

		return model;
	}
	
	
	/**
	 * 
	 * addTeacherQna(新建老师问答)
	 * 
	 * @param model
	 * @param scid
	 *            (学校id)
	 * @param user_id
	 *            (老师id)
	 * @param student_id
	 *            (学生id)
	 * @param school_year
	 *            (年份)
	 * @param class_no
	 *            (班级id)
	 * @param comment
	 *            (提问内容)
	 * @param value_user_type
	 *            (提问者身份)
	 * @param target_type
	 *            (被提问者与学生的关系)
	 * 
	 * @param response
	 * @param session
	 * @return Model
	 * @exception
	 * @since 1.0.0
	 */
	@RequestMapping(value = "/addTeacherQna", method = RequestMethod.POST)
	@ResponseBody
	public Model addTeacherQna(Model model,
			@RequestParam String scid, @RequestParam String user_id, 
			@RequestParam String student_id,@RequestParam String school_year,
			@RequestParam String class_no, @RequestParam String comment,
			@RequestParam String value_user_type,@RequestParam String target_type,
			HttpServletResponse response,
			HttpSession session) {
		
		Map<String, String> map = new HashMap<String, String>();
		map.put("scid", scid);
		map.put("user_id", user_id);
		map.put("student_id", student_id);
		map.put("school_year", school_year);
		map.put("class_no", class_no);
		map.put("comment", comment);
		map.put("value_user_type", value_user_type);
		map.put("target_type", target_type);
		
		if (scid != null && user_id != null && comment != null && student_id != null && target_type != null) {
			DefaultTransactionDefinition txDefinition = new DefaultTransactionDefinition();
			txDefinition.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
			TransactionStatus txStatus = transactionManager.getTransaction(txDefinition);
			try {				
				int pqaid = service.addTeacherQna(map);
				logger.debug("addTeacherQna pqaid =>"+ pqaid);
				if(pqaid > 0){
					map.put("pqaid",String.valueOf(pqaid));
					int commentId = service.addTeacherQnaComment(map);
					logger.debug("commentId =>"+ commentId);
				}
				
				
				model.addAttribute("resultcode", CommonProperties.getProperty("error.success.code"));
				model.addAttribute("result", pqaid);
				transactionManager.commit(txStatus);
				
				
			} catch (Exception e) {
				e.printStackTrace();
				model.addAttribute("resultcode",
						CommonProperties.getProperty("error.dberror.code"));
				model.addAttribute("result",
						CommonProperties.getProperty("error.dberror.msg"));
			}
		} else {
			model.addAttribute("resultcode",
					CommonProperties.getProperty("error.jsonparse.code"));
			model.addAttribute("result",
					CommonProperties.getProperty("error.jsonparse.msg"));
		}
		return model;
	}
	
	

	@RequestMapping(value = "/getTeacherClassListBySubjectId", method = RequestMethod.POST)
	@ResponseBody
	public Model getTeacherClassListBySubjectId(HttpServletRequest request,
			HttpServletResponse response, HttpSession session, Model model,
			@RequestBody String jsonString) {
		logger.debug("==============================");
		logger.debug("getTeacherClassListBySubjectId =>" + jsonString);
		logger.debug("==============================");

		JSONObject json = new JSONObject(jsonString);
		String scId = json.getString("scid", null);
		String userId = json.getString("user_id", null);
		String subjectId = json.getString("subject_id", null);
		String schoolYear = json.getString("school_year", null);
		logger.debug("requestParam[scid] => " + scId);
		logger.debug("requestParam[user_id] => " + userId);
		logger.debug("requestParam[subject_id] => " + subjectId);
		logger.debug("requestParam[school_year] =>" + schoolYear);
		Map<String, String> map = new HashMap<String, String>();
		map.put("user_id", userId);
		map.put("scid", scId);
		map.put("subject_id", subjectId);
		map.put("school_year", schoolYear);

		if (userId != null && scId != null && subjectId != null) {
			try {
				List<Map<String, String>> resultMapList = service
						.getTeacherClassListBySubjectId(map);
				logger.debug("resultMap list .size  :" + resultMapList.size());
				model.addAttribute("resultcode",
						CommonProperties.getProperty("error.success.code"));
				model.addAttribute("result", resultMapList);
			} catch (Exception e) {
				e.printStackTrace();
				model.addAttribute("resultcode",
						CommonProperties.getProperty("error.dberror.code"));
				model.addAttribute("result",
						CommonProperties.getProperty("error.dberror.msg"));
			}
		} else {
			model.addAttribute("resultcode",
					CommonProperties.getProperty("error.jsonparse.code"));
			model.addAttribute("result",
					CommonProperties.getProperty("error.jsonparse.msg"));
		}

		return model;
	}

	@RequestMapping(value = "/addAlarm", method = RequestMethod.POST)
	@ResponseBody
	public Model addAlarm(HttpServletRequest request,
			HttpServletResponse response, HttpSession session, Model model,
			@RequestBody String jsonString) {
		logger.debug("==============================");
		logger.debug("addAlarm =>" + jsonString);
		logger.debug("==============================");

		JSONObject json = new JSONObject(jsonString);
		String scId = json.getString("scid", null);
		String userId = json.getString("user_id", null);
		String subjectId = json.getString("subject_id", null);
		String title = json.getString("title", null);
		String memo = json.getString("memo", null);
		String valueUserType = json.getString("value_user_type", null);
		List<String> classList = json.getStringList("class_list");
		List<String> fileList = json.getStringList("file_list");
		List<String> contentsIdList = json.getStringList("contents_id_list");

		logger.debug("requestParam[scid] =>" + scId);
		logger.debug("requestParam[user_id] =>" + userId);
		logger.debug("requestParam[subject_id] =>" + subjectId);
		logger.debug("requestParam[title] =>" + title);
		logger.debug("requestParam[memo] =>" + memo);
		logger.debug("requestParam[value_user_type] =>" + valueUserType);
		logger.debug("requestParam[class_list] =>" + classList);
		logger.debug("requestParam[file_list] =>" + fileList);
		logger.debug("requestParam[contents_id_list] =>" + contentsIdList);

		if (classList != null) {
			logger.debug("requestParam[classList.size] =>" + classList.size());
			for (String str : classList) {
				String schoolYear = new JSONObject(str).getString(
						"school_year", null);
				String classNo = new JSONObject(str)
						.getString("class_no", null);
				logger.debug("school_year =>" + schoolYear + " class_no =>"
						+ classNo);
			}
		}
		if (fileList != null) {
			logger.debug("requestParam[fileList.size] =>" + fileList.size());
			for (String str : fileList) {
				String filePath = new JSONObject(str).getString("file_path",
						null);
				logger.debug("file_path =>" + filePath);
			}
		}
		if (contentsIdList != null) {
			logger.debug("requestParam[contents_id_list.size] =>"
					+ contentsIdList.size());
			for (String str : contentsIdList) {
				String contentsId = new JSONObject(str).getString(
						"contents_id", null);
				logger.debug("contents_id =>" + contentsId);
			}
		}
		// if(valueUserType != null && valueUserType.equals("T")){
		// subjectId = "00";
		// log.debug("subject_id is '00' because value_user_type is 'T'");
		// }

		Map<String, String> map = new HashMap<String, String>();
		map.put("scid", scId);
		map.put("user_id", userId);
		map.put("subject_id", subjectId);
		map.put("title", title);
		map.put("memo", memo);

		if (scId != null && userId != null && memo != null && subjectId != null
				&& classList != null) {
			DefaultTransactionDefinition txDefinition = new DefaultTransactionDefinition();
			txDefinition
					.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
			TransactionStatus txStatus = transactionManager
					.getTransaction(txDefinition);
			try {

				if (classList != null && classList.size() > 0) {

				}
				int aid = service.addAlarm(map);
				logger.debug("addAlarm result =>" + aid);
				//
				map.put("aid", String.valueOf(aid));
				//
				if (aid > 0) {
					if (classList != null && classList.size() > 0) {
						for (String str : classList) {
							String schoolYear = new JSONObject(str).getString(
									"school_year", null);
							String classNo = new JSONObject(str).getString(
									"class_no", null);
							map.put("school_year", schoolYear);
							map.put("class_no", classNo);

							int result = service.addAlarmClass(map);
							logger.debug("addAlarmClass result =>" + result);
						}
					}
					if (fileList != null && fileList.size() > 0) {
						for (String str : fileList) {
							String filePath = new JSONObject(str).getString(
									"file_path", null);
							String fileName = filePath.split("/")[filePath
									.split("/").length - 1];
							filePath = filePath.substring(0, filePath.length()
									- fileName.length());
							logger.debug("filePath =>" + filePath);
							logger.debug("fileName =>" + fileName);
							map.put("file_path", filePath);
							map.put("file_name", fileName);

							int result = service.addAlarmFile(map);
							logger.debug("addAlarmFile result = >" + result);
						}
					}
					// if(contentsIdList != null){
					// log.debug("requestParam[contents_id_list.size] =>"+
					// contentsIdList.size());
					// for(String str : contentsIdList){
					// String contentsId = new
					// JSONObject(str).getString("contents_id", null);
					// log.debug("contents_id =>"+ contentsId);
					//
					// map.put("contents_id", contentsId);
					// int result = service.addAlarmFileContents(map);
					// log.debug("addAlarmFileContents =>"+ result);
					// }
					// }
					//
					model.addAttribute("resultcode",
							CommonProperties.getProperty("error.success.code"));
					model.addAttribute("result", aid);
				} else {
					model.addAttribute("resultcode",
							CommonProperties.getProperty("error.dberror.code"));
					model.addAttribute("result", "There is not aid");
				}

				transactionManager.commit(txStatus);
			} catch (Exception e) {
				transactionManager.rollback(txStatus);
				e.printStackTrace();
				model.addAttribute("resultcode",
						CommonProperties.getProperty("error.dberror.code"));
				model.addAttribute("result",
						CommonProperties.getProperty("error.dberror.msg"));
			}
		} else {
			model.addAttribute("resultcode",
					CommonProperties.getProperty("error.jsonparse.code"));
			model.addAttribute("result",
					CommonProperties.getProperty("error.jsonparse.msg"));
		}

		return model;
	}

	@RequestMapping(value = "/addAlarmMyClass", method = RequestMethod.POST)
	@ResponseBody
	public Model addAlarmMyClass(HttpServletRequest request,
			HttpServletResponse response, HttpSession session, Model model,
			@RequestBody String jsonString) {
		logger.debug("==============================");
		logger.debug("addAlarmMyClass =>" + jsonString);
		logger.debug("==============================");

		JSONObject json = new JSONObject(jsonString);
		String scId = json.getString("scid", null);
		String userId = json.getString("user_id", null);
		String title = json.getString("title", null);
		String memo = json.getString("memo", null);
		String schoolYear = json.getString("school_year", null);
		String classNo = json.getString("class_no", null);
		List<String> fileList = json.getStringList("file_list");
		List<String> student_list = json.getStringList("student_list");

		logger.debug("requestParam[scid] =>" + scId);
		logger.debug("requestParam[user_id] =>" + userId);
		logger.debug("requestParam[title] =>" + title);
		logger.debug("requestParam[memo] =>" + memo);
		logger.debug("requestParam[school_year] =>" + schoolYear);
		logger.debug("requestParam[class_no] =>" + classNo);
		logger.debug("requestParam[file_list] =>" + fileList);
		List<String> studentList = null;
		if (student_list != null) {
			studentList = new ArrayList<String>();
			logger.debug("requestParam[students_list.size] =>"
					+ student_list.size());
			for (String str : student_list) {
				String student_id = new JSONObject(str).getString("user_id",
						null);
				logger.debug("student_id =>" + student_id);
				studentList.add(student_id);
			}
		}

		if (fileList != null) {
			logger.debug("requestParam[fileList.size] =>" + fileList.size());
			for (String str : fileList) {
				String filePath = new JSONObject(str).getString("file_path",
						null);
				logger.debug("file_path =>" + filePath);
			}
		}

		Map<String, String> map = new HashMap<String, String>();
		map.put("scid", scId);
		map.put("user_id", userId);
		map.put("subject_id", "00");
		map.put("title", title);
		map.put("memo", memo);
		map.put("school_year", schoolYear);
		map.put("class_no", classNo);

		if (scId != null && userId != null && memo != null
				&& schoolYear != null && classNo != null && studentList != null) {
			DefaultTransactionDefinition txDefinition = new DefaultTransactionDefinition();
			txDefinition
					.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
			TransactionStatus txStatus = transactionManager
					.getTransaction(txDefinition);
			try {

				int aid = service.addAlarm(map);
				logger.debug("addAlarm result =>" + aid);
				map.put("aid", String.valueOf(aid));
				if (aid > 0) {
					int addAlarmClass = service.addAlarmClass(map);
					logger.debug("addAlarmClass result =>" + addAlarmClass);

					if (fileList != null && fileList.size() > 0) {
						for (String str : fileList) {
							String filePath = new JSONObject(str).getString(
									"file_path", null);
							String fileName = filePath.split("/")[filePath
									.split("/").length - 1];
							filePath = filePath.substring(0, filePath.length()
									- fileName.length());
							logger.debug("filePath =>" + filePath);
							logger.debug("fileName =>" + fileName);
							map.put("file_path", filePath);
							map.put("file_name", fileName);

							int result = service.addAlarmFile(map);
							logger.debug("addAlarmFile result = >" + result);
						}
					}

					int insertCount = 0;
					for (String student_id : studentList) {
						map.put("user_id", student_id);
						int addAlarmToStudents = service
								.addAlarmToStudents(map);
						logger.debug("addAlarmToStudents result =>"
								+ student_id + "," + addAlarmToStudents);
						insertCount++;
					}
					logger.debug("addAlarmToStudents insertCount =>"
							+ insertCount);
					model.addAttribute("resultcode",
							CommonProperties.getProperty("error.success.code"));
					model.addAttribute("result", insertCount);
				} else {
					model.addAttribute("resultcode",
							CommonProperties.getProperty("error.dberror.code"));
					model.addAttribute("result", "There is not aid");
				}
				// sendSMSData(scId, studentList,title+"\n" + memo);
				transactionManager.commit(txStatus);
			} catch (Exception e) {
				transactionManager.rollback(txStatus);
				e.printStackTrace();
				model.addAttribute("resultcode",
						CommonProperties.getProperty("error.dberror.code"));
				model.addAttribute("result",
						CommonProperties.getProperty("error.dberror.msg"));
			}
		} else {
			model.addAttribute("resultcode",
					CommonProperties.getProperty("error.jsonparse.code"));
			model.addAttribute("result",
					CommonProperties.getProperty("error.jsonparse.msg"));
		}
		return model;
	}
	/**
	 * 获取用户个人信息
	 * @param model
	 * @param user_id
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/getUserPersInfo", method = RequestMethod.POST)
	@ResponseBody
	public Model getUserInfo(Model model,@RequestParam String user_id,
			HttpServletResponse response,HttpServletRequest request,HttpSession session) {

		try{
			User user = new User();
			user.setUser_id(user_id);
			User info = service.getUserPersInfo(user);
			
			WXUserInfo userInfo=new WXUserInfo();
			Map<String, String> map = new HashMap<String, String>();

			map.put("user_id", user_id);
			List<Map<String, String>> teacherSubjectList =service.getTeacherSubject(map);
			userInfo.setTeacher_subject_list(teacherSubjectList);
			
			String birth = info.getBirthday();
			String birthday = birth.split(" ")[0];
			info.setBirthday(birthday);
			
			model.addAttribute("resultcode", CommonProperties.getProperty("error.success.code"));
			model.addAttribute("result", info);
			model.addAttribute("result1", userInfo);
			
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.getMessage());
			model.addAttribute("resultcode", CommonProperties.getProperty("error.etc.code"));
			model.addAttribute("result",e.getMessage());
		}
		response.addHeader("Access-Control-Allow-Origin", "*");
		return model;
	}
	/**
	 * 获取家长问答列表
	 * 
	 * @param model
	 * @param parent_id
	 * @param currentPage
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/getParentQaList")
	@ResponseBody
	public Model getParentQaList(Model model, @RequestParam String user_id,
			@RequestParam String school_year, @RequestParam String class_no,
			int currentPage, HttpServletResponse response, HttpSession session) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("user_id", user_id);
		map.put("class_no", class_no);
		map.put("school_year", school_year);

		ArrayList<ParentQa> list = new ArrayList<ParentQa>();

		if (user_id != null) {
			try {
				int recordCnt = Integer.parseInt(CommonProperties
						.getProperty("bbs.record.count"));
				int startRowCount = (currentPage - 1) * recordCnt;
				map.put("currentPage", (startRowCount));
				map.put("recordCnt", (recordCnt));

				List<ParentQa> ParentQaList = null;
				ParentQaList = service.getParentQaList(map);

				model.addAttribute("resultcode",
						CommonProperties.getProperty("error.success.code"));
				model.addAttribute("result", ParentQaList);
			} catch (Exception e) {
				e.printStackTrace();
				model.addAttribute("resultcode",
						CommonProperties.getProperty("error.etc.code"));
				model.addAttribute("result", e.getMessage());
			}
		} else {
			model.addAttribute("resultcode",
					CommonProperties.getProperty("error.etc.code"));
			model.addAttribute("result", "Username or school can not be empty");
		}
		return model;
	}
	/**
	 * 
	 * @param model
	 * @param user_id
	 * @param address
	 * @param phone
	 * @param qq
	 * @param email
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/updateTeacher", method = RequestMethod.POST)
	@ResponseBody
	public Model updateTeacher(Model model,@RequestParam String user_id,String address,String phone,
			String qq,String user_email,
			HttpServletResponse response,HttpSession session) {
		
		try{
			User user = new User();
			user.setUser_id(user_id);
			user.setAddress(address);
			user.setUser_email(user_email);
			user.setPhone(phone);
			user.setSns(qq);
			int result = service.updateTeacher(user);
			
			model.addAttribute("resultcode", CommonProperties.getProperty("error.success.code"));
			model.addAttribute("result", result);
			
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.getMessage());
			model.addAttribute("resultcode", CommonProperties.getProperty("error.etc.code"));
			model.addAttribute("result",e.getMessage());
		}
		response.addHeader("Access-Control-Allow-Origin", "*");
		return model;
	}

	/**
	 * 获取家长问答详细
	 * 
	 * @param model
	 * @param user_id
	 * @param scid
	 * @param pqaid
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/getQnaDetail", method = RequestMethod.POST)
	@ResponseBody
	public Model getQnaDetail(Model model, @RequestParam String scid,
			@RequestParam String pqaid, @RequestParam String user_id,
			HttpServletResponse response, HttpSession session) {
		Map<String, String> map = new HashMap<String, String>();
		map.put("scid", scid);
		map.put("pqaid", pqaid);
		map.put("user_id", user_id);

		if (scid != null && pqaid != null) {

			try {
				Map<String, String> getQnaDetailInfo = service
						.getQnaDetailInfo(map);
				logger.debug("getQnaDetailInfo result =>" + getQnaDetailInfo);

				List<Map<String, String>> getQnaCommentList = null;
				if (getQnaDetailInfo != null
						&& (getQnaDetailInfo.get("pqaid") != null)) {
					getQnaCommentList = service.getQnaCommentList(map);
					for (int i = 0; i < getQnaCommentList.size(); i++) {
						getQnaCommentList.get(i).put(
								"reg_date_format",
								String.valueOf(
										getQnaCommentList.get(i)
												.get("reg_date")).substring(0,
										16));
					}
				}
				logger.debug("getQnaCommentList =>" + getQnaCommentList);
				if (getQnaCommentList != null) {
					logger.debug("getQnaCommentList.size =>"
							+ getQnaCommentList.size());
				}

				// 修改已读标识
				int updateTeacherReadState = service
						.updateTeacherReadState(map);
				logger.debug("updateTeacherReadState result =>"
						+ updateTeacherReadState);
				Map<String, Object> resultData = new HashMap<String, Object>();
				resultData.put("qnaInfo", getQnaDetailInfo);
				resultData.put("commentList", getQnaCommentList);
				model.addAttribute("resultcode",
						CommonProperties.getProperty("error.success.code"));
				model.addAttribute("resultData", resultData);

			} catch (Exception e) {

				e.printStackTrace();
				model.addAttribute("resultcode",
						CommonProperties.getProperty("error.dberror.code"));
				model.addAttribute("resultData",
						CommonProperties.getProperty("error.dberror.msg"));
			}
		} else {
			model.addAttribute("resultcode",
					CommonProperties.getProperty("error.jsonparse.code"));
			model.addAttribute("resultData",
					CommonProperties.getProperty("error.jsonparse.msg"));
		}
		return model;
	}

	/**
	 * 删除家长问答回复
	 * @param model
	 * @param comment_id
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/deleteParentQaComment", method = RequestMethod.POST)
	@ResponseBody
	public Model deleteParentQaComment(Model model,
			@RequestParam String comment_id, HttpServletResponse response,
			HttpSession session) {
		Map<String, String> map = new HashMap<String, String>();
		map.put("comment_id", comment_id);

		if (comment_id != null) {
			try {
				int result = service.deleteParentQaComment(map);
				logger.debug("deleteParentQaComment size=>" + result);
				model.addAttribute("resultcode",
						CommonProperties.getProperty("error.success.code"));
				model.addAttribute("resultData", result);
			} catch (Exception e) {
				e.printStackTrace();
				model.addAttribute("resultcode",
						CommonProperties.getProperty("error.dberror.code"));
				model.addAttribute("resultData",
						CommonProperties.getProperty("error.dberror.msg"));
			}
		} else {
			model.addAttribute("resultcode",
					CommonProperties.getProperty("error.jsonparse.code"));
			model.addAttribute("resultData",
					CommonProperties.getProperty("error.jsonparse.msg"));
		}
		return model;
	}
	
	/**
	 * 家长问答再次提问
	 * @param model
	 * @param scid
	 * @param user_id
	 * @param comment
	 * @param pqaid
	 * @param reg_type
	 * @param response
	 * @param session
	 * @return
	 */
	@RequestMapping(value = "/insertParentQaComment", method = RequestMethod.POST)
	@ResponseBody
	public Model insertParentQaComment(Model model,
			@RequestParam String scid,@RequestParam String user_id,@RequestParam String comment,@RequestParam String pqaid,@RequestParam String reg_type,HttpServletResponse response,
			HttpSession session) {
		Map<String, String> map = new HashMap<String, String>();
		map.put("scid", scid);
		map.put("user_id", user_id);
		map.put("comment", comment);
		map.put("pqaid", pqaid);
		map.put("reg_type", reg_type);
		
		if( scid != null &&  user_id != null && comment != null){
			DefaultTransactionDefinition txDefinition = new DefaultTransactionDefinition();
			txDefinition.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);
			TransactionStatus txStatus = transactionManager.getTransaction(txDefinition);
			try {
				int result = service.insertParentQaComment(map);
				logger.debug("insertParentQaComment result =>"+ result);
				model.addAttribute("resultcode", CommonProperties.getProperty("error.success.code"));
				model.addAttribute("resultData", result);
				transactionManager.commit(txStatus);
			} catch (Exception e) {
				transactionManager.rollback(txStatus);
				e.printStackTrace();
				model.addAttribute("resultcode", CommonProperties.getProperty("error.dberror.code"));
				model.addAttribute("resultData", CommonProperties.getProperty("error.dberror.msg"));
			}
		}else{
			model.addAttribute("resultcode", CommonProperties.getProperty("error.jsonparse.code"));
			model.addAttribute("resultData", CommonProperties.getProperty("error.jsonparse.msg"));
		}
	return model;
	}
	@RequestMapping(value = "/updatePw")
	@ResponseBody
	public Model updateParent(Model model,@RequestParam String user_id,String user_pw,
			HttpServletResponse response,HttpSession session) {
		
		try{
			User user = new User();
			user.setUser_id(user_id);
			user.setUser_pw(user_pw);
			int result = service.updatePw(user);
			
			model.addAttribute("resultcode", CommonProperties.getProperty("error.success.code"));
			model.addAttribute("result", result);
			
		}catch(Exception e){
			e.printStackTrace();
			logger.error(e.getMessage());
			model.addAttribute("resultcode", CommonProperties.getProperty("error.etc.code"));
			model.addAttribute("result",e.getMessage());
		}
		response.addHeader("Access-Control-Allow-Origin", "*");
		return model;
	   }
	
}
