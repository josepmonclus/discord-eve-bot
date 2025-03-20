module.exports = {
    name: 'ready',
    once: true, // Se ejecuta solo una vez cuando el bot se inicia
    execute(client) {
      console.log(`Ready! Logged in as ${client.user.tag}`);
    }
  };