
const Discord = require("discord.js");


const client = new Discord.Client();

const Enmap = require('enmap');

const blacklist = new Enmap({ name: 'blacklist', persistent: true });

const config = require("./config.json");

const embed = new Discord.RichEmbed()

//var google = require('google')

//const GoogleImages = require('google-images')

//const gimage = new GoogleImages(config.api3, config.api4)

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}


client.on("ready", () => {

  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds, bot is to be used for only **TCHOR PURPOSES!** Anyone entering the source unvalidated and caught will be issued consequences, let's-a get-a going-a again-a VERSION 1.0.7`);

  client.user.setGame(`with souls in ${client.guilds.size} servers CURRENT VERSION: 2.0 ;)`);
});

client.on("guildCreate", guild => {

  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setGame(`with souls in ${client.guilds.size} servers CURRENT VERSION: 2.0 ;)`);
});

client.on("guildDelete", guild => {

  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setGame(`with souls in ${client.guilds.size} servers CURRENT VERSION: 2.0 ;)`);
});


client.on("message", async message => {



  if(message.author.bot) return;


  if(message.content.indexOf(config.prefix) !== 0) return;


  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Let's go with a few common example commands! Feel free to delete or change those.

  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("AAAAAAAAAAAAAPING?");
    m.edit(`Where there's ping, there's pong. Latency =  ${m.createdTimestamp - message.createdTimestamp}ms. API Latency = ${Math.round(client.ping)}ms`);
  }

  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use.
    // To get the "message" itself we join the `args` back into a string with spaces:
    const sayMessage = args.join(" ");
    // And we get the bot to say the thing:
    message.channel.send(sayMessage);
  }

  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit:
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["Administrator", "Moderator", "Mod", "Admin", "Owner", "Leader", "KickPerms", "administrator", "mod", "admin", "kickperms", "moderator", "leader"].includes(r.name)) )
      return message.reply("Hey there! You can't touch that command without permission! *(See bot documents)*");


    let member = message.mentions.members.first();
    if(!member)
      return message.reply("You gotta mention a valid user.");
    if(!member.kickable)
      return message.reply("I'm not allowed to **kick** this user... Do they have a higher role than me, or do I just have no permissions?");


    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("You gotta specify why I'm kicking this user.")

    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }

  if(command === "ban") {

    if(!message.member.roles.some(r=>["Administrator", "Admin", "Owner", "Leader", "BanPerms"].includes(r.name)) )
      return message.reply("Hey there! You can't touch that command without permission! *(See bot documents)*");

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("You gotta mention a valid user.");
    if(!member.bannable)
      return message.reply("I'm not allowed to **ban** this user... Do they have a higher role than me, or do I just have no permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("No reason, no unban. :sunglasses:");

    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }


  if(command === "purge") {

    if(!message.member.roles.some(r=>["Administrator", "Moderator", "Mod", "Admin", "Owner", "Leader", "KickPerms", "administrator", "mod", "admin", "kickperms", "moderator", "leader"].includes(r.name)) )
      return message.reply("Hey there! You can't touch that command without permission! *(See bot documents)*");
      const user = message.mentions.users.first();
      const amount = !!parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2])
      if (!amount) return message.reply('Must specify an amount to delete!');
      if (!amount && !user) return message.reply('Must specify a user and amount, or just an amount, of messages to purge!');
      message.channel.fetchMessages({
       limit: amount,
      }).then((messages) => {
       if (user) {
       const filterBy = user ? user.id : Client.user.id;
       messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
       }
       message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
      });
  };
  if (command === "8ball") {
    message.channel.sendMessage(doMagic8BallVoodoo())
}
  function doMagic8BallVoodoo() {
    var rand = [':8ball: 100% NO', ':8ball: Definitely not :thinking:.', ':8ball: Yep definitely..', ':8ball: Impossible.', ':8ball: Of course.', ':8ball: Sure.', ':8ball: It is true.', ':8ball: It is not true.', ':8ball: I am very undoubtful of that.', ':8ball: yeah youre trusting an 8ball to answer this?', ':8ball: Sources point to no.', ':8ball: Theories prove it.', ':8ball: Reply hazy try again', ':8ball: Ask again later', ':8ball: Better not tell you now', ':8ball: Cannot predict now', ':8ball: Concentrate and ask again'];

    return rand[Math.floor(Math.random()*rand.length)];
  };
  if (command === "invite") {
        message.channel.sendMessage("Use this link to invite Tobama to your server! https://discordapp.com/oauth2/authorize?client_id=374205861830328321&scope=bot&permissions=403041302")
    }

