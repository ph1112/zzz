package com.shililu.zzk5xnew;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.pm.PackageManager;
import android.content.SharedPreferences;

import java.util.ArrayList;
import java.util.List;

import com.shililu.zzk5xnew.wxapi.WXEntryActivity;

import org.cocos2dx.javascript.AppActivity;

public class WXAPI {
    public static Activity instance;
    public static boolean isLogin = false;

    public static void Login() {
        LoginWX();
    }

    public static void Share(String url, String title, String desc) {
        ShareUrlWX(url, title, desc, 0);
    }

    public static void ShareIMG(String path, int width, int height) {
        ShareImageWX(path, 0);
    }

    public static void LoginWX() {
        Intent intent = new Intent(AppActivity.getContext(), WXEntryActivity.class);
        intent.putExtra(WXEntryActivity.ReqWxLogin, "wxlogin");
        AppActivity.getContext().startActivity(intent);
    }

    public static void ShareImageWX(String ImgPath, int nType) {
        Intent intent = new Intent(AppActivity.getContext(), WXEntryActivity.class);
        intent.putExtra(WXEntryActivity.ReqWxShareImg, "ReqWxShareImg");
        intent.putExtra("ImgPath", ImgPath);
        intent.putExtra("ShareType", nType);
        AppActivity.getContext().startActivity(intent);
    }

    public static void ShareTextWX(String text, int nType) {
        Intent intent = new Intent(AppActivity.getContext(), WXEntryActivity.class);
        intent.putExtra(WXEntryActivity.ReqWxShareTxt, "ReqWxShareTxt");
        intent.putExtra("ShareText", text);
        intent.putExtra("ShareType", nType);
        AppActivity.getContext().startActivity(intent);
    }

    public static void ShareUrlWX(String url, String title, String desc, int nType) {
        Intent intent = new Intent(AppActivity.getContext(), WXEntryActivity.class);
        intent.putExtra(WXEntryActivity.ReqWxShareUrl, "ReqWxShareUrl");
        intent.putExtra("ShareUrl", url);
        intent.putExtra("ShareTitle", title);
        intent.putExtra("ShareDesc", desc);
        intent.putExtra("ShareType", nType);
        AppActivity.getContext().startActivity(intent);
    }

    public static void showWebView(String kUrl) {
        Log.d("showWebView", kUrl);
        Uri uri = Uri.parse(kUrl);
        Intent it = new Intent(Intent.ACTION_VIEW, uri);
//		 Intent it = new Intent(Cocos2dxActivity.getContext(), GameWebActivity.class);
        AppActivity.getContext().startActivity(it);
    }

    public static String GetClipData() {
        final ClipboardManager cm = (ClipboardManager) AppActivity.getContext().getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData data = cm.getPrimaryClip();
        ClipData.Item item = data.getItemAt(0);
        return item.getText().toString();
    }

    /**
     * 获取经纬度
     *
     * @return
     */
    public static String getLatLng() {
        SharedPreferences pref = AppActivity.getContext().getSharedPreferences("data",
                AppActivity.getContext().MODE_PRIVATE);
        String latlng = pref.getString("latlng", "");
        return latlng;
    }
}
