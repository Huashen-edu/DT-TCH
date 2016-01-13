package com.digital.tch.china.message.req;

/**
 * 链接消息
 * 
 * @ClassName: LinkMessage
 * @Description: 请求消息之链接消息
 * @author 曾鸣 zengming@edujoy.com.cn
 * @date 2015年12月8日 上午9:26:03
 *
 */
public class LinkMessage extends BaseMessage {
	// 消息标题
	private String Title;
	// 消息描述
	private String Description;
	// 消息链接
	private String Url;

	public String getTitle() {
		return Title;
	}

	public void setTitle(String title) {
		Title = title;
	}

	public String getDescription() {
		return Description;
	}

	public void setDescription(String description) {
		Description = description;
	}

	public String getUrl() {
		return Url;
	}

	public void setUrl(String url) {
		Url = url;
	}
}
