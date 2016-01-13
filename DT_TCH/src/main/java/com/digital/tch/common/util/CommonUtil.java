package com.digital.tch.common.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;
import java.util.Set;
import java.util.StringTokenizer;
import java.util.regex.Pattern;

import javax.servlet.http.HttpSession;

public class CommonUtil {
    public static final String rowsep = "\f";     // 행 분리자
    public static final String colsep = "!^"; // 열 분리자
    public static final String arrsep = "\b"; // 배열 분리자
    public static final String rssep = "!@";  // 레코드셋 분리자

    public static final String splitrowsep = "\\f";           // java의 split 메소드에서 사용할때 행 분리자
    public static final String splitcolsep = "\\!\\^";        // java의 split 메소드에서 사용할때 열 분리자
    public static final String splitarrsep = "\\b";           // java의 split 메소드에서 사용할때 배열 분리자
    public static final String splitrssep = "\\!\\@"; // java의 split 메소드에서 사용할때 레코드셋 분리자

    public static String isNullCheck(String str) {
        if ((str == null) || (str.trim().equals("")) || (str.trim().equalsIgnoreCase("null")) || (str.trim().length() == 0) || (str.equalsIgnoreCase("undefined")))
            return "";
        else
            return str.trim();
    }

    public static String isNull(String str) {
        if ((str == null) || (str.trim().equals("")) || (str.trim().equalsIgnoreCase("null")) || (str.trim().length() == 0) || (str.equalsIgnoreCase("undefined")))
            return "";
        else
            return str.trim();
    }

    public static String isNull(String str, String str2) {
        if ((str == null) || (str.trim().equals("")) || (str.trim().equalsIgnoreCase("null")) || (str.trim().length() == 0) || (str.equalsIgnoreCase("undefined")))
            return str2;
        else
            return str.trim();
    }

    public static String isNullNumber(String str) {
        if ((str == null) || (str.trim().equals("")) || (str.trim().equalsIgnoreCase("null")) || (str.trim().length() == 0) || (str.equalsIgnoreCase("undefined")))
            return "1";
        else
            return str.trim();
    }

    public static int isNumber(int num) {
        if (num < 0 || num == 0) {
            return 1;
        } else {
            return num;
        }
    }

    public static int isNumber(int num, int _num) {
        if (num < 0 || num == 0) {
            return _num;
        } else {
            return num;
        }
    }

    public static int isNewButtonCheck(String date) {
        try {
            String today = getTodayFormat();
            date = replace(date, "-", "");
            int check = Integer.parseInt(today) - Integer.parseInt(date);

            if (check >= 0 || check <= 7) {
                return 1;
            }
            return 0;
        } catch (Exception e) {
            return 0;
        }

    }

    public static String getKenString(String str, int len) throws UnsupportedEncodingException {

        String fStr = str;
        int sLen = str.length();

        if (sLen > len) {
            fStr = str.substring(0, len) + "...";
        }

        return fStr;
    }

    /*
     * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Function + getTodayFormat Parameter + Description + 오늘 날짜를 반환한다. (yyyyMMdd)
     * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
     */
    public static String getTodayFormat() {
        Date dt = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
        return sdf.format(dt);
    }

    /*
     * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Function + getTodayFormat Parameter + Description + 오늘 날짜를 반환한다. (yyyy-MM-dd)
     * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
     */
    public static String getTodayFormat2() {
        Date dt = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.format(dt);
    }

    /*
     * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Function + getTodayFormat Parameter + Description + 오늘 날짜를 반환한다. (yyyy-MM-dd-hh-mm-ss)
     * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
     */
    public static String getTodayFormat3() {
        Date dt = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd-hh-mm-ss");
        return sdf.format(dt);
    }

    /*
     * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Function + getTodayFormat Parameter + Description + 오늘 날짜를 반환한다. (yyyyMMddhhmmss)
     * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
     */
    public static String getTodayFormat4() {
        Date dt = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddhhmmss");
        return sdf.format(dt);
    }

    /*
     * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Function + getTodayFormat Parameter + Description + 오늘 날짜를 반환한다. (yyyy-MM-dd hh:mm:ss)
     * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
     */
    public static String getTodayFormat5() {
        Date dt = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        return sdf.format(dt);
    }

