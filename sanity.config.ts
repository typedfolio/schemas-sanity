import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import { VscTypeHierarchy } from "react-icons/vsc";
import {media, mediaAssetSource} from 'sanity-plugin-media'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
import {documentInternationalization} from '@sanity/document-internationalization'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {i18n} from './languages'

// see https://www.sanity.io/docs/api-versioning for how versioning works
import {
  dataset,
  projectId,
} from './lib/sanity.api'

import {schemaTypes} from './schemas'
import { languageFilter } from '@sanity/language-filter';

const internationalizedSchemaTypes = ['profile']

export default defineConfig({
  name: 'typedfolio',
  title: '@typedfolio',
  icon: VscTypeHierarchy,

  projectId,
  dataset,

  plugins: [
    structureTool(),
    visionTool(),
    media(),
    unsplashImageAsset(),
    documentInternationalization({
      // Required configuration
      supportedLanguages: i18n.languages,
      schemaTypes: internationalizedSchemaTypes,
    }),
    internationalizedArray({
      languages: i18n.languages,
      defaultLanguages: [i18n.base],
      fieldTypes: ['string',],
    }),
    languageFilter({
      supportedLanguages: i18n.languages,
      // Select Norwegian (Bokmål) by default
      defaultLanguages: [i18n.base],
      // Only show language filter for document type `page` (schemaType.name)
      documentTypes: internationalizedSchemaTypes,
      filterField: (enclosingType, member, selectedLanguageIds) =>
        !enclosingType.name.startsWith('locale') || selectedLanguageIds.includes(member.name),
    }),
  ],
  form: {
    // Don't use this plugin when selecting files only (but allow all other enabled asset sources)
    file: {
      assetSources: previousAssetSources => {
        return previousAssetSources.filter(assetSource => assetSource !== mediaAssetSource)
      }
    }
  },
  tools: (prev, {currentUser}) => {
    const isAdmin = currentUser?.roles.some((role) => role.name === 'administrator')

    if (isAdmin) {
      return prev
    }

    return prev.filter((tool) => tool.name !== 'vision')
  },
  schema: {
    types: schemaTypes,
  },

})
