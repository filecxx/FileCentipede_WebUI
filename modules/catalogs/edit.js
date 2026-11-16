Std.ui.module("filecxx_catalogs_edit",
{
    parent:"Window",
    option:{
        value:null,
        width:520,
        height:360,
        acceptEsc:true,
        maximizable:true,
    },
    initialize:
    {
        init_layout:function()
        {
            var that   = this;
            var opts   = that.opts;
            var wizard = Std.ui.wizard(opts.value || {
                name: "",
                path: "",
                icon: "",
                matches_creation_time: false,
                creation_time_begin: new Date(),
                creation_time_end: new Date(),
                matches_file_extension: false,
                file_extensions:""
            });
            wizard.options("*",{
                // host: {width:120},
                file_extensions:{ui:"TextEdit"},
                creation_time_begin:{value:""},
                creation_time_end:{value:""}
            });

            var layout = wizard.layout({
                padding:6,
                maxStretchableColumns:1,
            });
            that.wizard_ = wizard;
            that.layout(layout)
        },
        init_events:function()
        {
            let that = this;

        }
    },
    protected:
    {

    },
    public:
    {

    },
    main(that,opts)
    {
        that.init_layout();
    }
});