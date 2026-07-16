/* eslint-disable prefer-const */
import type { Runnable } from '@langchain/core/runnables'

import { chain } from './llm'
import { minutes } from './time'

export let llm: Runnable = chain

export let log = true

export let regenerate = false

export let timeout = minutes(2)
