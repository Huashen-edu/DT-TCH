package com.digital.tch.china.vo;

import java.util.List;

/**
 * 查询条件实体类
 * 
 * @author wcj
 *
 */
public class SearchCondition {
	private long school_id;
	private String user_id;
	private long key;
	private String condition;
	private String conditionText;
	private String activeYN;
	private List<String> idList;
	private int currentPage;
	private String startDate;
	private String endDate;
	private String acceptDate;
	private int recordCnt;
	private String level;

	public String getLevel() {
		return level;
	}

	public void setLevel(String level) {
		this.level = level;
	}

	public String getCondition() {
		return condition;
	}

	public void setCondition(String condition) {
		this.condition = condition;
	}

	public String getConditionText() {
		return conditionText;
	}

	public void setConditionText(String conditionText) {
		this.conditionText = conditionText;
	}

	public String getActiveYN() {
		return activeYN;
	}

	public void setActiveYN(String activeYN) {
		this.activeYN = activeYN;
	}

	public int getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}

	public List<String> getIdList() {
		return idList;
	}

	public void setIdList(List<String> idList) {
		this.idList = idList;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	public String getAcceptDate() {
		return acceptDate;
	}

	public void setAcceptDate(String acceptDate) {
		this.acceptDate = acceptDate;
	}

	public int getRecordCnt() {
		return recordCnt;
	}

	public void setRecordCnt(int recordCnt) {
		this.recordCnt = recordCnt;
	}

	public String getUser_id() {
		return user_id;
	}

	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}

	public long getSchool_id() {
		return school_id;
	}

	public void setSchool_id(long school_id) {
		this.school_id = school_id;
	}

	public long getKey() {
		return key;
	}

	public void setKey(long key) {
		this.key = key;
	}

}