    /*
     * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Function + getTodayYear Parameter + Description + 오늘 년도를 반환한다. (yyyy) ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
     */
    public static String getTodayYear() {
        Date dt = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
        return sdf.format(dt);
    }

    /*
     * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Function + getTodayMonth Parameter + Description + 오늘 월를 반환한다. (MM) ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
     */
    public static String getTodayMonth() {
        Date dt = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("MM");
        return sdf.format(dt);
    }

    /*
     * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Function + getTodayDay Parameter + Description + 오늘 날짜를 반환한다. (dd) ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
     */
    public static String getTodayDay() {
        Date dt = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("dd");
        return sdf.format(dt);
    }

    /*
     * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Function + getTodayFormat Parameter + Description + 오늘 요일을 반환한다.(문자형식) (월요일)
     * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
     */
    public static String getTodayCalendar() {
        Calendar cal = Calendar.getInstance();
        String[] week = { "일", "월", "화", "수", "목", "금", "토" };

        return week[cal.get(Calendar.DAY_OF_WEEK) - 1] + "요일";
    }

    /*
     * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Function + getTodayFormat Parameter + Description + 오늘 요일을 반환한다.(숫자형식) (1)
     * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
     */
    public static int getTodayCalendar2() {
        Calendar cal = Calendar.getInstance();
        int[] week = { 1, 2, 3, 4, 5, 6, 7 };   // 참조 : 일요일은 1 토요일은 7

        return week[cal.get(Calendar.DAY_OF_WEEK) - 1];
    }

    /*
     * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Function + getTodayFormat Parameter + Description + 숫자형식 요일을 문자형식 요일로 변환하여 반환한다 (1:일요일~~~)
     * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
     */
    public static String getTodayCalendar(int i_week) {
        // String[] week = {"일","월","화","수","목","금","토"};
        String week = "";
        if (i_week == 1) {
            week = "일";
        } else if (i_week == 2) {
            week = "월";
        } else if (i_week == 3) {
            week = "화";
        } else if (i_week == 4) {
            week = "수";
        } else if (i_week == 5) {
            week = "목";
        } else if (i_week == 6) {
            week = "금";
        } else if (i_week == 7) {
            week = "토";
        }

        return week + "요일";
    }

    /*
     * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Function + getSelected Parameter + param1, param2 Description + 두 값을 비교해서 같으면 "Selected" 를 반환한다.
     * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
     */
    public static String getSelected(String param1, String param2) {
        if (param1.equals(param2))
            return "Selected";
        else
            return "";
    }

    /*
     * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Function + getChecked Parameter + param1, param2 Description + 두 값을 비교해서 같으면 "Checked" 를 반환한다.
     * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
     */
    public static String getChecked(String param1, String param2) {
        if (param1.equals(param2))
            return "Checked";
        else
            return "";
    }

    /*
     * 파일 업로드취약점
     */
    public int fileUploadCheck(String fileName) {
        int result = 0;
        String check = fileName.substring(fileName.lastIndexOf("."));

        if (check.equalsIgnoreCase(".php") || check.equalsIgnoreCase(".php3") || check.equalsIgnoreCase(".asp") || check.equalsIgnoreCase(".jsp") || check.equalsIgnoreCase(".cgi")
                || check.equalsIgnoreCase(".inc") || check.equalsIgnoreCase(".pl") || check.equalsIgnoreCase(".exe") || check.equalsIgnoreCase(".sh") || check.equalsIgnoreCase(".bat")) {
            result = 1;
        } else {
            result = 0;
        }

        return result;
    }

    /*
     * 이미지파일업로드 체크
     */
    public int fileUploadCheckJpg(String fileName) {
        int result = 0;
        String check = fileName.substring(fileName.lastIndexOf("."));

        if (check.equalsIgnoreCase(".jpg") || check.equalsIgnoreCase(".jpeg") || check.equalsIgnoreCase(".gif")) {
            result = 1;
        } else {
            result = 0;
        }

        return result;
    }

