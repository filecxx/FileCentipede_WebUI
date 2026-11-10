Std.ui.module("filecxx_task_add",
{
    parent:"Window",
    option:{
        acceptEsc:true,
        width:620,
        height:350,
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
`
    },
    public:{

    },
    initialize:
    {
        init_ui:function()
        {
            let that = this;

            that.widgets_ = Std.ui.create(
            {
                addresses:{
                    ui:"TextEdit",
                    placeHolder:filecxx_wui.lang.format(Std.ui.module("filecxx_task_add").addresses_placeholder).replaceAll(/\r?\n/g, '<br/>')
                },
                download_later:{
                    ui:"Button",
                    iconWidth:16,
                    iconHeight:16,
                    styleType: "textBesideIcon",
                    icon:"icons/16/delay.svg",
                    text:lang("download_later")
                },
                download_now:{
                    ui:"Button",
                    iconWidth:16,
                    iconHeight:16,
                    styleType: "textBesideIcon",
                    icon:"icons/16/download.svg",
                    text:lang("download_now")
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