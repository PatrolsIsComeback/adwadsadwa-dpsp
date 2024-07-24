const Discord = require('discord.js')
const { Client, Partials, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, InteractionType, EmbedBuilder, ButtonBuilder } = require('discord.js')
const client = new Client({ intents: 131071, partials: Object.values(Partials).filter(x => typeof x === "string"), shards: 'auto' })
const { botid, token } = require("./ayarlar.json")
const chatbot = require("customchatbot");
const fetch = ('node-fetch');
const moment = require('moment')
const os = require('os')
const osutils = require('os-utils')
require("moment-duration-format")
require("./slash")(client)
const db = require("croxydb")
const express = require('express')
const monitor = require('http-monitor')
client.login(process.env.token)


//=====// Embedler \\=====\\
const PreYok = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Hata")
    .setDescription(`<:reddetmek:1255465799343144992> **Normal bir kullanıcı en fazla 2 proje ekleyebilir, </link-limit:0> komutu ile link limitinizi arttırabilir, </pre-al:0> komutu ile premium alarak sınırsız link ekleyebilirsiniz.**`)

const FazlaLink = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Hata")
    .setDescription(`<:reddetmek:1255465799343144992> **Bir kullanıcı tarafından en fazla 999 link eklenebilir.**`)

const LinkVar = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Hata")
    .setDescription(`<:reddetmek:1255465799343144992> **Belirtilen proje sistemde bulunuyor.**`)

const BaşıHatalı = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Hata")
    .setDescription(`<:reddetmek:1255465799343144992> **Proje linkin hatalı, linkin başında \`https://\` olduğundan emin ol.**`)

const SonuHatalı = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Hata")
    .setDescription(`<:reddetmek:1255465799343144992> **Yalnızca glitch projeleri aktif tutulmaktdır, linkin sonunda \`.glitch.me\` olduğundan emin ol.**`)

const LinkEklendi = new EmbedBuilder()
    .setColor("Green")
    .setTitle("Başarılı")
    .setDescription(`<:onay:1255464778932158535> **Projen başarıyla sisteme eklendi, Prejeniz 2-5 dk içerisinde aktif olacaktır.**`)

const ProjeYok = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Hata")
    .setDescription(`<:reddetmek:1255465799343144992> **Sistemde böyle bir proje bulunmuyor.**`)

const LinkSilindi = new EmbedBuilder()
    .setColor("Green")
    .setTitle("Proje Silindi3")
    .setDescription(`<:onay:1255464778932158535> **Projen başarıyla sistemden silindi.**`)

const Silindi = new EmbedBuilder()
    .setColor("Green")
    .setTitle("Başarılı")
    .setDescription(`<:onay:1255464778932158535> **Proje başarıyla sistemden silindi.**`)

const ProjeEklenmemiş = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Hata")
    .setDescription(`<:reddetmek:1255465799343144992>  **Sisteme hiç proje eklememişsin.**`)
//=====// Embedler \\=====\\

//=====// LinkEklemeFormu \\=====\\
const LinkEklemeFormu = new ModalBuilder()
    .setCustomId('linkeklemeform2')
    .setTitle('Link ekle')
const LinkEkleFormu = new TextInputBuilder()
    .setCustomId('linkekle')
    .setLabel('Proje adresinizi giriniz.')
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(20)
    .setMaxLength(100)
    .setPlaceholder('https://kentos-uptime.glitch.me')
    .setRequired(true)
const LinkEklemeSistemi = new ActionRowBuilder().addComponents(LinkEkleFormu);
LinkEklemeFormu.addComponents(LinkEklemeSistemi);
//=====// LinkEklemeFormu \\=====\\

//=====// LinkSilmeFormu \\=====\\
const LinkSilmeFormu = new ModalBuilder()
    .setCustomId('linksilmeform2')
    .setTitle('Link sil')
const LinkSilFormu = new TextInputBuilder()
    .setCustomId('linksil')
    .setLabel('Proje adresinizi giriniz.')
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(20)
    .setMaxLength(100)
    .setPlaceholder('https://kentos-uptime.glitch.me')
    .setRequired(true)