    /*
     * 동영상파일업로드 체크
     */
    public int fileUploadCheckMovie(String fileName) {
        int result = 0;
        String check = fileName.substring(fileName.lastIndexOf("."));

        if (check.equalsIgnoreCase(".wmv") || check.equalsIgnoreCase(".avi")) {
            result = 1;
        } else {
            result = 0;
        }

        return result;
    }

    /*
     * 파일 확장자 가져오기
     */
    public String fileUploadExt(String fileName) {
        String check = fileName.substring(fileName.lastIndexOf("."));
        check = CommonUtil.replace(check, ".", "");

        return check;
    }

    /*
     * 문자 치환 replace "123" ,"2", "" -> "13"
     */
    public static String replace(String _src, String _target, String _dest) {
        if (_src == null || _src.trim().length() == 0)
            return _src;
        if (_target == null)
            return _src;

        StringBuffer tmpBuffer = new StringBuffer();

        int nStart = 0;
        int nEnd = 0;
        int nLength = _src.length();
        int nTargetLength = _target.length();

        while (nEnd < nLength) {
            nStart = _src.indexOf(_target, nEnd);
            if (nStart < 0) {
                tmpBuffer.append(_src.substring(nEnd, nLength));

                break;
            } else {
                tmpBuffer.append(_src.substring(nEnd, nStart)).append(_dest);

                nEnd = nStart + nTargetLength;
            }
        }

        return tmpBuffer.toString();
    }

    /**
     * 데이터 형이 숫자인지 문자인지 체크하는 메소드
     * 
     * @param value
     *            숫자면 true 문자면 false
     * @return boolean
     */
    public static boolean checkInt(String value) {
        boolean returnVal = false;
        int a = 0;
        int b = 0;
        for (int i = 0; i < value.length(); i++) {
            char c = value.charAt(i);
            if (0x30 <= c && c <= 0x39) {
                a++;
            } else {
                b++;
            }
        }
        if (a > 0) {
            returnVal = true;
        } else if (b > 0) {
            returnVal = false;
        }
        return returnVal;
    }

    /**
     * 영문/ 숫자 존재 여부 체크 메서드 *
     * 
     * @param value
     * @return 0:영문/숫자 미존재 1:영문/숫자 존재 2:영문 존재 3:숫자 존재
     */
    public static int checkStrInt(String value) {
        int type = 0;   // 0:영문/숫자 미존재 1:영문/숫자 존재 2:영문 존재 3:숫자 존재
        int type1 = 0; // 영문
        int type2 = 0; // 숫자
        for (int i = 0; i < value.length(); i++) {
            char c = value.charAt(i);
            // 영문
            if ((0x61 <= c && c <= 0x7A) || (0x41 <= c && c <= 0x5A)) {
                type1 = 1;
                // 숫자
            } else if (0x30 <= c && c <= 0x39) {
                type2 = 1;
            }
        }

        if (type1 == 0 && type2 == 0) {   // 영문 숫자 미존재
            type = 0;
        } else if (type1 == 1 && type2 == 0) {             // 영문만 존재
            type = 2;
        } else if (type1 == 0 && type2 == 1) {             // 숫자만 존재
            type = 3;
        } else {  // 영문/숫자 존재
            type = 1;
        }

        return type;
    }

    /**
     * System.out.print를 줄이기 위한 메소드
     * 
     * @param value
     */
    public static void nPrint(String value) {
        System.out.println(value);
    }

    /*
     * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Function + getSplit Parameter + str, param Description + str 문자를 param 구분자로 Split 한 후 배열로 반환한다.
     * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
     */
    public static String[] getSplit(String str, String param) {
        StringTokenizer st = new StringTokenizer(str, param);
        String[] split = new String[st.countTokens()];
        int i = 0;

        while (st.hasMoreTokens()) {
            split[i] = st.nextToken();
            i++;
        }
        return split;
    }

    /**
     * session NULL 체크
     */
    public String getSession(HttpSession session, String attrName) {
        return session.getAttribute(attrName) != null ? (String) session.getAttribute(attrName) : "";
    }

