Std.ui.module("filecxx_filters",
{
    parent:"Window",
    option:{
        width:600,
        height:400,
        modal:true,
        maximizable:true,
        acceptEsc:true,
        title:lang("filter"),
        titleIcon:"icons/16/filter.svg",
    },
    initialize:
    {
        init_layout:function()
        {
            var that = this;
            var tabs = Std.ui("TabPanel",{
                items:[{
                    button:{
                        name: "rule",
                        text: lang("rule")
                    },
                    content: Std.ui("VBoxLayout",{
                        items:[that.widgets_.rule]
                    })
                },{
                    button:{
                        name: "file_names",
                        text: lang("file_names")
                    },
                    content: Std.ui("VBoxLayout",{
                        items:[that.widgets_.file_names]
                    })
                },{
                    button:{
                        name: "help",
                        text: lang("help")
                    },
                    content: `<div style="padding: 12px">${lang("setting_filter_help_")}</div>`
                }]
            });


            let buttons = Std.ui("HBoxLayout",
            {
                items:[
                    {ui:"stretch",level:3},
                    {
                        ui:"Button",
                        text:lang("cancel"),
                        click:function(){
                            that.close();
                        }
                    },
                    {
                        ui:"Button",
                        text:lang("save"),
                        click:function(){
                            that.save_rules();
                            that.close();
                        }
                    }
                ]
            })

            var layout = Std.ui("VBoxLayout",{
                items:[tabs,buttons]
            });
            that.widgets_.tabs = tabs;
            that.layout(layout);
        },
        init_rules:function()
        {
            let that  = this;
            let table = Std.ui("DataTable",{
                tableName: "rules",
                valueType:"list",
                icons:filecxx_wui.iconset.data_table,
                clearAlert:lang("action") + ": " + lang("clear"),
                duplicateAlert:"duplicated row",
                verifyValues:true,
                windowHeight: 300,
                defaultActions:["add","edit","remove"],
                columns:{name: 100,rule: 400},
                fields:{
                    name:"",
                    rule:""
                },
                value: filecxx_wui.data.configs.filters.torrent_files
            });

            table.on(
            {
                invalidValues:function(name,locale){
                    error_notify(lang("invalid") + ": " + locale);
                },
                wizard:function(type,wizard)
                {
                    wizard.options("*",{
                        name:{placeHolder: lang("filter_rule_name_placeholder_")},
                        rule:{ui:"TextEdit",placeHolder:lang("filter_rule_placeholder_")}
                    });
                },
                added:function(value){
                    filecxx_wui.data.configs.filters.torrent_files.push(values);
                    that.save_rules();
                },
                edited:function(value){
                    filecxx_wui.data.configs.filters.torrent_files.clear();
                    filecxx_wui.data.configs.filters.torrent_files.merge(that.widgets_.rule.value());
                    that.save_rules();
                },
                removed:function(rows)
                {
                    filecxx_wui.data.configs.filters.torrent_files.clear();
                    filecxx_wui.data.configs.filters.torrent_files.merge(that.widgets_.rule.value());
                    that.save_rules();
                }
            })
            that.widgets_.rule = table;
            //console.log(filecxx_wui.data.configs.filters)
        },
        init_filenames:function()
        {
            let that = this;

            that.widgets_.file_names = Std.ui("TextEdit",{
                placeHolder:"${filter_file_names_placeholder_}",
                value:filecxx_wui.data.configs.filters.file_names,
                on:{
                    change:function(val){
                        filecxx_wui.data.configs.filters.file_names = val;
                    }
                }
            });
        }
    },
    public:
    {
        save_rules:function()
        {
            filecxx_rpc.send("config_update",{
                name:"filters",
                config:filecxx_wui.data.configs.filters
            })
        }
    },
    main:function(that,opts)
    {
        that.layouts_ = {};
        that.widgets_ = {};

        that.init_rules();
        that.init_filenames();
        that.init_layout();
    }
});