const LinkSilmeSistemi = new ActionRowBuilder().addComponents(LinkSilFormu);
LinkSilmeFormu.addComponents(LinkSilmeSistemi);
//=====// LinkSilmeFormu \\=====\\

//=====// SilmeFormu \\=====\\
const SilmeFormu = new ModalBuilder()
    .setCustomId('silmeform')
    .setTitle('Link sil')
const SilFormu = new TextInputBuilder()
    .setCustomId('sil')
    .setLabel('Proje adresinizi giriniz.')
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(20)
    .setMaxLength(100)
    .setPlaceholder('https://proje-linki.glitch.me')
    .setRequired(true)
const SilmeSistemi = new ActionRowBuilder().addComponents(SilFormu);
SilmeFormu.addComponents(SilmeSistemi);

const SilID = new TextInputBuilder()
    .setCustomId('silid')
    .setLabel('Projesi silinecek kullanıcı idsini giriniz.')
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(18)
    .setMaxLength(20)
    .setPlaceholder('873182701061021696')
    .setRequired(true)
const SilmeID = new ActionRowBuilder().addComponents(SilID);
SilmeFormu.addComponents(SilmeID);

const Sebep = new TextInputBuilder()
    .setCustomId('sebep')
    .setLabel('Projeyi silme sebebini belirtin.')
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder('Geçersiz link.')
    .setRequired(true)
const SilmeSebep = new ActionRowBuilder().addComponents(Sebep);
SilmeFormu.addComponents(SilmeSebep);

//=====// SilmeKomutu \\=====\\
client.on('interactionCreate', async interaction => {
    if (interaction.commandName === "sil") {

        const YetkiYok = new EmbedBuilder()
            .setDescription(`<:reddetmek:1255465799343144992> Bu komutu kullanabilmek için **Bot sahibi** olmalısın.`)
            .setColor('Red')
            .setTitle("Hata")

        if (interaction.user.id !== "1198643628780814378" && interaction.user.id !== "SAHİB" && interaction.user.id !== "SAHİB" && interaction.user.id !== "SAHİB" && interaction.user.id !== "SAHIB") {
            return interaction.reply({ embeds: [YetkiYok] });
        }

        await interaction.showModal(SilmeFormu);
    }
})
client.on('interactionCreate', async interaction => {
    if (interaction.type !== InteractionType.ModalSubmit) return;
    if (interaction.customId === 'silmeform') {

        let linkInput = interaction.fields.getTextInputValue("sil")
        let linkID = interaction.fields.getTextInputValue("silid")
        let Sebep = interaction.fields.getTextInputValue("sebep")
        const links = db.get(`UptimeLink_${linkID}`)

        if (!links.includes(linkInput)) return interaction.reply({ embeds: [ProjeYok] }).catch(e => { })
        db.unpush(`UptimeLink_${linkID}`, linkInput)
        db.unpush(`UptimeLink`, linkInput)
        interaction.reply({ embeds: [Silindi] }).catch(e => { })

        let PremiumVarmı = db.fetch(`PremiumÜye_${linkID}`)

        let PreVarmı;
        if (!PremiumVarmı) {
            PreVarmı = "<:reddetmek:1255465799343144992>"
        } else {
            PreVarmı = "<:onay:1255464778932158535>"
        }


        const ProjeSilindi = new EmbedBuilder()
            .setColor("Red")
            .setTitle("Bot sahibi tarafından sistemden bir link silindi")
            .addFields({ name: `<:kullanici:1255770546994548828> **Kullanıcı adı**`, value: `<@${linkID}>` })
            .addFields({ name: `<:ID:1255766546018467900> **Kullanıcı id**`, value: `${linkID}` })
            .addFields({ name: `<:liste:1255470686743433246> **Sistemdeki link sayısı**`, value: `${db.fetch(`UptimeLink`).length}` })
            .addFields({ name: `<:link:1255479726001094666> **Kullanıcının link sayısı**`, value: `${db.fetch(`UptimeLink_${linkID}`).length}` })
            .addFields({ name: `<:Premium:1255518072861753344> **Kullanıcının premiumu bulunuyormu**`, value: `${PreVarmı}` })
            .addFields({ name: `<:Yazi:1048677751818821702> **Linkin silinme sebebi**`, value: `${Sebep}` })
        client.channels.cache.get("1199989969280839701").send({ embeds: [ProjeSilindi] })

    }
})
//=====// SilmeKomutu \\=====\\

