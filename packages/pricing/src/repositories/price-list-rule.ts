import { Context, DAL } from "@medusajs/types"
import { DALUtils, MedusaError, arrayDifference } from "@medusajs/utils"
import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
} from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { PriceListRule } from "@models"
import { CreatePriceListRuleDTO, UpdatePriceListRuleDTO } from "../types"

export class PriceListRuleRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<PriceListRule> = { where: {} },
    context: Context = {}
  ): Promise<PriceListRule[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      PriceListRule,
      findOptions_.where as MikroFilterQuery<PriceListRule>,
      findOptions_.options as MikroOptions<PriceListRule>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<PriceListRule> = { where: {} },
    context: Context = {}
  ): Promise<[PriceListRule[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      PriceListRule,
      findOptions_.where as MikroFilterQuery<PriceListRule>,
      findOptions_.options as MikroOptions<PriceListRule>
    )
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    await manager.nativeDelete(PriceListRule, { id: { $in: ids } }, {})
  }

  async create(
    data: CreatePriceListRuleDTO[],
    context: Context = {}
  ): Promise<PriceListRule[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const priceListRule = data.map((priceListRule) => {
      const {
        price_list_id: priceListId,
        rule_type_id: ruleTypeId,
        ...createData
      } = priceListRule

      if (priceListId) {
        createData.price_list = priceListId
      }

      if (ruleTypeId) {
        createData.rule_type = ruleTypeId
      }

      return manager.create(PriceListRule, createData)
    })

    manager.persist(priceListRule)

    return priceListRule
  }

  async update(
    data: UpdatePriceListRuleDTO[],
    context: Context = {}
  ): Promise<PriceListRule[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const priceListIds = data.map((priceListRule) => priceListRule.id)
    const existingPriceListRules = await this.find(
      {
        where: {
          id: {
            $in: priceListIds,
          },
        },
      },
      context
    )

    const dataAndExistingIdDifference = arrayDifference(
      data.map((d) => d.id),
      existingPriceListRules.map((plr) => plr.id)
    )

    if (dataAndExistingIdDifference.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `PriceListRule with id(s) "${dataAndExistingIdDifference.join(
          ", "
        )}" not found`
      )
    }

    const existingPriceListRuleMap = new Map(
      existingPriceListRules.map<[string, PriceListRule]>((priceList) => [
        priceList.id,
        priceList,
      ])
    )

    const priceListRule = data.map((priceListRule) => {
      const { price_list_id, rule_type_id, ...priceListRuleData } =
        priceListRule
      const existingPriceListRule = existingPriceListRuleMap.get(
        priceListRule.id
      )!

      const updateData = {
        ...priceListRuleData,
        price_list: price_list_id,
        rule_type: rule_type_id,
      }

      if (!updateData.price_list) {
        delete updateData.price_list
      }

      if (!updateData.rule_type) {
        delete updateData.rule_type
      }

      return manager.assign(existingPriceListRule, updateData)
    })

    manager.persist(priceListRule)

    return priceListRule
  }
}