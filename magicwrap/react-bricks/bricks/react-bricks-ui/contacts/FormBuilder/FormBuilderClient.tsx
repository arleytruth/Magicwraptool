'use client'

import { useContext } from 'react'
// import { useSubmit } from '@formspree/react'

import { FormBuilderContext } from './FormBuilderProvider'

export interface FormBuilderClientProps {
  formspreeFormId: string
  successMessage: string
  children: any
}

const FormBuilderClient: React.FC<FormBuilderClientProps> = ({
  formspreeFormId,
  successMessage,
  children,
}) => {
  const { register, setError, handleSubmit, errors, isSubmitSuccessful } =
    useContext(FormBuilderContext)

  // const onSubmit = useSubmit(formspreeFormId, {
  //   onError(errs) {
  //     const formErrs = errs.getFormErrors()

  //     for (const { code, message } of formErrs) {
  //       setError &&
  //         setError(`root.${code}`, {
  //           type: code,
  //           message,
  //         })
  //     }

  //     const fieldErrs = errs.getAllFieldErrors()
  //     for (const [field, errs] of fieldErrs) {
  //       setError &&
  //         setError(field, {
  //           message: errs.map((e) => e.message).join(', '),
  //         })
  //     }
  //   },
  // })

  const onSubmit = () => console.log('SUBMITTED - ', formspreeFormId)

  if (!register || !handleSubmit) {
    return null
  }

  return (
    <>
      {isSubmitSuccessful ? (
        <h2 className="mt-6 text-xl leading-7 font-bold text-lime-600">
          {successMessage}
        </h2>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4 p-6"
        >
          {children}

          {errors && errors.root && (
            <div className="block">
              <ul className="error">
                {Object.values(errors.root).map((err) => {
                  if (typeof err !== 'object') {
                    return (
                      <li
                        key={err}
                        className="block mt-1 text-sm text-red-500 font-bold"
                      >
                        {err}
                      </li>
                    )
                  }
                  const { type, message } = err
                  return (
                    <li
                      key={type}
                      className="block mt-1 text-sm text-red-500 font-bold"
                    >
                      {message}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </form>
      )}
    </>
  )
}

export default FormBuilderClient
