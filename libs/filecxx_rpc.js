/*
 * step1: connect
 * step2: send auth, {"@":"wsc",username:"xxxx",password:"****"}
 * step3: receive auth message, check json.state === "success"
 * step4: receive real messages from the backend
*/

var filecxx_rpc =
{
    config:{
        host:"",
        port:10111,
        ssl:false,
        username:"",
        password:"",
        reconnect_timeout:-1 // -1 or >=0
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
        if(this.websocket_)
        {
            if(!json){
                json = {};
            }
            json["@"] = message_type;
            this.websocket_.send(JSON.stringify(json));
        }
    },
    send_auth:function()
    {
        this.send("wsc",{
            "username":this.config.username,
            "password":this.config.password,
        });
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
            that.send_auth(); //step2

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

            if(that.config.reconnect_timeout >= 0)
            {
                that.timer_ = setTimeout(function(){
                    that.connect();
                },that.config.reconnect_timeout);
            }
            that.on_close && that.on_close();
        };
        that.timer_ = setTimeout(close,1500);
    },
    close:function()
    {
        let that = this;

        if(that.websocket_){
            that.websocket_.close();
        }
    }
};
