/*
 * main widget
*/
Std.ui.module("filecxx_webui",
{
    parent:"widget",
    option:{
        level:4,
        width:"auto",
        height:"auto",
        padding:6,
    },
    static:
    {
        show_about:function()
        {
            Std.ui("MessageBox",{
                title:lang("about"),
                text:lang("about_content_")
            }).move("central").move("central").updateLayout();
        }
    },
    initialize:
    {
        init_layout:function()
        {
            this.layout_left_ = Std.ui("VBoxLayout",{
                level:3,
                width:250
            });
            this.layout_right_ = Std.ui("VBoxLayout",{
                level:4
            });
            this.layout_body_ = Std.ui("HBoxLayout",{
                spacing:10,
                items:[
                    this.layout_left_,
                    this.layout_right_
                ]
            });
            this.layout_ = Std.ui("VBoxLayout",
            {
                spacing: 12,
                items:[
                    this.layout_body_
                ]
            });
            this.layout(this.layout_);
        },

        init_menubar:function()
        {
            this.menubar_ = Std.ui("MenuBar",{

                items:[
                    {
                        text:lang("file"),
                        items:[
                            {
                                text:lang("open"),
                                icon:"icons/16/add_file.svg"
                            },
                            {ui:"sep"},
                            {
                                text:lang("add"),
                                icon:"icons/24/add.svg"
                            },
                            {
                                text:lang("add_directory"),
                                icon:"icons/24/add.svg"
                            },
                            {
                                text:lang("add_stream"),
                                icon:"icons/16/stream.svg"
                            },
                            {ui:"sep"},
                            {
                                text:lang("exit"),
                                icon:"icons/16/exit.svg",
                                click:function(){
                                    window.close()
                                }
                            }
                        ]
                    },
                    {
                        text:lang("view"),
                        items:[
                            {
                                text:lang("TODO"),
                                icon:"icons/16/add_file.svg"
                            },
                        ]
                    },
                    {
                        text:lang("settings"),
                        items:[
                            {
                                text:lang("TODO"),
                                icon:"icons/16/add_file.svg"
                            },
                        ]
                    },
                    {
                        text:lang("help"),
                        items:[
                            {
                                text:`<a class="url_link" href="` +lang("website_")+ `" target="_blank">`+lang("website")+`</a>`,
                                icon:"icons/16/web.svg"
                            },
                            {
                                text:`<a class="url_link" href="https://github.com/filecxx/FileCentipede_WebUI" target="_blank">Github</a>`,
                                icon:"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http://www.w3.org/2000/svg%22%20data-component%3D%22Octicon%22%20aria-hidden%3D%22true%22%20focusable%3D%22false%22%20class%3D%22octicon%20octicon-mark-github%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%2224%22%20height%3D%2224%22%20fill%3D%22currentColor%22%20display%3D%22inline-block%22%20overflow%3D%22visible%22%20style%3D%22vertical-align:text-bottom%22%3E%3Cpath%20d%3D%22M10.226%2017.284c-2.965-.36-5.054-2.493-5.054-5.256%200-1.123.404-2.336%201.078-3.144-.292-.741-.247-2.314.09-2.965.898-.112%202.111.36%202.83%201.01.853-.269%201.752-.404%202.853-.404%201.1%200%201.999.135%202.807.382.696-.629%201.932-1.1%202.83-.988.315.606.36%202.179.067%202.942.72.854%201.101%202%201.101%203.167%200%202.763-2.089%204.852-5.098%205.234.763.494%201.28%201.572%201.28%202.807v2.336c0%20.674.561%201.056%201.235.786%204.066-1.55%207.255-5.615%207.255-10.646C23.5%206.188%2018.334%201%2011.978%201%205.62%201%20.5%206.188.5%2012.545c0%204.986%203.167%209.12%207.435%2010.669.606.225%201.19-.18%201.19-.786V20.63a2.9%202.9%200%200%201-1.078.224c-1.483%200-2.359-.808-2.987-2.313-.247-.607-.517-.966-1.034-1.033-.27-.023-.359-.135-.359-.27%200-.27.45-.471.898-.471.652%200%201.213.404%201.797%201.235.45.651.921.943%201.483.943.561%200%20.92-.202%201.437-.719.382-.381.674-.718.944-.943%22/%3E%3C/svg%3E"
                            },
                            {
                                text:lang("about"),
                                icon:"icons/16/about.svg",
                                click:Std.ui.module("filecxx_webui").show_about
                            },
                        ]
                    }
                ]
            })
            this.layout_.prepend(this.menubar_);
        },
        init_groups:function()
        {
            this.groups_ = Std.ui("List",
            {
                iconHeight:24,
                iconWidth:24,
                itemHeight:36,
                valueType:"list-value",
                value:"all",
                items:[
                    {
                        icon:"icons/24/all.svg",
                        text:lang("all"),
                        value:"all"
                    },
                    {
                        icon:"icons/24/download.svg",
                        text:lang("transferring"),
                        value:"transferring"
                    },
                    {
                        icon:"icons/24/stop.svg",
                        text:lang("stopped"),
                        value:"stopped"
                    },
                    {
                        icon:"icons/24/success.svg",
                        text:lang("completed"),
                        value:"completed"
                    },
                    {
                        icon:"icons/24/seeding.svg",
                        text:lang("seeding"),
                        value:"seeding"
                    },
                    {
                        icon:"icons/24/failed.svg",
                        text:lang("failed"),
                        value:"failed"
                    },
                    {
                        icon:"icons/24/queuing.svg",
                        text:lang("queuing"),
                        value:"queuing"
                    },
                    {
                        icon:"icons/24/delay.svg",
                        text:lang("download_later"),
                        value:"download_later"
                    }
                ]
            });
            this.groups_.select(0);

            this.layout_left_.append({ui:"HBoxLayout",
                items:[
                    {ui:"Label",text:lang("all_groups"),css:{color:"gray"}},
                    {ui:"stretch",level:3}
                ]
            });
            this.layout_left_.append({ui:"sep",className:"left_sep_"});
            this.layout_left_.append(this.groups_);
        },
        init_catalogs:function()
        {
            this.catalogs_ = Std.ui("List",{
                iconHeight:24,
                iconWidth:24,
                itemHeight:28,
                items:[
                    {
                        icon:"icons/24/all.svg",
                        text:lang("all")
                    },
                ]
            })
            this.catalogs_.select(0);

            this.layout_left_.append({ui:"HBoxLayout",
                items:[
                    {ui:"Label",text:lang("catalogs"),css:{color:"gray"}},
                    {ui:"stretch",level:3},
                    {ui:"ToolButton",styleType:"icon",iconWidth:16,iconHeight:16,icon:"icons/24/add.svg"}
                ]
            });
            this.layout_left_.append({ui:"sep",className:"left_sep_"});
            this.layout_left_.append(this.catalogs_);
        },
        init_statusbar:function()
        {
            this.status_dht_ = Std.ui("Label",{
                text:"DHT Nodes: 0"
            });
            this.status_download_speed_limit_ = Std.ui("ToolButton",{
                styleType:"textBesideIcon",
                iconWidth:16,
                iconHeight:16,
                width:120,
                height:28,
                icon:"icons/16/download.svg",
                text:" 0.00 B/s",
                css:"color:#00477d"
            });
            this.status_upload_speed_limit_ = Std.ui("ToolButton",{
                styleType:"textBesideIcon",
                width:120,
                height:28,
                iconWidth:16,
                iconHeight:16,
                icon:"icons/16/upload.svg",
                text:" 0.00 B/s",
                css:"color:#4b1e1e"
            })
            this.statusbar_ = Std.ui("StatusBar",{
                height:32
            })
            this.statusbar_layout_ = Std.ui("HBoxLayout",
            {
                spacing:4,
                items:[
                    this.statusbar_,

                    this.status_dht_,
                    {ui:"sep",level:1,className:"statusbar_sep_"},
                    this.status_download_speed_limit_,
                    this.status_upload_speed_limit_,
                ]
            })
            this.layout_.append(this.statusbar_layout_);
        },
        init_tasks_panel:function(){
            this.layout_right_.append(filecxx_wui.tasks)
        },

        init_rpc:function()
        {
            filecxx_rpc.config = {
                host:     Std.cookie.get("filecxx_wui_host") || "",
                port:     Std.cookie.get("filecxx_wui_port") || 10111,
                ssl:      Std.cookie.get("filecxx_wui_ssl")  || false,
                username: Std.cookie.get("filecxx_wui_username") || "",
                password: Std.cookie.get("filecxx_wui_password") || ""
            }
            filecxx_wui.rpc.init(function(config)
            {
                Std.cookie.set({
                    filecxx_wui_host:     config.host,
                    filecxx_wui_port:     config.port,
                    filecxx_wui_ssl:      config.ssl,
                    filecxx_wui_username: config.username,
                    filecxx_wui_password: config.password,
                });
                filecxx_wui.messages.boot();
            });
        }
    },
    main:function(that,opts)
    {
        that.init_layout();

        that.init_menubar();
        that.init_groups();
        that.init_catalogs();
        that.init_tasks_panel();
        that.init_statusbar();

        that.init_rpc();
    }
});

/*
 * load language file
*/
Std.main.hold(function(holder,handler)
{
    filecxx_wui.lang.init();
    filecxx_wui.lang.load(function(){
        holder.release(handler);
    });
});

/*
 * main
*/
Std.main(function()
{
    filecxx_wui.tasks = Std.ui("filecxx_tasks",{

    });

    let main_widget = Std.ui("filecxx_webui",{
        renderTo:"body",
        width:Std.dom(window).width(),
        height:Std.dom(window).height(),
    });
    Std.dom(window).on("resize",function(){
        main_widget.width(this.width());
        main_widget.height(this.height());

    });
    Std.dom("title").text(filecxx_wui.lang.format('${software_name_} WebUI ' + filecxx_wui.version.toFixed(2)))
});