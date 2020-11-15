const { Telegraf } = require('telegraf')
const Store = require('electron-store')

const start = (em) => {
  const store = new Store()
  let config = store.get()

  const configIntervalId = setInterval(() => {
    config = store.get()
  }, 10 * 1000)

  const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN)

  em.on('tg:newPosition', (data) => {
    const { symbol, side } = data
    bot.telegram.sendMessage(config.TELEGRAM_USER_ID, `Open ${symbol} ${side}`)
  })

  em.on('tg:closePosition', (data) => {
    const { symbol, side } = data
    bot.telegram.sendMessage(config.TELEGRAM_USER_ID, `Closed ${symbol} ${side}`)
  })

  em.on('testmessage', () => {
    bot.telegram.sendMessage(config.TELEGRAM_USER_ID, `Test`)
  })

  bot.launch()

  const stop = () => {
    clearInterval(configIntervalId)
    bot.stop()
  }

  return stop
}

module.exports = {
  start,
}
