package com.shililu.zzk5xnew.wxapi;


import java.io.File;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.util.Log;

import com.shililu.zzk5xnew.Util;
import com.tencent.mm.sdk.constants.ConstantsAPI;
import com.tencent.mm.sdk.modelbase.BaseReq;
import com.tencent.mm.sdk.modelbase.BaseResp;
import com.tencent.mm.sdk.modelmsg.SendAuth;
import com.tencent.mm.sdk.modelmsg.SendMessageToWX;
import com.tencent.mm.sdk.modelmsg.WXAppExtendObject;
import com.tencent.mm.sdk.modelmsg.WXImageObject;
import com.tencent.mm.sdk.modelmsg.WXMediaMessage;
import com.tencent.mm.sdk.modelmsg.WXTextObject;
import com.tencent.mm.sdk.modelmsg.WXWebpageObject;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.sdk.openapi.WXAPIFactory;

import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

public class WXEntryActivity extends Activity implements IWXAPIEventHandler{

    public static String Tag = "WXEntryActivity";
    private static final int TIMELINE_SUPPORTED_VERSION = 0x21020001;
    private static WXEntryActivity sContext = null;
    public static boolean bLogonWX = false;
    private static final int THUMB_SIZE = 150;

    public static final String APP_ID = "wx2f251ff8c92edfa9";

    private IWXAPI 			  api;

    private static final int SceneSession = 0;//闁告帒妫旈棅鈺呭礆妫颁胶绐楅悹鍥锋嫹
    private static final int SceneTimeline = 1; //闁告帒妫旈棅鈺呭礆閻楀牊绠欓柛娆忣儏濠�锟�

    public static String ReqWxLogin = "ReqWxLogin";
    public static String ReqWxShareImg = "ReqWxShareImg";
    public static String ReqWxShareTxt = "ReqWxShareTxt";
    public static String ReqWxShareUrl = "ReqWxShareUrl";
    public static String ReqWXPay = "ReqWXPay";



    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        sContext = this;
        Log.d(Tag,"onCreate");

        Intent intent = getIntent();

        api = WXAPIFactory.createWXAPI(this,APP_ID, true);
        api.registerApp(APP_ID);
        api.handleIntent(intent, this);

