module.exports = {
    name: 'ready',
    once: true, // Se ejecuta solo una vez cuando el bot se inicia
    async execute(client) {
      console.log(`Ready! Logged in as ${client.user.tag}`);

      // Registramos los SuperAdmins del bot
      await registerSuperAdmins(client)
      console.log('SuperAdmins registrados desde el evento ready!')
    }
};

async function registerSuperAdmins(client) {
  const db = client.db
	const superAdminsId = client.config.superAdminIds

  // Quitar superadmin si ya no está en la lista de superAdminIds
  const currentSuperAdmins = await db.User.findAll({where: { isSuperAdmin: true} })
  for(const user of currentSuperAdmins) {
    if(!superAdminsId.includes(user.id)) {
      await user.update({ isSuperAdmin: false })
      console.log(`Usuario ${user.username} (${user.id}) ha dejado de ser SuperAdmin`)
    }
  }

	for(const id of superAdminsId) {
    const discordUser = await client.users.fetch(id);

		const [user, created] = await db.User.findOrCreate({
			where: { id },
			defaults: {
        username: discordUser.username,
				isSuperAdmin: true
			}
		})

    if(!created) {
      await user.update({
        username: discordUser.username,
        isSuperAdmin: true
      })
    }

		console.log(`Usuario ${discordUser.username} (${id}) registrado como SuperAdmin`);
	}
}