Std.ui.module("filecxx_catalogs_edit",
{
    parent:"Window",
    option:{
        value:null,
        width:520,
        height:390,
        acceptEsc:true,
        maximizable:true,
        catalog:""
    },
    initialize:
    {
        init_layout:function()
        {
            var that   = this;
            var opts   = that.opts;
            var wizard = that.wizard_ = Std.ui.wizard(opts.value || {
                name: "",
                path: filecxx_wui.data.configs.general.default_save_path,
                icon: "",
                matches_creation_time: false,
                creation_time_begin: new Date(),
                creation_time_end: new Date(Date.now() + 24 * 60 * 60 * 1000),
                matches_file_extension: true,
                file_extensions:""
            });
            wizard.fields([
                "name","path","icon","matches_creation_time","creation_time_begin","creation_time_end",
                "matches_file_extension","file_extensions"
            ])
            wizard.options("*",{
                name:{
                    validator:function(str){
                        return str.length > 0;
                    }
                },
                creation_time_begin:"date_time",
                creation_time_end:"date_time",
                file_extensions:{ui:"TextEdit"}
            });
            wizard.adorn({
                matches_file_extension:{
                    ui:"ComboBox",
                    level:1,
                    items: that.file_extensions_adorn(),
                    valueType:"item",
                    on:{
                        change:function(){
                            let edit = wizard.get("file_extensions");
                            edit.value(this.value());
                        }
                    }
                }
            });
            var layout = wizard.layout({
                padding:6,
                maxStretchableColumns:1,
            });
            that.layout({
                ui:"VBoxLayout",
                items:[layout,that.create_action_buttons()]
            })
        },
        init_events:function()
        {
            let that = this;

        }
    },
    protected:
    {
        create_action_buttons:function()
        {
            let that = this;
            let opts = that.opts;
            let cancel = {
                ui:"Button",
                text:lang("cancel"),
                click:function(){
                    that.close()
                }
            };
            let save = {
                ui:"Button",
                text:lang("save"),
                click:function()
                {
                    if(!that.wizard_.valid()){
                        return;
                    }
                    let values = that.wizard_.values();

                    if(opts.value){
                        that.on_save(values);
                    }else{
                        that.on_add(values);
                    }
                    that.close();
                }
            };
            return {
                ui:"HBoxLayout",
                items:[{ui:"stretch",level:3}, cancel, save]
            }
        },
        file_extensions_adorn:function()
        {
            return [
                {
                    text:lang("none"),
                    value:""
                },{
                    text:lang("video"),
                    value:"mkv,msp,m3u8,swf,3gpp,3gp,avi,f4f,f4m,flv,ogg,mp4,mpeg,mov,webm,mpg4,asf,wmv,rmvb,rm,ts,m4s"
                },{
                    text:lang("audio"),
                    value:"mp3,m4a,wav,wma,aac,cda"
                },{
                    text:lang("archive"),
                    value:"0,000,001,7z,ace,ain,alz,apz,ar,arc,cad,cab,gz,tar,zip,rar,tar,pax,cpio,xar,lha,mtree,iso,xz,lzip,lzma,bzip2,uue,jar,z,lzh,xpi"
                },{
                    text:lang("document"),
                    value:"chm,doc,docx,docm,dotx,dotm,xls,xlsx,xlsm,xltx,xltm,xlam,ppt,pptx,pptm,potm,ppam,ppsx,ppsm,odt,pdf,odp,ods,tsv,wps,md,txt"
                },{
                    text:lang("torrent"),
                    value:"torrent"
                }
            ]
        }
    },
    public:
    {
        on_add:function(values)
        {
            filecxx_rpc.send("catalog_add",values);
        },
        on_save:function(values)
        {
            filecxx_rpc.send("catalog_update",Std.extend({old_name:this.opts.catalog},values));
        }
    },
    main(that,opts)
    {
        that.init_layout();
    }
});