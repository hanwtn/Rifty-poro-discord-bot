exports.execute = async (client, message, args) => {

let exisit = await client.db.get(message.author.id)

if(exisit){
  await client.db.delete(message.author.id)
return message.reply({ content: "Your account is now unlinked to the Wild Rift account." });
}
else{
  return message.reply({ content: "Your account is not linked to a Wild Rift account yet." });
}

}

exports.help = {
  name: "Delete",
  aliases: ["deleteprofile", "dp", "delete", "unlink"],
  usage: `delete`,
  info: "To unlink your account to the Wild Rift account."
}