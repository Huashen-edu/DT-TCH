package com.digital.tch.china.vo;

import java.util.List;
import java.util.Map;

/**
 * 用户基本信息实体类
 * 
 * @author wcj
 *
 */
public class User {
	private String user_id;
	private String user_pw;
	private String class_no;
	private long user_index;
	private long scid;
	private String user_type;
	private String user_name;
	private String user_email;
	private String phone;
	private String reg_date;
	private String sex;
	private String photo_path;
	private String birthday;
	private String address;
	private String national;
	private String originate;
	private String sns;
	private int student_no;
	private String student_leye;
	private String student_reye;
	private String school_year;
	private String student_name;
	private String is_delete;
	private String teacher_duty;
	private String teacher_position;
	private String teacher_charge;
	private int teacher_year;
	private String teacher_position_name;
	private String national_name;
	private String student_disease_name;
	private String originate_name;
	private String parent_job_name;
	private String birthday_start;
	private String birthday_end;
	private int student_weight;
	private String student_disease;
	private int student_height;
	private String parent_id;
	private User parent;
	private String teacher_duty_name;
	private String parent_job;
	private List<Map<String, String>> subject_name;
	private String sex_name;

	public String getSex_name() {
		return sex_name;
	}

	public void setSex_name(String sex_name) {
		this.sex_name = sex_name;
	}

	public List<Map<String, String>> getSubject_name() {
		return subject_name;
	}

	public void setSubject_name(List<Map<String, String>> subject_name) {
		this.subject_name = subject_name;
	}

	public String getUser_id() {
		return user_id;
	}

	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}

	public String getUser_pw() {
		return user_pw;
	}

	public void setUser_pw(String user_pw) {
		this.user_pw = user_pw;
	}

	public long getScid() {
		return scid;
	}

	public void setScid(long scid) {
		this.scid = scid;
	}

	public String getUser_type() {
		return user_type;
	}

	public void setUser_type(String user_type) {
		this.user_type = user_type;
	}

	public String getUser_name() {
		return user_name;
	}

	public void setUser_name(String user_name) {
		this.user_name = user_name;
	}

	public String getUser_email() {
		return user_email;
	}

	public void setUser_email(String user_email) {
		this.user_email = user_email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getReg_date() {
		return reg_date;
	}

	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}

	public String getSex() {
		return sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	public String getPhoto_path() {
		return photo_path;
	}

	public void setPhoto_path(String photo_path) {
		this.photo_path = photo_path;
	}

	public String getBirthday() {
		return birthday;
	}

	public void setBirthday(String birthday) {
		this.birthday = birthday;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getNational() {
		return national;
	}

	public void setNational(String national) {
		this.national = national;
	}

	public String getOriginate() {
		return originate;
	}

	public void setOriginate(String originate) {
		this.originate = originate;
	}

	public String getSns() {
		return sns;
	}

	public void setSns(String sns) {
		this.sns = sns;
	}

	public int getStudent_no() {
		return student_no;
	}

	public void setStudent_no(int student_no) {
		this.student_no = student_no;
	}

	public String getStudent_leye() {
		return student_leye;
	}

	public void setStudent_leye(String student_leye) {
		this.student_leye = student_leye;
	}

	public String getStudent_reye() {
		return student_reye;
	}

	public void setStudent_reye(String student_reye) {
		this.student_reye = student_reye;
	}

	public String getStudent_name() {
		return student_name;
	}

	public void setStudent_name(String student_name) {
		this.student_name = student_name;
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

	public long getUser_index() {
		return user_index;
	}

	public void setUser_index(long user_index) {
		this.user_index = user_index;
	}

	public String getTeacher_duty() {
		return teacher_duty;
	}

	public void setTeacher_duty(String teacher_duty) {
		this.teacher_duty = teacher_duty;
	}

	public String getTeacher_position() {
		return teacher_position;
	}

	public void setTeacher_position(String teacher_position) {
		this.teacher_position = teacher_position;
	}

	public int getTeacher_year() {
		return teacher_year;
	}

	public void setTeacher_year(int teacher_year) {
		this.teacher_year = teacher_year;
	}

	public String getTeacher_charge() {
		return teacher_charge;
	}

	public void setTeacher_charge(String teacher_charge) {
		this.teacher_charge = teacher_charge;
	}

	public String getBirthday_start() {
		return birthday_start;
	}

	public void setBirthday_start(String birthday_start) {
		this.birthday_start = birthday_start;
	}

	public String getBirthday_end() {
		return birthday_end;
	}

	public void setBirthday_end(String birthday_end) {
		this.birthday_end = birthday_end;
	}

	public int getStudent_weight() {
		return student_weight;
	}

	public void setStudent_weight(int student_weight) {
		this.student_weight = student_weight;
	}

	public String getStudent_disease() {
		return student_disease;
	}

	public void setStudent_disease(String student_disease) {
		this.student_disease = student_disease;
	}

	public int getStudent_height() {
		return student_height;
	}

	public void setStudent_height(int student_height) {
		this.student_height = student_height;
	}

	public String getParent_id() {
		return parent_id;
	}

	public void setParent_id(String parent_id) {
		this.parent_id = parent_id;
	}

	public String getParent_job() {
		return parent_job;
	}

	public void setParent_job(String parent_job) {
		this.parent_job = parent_job;
	}

	public User getParent() {
		return parent;
	}

	public void setParent(User parent) {
		this.parent = parent;
	}

	public String getTeacher_duty_name() {
		return teacher_duty_name;
	}

	public void setTeacher_duty_name(String teacher_duty_name) {
		this.teacher_duty_name = teacher_duty_name;
	}

	public String getTeacher_position_name() {
		return teacher_position_name;
	}

	public void setTeacher_position_name(String teacher_position_name) {
		this.teacher_position_name = teacher_position_name;
	}

	public String getNational_name() {
		return national_name;
	}

	public void setNational_name(String national_name) {
		this.national_name = national_name;
	}

	public String getOriginate_name() {
		return originate_name;
	}

	public void setOriginate_name(String originate_name) {
		this.originate_name = originate_name;
	}

	public String getParent_job_name() {
		return parent_job_name;
	}

	public void setParent_job_name(String parent_job_name) {
		this.parent_job_name = parent_job_name;
	}

	public String getStudent_disease_name() {
		return student_disease_name;
	}

	public void setStudent_disease_name(String student_disease_name) {
		this.student_disease_name = student_disease_name;
	}

	public String getIs_delete() {
		return is_delete;
	}

	public void setIs_delete(String is_delete) {
		this.is_delete = is_delete;
	}
}
