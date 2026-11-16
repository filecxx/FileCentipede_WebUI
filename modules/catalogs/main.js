Std.ui.module("filecxx_catalogs",
{
    parent:"List",
    option:{
        iconHeight:24,
        iconWidth:24,
        itemHeight:28,
        valueType:"list-value",
        value:null
    },
    initialize:
    {
        init_default_items:function()
        {
            this.create_default_items();
            this.select(0)
        },
        init_events:function()
        {
            let that = this;

            that.plugin("contextMenu",{
                items:[
                    {
                        text:lang("add"),
                        icon:"icons/24/add.svg",
                        click:function()
                        {
                            filecxx_wui.run_module("modules/catalogs/edit.js","filecxx_catalogs_edit",{
                                title:lang("add_catalog"),
                            })
                        }
                    },
                    {
                        text:lang("edit"),
                        icon:"icons/16/edit.svg",
                        click:function()
                        {
                            filecxx_wui.run_module("modules/catalogs/edit.js","filecxx_catalogs_edit",{
                                title:lang("edit"),
                            })
                        }
                    },
                    {
                        text:lang("delete"),
                        icon:"icons/16/delete.svg",
                        click:function()
                        {

                        }
                    }
                ]
            });
            that.on("itemSelected",index=> {
                that.selected_catalogs = that.items(index).value();
                filecxx_wui.tasks.filter("catalog",that.selected_catalogs,filecxx_wui.groups.selected_states_array);
            });
        }
    },
    protected:
    {
        create_default_items:function()
        {
            this.append({
                icon:"icons/24/all.svg",
                text:lang("all"),
                value:null
            });
        }
    },
    public:
    {
        load:function(items)
        {
            this.clear();
            this.create_default_items();

            for(let name in items)
            {
                //let value = items[name];
                this.append({
                    icon:"icons/24/catalog.svg",
                    text: name,
                    value: name
                });
            }
            this.select(0)
        }
    },
    main(that,opts)
    {
        that.selected_catalogs = null;
        that.init_default_items();
        that.init_events();
    }
});