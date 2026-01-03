// @ts-expect-error continuous has no types
import { continuous, type NumberFlow } from 'number-flow'
import 'number-flow'
import { createEffect } from 'solid-js'

export default (props: { number: number }) => {
  let flowRef!: NumberFlow

  createEffect(() => {
    flowRef?.update?.(props.number)
  })

  return <number-flow ref={flowRef} data-will-change plugins={[continuous]} />
}