//=====// EklendimAtıldım \\=====\\
client.on('guildCreate', guild => {

    const Eklendim = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Bir sunucuya eklendim")
        .addFields({ name: `<:mavi_yazikanali:1255766272143130727> **Sunucu adı**`, value: `${guild}` })
        .addFields({ name: `<:ID:1255766546018467900> **Sunucu id**`, value: `${guild.id}` })
        .addFields({ name: `<:sunucu:1255480707296526418> **Toplam sunucu**`, value: `${client.guilds.cache.size}` })
        .addFields({ name: `<:kullanici:1255770546994548828> **Toplam kullanıcı**`, value: `${client.users.cache.size}` })
    client.channels.cache.get('1199989969280839701').send({ embeds: [Eklendim] })
})

client.on('guildDelete', guild => {

    const Atıldım = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Bir sunucudan atıldım")
        .addFields({ name: `<:mavi_yazikanali:1255766272143130727> **Sunucu adı**`, value: `${guild}` })
        .addFields({ name: `<:ID:1255766546018467900> **Sunucu id**`, value: `${guild.id}` })
        .addFields({ name: `<:sunucu:1255480707296526418> **Toplam sunucu**`, value: `${client.guilds.cache.size}` })
        .addFields({ name: `<:kullanici:1255770546994548828> **Toplam kullanıcı**`, value: `${client.users.cache.size}` })
    client.channels.cache.get('1199989969280839701').send({ embeds: [Atıldım] })
})
//=====// EklendimAtıldım \\=====\\

