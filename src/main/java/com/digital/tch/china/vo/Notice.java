package com.digital.tch.china.vo;

import java.util.List;

/**
 * 公告实体类
 * 
 * @author wcj
 *
 */
public class Notice {
	private long nfid;
	private long nid;
	private long scid;
	private String title;
	private String user_id;
	private String target;
	private String reg_date;
	private String memo;
	private String speaker;
	private String user_name;
	private int alarm_cnt;
	private int qa_cnt;
	private int new_cnt;
	private int notice_cnt;
	private String file_added;
	private List<NoticeFile> fileList;

	public List<NoticeFile> getFileList() {
		return fileList;
	}

	public void setFileList(List<NoticeFile> fileList) {
		this.fileList = fileList;
	}

	public long getNfid() {
		return nfid;
	}

	public void setNfid(long nfid) {
		this.nfid = nfid;
	}

	public long getNid() {
		return nid;
	}

	public void setNid(long nid) {
		this.nid = nid;
	}

	public long getScid() {
		return scid;
	}

	public void setScid(long scid) {
		this.scid = scid;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getUser_id() {
		return user_id;
	}

	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}

	public String getTarget() {
		return target;
	}

	public void setTarget(String target) {
		this.target = target;
	}

	public String getReg_date() {
		return reg_date;
	}

	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getSpeaker() {
		return speaker;
	}

	public void setSpeaker(String speaker) {
		this.speaker = speaker;
	}

	public String getUser_name() {
		return user_name;
	}

	public void setUser_name(String user_name) {
		this.user_name = user_name;
	}

	public int getNew_cnt() {
		return new_cnt;
	}

	public void setNew_cnt(int new_cnt) {
		this.new_cnt = new_cnt;
	}

	public int getNotice_cnt() {
		return notice_cnt;
	}

	public void setNotice_cnt(int notice_cnt) {
		this.notice_cnt = notice_cnt;
	}

	public int getAlarm_cnt() {
		return alarm_cnt;
	}

	public void setAlarm_cnt(int alarm_cnt) {
		this.alarm_cnt = alarm_cnt;
	}

	public int getQa_cnt() {
		return qa_cnt;
	}

	public void setQa_cnt(int qa_cnt) {
		this.qa_cnt = qa_cnt;
	}

	public String getFile_added() {
		return file_added;
	}

	public void setFile_added(String file_added) {
		this.file_added = file_added;
	}

}
