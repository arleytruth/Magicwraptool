'use client'

import { useState, useEffect } from 'react'
import Slider from 'react-slick'
import { LayoutProps } from '../../LayoutSideProps'
import Container from '../../shared/components/Container'
import Section from '../../shared/components/Section'
import CarouselStyles from './CarouselStyles'
import { Repeater, types } from 'react-bricks/rsc'

// @ts-ignore
const SliderComponent = !!Slider.default ? Slider.default : Slider

export interface ImageCarouselProps extends LayoutProps {
  slidesToShow: string
  slidesToScroll: string
  adaptAspectRatio: boolean
  autoplay: boolean
  speed: string
  className: string
  gap: string
  images: types.RepeaterItems
}

const ImageCarouselClient: React.FC<ImageCarouselProps> = ({
  backgroundColor,
  borderTop,
  borderBottom,
  paddingTop,
  paddingBottom,
  width,
  slidesToShow,
  slidesToScroll,
  adaptAspectRatio,
  autoplay,
  speed,
  gap,
  images,
}) => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    draggable: true,
    autoplay: !!autoplay,
    autoplaySpeed: speed ? parseInt(speed) * 1000 : 3000,
    touchThreshold: 1000,
    slidesToShow: slidesToShow ? parseInt(slidesToShow) : 1,
    slidesToScroll: slidesToScroll ? parseInt(slidesToScroll) : 1,
    accessibility: true,
  }

  const repeaterElement = Repeater({
    propName: 'images',
    items: images,
    itemProps: {
      adaptAspectRatio,
      slidesToShow: slidesToShow ? parseInt(slidesToShow) : 1,
    },
  })

  const [hasMount, setHasMount] = useState(false)
  useEffect(() => {
    setHasMount(true)
  }, [])

  if (!hasMount) {
    return null
  }

  return (
    <Section
      backgroundColor={backgroundColor}
      borderTop={borderTop}
      borderBottom={borderBottom}
    >
      <Container
        size={width}
        paddingTop={paddingTop}
        paddingBottom={paddingBottom}
      >
        <CarouselStyles />
        <style>{`
       
        .slick-track {
          display:flex;
          gap:${gap};
        }
    `}</style>

        <SliderComponent {...settings}>
          {/*@ts-ignore*/}
          {repeaterElement?.props?.children?.map((child, index) => {
            return (
              <div key={index} className="p-0 overflow-hidden">
                {child}
              </div>
            )
          })}
        </SliderComponent>
      </Container>
    </Section>
  )
}

export default ImageCarouselClient
