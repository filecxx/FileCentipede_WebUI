Std.ui.module("filecxx_task_confirm_base",
{
    parent:"Window",
    option:{
        acceptEsc:true,
        maximizable:true,
        width:600,
        height:400,
        title:lang("task_add"),
        titleIcon:"icons/24/add.svg",
        task_id:null,
        task_type: filecxx_rpc.task_types.Task_HTTP,
        attrs:null
    },
    extend:
    {
        render:function()
        {
            filecxx_wui.play_mp3("sounds/event.mp3");
            this.init_layout();
        },
        destroy:function()
        {
            let id = this.opts.task_id;

            if(!this.confirmed_){
                filecxx_rpc.send("task_remove",{type:this.opts.task_type, id:id, delete_file:true})
            }
            filecxx_wui.tasks.remove_confirming_task(id);
        }
    },
    initialize:
    {
        init_action_buttons:function()
        {
            let that   = this;
            let cancel = {
                ui:"Button",
                text:lang("cancel"),
                click:function(){
                    that.close()
                }
            };
            let download_later = {
                ui:"Button",
                text:lang("download_later"),
                click:function()
                {
                    if(that.wizard_.valid()){
                        that.on_download(that.wizard_.values(),true);
                    }
                }
            };
            let download_now = {
                ui:"Button",
                text:lang("download_now"),
                click:function()
                {
                    if(that.wizard_.valid()){
                        that.on_download(that.wizard_.values());
                    }
                }
            };
            that.widgets_.actions_buttons = {
                ui:"HBoxLayout",
                items:[{ui:"stretch",level:3}, cancel, download_later,download_now]
            };
        },
    },
    protected:
    {
        create_meta_loading: function(renderTo)
        {
            let that = this;

            return that.widgets_.loading = Std.ui("Image",{
                src:"images/loading/clock.gif",
                renderTo:renderTo,
                css:{position:"absolute",zIndex:++Std.ui.status.zIndex,width:64,height:72}
            });
        },
        create_cell_model:function(grid)
        {
            var that = this;

            grid.cellModel("file_name",
            {
                update:function(cell,data)
                {
                    let suffix = extract_filename_suffix(data);
                    let elem   = newDiv().html(data).className("file_name_").attr("title",data);
                    let icon   = "unknown";

                    if(suffix in filecxx_mime_filenames){
                        icon = filecxx_mime_filenames[suffix];
                    }
                    elem.css({
                        paddingLeft:26,
                        backgroundRepeat:"no-repeat",
                        backgroundImage:`url("icons/mimetypes/24/${icon}.png")`
                    })
                    cell.html(elem);
                }
            })
        }
    },
    public:
    {
        on_dispose:function()
        {
            let that = this;

            that.confirmed_ = true;
            that.close();
        },
        on_download:function(values,later)
        {
            let id = this.opts.task_id;

            if(later){
                values["later"] = true;
            }
            delete values.files;

            filecxx_rpc.send("task_confirm",Std.extend({id: id, type: this.opts.task_type},values));
            filecxx_wui.tasks.on_task_confirmed(id);
        }
    },
    main:function(that,opts)
    {
        that.confirmed_ = false;
        that.widgets_   = {};
        that.init_filesystem();
        that.init_action_buttons();
    }
});
