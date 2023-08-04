function csvToJson(csv) {
  const lines = csv.split('\n')
  const headers = lines[0].split('\t').slice(1)
  const output = {}

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    const values = line.split('\t')
    const key = values[0]

    output[key] = {}

    for (let j = 1; j < headers.length + 1; j++) {
      const header = headers[j - 1]
      const value = values[j].split('/')
      output[key][header] = value
    }
  }

  return JSON.stringify(output, null, 2)
}

const csv = `特殊星	子	丑	寅	卯	辰	巳	午	未	申	酉	戌	亥
駅馬	寅	亥	申	巳	寅	亥	申	巳	寅	亥	申	巳
咸池	酉	午	卯	子	酉	午	卯	子	酉	午	卯	子
劫殺	巳	寅	亥	申	巳	寅	亥	申	巳	寅	亥	申
亡神	亥	申	巳	寅	亥	申	巳	寅	亥	寅	巳	申
孤辰	寅	寅	巳	巳	巳	申	申	申	亥	亥	亥	寅
寡宿	戌	戌	丑	丑	丑	辰	辰	辰	未	未	未	戌
白虎	申	酉	戌	亥	子	丑	寅	卯	辰	巳	午	未
血刃	戌	酉	申	未	午	巳	辰	卯	寅	丑	子	亥
囚獄	午	卯	子	酉	午	卯	子	酉	午	卯	子	酉`
console.info(csvToJson(csv))
