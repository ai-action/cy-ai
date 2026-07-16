/* eslint-disable prefer-const */
import type { AIMessage } from '@langchain/core/messages'
import type { Runnable } from '@langchain/core/runnables'

import { chain } from './llm'
import { minutes } from './time'

export let llm: Runnable<Record<string, string>, string | AIMessage> = chain

export let log = true

export let regenerate = false

export let timeout = minutes(2)
