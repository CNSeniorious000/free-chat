import type { Node, TableCell, Table as TableNode } from 'mdast'

import { type Accessor, Index, type JSX } from 'solid-js'

export default function Table(props: {
  node: TableNode
  renderChild: (child: Accessor<Node>) => JSX.Element
}) {
  return (
    <table>
      <thead>
        <tr>
          <Index each={props.node.children[0].children as TableCell[]}>
            {cell => (
              <th>
                <Index each={cell().children}>
                  {child => props.renderChild(child)}
                </Index>
              </th>
            )}
          </Index>
        </tr>
      </thead>
      <tbody>
        <Index each={props.node.children.slice(1)}>
          {row => (
            <tr>
              <Index each={row().children as TableCell[]}>
                {cell => (
                  <td>
                    <Index each={cell().children}>
                      {child => props.renderChild(child)}
                    </Index>
                  </td>
                )}
              </Index>
            </tr>
          )}
        </Index>
      </tbody>
    </table>
  )
}