//=====// LinkEklemeSistemi \\=====\\
client.on('interactionCreate', async interaction => {
    if (interaction.customId === "eklebuton") {

        const Kullanamazsın = new EmbedBuilder()
            .setColor("Red")
            .setTitle("Komutlarımı kullanamazsın")
            .setDescription(`<:yasak:1255468817363107882> **Karalistemde bulunduğun için komutlarımı kullanmazsın, karalisteye alınma sebebini öğrenmek için veya karalisteden çıkartılmak için destek sunucuma gelebilirsin.**`)

        const Destek = new ActionRowBuilder().addComponents(new ButtonBuilder()
            .setURL(`https://discord.com/invite/M4w3Xjwj8u`)
            .setLabel("Destek Sunucusu")

            .setEmoji("<:gamesunucu_mainpage:1255529961624961035>")
            .setStyle("Link"))

        if (db.fetch(`Karaliste_${interaction.user.id}`)) return interaction.reply({ embeds: [Kullanamazsın], components: [Destek], ephemeral: true })

        if (db.fetch(`Bakım`)) {

            const Bakımda = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Bot bakımda")
                .setDescription(`<:bakim:1255467423369396346> **Sizlere en iyi hizmeti vermek için kısa süreliğine bakımdayız. Daha ayrıntılı bilgi için destek sunucusuna gelebilirsiniz. Bakım sebebi: \`${db.fetch(`BakımSebep`)}\`**`)

            const Destek = new ActionRowBuilder().addComponents(new ButtonBuilder()
                .setURL(`https://discord.com/invite/M4w3Xjwj8u`)
                .setLabel("Destek Sunucusu")

                .setEmoji("<:gamesunucu_mainpage:1255529961624961035>")
                .setStyle("Link"))

            if (interaction.user.id !== "1198643628780814378" && interaction.user.id !== "SAHİB" && interaction.user.id !== "SAHİB" && interaction.user.id !== "SAHİB") {

                interaction.reply({ embeds: [Bakımda], components: [Destek], ephemeral: true })

            }
        }

        await interaction.showModal(LinkEklemeFormu);
    }
})
client.on('interactionCreate', async interaction => {
    if (interaction.type !== InteractionType.ModalSubmit) return;
    if (interaction.customId === 'linkeklemeform2') {

        const LinkLimit = db.fetch(`LinkLimit_${interaction.user.id}`) || 0
        let Limit = LinkLimit + 4

        if (!db.fetch(`UptimeLink_${interaction.user.id}`)) {
            db.set(`UptimeLink_${interaction.user.id}`, [])
        }
        const link = interaction.fields.getTextInputValue("linkekle")
        let link2 = db.fetch(`UptimeLink_${interaction.user.id}`, [])

        const PremiumÜye = db.fetch(`PremiumÜye_${interaction.user.id}`)

        if (!link) return

        if (PremiumÜye) {
            if (db.fetch(`UptimeLink_${interaction.user.id}`).length >= 999) {
                return interaction.reply({ embeds: [FazlaLink], ephemeral: true }).catch(e => { })
            }

        } else {

            if (db.fetch(`UptimeLink_${interaction.user.id}`).length >= Limit) {
                return interaction.reply({ embeds: [PreYok], ephemeral: true }).catch(e => { })
            }
        }

        if (link2.includes(link)) {
            return interaction.reply({ embeds: [LinkVar], ephemeral: true }).catch(e => { })
        }

        if (!link.startsWith("https://")) {
            return interaction.reply({ embeds: [BaşıHatalı], ephemeral: true }).catch(e => { })
        }

        if (!link.endsWith(".glitch.me")) {
            return interaction.reply({ embeds: [SonuHatalı], ephemeral: true }).catch(e => { })
        }

        db.push(`UptimeLink_${interaction.user.id}`, link)
        db.push(`UptimeLink`, link)

        interaction.reply({ embeds: [LinkEklendi], ephemeral: true }).catch(e => { })

        let PremiumVarmı = db.fetch(`PremiumÜye_${interaction.user.id}`)

        let PreVarmı;
        if (!PremiumVarmı) {
            PreVarmı = "<:reddetmek:1255465799343144992>"
        } else {
            PreVarmı = "<:onay:1255464778932158535>"
        }

        const ProjeEklendi = new EmbedBuilder()
            .setColor("Green")
            .setTitle("Sisteme bir link eklendi")
            .addFields({ name: `<:kullanici:1255770546994548828> **Kullanıcı adı**`, value: `<@${interaction.user.id}>` })
            .addFields({ name: `<:mavi_yazikanali:1255766272143130727> **Kullanıcı tagı**`, value: `${interaction.user.tag}` })
            .addFields({ name: `<:ID:1255766546018467900> **Kullanıcı id**`, value: `${interaction.user.id}` })
            .addFields({ name: `<:liste:1255470686743433246> **Sistemdeki link sayısı**`, value: `${db.fetch(`UptimeLink`).length}` })
            .addFields({ name: `<:link:1255479726001094666> **Kullanıcının link sayısı**`, value: `${db.fetch(`UptimeLink_${interaction.user.id}`).length}` })
            .addFields({ name: `<:Premium:1255518072861753344> **Kullanıcının premiumu bulunuyormu**`, value: `${PreVarmı}` })
        client.channels.cache.get("1199989969280839701").send({ embeds: [ProjeEklendi] })

    }
})
//=====// LinkEklemeSistemi \\=====\\

