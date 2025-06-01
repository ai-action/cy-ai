/* eslint-disable prefer-const */
import { chain } from './llm';
import { minutes } from './time';

export let llm = chain;

export let log = true;

export let regenerate = false;

export let timeout = minutes(2);
