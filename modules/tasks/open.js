Std.ui.module("filecxx_task_open",
{
    parent:"Window",
    option:{
        acceptEsc:true,
        width:220,
        height:110,
        title:lang("open"),
        max_file_size: 1024 * 1024,
    },
    public:
    {
        open_file:function()
        {
            let that  = this;
            let opts  = that.opts;
            let input = document.createElement('input');

            input.type          = 'file';
            input.accept        = '.m3u8, .mpd, .torrent';
            input.style.display = 'none';
            input.addEventListener('change',function(event)
            {
                const file = event.target.files[0];

                if(!file){
                    return;
                }
                //file.name;
                if(file.size > opts.max_file_size){
                    Std.ui("MessageBox").error(lang("file_too_large") + ": " + bytes_to_str(file.size) + " / " + bytes_to_str(opts.max_file_size));
                    that.close();
                    return;
                }
                const reader = new FileReader();

                reader.onload = function(e)
                {
                    const str    = e.target.result;
                    const base64 = str.split(',')[1];

                    filecxx_rpc.send("task_add_file",{
                        path:"/tmp/" + file.name,
                        meta_base64:base64
                    })
                    that.close();
                };
                reader.onerror = function(){
                    Std.ui("MessageBox").error(lang("read_file_error"));
                    that.close();
                };
                reader.readAsDataURL(file);
            });
            input.addEventListener('cancel', function(event) {
                that.close();
            });
            input.click();
        }
    },
    main:function(that,opts)
    {
        that.open_file();
    }
});