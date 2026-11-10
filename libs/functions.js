function bytes_to_str(bytes)
{
    if(!isNumeric(bytes))
    {
        if(isString(bytes) && bytes.length === 0){
            bytes = "unknown";
        }
        return bytes + "";
    }
    if(isString(bytes)){
        bytes = parseFloat(bytes);
    }
    let units  = ["B","KB","MB","GB","TB","PB","EB","ZB","YB"];
    let i      = 0;
    let result = bytes;

    if(bytes >= 1024)
    {
        for(;i<units.length - 1;++i)
        {
            if(result / 1024 < 1){
                break;
            }
            result /= 1024;
        }
    }
    return parseFloat(result.toFixed(2)) + " " + units[i];
}

function format_ns_time(nanoseconds)
{
    const date = new Date(Number(BigInt(nanoseconds) / 1000000n));

    if(Number.isNaN(date.getTime())) {
       return "";
    }
    const pad = (n) => String(n).padStart(2, "0");

    return `${String(date.getFullYear()).padStart(4, "0")}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` + `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function seconds_to_duration(seconds, max)
{
    const units = "SMHdmY";
    const bases = [1, 60, 3600, 86400, 2592000, 31536000];
    let highest = units.indexOf(max);

    if (typeof max !== "string" || max.length !== 1 || highest < 0 ||
        typeof seconds !== "number" || !Number.isFinite(seconds)) {
        return "";
    }

    const parts = [];

    for (let i = highest; i >= 0; i--) {
        const value = seconds > 0 ? Math.floor(seconds / bases[i]) : 0;
        seconds -= value * bases[i];

        if (i === highest && value === 0) {
            highest--;
            continue;
        }

        let str = String(value);
        if (i < 5 && str.length === 1 && highest !== 0) {
            str = "0" + str;
        }
        parts.push(str);
    }

    return parts.join(":");
}

function timestamp_to_seconds(timestamp)
{
    if(timestamp < Math.pow(10, 12)){
        return timestamp;
    }
    return Math.floor(timestamp / 1000);
}

/*
 * extract filename suffix
*/
function extract_filename_suffix(filename)
{
    if(filename.length > 0)
    {
        let index = filename.lastIndexOf('.');

        if(index !== -1){
            return filename.substr(index + 1).toLowerCase();
        }
    }
    return "";
}