if (command === "version") {
  message.channel.sendMessage("I'm currently on version 2.0! Tune in for more updates.")
}
if (command === "server") {
  message.channel.sendMessage("By joining the bot's discord server, you can talk directly to the developers of the bot. Here's the invite - https://discord.gg/GtFgfdp")
}
if (command === "help") {
  const embed = new Discord.RichEmbed()
  .setTitle("Tobama help commands ;)")
  .setAuthor("Tobama", "https://cdn.discordapp.com/avatars/374205861830328321/9790c5256a4ace59195cf6d33fd4ee19.png?size=128")
  /*
   * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
   */
  .setColor(0x660000)
  .setDescription("Here are the help commands for Tobama! Hope this helps you.")
  .setFooter("tobama help.exe xdd")
  /*
   * Takes a Date object, defaults to current date.
   */
  .setTimestamp()
  .setURL("https://discord.gg/ypJBXpd")
  .addField(config.prefix + "help",
    "Displays this.")
  /*
   * Inline fields may not display as inline if the thumbnail and/or image is too big.
   */
   .addField(config.prefix + "server",
     "Sends discord server invite link, use with care.")
//   * Blank field, useful to create some space.
  // */
   .addField(config.prefix + "evaluate",
     "evaluate some hot java code :sunglasses:")
    .addField(config.prefix + "ping",
       "isn't it nice to just check your ping sometimes? :thinking:")
    .addField(config.prefix + "topic",
         "Displays a fairly random topic, all hardcoded, so let's not get judgemental.")
    .addField(config.prefix + "evaluate {QUESTION}",
           "Ask the 8ball a question.")
    .addField(config.prefix + "modhelp",
                  "Displays the moderator and administrator commands")
    .addField(config.prefix + "say",
                  "Makes the bot say a message.")
    .addField(config.prefix + "invite", "Grabs Tobama's invite code")
  message.channel.send({embed});
}
if (command === "evaluate") {
  message.channel.sendMessage("access denied only cool people can evaluate this code :sunglasses:")
  message.channel.sendMessage("`EVALUATING JAVASCRIPT AND NOT KNOWING WHAT YOU ARE DOING IS POTENTIALLY DANGEROUS, UNAUTHORIZED ACCESS COULD RESULT IN A TRAVESTY`")
}
if (command === "topic") {
  message.channel.sendMessage(topic())
}
function topic() {
  var rand = ["If you could be anywhere in the world right now, where would that place be?", "Do you have any pets? If yes, how many and what are they?", "If you saw a wallet on the floor, containing someones cards, drivers license and other valuables, what do you do?", "Who, in this server, would have your vote in a presidential election?", "Are there any household chores you secretly enjoy? Which ones — and why?", "Are there any laws or social rules that completely baffle you?", "Are you afraid of flying in airplanes? (How come?)", "Do you have a morning ritual?", "Do you have any irrational fears?", "Have you ever won an award? What was it for?", "What is something that is popular now that annoys you?", "Who is your oldest friend? Where did you meet them?", "What’s the best / worst thing about your work / school?", "Are you an outdoor or indoor person :sunglasses:", "**R MEMES DREEMS?**", "What was the best birthday wish or gift you’ve ever received?" ];

  return rand[Math.floor(Math.random()*rand.length)];
}
if (command === "warn") {
  if(!message.member.roles.some(r=>["Administrator", "Moderator", "Mod", "Admin", "Owner", "Leader", "KickPerms", "administrator", "mod", "admin", "kickperms", "moderator", "leader"].includes(r.name)) )
    return message.reply("Hey there! You can't touch that command without permission! *(See bot documents)*");

  let reason = args.slice(1).join(' ');
  let user = message.mentions.users.first();
  let modlog = client.channels.find('name', 'mod-log');
  if (!modlog) return message.reply('I cannot find a mod-log channel');
  if (reason.length < 1) return message.reply('You must supply a reason for the warning.');
  if (message.mentions.users.size < 1) return message.reply('You must mention someone to warn them.').catch(console.error);
  const embed = new Discord.RichEmbed()
  .setColor(0x00AE86)
  .setTimestamp()
  .addField('Action:', 'Warning')
  .addField('User:', `${user.username}#${user.discriminator}`)
  .addField('Moderator:', `${message.author.username}#${message.author.discriminator}`)
  .addField('Reason', reason);
  return client.channels.get(modlog.id).sendEmbed(embed);
  message.author.sendMessage('You have been warned for.', reason);
};
if  (command === "reload") {
  if(!message.member.roles.some(r=>["Administrator", "Moderator", "Mod", "Admin", "Owner", "Leader", "KickPerms", "administrator", "mod", "admin", "kickperms", "moderator", "leader"].includes(r.name)) )
    return message.reply("Hey there! You can't touch that command without permission! *(See bot documents)*");

  let command;
if (client.commands.has(args[0])) {
  command = args[0];
} else if (client.aliases.has(args[0])) {
  command = client.aliases.get(args[0]);
}
if (!command) {
  return message.channel.send(`I cannot find the command: ${args[0]}`);
} else {
  message.channel.send(`Reloading: ${command}`)
    .then(m => {
      client.reload(command)
        .then(() => {
          m.edit(`Successfully reloaded: ${command}`);
        })
        .catch(e => {
          m.edit(`Command reload failed: ${command}\n\`\`\`${e.stack}\`\`\``);
        });
    });
}
};

