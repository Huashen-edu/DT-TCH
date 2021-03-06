package com.digital.tch.china.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import com.digital.tch.china.vo.AccessToken;
import com.digital.tch.china.vo.Alarm;
import com.digital.tch.china.vo.AlarmFile;
import com.digital.tch.china.vo.Notice;
import com.digital.tch.china.vo.NoticeFile;
import com.digital.tch.china.vo.ParentQa;
import com.digital.tch.china.vo.SearchCondition;
import com.digital.tch.china.vo.User;
import com.digital.tch.china.vo.WXMessage;
import com.digital.tch.china.vo.WXUserInfo;
import com.digital.tch.common.dao.CommonDao;

@Repository
public class TchDao extends CommonDao {

	public User getUserInfo(User user) throws Exception {

		SqlSession session = getSqlSession();
		User info = null;
		info = session.selectOne("tch.getUserInfo", user);
		return info;
	}

	public List<Map<String, String>> getTeacherSubjectList(
			Map<String, String> map) {
		SqlSession session = getSqlSession();
		List<Map<String, String>> subjectCodeList = session.selectList(
				"tch.getTeacherSubjectList", map);
		return subjectCodeList;
	}

	public List<Map<String, String>> getTeacherDutySchoolYear(
			Map<String, String> map) {
		SqlSession session = getSqlSession();
		List<Map<String, String>> getTeacherDutySchoolYear = session
				.selectList("tch.getTeacherDutySchoolYear", map);
		return getTeacherDutySchoolYear;
	}

	public User getStudentInfo(User user) throws Exception {

		SqlSession session = getSqlSession();
		User info = null;
		info = session.selectOne("tch.getStudentInfo", user);
		return info;
	}

	public List<Notice> getNoticeList(SearchCondition condition)
			throws Exception {

		SqlSession session = getSqlSession();
		List<Notice> list = null;
		list = session.selectList("tch.getNoticeList", condition);
		return list;
	}

	public List<NoticeFile> getNoticeFileList(Notice notice) throws Exception {

		SqlSession session = getSqlSession();
		List<NoticeFile> list = null;
		list = session.selectList("tch.getNoticeFileList", notice);
		return list;
	}

	public List<Alarm> getAlarmList(SearchCondition condition) throws Exception {

		SqlSession session = getSqlSession();
		List<Alarm> list = null;
		list = session.selectList("tch.getAlarmList", condition);
		return list;
	}

	public int insertNoticeRead(SearchCondition condition) throws Exception {

		SqlSession session = getSqlSession();
		int cnt = 0;
		cnt = session.insert("tch.insertNoticeRead", condition);
		return cnt;
	}

	public int insertAlarmRead(SearchCondition condition) throws Exception {

		SqlSession session = getSqlSession();
		int cnt = 0;
		cnt = session.insert("tch.insertAlarmRead", condition);
		return cnt;
	}

	public int insertParentQaRead(SearchCondition condition) throws Exception {

		SqlSession session = getSqlSession();
		int cnt = 0;
		cnt = session.insert("tch.insertParentQaRead", condition);
		return cnt;
	}

	public List<AlarmFile> getAlarmFileList(Alarm alarm) throws Exception {

		SqlSession session = getSqlSession();
		List<AlarmFile> list = null;
		list = session.selectList("tch.getAlarmFileList", alarm);
		return list;
	}

	public AccessToken getAccessToken() throws Exception {

		SqlSession session = getSqlSession();
		AccessToken accessToken = null;
		accessToken = session.selectOne("tch.getAccessToken");

		return accessToken;
	}

	public int insertAccessToken(AccessToken accessToken) throws Exception {

		SqlSession session = getSqlSession();
		int cnt = 0;
		cnt = session.insert("tch.insertAccessToken", accessToken);

		return cnt;
	}

	public int updateAccessToken(AccessToken accessToken) throws Exception {

		SqlSession session = getSqlSession();
		int cnt = 0;
		cnt = session.update("tch.updateAccessToken", accessToken);

		return cnt;
	}

	public WXUserInfo getWXUserInfo(WXUserInfo wxUserInfo) throws Exception {

		SqlSession session = getSqlSession();
		WXUserInfo retWXUserInfo = null;
		retWXUserInfo = session.selectOne("tch.getWXUserInfo", wxUserInfo);

		return retWXUserInfo;
	}

