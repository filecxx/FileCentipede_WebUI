filecxx_wui.rpc =
{
    setting_window_: null,
    connecting_window_: null,

    connect:function(callback)
    {
        let that = this;

        filecxx_rpc.on_connect = function()
        {
            that.connecting_window_.close();
            callback(filecxx_rpc.config);
        }
        filecxx_rpc.on_close = function()
        {
            filecxx_wui.tasks.clear();

            setTimeout(function()
            {
                if(that.connecting_window_.visible()){
                    that.connect(callback)
                }else{
                    that.show_connecting(callback)
                }
            },1000);
        }
        filecxx_rpc.on_message = function(message)
        {
            //console.log(message)
            let msg_type = message["@"];
            delete message["@"];

            if(msg_type in filecxx_wui.messages){
                filecxx_wui.messages[msg_type](message);
            }
        }
        filecxx_rpc.on_error = function(text)
        {
            that.connecting_window_.close();

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
    show_connecting:function(callback)
    {
        let that = this;

        that.connecting_window_ = Std.ui("Window",{
            width:200,
            height:140,
            title:lang("connecting"),
            titleIcon:"icons/16/connect.svg",
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
        let that    = this;
        let widgets = Std.ui.create({
            host:{
                ui:"LineEdit",
                value:filecxx_rpc.config.host || "localhost"
            },
            port:{
                ui:"SpinBox",
                min:0,
                max:65535,
                type:"int",
                value:filecxx_rpc.config.port
            },
            username:{
                ui:"LineEdit",
                value:filecxx_rpc.config.username,
                placeHolder:lang("optional")
            },
            password:{
                ui:"LineEdit",
                echoMode:"password",
                value:filecxx_rpc.config.password,
                placeHolder:lang("optional")
            }
        });

        let conn_btn = {
            ui:"Button",
            styleType:"textBesideIcon",
            text:lang("connect"),
            icon:"icons/16/connect.svg",
            click:function()
            {
                if(widgets.host.value().length > 0){
                    Std.extend(filecxx_rpc.config,Std.ui.values(widgets));
                    that.setting_window_.close();
                    that.show_connecting(callback);
                }
            }
        };

        that.setting_window_ = Std.ui("Window",{
            width:340,
            height:220,
            title:lang("config"),
            titleIcon:"icons/16/connect.svg",
            modal:true,
            closable:false,
            layout:{
                ui:"VBoxLayout",
                items:[
                    {
                        ui:"GridLayout",
                        columnCount:2,
                        columnSpacing:8,
                        rowSpacing:6,
                        items:[
                            {ui:"Label",text:lang("host") + ": "}, widgets.host,
                            {ui:"Label",text:lang("port") + ": "}, widgets.port,
                            {ui:"Label",text:lang("username") + ": "}, widgets.username,
                            {ui:"Label",text:lang("password") + ": "}, widgets.password
                        ]
                    },
                    {
                        ui:"HBoxLayout",
                        items:[
                            {ui:"stretch",level:3},
                            conn_btn
                        ]
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