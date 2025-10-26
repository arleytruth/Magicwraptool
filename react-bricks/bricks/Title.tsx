import React from 'react'
import { types, Text } from 'react-bricks/rsc'

interface TitleProps {
  size?: 'h1' | 'h2' | 'h3'
}

const Title: types.Brick<TitleProps> = ({ size = 'h2' }) => {
  const sizeClasses = {
    h1: 'text-4xl md:text-5xl font-bold',
    h2: 'text-3xl md:text-4xl font-semibold',
    h3: 'text-2xl md:text-3xl font-semibold'
  }

  const Tag = size as keyof JSX.IntrinsicElements

  return (
    <Tag className={`${sizeClasses[size]} mb-4 text-foreground`}>
      <Text
        propName="text"
        placeholder="Başlık yazın..."
        renderBlock={(props) => <span {...props.attributes}>{props.children}</span>}
      />
    </Tag>
  )
}

Title.schema = {
  name: 'title',
  label: 'Başlık',
  category: 'Text',
  getDefaultProps: () => ({
    size: 'h2',
  }),
  sideEditProps: [
    {
      name: 'size',
      label: 'Boyut',
      type: types.SideEditPropType.Select,
      selectOptions: {
        display: types.OptionsDisplay.Radio,
        options: [
          { value: 'h1', label: 'Büyük (H1)' },
          { value: 'h2', label: 'Orta (H2)' },
          { value: 'h3', label: 'Küçük (H3)' },
        ],
      },
    },
  ],
}

export default Title

