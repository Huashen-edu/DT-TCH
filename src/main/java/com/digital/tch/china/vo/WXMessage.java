package com.digital.tch.china.vo;

/**
 * 微信服务号提示信息
 * 
 * @author wcj
 *
 */
public class WXMessage {
	private String WxId;
	private String WxType;//类型
	private String up_date;
	private String code;
	private String message;//回复信息
	
	
	public String getWxId() {
		return WxId;
	}
	public void setWxId(String wxId) {
		WxId = wxId;
	}
	public String getWxType() {
		return WxType;
	}
	public void setWxType(String wxType) {
		WxType = wxType;
	}
	public String getUp_date() {
		return up_date;
	}
	public void setUp_date(String up_date) {
		this.up_date = up_date;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	
	

}
