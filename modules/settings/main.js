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

            if(that.timer_save_ !== -1){
                clearInterval(that.timer_save_);
                that.timer_save_ = -1;
            }
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

                enable_partial_ext:{
                    enable:false,
                },
                partial_file_ext:{
                    enable:false,
                },
                enable_incomplete_save_path:{
                    enable:false
                },
                file_exists:{
                    ui:"ComboBox",
                    valueType:"index",
                    enable:false,
                    items:[lang("auto_rename_file"),lang("skip")]
                },
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
                enable:{
                    ui:"ToggleBox"
                },
                remote_access:{
                    ui:"ToggleBox"
                },
                webserver:{
                    ui:"ToggleBox"
                },
                webdav:{
                    ui:"ToggleBox"
                },
                enable_webserver:{
                    ui:"ToggleBox"
                },
                webserver_dir_listing:{
                    ui:"ToggleBox"
                },
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
            var schema = Std.ui.schema("settings",{
                sort:true,
                widgets:{
                    boolean:"CheckBox"
                }
            });

            that.type_keys_.each(function(i,type)
            {
                let wizard = Std.ui.wizard(filecxx_wui.data.configs[type],schema);
                that.create_wizard_opts(wizard);
                that.wizards_[type] = wizard;

                let layout = wizard.layout({
                    level:4,
                    maxStretchableColumns:2,
                    columnSpacing:8,
                    padding:8,
                });
                let tabs = Std.ui("TabPanel",{
                    ui:"TabPanel",
                    width:500,
                    height:300,
                    level:4,
                    items:[
                        {
                            button:{
                                className:"tasks_tab_button",
                                text:lang(that.type_names_[i])
                            },
                            content:layout
                        }
                    ]
                })
                items.push(tabs);
                that.client_layouts_.push(layout);
                //console.log(filecxx_wui.data.configs[type])
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
                        plugins:{
                            split:true
                        }
                    },
                    {
                        ui:"HBoxLayout",
                        items:[{ui:"stretch",level:3}, buttons.cancel, buttons.save,]
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

        }
    },
    main:function(that,opts)
    {
        that.type_names_ = ["general","network","service","anti_leech","file_browser","stream","http","ftp","ssh","torrent","ed2k"];
        that.type_keys_  = ["general","network","service","leeches_anti","nfs","stream_task","http_task","ftp_task","ssh_task","torrent_task","ed2k_task"];
        that.icon_names_ = ["setting","internet","service","leech","directory","stream","web","ftp","ssh","torrent","emule"];

        that.widgets_ = {};
        that.wizards_ = {};
        that.client_layouts_ = [];

    }
});