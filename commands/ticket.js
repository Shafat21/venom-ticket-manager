const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config

/** =============================
 ** NOT READY YET
 ** =============================*/

module.exports = () => {
    /**@type {String[]} */
    var msgIds = []
    config.messages.forEach((msg) => {
        msgIds.push(msg.id)
    })


    client.on("messageCreate", msg => {
        if (msg.content.startsWith(config.prefix+"msg")){
            if (config.main_adminroles.some((item)=>{return msg.member.roles.cache.has(item)}) == false){
                msg.channel.send({content:"You have no permission to run this command!"})
                return
            }

            const id = msg.content.split(config.prefix+"msg")[1].substring(1) ? msg.content.split(config.prefix+"msg")[1].substring(1) : false
            msg.delete();
            if (!id) return msg.channel.send({content:"**There is no id!**\nUse: `"+config.prefix+"msg <id>`"})
            if (!msgIds.includes(id)) return msg.channel.send({content:"**Invalid id!**\nChoose from this list:\n_"+msgIds.join("_\n_")+"_"})


            const {embed,componentRows} = require("../core/ticketMessageEmbed").createEmbed(id)
            
            msg.channel.send({embeds:[embed],components:componentRows})
            
            if (config.logs){console.log("[command] "+config.prefix+"msg (user:"+msg.author.username+")")}
            if (config.logs){console.log("[system] created ticket message")}
        }
    })

    client.on("interactionCreate", (interaction) => {
        if (!interaction.isCommand()) return
        if (interaction.commandName != "message") return

            if (config.main_adminroles.some((item)=>{return interaction.guild.members.cache.find((m) => m.id == interaction.member.id).roles.cache.has(item)}) == false){
                interaction.reply({content:"You have no permission to run this command!"})
                return
            }

            const id = interaction.options.getString("id")

            if (!msgIds.includes(id)) return interaction.reply({content:"**Invalid id!**\nChoose from this list:\n_"+msgIds.join("_\n_")+"_"})

            const {embed,componentRows} = require("../core/ticketMessageEmbed").createEmbed(id)
            
            interaction.reply({content:"The embed is in the message below!"})
            interaction.channel.send({embeds:[embed],components:componentRows})
            
            if (config.logs){console.log("[command] "+config.prefix+"msg (user:"+interaction.member.user.username+")")}
            if (config.logs){console.log("[system] created ticket message")}
        
    })
}