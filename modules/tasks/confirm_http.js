Std.ui.module("filecxx_task_confirm_http",
{
    parent:"filecxx_task_confirm_base",
    option:{
        width:600,
        height:400,
        task_type: filecxx_rpc.task_types.Task_HTTP,
    },
    initialize:
    {
        init_filesystem:function()
        {
            this.files_option_ = {
                ui:"Grid",
                verticalLine:false,
                horizontalLine:false,
                columnResizable:true,
                selectionMode:"row",
                columns:[
                    {
                        name:"file_name",
                        text:lang("file_name"),
                        width:400,
                        cellModel:"file_name"
                    },
                    {
                        name:"file_size",
                        text:lang("size"),
                        width:100
                    }
                ]
            };
        },
        init_layout:function()
        {
            var that   = this;
            var opts   = that.opts;
            var wizard = that.wizard_ = Std.ui.wizard(Std.extend({
                files: 0
            },opts.attrs));

            wizard.fields({
                attributes:["files","uri","file_name","page_url","save_path","catalog","proxy","proxy_mode"],
                settings:[
                    "method","connect_timeout","max_retry","max_connections","max_redirect","speed_limit_download",
                    "ignore_remote_modified","ignore_server_busy","ignore_http_error","auto_rename_file","no_task_record"
                ],
                cookie:["cookies"],
                headers:["user_agent","headers"],
                mirrors:["mirrors_mode","mirrors_proxy","mirrors_path","mirror_hosts"]
            })
            wizard.options("*",{
                // host: {width:120},
                uri:{readOnly:true},
                files: that.files_option_,
                method:"http_method"
            });
            let layout = wizard.layout("tabs",{});
            let grid   = wizard.get("attributes.files");

            that.create_cell_model(grid);
            grid.appendRow({
                cells:[opts.attrs.file_name,opts.attrs.file_size === 0 ? lang("unknown") : bytes_to_str(opts.attrs.file_size)]
            })
            that.layout(Std.ui("VBoxLayout",{
                ui:"VBoxLayout",
                items:[layout,that.widgets_.actions_buttons]
            }))
        }
    }
});
