import { FiCornerRightDown, FiAlertCircle } from 'react-icons/fi'

export default {
  title: 'Dropdown',
  name: 'navDropdown',
  type: 'object',
  icon: FiCornerRightDown,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'Text to Display'
    },
    {
      title: 'Dropdown Items',
      name: 'dropdownItems',
      type: 'array',
      of: [{ type: 'navPage' }, { type: 'navLink' }]
    },
    {
      name: 'featuredNote',
      type: 'note',
      options: {
        icon: FiAlertCircle,
        headline: 'Gotcha',
        message: `Featured products are only for menus that appear in desktop "mega-navs".`,
        tone: 'caution'
      }
    },
    {
      title: 'Featured Products',
      name: 'featured',
      type: 'array',
      of: [
        {
          title: 'Product',
          type: 'reference',
          to: [{ type: 'product' }]
        }
      ],
      validation: Rule => Rule.unique().max(2)
    }
  ]
}
