exports.execute = async (client, interaction) => {

let exisit = await client.db.get(interaction.member.id)

if(exisit){
  await client.db.delete(interaction.member.id)
return interaction.reply({ content: "Your account is now unlinked to the Wild Rift account." });
}
else{
  return interaction.reply({ content: "Your account is not linked to a Wild Rift account yet." });
}

}



const { SlashCommandBuilder } = require('@discordjs/builders');
exports.data = new SlashCommandBuilder()
  .setName('delete')
  .setDescription('To unlink your account to the Wild Rift account.')