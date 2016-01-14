package com.digital.tch.china.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.digital.tch.china.button.Button;
import com.digital.tch.china.button.ComplexButton;
import com.digital.tch.china.button.Menu;
import com.digital.tch.china.button.ViewButton;
import com.digital.tch.china.vo.AccessToken;

/**
 * 菜单管理器类
 * 
 * @ClassName: MenuManager
 * @Description: 菜单管理器类 单独运行更新MENU
 * @author 曾鸣 zengming@edujoy.com.cn
 * @date 2015年12月7日 下午6:01:15
 *
 */
public class MenuManager {
	private static Logger log = LoggerFactory.getLogger(MenuManager.class);

	public static void main(String[] args) throws Exception {

		// 第三方用户唯一凭证
		String appid = "wx0784d04a9cf4f728";
		// 第三方用户唯一凭证密钥
		String appsecret = "7e61e52f3f609a7f5c38adecd779f499";

		// 调用接口获取access_token
		AccessToken at = WeixinUtil.getFWHAccessToken(appid, appsecret);

		if (null != at) {
			// 调用接口创建菜单
			int result = WeixinUtil.createMenu(getMenu(), at.getAccess_token());

			// 判断菜单创建结果
			if (0 == result) {
				log.info("菜单创建成功！");
				System.out.println("菜单创建成功！");
			} else {
				log.info("菜单创建失败，错误码：" + result);
				System.out.println("菜单创建失败，错误码：" + result);
			}
		}
	}

	/**
	 * 组装菜单数据
	 * 
	 * @Title: getMenu
	 * @Description: 组装菜单数据
	 * @return
	 * @author 曾鸣 zengming@edujoy.com.cn
	 */
	private static Menu getMenu() {
		
		//button one
		ViewButton btn11 = new ViewButton();
		btn11.setName("学校公告");
		btn11.setType("view");
		btn11.setUrl("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0784d04a9cf4f728&redirect_uri=http://huashenzhihui.imwork.net/weixin/notice.html&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect");

		ViewButton btn12 = new ViewButton();
		btn12.setName("添加提醒");
		btn12.setType("view");
		btn12.setUrl("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0784d04a9cf4f728&redirect_uri=http://huashenzhihui.imwork.net/weixin/alarm_add.html&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect");

		ViewButton btn13 = new ViewButton();
		btn13.setName("提醒列表");
		btn13.setType("view");
		btn13.setUrl("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0784d04a9cf4f728&redirect_uri=http://huashenzhihui.imwork.net/weixin/alarm.html&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect");

		ComplexButton mainBtn1 = new ComplexButton();
		mainBtn1.setName("学校通知");
		mainBtn1.setSub_button(new ViewButton[] { btn11, btn12, btn13 });
		
		
		//button two
		ViewButton btn21 = new ViewButton();
		btn21.setName("问答列表");
		btn21.setType("view");
		btn21.setUrl("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0784d04a9cf4f728&redirect_uri=http://huashenzhihui.imwork.net/weixin/qna_list.html&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect");
		
		ViewButton btn22 = new ViewButton();
		btn22.setName("新建问答");
		btn22.setType("view");
		btn22.setUrl("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0784d04a9cf4f728&redirect_uri=http://huashenzhihui.imwork.net/weixin/qna_write.html&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect");
		
		ComplexButton mainBtn2 = new ComplexButton();
		mainBtn2.setName("家长问答");
		mainBtn2.setSub_button(new ViewButton[] { btn21 ,btn22});
		
		
		//button thr
		ViewButton btn31 = new ViewButton();
		btn31.setName("账号绑定");
		btn31.setType("view");
		btn31.setUrl("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0784d04a9cf4f728&redirect_uri=http://huashenzhihui.imwork.net/weixin/authorize.html&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect");

		ViewButton btn32 = new ViewButton();
		btn32.setName("个人信息");
		btn32.setType("view");
		btn32.setUrl("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0784d04a9cf4f728&redirect_uri=http://huashenzhihui.imwork.net/weixin/user_info.html&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect");
		
		ViewButton btn33 = new ViewButton();
		btn33.setName("密码修改");
		btn33.setType("view");
		btn33.setUrl("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0784d04a9cf4f728&redirect_uri=http://huashenzhihui.imwork.net/weixin/updatepw.html&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect");
		
		ComplexButton mainBtn3 = new ComplexButton();
		mainBtn3.setName("个人中心");
		mainBtn3.setSub_button(new ViewButton[] { btn31 , btn32 , btn33 });

		
		Menu menu = new Menu();
		menu.setButton(new Button[] { mainBtn1, mainBtn2, mainBtn3 });

		return menu;
	}
}
