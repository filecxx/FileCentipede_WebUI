Std.ui.module("filecxx_task_confirm_stream",
{
    parent:"filecxx_task_confirm_base",
    option:{
        width:750,
        height:550,
        title:lang("add_stream"),
        task_type: filecxx_rpc.task_types.Task_Stream,
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
        init_filesystem:function()
        {
            var that = this;

            that.files_option_ = {
                ui:"DataTable",
                valueType:"list",
                sizeHint:"label",
                toolbar:false,
                contextmenu:false,
                editable:false,
                rowCheckable: true,
                columns:{file_name: 220,resolution_size: 110,segments: 80,duration_length:120, codec:100,lang:120},
                on:{
                    cellUpdate:function(cell,data)
                    {
                        if(cell.name === "file_name"){
                            that.update_filename_icon(cell,data);
                        }
                    }
                }
            }
        },
        init_layout:function()
        {
            let that  = this;
            let opts  = that.opts;
            let files = opts.attrs.files;

            delete opts.attrs.files;

            var wizard = that.wizard_ = Std.ui.wizard(Std.extend({
                files: 0
            },opts.attrs));

            wizard.fields({
                attributes:["files","uri","page_url","file_name","catalog","save_path","proxy","proxy_mode"],
                settings:[
                    "connect_timeout","max_retry","max_connections","max_redirect","speed_limit_download","parallel",
                    "ignore_server_busy","auto_rename_file","auto_merge","video_audio_merge","no_task_record"
                ],
                cookie:["cookies"],
                headers:["user_agent","headers"],
                decryption:["base_url","key_data","key_mode","iv"],
                metadata:["metadata"]
            })
            wizard.options("*",{
                uri:{readOnly:true},
                files: that.files_option_,
                key_mode:"stream_key_mode",
                metadata:{ui:"TextEdit"}
            });
            let layout = wizard.layout("tabs",{});
            let grid   = wizard.get("attributes.files");

            if(isArray(files) && files.length > 0){
                that.load_files(grid,files,opts.attrs.preferred_files);
            }else{
                that.create_meta_loading(grid[0].parent());
            }
            that.layout(Std.ui("VBoxLayout",{
                ui:"VBoxLayout",
                items:[layout,that.widgets_.actions_buttons]
            }))
        }
    },
    protected:
    {
        load_files:function(grid,files,preferred_files)
        {
            let that = this;

            grid.value(files);

            if(isArray(preferred_files))
            {
                grid.row(function(i,row)
                {
                    if(preferred_files.has(row.data.value.idx)){
                        row.data.checked = true;
                    }
                });
            }
            if(that.widgets_.loading){
                that.widgets_.loading.remove();
                that.widgets_.loading = null;
            }
        },
        update_filename_icon:function(cell,data)
        {
            let row_value = cell.row.data.value;
            let file_type = row_value.file_type;
            let elem      = newDiv().html(data).className("file_name_").attr("title",data);
            let icon      = ["video-mp2t","video-mp4", "audio-mp3", "text-plain"][file_type];

            elem.css({
                paddingLeft:26,
                backgroundRepeat:"no-repeat",
                backgroundImage:`url("icons/mimetypes/24/${icon}.png")`
            })
            cell.html(elem);
        }
    },
    public:
    {
        on_download:function(values,later)
        {
            let that         = this;
            let id           = that.opts.task_id;
            let wizard       = that.wizard_;
            let grid         = wizard.get("attributes.files");
            let checked_rows = grid.checkedRows();
            let selected_ids = [];

            if(later){
                values["later"] = true;
            }
            for(let i=0;i<checked_rows.length;++i){
                selected_ids.push(checked_rows[i].value.idx);
            }
            delete values.files;
            values["selected_files"] = selected_ids;

            filecxx_rpc.send("task_confirm",Std.extend({id: id, type: this.opts.task_type},values));
            filecxx_wui.tasks.on_task_confirmed(id);
        },

        update:function(values)
        {
            if(!values.files || values.files.length === 0){
                return;
            }
            let that   = this;
            let wizard = that.wizard_;
            let grid   = wizard.get("attributes.files");

            if(grid.rowCount() === 0){
                that.load_files(grid,values.files,values.preferred_files);
            }
        }
    }
});