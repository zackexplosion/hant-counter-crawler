const PORT = 8082
module.exports = function (shipit) {
  require('shipit-deploy')(shipit)

  shipit.initConfig({
    default: {
      workspace: '/tmp/github-monitor',
      deployTo: '/app/cti-hant-counter-crawler',
      repositoryUrl: 'https://github.com/zackexplosion/hant-counter-crawler',
    },
    production: {
      servers: 'zack@YEE'
    }
  })

  shipit.on('deployed', async function () {
    try {
      await shipit.remote(`cd ${shipit.currentPath} && nvm use && yarn`)
    } catch (error) {
      console.log(error)
    }
    shipit.start('startApp')
  })

  shipit.task('startApp', async () => {
    const name = 'cti-hant-counter-crawler'
    const current_path = `${shipit.config.deployTo}/current`
    try {
      await shipit.remote(`DB_PATH=../db.json PORT=${PORT} pm2 start ${current_path}/index.js --name ${name}`)
    } catch (error) {
      await shipit.remote(`pm2 restart ${name}`)
    }
  })
}