	public Notice getNoticeInfo(Notice not) throws Exception {
		SqlSession session = getSqlSession();
		Notice info = null;
		info = (Notice) session.selectOne("tch.getNoticeInfo", not);
		return info;
	}

	public Alarm getAlarmInfo(Alarm alarm) throws Exception {

		SqlSession session = getSqlSession();
		Alarm info = null;
		info = session.selectOne("tch.getAlarmInfo", alarm);
		return info;
	}

	public int setAuthorize(WXUserInfo wxUserInfo) {
		SqlSession session = getSqlSession();
		int cnt = 0;
		// 判断用户类型 T教师【1对1关系】 P家长【1对多关系】
		WXUserInfo selWXUserInfo = session.selectOne("tch.getWXUserInfo",
				wxUserInfo);
		if ("T".equals(wxUserInfo.getUser_type())) {
			// 如果是教师 系统中账号和微信为1对1关系
			// 禁用所有此系统账号绑定的信息 并且 非本微信号
			cnt = session.update("tch.updateAuthorizeT", wxUserInfo);
		}
		if (selWXUserInfo == null) {
			// 此微信号没有在系统中登记过
			cnt = session.insert("tch.insertAuthorize", wxUserInfo);
		} else {
			// 此微信号已经在系统中登记过
			cnt = session.update("tch.updateAuthorize", wxUserInfo);
		}

		return cnt;
	}

	public int getAlarmListBySubjectTeacherTotalCount(Map<String, Object> map) {
		SqlSession session = getSqlSession();
		int getAlarmListBySubjectTeacherTotalCount = session.selectOne(
				"tch.getAlarmListBySubjectTeacherTotalCount", map);
		return getAlarmListBySubjectTeacherTotalCount;
	}

	public List<Alarm> getAlarmListBySubjectTeacher(Map<String, Object> map) {
		SqlSession session = getSqlSession();
		List<Alarm> getAlarmListBySubjectTeacher = session.selectList(
				"tch.getAlarmListBySubjectTeacher", map);
		return getAlarmListBySubjectTeacher;
	}

	public User getUserFromWX(User wxuser) {
		SqlSession session = getSqlSession();
		User user = null;
		user = session.selectOne("tch.getUserFromWX", wxuser);
		return user;
	}

	public List<User> getAddressBookStudentsList(Map<String, Object> map) {
		SqlSession session = getSqlSession();
		List<User> getAddressBookStudentsList = session.selectList(
				"tch.getAddressBookStudentsList", map);
		return getAddressBookStudentsList;
	}

	public List<Notice> getTchNoticeList(Map<String, Object> map) {
		SqlSession session = getSqlSession();
		List<Notice> getTchNoticeList = session.selectList(
				"tch.getTchNoticeList", map);
		return getTchNoticeList;
	}

	public int addAlarm(Map<String, String> map) {
		SqlSession session = getSqlSession();
		map.put("aid", "");
		int result = session.insert("tch.addAlarm", map);
		System.out.println("result =>" + result);
		System.out.println("aid =====> " + map.get("aid"));
		String resultAid = String.valueOf(map.get("aid"));
		int aid = -1;
		if (resultAid != null && resultAid.length() > 0) {
			aid = Integer.parseInt(resultAid);
		}
		return aid;
	}

	public int addAlarmClass(Map<String, String> map) {
		SqlSession session = getSqlSession();
		int aid = session.insert("tch.addAlarmClass", map);
		return aid;
	}

	public int addAlarmFile(Map<String, String> map) {
		SqlSession session = getSqlSession();
		int aid = session.insert("tch.addAlarmFile", map);
		return aid;
	}

	public int addAlarmToStudents(Map<String, String> map) {
		SqlSession session = getSqlSession();
		int asid = session.insert("tch.addAlarmToStudents", map);
		return asid;
	}

	public WXMessage getWxmessage(WXMessage wxmessage) {
		SqlSession session = getSqlSession();
		WXMessage mesg = null;
		mesg = session.selectOne("tch.getWxmessage", wxmessage);
		return mesg;
	}

	public List<Map<String, String>> getTeacherClassListBySubjectId(
			Map<String, String> map) {
		SqlSession session = getSqlSession();
		List<Map<String, String>> getTeacherClassListBySubjectId = session
				.selectList("tch.getTeacherClassListBySubjectId", map);
		return getTeacherClassListBySubjectId;
	}

