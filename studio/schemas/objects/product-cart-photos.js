import { FiLayers } from 'react-icons/fi'

import customImage from '../../lib/custom-image'

export default {
  title: 'Cart Photos',
  name: 'productCartPhotos',
  type: 'object',
  icon: FiLayers,
  fields: [
    {
      title: 'Wich Variants is this for?',
      name: 'forOption',
      type: 'string',
      options: {
        list: [{ title: 'All', value: '' }],
        fromField: 'options',
        fromSubField: 'values',
        fromFieldData: {
          title: 'name',
          value: 'position'
        }
      }
    },
    customImage({
      title: 'Thumbnail',
      name: 'cartPhoto'
    })
  ],
  preview: {
    select: {
      cartPhoto: 'cartPhoto',
      forOption: 'forOption'
    },
    prepare({ cartPhoto, forOption }) {
      const option = forOption ? forOption.split(':') : null
      return {
        title:
          option && option.length > 1
            ? `${option[0]}: ${option[1]}`
            : 'All Variants',
        media: cartPhoto ? cartPhoto : null
      }
    }
  }
}
