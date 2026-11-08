Std.ui.module("filecxx_tasks",
{
    parent:"widget",
    option:{
        level:4,
        width:"auto",
        height:"auto",
        className: "tasks_main",
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
            let that   = this;

            this.filter_ = Std.ui("ComboBox",{
                editable:true,
                width:"auto",
                placeHolder:lang("filter"),
                on:{
                    input:function(text) {
                        that.filter("file_name",text);
                    }
                }
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
                rowResizable:false,
                //rowExtensible:true,
                cellEditable:false,
                stripeRows:true,
                verticalLine:false,
                //horizontalLine:false,
                deferRender:true,
                autoClean:true,
                columnDroppable:true,
                columnResizable:true,
                columnSortable:true,
                selectionMode:"rows",
                //selectionMarked:true,
                hoverMode:"none",
                columns:[
                    {name:"file_name",cellModel:"file_name",text:lang("name"),width:420},
                    {name:"file_size",textAlign:"right",cellModel:"file_size",text:lang("size"),width:100},
                    {name:"progress",cellModel:"progress",text:lang("progress"),width:130},
                    {name:"state",cellModel:"state",text:lang("state"),width:120},
                    {name:"download_speed",cellModel:"speed",text:lang("download_speed"),width:140},
                    {name:"upload_speed",cellModel:"speed",text:lang("upload_speed"),width:140},
                    {name:"peers",text:lang("peers"),width:80},
                    {name:"seeds",text:lang("seeds"),width:80},
                    {name:"time_left",cellModel:"duration",text:lang("time_left"),width:140},
                    {name:"time_create",cellModel:"datetime",text:lang("time_create"),width:140},
                    {name:"catalog",text:lang("catalog"),width:140},
                ],
                cellModel:
                {
                    file_name:
                    {
                        update:function(cell,data)
                        {
                            let suffix = extract_filename_suffix(data);
                            let elem   = newDiv().html(data).className("file_name_").attr("title",data);
                            let icon   = "unknown";

                            if(cell.row.data.data_value.folder){
                                icon = "folder";
                            }else if(suffix in filecxx_mime_filenames){
                                icon = filecxx_mime_filenames[suffix];
                            }
                            if(cell.row.data.color){
                                elem.css("color",cell.row.data.color)
                            }
                            elem.css("background-image",`url("icons/mimetypes/24/${icon}.png")`)
                            cell.html(elem);
                        }
                    },
                    file_size:
                    {
                        update:function(cell,data)
                        {
                            if(isNumber(data)){
                                cell.html(bytes_to_str(data));
                            }else if(isString(data)){
                                cell.html(data);
                            }
                        }
                    },
                    state:
                    {
                        update:function(cell,data)
                        {
                            if(isNumber(data)){
                                cell.html(lang(filecxx_rpc.task_state_texts[data]));
                            }else if(isString(data)){
                                cell.html(data);
                            }
                            if(cell.row.data.color){
                                cell.css("color",cell.row.data.color)
                            }
                        }
                    },
                    duration:
                    {
                        update:function(cell,data)
                        {
                            if(isNumber(data)){
                                cell.html(seconds_to_duration(data))
                            }else if(isString(data)){
                                cell.html(data);
                            }
                        }
                    },
                    datetime:
                    {
                        update:function(cell,data)
                        {
                            if(isNumber(data)){
                                cell.html(format_ns_time(data))
                            }else if(isString(data)){
                                cell.html(data);
                            }
                        }
                    },
                    speed:
                    {
                        update:function(cell,data)
                        {
                            if(isNumber(data)){
                                cell.html(bytes_to_str(data) + "/s");
                            }else if(isString(data)){
                                cell.html(data);
                            }
                        }
                    },
                    progress:{
                        type:"ui",
                        model:{
                            ui:"HProgress",
                            width:"100%",
                            height: "90%"
                        },
                        update:function(cell,data)
                        {
                            if(isNumber(data)){
                                cell.widget.value(data);
                            }
                        }
                    },
                },
                rowContextMenu:{
                    items:[
                        actions.start,
                        actions.stop,
                        actions.remove,
                    ]
                },
                on:{
                    rowEvent:function(type)
                    {
                        if(type === "dblclick"){

                        }
                    }
                }
            });
            this.grid_.sortColumn("time_create","desc");
        },
        init_detailbar:function()
        {
            this.detailbar_ = Std.ui("DetailBar",{
                toggle:false,
                items:[
                    {
                        text:"TODO",
                        icon:"icons/16/attributes.svg",
                    },
                    {
                        text:"TODO",
                        icon:"icons/16/request.svg",
                    },
                    {
                        text:"TODO",
                        icon:"icons/16/blocks.svg",
                    },
                    {
                        text:"TODO",
                        icon:"icons/16/connect.svg",
                    },
                ],
                on:{
                    change:function(index){

                    }
                }
            })
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
                                    this.grid_,
                                    this.detailbar_
                                ]
                            }
                        }
                    }
                ]
            });
            this.layout_.append(this.tabs_);
        }
    },
    protected:
    {
        /*
         * on task
        */
        row_color:function(task_state)
        {
            const task_states = filecxx_rpc.task_states;

            switch(task_state)
            {
            case task_states.State_Later:
            case task_states.State_Queuing:
                return "#025a75";
            case task_states.State_Starting:
            case task_states.State_Resuming:
            case task_states.State_Checking:
            case task_states.State_Stopping:
            case task_states.State_Removing:
            case task_states.State_Restarting:
            case task_states.State_Merging:
            case task_states.State_Waiting:
                return "#013d6a";
            case task_states.State_Downloading_Metadata:
                return "#146ab4";
            case task_states.State_Downloading:
                return "#104e9f";
            case task_states.State_Uploading:
            case task_states.State_Seeding:
                return "#057816";
            case task_states.State_Stopped:
                return "#714a1c";
            case task_states.State_Completed:
                return "#1f1f1f";
            case task_states.State_Error:
                return "#ad1c1f";
            default:
                return "";
            }
        },
    },
    public:
    {
        /*
         * filter
        */
        filter:function(column,text,states)
        {
            let that        = this;
            let grid        = that.grid_;
            let hidden_rows = that.hidden_rows;

            for(let i=0;i<hidden_rows.length;++i){
                grid.appendRow(hidden_rows[i]);
            }
            hidden_rows.clear();

            if((!states && (text === null || text.length === 0)) || grid.rowCount() === 0){
                return;
            }
            if(text){
                text = text.toLowerCase();
            }
            for(let i=grid.rowCount()-1;i>=0;--i)
            {
                if(states)
                {
                    let row = grid.row(i);

                    if(!states.has(row.data_value.values.state)){
                        hidden_rows.push(grid.row(i));
                        grid.removeRow(i);
                        continue;
                    }
                }
                if(text)
                {
                    let cell      = grid.cell(i,column);
                    let cell_text = "";

                    if(isString(cell)){
                        cell_text = cell;
                    }
                    if(cell_text.toLowerCase().indexOf(text) === -1){
                        hidden_rows.push(grid.row(i));
                        grid.removeRow(i);
                    }
                }
            }
        },
        /*
         * update task
        */
        update_task:function(values)
        {
            let that  = this;
            let tasks = that.tasks;

            if(!tasks.has(values.id)){
                return false;
            }
            //todo:
        },
        /*
         * add task
        */
        add_task:function(values)
        {
            let that   = this;
            let id     = values.id;
            let type   = values.type;
            let state  = values.state;
            let folder = (values.mode & filecxx_rpc.task_modes.Task_Mode_Directory) !== 0 || (values.files && values.files > 0);
            let grid   = that.grid_;

            grid.appendRow({
                data_value: {
                    id:id,
                    folder:folder,
                    values:values
                },
                color: that.row_color(state),
                cells: values
            });
            if(values.state < filecxx_rpc.task_states.State_Completed)
            {
                that.tasks_active.set(id,{
                    type:type,
                    state:state,
                    confirmed:false,
                    progress:values.progress
                });
            }
            //that.on_task_state(values.state,id,grid.row(grid.rowCount() - 1));
        },
        /*
         * task status
        */
        task_status:function(values)
        {
            if(!this.update_task(values)){
                this.add_task(values);
            }
            setTimeout(function(){
                //this.grid_.sortColumn()
            },1000);
        },
        /*
         * clear
        */
        clear:function()
        {
            this.grid_.clearRows();
        }
    },
    main:function(that,opts)
    {
        that.tasks        = new Map;
        that.tasks_active = new Map;
        that.hidden_rows  = [];

        that.init_layout();
        that.init_actions();

        that.init_filter();
        that.init_toolbar();

        that.init_grid();
        that.init_detailbar();
        that.init_tabs();
    }
})