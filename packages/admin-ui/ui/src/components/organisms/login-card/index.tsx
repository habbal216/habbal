import { useState } from "react"
import { useAdminCreateUser, useAdminLogin } from "medusa-react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useWidgets } from "../../../providers/widget-provider"
import { useTranslation } from "react-i18next"
import InputError from "../../atoms/input-error"
import WidgetContainer from "../../extensions/widget-container"
import Button from "../../fundamentals/button"
import SigninInput from "../../molecules/input-signin"
import Medusa from "@medusajs/medusa-js"
import { MEDUSA_BACKEND_URL } from "../../../constants/medusa-backend-url"

type FormValues = {
  email: string
  password: string
}

type LoginCardProps = {
  toResetPassword: () => void
}

const LoginCard = ({ toResetPassword }: LoginCardProps) => {

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>()
  const navigate = useNavigate()
  const { mutate, isLoading } = useAdminLogin()
  const { t } = useTranslation()

  const { getWidgets } = useWidgets()

  const [isCustomer, setIsCustomer] = useState(true)

  const handleCreateUser = (access_token: any, values: any) => {
    const medusa = new Medusa({
      baseUrl: MEDUSA_BACKEND_URL,
      maxRetries: 3,
      apiKey: access_token,
    })
    // must be previously logged in or use api token
    medusa.admin.users
      .create({
        email: values.email,
        password: values.password,
        role: "member",
      })
      .then(({ user }) => {
        console.log(user.id)
        navigate("/a/products")
      })
  }

  const onSubmit = (values: FormValues) => {
    mutate(values, {
      onSuccess: () => {
        navigate("/a/products")
      },
      onError: () => {
        setError(
          "password",
          {
            type: "manual",
            message: t(
              "login-card-no-match",
              "These credentials do not match our records."
            ),
          },
          {
            shouldFocus: true,
          }
        )
      },
    })
  }

  const onRegister = (values: FormValues) => {
    const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
    medusa.admin.auth
      .getToken({
        email: "admin@habbal.com",
        password: "supersecret",
      })
      .then(({ access_token }) => {
        console.log(access_token)
        handleCreateUser(access_token, values)
      })
  }

  return (
    <>
      {isCustomer ? (
        <div className="gap-y-large flex flex-col">
          {getWidgets("login.before").map((w, i) => {
            return (
              <WidgetContainer
                key={i}
                widget={w}
                injectionZone="login.before"
                entity={undefined}
              />
            )
          })}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col items-center">
              <h1 className="inter-xlarge-semibold text-grey-90 mb-large text-[20px]">
                Log in to Habbal
              </h1>
              <div>
                <SigninInput
                  placeholder={t("login-card-email", "Email")}
                  {...register("email", { required: true })}
                  autoComplete="email"
                  className="mb-small"
                />
                <SigninInput
                  placeholder={t("login-card-password", "Password")}
                  type={"password"}
                  {...register("password", { required: true })}
                  autoComplete="current-password"
                  className="mb-xsmall"
                />
                <InputError errors={errors} name="password" />
              </div>
              <Button
                className="rounded-rounded inter-base-regular mt-4 w-[280px]"
                variant="secondary"
                size="medium"
                type="submit"
                loading={isLoading}
              >
                Continue
              </Button>
              <div className="inter-small-regular text-grey-50 mt-8 cursor-pointer">
                Don't have an account?{" "}
                <span
                  className="cursor-pointer"
                  onClick={() => setIsCustomer(false)}
                >
                  Create Account
                </span>
              </div>
              <span
                className="inter-small-regular text-grey-50 mt-8 cursor-pointer"
                onClick={toResetPassword}
              >
                {t("login-card-forgot-your-password", "Forgot your password?")}
              </span>
            </div>
          </form>

          {getWidgets("login.after").map((w, i) => {
            return (
              <WidgetContainer
                key={i}
                widget={w}
                injectionZone="login.after"
                entity={undefined}
              />
            )
          })}
        </div>
      ) : (
        <div className="gap-y-large flex flex-col">
          {getWidgets("login.before").map((w, i) => {
            return (
              <WidgetContainer
                key={i}
                widget={w}
                injectionZone="login.before"
                entity={undefined}
              />
            )
          })}
          <form onSubmit={handleSubmit(onRegister)}>
            <div className="flex flex-col items-center">
              <h1 className="inter-xlarge-semibold text-grey-90 mb-large text-[20px]">
                Create Customer Account
              </h1>
              <div>
                <SigninInput
                  placeholder={t("login-card-email", "Email")}
                  {...register("email", { required: true })}
                  autoComplete="email"
                  className="mb-small"
                />
                <SigninInput
                  placeholder={t("login-card-password", "Password")}
                  type={"password"}
                  {...register("password", { required: true })}
                  autoComplete="current-password"
                  className="mb-xsmall"
                />
                <InputError errors={errors} name="password" />
              </div>
              <Button
                className="rounded-rounded inter-base-regular mt-4 w-[280px]"
                variant="secondary"
                size="medium"
                type="submit"
                loading={isLoading}
              >
                Register
              </Button>
              <div className="inter-small-regular text-grey-50 mt-8 cursor-pointer">
                Already have an account?
                <span
                  className="cursor-pointer"
                  onClick={() => setIsCustomer(true)}
                >
                  Log in
                </span>
              </div>
            </div>
          </form>

          {getWidgets("login.after").map((w, i) => {
            return (
              <WidgetContainer
                key={i}
                widget={w}
                injectionZone="login.after"
                entity={undefined}
              />
            )
          })}
        </div>
      )}
    </>
  )
}

export default LoginCard
