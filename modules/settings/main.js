Std.ui.module("filecxx_settings",
{
    parent:"Window",
    option:{
        width:850,
        height:640,
        modal:true,
        acceptEsc:true,
        maximizable:true,
        title:lang("settings"),
        titleIcon:"icons/16/setting.svg",
    },
    private:{
        timer_save: -1
    },
    extend:
    {
        render:function()
        {
            var that = this;

            that.init_switch_panel();
            that.init_list();
            that.init_ui();
        },
        destroy:function()
        {
            var that = this;

        }
    },
    protected:
    {
        create_wizard_opts:function(wizard)
        {
            wizard.options("*",{
                method: "http_method",
                pass: "password",
                seeding_limit_speed_limit:"speed_limit",

                proxy:"task_proxy",
                client_fingerprint_type:{
                    ui:"ComboBox",
                    valueType:"index",
                    items:[lang("default"),lang("customize")]
                },

                encrypt_mode:{
                    ui:"ComboBox",
                    valueType:"index",
                    items:[lang("force_encrypt"),lang("allow_encrypt"),lang("disable_encrypt")]
                },
                upload_algorithm:{
                    ui:"ComboBox",
                    valueType:"index",
                    items:[lang("round_robin"),lang("fastest_upload"),lang("anti_leech")]
                },
                seeding_limit_ratio:{
                    type:"number"
                },
                seeding_limit_size:{
                    label:"MB"
                },
                enable:{ui:"ToggleBox"},
                remote_access:{ui:"ToggleBox"},
                webserver:{ui:"ToggleBox"},
                webserver_dir_listing:{ui:"ToggleBox"},
                webdav:{ui:"ToggleBox"},

                operation_seeding:{
                    ui:"ComboBox",
                    valueType:"index",
                    items:[lang("none"),lang("disconnect"),lang("ban_ip")]
                },
                operation_always:{
                    ui:"ComboBox",
                    valueType:"index",
                    items:[lang("none"),lang("disconnect"),lang("ban_ip")]
                },
                attr_last_modified:{
                    ui:"ComboBox",
                    valueType:"index",
                    items:[lang("local"), lang("remote")]
                },
                last_modified_time:{
                    ui:"ComboBox",
                    valueType:"index",
                    items:[lang("local"), lang("remote")]
                },

                client_names:{
                    ui:"TextEdit"
                },
                client_names2:{
                    ui:"TextEdit"
                }
            });
        }
    },
    initialize:
    {
        init_switch_panel:function()
        {
            var that   = this;
            var items  = [];
            var i      = 0;
            var schema = Std.ui.schema("settings",{
                //sort:true,
                widgets:{
                    boolean:"CheckBox"
                }
            });

            Std.each(that.type_fields_,function(type,fields)
            {
                let wizard = Std.ui.wizard(filecxx_wui.data.configs[type],schema);
                that.create_wizard_opts(wizard);
                that.wizards_[type] = wizard;

                wizard.fields(fields);

                let layout = wizard.layout("tabs",{
                    maxStretchableColumns:2,
                });
                let tabs = Std.ui("widget",{
                    level:4,
                    layout: layout
                })
                items.push(tabs);
                that.client_layouts_.push(layout);
                //console.log(filecxx_wui.data.configs[type])
                ++i;
            });

            that.widgets_.client = Std.ui("SwitchPanel",{
                level:4,
                width:800,
                height:600,
                items:items,
            }).on("render",function()
            {
                this.parent().plugin("resize",{
                    helper:"original",
                    opacity:1,
                    left:false,
                    top:false
                })
            });
            //console.log(filecxx_wui.data.configs)
        },
        init_list:function()
        {
            var that  = this;
            var items = [];

            that.type_names_.each(function(i,type){
                items.push({
                    value:type,
                    icon:`icons/24/${that.icon_names_[i]}.svg` ,
                    text:lang(type)
                });
            });
            that.widgets_.list = Std.ui("List",{
                items: items,
                level:4,
                iconWidth:24,
                iconHeight:24,
                itemHeight:32,
                minWidth:120,
                width:210,
                fixedWidth:true,
                className:"settings_list",
                on:{
                    itemSelected:function(index){
                        //console.log(index)
                        that.widgets_.client.select(index)
                        that.client_layouts_[index].update();
                    }
                }
            });
        },

        init_ui:function()
        {
            var that    = this;
            var buttons = Std.ui.create({
                cancel:{
                    ui:"Button",
                    styleType:"textBesideIcon",
                    icon:"icons/16/cancel.svg",
                    iconWidth:16,
                    iconHeight:16,
                    text:lang("cancel"),
                    click:function(){
                        that.close();
                    }
                },
                save:{
                    ui:"Button",
                    styleType:"textBesideIcon",
                    icon:"icons/16/save.svg",
                    iconWidth:16,
                    iconHeight:16,
                    text:lang("save"),
                    click:function(){
                        that.save();
                    }
                }
            });

            that.layout({
                ui:"VBoxLayout",
                items:[
                    {
                        ui:"HBoxLayout",
                        items:[that.widgets_.list, that.widgets_.client],
                        plugins:{split:true}
                    },
                    {
                        ui:"HBoxLayout",
                        items:[{ui:"stretch",level:3}, buttons.cancel, buttons.save]
                    }
                ]
            });
            that.widgets_.list.select(0);
        }
    },
    public:{
        /*
         * save
        */
        save:function()
        {
            let that = this;

            for(let type in that.type_fields_)
            {
                let wizard = that.wizards_[type];
                let values = wizard.values();

                filecxx_rpc.send("config_update",{
                    name: type,
                    config: Std.extend(filecxx_wui.data.configs[type],values)
                })
            }
            that.close();
        }
    },
    main:function(that,opts)
    {
        that.type_names_  = ["general","network","service","anti_leech","file_browser","stream","http","ftp","ssh","torrent","ed2k"];
        that.icon_names_  = ["setting","internet","service","leech","directory","stream","web","ftp","ssh","torrent","emule"];
        that.type_fields_ = {
            general:{
                general: ["save_history_path","max_history_paths","default_save_path"]
            },
            network:
            {
                settings: [
                    "client_name","client_fingerprint_type","encrypt_mode","upload_algorithm","torrent_port",
                    "client_fingerprint","proxy","proxy_mode","anonymous_mode","torrent_enable_proxy","enable_DHT","enable_LSD",
                    "enable_upnp","enable_natpmp",
                    "max_downloading_tasks","max_uploading_tasks"
                ]
            },
            service:
            {
                settings: [
                    "enable","remote_access","port",
                    "webserver","webserver_dir_listing",
                    "webdav",
                    "webdav_upload","webdav_delete","webdav_move","webdav_copy","webdav_create_dir","webdav_chmod",
                    "www_dir",
                ],
                authentication:[
                    "skip_localhost_pass","skip_http_server_auth","skip_webdav_server_auth",
                    "username","password"
                ]
            },
            leeches_anti:
            {
                public_torrent:[
                    "upload_size_exceeds_filesize","progress_always_0",
                    "operation_always","client_names",
                    "operation_seeding","client_names2"
                ],
                private_torrent:[

                ]
            },
            nfs:{
                settings:["connect_timeout","max_connections","no_task_record","cache"]
            },
            stream_task:
            {
                task:[
                    "connect_timeout","max_connections","max_retry","max_redirect","speed_limit_download","speed_limit_upload",
                    "parallel","preferred_video_quality",
                    "ignore_server_busy","auto_rename_file","auto_merge","video_audio_merge","without_confirm","no_task_record",
                ],
                headers:[
                    "user_agent","headers"
                ]
            },
            http_task:
            {
                task:[
                    "method","connect_timeout","max_connections","max_retry","max_redirect","speed_limit","attr_last_modified","parallel",
                    "ignore_remote_modified","ignore_server_busy","ignore_http_error","auto_rename_file","without_confirm","no_task_record",
                ],
                headers:["user_agent","headers"],
                mirrors:["mirrors_mode","mirrors_proxy","mirrors_path"]
            },
            ftp_task:
            {
                task:[
                    "connect_timeout","max_connections","max_retry","speed_limit_download","speed_limit_upload",
                    "ignore_remote_modified","ignore_server_busy","auto_rename_file","no_task_record"
                ]
            },
            ssh_task:
            {
                task:[
                    "method","connect_timeout","max_connections","max_retry","speed_limit_download","speed_limit_upload",
                    "attr_last_modified","parallel",
                    "ignore_remote_modified","ignore_server_busy","auto_rename_file","no_task_record"
                ]
            },
            torrent_task:
            {
                task:[
                    "speed_limit_download","speed_limit_upload","max_connections",
                    "seeding_limit_ratio_enable","seeding_limit_ratio","seeding_limit_minutes_enable","seeding_limit_minutes","seeding_limit_size_enable",
                    "seeding_limit_size",
                    "seeding_limit_act","seeding_limit_speed_limit",
                    "auto_rename_file","without_confirm","sequential"
                ]
            },
            ed2k_task:{
                task:[]
            }
        };
        that.widgets_ = {};
        that.wizards_ = {};
        that.client_layouts_ = [];
    }
});