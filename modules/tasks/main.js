Std.ui.module("filecxx_tasks",
{
    parent:"widget",
    option:{
        level:4,
        width:"auto",
        height:"auto",
    },

    initialize:
    {
        init_layout()
        {
            this.layout_ = Std.ui("VBoxLayout",{
                items:[]
            });
            this.layout(this.layout_);
        },
        init_actions:function()
        {
            this.actions = {
                add:{
                    text:lang("add"),
                    icon:"icons/24/add.svg"
                },
                open:{
                    text:lang("open"),
                    icon:"icons/24/add_file.svg"
                },
                start:{
                    text:lang("start"),
                    icon:"icons/24/start.svg"
                },
                stop:{
                    text:lang("stop"),
                    icon:"icons/24/stop.svg"
                },
                remove:{
                    text:lang("delete"),
                    icon:"icons/24/delete.svg"
                }
            };
        },
        init_filter:function()
        {
            this.filter_ = Std.ui("ComboBox",{
                editable:true,
                width:"auto",
                placeHolder:lang("filter")
            });
        },
        init_toolbar:function()
        {
            let actions = this.actions;

            this.toolbar_ = Std.ui("ToolBar",
            {
                iconWidth:24,
                iconHeight:24,
                items:[
                    {
                        ui:"SplitToolButton",
                        text:lang("add"),
                        icon:"icons/24/add.svg",
                        styleType:"textBesideIcon",
                        dropdown:Std.ui("Menu",{
                            items:[
                                {
                                    text:lang("add"),
                                    icon:"icons/24/add.svg",
                                },
                                {
                                    text:lang("add_directory"),
                                    icon:"icons/24/add.svg",
                                },
                                {
                                    text:lang("add_stream"),
                                    icon:"icons/16/stream.svg",
                                }
                            ]
                        })
                    },

                    actions.open,
                    actions.start,
                    actions.stop,
                    actions.remove,

                    {ui:"sep"},

                    this.filter_
                ]
            })
        },

        init_grid:function()
        {
            let actions = this.actions;

            this.grid_ = Std.ui("Grid",{
                rowNumbers:false,
                rowHeight:32,
                rowResizable:true,
                rowExtensible:true,
                rowNumberWidth:50,
                cellEditable:false,
                stripeRows:true,
                //cellEditMode:"click",
                //stripeRows:true,
                //verticalLine:false,
                //horizontalLine:false,
                //columnCount:25,
                //deferRender:false,
                autoClean:true,
                //columnSortable:true,
                //columnCount:20,
                columnDroppable:true,
                columnResizable:true,
                columnSortable:true,
                selectionMode:"rows",
                //selectionMarked:true,
                //hoverMode:"row",
                columns:[
                    {name:"name",text:lang("name"),width:140},
                    {name:"size",text:lang("size"),width:100},
                    {name:"progress",text:lang("progress"),width:140},
                    {name:"download_speed",text:lang("download_speed"),width:140},
                    {name:"upload_speed",text:lang("upload_speed"),width:140},
                    {name:"peers",text:lang("peers"),width:140},
                    {name:"seeds",text:lang("seeds"),width:140},
                    {name:"time_left",text:lang("time_left"),width:140},
                    {name:"creation_time",text:lang("creation_time"),width:140},
                    {name:"catalog",text:lang("catalog"),width:140},
                ],

                rowContextMenu:{
                    items:[
                        actions.start,
                        actions.stop,
                        actions.remove,
                    ]
                }
            });
        },
        init_tabs:function()
        {
            this.tabs_ = Std.ui("TabPanel",
            {
                items:[
                    {
                        name:"file_transfer",
                        button:{
                            text:lang("file_transfer"),
                            icon:"icons/16/file.svg",
                            iconWidth: 16,
                            iconHeight: 16,
                            styleType:"textBesideIcon",
                            className:"tasks_tab_button"
                        },
                        content:{
                            layout:{
                                ui:"VBoxLayout",
                                items:[
                                    this.toolbar_,
                                    this.grid_
                                ]
                            }
                        }
                    }
                ]
            });
            this.layout_.append(this.tabs_);
        }
    },
    main:function(that,opts)
    {
        that.init_layout();
        that.init_actions();

        that.init_filter();
        that.init_toolbar();

        that.init_grid();
        that.init_tabs();
    }
})