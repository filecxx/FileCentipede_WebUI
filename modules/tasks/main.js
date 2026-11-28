Std.ui.module("filecxx_tasks",
{
    parent:"widget",
    option:{
        level:5,
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
            let that = this;

            this.actions = {
                open:{
                    text:lang("open"),
                    icon:"icons/24/add_file.svg",
                    click:function(){
                        filecxx_wui.run_module("modules/tasks/open.js","filecxx_task_open")
                    }
                },
                start:{
                    text:lang("start"),
                    icon:"icons/24/start.svg",
                    click:function()
                    {
                        that.selected_tasks(function(row,values){
                            filecxx_rpc.send("task_resume",{id:values.id,type:values.type})
                        });
                    }
                },
                stop:{
                    text:lang("stop"),
                    icon:"icons/24/stop.svg",
                    click:function()
                    {
                        that.selected_tasks(function(row,values){
                            filecxx_rpc.send("task_pause",{id:values.id,type:values.type})
                        });
                    }
                },
                rename:{
                    text:lang("rename") + " <span style='margin-left: 24px'>F2</span>",
                    icon:"icons/16/rename.svg",
                    click:function()
                    {
                        that.selected_tasks(function(row,values){
                            filecxx_wui.run_module("modules/tasks/rename.js","filecxx_task_rename",{
                                value:values.file_name,
                                task_attr:values
                            })
                            //filecxx_rpc.send("task_remove",{id:values.id,type:values.type})
                        });
                    }
                },
                move_to:{
                    text:lang("move_to"),
                    icon:"icons/16/move.svg",
                    enable:false
                },

                open_file:{
                    text:lang("open_file"),
                    icon:"icons/16/run.svg",
                    enable:false
                },
                open_directory:{
                    text:lang("open_directory"),
                    icon:"icons/16/directory.svg",
                    enable:false
                },

                remove:{
                    text:lang("delete"),
                    icon:"icons/24/delete.svg",
                    click:function(){
                        that.delete_selected_tasks();
                    }
                },
                refresh_address:{
                    text:lang("refresh_address"),
                    icon:"icons/16/refresh.svg",
                    enable:false
                },
                edit:{
                    text:lang("edit"),
                    icon:"icons/16/edit.svg",
                    click:function(){
                        that.edit_selected_tasks();
                    }
                },
                redownload:{
                    text:lang("redownload"),
                    icon:"icons/16/download.svg",
                    click:function(){
                        that.redownload_selected_tasks();
                    }
                },
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
            let actions  = this.actions;
            let add_task_act = function(name,type)
            {
                return filecxx_wui.module_action(name,"icons/24/add.svg","modules/tasks/add.js","filecxx_task_add",{
                    type:type
                })
            }
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
                        dropdown:Std.ui("Menu",
                        {
                            items:[
                                add_task_act("add","add_task"),
                                add_task_act("add_directory","add_directory"),
                                add_task_act("add_stream","add_stream"),
                            ]
                        }),
                        on:{
                            click:function(){
                                Std.loader.js("modules/tasks/add.js",function(){
                                    Std.ui("filecxx_task_add",{})
                                });
                            }
                        }
                    },

                    actions.open,
                    actions.start,
                    {ui:"sep"},
                    actions.stop,
                    actions.remove,

                    {ui:"sep"},

                    this.filter_
                ]
            })
        },

        init_grid:function()
        {
            let that    = this;
            let actions = this.actions;

            that.grid_ = Std.ui("Grid",{
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
                    {name:"connections",text:lang("connections"),width:80},
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
                            if(isNumber(data))
                            {
                                if(data === filecxx_rpc.task_states.State_Error && cell.row.data.data_value.values.error_text){
                                    data = lang(cell.row.data.data_value.values.error_text);
                                }else{
                                    data = lang(filecxx_rpc.task_state_texts[data]);
                                }
                            }
                            if(isString(data)){
                                cell.html(data);
                            }else{
                                return;
                            }
                            if(cell.row.data.color){
                                cell.row.color(cell.row.data.color)
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
                rowContextMenu: that.create_grid_contextmenu(),
                on:{
                    columnSortStart:function(column,type)
                    {
                        that.sorted_column_      = column.name();
                        that.sorted_column_type_ = type;
                    },
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
        },
        init_shortcuts:function()
        {
            let that = this;

            Std.dom(window).on("keydown",function(e)
            {
                switch(e.key)
                {
                case "a":
                    if(e.ctrlKey){
                        //that.grid_.selectRow(0);
                        //that.grid_.selectRange(0,0,that.grid_.rowCount(),that.grid_.columnCount());
                        //e.preventDefault();
                    }
                    break;
                case "F2":
                    that.actions.rename.click();
                    e.preventDefault();
                    break;
                case "Delete":
                    that.actions.remove.click();
                    break;
                }
            });
        },
    },
    protected:
    {
        /*
         * is folder
        */
        is_folder:function(values)
        {
            return (values.mode & filecxx_rpc.task_modes.Task_Mode_Directory) !== 0 || Boolean(values.files && values.files > 0);
        },
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
        create_grid_contextmenu()
        {
            let that     = this;
            let actions  = this.actions;
            let catalogs = function()
            {
                let list = [];

                for(let name in filecxx_wui.data.catalogs)
                {
                    list.push({
                        icon:"icons/16/directory.svg",
                        text: lang(name),
                        click: function(e){
                            that.set_selected_task_catalogs(name);
                            menu.hide()
                        }
                    });
                }
                return Std.ui("MenuItem",{
                    text:lang("catalogs"),
                    icon:"icons/16/directory.svg",
                    items:list
                });
            }
            let menu = Std.ui("Menu",{
                on:{
                    visible:function(val)
                    {
                        if(val === true)
                        {
                            if(that.grid_contextmenu_){
                                menu.remove(that.grid_contextmenu_)
                            }
                            that.grid_contextmenu_ = catalogs();
                            menu.append(that.grid_contextmenu_);
                        }
                    }
                },
                items:[
                    actions.start,
                    actions.stop,
                    {ui:"sep"},
                    actions.rename,
                    actions.move_to,
                    actions.remove,
                    {ui:"sep"},
                    actions.open_file,
                    actions.open_directory,
                    {ui:"sep"},
                    actions.redownload,
                    actions.refresh_address,
                    actions.edit,
                    {ui:"sep"},
                    {
                        width:210,
                        text:lang("copy"),
                        icon:"icons/16/copy.svg",
                        items:[
                            {
                                text:lang("name"),
                                icon:"icons/16/copy.svg",
                                click:function(){
                                    that.copy_selected_tasks_attr_field("file_name");
                                }
                            },
                            {
                                text:lang("address"),
                                icon:"icons/16/copy.svg",
                                click:function(){
                                    that.copy_selected_tasks_attr_field("uri","magnet");
                                }
                            },
                            {
                                text:"TODO",
                                icon:"icons/16/copy.svg",
                            },
                            {
                                text:"TODO",
                                icon:"icons/16/copy.svg",
                            }
                        ]
                    },
                    catalogs
                ]
            });
            return menu;
        },
        /*
         * erase task
        */
        erase_task:function(id)
        {
            let that = this;
            let confirming = that.tasks_confirming.get(id);

            if(confirming && confirming.dialog){
                confirming.dialog.on_dispose();
            }else{
                that.tasks_confirming.delete(id);
            }
            that.tasks_all.delete(id);
            that.tasks_active.delete(id);
        }
    },
    public:
    {
        /*
         * copy selected tasks attr field
        */
        copy_selected_tasks_attr_field:function(field,candidate)
        {
            let that = this;
            let text = "";

            that.selected_tasks(function(row)
            {
                let task = that.tasks_all.get(row.data_value.id);

                if(task)
                {
                    if(text.length > 0){
                        text += "\r\n";
                    }
                    text += task[field] || task[candidate] || "";
                }
            });
            copy_to_clipboard(text);
        },
        /*
         * set selected task catalogs
        */
        set_selected_task_catalogs:function(catalog_name)
        {
            let that = this;
            let rows = that.grid_.selectedRows(true);

            Std.each(rows,function(i,row)
            {
                filecxx_rpc.send("task_set_catalog",{
                    id:row.data_value.id,
                    type:row.data_value.values.type,
                    catalog:catalog_name
                });
                if(that.tasks_all.has(row.data_value.id)){
                    let task = that.tasks_all.get(row.data_value.id);
                    row.data_value.catalog = catalog_name;
                    task.catalog = catalog_name;
                }
            });
            that.grid_.updateContainer();
        },
        /*
         * selected tasks
        */
        selected_tasks:function(handler)
        {
            let rows = this.grid_.selectedRows(true);

            for(let i=0;i<rows.length;++i){
                handler(rows[i],rows[i].data_value.values);
            }
        },
        /*
         * sort tasks
        */
        sort_tasks:function()
        {
            let that = this;

            if(that.sorted_column_){
                that.grid_.sortColumn(that.sorted_column_,that.sorted_column_type_);
            }
        },
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
                that.sort_tasks();
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
            that.sort_tasks();
        },

        /*
         * remove task
        */
        rename_task:function(id,type,new_name)
        {
            filecxx_rpc.send("task_rename",{id:id, type:type, idx:-1, name: new_name});
        },
        /*
         * remove task
        */
        remove_task:function(id,type,delete_file)
        {
            let that = this;

            that.tasks_active.delete(id);
            that.tasks_all.delete(id);
            that.tasks_confirming.delete(id);

            filecxx_rpc.send("task_remove",{id:id, type:type, delete_file: delete_file});
        },

        /*
         * remove_confirming_task
        */
        remove_confirming_task:function(id)
        {
            this.tasks_confirming.delete(id);
        },
        /*
         * edit_selected_tasks
        */
        edit_selected_tasks:function()
        {
            let rows  = this.grid_.selectedRows(true);

            rows.each(function(i,row)
            {
                let values = row.data_value.values;
                let type   = values.type;

                filecxx_rpc.send("task_config",{"#":"task_edit", id:values.id, type:type});
            });
        },
        /*
         * delete_selected_tasks
        */
        delete_selected_tasks:function()
        {
            let rows  = this.grid_.selectedRows(true);
            let attrs = [];

            rows.each(function(i,row){
                attrs.push(row.data_value.values);
            });
            if(attrs.length > 0) {
                filecxx_wui.run_module("modules/tasks/deleting.js","filecxx_task_deleting",{task_attrs: attrs});
            }
        },
        /*
         * redownload_selected_tasks
        */
        redownload_selected_tasks:function()
        {
            let that = this;
            let grid = that.grid_;
            let rows = grid.selectedRows(true);

            rows.each(function(_,row)
            {
                let id     = row.data_value.id;
                let values = row.data_value.values;

                filecxx_rpc.send("task_redownload",{
                    id: id,
                    type: values.type,
                })
                that.tasks_active.set(id,{
                    id:id,
                    type:values.type,
                    state:values.state,
                    confirmed:false,
                    progress:values.progress
                });
                //tasks_active_.emplace(id,active_task_t{task.type,task.state,task.full_status,false,0});
            })
        },
        /*
         * update task
        */
        update_task:function(values)
        {
            let that = this;
            let grid = that.grid_;
            let task = that.tasks_all.get(values.id);

            if(!task){
                return false;
            }
            if(values.substate === filecxx_rpc.task_substates.Substate_Confirming){
                that.on_task_confirming(values.id,values.type,values);
                return true;
            }
            let confirming = that.tasks_confirming.get(values.id);

            if(confirming && confirming.dialog)
            {
                if(task.substate !== filecxx_rpc.task_substates.Substate_Confirming){
                    confirming.dialog.on_dispose();
                }
            }
            if(values.state !== task.state){
                that.on_task_state_change(values.state);
            }
            Std.extend(task,values);

            let row = grid.row(values.id + "");
            //values.error;
            if(row)
            {
                let owner = grid.row(values.id + "",true);
                row.color             = that.row_color(row.data_value.values.state);
                row.data_value.folder = that.is_folder(values);

                if(owner){
                    owner.update();
                }
            }
            return true;
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
            let grid   = that.grid_;
            let index  = 0;

            if(that.sorted_column_){
                index = grid.boundSearch(values[that.sorted_column_], that.sorted_column_,that.sorted_column_type_);
            }
            grid.insertRow({
                data_value: {
                    id:id,
                    folder:that.is_folder(values),
                    values:values
                },
                name: id + "",
                color: that.row_color(state),
                cells: values
            },index);
            //values.error;

            that.tasks_all.set(id,values);

            if(values.state < filecxx_rpc.task_states.State_Completed)
            {
                that.tasks_active.set(id,{
                    id:id,
                    type:type,
                    state:state,
                    confirmed:false,
                    progress:values.progress
                });
            }
            //that.on_task_state(values.state,id,grid.row(grid.rowCount() - 1));
        },
        /*
         * clear
        */
        clear:function()
        {
            let that = this;

            that.grid_.clearRows();
            that.tasks_all.clear();
            that.tasks_active.clear();
            that.tasks_confirming.clear();
            that.hidden_rows.clear();
        },

        ///------------------
        /*
         * on_task_state_change
        */
        on_task_state_change:function(state)
        {
            if(state === filecxx_rpc.task_states.State_Completed){
                filecxx_wui.play_mp3("sounds/transfer_completed.mp3");
            }else if(state === filecxx_rpc.task_states.State_Error){
                filecxx_wui.play_mp3("sounds/transfer_error.mp3");
            }
        },
        /*
         * task status
        */
        on_task_status:function(values)
        {
            if(!this.update_task(values)){
                this.add_task(values);
            }
        },
        /*
         * on_task_files
        */
        on_task_files:function(values)
        {
            let that       = this;
            let confirming = that.tasks_confirming.get(values.id);

            if(confirming && confirming.dialog)
            {
                if(values.type === filecxx_rpc.task_types.Task_Torrent){
                    confirming.dialog.update_files(values);
                }
            }else{
                //todo: update task grid files
            }
        },
        /*
         * on_task_confirming
        */
        on_task_confirming:function(id,task_type,attrs)
        {
            let that   = this;
            let active = that.tasks_active.get(id);

            if(active && active.confirmed){
                return;
            }
            let module_path  = "";
            let module_entry = "";

            switch(task_type)
            {
            case filecxx_rpc.task_types.Task_HTTP:
                if(that.tasks_confirming.has(id)){
                    return;
                }
                module_path  = ["modules/tasks/confirm_base.js","modules/tasks/confirm_http.js"]
                module_entry = "filecxx_task_confirm_http";
                break;
            case filecxx_rpc.task_types.Task_FTP:
                break;
            case filecxx_rpc.task_types.Task_Torrent:
                if(that.tasks_confirming.has(id)){
                    let task = that.tasks_confirming.get(id);
                    task.dialog && task.dialog.update(attrs);
                    return;
                }
                module_path  = ["modules/tasks/confirm_base.js","modules/tasks/confirm_torrent.js"]
                module_entry = "filecxx_task_confirm_torrent";
                break;
            case filecxx_rpc.task_types.Task_Ed2k:
                break;
            case filecxx_rpc.task_types.Task_Stream:
                if(that.tasks_confirming.has(id)){
                    let task = that.tasks_confirming.get(id);
                    task.dialog && task.dialog.update(attrs);
                    return;
                }
                module_path  = ["modules/tasks/confirm_base.js","modules/tasks/confirm_stream.js"]
                module_entry = "filecxx_task_confirm_stream";
                break;
            case filecxx_rpc.task_types.Task_SSH:
                break;
            default:
                console.assert(false,"data error");
            }
            if(!module_path){
                console.assert(false,"add_confirming_task: internal error");
                return;
            }
            that.tasks_confirming.set(id,{type: task_type,dialog: null});

            //loadFiles: ["xx","yy"], loadQueue: [["xx","yy"]]
            filecxx_wui.run_module([module_path],module_entry,
            {
                task_id: id,
                attrs: attrs,
                on:{
                    create:function(){
                        that.tasks_confirming.set(id,{type: task_type,dialog: this});
                    }
                }
            });
        },
        /*
         * on_task_confirmed
        */
        on_task_confirmed:function(id)
        {
            let that       = this;
            let active     = that.tasks_active.get(id);
            let confirming = that.tasks_confirming.get(id);

            if(active){
                active.confirmed = true;
            }
            if(confirming)
            {
                //filecxx_rpc.send("task_status",{id:id, type:active.type})

                if(confirming.dialog){
                    confirming.dialog.on_dispose();
                }
                that.tasks_confirming.delete(id);
            }
        },
        /*
         * on_task_renamed
        */
        on_task_renamed:function(values)
        {
            let that  = this;
            let tasks = that.tasks_all;
            let grid  = that.grid_;

            if(!tasks.has(values.id)){
                return;
            }
            let task = tasks.get(values.id);
            let row  = grid.row(values.id + "");

            task.file_name = values.file_name;

            if(row)
            {
                let owner = grid.row(values.id + "",true);

                if(owner){
                    owner.update();
                }
            }
        },
        /*
         * on_task_removed
        */
        on_task_removed:function(values)
        {
            let that = this;
            let grid = that.grid_;
            let row  = grid.row(values.id + "");

            that.erase_task(values.id);

            if(row){
                let index = grid.rowName2Index(values.id + "");
                grid.removeRow(index);
            }
        },
        /*
         * on interval
        */
        on_interval:function()
        {
            let that = this;

            that.tasks_confirming.forEach((task,id)=>
            {
                if(task.type === filecxx_rpc.task_types.Task_Torrent){
                    filecxx_rpc.send("task_status",{id:task.id, type:task.type})
                }
            });
            that.tasks_active.forEach((task)=>{
                filecxx_rpc.send("task_status",{id:task.id, type:task.type, extended:true})
            });
        }
    },
    main:function(that,opts)
    {
        that.tasks_all        = new Map;
        that.tasks_active     = new Map;
        that.tasks_confirming = new Map;
        that.hidden_rows  = [];

        that.init_layout();
        that.init_actions();

        that.init_filter();
        that.init_toolbar();

        that.init_grid();
        that.init_detailbar();
        that.init_tabs();
        that.init_shortcuts();
    }
})