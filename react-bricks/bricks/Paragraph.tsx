import React from 'react'
import { types, Text } from 'react-bricks/rsc'

const Paragraph: types.Brick = () => {
  return (
    <p className="mb-4 leading-relaxed text-muted-foreground">
      <Text
        propName="text"
        placeholder="Paragraf yazın..."
        renderBlock={(props) => <span {...props.attributes}>{props.children}</span>}
      />
    </p>
  )
}

Paragraph.schema = {
  name: 'paragraph',
  label: 'Paragraf',
  category: 'Text',
  getDefaultProps: () => ({}),
}

export default Paragraph

