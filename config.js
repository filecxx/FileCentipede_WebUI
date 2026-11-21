var filecxx_wui =
{
    version: 0.10,
    version_backend: 0,
    data:{},
    iconset:{},
    global_status:null,

    play_mp3(src)
    {
        let that = this;

        try{
            if(that.audio_){
                that.audio_.pause();
            }
            that.audio_ = new Audio(src);
            that.audio_.play().catch(err => {});
        }catch(e){}
    },
    module_action(text,icon,path,entry,opts)
    {
        return {
            text:lang(text),
            icon:icon,
            click:function(){
                filecxx_wui.run_module(path,entry,opts);
            }
        }
    },
    run_module:function(path,entry,opts)
    {
        var locker = Std.ui("locker",{
            renderTo:"body",
            visible:true,
            cursor:"wait",
            opacity:0
        });
        var loader = new Std.loader;

        loader.loadFiles(path,function(){
            locker.remove();
            Std.ui(entry,(opts && isObject(opts)) ? opts : {})
        });
    },
    init_iconset:function()
    {
        this.iconset["data_table"] = {
            cancel:"icons/16/cancel.svg",
            add:"icons/24/add.svg",
            edit:"icons/24/edit.svg",
            remove:"icons/24/delete.svg",
            clear:"icons/24/delete_all.svg",
            refresh:"icons/24/refresh.svg",
            copy:"icons/24/save.svg",
        };
    },
    init_wizard_options:function()
    {
        Std.ui.wizard.options({
            port:{
                ui:"SpinBox",
                min:0,
                max:65534,
                type:"uint",
            },
            password:{
                //echoMode:"password",  //fuck chrome
                css:{"-webkit-text-security": "disc"}
            },
            catalog:{
                ui:"ComboBox",
                valueType:"item",
                items: function()
                {
                    let list = [{text:" --- ", value:""}];

                    for(let name in filecxx_wui.data.catalogs)
                    {
                        list.push({icon:"icons/24/catalog.svg",
                            iconWidth:24,
                            iconHeight:24,
                            text: lang(name), value: name
                        });
                    }
                    return list;
                }
            },
            task_proxy:{
                ui:"ComboBox",
                valueType:"item",
                items: function(){
                    let list = [
                        {text:lang("no_proxy"),value:0},
                        {text:lang("OS_setting"),value:"@os"},
                    ];
                    for(let name in filecxx_wui.data.proxies){
                        list.push({text: lang(name), value: name});
                    }
                    return list;
                }
            },
            stream_key_mode:{
                ui:"ComboBox",
                valueType:"index",
                items:["Base64"]
            },
            proxy_type:{
                ui:"ComboBox",
                valueType:"text",
                items:["SOCKS5","HTTP","HTTPS","SOCKS5S"]
            },
            proxy_mode:{
                ui:"ComboBox",
                valueType:"index",
                items:[lang("always"),lang("if_available"),lang("as_backup"),lang("round_robin")]
            },
            mirrors_mode:{
                ui:"ComboBox",
                valueType:"index",
                items:[lang("round_robin")]
            },
            mirrors_proxy:{
                ui:"ComboBox",
                valueType:"index",
                items:[lang("enable"), lang("disable")]
            },
            mirrors_path:{
                ui:"ComboBox",
                valueType:"index",
                items:[lang("replace_origin_host"), lang("prepend_before_origin_url"), lang("replace_origin_url")]
            },
            http_method:{
                ui:"ComboBox",
                editable:true,
                valueType:"text",
                items:["GET","POST","OPTIONS","PUT","PATCH","TRACE"]
            },
            parallel:{
                ui:"ComboBox",
                valueType:"index",
                items:[lang("smooth"), lang("fastest")]
            },
            cookies:{
                ui:"TextEdit"
            },
            headers:{
                ui:"TextEdit"
            },
            connect_timeout:{
                label:"ms",
                min: 200
            },
            speed_limit:{
                type:"uint",
                label:"KB/s",
            },
            speed_limit_download:{
                type:"uint",
                label:"KB/s",
            },
            speed_limit_upload:{
                type:"uint",
                label:"KB/s",
            },
            seeding_limit_speed_limit:{
                type:"uint",
                label:"KB/s",
            },
            seeding_limit_act:{
                ui:"ComboBox",
                valueType:"index",
                items:[lang("none"),lang("stop"),lang("speed_limit"),lang("delete_task"),lang("delete_task_and_file")]
            },
            date_time:{
                ui:"DateTimeEdit",
                valueType:"timestamp"
            },
            mirror_hosts:{
                ui:"TextEdit",
                placeHolder:lang("http_mirrors_placeholder")
            },
            preferred_video_quality:{
                ui:"ComboBox",
                valueType:"index",
                items:[
                    lang("all"), ">= 240p", ">= 360p", ">= 480p", ">= 720p", ">= 1080p", ">= 2K", ">= 4K", ">= 8K",
                ]
            },
            user_agent:{
                ui:"ComboBox",
                editable:true,
                items:[
                    "Mozilla/5.0 (Linux x86_64) Firefox/78.0",
                    "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0",
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0",
                    "Mozilla/5.0 (Android 11; Mobile; LG-M255; rv:88.0) Gecko/88.0 Firefox/88.0",
                    "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.7113.93 Safari/537.36",
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4495.0",
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4450.0",
                    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4464.5 Safari/537.36",
                    "Mozilla/5.0 (iPad; CPU OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
                    "Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko",
                    "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko",
                    "Mozilla/5.0 (compatible; MSIE 9.0; AOL 9.7; AOLBuild 4343.55; Windows NT 6.1; WOW64; Trident/5.0)",
                    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
                    "Mozilla/5.0 (compatible; Bingbot/2.0; +http://www.bing.com/bingbot.htm)",
                    "Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)",
                    "DuckDuckBot/1.0; (+http://duckduckgo.com/duckduckbot.html)",
                    "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)",
                    "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)",
                    "Sogou web spider/4.0(+http://www.sogou.com/docs/help/webmasters.htm#07)",
                    "Mozilla/5.0 (compatible; Konqueror/3.5; Linux) KHTML/3.5.5 (like Gecko) (Exabot-Thumbnails)",
                    "Mozilla/5.0 (compatible; Exabot/3.0; +http://www.exabot.com/go/robot)",
                    "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
                    "ia_archiver (+http://www.alexa.com/site/help/webmasters; crawler@alexa.com)",
                ]
            },
        });
    },
};

