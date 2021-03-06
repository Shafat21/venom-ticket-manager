exports.checker = async () => {
    const chalk = await (await import("chalk")).default
    const config = require("../config.json")
    var errorList = []
    var isError = false
    var warnList = []
    var isWarn = false
    const createError = (message) => {
        isError = true
        errorList.push("venom-manager CONFIG ERROR: "+message)
    }
    const createWarn = (message) => {
        isWarn = true
        warnList.push("venom-manager CONFIG WARNING: "+message)
    }

    //validators
    /**@param {"userid"|"roleid"|"channelid"|"serverid"|"categoryid"} mode @param {String} value @param {String} path */
    const checkDiscord = (mode,value,path) => {
        if (mode == "userid"){
            if (value.length < 16 || value.length > 20 || !/^\d+$/.test(value)){
                createError("'"+path+"' | this user id is invalid")
            }
        }else if (mode == "channelid"){
            if (value.length < 16 || value.length > 20 || !/^\d+$/.test(value)){
                createError("'"+path+"' | this channel id is invalid")
            }
        }else if (mode == "roleid"){
            if (value.length < 16 || value.length > 20 || !/^\d+$/.test(value)){
                createError("'"+path+"' | this role id is invalid")
            }
        }else if (mode == "serverid"){
            if (value.length < 16 || value.length > 20 || !/^\d+$/.test(value)){
                createError("'"+path+"' | this server id is invalid")
            }
        }else if (mode == "categoryid"){
            if (value.length < 16 || value.length > 20 || !/^\d+$/.test(value)){
                createError("'"+path+"' | this category id is invalid")
            }
        }
    }
    /**@param {String} value */
    const checkToken = (value) => {
        if (value.includes(" ") || value.length < 40 || value.length > 70){
            createError("'auth_token' | your token is invalid")
        }
    }

    /**@param {String} value @param {String} path */
    const checkColor = (value,path) => {
        if (!/^#[a-f0-9]{6}$/.test(value)){
            createError("'"+path+"' | invalid color!")
        }
    }

    /**@param {String} value @param {String} path @param {Number} minLength @param {Number} maxLength @param {String} name */
    const checkString = (value,minLength,maxLength,path,name) => {
        if (value.length < minLength){
            createError("'"+path+"' | "+name+" is too short!")
        }else if (value.length > maxLength){
            createError("'"+path+"' | "+name+" is too long!")
        }
    }

    /**@param {"userid"|"roleid"|"channelid"|"serverid"} mode @param {String[]} arrayValue @param {String} path */
    const checkDiscordArray = (mode,arrayValue,path) => {
        if (mode == "userid"){
            arrayValue.forEach((value,index) => {
                if (value.length < 16 || value.length > 20 || !/^\d+$/.test(value)){
                    createError("'"+path+":"+index+"' | this user id is invalid")
                }
            })
        }else if (mode == "channelid"){
            arrayValue.forEach((value,index) => {
                if (value.length < 16 || value.length > 20 || !/^\d+$/.test(value)){
                    createError("'"+path+":"+index+"' | this channel id is invalid")
                }
            })
        }else if (mode == "roleid"){
            arrayValue.forEach((value,index) => {
                if (value.length < 16 || value.length > 20 || !/^\d+$/.test(value)){
                    createError("'"+path+":"+index+"' | this role id is invalid")
                }
            })
        }else if (mode == "serverid"){
            arrayValue.forEach((value,index) => {
                if (value.length < 16 || value.length > 20 || !/^\d+$/.test(value)){
                    createError("'"+path+":"+index+"' | this server id is invalid")
                }
            })
        }
    }
    /**@param {String} value @param {"string"|"boolean"|"number"} type */
    const checkType = (value,type,path) => {
        if (type == "boolean"){
            if (typeof value != "boolean"){
                createError("'"+path+"' | invalid type, this must be a boolean!")
            }
        }else if (type == "number"){
            if (typeof value != "number"){
                createError("'"+path+"' | invalid type, this must be a number!")
            }
        }else if (type == "string"){
            if (typeof value != "string"){
                createError("'"+path+"' | invalid type, this must be a string!")
            }
        }
    }

    const checkButtonColor = (value,path) => {
        if (value != "none" && value != "grey" && value != "gray" && value != "black" && value != "red" && value != "green" && value != "blue" && value != "blurple"){
            createError("'"+path+"' | invalid color, it must be one of these: none, gray, red, green, blue!")
        }
    }

    const getButtonClass = require("./utils/getButton").rawButtonData
    /**@param {getButtonClass} option */
    const checkOption = (option,path) => {

        //id
        checkType(option.id,"string",path+"/id")
        if (option.id.includes(" ")){
            createError("'"+path+"/id' | option id can't contain space characters!")
        }
        if (option.id.length > 20){
            createError("'"+path+"/id' | option id max lenght is 20")
        }
        
        //name
        checkType(option.name,"string",path+"/name")
        if (option.name.length > 100){
            createWarn("'"+path+"/name' | if your name is too long it maybe doesn't look so good!")
        }

        //description
        checkType(option.description,"string",path+"/description")

        //label
        checkType(option.label,"string",path+"/label")
        if (option.label.length < 1 && option.icon.length < 1){
            createError("'"+path+"' | you need at least one of these: label, icon!")
        }

        //type
        checkType(option.type,"string",path+"/type")
        if (option.type != "ticket" && option.type != "website" && option.type != "role"){
            createError("'"+path+"/type' | the type must be one of these: ticket, website, role!")
        }
        /**@type {"ticket"|"website"|"role"} */
        const type = option.type

        if (type == "ticket"){
            //color
            checkType(option.color,"string",path+"/color")
            checkButtonColor(option.color,path+"/color")

            //adminroles
            checkDiscordArray("roleid",option.adminroles,path+"/adminroles")
            
            //channelprefix
            checkType(option.channelprefix,"string",path+"/channelprefix")
            if (option.channelprefix.includes(" ")){
                createWarn("'"+path+"/channelprefix' | this prefix can't contain spaces!")
            }

            //category
            checkType(option.category,"string",path+"/category")
            checkDiscord("categoryid",option.category,path+"/category")

            //message
            checkType(option.message,"string",path+"/message")

            //enableDMmessage
            checkType(option.enableDMMessage,"boolean",path+"/enableDMMessage")
        }else if (type == "website"){
            //url
            checkType(option.url,"string",path+"/url")
            if (option.url.includes(" ")){
                createWarn("'"+path+"/url' | a url can't contain spaces")
            }
            if (option.url.length < 1){
                createError("'"+path+"/url' | you have no url in this button")
            }
            if (!option.url.startsWith("https://") && !option.url.startsWith("http://") && !option.url.startsWith("discord://")){
                createWarn("'"+path+"/url' | your url doesn't start with https or http!")
            }
            if (option.url.startsWith("http://")){
                createWarn("'"+path+"/url' | your url is not a HTTPS link! discord maybe blocks this url!")
            }
        }else if (type == "role"){
            //color
            checkType(option.color,"string",path+"/color")
            checkButtonColor(option.color,path+"/color")

            //roles
            checkDiscordArray("roleid",option.roles,path+"/roles")

            //mode
            checkType(option.mode,"string",path+"/mode")
            if (option.mode != "add&remove" && option.mode != "add" && option.mode != "remove"){
                createError("'"+path+"/mode' | mode must be one of these: add, remove, add&remove")
            }

            //enableDMmessage
            checkType(option.enableDMMessage,"boolean",path+"/enableDMMessage")
        }
    }

    //checker
    var configArray = ["bot_name","main_color","server_id","auth_token","main_adminroles","prefix","logs","languagefile","credits","status","system","options","messages"]
    configArray.forEach((item) => {
        if (config[item] == undefined){
            throw new Error("\n\nMAIN ERROR: the item '"+item+"' doesn't exist in config.json")
        }
    })



    checkType(config.bot_name,"string","bot_name")
    checkColor(config.main_color,"main_color")
    checkDiscord("serverid",config.server_id,"server_id")
    checkToken(config.auth_token)
    checkDiscordArray("roleid",config.main_adminroles,"main_adminroles")
    checkString(config.prefix,1,15,"prefix","prefix")
    checkType(config.logs,"boolean","logs")
    //languagefile (comming soon)


    checkType(config.credits,"boolean","credits")
    //status:
        checkType(config.status.enabled,"boolean","status/enabled")
        if (config.status.enabled){
            if (config.status.type != "PLAYING" && config.status.type != "LISTENING" && config.status.type != "WATCHING"){
                createError("'status/type' | not a valid status type!")
            }
            if (config.status.text.length < 1 || config.status.text.length > 40){
                createError("'status/text' | text too long or short!")
            }
        }

    
    //system:
        if (config.system.ticket_channel){
            if (config.system.ticket_channel.length < 16 || config.system.ticket_channel.length > 20 || !/^\d+$/.test(config.system.ticket_channel)){
                createError("'system/ticket_channel' | this channel id is invalid")
            }
        }else createWarn("'"+path+"' | you have no ticket channel selected!")
        checkType(config.system.max_allowed_tickets,"number","system/max_allowed_tickets")
        checkType(config.system.enable_DM_Messages,"boolean","system/enable_DM_Messages")
        checkType(config.system["has@everyoneaccess"],"boolean","system/has@everyoneaccess")
        if (config.system.member_role != "" && config.system.member_role != " " && config.system.member_role != "false" && config.system.member_role != "null" && config.system.member_role != "0"){
            checkDiscord("roleid",config.system.member_role,"system/member_role")
        }
        checkType(config.system.enable_transcript,"boolean","system/enable_transcript")
        checkType(config.system.enable_DM_transcript,"boolean","system/enable_DM_transcript")
        if (config.system.enable_transcript){
            checkDiscord("channelid",config.system.transcript_channel,"system/transcript_channel")
        }

    //options

    config.options.forEach((option,index) => {
        checkOption(option,"options/"+index)
    })

    

    //the end
    if (errorList.length > 0 || warnList.length > 0){
        console.log("REPORT:\n===========================")
    }
    warnList.forEach((w) => {
        const splitw = w.split("'")
        if (splitw.length > 1){
            var splitstring = chalk.yellow(splitw[0])+chalk.blue("'"+splitw[1]+"'")+chalk.yellow(splitw[2])
        }else {var splitstring = chalk.yellow(splitw[0])}
        console.log(splitstring)
    })
    errorList.forEach((e) => {
        const splite = e.split("'")
        if (splite.length > 1){
            var splitstring = chalk.red(splite[0])+chalk.blue("'"+splite[1]+"'")+chalk.red(splite[2])
        }else {var splitstring = chalk.red(splite[0])}
        console.log(splitstring)
    })
    if (isError){
        console.log("===========================")
        console.log("=> "+chalk.bgRed("your bot doesn't work if you don't fix the above errors!"))
        if (isWarn){
            console.log("\n=> "+chalk.bgYellow("if you ignore warns, some things may work differently than expected!"))
        }
        process.exit(0)
    }else if (isWarn == true && isError == false){
        console.log("===========================")
        console.log("=> "+chalk.bgYellow("if you ignore warns, some things may work differently than expected!"))
    }

}

this.checker()