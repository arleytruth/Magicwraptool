import React from 'react'
import { types, Text, Repeater, Image } from 'react-bricks/rsc'
import { Button } from '@/components/ui/button'

interface HeroSectionProps {
  background?: string
}

const HeroSection: types.Brick<HeroSectionProps> = ({ background = 'bg-muted/30' }) => {
  return (
    <section className={`py-20 ${background}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            <Text
              propName="title"
              placeholder="Hero başlığı..."
              renderBlock={(props) => <span {...props.attributes}>{props.children}</span>}
            />
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            <Text
              propName="subtitle"
              placeholder="Alt başlık..."
              renderBlock={(props) => <span {...props.attributes}>{props.children}</span>}
            />
          </p>
          <div className="flex gap-4 justify-center">
            <Repeater propName="buttons" />
          </div>
        </div>
      </div>
    </section>
  )
}

HeroSection.schema = {
  name: 'hero-section',
  label: 'Hero Bölümü',
  category: 'Hero',
  getDefaultProps: () => ({
    background: 'bg-muted/30',
  }),
  sideEditProps: [
    {
      name: 'background',
      label: 'Arka Plan',
      type: types.SideEditPropType.Select,
      selectOptions: {
        display: types.OptionsDisplay.Select,
        options: [
          { value: 'bg-muted/30', label: 'Açık' },
          { value: 'bg-primary/10', label: 'Primary' },
          { value: 'bg-gradient-to-b from-background via-primary/5 to-background', label: 'Gradient' },
        ],
      },
    },
  ],
  repeaterItems: [
    {
      name: 'buttons',
      itemType: 'button',
      itemLabel: 'Buton',
      max: 3,
    },
  ],
}

export default HeroSection