filecxx_wui.lang =
{
    language:{
        name: Std.cookie.get("filecxx_wui_lang_name"),
        value:Std.cookie.get("filecxx_wui_lang_value")
    },
    languages: {
        "de_DE":"Deutsch",
        "en_US":"English",
        "eo_001":"esperanto",
        "es_ES":"Español",
        "fr_FR":"Français",
        "id_ID":"Indonesia",
        "it_IT":"Italiano",
        "ja_JP":"日本語",
        "ko_KR":"한국어",
        "nl_NL":"Nederlands",
        "pl_PL":"Polski",
        "pt_BR":"português",
        "ru_RU":"русский",
        "tr_TR":"Türkçe",
        "vi_VN":"Tiếng Việt",
        "zh_CN":"简体中文",
        "zh_TW":"繁體中文",
    },
    alias:{
        mirrors_mode:"mode",
        mirrors_proxy:"proxy",
        mirrors_path:"path",
        mirror_hosts:"hosts",
        operation_always:"always",
        operation_seeding:"seeding",
        attr_last_modified:"last_modified_time",
        pass:"password",
        creation_time_begin:"begin",
        creation_time_end:"end",
        torrent_comment:"comment",
        skip_localhost_pass:"skip_localhost_password_authentication",
        skip_http_server_auth:"skip_http_server_authentication",
        seeding_limit_ratio:"ratio_reached",
        seeding_limit_minutes:"duration_reached",
        seeding_limit_size:"size_reached",
        seeding_limit_act:"action"
    },
    parse:function(text)
    {
        var list  = {};
        var key   = "";
        var value = "";
        var step  = 0;
        var char  = 0;

        for(var i=0;i<text.length;i++)
        {
            var c = text[i];

            if(c === '=' && step === 0){
                step++;
            }else if(c === '\r'){

            }else if(c === '\n' && (step === 1 || step === 2) && char === 0){
                list[key] = value;
                key   = "";
                value = "";
                step  = 0;
                char  = 0;
            }else if(step === 0){
                key += c;
            }else if(step === 1){
                if(c === '"'){
                    step = 2;
                    char = 1;
                }else{
                    value += c;
                }
            }else if(step === 2){
                if(char === 0){
                    value += c;
                }else if(c === '\\' && i < text.length + 1){
                    value += text[++i];
                }else if(c === '"'){
                    char = 0;
                }else{
                    value += c;
                }
            }
        }
        if(step !== 0){
            list[key] = value;
        }
        this.keywords = list;
    },
    format:function(content)
    {
        var index  = 0;
        var result = "";
        var end    = 0;

        while((index = content.indexOf("${",index)) !== -1)
        {
            result += content.substring(end,index);

            if((end = content.indexOf("}",index)) === -1){
                end = index;
                break;
            }
            var key = content.substring(index + 2,end);

            result += this.keywords[filecxx_wui.lang.alias[key] || key] || key;
            index = end;
            end++;
        }
        result += content.substring(end);

        return result;
    },
    load:function(callback)
    {
        let that = this;

        Std.ajax.get("lang/" + that.language.name + ".lang",(content)=>{
            that.parse(content);
            callback();
        });
    },
    init:function()
    {
        Std.ui.wizard.locale    = window.lang;
        Std.ui.wizard.labelText = function(str){
            return str + ": ";
        };

        if(this.language.name && this.language.text){
            return {name:this.language.name,text:this.language.text};
        }
        var lang = navigator.language.replace('-','_');

        for(let key in filecxx_wui.lang.languages)
        {
            if(key === lang){
                this.language.name  = lang;
                this.language.value = filecxx_wui.lang.languages[key];
                return;
            }
        }
        this.language.name  = "en_US";
        this.language.value = "English";
    }
};

lang = function(keyword)
{
    keyword = filecxx_wui.lang.alias[keyword] || keyword;

    return filecxx_wui.lang.keywords[keyword] || keyword;
}


