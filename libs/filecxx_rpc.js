/*
 * [websocket RPC]
 * step1: connect
 * step2: send auth, {"@":"wsc",username:"xxxx",password:"****"}
 * step3: receive auth message, check json.state === "success"
 * step4: receive real messages from the backend
 *
 * [HTTP task push & query]
 * add task: http_task_push
 * query task status: http_task_query
 *
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
    on_open:null,    //function()
    on_connect:null, //function(object)
    on_close:null,   //function()
    on_message:null, //function(object)
    on_error:null,   //function(string)

    //--------private
    connect_timeout_: 3000, //ms
    timer_:null,
    websocket_:null,
    established_:false,


    //-----------is established
    is_established:function(){
        return this.established_;
    },

    //-----------connect
    connect:function()
    {
        let that = this;
        let url  = (that.config.ssl ? "wss" : "ws") + '://' + (that.config.host || "localhost") + ":" + that.config.port + "/wsc";

        try{
            that.websocket_ = new WebSocket(url);
        }catch(e){
            that.on_error && that.on_error("An error message from the browser: " + e.message);
            return;
        }

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
                }else if(event.data.length > 0){
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
        },that.connect_timeout_);
    },

    //-----------close
    close:function()
    {
        if(this.websocket_){
            this.websocket_.close();
        }
    },

    //-----------send message
    send:function(message_type,json)
    {
        if(this.websocket_ && this.established_)
        {
            let data = {};

            if(json && typeof(json) === "object")
            {
                for(var name in json){
                    data[name] = json[name];
                }
            }
            data["@"] = message_type;
            this.websocket_.send(JSON.stringify(data));
        }
    },

    //-----------task type to number or string
    task_type:function(type)
    {
        let types = this.task_types;

        if(typeof(type) === "number")
        {
            if(type < types.Task_Types_Size){
                return this.task_type_texts[type];
            }
        }else if(typeof(type) === "string")
        {
            switch(type)
            {
            case "http":
                return types.Task_HTTP;
            case "ftp":
                return types.Task_FTP;
            case "torrent":
                return types.Task_Torrent;
            case "ed2k":
                return types.Task_Ed2k;
            case "stream":
                return types.Task_Stream;
            case "ssh":
                return types.Task_SSH;
            }
        }
        return null;
    },


    //-----------http fetch
    http_fetch:function(body,callback)
    {
        const config     = this.config;
        const url        = (config.ssl ? "https" : "http") + "://" + (config.host || "localhost") + ":" + config.port + "/request";
        const controller = new AbortController();
        const id         = setTimeout(() => controller.abort({message:"timeout"}), this.connect_timeout_ || 3000);
        const headers    = {
            authorization: (function(){
                const str = Array.from(new TextEncoder().encode(config.username + ":" + config.password),(byte) => String.fromCodePoint(byte)).join("");
                return "Basic " + btoa(str);
            })()
        };

        fetch(url,{signal: controller.signal, headers: headers, method: "FILEC", body:body}).then(function(response)
        {
            if(response.status !== 200){
                callback && callback({error:8,error_text:"response_code_error",response_code:response.status});
            }
            clearTimeout(id);
            return response.text();
        }).then(data =>{
            callback(data);
        }).catch(function(e){
            clearTimeout(id);
            callback && callback({error:121,error_text:e.message || e.name || "error"});
        });
    },


    //-----------http task push
    http_task_push:function(type,options,callback)
    {
        let values = {};

        if(typeof(type) !== "string" || typeof(options) !== "object" || typeof(options.uri) !== "string"){
            return callback && callback({error:133,error_text:"invalid arguments"});
        }
        switch(type)
        {
        case "http":
        case "ftp":
        case "torrent":
        case "ed2k":
        case "ssh":
            values["@"] = "task_add";
            break;
        case "stream":
            values["@"] = "task_add_stream";
            break
        default:
            return callback && callback({error:133,error_text:"invalid type"});
        }
        for(let name in options){
            values[name] = options[name];
        }
        this.http_fetch(JSON.stringify(values),callback);
    },
    http_task_query:function(type,id,callback)
    {
        let task_type = this.task_type(type);

        if(task_type === null){
            return callback && callback({error:133,error_text:"invalid type"});
        }
        if(typeof(id) !== "number"){
            return callback && callback({error:133,error_text:"invalid arguments"});
        }
        let values = {"@":"task_status","type":task_type,"extended":true};

        this.http_fetch(JSON.stringify(values),callback);
    },


    ///-----------------------------
    task_types :
    {
        Task_HTTP    : 0,
        Task_FTP     : 1,
        Task_Torrent : 2,
        Task_Ed2k    : 3,
        Task_Stream  : 4,
        Task_SSH     : 5,

        Task_Types_Size : 6
    },
    task_modes: //if(mode & task_modes.Task_Mode_Directory){.....}
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
    stream_filetype:
    {
        Stream_File_TS       : 0,
        Stream_File_Video    : 1,
        Stream_File_Audio    : 2,
        Stream_File_Subtitle : 3,
    },

    task_type_texts: [
        "http",
        "ftp",
        "torrent",
        "ed2k",
        "stream",
        "ssh"
    ],
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
