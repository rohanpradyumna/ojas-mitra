import { Fragment } from 'react'

/** Renders copy where `*text*` marks italics — keeps content data free of markup. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {text
        .split('*')
        .map((part, i) =>
          i % 2 === 1 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>,
        )}
    </>
  )
}
