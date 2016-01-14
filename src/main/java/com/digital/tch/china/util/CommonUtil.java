package com.digital.tch.china.util;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import net.lingala.zip4j.core.ZipFile;
import net.lingala.zip4j.exception.ZipException;



public class CommonUtil {
	public static String getSaveLocation(String userId){
		
		StringBuilder sb = new StringBuilder();
		sb.append(userId).append("/")
		.append(getTodayYear()).append("/")
		.append(getTodayMonth()).append("/")
		.append(getTodayDay()).append("/");
		
		
		
		return sb.toString();
	}
	public static String getFileType(String ext){
		String fileType="TXT";
		switch(ext){
		case "DOC" : case "EXLS" : case  "PPT" :
			fileType = "TXT";
			break;
		case "JPG" : case "GIF" : case  "PNG" :
			fileType = "IMG";
			break;
		case "MP3" : case "OGG" : 
			fileType = "AUD";
			break;
		case "MP4" : case "WEBM" : case "AVI" :
			fileType = "VED";
			break;
		case "ZIP" : case "EPUB" :
			fileType = "EPUB";
			break;
		default:
			break;
		}
		return fileType;
	}
	public static String getTodayYear() {
        Date dt = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
        return sdf.format(dt);
    }

    public static String getTodayMonth() {
        Date dt = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("MM");
        return sdf.format(dt);
    }

    public static String getTodayDay() {
        Date dt = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("dd");
        return sdf.format(dt);
    }
	public static String getRequestHost(HttpServletRequest request){
		return new StringBuilder("http://").append(request.getServerName()).append(":").append(request.getServerPort()).toString();		
	}
	
	public static boolean isWindows(){
	   String OS = System.getProperty("os.name");
	   return  OS.startsWith("Windows");
	}
	
	
	
}