if (command === "mute") {
  if(!message.member.roles.some(r=>["Administrator", "Moderator", "Mod", "Admin", "Owner", "Leader", "KickPerms", "administrator", "mod", "admin", "kickperms", "moderator", "leader"].includes(r.name)) )
    return message.reply("Hey there! You can't touch that command without permission! *(See bot documents)*");

  let reason = args.slice(1).join(' ');
let user = message.mentions.users.first();
let modlog = client.channels.find('name', 'mod-log');ask
let muteRole = client.guilds.get(message.guild.id).roles.find('name', 'Muted');
if (!modlog) return message.reply('I cannot find a mod-log channel').catch(console.error);
if (!muteRole) return message.reply('I cannot find a mute role').catch(console.error);
if (reason.length < 1) return message.reply('You must supply a reason for the mute.').catch(console.error);
if (message.mentions.users.size < 1) return message.reply('You must mention someone to mute them.').catch(console.error);
const embed = new Discord.RichEmbed()
  .setColor(0x00AE86)
  .setTimestamp()
  .addField('Action:', 'Un/Mute')
  .addField('User:', `${user.username}#${user.discriminator}`)
  .addField('Moderator:', `${message.author.username}#${message.author.discriminator}`);

if (!message.guild.member(client.user).hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) return message.reply('I do not have the correct permissions.').catch(console.error);

if (message.guild.member(user).roles.has(muteRole.id)) {
  message.guild.member(user).removeRole(muteRole).then(() => {
    client.channels.get(modlog.id).sendEmbed(embed).catch(console.error);
  });
} else {
  message.guild.member(user).addRole(muteRole).then(() => {
    client.channels.get(modlog.id).sendEmbed(embed).catch(console.error);
  });
}

};

client.on("message", message => {
  const args = message.content.split(" ").slice(1);

  if (message.content.startsWith(config.prefix + "eval")) {
    if(message.author.id !== config.ownerID) return;
    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }

  client.on("message", message => {
    const args = message.content.split(" ").slice(1);

    if (message.content.startsWith(config.prefix + "eval2")) {
      if(message.author.id !== "254313220343332874") return;
      try {
        const code = args.join(" ");
        let evaled = eval(code);

        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);

        message.channel.send(clean(evaled), {code:"xl"});
      } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      }
    }
  });
});
});

client.login(config.token);
