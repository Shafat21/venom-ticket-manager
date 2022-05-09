const discord = require('discord.js')
const bot = require('../index')
const client = bot.client
const config = bot.config


module.exports = () => {
    //closebar
    var closeBar = new discord.MessageActionRow()
        .addComponents(
            new discord.MessageButton()
                .setCustomId("closeTicketTrue")
                .setDisabled(false)
                .setStyle("SUCCESS")
                .setLabel("Confirm")
        )
        .addComponents(
            new discord.MessageButton()
                .setCustomId("closeTicketFalse")
                .setDisabled(false)
                .setStyle("DANGER")
                .setLabel("Cancel")
        )
    var deleteBar = new discord.MessageActionRow()
        .addComponents(
            new discord.MessageButton()
                .setCustomId("deleteTicketTrue1")
                .setDisabled(false)
                .setStyle("SUCCESS")
                .setLabel("Confirm")
            )
        .addComponents(
            new discord.MessageButton()
                .setCustomId("deleteTicketFalse1")
                .setDisabled(false)
                .setStyle("DANGER")
                .setLabel("Cancel")
            )
    var deleteBar1 = new discord.MessageActionRow()
        .addComponents(
            new discord.MessageButton()
                .setCustomId("deleteTicketTrue1")
                .setDisabled(false)
                .setStyle("SUCCESS")
                .setLabel("Confirm")
        )
        .addComponents(
            new discord.MessageButton()
                .setCustomId("deleteTicketFalse1")
                .setDisabled(false)
                .setStyle("DANGER")
                .setLabel("Cancel")
        )
    //closebutton
    var closeRowNormal = new discord.MessageActionRow()
        .addComponents(
            new discord.MessageButton()
            .setCustomId("closeTicket")
            .setDisabled(false)
            .setStyle("SECONDARY")
            .setLabel("Close Ticket")
        )
        .addComponents(
            new discord.MessageButton()
            .setCustomId("deleteTicket")
            .setDisabled(false)
            .setStyle("DANGER")
            .setLabel("Delete Ticket")
        )
    var closeRowClosed = new discord.MessageActionRow()
        .addComponents(
            new discord.MessageButton()
            .setCustomId("deleteTicket1")
            .setDisabled(false)
            .setStyle("DANGER")
            .setLabel("Delete Ticket")
        )
        .addComponents(
            new discord.MessageButton()
            .setCustomId("sendTranscript")
            .setDisabled(false)
            .setStyle("SECONDARY")
            .setLabel("Send Transcript File")
        )


    //NORMAL CLOSE
    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "closeTicket") return
        
        interaction.deferUpdate()
        interaction.message.edit({components:[closeBar]})
        
    })
    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "closeTicketFalse") return
        
        interaction.deferUpdate()
        interaction.message.edit({components:[closeRowNormal]})
    })
    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "closeTicketTrue") return
        
        interaction.deferUpdate()
        interaction.message.edit({components:[closeRowClosed]})

        /**
         * @type {String}
         */
        const name = interaction.channel.name
        var prefix = ""
        const tickets = config.options
        tickets.forEach((ticket) => {
            if (name.startsWith(ticket.channelprefix)){
                prefix = ticket.channelprefix
            }
        })

        require("./ticketCloser").closeTicket(interaction,prefix,"close")
    })

    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "closeTicketTrue1") return
        
        interaction.deferUpdate()
        const closedButtonDisabled = new discord.MessageActionRow()
            .addComponents([
                new discord.MessageButton()
                    .setCustomId("closeTicketTrue1")
                    .setDisabled(true)
                    .setStyle("SECONDARY")
                    .setEmoji("🔒")
            ])
        interaction.message.edit({components:[closedButtonDisabled]})

        /**
         * @type {String}
         */
        const name = interaction.channel.name
        var prefix = ""
        const tickets = config.options
        tickets.forEach((ticket) => {
            if (name.startsWith(ticket.channelprefix)){
                prefix = ticket.channelprefix
            }
        })

        require("./ticketCloser").closeTicket(interaction,prefix,"close")
    })


    //NORMAL DELETE
    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "deleteTicket") return
        
        interaction.deferUpdate()
        interaction.message.edit({components:[deleteBar]})
        
    })
    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "deleteTicketFalse") return
        
        interaction.deferUpdate()
        interaction.message.edit({components:[closeRowNormal]})
    })
    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "deleteTicketTrue") return
        
        interaction.deferUpdate()

        /**
         * @type {String}
         */
        const name = interaction.channel.name
        var prefix = ""
        const tickets = config.options
        tickets.forEach((ticket) => {
            if (name.startsWith(ticket.channelprefix)){
                prefix = ticket.channelprefix
            }
        })

        require("./ticketCloser").closeTicket(interaction,prefix,"delete")
    })




    //CLOSED DELETE
    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "deleteTicket1") return
        
        interaction.deferUpdate()
        interaction.message.edit({components:[deleteBar1]})
        
    })
    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "deleteTicketFalse1") return
        
        interaction.deferUpdate()
        interaction.message.edit({components:[closeRowClosed]})
    })
    client.on("interactionCreate",interaction => {
        if (!interaction.isButton()) return
        if (interaction.customId != "deleteTicketTrue1") return
        
        interaction.deferUpdate()

        /**
         * @type {String}
         */
        const name = interaction.channel.name
        var prefix = ""
        const tickets = config.options
        tickets.forEach((ticket) => {
            if (name.startsWith(ticket.channelprefix)){
                prefix = ticket.channelprefix
            }
        })

        require("./ticketCloser").closeTicket(interaction,prefix,"deletenotranscript")
    })
}