'use client'

import * as Prism from 'prismjs'
import * as React from 'react'
import { getBlockValue, isAdmin } from 'react-bricks/rsc'
import { useVisualEdit } from 'react-bricks/rsc/client'

import { LayoutProps } from '../../LayoutSideProps'
import Container from '../../shared/components/Container'
import Section from '../../shared/components/Section'
import PrismCode from './PrismCode'
import Editor from './SimpleCodeEditor'
import Styles from './Styles'

require('prismjs/components/prism-typescript')
require('prismjs/components/prism-bash')
require('prismjs/components/prism-jsx')
require('prismjs/components/prism-tsx')
require('prismjs/plugins/line-numbers/prism-line-numbers.js')
require('prismjs/plugins/show-language/prism-show-language.js')
require('prismjs/plugins/line-highlight/prism-line-highlight.js')

export interface CodeProps extends LayoutProps {
  language: string
  dataline?: string
  showLineNumbers: boolean
}

const CodeClient: React.FC<CodeProps> = ({
  backgroundColor,
  borderTop,
  borderBottom,
  paddingTop,
  paddingBottom,
  width,
  language = 'javascript',
  dataline = '',
  showLineNumbers = false,
}) => {
  const [value, setValue] = React.useState('')
  const [hasMount, setHasMount] = React.useState(false)

  const [valueVisualEdit, onChange, isReadOnly] = useVisualEdit('code')
  const code = getBlockValue('code')

  React.useEffect(() => {
    setHasMount(true)
  }, [])

  React.useEffect(() => {
    if (isAdmin()) {
      setValue(valueVisualEdit)
    } else {
      setValue(code)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueVisualEdit])

  const plugins = []
  if (showLineNumbers) {
    plugins.push('line-numbers')
  }
  if (dataline !== '') {
    plugins.push('line-highlight')
  }

  if (!hasMount) {
    return null
  }

  if (isReadOnly) {
    return (
      <Section
        backgroundColor={backgroundColor}
        borderTop={borderTop}
        borderBottom={borderBottom}
      >
        <Styles />
        <Container
          size={width}
          paddingTop={paddingTop}
          paddingBottom={paddingBottom}
        >
          <style>{`
        .dark pre {
          background-color: #1f2937;
        }
        .line-highlight {
          background: rgba(255,255,255,0.4);
        }
        .line-highlight:before {
          content: '';
        }
      `}</style>
          <PrismCode
            code={value}
            language={language}
            plugins={plugins}
            dataLine={dataline}
          />
        </Container>
      </Section>
    )
  }

  return (
    <Section
      backgroundColor={backgroundColor}
      borderTop={borderTop}
      borderBottom={borderBottom}
    >
      <Styles />
      <style>{`
        .dark pre {
          background-color: #1f2937;
        }
      `}</style>
      <Container paddingTop={paddingTop} paddingBottom={paddingBottom}>
        <pre className={`rounded-lg language-${language}`}>
          <code className={`language-${language}`}>
            <Editor
              value={value}
              onValueChange={onChange}
              highlight={(code: any) => {
                return Prism.highlight(
                  code || '',
                  Prism.languages[language],
                  `${language}`
                )
              }}
              padding={10}
              textareaId="codeArea"
              className={showLineNumbers ? 'editor-line-number' : ''}
            />
          </code>
        </pre>
      </Container>
    </Section>
  )
}

export default CodeClient
