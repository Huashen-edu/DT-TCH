package com.digital.tch.common.util;

import java.util.ArrayList;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class JSONObject {
	private final Log log = LogFactory.getLog(JSONObject.class);
	
	private net.sf.json.JSONObject jsonObject = null;
	
	public JSONObject(String jsonString) {
		jsonObject = net.sf.json.JSONObject.fromObject(jsonString);
	}

	public String getString(String key, String defaultValue) {
		String value = defaultValue;
		try {
			value = jsonObject.has(key) ? jsonObject.getString(key) : defaultValue;
			if (value != null) {
				value = (value.equals("null") || value.length() == 0) ? defaultValue : value;
			}else{
				log.debug("Can't find key \""+ key + "\"");
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return value;
	}
	public List<String> getStringList(String key){
		JSONArray jsonArray = getJSONArray(key);
		if(jsonArray != null && jsonArray.size() > 0){
			List<String> list = new ArrayList<String>();
			for (int i=0; i<jsonArray.size(); i++) {
				list.add( jsonArray.getString(i) );
			}
			return list;
		}
		return null;
	}
	
	public JSONArray getJSONArray(String key){
        JSONArray jsonArray = null;
        try {
            jsonArray = jsonObject.has(key)? jsonObject.getJSONArray(key) : null;
            //jsonArray.toArray();
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jsonArray;
    }
}
