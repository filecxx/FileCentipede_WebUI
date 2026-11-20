Std.ui.module("filecxx_proxies",
{
    parent:"Window",
    option:{
        width:720,
        height:450,
        modal:true,
        maximizable:true,
        acceptEsc:true,
        title:lang("proxies"),
        titleIcon:"icons/16/proxy.svg",
    },
    initialize:
    {
        init_layout:function()
        {
            var that = this;
            var tabs = Std.ui("TabPanel",{
                items:[{
                    button:{
                        name: "proxies",
                        text: lang("proxies")
                    },
                    content: Std.ui("VBoxLayout",{
                        items:[that.widgets_.proxies]
                    })
                }]
            });
            var layout = Std.ui("VBoxLayout",{
                items:[tabs]
            });
            that.widgets_.tabs = tabs;
            that.layout(layout);
        },
        init_proxies:function()
        {
            let that  = this;
            let table = Std.ui("DataTable",{
                tableName: "proxies",
                valueType:"map",
                valueKey:"name",
                icons:filecxx_wui.iconset.data_table,
                clearAlert:lang("action") + ": " + lang("clear"),
                duplicateAlert:"duplicated row",
                verifyValues:true,
                windowHeight: 300,
                defaultActions:["add","edit","remove"],
                columns:{name: 100,type: 80,host: 120, port:60, user:120, pass:120},
                fields:{
                    type:"SOCKS5",
                    name:"",
                    host:"127.0.0.1",
                    port:1080,
                    user:"",
                    pass:""
                },
                value: filecxx_wui.data.proxies
            });

            table.on(
            {
                invalidValues:function(name,locale){
                    error_notify(lang("invalid") + ": " + locale);
                },
                wizard:function(type,wizard)
                {
                    wizard.options("*",{
                        type:"proxy_type",
                        pass:"password"
                    });
                },
                add:function(values){
                    filecxx_wui.data.proxies[values.name] = values;
                    filecxx_rpc.send("proxy_add",values);
                },
                edit:function(values){
                    filecxx_wui.data.proxies[values.name] = values;
                    filecxx_rpc.send("proxy_update",values);
                },
                remove:function(indexes)
                {
                    indexes.each(function(i,row){
                        delete filecxx_wui.data.proxies[row.name];
                        filecxx_rpc.send("proxy_remove",{name: row.name});
                    });
                }
            })
            that.widgets_.proxies = table;
            //console.log(filecxx_wui.data.proxies)
        }
    },
    main:function(that,opts)
    {
        that.layouts_ = {};
        that.widgets_ = {};

        that.init_proxies();
        that.init_layout();
    }
});