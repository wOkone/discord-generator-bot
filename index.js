const discord = require('discord.js')
const client = new discord.Client()
const settings = require('./settings.json')
const fs = require('fs')
client.commands = new discord.Collection()
client.on('message', message => {
  if(message.channel.id !== settings.channelid) return
  if(message.channel.type === 'dm')return
  if (message.type !== 'DEFAULT' || message.author.bot) return
  const args = message.content.trim().split(/ +/g)
  const commandName = args.shift().toLowerCase()
  if (!commandName.startsWith(settings.prefix)) return
  const command = client.commands.get(commandName.slice(settings.prefix.length))
  if (!command) return
  command.run(message, args, client)
})
fs.readdir('./commands', (err, files) => {
  if (err) throw err
  files.forEach(file => {
      if (!file.endsWith('.js')) return
      const command = require(`./commands/${file}`)
      client.commands.set(command.name, command)
  })
})
client.login(settings.token)