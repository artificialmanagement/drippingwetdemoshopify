import React from 'react'
import S from '@sanity/desk-tool/structure-builder'
import sanityClient from 'part:@sanity/base/client'

import EyeIcon from 'part:@sanity/base/eye-icon'
import EditIcon from 'part:@sanity/base/edit-icon'

import { Card, Text } from '@sanity/ui'

import {
  FiAnchor,
  FiHome,
  FiSettings,
  FiGlobe,
  FiAlertOctagon,
  FiMenu,
  FiNavigation,
  FiRepeat,
  FiFile,
  FiShoppingCart,
  FiGift,
  FiCopy,
  FiTag,
  FiCheckSquare
} from 'react-icons/fi'

import SeoPreview from './components/previews/seo/seo-preview'

const remoteURL = 'https://insane.codes'
const localURL = 'http://localhost:3000'
const previewURL =
  window.location.hostname === 'localhost' ? localURL : remoteURL

const hiddenDocTypes = listItem =>
  ![
    'page',
    'product',
    'productVariant',
    'collection',

    'generalSettings',
    'cookieSettings',
    'promoSettings',
    'headerSettings',
    'footerSettings',
    'cartSettings',
    'seoSettings',

    'menu',
    'siteSettings',
    'redirect'
  ].includes(listItem.getId())

// Extract our home page
const currentHomePage = S.listItem()
  .title('Home Page')
  .icon(FiHome)
  .child(async () => {
    const data = await sanityClient.fetch(`
      *[_type == "generalSettings"][0]{
        home->{_id}
      }
    `)

    if (!data?.home)
      return S.component(() => (
        <Card padding={4}>
          <Card padding={[3, 3, 4]} radius={2} shadow={1} tone="critical">
            <Text align="center" size={[2]}>
              The Home Page has not been set. Visit the Settings page to
              activate.
            </Text>
          </Card>
        </Card>
      )).title('Home Page')

    return S.document()
      .id(data.home._id)
      .schemaType('page')
  })

// Extract our shop page
const currentShopPage = S.listItem()
  .title('Shop All Page')
  .icon(FiShoppingCart)
  .child(async () => {
    const data = await sanityClient.fetch(`
    *[_type == "generalSettings"][0]{
      shop->{_id}
    }
  `)

    if (!data?.shop)
      return S.component(() => (
        <Card padding={4}>
          <Card padding={[3, 3, 4]} radius={2} shadow={1} tone="critical">
            <Text align="center" size={[2]}>
              The Shop All Page has not been set. Visit the Settings page to
              activate.
            </Text>
          </Card>
        </Card>
      )).title('Shop All Page')

    return S.document()
      .id(data.shop._id)
      .schemaType('collection')
  })

// Extract our error page
const currentErrorPage = S.listItem()
  .title('Error Page')
  .icon(FiAlertOctagon)
  .child(async () => {
    const data = await sanityClient.fetch(`
      *[_type == "generalSettings"][0]{
        error->{_id}
      }
    `)

    if (!data?.error)
      return S.component(() => (
        <Card padding={4}>
          <Card padding={[3, 3, 4]} radius={2} shadow={1} tone="critical">
            <Text align="center" size={[2]}>
              The Error Page has not been set. Visit the Settings page to
              activate.
            </Text>
          </Card>
        </Card>
      )).title('Error Page')

    return S.document()
      .id(data.error._id)
      .schemaType('page')
  })

