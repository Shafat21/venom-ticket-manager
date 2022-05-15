const discord = require('discord.js')
const fs = require('fs')
const intents = discord.Intents
const client = new discord.Client({intents:[intents.FLAGS.GUILDS,intents.FLAGS.GUILD_MESSAGES,intents.FLAGS.GUILD_MEMBERS],partials:["CHANNEL"]})
exports.client = client

client.setMaxListeners(20)

//change to FALSE on release
const isDev = false
//!!!!!!!!!!!

if (isDev){
    try {
        var config = require('./devConfig.json')
    }catch{
        console.log("devConfig.json not found! Trying the normal config...")
        var config = require("./config.json")
    }
}else{var config = require('./config.json')}
exports.config = config

client.on('ready',async () => {
    const chalk = await (await import("chalk")).default
    console.log(chalk.red("STARTING IN ")+chalk.blue("SLASH MODE")+chalk.red("..."))
    console.log("logs:\n================")
    console.log(`Logged in as ${client.user.tag}`)
    console.log("loading files...")
    client.user.setActivity(config.status.text,{type:config.status.type})
    console.log(chalk.green("switching to slashEnable.js"))
            require("./core/slashSystem/slashEnable")

})

require("./core/checker").checker()

if (process.argv[2] != "slash"){
    var storage = require('./core/dynamicdatabase/storage')
    exports.storage = storage

    //commands
    require('./commands/ticket')()
    require("./commands/help")()
    require("./commands/close")()
    require("./commands/delete")()
    require("./commands/rename")()
    require("./commands/add")()
    require("./commands/remove")()

    //core
    require('./core/ticketOpener')()
    require("./core/ticketCloser").runThis()
    require("./core/closebuttons")()
    require("./core/reactionRoles")()

    /**
     * We need:
     * - checker.js
     */

}


//=====================================================================
//=====================================================================
//ERROR DEBUG MODE: turn not on exept when you know what you are doing!
var errorDebugMode = true
//ERROR DEBUG MODE: turn not on exept when you know what you are doing!
//=====================================================================
//=====================================================================



if (!errorDebugMode){
    process.on("uncaughtException",async (error,origin) => {
        const chalk = await (await import("chalk")).default
        console.log(chalk.red("\nVENOM MANAGER ERROR: ")+error+"\n"+chalk.green("\nCreate a ticket in our support server for more information!\nIf you do this, you might help us to avoid a future bug!\n"))
    })
}
if (errorDebugMode) {
    const debugLog = (debugString) => {
        const content = fs.existsSync("./venom-managerdebug.txt") ? fs.readFileSync("./venom-managerdebug.txt").toString() : "==========================\n<OPEN TICKET DEBUG FILE:>\n=========================="
        fs.writeFileSync("./venom-managerdebug.txt",content+"\nDEBUG: "+debugString)
    }
    const errorLog = (errorString,stack) => {
        const content = fs.existsSync("./venom-managerdebug.txt") ? fs.readFileSync("./venom-managerdebug.txt").toString() : "==========================\n<OPEN TICKET DEBUG FILE:>\n=========================="
        fs.writeFileSync("./venom-managerdebug.txt",content+"\nERROR: "+errorString+" STACK: "+stack)
    }

    client.on("debug", async (message) => {
        if (message.startsWith("Provided token:")){
            debugLog("Provided token: ***********bot token is invisible**************...")
            return
        }
        debugLog(message)
    });

    const asyncfunction = async () => {
        const chalk = await (await import("chalk")).default
        console.log(chalk.bgYellow("ENTERING DEBUG MODE:"))
    }
    asyncfunction()

    process.on("uncaughtException",async (error,origin) => {
        const chalk = await (await import("chalk")).default
        console.log(chalk.red("\nMAIN ERROR: ")+"this error is saved in the debug file!")
        errorLog(error.name+": "+error.message+" | origin: "+origin,error.stack)
    })
}

client.login(config.auth_token)