//=====// LinkSilmeSistemi \\=====\\
client.on('interactionCreate', async interaction => {
    if (interaction.customId === "silbuton") {

        const Kullanamazsın = new EmbedBuilder()
            .setColor("Red")
            .setTitle("Komutlarımı kullanamazsın")
            .setDescription(`<:yasak:1255468817363107882> **Karalistemde bulunduğun için komutlarımı kullanmazsın, karalisteye alınma sebebini öğrenmek için veya karalisteden çıkartılmak için destek sunucuma gelebilirsin.**`)

        const Destek = new ActionRowBuilder().addComponents(new ButtonBuilder()
            .setURL(`https://discord.com/invite/M4w3Xjwj8u`)
            .setLabel("Destek Sunucusu")

            .setEmoji("https://discord.com/invite/M4w3Xjwj8u")
            .setStyle("Link"))

        if (db.fetch(`Karaliste_${interaction.user.id}`)) return interaction.reply({ embeds: [Kullanamazsın], components: [Destek], ephemeral: true })

        if (db.fetch(`Bakım`)) {

            const Bakımda = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Bot bakımda")
                .setDescription(`<:bakim:1255467423369396346> **Sizlere en iyi hizmeti vermek için kısa süreliğine bakımdayız. Daha ayrıntılı bilgi için destek sunucusuna gelebilirsiniz. Bakım sebebi: \`${db.fetch(`BakımSebep`)}\`**`)

            const Destek = new ActionRowBuilder().addComponents(new ButtonBuilder()
                .setURL(`https://discord.com/invite/M4w3Xjwj8u`)
                .setLabel("Destek Sunucusu")

                .setEmoji("<:gamesunucu_mainpage:1255529961624961035>")
                .setStyle("Link"))

            if (interaction.user.id !== "1198643628780814378" && interaction.user.id !== "SAHİB" && interaction.user.id !== "SAHİB" && interaction.user.id !== "SAHİB") {

                interaction.reply({ embeds: [Bakımda], components: [Destek] })

            }
        }

        await interaction.showModal(LinkSilmeFormu);
    }
})
client.on('interactionCreate', async interaction => {
    if (interaction.type !== InteractionType.ModalSubmit) return;
    if (interaction.customId === 'linksilmeform2') {

        const PremiumÜye = db.fetch(`PremiumÜye_${interaction.guild.id}`)

        const links = db.get(`UptimeLink_${interaction.user.id}`)
        let linkInput = interaction.fields.getTextInputValue("linksil")

        if (!links.includes(linkInput)) return interaction.reply({ embeds: [ProjeYok], ephemeral: true }).catch(e => { })

        db.unpush(`UptimeLink_${interaction.user.id}`, linkInput)
        db.unpush(`UptimeLink`, linkInput)

        interaction.reply({ embeds: [LinkSilindi], ephemeral: true }).catch(e => { })

        let PremiumVarmı = db.fetch(`PremiumÜye_${interaction.user.id}`)

        let PreVarmı;
        if (!PremiumVarmı) {
            PreVarmı = "<:reddetmek:1255465799343144992>"
        } else {
            PreVarmı = "<:onay:1255464778932158535>"
        }
        const ProjeSilindi = new EmbedBuilder()
            .setColor("Red")
            .setTitle("Sistemden bir link silindi")
            .addFields({ name: `<:kullanici:1255770546994548828> **Kullanıcı adı**`, value: `<@${interaction.user.id}>` })
            .addFields({ name: `<:mavi_yazikanali:1255766272143130727> **Kullanıcı tagı**`, value: `${interaction.user.tag}` })
            .addFields({ name: `<:ID:1255766546018467900> **Kullanıcı id**`, value: `${interaction.user.id}` })
            .addFields({ name: `<:liste:1255470686743433246> **Sistemdeki link sayısı**`, value: `${db.fetch(`UptimeLink`).length}` })
            .addFields({ name: `<:link:1255479726001094666> **Kullanıcının link sayısı**`, value: `${db.fetch(`UptimeLink_${interaction.user.id}`).length}` })
            .addFields({ name: `<:Premium:1255518072861753344> **Kullanıcının premiumu bulunuyormu**`, value: `${PreVarmı}` })
        client.channels.cache.get("1199989969280839701").send({ embeds: [ProjeSilindi] })

    }
})
//=====// LinkSilmeSistemi \\=====\\

