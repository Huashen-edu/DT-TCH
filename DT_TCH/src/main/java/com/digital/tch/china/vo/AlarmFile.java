package com.digital.tch.china.vo;

/**
 * 通知附件实体类
 * 
 * @author wcj
 *
 */
public class AlarmFile {
	private String filename;
	private String filepath;
	private long aid;
	private long afid;

	public String getFilename() {
		return filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}

	public String getFilepath() {
		return filepath;
	}

	public void setFilepath(String filepath) {
		this.filepath = filepath;
	}

	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

	public long getAfid() {
		return afid;
	}

	public void setAfid(long afid) {
		this.afid = afid;
	}

}