        if (intent.hasExtra(ReqWxLogin))
        {
            reqLogin();
        }
        else if(intent.hasExtra(ReqWxShareImg))
        {
            String ImgPath = intent.getStringExtra("ImgPath");
            int nType = intent.getIntExtra("ShareType",0);
            reqShareImg(ImgPath,nType);
        }
        else if(intent.hasExtra(ReqWxShareTxt))
        {
            String ShareText = intent.getStringExtra("ShareText");
            int nType = intent.getIntExtra("ShareType",0);
            reqShareTxt(ShareText,nType);
        }
        else if(intent.hasExtra(ReqWxShareUrl))
        {
            String ShareUrl = intent.getStringExtra("ShareUrl");
            String ShareTitle = intent.getStringExtra("ShareTitle");
            String ShareDesc = intent.getStringExtra("ShareDesc");
            int nType = intent.getIntExtra("ShareType",0);
            reqShareUrl(ShareUrl,ShareTitle,ShareDesc,nType);
        }
        finish();
    }

    @Override
    protected void onNewIntent(Intent intent)
    {
        super.onNewIntent(intent);

        setIntent(intent);
        api.handleIntent(intent, this);
    }

    public void reqLogin()
    {
        SendAuth.Req req = new SendAuth.Req();
        req.scope = "snsapi_userinfo";
        req.state = "carjob_wx_login";
        boolean v = api.sendReq(req);
        String sv = v?"true":"false";
        Log.d(Tag,"reqLogin:" + sv);
    }
    public void reqShareImg(String ImgPath,int nType)
    {
        File file = new File(ImgPath);
        if (!file.exists())
        {
            Log.d(Tag,"reqShare file not exists:"+ImgPath);
            return;
        }

        Bitmap bmp = BitmapFactory.decodeFile(ImgPath);
        WXImageObject imgObj = new WXImageObject(bmp);

        WXMediaMessage msg = new WXMediaMessage();
        msg.mediaObject = imgObj;

        Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, 128, 72, true);
        bmp.recycle();
        msg.thumbData = Util.bmpToByteArray(thumbBmp, true);

        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = buildTransaction("img");
        req.message = msg;
        if(nType==SceneTimeline )
        {
            req.scene = SendMessageToWX.Req.WXSceneTimeline;
        }
        else if(nType==SceneSession )
        {
            req.scene = SendMessageToWX.Req.WXSceneSession;
        }
        api.sendReq(req);
        Log.d(Tag,"reqShare Ok:"+ImgPath);
    }
    public void reqShareTxt(String text,int nType)
    {
        // 鍒濆鍖栦竴涓猈XTextObject瀵硅薄
        WXTextObject textObj = new WXTextObject();
        textObj.text = text;

        // 鐢╓XTextObject瀵硅薄鍒濆鍖栦竴涓猈XMediaMessage瀵硅薄
        WXMediaMessage msg = new WXMediaMessage();
        msg.mediaObject = textObj;
        // 鍙戦�佹枃鏈被鍨嬬殑娑堟伅鏃讹紝title瀛楁涓嶈捣浣滅敤
        // msg.title = "Will be ignored";
        msg.description = text;

        // 鏋勯�犱竴涓猂eq
        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = buildTransaction("text"); // transaction瀛楁鐢ㄤ簬鍞竴鏍囪瘑涓�涓姹�
        req.message = msg;
        if(nType==SceneTimeline )
        {
            req.scene = SendMessageToWX.Req.WXSceneTimeline;
        }
        else if(nType==SceneSession )
        {
            req.scene = SendMessageToWX.Req.WXSceneSession;
        }
        // 璋冪敤api鎺ュ彛鍙戦�佹暟鎹埌寰俊
        api.sendReq(req);


        Log.d(Tag,"reqShareTxt Ok:"+text);
    }

    public void reqShareUrl(String url, String title,String desc,int nType)
    {
        // 鍒濆鍖栦竴涓猈XTextObject瀵硅薄
        WXWebpageObject textObj = new WXWebpageObject();
        textObj.webpageUrl = url;

        // 鐢╓XTextObject瀵硅薄鍒濆鍖栦竴涓猈XMediaMessage瀵硅薄
        WXMediaMessage msg = new WXMediaMessage();
        msg.mediaObject = textObj;
        // 鍙戦�佹枃鏈被鍨嬬殑娑堟伅鏃讹紝title瀛楁涓嶈捣浣滅敤
        msg.title = title;
        msg.description = desc;

        // 鏋勯�犱竴涓猂eq
        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = buildTransaction("webpage"); // transaction瀛楁鐢ㄤ簬鍞竴鏍囪瘑涓�涓姹�
        req.message = msg;
        if(nType==SceneTimeline )
        {
            req.scene = SendMessageToWX.Req.WXSceneTimeline;
        }
        else if(nType==SceneSession )
        {
            req.scene = SendMessageToWX.Req.WXSceneSession;
        }
        // 璋冪敤api鎺ュ彛鍙戦�佹暟鎹埌寰俊
        api.sendReq(req);


        Log.d(Tag,"reqShareUrl Ok:"+url);
    }

    public void reqShareTxtCB(String text,int nType)
    {
        // send appdata with no attachment
        WXAppExtendObject appdata = new WXAppExtendObject("lallalallallal", "filePath");

        boolean bValue =  appdata.checkArgs();
        if (!bValue)
        {
            Log.d(Tag,"reqShareTxtCB Error:"+text);
        }

        WXMediaMessage msg = new WXMediaMessage();
        msg.title ="11";
        msg.description = "22";
        msg.mediaObject = appdata;

        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = buildTransaction("appdata");
        req.message = msg;

        if(nType==SceneTimeline )
        {
            req.scene = SendMessageToWX.Req.WXSceneTimeline;
        }
        else if(nType==SceneSession )
        {
            req.scene = SendMessageToWX.Req.WXSceneSession;
        }
        // 璋冪敤api鎺ュ彛鍙戦�佹暟鎹埌寰俊
        api.sendReq(req);

        Log.d(Tag,"reqShareTxtCB Ok:"+text);
    }

    // 鐎甸偊鍣ｉ弫鎾绘嚇濮橆剙娈╅柟椋庡厴閺佹捇寮妶鍡楊伓闂佽法鍠愰弸濠氬箯閻戣姤鏅搁悷妤冨枎閸╁瞼鍠婃径瀣伓闂佽法鍠愰弸濠氬箯閻戣姤鏅搁柡鍌樺�栫�氳鎯旈弮鍫熸櫢闁哄倶鍊栫�氬綊寮崼鏇熸櫢闁哄倶鍊栫�氬綊鏌ㄩ悢鍛婄伄闁圭兘鏀遍惃顓㈡煥閻斿憡鐏柟椋庡厴閺佹捇寮妶鍡楊伓婵﹤鎳橀弫鎾诲棘閵堝棗顏堕梺璺ㄥ櫐閹凤拷
    @Override
    public void onReq(BaseReq req)
    {
        switch (req.getType())
        {
            case ConstantsAPI.COMMAND_GETMESSAGE_FROM_WX:
                Log.d(Tag,"onReq:COMMAND_GETMESSAGE_FROM_WX");
                break;
            case ConstantsAPI.COMMAND_SHOWMESSAGE_FROM_WX:
                Log.d(Tag,"onReq:COMMAND_SHOWMESSAGE_FROM_WX");
                break;
            default:
                break;
        }

        Log.d(Tag,"onReq:"+req.getType());
    }

    // 闂佽法鍠愰弸濠氬箯閻戣姤鏅搁柡鍌樺�栫�氬綊鏌ㄩ悢鍛婄伄闁瑰嘲鍢茬花鏌ユ煥閻旇櫣鍙撻柛鎴欏�栫�氬綊鏌ㄩ悢鐓庡緧缁炬澘顦扮�氱懓顕ラ锟介弫鎾绘嚇濮橀硸鏆滈柟椋庡厴閺佹捇寮妶鍡楊伓闂佽法鍠愰弸濠氬箯閻戣姤鏅搁柡鍌樺�栫�氬綊鏌ㄩ悢鍛婄伄闁归鍏橀弫鎾诲棘閵堝棗顏堕幖瀛樻閺佹捇寮妶鍡楊伓闂佽法鍠愰弸濠氬箯閻戣姤鏅搁柡鍌樺�栫�氬綊鏌ㄩ悢绋跨劵缁炬澘顦扮�氬綊鏌ㄩ悢鍛婄伄闁归鍏橀弫鎾绘儗椤愩垹娈╅柟椋庡厴閺佹捇寮妶鍡楊伓
    @Override
    public void onResp(BaseResp resp) {
        int result = 0;

        Log.d(Tag,"errCode:"+resp.errCode);

        switch (resp.errCode) {
            case BaseResp.ErrCode.ERR_OK:
                String code = ((SendAuth.Resp) resp).code;
                Cocos2dxJavascriptJavaBridge.evalString("cc.vv.anysdkMgr.onLoginResp('"+ code +"')");
//                String Url =APP_ID+":"+AppSecret+":"+code+":authorization_code";
//                Log.d(Tag,Url);
//                Native.WxLoginGetAccessToken(Url);
                break;
            case BaseResp.ErrCode.ERR_USER_CANCEL:
//                Native.WxLoginGetAccessToken("ERR_USER_CANCEL");
                break;
            case BaseResp.ErrCode.ERR_AUTH_DENIED:
//                Native.WxLoginGetAccessToken("ERR_AUTH_DENIED");
                break;
            default:
//                Native.WxLoginGetAccessToken("REE_Unknow");
                break;
        }
    }

    private String buildTransaction(final String type) {
        return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
    }
}