export default () =>
  S.list()
    .title('Website')
    .items([
      S.listItem()
        .title('Settings')
        .child(
          S.list()
            .title('Settings')
            .items([
              S.listItem()
                .title('General')
                .child(
                  S.editor()
                    .id('generalSettings')
                    .schemaType('generalSettings')
                    .documentId('generalSettings')
                )
                .icon(FiSettings),
              S.listItem()
                .title('Cookie Consent')
                .child(
                  S.editor()
                    .id('cookieSettings')
                    .schemaType('cookieSettings')
                    .documentId('cookieSettings')
                )
                .icon(FiCheckSquare),
              S.listItem()
                .title('Promo Bar')
                .child(
                  S.editor()
                    .id('promoSettings')
                    .schemaType('promoSettings')
                    .documentId('promoSettings')
                )
                .icon(FiTag),
              S.listItem()
                .title('Header')
                .child(
                  S.editor()
                    .id('headerSettings')
                    .schemaType('headerSettings')
                    .documentId('headerSettings')
                )
                .icon(FiNavigation),
              S.listItem()
                .title('Footer')
                .child(
                  S.editor()
                    .id('footerSettings')
                    .schemaType('footerSettings')
                    .documentId('footerSettings')
                )
                .icon(FiAnchor),
              S.listItem()
                .title('Cart')
                .child(
                  S.editor()
                    .id('cartSettings')
                    .schemaType('cartSettings')
                    .documentId('cartSettings')
                )
                .icon(FiShoppingCart),
              S.listItem()
                .title('Default SEO / Share')
                .child(
                  S.editor()
                    .id('seoSettings')
                    .schemaType('seoSettings')
                    .documentId('seoSettings')
                )
                .icon(FiGlobe),
              S.listItem()
                .title('Menus')
                .child(S.documentTypeList('menu').title('Menus'))
                .icon(FiMenu),
              S.listItem()
                .title('Redirects')
                .child(S.documentTypeList('redirect').title('Redirects'))
                .icon(FiRepeat)
            ])
        )
        .icon(FiSettings),
      S.divider(),
      S.listItem()
        .title('Pages')
        .id('pages')
        .child(
          S.list()
            .title('Pages')
            .items([
              currentHomePage,
              currentShopPage,
              currentErrorPage,
              S.listItem()
                .title('Other Pages')
                .schemaType('page')
                .child(
                  S.documentTypeList('page')
                    .title('Other Pages')
                    .filter(
                      `_type == "page" && !(_id in [
                          *[_type == "generalSettings"][0].home._ref,
                          *[_type == "generalSettings"][0].error._ref,
                        ]) && !(_id in path("drafts.**"))`
                    )
                    .child(documentId =>
                      S.document()
                        .documentId(documentId)
                        .schemaType('page')
                        .views([
                          S.view.form().icon(EditIcon),
                          S.view
                            .component(SeoPreview)
                            .options({ previewURL })
                            .icon(EyeIcon)
                            .title('SEO Preview')
                        ])
                    )
                )
            ])
        )
        .icon(FiFile),
      S.divider(),
      S.listItem()
        .title('Shop')
        .id('shop')
        .child(
          S.list()
            .title('Shop')
            .items([
              S.listItem()
                .title('Products')
                .icon(FiGift)
                .child(
                  S.documentTypeList('product')
                    .title('Products')
                    .child(documentId =>
                      S.document()
                        .documentId(documentId)
                        .schemaType('product')
                        .views([
                          S.view.form().icon(EditIcon),
                          S.view
                            .component(SeoPreview)
                            .options({ previewURL })
                            .icon(EyeIcon)
                            .title('SEO Preview')
                        ])
                    )
                ),
              S.listItem()
                .title('Product Variants')
                .icon(FiCopy)
                .child(
                  S.documentTypeList('product')
                    .title('By Product')
                    .menuItems(S.documentTypeList('product').getMenuItems())
                    .filter('_type == $type')
                    .params({ type: 'product' })
                    .child(productID =>
                      S.documentList()
                        .title('Variants')
                        .menuItems(
                          S.documentTypeList('productVariant').getMenuItems()
                        )
                        .filter('_type == $type && productID == $id')
                        .params({
                          type: 'productVariant',
                          id: Number(productID.replace('product-', ''))
                        })
                        .child(documentId =>
                          S.document()
                            .documentId(documentId)
                            .schemaType('productVariant')
                            .views([
                              S.view.form().icon(EditIcon),
                              S.view
                                .component(SeoPreview)
                                .options({ previewURL })
                                .icon(EyeIcon)
                                .title('SEO Preview')
                            ])
                        )
                    )
                ),
              S.listItem()
                .title('Collections')
                .schemaType('collection')
                .child(
                  S.documentTypeList('collection')
                    .title('Collections')
                    .filter(
                      `_type == "collection" && !(_id in [
                        *[_type == "generalSettings"][0].shop._ref,
                      ]) && !(_id in path("drafts.**"))`
                    )
                    .child(documentId =>
                      S.document()
                        .documentId(documentId)
                        .schemaType('collection')
                        .views([
                          S.view.form().icon(EditIcon),
                          S.view
                            .component(SeoPreview)
                            .options({ previewURL })
                            .icon(EyeIcon)
                            .title('SEO Preview')
                        ])
                    )
                )
            ])
        )
        .icon(FiShoppingCart),
      // This returns an array of all the document types
      // defined in schema.js. We filter out those that we have
      // defined the structure above
      ...S.documentTypeListItems().filter(hiddenDocTypes)
    ])
