import type { Heading, List, Node, Parent } from 'mdast'
import type { Component } from 'solid-js'

import { For, Match, Switch } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import Fallback from './Fallback'
import InlineCode from './InlineCode'
import Link from './Link'
import Pre from './Pre'
import Table from './Table'

interface Props {
  node: Node
  OverrideCode?: Component<any> | null
  codeProps?: Record<string, any>
  inlineCodeProps?: Record<string, any>
}

function getTagName(node: Node): string | null {
  switch (node.type) {
    case 'heading':
      return `h${(node as Heading).depth}`
    case 'list':
      return (node as List).ordered ? 'ol' : 'ul'
    case 'listItem':
      return 'li'
    case 'strong':
      return 'strong'
    case 'emphasis':
      return 'em'
    case 'paragraph':
      return 'p'
    case 'blockquote':
      return 'blockquote'
    default:
      return null
  }
}

export default function Router({
  node,
  OverrideCode = null,
  codeProps = {},
  inlineCodeProps = {},
}: Props) {
  const children = () => (node as Parent).children || []

  const renderChild = (child: Node) => (
    <Router
      node={child}
      OverrideCode={OverrideCode}
      codeProps={codeProps}
      inlineCodeProps={inlineCodeProps}
    />
  )

  return (
    <Switch>
      <Match when={node.type === 'root'}>
        <For each={children()}>
          {renderChild}
        </For>
      </Match>

      <Match when={node.type === 'code'}>
        {(() => {
          const CodeComponent = OverrideCode || Pre
          return <CodeComponent node={node} {...codeProps} />
        })()}
      </Match>

      <Match when={node.type === 'inlineCode'}>
        <InlineCode node={node as any} {...inlineCodeProps} />
      </Match>

      <Match when={node.type === 'link'}>
        <Link node={node as any}>
          <For each={children()}>
            {renderChild}
          </For>
        </Link>
      </Match>

      <Match when={node.type === 'table'}>
        <Table node={node as any} renderChild={renderChild} />
      </Match>

      <Match when={getTagName(node) !== null}>
        {(() => {
          const tag = getTagName(node)!
          return (
            <Dynamic component={tag}>
              <For each={children()}>
                {renderChild}
              </For>
            </Dynamic>
          )
        })()}
      </Match>

      <Match when={node.type === 'text'}>
        {(node as any).value}
      </Match>

      <Match when={true}>
        <Fallback node={node} />
      </Match>
    </Switch>
  )
}
