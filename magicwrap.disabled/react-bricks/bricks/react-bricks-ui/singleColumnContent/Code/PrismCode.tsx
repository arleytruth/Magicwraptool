'use client'

import * as prism from 'prismjs'
import * as React from 'react'
import Styles from './Styles'

interface PrismCodeProps {
  code: string
  plugins: string[]
  language: string
  dataLine?: string
}

const PrismCode: React.FC<PrismCodeProps> = ({
  code,
  plugins,
  language,
  dataLine,
}) => {
  const codeRef = React.useRef(null)

  const highlight = () => {
    if (codeRef && codeRef.current) {
      prism.highlightElement(codeRef.current!)
    }
  }

  React.useEffect(() => {
    highlight()
  }, [dataLine])

  const dataLineObj = dataLine ? { 'data-line': dataLine } : {}

  return (
    <>
      <Styles />
      <style
        dangerouslySetInnerHTML={{
          __html: `
    .dark pre {
      background-color: #1f2937;
    }
    .line-highlight {
      background: rgba(255,255,255,0.4);
    }
    .line-highlight:before {
      content: '';
    }
  `,
        }}
      ></style>
      <pre
        className={`rounded-lg ${!plugins ? '' : plugins.join(' ')}`}
        {...dataLineObj}
      >
        <code ref={codeRef} className={`language-${language}`}>
          {code.trim()}
        </code>
      </pre>
    </>
  )
}

export default PrismCode
