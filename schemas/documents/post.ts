import { defineField, defineType } from 'sanity'
import { PiArticleLight } from "react-icons/pi";


export default defineType({
  name: 'post',
  title: 'Posts',
  type: 'document',
  icon: PiArticleLight,
  preview: {
    select: {
      title: 'title',
      subtitle: 'excerpt',
      media: 'mainImage',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title[0].value,
        subtitle,
        media,
      }
    }
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
        metadata: [
          'exif'
        ]
      },
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
        of: [{ type: 'block'}],
        validation: Rule => [
            Rule.required().error('Body of the post is mandatory.'),
        ],
    }),
  ],
})