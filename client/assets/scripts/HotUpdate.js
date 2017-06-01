cc.Class({
    extends: cc.Component,

    properties: {
        updatePanel: {
            default: null,
            type: cc.Node
        },
        manifestUrl: {
            default: null,
            url: cc.RawAsset
        },
        percent: {
            default: null,
            type: cc.Label
        },
        lblErr: {
            default: null,
            type: cc.Label
        },
        progressBar0:
        {
            default: null,
            type: cc.ProgressBar
        },
        
    },

    checkCb: function (event) {
        //cc.director.loadScene("loading");
        console.log('Code: ' + event.getEventCode());
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log("No local manifest file found, hot update skipped.");
                cc.eventManager.removeListener(this._checkListener);
                cc.director.loadScene("loading");
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log("Fail to download manifest file, hot update skipped.");
                cc.eventManager.removeListener(this._checkListener);
                cc.director.loadScene("loading");
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log("Already up to date with the latest remote version.");
                cc.eventManager.removeListener(this._checkListener);
                this.lblErr.string += "游戏不需要更新\n";
                cc.director.loadScene("loading");
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this._needUpdate = true;
                this.updatePanel.active = true;
                this.percent.string = '00.00%';
                this.progressBar0.getComponent(cc.ProgressBar).progress=0;
                cc.eventManager.removeListener(this._checkListener);
                break;
            default:
                break;
        }
        this.hotUpdate();
    },

    updateCb: function (event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log('No local manifest file found, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                var percent = event.getPercent();
                var percentByFile = event.getPercentByFile();

                var msg = event.getMessage();
                if (msg) {
                    cc.log(msg);
                }
                console.log(percent.toFixed(2) + '%');
                this.percent.string = percent + '%';
                this.progressBar0.getComponent(cc.ProgressBar).progress=percent/100;
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log('Fail to download manifest file, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log('Already up to date with the latest remote version.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                console.log('Update finished. ' + event.getMessage());

                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                console.log('Update failed. ' + event.getMessage());

                this._failCount ++;
                if (this._failCount < 5)
                {
                    this._am.downloadFailedAssets();
                }
                else
                {
                    console.log('Reach maximum fail count, exit update process');
                    this._failCount = 0;
                    failed = true;
                }
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                console.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                console.log(event.getMessage());
                break;
            default:
                break;
        }

        if (failed) {
            cc.eventManager.removeListener(this._updateListener);
            this.updatePanel.active = false;
            cc.director.loadScene("loading");
        }
        

        if (needRestart) {
            cc.eventManager.removeListener(this._updateListener);
            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            Array.prototype.unshift(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));

            jsb.fileUtils.setSearchPaths(searchPaths);
            this.lblErr.string += "游戏资源更新完毕\n";
            cc.game.restart();
        }
    },

    hotUpdate: function () {
        if (this._am && this._needUpdate) {
            this.lblErr.string += "开始更新游戏资源...\n";
            this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
            cc.eventManager.addListener(this._updateListener, 1);

            this._failCount = 0;
            this._am.update();
        }
    },

    // use this for initialization
    onLoad: function () {
        // Hot update is only available in Native build
        if (!cc.sys.isNative) {
            return;
        }
        
        this.lblErr.string += "检查游戏资源...\n";
        var storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'qipai-asset');
        console.log('Storage path for remote asset : ' + storagePath);
        this.lblErr.string += storagePath + "\n";
        console.log('Local manifest URL : ' + this.manifestUrl);
        this._am = new jsb.AssetsManager(this.manifestUrl, storagePath);
        this._am.retain();

        this._needUpdate = false;
        if (this._am.getLocalManifest().isLoaded())
        {
            this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
            cc.eventManager.addListener(this._checkListener, 1);

            this._am.checkUpdate();
        }else{
            cc.director.loadScene("loading");
        }
    },

    onDestroy: function () {
        this._am && this._am.release();
    }
});
