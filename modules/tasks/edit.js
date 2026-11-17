Std.ui.module("filecxx_task_edit",
{
    parent:"Window",
    option:{
        acceptEsc:true,
        width:620,
        height:410,
        title:lang("edit"),
        titleIcon:"icons/24/edit.svg",
        task_configs: {}
    },
    extend:{
        render:function()
        {
            this.init_layout();
        }
    },
    protected:
    {
        create_action_buttons:function()
        {
            let that = this;

            return {
                ui:"HBoxLayout",
                level:2,
                items:[
                    {ui:"stretch",level:3},
                    {
                        ui:"Button",
                        styleType:"textBesideIcon",
                        icon:"icons/16/cancel.svg",
                        iconWidth:16,
                        iconHeight:16,
                        text:lang("cancel"),
                        click:function(){
                            that.close()
                        }
                    },
                    {
                        ui:"Button",
                        styleType:"textBesideIcon",
                        icon:"icons/16/save.svg",
                        iconWidth:16,
                        iconHeight:16,
                        text:lang("save"),
                        click:function(){

                        }
                    }
                ]
            }
        }
    },
    initialize:
    {
        init_http_layout(values)
        {
            const fields = {
                attributes:[
                    "method","connect_timeout","max_retry","max_connections","max_redirect","speed_limit_download",
                    "file_name","catalog","save_path","proxy","proxy_mode",
                    "ignore_remote_modified","ignore_server_busy","ignore_http_error","auto_rename_file","no_task_record"
                ],
                address:["uri"],
                Cookie:["cookies"],
                Headers:["user_agent","headers"],
                mirrors:["mirrors_mode","mirrors_proxy","mirrors_path","mirror_hosts"]
            }

            let that   = this;
            let wizard = that.wizard_ = Std.ui.wizard(values);

            wizard.fields(fields);
            wizard.options("*",{
                method: "http_method",
                uri:{ui:"TextEdit"},
                speed_limit_download:"speed_limit",
                file_name:{readOnly:true},
                save_path:{readOnly:true}
            });
            let layout = wizard.layout("tabs",{
                maxStretchableColumns:2,
            });

            that.layout({
                ui:"VBoxLayout",
                items:[layout, that.create_action_buttons()]
            });
        },
        init_ftp_layout()
        {

        },
        init_torrent_layout(values)
        {
            const fields = {
                attributes:[
                    "file_name","save_path",
                    "catalog","max_connections","speed_limit_upload","speed_limit_download",

                    "seeding_limit_ratio_enable","seeding_limit_minutes_enable","seeding_limit_size_enable", "seeding_limit_ratio", "seeding_limit_minutes", "seeding_limit_size",
                    "seeding_limit_act","seeding_limit_speed_limit"
                ],
                address:["uri"],
            }

            let that   = this;
            let wizard = that.wizard_ = Std.ui.wizard(values);

            wizard.fields(fields);
            wizard.options("*",{
                uri:{ui:"TextEdit",readOnly:true},
                file_name:{readOnly:true},
                save_path:{readOnly:true}
            });
            let layout = wizard.layout("tabs",{
                maxStretchableColumns:2,
            });

            that.layout({
                ui:"VBoxLayout",
                items:[layout, that.create_action_buttons()]
            });
        },
        init_ed2k_layout()
        {

        },
        init_stream_layout(values)
        {
            const fields = {
                attributes:[
                    "connect_timeout","max_connections","max_retry","max_redirect","speed_limit_download",
                    "file_name","catalog","save_path",
                    "proxy","proxy_mode",
                    "parallel",
                    "ignore_server_busy","auto_rename_file","auto_merge","video_audio_merge"
                ],
                address:["uri"],
                decryption:["base_url","key_data","key_mode","iv"],
                Cookie:["cookies"],
                Headers:["user_agent","headers"]
            }

            let that   = this;
            let wizard = that.wizard_ = Std.ui.wizard(values);

            wizard.fields(fields);
            wizard.options("*",{
                method: "http_method",
                uri:{ui:"TextEdit"},
                speed_limit_download:"speed_limit",
                file_name:{readOnly:true},
                save_path:{readOnly:true},
                key_mode:{ui:"ComboBox",valueType:"index",items:["Base64"]}
            });
            let layout = wizard.layout("tabs",{
                maxStretchableColumns:2,
            });

            that.layout({
                ui:"VBoxLayout",
                items:[layout, that.create_action_buttons()]
            });
        },
        init_ssh_layout()
        {

        },
        init_layout()
        {
            var that   = this;
            var opts   = that.opts;

            switch(opts.task_configs.type)
            {
            case filecxx_rpc.task_types.Task_HTTP:
                that.init_http_layout(opts.task_configs);
                break;
            case filecxx_rpc.task_types.Task_FTP:
                that.init_ftp_layout(opts.task_configs);
                break;
            case filecxx_rpc.task_types.Task_Torrent:
                that.init_torrent_layout(opts.task_configs);
                break;
            case filecxx_rpc.task_types.Task_Ed2k:
                that.init_ed2k_layout(opts.task_configs);
                break;
            case filecxx_rpc.task_types.Task_Stream:
                that.init_stream_layout(opts.task_configs);
                break;
            case filecxx_rpc.task_types.Task_SSH:
                that.init_ssh_layout(opts.task_configs);
                break;
            default:
                console.assert(false,"data error");
            }
        }
    },
    public:{

    },
    main:function(that,opts)
    {
        that.wizard_ = null;
    }
});