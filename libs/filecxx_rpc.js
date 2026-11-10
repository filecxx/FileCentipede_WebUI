/*
 * step1: connect
 * step2: send auth, {"@":"wsc",username:"xxxx",password:"****"}
 * step3: receive auth message, check json.state === "success"
 * step4: receive real messages from the backend
*/

var filecxx_rpc =
{
    version: 1.0,

    ///-----------------
    config:{
        host:"",
        port:10111,
        ssl:false,
        username:"",
        password:"",
    },
    on_open:null,
    on_connect:null,
    on_close:null,
    on_message:null,
    on_error:null,

    //--------private
    timer_:null,
    websocket_:null,
    established_:false,


    //-----------------
    is_established:function(){
        return this.established_;
    },


    //-----------------
    send:function(message_type,json)
    {
        if(this.websocket_ && this.established_)
        {
            if(!json){
                json = {};
            }
            json["@"] = message_type;
            this.websocket_.send(JSON.stringify(json));
        }
    },
    connect:function()
    {
        let that     = this;
        let protocol = that.config.ssl ? "wss" : "ws";
        let url      =  protocol + '://' + that.config.host + ":" + that.config.port + "/wsc";

        that.websocket_ = new WebSocket(url);
        that.websocket_.binaryType = 'arraybuffer';
        that.websocket_.onopen = (event) =>
        {
            clearTimeout(that.timer_);
            that.timer_  = null;
            that.on_open && that.on_open();

            //step2
            that.websocket_.send(JSON.stringify({"@":"wsc", "username":that.config.username, "password":that.config.password}));
            that.websocket_.onmessage = (event)=>
            {
                if(event.data instanceof ArrayBuffer){
                    console.assert(false);
                }else if(!that.established_) //step3
                {
                    let json = JSON.parse(event.data);

                    if(json["@"] !== "wsc"){
                        that.close(); //invalid message
                    }else if(json.state === "success"){
                        that.established_ = true;
                        that.on_connect && that.on_connect(event.data);
                    }else if(json.state === "error"){
                        that.on_error && that.on_error(json.error);
                    }else{
                        that.close(); //invalid message
                    }
                }else{
                    that.on_message && that.on_message(JSON.parse(event.data));
                }
            };
        };
        that.websocket_.onerror = (error) =>
        {
            that.established_ = false;
            that.websocket_.close();
        };
        that.websocket_.onclose = (event) =>
        {
            that.established_ = false;
            that.websocket_   = null;

            clearTimeout(that.timer_);
            that.timer_  = null;
            that.on_close && that.on_close();
        };
        that.timer_ = setTimeout(function(){
            that.close();
        },1500);
    },
    close:function()
    {
        let that = this;

        if(that.websocket_){
            that.websocket_.close();
        }
    },

    ///-----------------------------
    task_modes:
    {
        Task_Mode_Encrypted_URI:   1 << 0,
        Task_Mode_Custom_Protocol: 1 << 1,
        Task_Mode_Upload:          1 << 2,
        Task_Mode_Has_Meta:        1 << 3,
        Task_Mode_Temp:            1 << 4,
        Task_Mode_Internal:        1 << 5,
        Task_Mode_Upgrade:         1 << 6,
        Task_Mode_Filesystem:      1 << 7,
        Task_Mode_Directory:       1 << 8
    },
    task_states:
    {
        State_Invalid               : 0,
        State_Later                 : 1,
        State_Queuing               : 2,
        State_Restoring             : 3,
        State_Starting              : 4,
        State_Resuming              : 5,
        State_Checking              : 6,
        State_Downloading_Metadata  : 7,
        State_Downloading           : 8,
        State_Uploading             : 9,
        State_Merging               : 10,
        State_Stopping              : 11,
        State_Removing              : 12,
        State_Restarting            : 13,
        State_Seeding               : 14,
        State_Stopped               : 15,
        State_Completed             : 16,
        State_Error                 : 17,
        State_Completing            : 18,
        State_Waiting				: 19,

        State_Size                  : 20
    },
    task_substates:
    {
        Substate_None                : 0,
        Substate_Confirming          : 1,
        Substate_Deleting            : 2,
        Substate_Deleting_File       : 3,
        Substate_Moving              : 4,
        Substate_Renaming            : 5,
        Substate_Renaming_Directory  : 6,
        Substate_Redownloading       : 7
    },

    task_state_texts: [
        "invalid",
        "download_later",
        "queuing",
        "restoring",
        "starting",
        "resuming",
        "checking",
        "downloading_metadata",
        "downloading",
        "uploading",
        "merging",
        "stopping",
        "removing",
        "restarting",
        "seeding",
        "stopped",
        "completed",
        "error",
        "completing",
        "waiting"
    ]
};
