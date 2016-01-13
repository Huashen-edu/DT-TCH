package com.digital.tch.common.listener;

import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.apache.commons.fileupload.ProgressListener;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class AjaxProgressListener implements ProgressListener {

	private final Log logger = LogFactory.getLog(this.getClass());
	
	public static final String STATUS_UPLOADING = "UPLOADING";
    public static final String STATUS_FAILED = "FAILED";
    public static final String STATUS_DONE = "DONE";
    public static final String STATUS_MAX_SIZE_EXCEEDS = "MAX_SIZE_EXCEEDS";
    
    @Autowired
	HttpSession session;
	
	public void setSession(HttpSession session){
        this.session = session;
    }
 
    public void updateStatus(String status){
    	
    	logger.debug("updateStatus");
        session.setAttribute("progressStatus", status);
    }
    
	@Override
	public void update(long bytesRead, long contentLength, int item) {
		// TODO Auto-generated method stub
    	
    	/*
    	Integer cnt = (Integer)session.getAttribute("cnt");
    	if(cnt == null){
    		cnt = new Integer(1);
    	}
		*/
    	
		double percent = ((double)bytesRead / (double)contentLength) * 100;
		
		JSONObject progressMap = new JSONObject();
        progressMap.put("bytesRead", bytesRead);
        progressMap.put("contentLength", contentLength);
        progressMap.put("item", item);
        progressMap.put("percent", percent);
        
        logger.debug(progressMap.toString());
        
        session.setAttribute("progressMap", progressMap);
 
	}	

}
