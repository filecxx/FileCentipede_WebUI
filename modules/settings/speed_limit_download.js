Std.ui.module("filecxx_speed_limit_download",
{
    parent:"Window",
    option:{
        width:500,
        height:250,
        modal:true,
        acceptEsc:true,
        title:lang("speed_limit_download"),
    },
    extend:{
        destroy:function()
        {
            var that = this;

            if(that.timer_interval_ !== -1){
                clearInterval(that.timer_interval_);
                that.timer_interval_ = -1;
            }
            if(that.timer_save_ !== -1){
                clearInterval(that.timer_save_);
                that.timer_save_ = -1;
            }
        }
    },
    initialize:
    {
        init_layout:function()
        {
            var that   = this;
            var rows   = [];
            var items  = [];
            var create = function(name)
            {
                var key   = "speed_limit_"+name+"_download";
                var value = filecxx_wui.data.configs.network[key];
                var label = Std.ui("Label",{
                    text:name + ": "
                });

                var slider = Std.ui("HSlider",{
                    min:0,
                    max:1024 * 100,
                    text:"%d KB/s",
                    value:value,
                    on:{
                        change:function(val){
                            speed.value(val)
                        }
                    }
                });
                var speed = Std.ui("SpinBox",{
                    type:"uint",
                    width:120,
                    fixedWidth:true,
                    label:"KB/s",
                    value:value,
                    on:{
                        change:function(val){
                            speed.label(val > 0 ? "KB/s" : lang("unlimited"))
                            that.save();
                        }
                    }
                });
                rows[name] = speed;

                items.push(label);
                items.push(slider);
                items.push(speed);
            };

            ["http","ftp","ssh","torrent","ed2k"].each(function(i,key){
                create(key);
            })

            that.rows_ = rows;
            that.layout({
                ui:"GridLayout",
                columnCount:3,
                columnSpacing:12,
                rowCount:5,
                items:items
            });
        },
        init_timer:function()
        {
            var that = this;

            that.timer_interval_ = setInterval(function(){

            });
        }
    },
    private:{
        timer_interval:-1,
        timer_save: -1
    },

    public:
    {
        save:function()
        {
            var that = this;

            if(that.timer_save_ !== -1){
                clearTimeout(that.timer_save_);
            }
            that.timer_save_ = setTimeout(function()
            {
                ["http","ftp","ssh","torrent","ed2k"].each(function(i,name){
                    var key = "speed_limit_"+name+"_download";
                    filecxx_wui.data.configs.network[key] =  that.rows_[name].value();
                })
                filecxx_rpc.send("config_update",{
                    name:"network",
                    config:filecxx_wui.data.configs.network
                })
                that.timer_save_ = -1;
            },500)
        }
    },
    main:function(that,opts)
    {
        that.init_layout();
    }
});