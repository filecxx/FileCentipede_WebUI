Std.ui.module("filecxx_task_rename",
{
    parent:"MessageBox",
    option:{
        title:lang("rename"),
        text:lang("file_name"),
        inputWidth:300,
        inputHeight:26,
        inputType:"LineEdit",
        buttons:"cancel ok",
        task_attr:null,
        on:{
            ok:function()
            {
                var value     = this.value();
                var task_attr = this.opts.task_attr;

                if(value.length > 0 && task_attr)
                {
                    filecxx_rpc.send("task_rename",{
                        type:task_attr.type,
                        id:task_attr.id,
                        idx:-1,
                        name:value
                    })
                }
            }
        }
    }
});