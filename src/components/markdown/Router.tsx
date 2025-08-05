import type { Heading, InlineCode, Link, List, Node, Parent } from 'mdast'

import { type Accessor, Index, Match, Switch } from 'solid-js'
import { Dynamic } from 'solid-js/web'

import Fallback from './Fallback'
import Pre from './Pre'
import Table from './Table'
import Text from './Text'

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

export default function Router(props: { node: Node }) {
  const children = () => (props.node as Parent).children || []

  const renderChild = (child: Accessor<Node>) => {
    return <Router node={child()} />
  }

  return (
    <Switch fallback={<Fallback node={props.node} />}>

      <Match when={props.node.type === 'root'}>
        <Index each={children()}>
          {renderChild}
        </Index>
      </Match>

      <Match when={props.node.type === 'code'}>
        <Pre node={props.node as any} />
      </Match>

      <Match when={props.node.type === 'inlineCode'}>
        <code>{(props.node as InlineCode).value}</code>
      </Match>

      <Match when={props.node.type === 'link'}>
        <a href={(props.node as Link).url} title={(props.node as Link).title || undefined}>
          <Index each={children()}>
            {renderChild}
          </Index>
        </a>
      </Match>

      <Match when={props.node.type === 'table'}>
        <Table node={props.node as any} renderChild={renderChild} />
      </Match>

      <Match when={getTagName(props.node)}>
        <Dynamic component={getTagName(props.node)!}>
          <Index each={children()}>
            {renderChild}
          </Index>
        </Dynamic>
      </Match>

      <Match when={props.node.type === 'text'}>
        <Text text={(props.node as any).value as string} />
      </Match>

    </Switch>
  )
}
