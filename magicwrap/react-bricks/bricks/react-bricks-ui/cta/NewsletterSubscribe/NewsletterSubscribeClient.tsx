'use client'

import classNames from 'classnames'
import { validate } from 'email-validator'
import jsonp from 'jsonp'
import React from 'react'
import { RichText, Text, types } from 'react-bricks/rsc'

import { LayoutProps } from '../../LayoutSideProps'
import { textColors } from '../../colors'
import Container from '../../shared/components/Container'
import Section from '../../shared/components/Section'

export enum NewsletterProvider {
  MailChimp = 'MAILCHIMP',
  ConvertKit = 'CONVERTKIT',
}

export interface NewsletterProps extends LayoutProps {
  provider: NewsletterProvider
  mailchimpUrl: string
  resultOkText: string
  title: types.TextValue
  text: types.TextValue
  text2: types.TextValue
  buttonText: types.TextValue
}

interface IStatus {
  status: string
  message: string
}

const Newsletter: React.FC<NewsletterProps> = ({
  backgroundColor,
  provider,
  mailchimpUrl,
  resultOkText = `Thanks,you're all signed up!`,
  title,
  text,
  text2,
  buttonText,
}) => {
  const [email, setEmail] = React.useState('')
  const [status, setStatus] = React.useState<IStatus>({
    status: 'IDLE',
    message: '',
  })
  const sendData = (url: string) => {
    setStatus({ status: 'SENDING', message: '' })
    jsonp(url, { param: 'c', timeout: 3500 }, (err: any, data: any) => {
      if (err) {
        setStatus({
          status: 'ERROR',
          message: 'An error occurred. Please, try again.',
        })
      } else if (data.msg.includes('already subscribed')) {
        setStatus({ status: 'ERROR', message: 'You were already subscribed' })
      } else if (data.result !== 'success') {
        setStatus({
          status: 'ERROR',
          message: 'An error occurred. Please, try again.',
        })
      } else {
        setStatus({ status: 'SUCCESS', message: '' })
      }
    })
  }
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    /*
    if (provider !== NewsletterProvider.MailChimp) {
      setStatus({
        status: 'ERROR',
        message: 'Provider not implemented',
      })
      return
    }
    */
    const isEmailValid = validate(email)

    if (!isEmailValid) {
      setStatus({
        status: 'ERROR',
        message: 'Please, enter a valid email address',
      })
      return
    }

    if (
      !mailchimpUrl ||
      mailchimpUrl.length < 10 ||
      mailchimpUrl.indexOf('post') === -1
    ) {
      setStatus({
        status: 'ERROR',
        message: 'Invalid Mailchimp URL',
      })
      return
    }

    const emailEncoded = encodeURIComponent(email)
    const endpoint = mailchimpUrl.replace(/\/post/g, '/post-json')
    const url = `${endpoint}?EMAIL=${emailEncoded}`
    sendData(url)
  }

  return (
    <Section backgroundColor={backgroundColor}>
      <Container size="small">
        <div
          className="p-[30px] rounded-[5px] bg-white dark:bg-white/10 dark:border dark:border-white/30"
          style={{
            boxShadow:
              'rgb(0 0 0 / 10%) 0px 1px 3px 0px, rgb(0 0 0 / 5%) 0px 5px 15px 0px',
          }}
        >
          <div>
            <Text
              propName="title"
              value={title}
              renderBlock={(props) => (
                <h3
                  className={classNames(
                    'mb-1 font-bold leading-5',
                    textColors.GRAY_800
                  )}
                  {...props.attributes}
                >
                  {props.children}
                </h3>
              )}
              placeholder="type a title..."
            />
            <RichText
              propName="text"
              value={text}
              placeholder="Type a text..."
              renderBlock={(props) => (
                <span
                  className="text-sm leading-6 dark:text-gray-300"
                  {...props.attributes}
                >
                  {props.children}
                </span>
              )}
            />
          </div>
          <div className="block items-center mt-3 sm:flex">
            {(status.status === 'IDLE' || status.status == 'ERROR') && (
              <form className="mr-5 sm:mb-0 mb-3 flex" onSubmit={handleSubmit}>
                <div className="relative sm:w-full w-[200px]">
                  <svg
                    viewBox="0 0 14 14"
                    width="14px"
                    height="14px"
                    className="absolute left-4 top-1/2 -mt-[7px] z-10"
                  >
                    <path
                      fill="#9ca3af"
                      d="M0 2.5c0-.27.22-.5.5-.5h13c.28 0 .5.23.5.5v9a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5v-9Zm1 1.02V11h12V3.52L7.31 7.89a.5.5 0 0 1-.52.07.5.5 0 0 1-.1-.07L1 3.52ZM12.03 3H1.97L7 6.87 12.03 3Z"
                    ></path>
                  </svg>
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                      className="focus:outline-hidden dark:bg-black rounded-l-[5px] py-2.5 px-[15px] pl-10 text-sm dark:text-white border border-r-0 dark:border-white/50 focus:border-sky-500 dark:focus:border-sky-700"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="rounded-r-[5px] z-11 relative text-white text-center bg-sky-500 py-[9px] px-[20px] transition-all ease-out hover:-translate-y-[2px] hover:shadow-lg duration-150"
                >
                  <Text
                    propName="buttonText"
                    value={buttonText}
                    placeholder="Action"
                    renderBlock={(props) => (
                      <span
                        className="text-center dark:text-white"
                        {...props.attributes}
                      >
                        {props.children}
                      </span>
                    )}
                  />
                </button>
              </form>
            )}

            {status.status === 'SUCCESS' && (
              <div className="p-2.5 mr-5 text-sm text-center font-bold bg-green-200 rounded-[5px] min-w-[270px]">
                👍
                {resultOkText}
              </div>
            )}

            <div>
              <RichText
                propName="text2"
                value={text2}
                placeholder="Type a text..."
                renderBlock={({ children }) => (
                  <p className="text-gray-500 dark:text-gray-300 text-sm leading-[18px] min-w-[100px]">
                    {children}
                  </p>
                )}
              />
            </div>
          </div>
          {status.status === 'ERROR' && (
            <div className="mt-4" style={{ color: '#c00' }}>
              {status.message}
            </div>
          )}
        </div>
      </Container>
    </Section>
  )
}

export default Newsletter
