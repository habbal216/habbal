import clsx from "clsx"
import { capitalize } from "lodash"
import { useAdminGetSession } from "medusa-react"
import React from "react"

type TableViewHeaderProps<T = string> = {
  views: T[]
  activeView?: T
  setActiveView?: (view: T) => void
}

const TableViewHeader: React.FC<TableViewHeaderProps> = ({
  views,
  activeView = views[0],
  setActiveView,
}) => {
  const { user } = useAdminGetSession()
  return (
    <div className="inter-large-semibold gap-x-base text-grey-40 flex">
      {user?.role === "admin" && (
        <>
          {" "}
          {views.map((k, i) => (
            <div
              key={i}
              className={clsx("cursor-pointer", {
                ["text-grey-90"]: k === activeView,
              })}
              onClick={() => {
                if (setActiveView) {
                  setActiveView(k)
                }
              }}
            >
              {capitalize(k)}
            </div>
          ))}{" "}
        </>
      )}
      {user?.role === "member" && (
        <div className={"text-grey-90"}>{capitalize(activeView)}</div>
      )}
    </div>
  )
}

export default TableViewHeader
