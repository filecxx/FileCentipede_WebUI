Std.ui.module("filecxx_task_add",
{
    parent:"Window",
    option:{
        acceptEsc:true,
        maximizable:true,
        width:620,
        height:350,
        type:"add_task", //add_task, add_directory, add_stream
        title:lang("task_add"),
        titleIcon:"icons/24/add.svg",
    },
    static:{
        addresses_placeholder: `[\${protocol}] :
HTTP, HTTPS, FTP, FTPS, SFTP, SSH, HASH, Magnet, Torrent, ed2k

[\${custom_protocol}] :
filec, fileu, thunder, flashget, qqdl, JSON

[\${command_line}] :
curl, wget, aria2, axel
`,

        directory_addresses_placeholder:`[\${protocol}] :
WebDAV(HTTP, HTTPS), FTP, FTPS, SFTP, SSH

[\${custom_protocol}] :
filec, fileu, JSON

[\${command_line}] :
curl, wget, aria2, axel

\${example}:
http://user:password@filecxx.com/dav/
        `,

        stream_addresses_placeholder:`[\${protocol}] :
m3u8, mpd, json

\${example}:
http://test.filecxx.com/stream/1.m3u8
http://test.filecxx.com/stream/1.mpd
`

    },
    extend:{
        destroy:function()
        {
            var that = this;

            if(that.timer_change_ !== -1){
                clearTimeout(that.timer_change_);
                that.timer_change_ = -1;
            }
        }
    },
    private:{
        timer_change: -1,
        addresses:""
    },
    protected:
    {
        on_change:function(text)
        {
            let that = this;

            if(isString(text)){
                that.addresses_ = text;
            }
        }
    },
    public:{
        /*
         * send download
        */
        send_download:function(later)
        {
            let that = this;
            let opts = that.opts;
            let mode = 0;

            if(!that.addresses_){
                return;
            }
            that.addresses_.split("\n").each((_,line)=>
            {
                let uri      = line.trim();
                let msg_type = "task_add";

                if(opts.type === "add_directory"){
                    mode |= filecxx_rpc.task_modes.Task_Mode_Directory;
                }else if(opts.type === "add_stream"){
                    msg_type = "task_add_stream"
                }
                filecxx_rpc.send(msg_type,{
                    uri:uri,
                    later:later,
                    mode:mode
                })
            })
        }

    },
    initialize:
    {
        init_ui:function()
        {
            let that        = this;
            let opts        = that.opts;
            let self        = Std.ui.module("filecxx_task_add");
            let placeholder = "";

            if(opts.type === "add_task"){
                placeholder = self.addresses_placeholder;
            }else if(opts.type === "add_directory"){
                placeholder = self.directory_addresses_placeholder;
            }else if(opts.type === "add_stream"){
                placeholder = self.stream_addresses_placeholder;
            }
            that.widgets_ = Std.ui.create(
            {
                addresses:{
                    ui:"TextEdit",
                    placeHolder:filecxx_wui.lang.format(placeholder.replaceAll(/\r?\n/g, '<br/>')),
                    on:{
                        input:function(val)
                        {
                            if(that.timer_change_ !== -1){
                                clearTimeout(that.timer_change_);
                                that.timer_change_ = -1;
                            }
                            that.timer_change_ = setTimeout(function(){
                                that.on_change(val)
                                that.timer_change_ = -1;
                            },200);
                        }
                    }
                },
                download_later:{
                    ui:"Button",
                    iconWidth:16,
                    iconHeight:16,
                    styleType: "textBesideIcon",
                    icon:"icons/16/delay.svg",
                    text:lang("download_later"),
                    click:function(){
                        that.send_download(true);
                        that.close();
                    }
                },
                download_now:{
                    ui:"Button",
                    iconWidth:16,
                    iconHeight:16,
                    styleType: "textBesideIcon",
                    icon:"icons/16/download.svg",
                    text:lang("download_now"),
                    click:function(){
                        that.send_download();
                        that.close();
                    }
                },
                layout:{
                    ui:"VBoxLayout"
                },
                buttons_layout:{
                    ui:"HBoxLayout",
                    items:[{ui:"stretch",level:3}]
                }
            });

            that.tabs_ = Std.ui("TabPanel",
            {
                items:[
                    {
                        name:"addresses",
                        button:{
                            text:lang("addresses"),
                            styleType:"text",
                            className:"tasks_tab_button",
                        },
                        content:{
                            layout:{
                                ui:"VBoxLayout",
                                items:[that.widgets_.addresses,]
                            }
                        }
                    }
                ]
            });
            that.widgets_.buttons_layout.append([that.widgets_.download_later,that.widgets_.download_now]);
            that.widgets_.layout.append(that.tabs_);
            that.widgets_.layout.append(that.widgets_.buttons_layout);
            that.layout(that.widgets_.layout);
        }
    },
    main:function(that,opts)
    {
        that.init_ui();
    }
});