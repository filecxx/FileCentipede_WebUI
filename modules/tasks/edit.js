Std.ui.module("filecxx_task_edit",
{
    parent:"Window",
    option:{
        acceptEsc:true,
        maximizable:true,
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
            let cancel = {
                ui:"Button",
                styleType:"textBesideIcon",
                icon:"icons/16/cancel.svg",
                iconWidth:16,
                iconHeight:16,
                text:lang("cancel"),
                click:function(){
                    that.close()
                }
            };
            let save = {
                ui:"Button",
                styleType:"textBesideIcon",
                icon:"icons/16/save.svg",
                iconWidth:16,
                iconHeight:16,
                text:lang("save"),
                click:function(){
                    that.on_save(that.wizard_.values());
                    that.close();
                }
            };

            return {
                ui:"HBoxLayout",
                level:2,
                items:[{ui:"stretch",level:3}, cancel, save]
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

            //wizard.valueMode("pairs");
            wizard.fields(fields);
            wizard.options("*",{
                method: "http_method",
                proxy:"task_proxy",
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
        init_ftp_layout(values)
        {
            const fields = {
                attributes:[
                    "connect_timeout","max_retry","max_connections","speed_limit_download","speed_limit_upload",
                    "user","pass",
                    "file_name","catalog","save_path","proxy","proxy_mode",
                    "ignore_remote_modified","ignore_server_busy","auto_rename_file","no_task_record"
                ],
                address:["uri"],
            }
            let that   = this;
            let wizard = that.wizard_ = Std.ui.wizard(values);

            wizard.fields(fields);
            wizard.options("*",{
                proxy:"task_proxy",
                uri:{ui:"TextEdit"},
                pass:"password",
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
        init_ed2k_layout(values)
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
        init_ssh_layout(values)
        {
            const fields = {
                attributes:[
                    "connect_timeout","max_retry","max_connections","speed_limit_download","speed_limit_upload",
                    "user","pass",
                    "file_name","catalog","save_path","proxy","proxy_mode",
                    "ignore_remote_modified","ignore_server_busy","auto_rename_file","no_task_record"
                ],
                address:["uri"],
            }
            let that   = this;
            let wizard = that.wizard_ = Std.ui.wizard(values);

            wizard.fields(fields);
            wizard.options("*",{
                proxy:"task_proxy",
                uri:{ui:"TextEdit"},
                pass:"password",
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
        on_save(value)
        {
            var that = this;
            var opts = that.opts;

            filecxx_rpc.send("task_edit",Std.extend({
                id: opts.task_configs.id,
                type: opts.task_configs.type
            },value));

            //console.log(opts.task_configs)
            //console.log(value)
        }
    },
    main:function(that,opts)
    {
        that.wizard_ = null;
    }
});