    public static String getUniqueFileName(String path, String file) {
        File tmp = new File(path + file.toLowerCase());
        String fileName = file.toLowerCase();
        int i = 0;

        System.out.println("------------------>exist" + tmp.exists());
        if (tmp.exists()) {
            while (tmp.exists()) {
                if (fileName.indexOf(".") != -1) {
                    String lcTemp = "(" + i + ").";
                    fileName = file.toLowerCase().replaceAll(".", lcTemp);
                } else {
                    fileName = file.toLowerCase() + "(" + i + ")";
                    tmp = new File(path + fileName);
                    i++;
                }
            }
        }
        return fileName;
    }

    /**
     * 이메일 주소 유효성 체크
     * 
     * @param email
     * @return boolean
     */
    public static boolean isEmail(String email) {
        if (email == null)
            return false;
        boolean b = Pattern.matches("[\\w\\~\\-\\.]+@[\\w\\~\\-]+(\\.[\\w\\~\\-]+)+", email.trim());
        return b;
    }

    /**
     * 현재 유닉스 타임 가져오기
     * 
     * @return
     */
    public static long getTodayUnixtime() {
        return System.currentTimeMillis() / 1000;
    }

    /**
     * 현재 유닉스 타임 + 초
     * 
     * @param secend
     * @return
     */
    public static long getTodayUnixtime(int secend) {
        return System.currentTimeMillis() / 1000 + secend;
    }

    /**
     * 날짜 더하기 메서드
     * 
     * @param dateString
     *            YYYYMMDD
     * @param addDate
     *            더할 날짜 (3 -> 3일)
     * @return YYYYMMDD
     */
    public static String getTodayAddDate(String dateString, int addDate) {
        String result = "";

        // String dateString = "20120301";
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd");
        try {
            Date date = formatter.parse(dateString);
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            calendar.add(Calendar.DAY_OF_MONTH, +(addDate - 1));
            result = formatter.format(calendar.getTime());
        } catch (ParseException e) {
        }

        return result;
    }

    /**
     * 전체 자릿수와 숫자형 데이터를 입력받아 앞에 0을 붙인다 ex) appendLeftZero("1", 4) -> 0001
     * 
     * @param number
     *            숫자형 데이터
     * @param size
     *            전체 자릿수
     * @return
     */
    public static String appendLeftZero(String number, int size) {
        String result = number;
        int end = size - number.length();
        for (int i = 0; i < end; i++) {
            result = "0" + result;
        }

        return result;

    }

    /**
     * 프로퍼티 파일 경로와 프로퍼티 키를 입력받아 해당 프로퍼티 파일 안에 있는 키에 해당하는 값을 읽어온다
     * 
     * @param filepath
     *            프로퍼티 파일 경로
     * @param key
     *            입력받은 프로퍼티 파일 경로에 있는 프로퍼티 파일에 있는 프로퍼티 키
     * @return 프로퍼티 값
     */
    public static String getProperties(String filepath, String key) {
        String result = "";
        Properties props = null;
        FileInputStream fis = null;

        try {
            props = new Properties();
            fis = new FileInputStream(filepath);
            props.load(new java.io.BufferedInputStream(fis));
            result = props.getProperty(key).trim();
        } catch (Exception e) {

        } finally {
            try {
                fis.close();
            } catch (Exception e) {

            }
        }

        return result;
    }

    /**
     * 프로퍼티 파일 경로를 입력받아 해당 프로퍼티 파일의 key 값들을 가져온다
     * 
     * @param filepath
     *            프로퍼티 파일 경로
     * @return 프로퍼티 key값들
     */
    public static List<String> getPropertiesKeyset(String filepath) {
        List<String> result = new ArrayList<String>();
        Properties props = null;
        FileInputStream fis = null;

        try {
            props = new Properties();
            fis = new FileInputStream(filepath);
            props.load(new java.io.BufferedInputStream(fis));
            Set keyset = props.keySet();
            Iterator iter = keyset.iterator();
            while (iter.hasNext()) {
                String key = (String) (iter.next());
                result.add(key);
            }
        } catch (Exception e) {

        } finally {
            try {
                fis.close();
            } catch (Exception e) {

            }
        }

        return result;
    }
}
