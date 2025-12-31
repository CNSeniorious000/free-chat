import type NumberFlow from 'number-flow'

import 'number-flow'
import { createEffect } from 'solid-js'

export default (props: { number: number }) => {
  let flowRef!: NumberFlow

  createEffect(() => {
    flowRef?.update?.(props.number)
  })

  return <number-flow ref={flowRef} />
}
