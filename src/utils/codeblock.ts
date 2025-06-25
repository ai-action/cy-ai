import { AIMessage } from '@langchain/core/messages'

export function codeblock(response: string | AIMessage) {
  switch (true) {
    case typeof response === 'string':
      return extract(response)

    case response instanceof AIMessage:
      return extract(response.text)
  }
}

const regex = /```(javascript|js)?([\s\S]+?)```/

function extract(text: string) {
  return text.match(regex)?.[2]?.trim()
}