	public List<Map<String, String>> getAlarmDetailByClassTeacher_receivedStudents(
			Map<String, String> map) {
		SqlSession session = getSqlSession();
		List<Map<String, String>> getAlarmDetailByClassTeacher_receivedStudents = session
				.selectList(
						"tch.getAlarmDetailByClassTeacher_receivedStudents",
						map);
		return getAlarmDetailByClassTeacher_receivedStudents;
	}

	public Map<String, String> getAlarmDetailByClassTeacher(
			Map<String, String> map) {
		SqlSession session = getSqlSession();
		Map<String, String> getAlarmDetailByClassTeacher = session.selectOne(
				"tch.getAlarmDetailByClassTeacher", map);
		return getAlarmDetailByClassTeacher;
	}

	public List<Alarm> getAlarmListByClassTeacher(Map<String, Object> map) {
		SqlSession session = getSqlSession();
		List<Alarm> getAlarmListByClassTeacher = session.selectList(
				"tch.getAlarmListByClassTeacher", map);
		return getAlarmListByClassTeacher;
	}
	
	public List<Map<String,String>> getMyClassStudentParentsList(Map<String,String> map){
		SqlSession session = getSqlSession();
		List<Map<String,String>> getMyClassStudentParentsList = session.selectList("tch.getMyClassStudentParentsList",map);
		return getMyClassStudentParentsList;
	}
	
	public int addTeacherQna(Map<String, String> map){
		SqlSession session = getSqlSession();
		int addTeacherQnaResult = session.insert("tch.addTeacherQna",map);
		System.out.println("addTeacherQnaResult :"+ addTeacherQnaResult);
		int ret = 0;
		if(map.get("pqaid") == null){
			ret = 0;
		}else{
			ret = Integer.parseInt((String) map.get("pqaid"));
		}
		return ret;
	}
	
	public int addTeacherQnaComment(Map<String, String> map){
		SqlSession session = getSqlSession();
		int addTeacherQnaComment = session.insert("tch.addTeacherQnaComment",map);
		System.out.println("addTeacherQnaCommentResult :"+ addTeacherQnaComment);
		int ret = 0;
		if(map.get("comment_id") == null){
			ret = 0;
		}else{
			ret = Integer.parseInt((String) map.get("comment_id"));
		}
		return ret;
	}

	public List<ParentQa> getParentQaList(Map<String, Object> map) {
		SqlSession session = getSqlSession();
		List<ParentQa> list = null;
		list = session.selectList("tch.getParentQaList", map);
		return list;
	}

	public List<Map<String,String>> getQnaCommentList(Map<String,String> map){
		SqlSession session = getSqlSession();
		List<Map<String,String>> getQnaCommentList = session.selectList("tch.getQnaCommentList", map);
		return getQnaCommentList;
	}
	public Map<String,String> getQnaDetailInfo(Map<String,String> map){
		SqlSession session = getSqlSession();
		Map<String,String> getQnaDetailInfo = session.selectOne("tch.getQnaDetailInfo", map);
		return getQnaDetailInfo;
	}
	
	public int updateTeacherReadState(Map<String,String> map){
		SqlSession session = getSqlSession();
		int updateTeacherReadState = session.insert("tch.updateTeacherReadState", map);
		return updateTeacherReadState;
	}
	
	public int deleteParentQaComment(Map<String,String> map){
		SqlSession session = getSqlSession();
		int deleteParentQaComment = session.insert("tch.deleteParentQaComment", map);
		return deleteParentQaComment;
	}
	
	public int insertParentQaComment(Map<String,String> map){
		SqlSession session = getSqlSession();
		int insertParentQaComment = session.insert("tch.insertParentQaComment", map);
		return insertParentQaComment;
	}

	public User getUserPersInfo(User user) throws Exception {

		SqlSession session = getSqlSession();
		User info = null;
		info = session.selectOne("tch.getUserPersInfo", user);
		return info;
	}

     public int updatePw(User user) throws Exception{
		
		SqlSession session = getSqlSession();
		int cnt = 0;
		cnt = session.update("tch.updatePw", user);
		
		return cnt;
	}

	public int updateTeacher(User user) throws Exception {

		SqlSession session = getSqlSession();
		int cnt = 0;
		cnt = session.update("tch.updateTeacher", user);

		return cnt;
	}
	
	public List<Map<String, String>> getTeacherSubject(
			Map<String, String> map) {
		SqlSession session = getSqlSession();
		List<Map<String, String>> subjectCodeList = session.selectList(
				"tch.getTeacherSubject", map);
		return subjectCodeList;
	}
}