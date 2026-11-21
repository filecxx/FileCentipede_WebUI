filecxx_wui.rpc =
{
    setting_window_: null,
    connecting_window_: null,

    connect:function(callback)
    {
        let that = this;

        filecxx_rpc.on_connect = function()
        {
            that.dispose_connecting();

            callback(filecxx_rpc.config);
        }
        filecxx_rpc.on_close = function()
        {
            filecxx_wui.tasks.clear();

            setTimeout(function()
            {
                if(that.connecting_window_ && that.connecting_window_.visible()){
                    that.connect(callback)
                }else if(!filecxx_rpc.config.host){
                    that.show_connector(callback);
                }else{
                    that.show_connecting(callback)
                }
            },500);
        }
        filecxx_rpc.on_message = function(message)
        {
            let msg_type = message["@"];
            delete message["@"];

            if(msg_type in filecxx_wui.messages){
                filecxx_wui.messages[msg_type](message);
            }
        }
        filecxx_rpc.on_error = function(text)
        {
            that.dispose_connecting();

            Std.ui("MessageBox").error({
                text:lang(text),
                closable:false,
                on:{
                    ok:function(){
                        that.show_connector(callback);
                    }
                }
            });
        }
        filecxx_rpc.connect();
    },
    dispose_connecting:function()
    {
        let that = this;

        that.connecting_window_ && that.connecting_window_.close();
        that.connecting_window_ = null;
    },
    show_connecting:function(callback)
    {
        let that = this;

        that.connecting_window_ = Std.ui("Window",{
            width:200,
            height:140,
            title:lang("connecting"),
            titleIcon:"icons/16/connect.svg",
            titleMenu:false,
            modal:true,
            closable:false,
            layout:{
                ui:"HBoxLayout",
                items:[
                    {ui:"Image",width:64,height:72,src:"images/loading/clock.gif"},
                    {ui:"Label",textAlign:"middle",text:lang("connecting") + "...."}
                ]
            }
        });
        that.connect(callback);
    },
    show_connector:function(callback)
    {
        let that   = this;
        let url    = new URL(window.location.href);
        let wizard = Std.ui.wizard(filecxx_rpc.config,{
            layout:"GridLayout"
        });

        wizard.options("*",{
            host: {value:filecxx_rpc.config.host || "localhost",label:"IP/" + lang("domain")},
            username:{placeHolder:lang("optional")},
            password:{placeHolder:lang("optional"),echoMode:"password"},
        });

        let sourcecode_btn = {
            ui:"ToolButton",
            styleType:"textBesideIcon",
            text:lang("source_code"),
            icon:"icons/mimetypes/24/application-javascript.png",
            target:"_blank",
            href:"https://github.com/filecxx/FileCentipede_WebUI"
        };
        let conn_btn = {
            ui:"Button",
            styleType:"textBesideIcon",
            text:lang("connect"),
            icon:"icons/16/connect.svg",
            click:function()
            {
                let values = wizard.values();

                if(values.host.length > 0){
                    Std.extend(filecxx_rpc.config,values);
                    that.setting_window_.close();
                    that.show_connecting(callback);
                }
            }
        };
        let switch_protocol = Std.ui("SwitchBox",{
            level:3,
            height:26,
            theme:"blue",
            valueType:"value",
            items:[
                {
                    text:"HTTP",
                    value:false,
                },
                {
                    text:"HTTPS",
                    value:true
                }
            ],
            value: url.protocol.startsWith("https:"),
            on:{
                change:function(val){
                    window.location.href = (val ? "https:" : "http:") + "//" + url.host + url.pathname + url.search + url.hash
                }
            }
        });

        that.setting_window_ = Std.ui("Window",{
            width:300,
            height:285,
            title:lang("config"),
            titleIcon:"icons/16/connect.svg",
            titleMenu:false,
            modal:true,
            closable:false,
            layout:{
                ui:"VBoxLayout",
                spacing:12,
                items:[
                    switch_protocol,
                    wizard.layout({columnCount:2,columnSpacing:8,rowSpacing:6}),
                    {
                        ui:"HBoxLayout",
                        items:[sourcecode_btn,{ui:"stretch"}, conn_btn]
                    }
                ]
            }
        })
    },

    init:function(callback)
    {
        if(!filecxx_rpc.config.host){
            this.show_connector(callback);
        }else{
            this.show_connecting(callback);
        }
    }
}