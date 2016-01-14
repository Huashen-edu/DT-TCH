package com.digital.tch.china.button;

/**
 * 复杂按钮（父按钮）
 * 
 * @ClassName: ComplexButton
 * @Description: 自定义菜单接口
 * @author 曾鸣 zengming@edujoy.com.cn
 * @date 2015年12月7日 下午5:57:04
 *
 */
public class ComplexButton extends Button {

	/**
	 * 子菜单项数组
	 */
	private Button[] sub_button;

	public Button[] getSub_button() {
		return sub_button;
	}

	public void setSub_button(Button[] sub_button) {
		this.sub_button = sub_button;
	}
}
