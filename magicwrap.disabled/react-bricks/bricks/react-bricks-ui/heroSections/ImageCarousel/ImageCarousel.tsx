import { types, wrapClientComponent } from 'react-bricks/rsc'
import { RegisterComponent } from 'react-bricks/rsc/client'

import {
  containerWidthSideGroup,
  neutralBackgroundSideGroup,
  paddingBordersSideGroup,
  sectionDefaults,
} from '../../LayoutSideProps'
import blockNames from '../../blockNames'
import { photos } from '../../shared/defaultImages'
import ImageCarouselClient, { ImageCarouselProps } from './ImageCarouselClient'

const schema: types.IBlockType<ImageCarouselProps> = {
  name: blockNames.ImageCarousel,
  label: 'Image Carousel',
  category: 'hero sections',
  tags: ['carousel', 'image carousel', 'slider', 'photo slider'],
  repeaterItems: [
    {
      name: 'images',
      itemType: blockNames.ImageCarouselItem,
      itemLabel: 'Image',
      min: 1,
      max: 5,
    },
  ],
  previewImageUrl: `/bricks-preview-images/${blockNames.ImageCarousel}.png`,
  sideEditProps: [
    {
      groupName: 'Carousel',
      defaultOpen: true,
      props: [
        {
          name: 'slidesToShow',
          label: 'Slides to show',
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Select,
            options: [
              { value: 1, label: '1' },
              { value: 2, label: '2' },
              { value: 3, label: '3' },
              { value: 4, label: '4' },
              { value: 5, label: '5' },
            ],
          },
        },
        {
          name: 'slidesToScroll',
          label: 'Slides to scroll',
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Select,
            options: [
              { value: 1, label: '1' },
              { value: 2, label: '2' },
              { value: 3, label: '3' },
              { value: 4, label: '4' },
              { value: 5, label: '5' },
            ],
          },
          validate: (slidesToScroll, props) =>
            !props?.slidesToShow ||
            slidesToScroll <= props?.slidesToShow ||
            'You cannot scroll more slides than you see',
        },
        {
          name: 'adaptAspectRatio',
          label: 'Adapt aspect ratio',
          type: types.SideEditPropType.Boolean,
          helperText:
            'Adapt aspect ratio to the number of slides to show (4:1 for 1 image, 2:1 for 2 images, square for more)',
        },
        {
          name: 'autoplay',
          label: 'Autoplay',
          type: types.SideEditPropType.Boolean,
        },
        {
          name: 'speed',
          label: 'Autoplay wait',
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Select,
            options: [
              { value: 1, label: '1 s' },
              { value: 2, label: '2 s' },
              { value: 3, label: '3 s' },
              { value: 4, label: '4 s' },
              { value: 5, label: '5 s' },
            ],
          },
          show: (props) => !!props.autoplay,
        },
        {
          name: 'gap',
          label: 'Gap',
          show: (props) => props.slidesToShow != '1',
          type: types.SideEditPropType.Select,
          selectOptions: {
            display: types.OptionsDisplay.Select,
            options: [
              { value: '0px', label: 'none' },
              { value: '15px', label: 'small' },
              { value: '30px', label: 'medium' },
              { value: '50px', label: 'large' },
            ],
          },
        },
      ],
    },
    neutralBackgroundSideGroup,
    paddingBordersSideGroup,
    containerWidthSideGroup,
  ],
  getDefaultProps: () => ({
    ...sectionDefaults,
    slidesToShow: '1',
    slidesToScroll: '1',
    adaptAspectRatio: true,
    autoplay: true,
    speed: '3',
    gap: '30px',
    images: [
      {
        image: photos.CAROUSEL_MOUNTAINS_1,
      },
      {
        image: photos.CAROUSEL_MOUNTAINS_2,
      },
    ],
  }),
  stories: [
    {
      id: '4-slides',
      name: '4 slides',
      previewImageUrl: `/bricks-preview-images/4-slides.png`,
      showAsBrick: true,
      props: {
        slidesToShow: '4',
        slidesToScroll: '1',
        adaptAspectRatio: true,
        autoplay: true,
        speed: '3',
        gap: '30px',
        width: 'medium',
        images: [
          {
            image: photos.CAROUSEL_SEA_1,
          },
          {
            image: photos.CAROUSEL_SEA_2,
          },
          {
            image: photos.CAROUSEL_SEA_3,
          },
          {
            image: photos.CAROUSEL_SEA_4,
          },
        ],
      },
    },
  ],
}

export default wrapClientComponent({
  ClientComponent: ImageCarouselClient,
  RegisterComponent,
  schema,
})
