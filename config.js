var filecxx_wui =
{
    version: 1.0,
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

    lang:
    {
        language:{
            name: Std.cookie.get("filecxx_wui_lang_name"),
            value:Std.cookie.get("filecxx_wui_lang_value")
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

                result += this.keywords[key];
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
            if(this.language.name && this.language.text){
                return {name:this.language.name,text:this.language.text};
            }
            var lang = navigator.language.replace('-','_');

            for(let key in filecxx_wui.languages)
            {
                if(key === lang){
                    this.language.name  = lang;
                    this.language.value = filecxx_wui.languages[key];
                    return;
                }
            }
            this.language.name  = "en_US";
            this.language.value = "English";
        }
    }
};


lang = function(keyword)
{
    return filecxx_wui.lang.keywords[keyword] || keyword;
}
