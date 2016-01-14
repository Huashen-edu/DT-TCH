package com.digital.tch.china.vo;

import java.util.List;
import java.util.Map;

/**
 * 提醒实体类
 * 
 * @author wcj
 *
 */
public class Alarm {
	private String user_id;
	private String title;
	private String memo;
	private String reg_date;
	private int aid;
	private String subject;
	private String subject_name;
	private String user_name;
	private String acid;
	private String target_school_year;
	private String target_class_no;
	private String subject_id;
	private String school_year;
	private String class_no;
	private String targetClass;
	private String isFile;
	private int new_cnt;// 是否读过
	private List<AlarmFile> fileList;
	private List<Map<String,String>> student_list;//被提醒人列表
	private String teacherClass;

	public String getUser_id() {
		return user_id;
	}

	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getReg_date() {
		return reg_date;
	}

	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}

	public int getAid() {
		return aid;
	}

	public void setAid(int aid) {
		this.aid = aid;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getSubject_name() {
		return subject_name;
	}

	public void setSubject_name(String subject_name) {
		this.subject_name = subject_name;
	}

	public String getUser_name() {
		return user_name;
	}

	public void setUser_name(String user_name) {
		this.user_name = user_name;
	}

	public List<AlarmFile> getFileList() {
		return fileList;
	}

	public void setFileList(List<AlarmFile> fileList) {
		this.fileList = fileList;
	}

	public String getAcid() {
		return acid;
	}

	public void setAcid(String acid) {
		this.acid = acid;
	}

	public String getTarget_school_year() {
		return target_school_year;
	}

	public void setTarget_school_year(String target_school_year) {
		this.target_school_year = target_school_year;
	}

	public String getTarget_class_no() {
		return target_class_no;
	}

	public void setTarget_class_no(String target_class_no) {
		this.target_class_no = target_class_no;
	}

	public String getSubject_id() {
		return subject_id;
	}

	public void setSubject_id(String subject_id) {
		this.subject_id = subject_id;
	}

	public String getSchool_year() {
		return school_year;
	}

	public void setSchool_year(String school_year) {
		this.school_year = school_year;
	}

	public String getClass_no() {
		return class_no;
	}

	public void setClass_no(String class_no) {
		this.class_no = class_no;
	}

	public String getTargetClass() {
		return targetClass;
	}

	public void setTargetClass(String targetClass) {
		this.targetClass = targetClass;
	}

	public String getIsFile() {
		return isFile;
	}

	public void setIsFile(String isFile) {
		this.isFile = isFile;
	}

	public int getNew_cnt() {
		return new_cnt;
	}

	public void setNew_cnt(int new_cnt) {
		this.new_cnt = new_cnt;
	}

	public List<Map<String, String>> getStudent_list() {
		return student_list;
	}

	public void setStudent_list(List<Map<String, String>> student_list) {
		this.student_list = student_list;
	}

	public String getTeacherClass() {
		return teacherClass;
	}

	public void setTeacherClass(String teacherClass) {
		this.teacherClass = teacherClass;
	}

}
