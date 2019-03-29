import { Node } from '../../Node'
import { StringNode } from '.'
import { BooleanNode } from './BooleanNode'
import { NumberNode } from './NumberNode'
import { Selection } from '../../selections'

export type IScalarNodeOptions = {
  name?: string
}

export type UScalarNode =
  | StringNode<any>
  | BooleanNode<any>
  | NumberNode<any>
  | ScalarNode<any>

export class ScalarNode<T extends string | boolean | number> extends Node<T> {
  public data: T
  public name?: string

  constructor({ name }: IScalarNodeOptions = {}) {
    super()
    this.name = name
  }

  protected proxyGetter(prop: string) {}

  public getData(selection: Selection<any>) {
    return new Proxy(
      {},
      {
        get: (_, prop: string) => this.proxyGetter(prop),
      }
    )
  }
}
