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

            that.on("itemClick",val=> {
                that.selected_catalogs = val.value();
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