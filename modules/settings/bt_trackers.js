Std.ui.module("filecxx_bt_trackers",
{
    parent:"Window",
    option:{
        width:700,
        height:450,
        modal:true,
        maximizable:true,
        acceptEsc:true,
        title:"BT " + lang("tracker"),
        titleIcon:"icons/16/tracker.svg",
    },
    initialize:{
        init_subscribed_trackers:function()
        {
            let that    = this;
            let widgets = that.widgets_;

            widgets.subscribed_trackers = Std.ui("TextEdit",{
                readOnly:true
            });
        },
        init_subscribes:function()
        {
            let that    = this;
            let widgets = that.widgets_;
            let table   = Std.ui("DataTable",{
                tableName: "subscribe",
                valueType: "list",
                icons:filecxx_wui.iconset.data_table,
                clearAlert:lang("action") + ": " + lang("clear"),
                duplicateAlert:"duplicated row",
                verifyValues:true,
                windowHeight: 300,
                defaultActions:["add","edit","remove"],
                columns:{url: 200,uptime: 200,time_add:200},
                fields:{
                    url:"",
                },
                value: filecxx_wui.data.proxy_subscribes
            });

            table.on(
            {
                invalidValues:function(name,locale){
                    error_notify(lang("invalid") + ": " + locale);
                },
                wizard:function(type,wizard)
                {
                    wizard.options("*",{
                        url:{
                            ui:"TextEdit",
                            placeHolder: lang("add_subscribe_placeholder_")
                        },
                    });
                },
                added:function(value){
                    alert("todo")
                },
                edited:function(value){
                    alert("todo")
                },
                removed:function(rows)
                {
                    alert("todo")
                }
            })
            widgets.subscribe = table;
        },
        init_settings:function()
        {
            let that    = this;
            let widgets = that.widgets_;
            let wizard   = Std.ui.wizard(filecxx_wui.data.configs.trackers,{

            });
            let buttons = Std.ui("HBoxLayout",
            {
                items:[
                    {ui:"stretch",level:3},
                    {
                        ui:"Button",
                        text:lang("cancel"),
                        click:function(){
                            that.close();
                        }
                    },
                    {
                        ui:"Button",
                        text:lang("save"),
                        click:function(){
                            that.save_settings(wizard.values());
                            that.close();
                        }
                    }
                ]
            });

            wizard.fields([
                "auto_update_subscribe","use_proxy_update","auto_update_interval",
                "new_task_trackers","import_subscribed","import_subscribed_num"
            ]);
            wizard.options("*",
            {
                auto_update_interval:{
                    level:2,
                    //maxWidth: "auto",
                    label:lang("hours")
                },
                new_task_trackers:{ui:"TextEdit"}
            });

            widgets.settings = Std.ui("VBoxLayout",{
                items:[
                    wizard.layout({}),
                    buttons
                ]
            });
        },

        init_layout:function()
        {
            var that = this;
            var tabs = Std.ui("TabPanel",{
                items:[{
                    button:{
                        name: "list",
                        text: lang("list")
                    },
                    content: Std.ui("VBoxLayout",{
                        items:[that.widgets_.subscribed_trackers]
                    })
                },{
                    button:{
                        name: "subscribe",
                        text: lang("subscribe")
                    },
                    content: Std.ui("VBoxLayout",{
                        items:[that.widgets_.subscribe]
                    })
                },{
                    button:{
                        name: "settings",
                        text: lang("settings")
                    },
                    content: Std.ui("VBoxLayout",{
                        items:[that.widgets_.settings]
                    })
                }]
            });
            that.widgets_.tabs = tabs;
            that.layout(Std.ui("VBoxLayout",{
                items:[tabs]
            }));
        }
    },
    public:
    {
        save_settings:function(config)
        {
            filecxx_rpc.send("config_update",{
                name:"trackers",
                config: Std.extend(filecxx_wui.data.configs.trackers,config)
            })
        }
    },

    main:function(that,opts)
    {
        //console.log(filecxx_wui.data.configs.trackers);
        //console.log(filecxx_wui.data.proxy_subscribes);

        that.widgets_ = {};

        that.init_subscribed_trackers();
        that.init_subscribes();
        that.init_settings();
        that.init_layout();
    }
});