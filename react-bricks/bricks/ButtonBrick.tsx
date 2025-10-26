import React from 'react'
import { types, Text } from 'react-bricks/rsc'
import { Button } from '@/components/ui/button'

interface ButtonBrickProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  href?: string
}

const ButtonBrick: types.Brick<ButtonBrickProps> = ({ 
  variant = 'default',
  size = 'default',
  href = '#'
}) => {
  return (
    <div className="mb-4">
      <Button 
        variant={variant}
        size={size}
        asChild
      >
        <a href={href}>
          <Text
            propName="text"
            placeholder="Buton metni..."
            renderBlock={(props) => <span {...props.attributes}>{props.children}</span>}
          />
        </a>
      </Button>
    </div>
  )
}

ButtonBrick.schema = {
  name: 'button',
  label: 'Buton',
  category: 'Interactive',
  getDefaultProps: () => ({
    variant: 'default',
    size: 'default',
    href: '#',
  }),
  sideEditProps: [
    {
      name: 'href',
      label: 'Link',
      type: types.SideEditPropType.Text,
    },
    {
      name: 'variant',
      label: 'Stil',
      type: types.SideEditPropType.Select,
      selectOptions: {
        display: types.OptionsDisplay.Radio,
        options: [
          { value: 'default', label: 'Varsayılan' },
          { value: 'outline', label: 'Çerçeveli' },
          { value: 'ghost', label: 'Transparan' },
        ],
      },
    },
    {
      name: 'size',
      label: 'Boyut',
      type: types.SideEditPropType.Select,
      selectOptions: {
        display: types.OptionsDisplay.Radio,
        options: [
          { value: 'sm', label: 'Küçük' },
          { value: 'default', label: 'Orta' },
          { value: 'lg', label: 'Büyük' },
        ],
      },
    },
  ],
}

export default ButtonBrick

