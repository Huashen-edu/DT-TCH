package com.digital.tch.china.message.resp;

/**
 * 文本消息
 * 
 * @ClassName: TextMessage
 * @Description: 响应消息之文本消息
 * @author 曾鸣 zengming@edujoy.com.cn
 * @date 2015年12月8日 上午9:28:12
 *
 */
public class TextMessage extends BaseMessage {
	// 回复的消息内容
	private String Content;

	public String getContent() {
		return Content;
	}

	public void setContent(String content) {
		Content = content;
	}
}
