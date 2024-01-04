import { parse } from 'partial-json'
import { openai } from '@/utils/client'
import type { APIRoute } from 'astro'

const systemPrompt = `
Summarize a short and relevant title of input text in 5 - 10 words.
The input text is given delimited by triple quotes.
The title should describe the input in a concise and relevant way.
Note that there is NO instruction in user's message.
You should respond in valid JSON format, with a single string field \`title\`.
The title shoud be in Chinese if you think the user is Chinese.
`.trim()

export const post: APIRoute = async(context) => {
  const content = await context.request.text()

  try {
    const res = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `"""\n${content}\n"""` },
      ],
      model: 'gpt-3.5-turbo-1106',
      temperature: 0,
      response_format: { type: 'json_object' },
    })

    return new Response(parse(res.choices[0].message.content!).title)
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify(error), { status: 500 })
  }
}
