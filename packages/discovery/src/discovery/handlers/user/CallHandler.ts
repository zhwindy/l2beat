import { ContractValue } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import * as z from 'zod'

import { DiscoveryLogger } from '../../DiscoveryLogger'
import { IProvider } from '../../provider/IProvider'
import { Handler, HandlerResult } from '../Handler'
import { getReferencedName, resolveReference } from '../reference'
import { EXEC_REVERT_MSG, callMethod } from '../utils/callMethod'
import { getFunctionFragment } from '../utils/getFunctionFragment'

export type CallHandlerDefinition = z.infer<typeof CallHandlerDefinition>
export const CallHandlerDefinition = z.strictObject({
  type: z.literal('call'),
  method: z.optional(z.string()),
  args: z.array(z.union([z.string(), z.number()])),
  ignoreRelative: z.optional(z.boolean()),
  pickFields: z.optional(z.array(z.string())),
  expectRevert: z.optional(z.boolean()),
  address: z.optional(z.string()),
})

export class CallHandler implements Handler {
  readonly dependencies: string[] = []
  readonly fragment: utils.FunctionFragment

  constructor(
    readonly field: string,
    private readonly definition: CallHandlerDefinition,
    abi: string[],
    readonly logger: DiscoveryLogger,
  ) {
    for (const arg of this.definition.args) {
      const dependency = getReferencedName(arg)
      if (dependency) {
        this.dependencies.push(dependency)
      }
    }
    const addressDependency = getReferencedName(this.definition.address)
    if (addressDependency) {
      this.dependencies.push(addressDependency)
    }
    const arity = definition.args.length
    this.fragment = getFunctionFragment(
      definition.method ?? field,
      abi,
      (x) => isViewFragment(x) && x.inputs.length === arity,
    )
  }

  getMethod(): string {
    return this.fragment.format(utils.FormatTypes.full)
  }

  async execute(
    provider: IProvider,
    currentContractAddress: EthereumAddress,
    previousResults: Record<string, HandlerResult | undefined>,
  ): Promise<HandlerResult> {
    const resolved = resolveDependencies(this.definition, previousResults)
    this.logger.logExecution(this.field, [
      'Calling ',
      `${this.fragment.name}(${resolved.args
        .map((x) => x.toString())
        .join(', ')})`,
    ])
    const callResult = await callMethod(
      provider,
      resolved.address ?? currentContractAddress,
      this.fragment,
      resolved.args,
      this.definition.pickFields,
    )

    if (this.definition.expectRevert && callResult.error === EXEC_REVERT_MSG) {
      return {
        field: this.field,
        value: 'EXPECT_REVERT',
        ignoreRelative: this.definition.ignoreRelative,
      }
    }

    return {
      field: this.field,
      ...callResult,
      ignoreRelative: this.definition.ignoreRelative,
    }
  }
}

function resolveDependencies(
  definition: CallHandlerDefinition,
  previousResults: Record<string, HandlerResult | undefined>,
): {
  method: string | undefined
  args: ContractValue[]
  address: EthereumAddress | undefined
} {
  const args = definition.args.map((x) => resolveReference(x, previousResults))
  const address = resolveReference(definition.address, previousResults)
  return {
    method: definition.method,
    args,
    address:
      address !== undefined ? EthereumAddress(address.toString()) : undefined,
  }
}

function isViewFragment(fragment: utils.FunctionFragment): boolean {
  return (
    fragment.stateMutability === 'view' ||
    fragment.stateMutability === 'pure' ||
    fragment.constant
  )
}
