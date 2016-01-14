package com.digital.tch.china.message.req;

/**
 * 音频消息
 * 
 * @ClassName: VoiceMessage
 * @Description: 请求消息之语音消息
 * @author 曾鸣 zengming@edujoy.com.cn
 * @date 2015年12月8日 上午9:26:31
 *
 */
public class VoiceMessage extends BaseMessage {
	// 媒体ID
	private String MediaId;
	// 语音格式
	private String Format;

	public String getMediaId() {
		return MediaId;
	}

	public void setMediaId(String mediaId) {
		MediaId = mediaId;
	}

	public String getFormat() {
		return Format;
	}

	public void setFormat(String format) {
		Format = format;
	}
}
