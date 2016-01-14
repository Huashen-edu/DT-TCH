package com.digital.tch.china.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.digital.weixin.mp.aes.corp.AesException;
import com.digital.weixin.mp.aes.corp.WXBizMsgCrypt;

/**
 * 核心请求处理类[企业号]
 * 
 * @ClassName: CoreServlet
 * @Description: 微信公众平台企业号回调模式的URL验证
 * @author 曾鸣 zengming@edujoy.com.cn
 * @date 2015年11月18日 下午2:45:45
 *
 */
public class CoreServlet extends HttpServlet {

	/**
	 * @Fields serialVersionUID : 1L
	 */
	private static final long serialVersionUID = 1L;
	// 这个Token是随机生成，但是必须跟企业号上的相同
	String sToken = "UuCIRQ1RSLqKW48Dk65FPYEq1bkNOMD";
	// 这里是你企业号的CorpID
	String sCorpID = "wx21850e9ae8be9f48";
	// 这个EncodingAESKey是随机生成，但是必须跟企业号上的相同
	String sEncodingAESKey = "bFBek1RsYXdlpHJ6x3vzq5Xqz44e6XzQTolYu8jas5M";

	/**
	 * 确认请求来自微信服务器
	 * 
	 * @throws IOException
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws IOException {

		// 微信加密签名
		String sVerifyMsgSig = request.getParameter("msg_signature");
		// 时间戳
		String sVerifyTimeStamp = request.getParameter("timestamp");
		// 随机数
		String sVerifyNonce = request.getParameter("nonce");
		// 随机字符串
		String sVerifyEchoStr = request.getParameter("echostr");
		String sEchoStr; // 需要返回的明文
		PrintWriter out = response.getWriter();
		WXBizMsgCrypt wxcpt;
		try {
			wxcpt = new WXBizMsgCrypt(sToken, sEncodingAESKey, sCorpID);
			sEchoStr = wxcpt.VerifyURL(sVerifyMsgSig, sVerifyTimeStamp,
					sVerifyNonce, sVerifyEchoStr);
			// 验证URL成功，将sEchoStr返回
			out.print(sEchoStr);
		} catch (AesException e1) {
			e1.printStackTrace();
		}
	}

	/**
	 * 处理微信服务器发来的消息
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO 消息的接收、处理、响应
	}
}
