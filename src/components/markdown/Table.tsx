import type { Table as TableNode, TableRow, TableCell } from 'mdast'
import type { Component } from 'solid-js'
import { For } from 'solid-js'

interface Props {
  node: TableNode
  renderChild: (child: any) => any
}

export default function Table({ node, renderChild }: Props) {
  const rows = node.children as TableRow[]
  const headerRow = rows[0]
  const bodyRows = rows.slice(1)

  return (
    <table class="markdown-table">
      <thead>
        <tr>
          <For each={headerRow.children as TableCell[]}>
            {(cell) => (
              <th>
                <For each={cell.children}>
                  {(child) => renderChild(child)}
                </For>
              </th>
            )}
          </For>
        </tr>
      </thead>
      <tbody>
        <For each={bodyRows}>
          {(row) => (
            <tr>
              <For each={row.children as TableCell[]}>
                {(cell) => (
                  <td>
                    <For each={cell.children}>
                      {(child) => renderChild(child)}
                    </For>
                  </td>
                )}
              </For>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  )
}