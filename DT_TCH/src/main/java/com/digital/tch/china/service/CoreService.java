package com.digital.tch.china.service;

import java.util.Date;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Service;

import com.digital.tch.china.message.resp.TextMessage;
import com.digital.tch.china.util.MessageUtil;
import com.digital.tch.china.util.WXManager;
import com.digital.tch.china.vo.WXMessage;
import com.digital.tch.common.property.CommonProperties;
import com.digital.weixin.mp.aes.app.WXBizMsgCrypt;

/**
 * 核心服务类
 * 
 * @ClassName: CoreService
 * @Description: 处理微信消息
 * @author 曾鸣 zengming@edujoy.com.cn
 * @date 2015年12月8日 上午9:13:52
 *
 */
@Service
public class CoreService {

	/**
	 * 处理微信发来的请求
	 * 
	 * @Title: processRequest
	 * @Description: 消息处理
	 * @param request
	 * @return
	 * @author 曾鸣 zengming@edujoy.com.cn
	 */
	public static String processRequest(HttpServletRequest request,
			WXManager wxManager) {
		String respMessage = null;
		// 消息加解密密钥
		String encodingAesKey = CommonProperties.getProperty("encodingAESKey");
		// 开发者设置的Token
		String token = CommonProperties.getProperty("token");
		// 公众号的appid
		String appId = CommonProperties.getProperty("appid");
		try {
			// 默认返回的文本消息内容
			String respContent = "请求处理异常，请稍候尝试！";

			// 微信加密签名
			String msgSignature = request.getParameter("msg_signature");
			// 时间戳
			String timestamp = request.getParameter("timestamp");
			// 随机数
			String nonce = request.getParameter("nonce");
			// 加密类型
			String encrypt_type = request.getParameter("encrypt_type");
			// 消息内容 密文
			String encrypt_msg = IOUtils.toString(request.getInputStream());

			// xml请求解析
			Map<String, String> requestMap = null;

			// aes加密（暂时只有raw和aes两种值)
			if (encrypt_type == null || encrypt_type.equals("raw")) {
				// 不用加密 xml请求解析
				requestMap = MessageUtil.parseXml(request);
			} else if ("aes".equals(encrypt_type)) {
				// 第三方收到公众号平台发送的消息
				WXBizMsgCrypt pc = new WXBizMsgCrypt(token, encodingAesKey,
						appId);
				String result2 = pc.decryptMsg(msgSignature, timestamp, nonce,
						encrypt_msg);
				System.out.println("解密后明文: " + result2);
				// xml请求解析
				requestMap = MessageUtil.parseXmlFromString(result2);
			}

			// 发送方帐号（open_id）
			String fromUserName = requestMap.get("FromUserName");
			// 公众帐号
			String toUserName = requestMap.get("ToUserName");
			// 消息类型
			String msgType = requestMap.get("MsgType");

			// 回复文本消息
			TextMessage textMessage = new TextMessage();
			textMessage.setToUserName(fromUserName);
			textMessage.setFromUserName(toUserName);
			textMessage.setCreateTime(new Date().getTime());
			textMessage.setMsgType(MessageUtil.RESP_MESSAGE_TYPE_TEXT);
			textMessage.setFuncFlag(0);

			// 文本消息
			if (msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_TEXT)) {
				// respContent = "您发送的是文本消息！";
				WXMessage mesg = wxManager.getWxmessage(
						requestMap.get("Content"), "T");
				respContent = mesg.getMessage();
			}
			// 图片消息
			else if (msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_IMAGE)) {
				respContent = "您发送的是图片消息！";
			}
			// 地理位置消息
			else if (msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_LOCATION)) {
				respContent = "您发送的是地理位置消息！";
			}
			// 链接消息
			else if (msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_LINK)) {
				respContent = "您发送的是链接消息！";
			}
			// 音频消息
			else if (msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_VOICE)) {
				respContent = "您发送的是音频消息！";
			}
			// 事件推送
			else if (msgType.equals(MessageUtil.REQ_MESSAGE_TYPE_EVENT)) {
				// 事件类型
				String eventType = requestMap.get("Event");
				// 订阅
				if (eventType.equals(MessageUtil.EVENT_TYPE_SUBSCRIBE)) {
					respContent = "谢谢您的关注！";
				}
				// 取消订阅
				else if (eventType.equals(MessageUtil.EVENT_TYPE_UNSUBSCRIBE)) {
					// TODO 取消订阅后用户再收不到公众号发送的消息，因此不需要回复消息
				}
				// 自定义菜单点击事件
				else if (eventType.equals(MessageUtil.EVENT_TYPE_CLICK)) {
					// 事件KEY值，与创建自定义菜单时指定的KEY值对应
					String eventKey = requestMap.get("EventKey");
					// TODO:暂时没有click类型按钮
					if (eventKey.equals("XX")) {
						respContent = "XXX按钮被点击！";
					}
				}
			}

			textMessage.setContent(respContent);

			// aes加密（暂时只有raw和aes两种值)
			if (encrypt_type == null || encrypt_type.equals("raw")) {
				// 不用加密
				respMessage = MessageUtil.textMessageToXml(textMessage);
			} else if ("aes".equals(encrypt_type)) {
				// 第三方收到公众号平台发送的消息
				WXBizMsgCrypt pc = new WXBizMsgCrypt(token, encodingAesKey,
						appId);
				respMessage = pc.encryptMsg(
						MessageUtil.textMessageToXml(textMessage), timestamp,
						nonce);
				System.out.println("加密后返回: " + respMessage);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return respMessage;
	}
}
