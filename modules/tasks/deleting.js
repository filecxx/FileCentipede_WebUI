Std.ui.module("filecxx_task_deleting",
{
    parent:"MessageBox",
    option:{
        type:"question",
        title:lang("delete_task"),
        text:lang("delete_task_alert"),
        buttons:{
            delete_task:lang("delete_task"),
            delete_task_and_file:lang("delete_task_and_file"),
            cancel:lang("cancel"),
        },
        task_attrs:[],
        on:{
            buttonClick:function(name)
            {
                if(name === "cancel"){
                    return;
                }
                this.opts.task_attrs.each(function(i,attr)
                {
                    filecxx_rpc.send("task_remove",{
                        id: attr.id,
                        type: attr.type,
                        delete_file: name === "delete_task_and_file"
                    })
                });
            }
        }
    }
});