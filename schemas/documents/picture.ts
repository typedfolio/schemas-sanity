import { defineType } from 'sanity'
import { AiTwotonePicture } from "react-icons/ai";



export default defineType({
  name: 'picture',
  title: 'Pictures',
  type: 'document',
  icon: AiTwotonePicture,
  preview: {
    select: {
        caption: 'caption',
        attribution: 'attribution',
        media: 'imageData.asset', 
        keywords: 'keywords'               
    },
    prepare({ caption, attribution, media, keywords }) {
      return {
        title: caption,
        subtitle: typeof attribution !== 'undefined' ? `${attribution}` : (typeof keywords !== 'undefined' ? keywords.join(', ') : ''),
        media,
      }
    }
  },
  fields: [
    {
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'A succinct caption of the image.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      description: 'An optional rich text description of the image.',
      type: 'array',
      of: [{ type: 'block'}],
    },
    {
      name: 'imageData',
      title: 'Image',
      type: 'image',
      description: 'The image asset.',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'attribution',
      title: 'Attribution information',
      type: 'string',
      description: 'Optional attribution information about the image.',
    },
    {
      name: 'attributionURL',
      title: 'Attribution URL',
      type: 'url',
      description: 'Optional attribution URL for the image.',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https'],
        allowRelative: false,
        allowCredentials: false,
      }),
    },
    {
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string'}],
      options: {
        layout: 'tags',
      },
      description: 'Optional keywords: a maximum of 32 is supported.',
      validation: [
        (Rule) => Rule.min(0),
        (Rule) => Rule.max(32).error('You have too many keywords.'),
        (Rule) => Rule.unique().error('Duplicates are not allowed.'),
      ]
    },
  ],
})