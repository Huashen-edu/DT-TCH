package com.digital.tch.china.service;

import java.util.List;
import java.util.Map;

import com.digital.tch.china.vo.AccessToken;
import com.digital.tch.china.vo.Alarm;
import com.digital.tch.china.vo.AlarmFile;
import com.digital.tch.china.vo.Notice;
import com.digital.tch.china.vo.NoticeFile;
import com.digital.tch.china.vo.ParentQa;
import com.digital.tch.china.vo.SearchCondition;
import com.digital.tch.china.vo.User;
import com.digital.tch.china.vo.WXUserInfo;



public interface TchService {

	public User getUserInfo(User user) throws Exception;

	public List<Map<String, String>> getTeacherSubjectList(
			Map<String, String> map) throws Exception;

	public List<Map<String, String>> getTeacherDutySchoolYear(
			Map<String, String> map) throws Exception;

	public User getStudentInfo(User user) throws Exception;

	public List<Notice> getNoticeList(SearchCondition condition)
			throws Exception;

	public List<NoticeFile> getNoticeFileList(Notice notice) throws Exception;

	public List<Alarm> getAlarmList(SearchCondition condition) throws Exception;

	public int insertNoticeRead(SearchCondition condition) throws Exception;

	public int insertAlarmRead(SearchCondition condition) throws Exception;

	public int insertParentQaRead(SearchCondition condition) throws Exception;

	public List<AlarmFile> getAlarmFileList(Alarm alarm) throws Exception;

	public AccessToken getAccessToken() throws Exception;

	public WXUserInfo getWXUserInfo(WXUserInfo wxUserInfo) throws Exception;

	public int setAuthorize(WXUserInfo wxUserInfo) throws Exception;

	public Notice getNoticeInfo(Notice paramNotice) throws Exception;

	public Alarm getAlarmInfo(Alarm alarm) throws Exception;

	public int getAlarmListBySubjectTeacherTotalCount(Map<String, Object> map)
			throws Exception;

	public List<Alarm> getAlarmListBySubjectTeacher(Map<String, Object> map)
			throws Exception;

	public List<User> getAddressBookStudentsList(Map<String, Object> map)
			throws Exception;

	public List<Map<String, String>> getTeacherClassListBySubjectId(
			Map<String, String> map) throws Exception;

	public User getUserFromWX(User user) throws Exception;

	public int addAlarm(Map<String, String> map) throws Exception;

	public int addAlarmClass(Map<String, String> map) throws Exception;

	public int addAlarmFile(Map<String, String> map) throws Exception;

	public int addAlarmToStudents(Map<String, String> map) throws Exception;

	public List<Notice> getTchNoticeList(Map<String, Object> map)
			throws Exception;

	public List<Map<String, String>> getAlarmDetailByClassTeacher_receivedStudents(
			Map<String, String> map) throws Exception;

	public Map<String, String> getAlarmDetailByClassTeacher(
			Map<String, String> map) throws Exception;

	public List<Alarm> getAlarmListByClassTeacher(Map<String, Object> map)
			throws Exception;

	public List<ParentQa> getParentQaList(Map<String, Object> map)
			throws Exception;

	public List<Map<String, String>> getQnaCommentList(Map<String, String> map)
			throws Exception;

	public Map<String, String> getQnaDetailInfo(Map<String, String> map)
			throws Exception;

	public int updateTeacherReadState(Map<String, String> map) throws Exception;
	
	public int deleteParentQaComment(Map<String, String> map) throws Exception;
	
	public int insertParentQaComment(Map<String, String> map) throws Exception;
	
	public User getUserPersInfo(User user) throws Exception;
	
	public int updateTeacher(User user) throws Exception;
	public List<Map<String,String>> getMyClassStudentParentsList(Map<String, String> map) throws Exception;
	public int addTeacherQna(Map<String,String> map) throws Exception;
	public int addTeacherQnaComment(Map<String,String> map) throws Exception;
	public int updatePw(User user)throws Exception;
	
	public List<Map<String, String>> getTeacherSubject(
			Map<String, String> map) throws Exception;
}
