var pai_map_map = [0x01, 0x02, 0x03, 0x04,0x05, 0x06, 0x07, 0x08, 0x09,
                   0x11, 0x12, 0x13, 0x14,0x15, 0x16, 0x17, 0x18, 0x19,
                   0x31, 0x32, 0x33 ]
                   //0x21, 0x22, 0x23, 0x24,0x25, 0x26, 0x27, 0x28, 0x29];

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    addClickEvent:function(node,target,component,handler){
        console.log(component + ":" + handler);
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    },
    
    addSlideEvent:function(node,target,component,handler){
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var slideEvents = node.getComponent(cc.Slider).slideEvents;
        slideEvents.push(eventHandler);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    

    pai_transfer:function (i){
        return pai_map_map[i];
    },

    pai_array_transfer:function (ar){
        var kk = [];
        for(var i in ar){
            //console.log(ar[i]);
            kk.push(pai_map_map[ar[i]]);
        }
        return kk;
    }
});
