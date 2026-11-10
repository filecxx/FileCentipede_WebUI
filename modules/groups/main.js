Std.ui.module("filecxx_groups",
{
    parent:"List",
    option:{
        iconHeight:24,
        iconWidth:24,
        itemHeight:36,
        valueType:"list-value",
        value:null,
    },
    initialize:
    {
        init_default_items:function()
        {
            this.append([
                {
                    icon:"icons/24/all.svg",
                    text:lang("all"),
                    value:null
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
            ]);
            this.select(0)
        },
        init_events:function()
        {
            let that = this;

            that.plugin("contextMenu",{
                items:[]
            });
            that.on("itemSelected",index=>{
                that.selected_states_array = that.selected_states(that.items(index).value());
                filecxx_wui.tasks.filter("catalog",filecxx_wui.catalogs.selected_catalogs,that.selected_states_array);
            })
        }
    },
    protected:
    {
        selected_states:function(text)
        {
            const task_states = filecxx_rpc.task_states;

            if(text === "delay"){
                return [task_states.State_Later];
            }else if(text === "transferring"){
                return [task_states.State_Downloading_Metadata,task_states.State_Downloading,task_states.State_Uploading,task_states.State_Starting];
            }else if(text === "seeding"){
                return [task_states.State_Seeding];
            }else if(text === "stopped"){
                return [task_states.State_Stopped];
            }else if(text === "completed"){
                return [task_states.State_Completed];
            }else if(text === "failed"){
                return [task_states.State_Error];
            }else if(text === "queuing"){
                return [task_states.State_Queuing];
            }else{
                return null;
            }
        }
    },
    public:
    {
        load:function(items)
        {

        }
    },
    main(that,opts)
    {
        that.selected_states_array = null;
        that.init_default_items();
        that.init_events();
    }
});