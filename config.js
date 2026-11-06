var filecxx_wui =
{
    lang:
    {
        keywords:{},

        name:function()
        {
            return "en_US";
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

            Std.ajax.get("lang/" + that.name() + ".lang",(content)=>{
                that.parse(content);
                callback();
            });
        }
    }
};


lang = function(keyword)
{
    return filecxx_wui.lang.keywords[keyword] || keyword;
}
