package com.digital.tch.china.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.digital.tch.china.dao.TchDao;
import com.digital.tch.china.vo.WXMessage;

@Service
public class WXManager {

	private static Logger logger = LoggerFactory.getLogger(WXManager.class);

	@Autowired
	TchDao dao;

	public WXMessage getWxmessage(String code, String WxType) {
		WXMessage mesg = null;
		WXMessage wxmessage = new WXMessage();
		wxmessage.setCode(code);
		wxmessage.setWxType(WxType);
		try {
			mesg = dao.getWxmessage(wxmessage);
			if (mesg == null) {
				// 默认回复帮助信息
				wxmessage.setCode("帮助");
				wxmessage.setWxType(WxType);
				mesg = dao.getWxmessage(wxmessage);
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
		return mesg;

	}
}
