Std.ui.module("filecxx_statistics",
{
    parent:"Window",
    option:{
        width:420,
        height:510,
        modal:true,
        maximizable:true,
        acceptEsc:true,
        valueType:"map",
        title:lang("statistics"),
        titleIcon:"icons/16/statistics.svg",
    },
    extend:{
        destroy:function()
        {
            filecxx_wui.statistics = null;
        }
    },
    initialize:
    {
        init_widgets:function()
        {
            var that    = this;
            var widgets = that.widgets_;

            widgets.grid = Std.ui("Grid",{
                columnResizable:true,
                columns:[
                    {
                        name:"key",
                        width:240,
                        editable:false,
                        text:Std.ui.wizard.locale("key")
                    },
                    {
                        name:"value",
                        width:140,
                        cellModel:"value",
                        text:Std.ui.wizard.locale("value")
                    },
                ]
            });
        },
        init_layout()
        {
            this.layout(Std.ui("VBoxLayout",{
                ui:"VBoxLayout",
                items:[this.widgets_.grid]
            }))
        }
    },
    public:{
        on_data:function(value)
        {
            let that = this;

            for(var name in value)
            {
                let text = "";

                if(name.endsWith("_bytes")){
                    text = bytes_to_str(value[name]);
                }else{
                    text = value[name];
                }
                that.widgets_.grid.appendRow({
                    name: name,
                    cells: [Std.ui.wizard.locale(name),text]
                })
            }
        }
    },
    main:function(that,opts)
    {
        that.widgets_ = {};
        that.init_widgets();
        that.init_layout();

        filecxx_wui.statistics = this;
        filecxx_rpc.send("statistics")
    }
});