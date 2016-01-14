package com.digital.tch.china.timetask;

import java.util.TimerTask;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.digital.tch.china.dao.TchDao;
import com.digital.tch.china.util.WeixinUtil;
import com.digital.tch.china.vo.AccessToken;
import com.digital.tch.common.property.CommonProperties;

public class TokenTimeTask extends TimerTask {

	private static Logger log = LoggerFactory.getLogger(TokenTimeTask.class);

	public static AccessToken accessToken = null;

	/**
	 * 计数器
	 */
	private static int times = 0;
	/**
	 * 最大次数
	 */
	private static int maxtimes = 3;

	@Autowired
	TchDao dao;

	@Override
	public void run() {
		try {
			if ("true".equals(CommonProperties.getProperty("isFWH"))) {
				// 获取web.xml中配置的参数
				String appid = CommonProperties.getProperty("appid");
				String appsecret = CommonProperties.getProperty("appsecret");

				// 未配置corpid、corpsecret时给出提示
				if ("".equals(appid) || "".equals(appsecret)) {
					log.error("appid and appsecret configuration error, please check carefully.");
					return;
				}

				log.info("weixin api appid:{}", appid);
				log.info("weixin api appsecret:{}", appsecret);

				times = 0;
				while (times < maxtimes) {
					accessToken = WeixinUtil
							.getFWHAccessToken(appid, appsecret);
					if (null != accessToken) {
						log.info("获取access_token成功，有效时长{}秒 token:{}",
								accessToken.getExpires_in(),
								accessToken.getAccess_token());

						// 判断数据库是否存在
						if (dao.getAccessToken() == null) {
							// 保存进数据库
							dao.insertAccessToken(accessToken);
						} else {
							// 更新进数据库
							dao.updateAccessToken(accessToken);
						}
						break;
					} else {
						// 如果access_token为null，60秒后再获取
						Thread.sleep(60 * 1000);
						times++;
					}
				}
			} else if ("false".equals(CommonProperties.getProperty("isFWH"))) {
				// 获取web.xml中配置的参数
				String corpid = CommonProperties.getProperty("corpid");
				String corpsecret = CommonProperties.getProperty("corpsecret");

				// 未配置corpid、corpsecret时给出提示
				if ("".equals(corpid) || "".equals(corpsecret)) {
					log.error("corpid and corpsecret configuration error, please check carefully.");
					return;
				}

				log.info("weixin api corpid:{}", corpid);
				log.info("weixin api corpsecret:{}", corpsecret);

				times = 0;
				while (times < maxtimes) {
					accessToken = WeixinUtil.getAccessToken(corpid, corpsecret);
					if (null != accessToken) {
						log.info("获取access_token成功，有效时长{}秒 token:{}",
								accessToken.getExpires_in(),
								accessToken.getAccess_token());

						// 判断数据库是否存在
						if (dao.getAccessToken() == null) {
							// 保存进数据库
							dao.insertAccessToken(accessToken);
						} else {
							// 更新进数据库
							dao.updateAccessToken(accessToken);
						}
						break;
					} else {
						// 如果access_token为null，60秒后再获取
						Thread.sleep(60 * 1000);
						times++;
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
