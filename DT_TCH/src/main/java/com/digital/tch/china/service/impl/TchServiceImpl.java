package com.digital.tch.china.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.digital.tch.china.dao.TchDao;
import com.digital.tch.china.service.TchService;
import com.digital.tch.china.vo.AccessToken;
import com.digital.tch.china.vo.Alarm;
import com.digital.tch.china.vo.AlarmFile;
import com.digital.tch.china.vo.Notice;
import com.digital.tch.china.vo.NoticeFile;
import com.digital.tch.china.vo.ParentQa;
import com.digital.tch.china.vo.SearchCondition;
import com.digital.tch.china.vo.User;
import com.digital.tch.china.vo.WXUserInfo;

@Service
public class TchServiceImpl implements TchService {

	@Autowired
	TchDao dao;

	@Override
	@Transactional(readOnly = true)
	public User getUserInfo(User user) throws Exception {
		return dao.getUserInfo(user);
	}

	@Override
	@Transactional(readOnly = true)
	public User getStudentInfo(User user) throws Exception {
		return dao.getStudentInfo(user);
	}

	@Override
	public List<Notice> getNoticeList(SearchCondition condition)
			throws Exception {
		return dao.getNoticeList(condition);
	}

	@Override
	public List<NoticeFile> getNoticeFileList(Notice notice) throws Exception {
		return dao.getNoticeFileList(notice);
	}

	@Override
	public List<Alarm> getAlarmList(SearchCondition condition) throws Exception {
		return dao.getAlarmList(condition);
	}

	@Override
	public int insertNoticeRead(SearchCondition condition) throws Exception {
		return dao.insertNoticeRead(condition);
	}

	@Override
	public int insertAlarmRead(SearchCondition condition) throws Exception {
		return dao.insertAlarmRead(condition);
	}

	@Override
	public int insertParentQaRead(SearchCondition condition) throws Exception {
		return dao.insertParentQaRead(condition);
	}

	@Override
	public List<AlarmFile> getAlarmFileList(Alarm alarm) throws Exception {
		return dao.getAlarmFileList(alarm);
	}

	@Override
	public AccessToken getAccessToken() throws Exception {
		return dao.getAccessToken();
	}

	@Override
	public WXUserInfo getWXUserInfo(WXUserInfo wxUserInfo) throws Exception {
		return dao.getWXUserInfo(wxUserInfo);
	}

	@Override
	public Notice getNoticeInfo(Notice not) throws Exception {
		return this.dao.getNoticeInfo(not);
	}

	@Override
	public Alarm getAlarmInfo(Alarm alarm) throws Exception {
		return dao.getAlarmInfo(alarm);
	}

	@Override
	public int setAuthorize(WXUserInfo wxUserInfo) throws Exception {
		return this.dao.setAuthorize(wxUserInfo);
	}

	@Override
	public int getAlarmListBySubjectTeacherTotalCount(Map<String, Object> map)
			throws Exception {
		return dao.getAlarmListBySubjectTeacherTotalCount(map);
	}

	@Override
	public List<Alarm> getAlarmListBySubjectTeacher(Map<String, Object> map)
			throws Exception {
		return dao.getAlarmListBySubjectTeacher(map);
	}

	@Override
	public User getUserFromWX(User user) throws Exception {
		return this.dao.getUserFromWX(user);
	}

	@Override
	public List<Notice> getTchNoticeList(Map<String, Object> map)
			throws Exception {
		return dao.getTchNoticeList(map);
	}

	@Override
	public List<User> getAddressBookStudentsList(Map<String, Object> map)
			throws Exception {
		return dao.getAddressBookStudentsList(map);
	}

	@Override
	public int addAlarm(Map<String, String> map) throws Exception {
		return dao.addAlarm(map);
	}

	@Override
	public int addAlarmClass(Map<String, String> map) throws Exception {
		return dao.addAlarmClass(map);
	}

	@Override
	public int addAlarmFile(Map<String, String> map) throws Exception {
		return dao.addAlarmFile(map);
	}

	@Override
	public int addAlarmToStudents(Map<String, String> map) throws Exception {
		return dao.addAlarmToStudents(map);
	}

	@Override
	public List<Map<String, String>> getTeacherClassListBySubjectId(
			Map<String, String> map) throws Exception {
		// TODO Auto-generated method stub
		return dao.getTeacherClassListBySubjectId(map);
	}

	@Override
	public List<Map<String, String>> getAlarmDetailByClassTeacher_receivedStudents(
			Map<String, String> map) throws Exception {
		return dao.getAlarmDetailByClassTeacher_receivedStudents(map);
	}

	@Override
	public List<Map<String, String>> getTeacherDutySchoolYear(
			Map<String, String> map) throws Exception {
		return dao.getTeacherDutySchoolYear(map);
	}

	@Override
	public List<Map<String, String>> getTeacherSubjectList(
			Map<String, String> map) throws Exception {
		return dao.getTeacherSubjectList(map);
	}

	@Override
	public Map<String, String> getAlarmDetailByClassTeacher(Map<String, String> map) throws Exception {
		return dao.getAlarmDetailByClassTeacher(map);
	}
	
	@Override
	public List<Alarm> getAlarmListByClassTeacher(Map<String, Object> map) throws Exception {
		return dao.getAlarmListByClassTeacher(map);
	}

	
	@Override
	public List<Map<String, String>> getMyClassStudentParentsList(Map<String, String> map) throws Exception {
		return dao.getMyClassStudentParentsList(map);
	}
	@Override
	public int addTeacherQna(Map<String, String> map) throws Exception {
		return dao.addTeacherQna(map);
	}
	@Override
	public int addTeacherQnaComment(Map<String, String> map) throws Exception {
		return dao.addTeacherQnaComment(map);
	}

	
	@Override
	public User getUserPersInfo(User user) throws Exception {
		// TODO Auto-generated method stub
		return dao.getUserPersInfo(user);
	}
	
	@Override
	public int updateTeacher(User user) throws Exception {
		// TODO Auto-generated method stub
		return dao.updateTeacher(user);
	}
	
	@Override
	public List<ParentQa> getParentQaList(Map<String, Object> map) throws Exception{
		return dao.getParentQaList(map);
	}
	@Override
	public int updatePw(User user) throws Exception {
		// TODO Auto-generated method stub
		return dao.updatePw(user);
	}
	@Override
	public List<Map<String, String>> getQnaCommentList(Map<String, String> map) throws Exception {
		return dao.getQnaCommentList(map);
	}


	@Override
	public Map<String, String> getQnaDetailInfo(Map<String, String> map) throws Exception {
		return dao.getQnaDetailInfo(map);
	} 
	
	@Override
	public int updateTeacherReadState(Map<String, String> map) throws Exception {
		return dao.updateTeacherReadState(map);
	}
	
	@Override
	public int deleteParentQaComment(Map<String, String> map) throws Exception{
		return dao.deleteParentQaComment(map);
	}
	
	@Override
	public int insertParentQaComment(Map<String, String> map) throws Exception{
		return dao.insertParentQaComment(map);
	}
	
	@Override
	public List<Map<String, String>> getTeacherSubject(
			Map<String, String> map) throws Exception {
		return dao.getTeacherSubject(map);
	}
}
