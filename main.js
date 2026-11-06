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
        padding:4
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
                                text:lang("TODO"),
                                icon:"icons/16/add_file.svg"
                            },
                        ]
                    }
                ]
            })
            this.layout_.prepend(this.menubar_);
        },
        init_groups:function()
        {
            this.groups_ = Std.ui("List",{
                iconHeight:24,
                iconWidth:24,
                itemHeight:36,
                items:[
                    {
                        icon:"icons/24/all.svg",
                        text:lang("all")
                    },
                    {
                        icon:"icons/24/download.svg",
                        text:lang("transferring")
                    },
                    {
                        icon:"icons/24/stop.svg",
                        text:lang("stopped")
                    },
                    {
                        icon:"icons/24/success.svg",
                        text:lang("completed")
                    },
                    {
                        icon:"icons/24/seeding.svg",
                        text:lang("seeding")
                    },
                    {
                        icon:"icons/24/failed.svg",
                        text:lang("failed")
                    },
                    {
                        icon:"icons/24/queuing.svg",
                        text:lang("queueing")
                    },
                    {
                        icon:"icons/24/delay.svg",
                        text:lang("download_later")
                    }
                ]
            })
            this.layout_left_.append({ui:"HBoxLayout",
                items:[
                    {ui:"Label",text:lang("all_groups"),css:{color:"gray"}},
                    {ui:"stretch",level:3},
                    {ui:"ToolButton",styleType:"icon",iconWidth:16,iconHeight:16,icon:"icons/24/add.svg"}
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
            this.statusbar_ = Std.ui("StatusBar",{
                height:32,
                items:[

                ]
            })
            this.layout_.append(this.statusbar_);
        },
        init_tasks_panel:function(){

            this.layout_right_.append(filecxx_wui.tasks)
        },

        init_events:function(){

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

        that.init_events();
    }
});

/*
 * load language file
*/
Std.main.hold(function(holder,handler)
{
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
    filecxx_wui.messages.init();

    let main_widget = Std.ui("filecxx_webui",{
        renderTo:"body",
        width:Std.dom(window).width(),
        height:Std.dom(window).height(),
    });
    Std.dom(window).on("resize",function(){
        main_widget.width(this.width());
        main_widget.height(this.height());

    });
});