//=====// LinkListeSistemi \\=====\\
client.on('interactionCreate', async interaction => {
    if (interaction.customId === "listebuton") {

        const Kullanamazsın = new EmbedBuilder()
            .setColor("Red")
            .setTitle("Komutlarımı kullanamazsın")
            .setDescription(`<:reddetmek:1255465799343144992> **Karalistemde bulunduğun için komutlarımı kullanmazsın, karalisteye alınma sebebini öğrenmek için veya karalisteden çıkartılmak için destek sunucuma gelebilirsin.**`)

        const Destek = new ActionRowBuilder().addComponents(new ButtonBuilder()
            .setURL(`https://discord.com/invite/M4w3Xjwj8u`)
            .setLabel("Destek Sunucusu")

            .setEmoji("<:gamesunucu_mainpage:1255529961624961035>")
            .setStyle("Link"))

        if (db.fetch(`Karaliste_${interaction.user.id}`)) return interaction.reply({ embeds: [Kullanamazsın], components: [Destek], ephemeral: true })

        if (db.fetch(`Bakım`)) {

            const Bakımda = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Bot bakımda")
                .setDescription(`<:bakim:1255467423369396346> **Sizlere en iyi hizmeti vermek için kısa süreliğine bakımdayız. Daha ayrıntılı bilgi için destek sunucusuna gelebilirsiniz. Bakım sebebi: \`${db.fetch(`BakımSebep`)}\`**`)

            const Destek = new ActionRowBuilder().addComponents(new ButtonBuilder()
                .setURL(`https://discord.com/invite/M4w3Xjwj8u`)
                .setLabel("Destek sunucusu")

                .setEmoji("<:gamesunucu_mainpage:1255529961624961035>")
                .setStyle("Link"))

            if (interaction.user.id !== "1198643628780814378" && interaction.user.id !== "SAHİB" && interaction.user.id !== "SAHİB" && interaction.user.id !== "SAHİB") {

                interaction.reply({ embeds: [Bakımda], components: [Destek] })

            }
        }

        const LinkYok = db.get(`UptimeLink_${interaction.user.id}`)
        if (!LinkYok) return interaction.reply({ embeds: [ProjeEklenmemiş], ephemeral: true })

        const links = db.get(`UptimeLink_${interaction.user.id}`).map(map => `<:link:1255479726001094666> **Link:** ${map}`).join("\n")

        const LinkListe = new EmbedBuilder()
            .setTitle(`Sistemdeki projelerin`)
            .setDescription(`${links || "Sisteme eklenmiş bir proje yok."}`)
            .setFooter({ text: "Uptime linkler" })
            .setColor("Blurple")

        interaction.reply({
            embeds: [LinkListe],
            ephemeral: true
        }).catch(e => { })

    }
})
//=====// LinkListeSistemi \\=====\\

//=====// UptimeEtme \\=====\\
setInterval(() => {
    var links = db.get("UptimeLink");
    if (!links) return;
    links.forEach(link => {
        try {
            fetch(link);
        } catch (e) {
            console.log("Hata: " + e);
        }
    });
    console.log("Uptime başarılı")
}, 120000);
//=====// UptimeEtme \\=====\\

//=====// Seste Tutma \\=====\\
const { joinVoiceChannel } = require('@discordjs/voice')
client.on('ready', () => {
    let channel = client.channels.cache.get("1255453742845923369")


    const VoiceConnection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator
    });
})
//=====// Seste Tutma \\=====\\

//=====// Aktif Log \\=====\\
const links = db.fetch("UptimeLink");

client.on('ready', () => {
    const channel = client.channels.cache.get('1199989968404230228'); // Kanal ID'sini girin
    if (channel) {
        const now = moment();
        const formattedTime = now.format('YYYY-MM-DD HH:mm:ss'); // Başlangıç zamanını formatlıyoruz
        channel.send(`<a:aktif:1257083439950204939> **KentosUptime  》**\n
<:online:1263426864609890365> **KentosUptime Aktif** \n
<:sistem:1263426319828521041> **KentosUptime Version: 0.0.6** \n
<:baglanti:1263410521495834737>** KentosUptime Ping ${client.ws.ping}ms** \n
**Uptime Edilen Link: Algılanamadı** \n
<:tarihemoji:1263411436667797524> **Tarih: ${formattedTime}**`); // Başlangıç zamanını mesajda gösteriyoruz
    }
});

client.on('reconnecting', () => {
    const channel = client.channels.cache.get('1199989968404230228'); // Kanal ID'sini girin
    if (channel) channel.send('Bot tekrar bağlanıyor...'); // Bot tekrar bağlandığında mesaj gönderiyoruz
});

client.on('disconnect', () => {
    const channel = client.channels.cache.get('1199989968404230228'); // Kanal ID'sini girin
    if (channel) channel.send('<a:aktiflikler4:1257083506195173436> KentosUptime 》bağlantısı kesildi!'); // Bot bağlantısı kesildiğinde mesaj 
});

//=====// Shard \\=====\\
