const express = require('express')
const deepl = require('deepl-node')
const { AssemblyAI } = require('assemblyai')

require('dotenv').config()

const authKey = process.env.DEEPL_API_KEY
const translator = new deepl.Translator(authKey);

const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY})

const app = express()
const port = 3000

app.use(express.static('public'))
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/token', async (req, res) => {
    const token = await client.realtime.createTemporaryToken({ expires_in: 300 })
    res.json({ token })
})

app.post('/translate', async (req, res) => {
  const { text, target_lang } = req.body
  const translation = await translator.translateText(text, 'en', target_lang)
  res.json({ translation })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})