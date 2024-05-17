const express = require('express')
const router = express.Router()
const dotenv = require('dotenv')
dotenv.config()
const OpenAI = require("openai")

const {
    REACT_APP_OPENAI_KEY,
    REACT_APP_PROJECT_ID,
    REACT_APP_ORG_ID
} = process.env

const openai = new OpenAI({
    organization: REACT_APP_ORG_ID,
    project: REACT_APP_PROJECT_ID,
    apiKey: REACT_APP_OPENAI_KEY
})

//Create new completion
router.post('/newMessage', async (req, res, next) => {
    try {
        const { messages } = req.body
        const completion = await openai.chat.completions.create({
            messages,
            model: "gpt-3.5-turbo",
        })

        const gptResponse = completion.choices[0]

        if (!gptResponse) return res.status(400).json('Error sending message')

        res.status(200).json(gptResponse)
    } catch (err) {
        console.error('Something went wrong!', err)
        res.status(200).json({ error: err })
    }
})

module.exports = router