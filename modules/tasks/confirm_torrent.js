Std.ui.module("filecxx_task_confirm_torrent",
{
    parent:"filecxx_task_confirm_base",
    option:{
        width:700,
        height:500,
        title:lang("add_task"),
        task_type: filecxx_rpc.task_types.Task_Torrent,
    },
    extend:{
        render:function()
        {
            let loading = this.widgets_.loading;

            if(loading){
                loading.move("central");
            }
        }
    },
    initialize:
    {
        init_filesystem()
        {
            var that = this;

            this.files_option_ = {
                ui:"Grid",
                verticalLine:true,
                horizontalLine:true,
                columnResizable:true,
                stripeRows:true,
                rowCheckable: true,
                selectionMode:"row",
                columns:[
                    {
                        name:"file_name",
                        text:lang("file_name"),
                        width:460,
                        cellModel:"file_name"
                    },
                    {
                        name:"file_size",
                        text:lang("size"),
                        width:120
                    }
                ]
            };
        },
        init_layout()
        {
            let that   = this;
            let opts   = that.opts;
            var wizard = that.wizard_ = Std.ui.wizard(Std.extend({},opts.attrs));

            wizard.fields({
                attributes:[
                    "files","auto_rename_file","sequential",
                    "max_connections","speed_limit_upload","speed_limit_download",
                    "catalog","file_name","save_path"
                ],
                information:["torrent_comment", "torrent_creator", "torrent_creation_date", "torrent_name", "hash"]
            })
            wizard.options("*",{
                files: that.files_option_,
                torrent_comment:{ui:"TextEdit",readOnly:true},
                torrent_creator:{readOnly:true},
                torrent_creation_date:{readOnly:true},
                torrent_name:{readOnly:true},
                hash:{readOnly:true},
            });
            let layout = wizard.layout("tabs",{});
            let grid   = wizard.get("attributes.files");

            that.create_meta_loading(grid[0].parent());
            that.create_cell_model(grid);
            that.layout(Std.ui("VBoxLayout",{
                ui:"VBoxLayout",
                items:[layout,that.widgets_.actions_buttons]
            }))
            that.update(opts.attrs);
        }
    },
    public:
    {
        on_download:function(values,later)
        {
            let that   = this;
            let id     = that.opts.task_id;
            let wizard = that.wizard_;
            let grid   = wizard.get("attributes.files");

            if(later){
                values["later"] = true;
            }
            if(!that.single_file_)
            {
                grid.row(function(i,row)
                {
                    filecxx_rpc.send("task_files_enable",{
                        type: that.opts.task_type,
                        id: id,
                        idx: row.data.value ? row.data.value.idx : 0,
                        enable: row.data.checked
                    });
                });
            }
            filecxx_rpc.send("task_confirm",Std.extend({id: id, type: that.opts.task_type},values));
            filecxx_wui.tasks.on_task_confirmed(id);
        },


        query_files:function(id)
        {
            filecxx_rpc.send("task_files",{
                type: filecxx_rpc.task_types.Task_Torrent,
                id: id,
                offset: 0,
                size: 1000
            });
        },
        load_files:function(grid,files)
        {
            let that = this;

            files.each(function(i,value){
                grid.appendRow({
                    checked:value.priority !== 0,
                    cells: [value.file_name,bytes_to_str(value.file_size)],
                    value: value
                })
            });
            grid.row(function(i,row) {
                row.data.checked = true;
            });

            if(that.widgets_.loading){
                that.widgets_.loading.remove();
                that.widgets_.loading = null;
            }
            that.files_loaded_ = true;
        },
        update:function(attrs)
        {
            let that = this;

            if(that.meta_loaded_)
            {
                if(!that.files_loaded_){
                    that.query_files();
                }
                return;
            }
            if(attrs.torrent_ready)
            {
                if(attrs.state > filecxx_rpc.task_states.State_Downloading_Metadata)
                {
                    if(that.widgets_.loading){
                        that.widgets_.loading.remove();
                        that.widgets_.loading = null;
                    }
                    if(attrs.files === 0)
                    {
                        let grid = that.wizard_.get("attributes.files");
                        grid.rowCheckable(false);

                        that.load_files(grid,[{idx:0, file_name:attrs.torrent_name, file_size:attrs.file_size}]);
                        that.single_file_ = true;
                    }else{
                        that.query_files(attrs.id);
                    }
                    that.meta_loaded_ = true;
                }
                that.wizard_.values(attrs);
            }else{
                that.query_files(attrs.id);
            }
        },
        update_files:function(values)
        {
            let that   = this;
            let total  = values.total;  //total files from the torrent
            let offset = values.offset; //current page offset
            let size   = values.size;   //current page file count
            let items  = values.items;

            if(!items || items.length === 0 || that.files_loaded_){
                return;
            }
            that.load_files(that.wizard_.get("attributes.files"),items);
        }
    },
    main(that,opts)
    {
        that.single_file_  = false;
        that.meta_loaded_  = false;
        that.files_loaded_ = false;
    }
});