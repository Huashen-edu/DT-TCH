package com.digital.tch.china.button;

/**
 * 普通按钮（子按钮）
 * 
 * @ClassName: CommonButton
 * @Description: 自定义菜单接口
 * @author 曾鸣 zengming@edujoy.com.cn
 * @date 2015年12月7日 下午5:52:06
 *
 */
public class CommonButton extends Button {
	/**
	 * 菜单的响应动作类型
	 */
	private String type;

	/**
	 * click等点击类型必须 菜单KEY值，用于消息接口推送，不超过128字节
	 */
	private String key;

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}
}
