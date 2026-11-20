Std.ui.module("filecxx_accel_servers",
{
    parent:"Window",
    option:{
        width:800,
        height:500,
        modal:true,
        maximizable:true,
        acceptEsc:true,
        title:lang("accel_servers"),
        titleIcon:"icons/16/rocket.svg",
    },
    extend:{
        destroy:function()
        {
            filecxx_wui.accel_servers = null;
        }
    },
    initialize:
    {
        init_layout:function()
        {
            var that = this;
            var tabs = Std.ui("TabPanel",{
                items:[{
                    button:{
                        name: "http_mirrors",
                        text: "HTTP " + lang("mirror_servers")
                    },
                    content: Std.ui("VBoxLayout",{
                        items:[that.widgets_.http_mirrors]
                    })
                }]
            });
            var layout = Std.ui("VBoxLayout",{
                items:[tabs]
            });
            that.widgets_.tabs = tabs;
            that.layout(layout);
        },
        init_http_mirrors:function()
        {
            let that  = this;
            let table = Std.ui("DataTable",{
                tableName: "HTTP " + lang("mirror_servers"),
                valueType:"list",
                icons:filecxx_wui.iconset.data_table,
                clearAlert:lang("action") + ": " + lang("clear"),
                duplicateAlert:"duplicated row",
                verifyValues:true,
                applyAdd:false,
                windowHeight: 400,
                defaultActions:["add","edit","remove"],
                columns:{name: 160,host: 160,mode:140,proxy:100,path:160},
                fields:{
                    name:"",
                    host:"",
                    mode:0,
                    proxy:0,
                    path:0,
                    servers:""
                },
                value: filecxx_wui.data.http_mirrors
            });

            table.on(
            {
                invalidValues:function(name,locale){
                    error_notify(lang("invalid") + ": " + locale);
                },
                wizard:function(type,wizard)
                {
                    wizard.options("*",{
                        host:{
                            placeHolder:"IP / ${domain}",
                            validator:function(str){
                                return str.length > 0;
                            }
                        },
                        mode:"mirrors_mode",
                        proxy:"mirrors_proxy",
                        path:"mirrors_path",
                        servers:{
                            ui:"TextEdit",
                            placeHolder: lang("http_mirrors_placeholder"),
                            validator:function(str){
                                return str.length > 0;
                            }
                        }
                    });
                },
                add:function(values)
                {
                    if(!values.name){
                        values.name = values.host;
                    }
                    filecxx_rpc.send("http_mirror_add",values);
                },
                edited:function(values){

                    filecxx_rpc.send("http_mirror_update",values);
                    filecxx_wui.data.http_mirrors.clear();
                    filecxx_wui.data.http_mirrors.merge(that.widgets_.http_mirrors.value());
                    //that.save_http_mirrors();
                },
                removed:function(rows)
                {
                    for(let i=0;i<rows.length;++i){
                        filecxx_rpc.send("http_mirror_remove",{
                            id:rows[i].value.id
                        })
                    }
                    filecxx_wui.data.http_mirrors.clear();
                    filecxx_wui.data.http_mirrors.merge(that.widgets_.http_mirrors.value());
                    //that.save_http_mirrors();
                },
                cellUpdate:function(cell,data)
                {
                    if(cell.name === "mode"){
                        cell.html(Std.ui.options.mirrors_mode.items[data])
                    }else if(cell.name === "proxy"){
                        cell.html(Std.ui.options.mirrors_proxy.items[data])
                    }else if(cell.name === "path"){
                        cell.html(Std.ui.options.mirrors_path.items[data])
                    }
                }
            });
            that.widgets_.http_mirrors = table;
            //console.log(filecxx_wui.data.http_mirrors)
        }
    },
    public:{
        /*
         * append
        */
        append:function(value)
        {
            var that = this;

            filecxx_wui.data.http_mirrors.push(value);
            that.widgets_.http_mirrors.appendRows([value]);
        }
    },
    main:function(that,opts)
    {
        filecxx_wui.accel_servers = that;

        that.layouts_ = {};
        that.widgets_ = {};

        that.init_http_mirrors();
        that.init_layout();
    }
});