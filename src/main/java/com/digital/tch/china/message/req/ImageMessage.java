package com.digital.tch.china.message.req;

/**
 * 图片消息
 * 
 * @ClassName: ImageMessage
 * @Description: 请求消息之图片消息
 * @author 曾鸣 zengming@edujoy.com.cn
 * @date 2015年12月8日 上午9:24:53
 *
 */
public class ImageMessage extends BaseMessage {
	// 图片链接
	private String PicUrl;

	public String getPicUrl() {
		return PicUrl;
	}

	public void setPicUrl(String picUrl) {
		PicUrl = picUrl;
	}
}
