import { execFile } from 'node:child_process'
import type { LanguageModel } from '../core/ports'

const args = ['-p', '--output-format', 'text', '--tools', '', '--no-session-persistence']

export function claudeCliModel(): LanguageModel {
  return {
    complete(prompt) {
      return new Promise((resolve, reject) => {
        const child = execFile('claude', args, (error, stdout) => {
          if (error) reject(error)
          else resolve(stdout.trim())
        })
        child.stdin?.end(prompt)
      })
    },
  }
}
