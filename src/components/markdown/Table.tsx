import type { Node, TableCell, Table as TableNode, TableRow } from 'mdast'

import { type Accessor, Index, type JSX } from 'solid-js'

interface Props {
  node: TableNode
  renderChild: (child: Accessor<Node>) => JSX.Element
}

export default function Table({ node, renderChild }: Props) {
  const rows = node.children as TableRow[]
  const headerRow = rows[0]
  const bodyRows = rows.slice(1)

  return (
    <table>
      <thead>
        <tr>
          <Index each={headerRow.children as TableCell[]}>
            {cell => (
              <th>
                <Index each={cell().children}>
                  {child => renderChild(child)}
                </Index>
              </th>
            )}
          </Index>
        </tr>
      </thead>
      <tbody>
        <Index each={bodyRows}>
          {row => (
            <tr>
              <Index each={row().children as TableCell[]}>
                {cell => (
                  <td>
                    <Index each={cell().children}>
                      {child => renderChild(child)}
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
