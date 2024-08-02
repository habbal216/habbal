import { Controller, useFieldArray } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import PlusIcon from "../../../../../components/fundamentals/icons/plus-icon"
import TrashIcon from "../../../../../components/fundamentals/icons/trash-icon"
import InputField from "../../../../../components/molecules/input"
import { NestedForm } from "../../../../../utils/nested-form"

type DiamondType = {
  carat: string
  quantity: string
}

type GoldType = {
  carat: string
  gram: string
}

export type JewelryFormType = {
  gold: GoldType[]
  diamonds: DiamondType[]
  laborCost: string
  profitMargin: string
}

type Props = {
  form: NestedForm<JewelryFormType>
}

const PriceCalculator = ({ form }: Props) => {
  const { control, path, register } = form

  const {
    fields: diamonds,
    append: appendDiamond,
    remove: removeDiamond,
  } = useFieldArray({
    control,
    name: path("diamonds"),
    keyName: "fieldId",
    shouldUnregister: true,
  })

  const appendNewDiamond = () => {
    appendDiamond({ carat: "", quantity: "" })
  }

  const onDeleteDiamond = (index: number) => {
    removeDiamond(index)
  }

  const {
    fields: gold,
    append: appendGold,
    remove: removeGold,
  } = useFieldArray({
    control,
    name: path("gold"),
    keyName: "fieldId",
    shouldUnregister: true,
  })

  const appendNewGold = () => {
    appendGold({ carat: "", gram: "" })
  }

  const onDeleteGold = (index: number) => {
    removeGold(index)
  }

  return (
    <form className="space-y-4">
      <div className="mt-small">
        <div className="gap-y-xsmall grid grid-cols-1">
          <h3 className="inter-base-semibold">{"Gold Details"}</h3>
          {gold.map((field, index) => (
            <div key={field.fieldId} className="gap-x-xsmall grid grid-cols-[1fr_1fr_40px]">
              <Controller
                control={control}
                name={path(`gold.${index}.carat`)}
                render={({ field }) => (
                  <InputField
                    placeholder={"Carat"}
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name={path(`gold.${index}.gram`)}
                render={({ field }) => (
                  <InputField
                    placeholder={"Grams"}
                    {...field}
                  />
                )}
              />
              <Button
                variant="secondary"
                size="small"
                type="button"
                className="h-10"
                onClick={() => onDeleteGold(index)}
              >
                <TrashIcon size={20} className="text-grey-40" />
              </Button>
            </div>
          ))}
          <Button
            variant="secondary"
            size="small"
            className="mt-base h-10 w-full"
            type="button"
            onClick={appendNewGold}
          >
            <PlusIcon size={20} />
            <span>{"Add Gold Details"}</span>
          </Button>
        </div>
      </div>

      <div className="mt-small">
        <div className="gap-y-xsmall grid grid-cols-1">
          <h3 className="inter-base-semibold">{"Diamonds"}</h3>
          {diamonds.map((field, index) => (
            <div key={field.fieldId} className="gap-x-xsmall grid grid-cols-[1fr_1fr_40px]">
              <Controller
                control={control}
                name={path(`diamonds.${index}.carat`)}
                render={({ field }) => (
                  <InputField
                    placeholder={"Carat"}
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name={path(`diamonds.${index}.quantity`)}
                render={({ field }) => (
                  <InputField
                    placeholder={"Quantity"}
                    {...field}
                  />
                )}
              />
              <Button
                variant="secondary"
                size="small"
                type="button"
                className="h-10"
                onClick={() => onDeleteDiamond(index)}
              >
                <TrashIcon size={20} className="text-grey-40" />
              </Button>
            </div>
          ))}
          <Button
            variant="secondary"
            size="small"
            className="mt-base h-10 w-full"
            type="button"
            onClick={appendNewDiamond}
          >
            <PlusIcon size={20} />
            <span>{"Add Diamond"}</span>
          </Button>
        </div>
      </div>

      <div className="mt-small">
        <div className="gap-y-xsmall grid grid-cols-1">
          <div className="gap-x-xsmall grid grid-cols-[230px_1fr_40px]">
            <InputField
              placeholder={"Labor Cost"}
              label={"Labor Cost"}
              {...register(path("laborCost"))}
            />
          </div>
        </div>
      </div>

      <div className="mt-small">
        <div className="gap-y-xsmall grid grid-cols-1">
          <div className="gap-x-xsmall grid grid-cols-[230px_1fr_40px]">
            <InputField
              placeholder={"Profit Margin"}
              label={"Profit Margin"}
              {...register(path("profitMargin"))}
            />
          </div>
        </div>
      </div>
    </form>
  )
}

export default PriceCalculator