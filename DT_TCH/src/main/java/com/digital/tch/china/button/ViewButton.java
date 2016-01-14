package com.digital.tch.china.button;

/**
 * view类型的菜单
 * 
 * @ClassName: ViewButton
 * @Description: 自定义菜单接口
 * @author 曾鸣 zengming@edujoy.com.cn
 * @date 2015年12月8日 上午10:14:54
 *
 */
public class ViewButton extends Button {
	/**
	 * 菜单的响应动作类型
	 */
	private String type;

	/**
	 * view类型必须 网页链接，用户点击菜单可打开链接，不超过256字节
	 */
	private String url;

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}
}
