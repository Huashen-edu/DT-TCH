package com.digital.tch.common.resolver;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.FileUpload;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import com.digital.tch.common.listener.AjaxProgressListener;

public class AjaxMultipartResolver extends CommonsMultipartResolver {
	@Autowired
	private AjaxProgressListener progressListener;
	
	private HttpServletRequest httpServletRequest;

	private final Log logger = LogFactory.getLog(this.getClass());

	
	@Override
	public void cleanupMultipart(MultipartHttpServletRequest request) {
		// TODO Auto-generated method stub
		super.cleanupMultipart(request);
	}


	@Override
	protected FileUpload newFileUpload(FileItemFactory fileItemFactory) {
		// TODO Auto-generated method stub
		FileUpload fileUpload = super.newFileUpload(fileItemFactory);
		fileUpload.setProgressListener(progressListener);
		return fileUpload;
	}


	@Override
	public MultipartHttpServletRequest resolveMultipart(HttpServletRequest request) throws MultipartException {
		// TODO Auto-generated method stub
		
		
		if(progressListener == null){
			logger.debug("progressListener is null");
		}else{
			logger.debug("progressListener is not null");
		}
		
		
		try {
			
			if(request == null){
				logger.debug("request is null");
			}else{
				logger.debug("request is not null");
			}
			
			
            this.httpServletRequest = request;
 
            return super.resolveMultipart(httpServletRequest);
        } catch(MaxUploadSizeExceededException ex) {
        	this.progressListener.updateStatus(AjaxProgressListener.STATUS_MAX_SIZE_EXCEEDS);
            throw new MultipartException(ex.getMessage());
        } catch (Exception ex) {
            
            this.progressListener.updateStatus(AjaxProgressListener.STATUS_FAILED);
            throw new MultipartException(ex.getMessage());
        }
		
		
	}
}
