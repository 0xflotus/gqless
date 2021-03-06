import {
  Fragment,
  getAccessor,
  NodeContainer,
  ObjectNode,
  fragmentOn,
  Abstract,
  FragmentAccessor,
} from 'gqless'
import { useMemo } from 'react'
import { invariant } from '@gqless/utils'
import { useComponentMemo } from './useComponentMemo'

type OfType<TData, TTypename> = TData extends { __typename: TTypename }
  ? TData
  : never

/**
 * Creates a new fragment (same across all instances of component)
 */
export function useFragment<
  TData extends { __typename: string },
  TTypename extends TData['__typename'] = never
>(
  data: TData,
  onType?: TTypename,
  fragmentName?: string
): OfType<TData, TTypename> extends never ? TData : OfType<TData, TTypename> {
  let accessor = getAccessor(data)

  if (accessor instanceof FragmentAccessor) {
    accessor = accessor.parent
  }

  const node = useMemo(() => {
    const node =
      accessor.node instanceof NodeContainer
        ? accessor.node.innerNode
        : accessor.node

    if (onType) {
      if (node instanceof Abstract) {
        const implementation = node.implementations.find(
          node => node.toString() === onType
        )
        if (implementation) return implementation
      }

      invariant(
        node.toString() === onType,
        `'${onType}' is not a valid subtype of ${node}`
      )
    }

    return node
  }, [accessor.node, onType]) as ObjectNode

  const fragment = useComponentMemo(() => new Fragment(node, fragmentName), [
    node,
  ])

  useMemo(() => {
    fragment.name = fragmentName
  }, [fragment, fragmentName])

  const fragmentData = useMemo(() => fragmentOn(accessor, fragment), [
    accessor,
    fragment,
  ])

  return fragmentData
}
