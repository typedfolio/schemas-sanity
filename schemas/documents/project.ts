import { defineType } from 'sanity'
import { GrProjects } from "react-icons/gr";



export default defineType({
    name: 'project',
    title: 'Projects',
    type: 'document',
    icon: GrProjects,
    preview: {
      select: {
          name: 'name',
          startDate: 'startDate',
          endDate: 'endDate',      
          media: 'representativePicture.imageData.asset',         
      },
      prepare({ name, startDate, endDate, media }) {
        return {
          title: name,
          subtitle: typeof startDate !== 'undefined' ? (typeof endDate !== 'undefined' ? `${startDate} - ${endDate}` : `${startDate} - `)  : '',
          media,
        }
      }
    },
    fields: [
      {
        name: 'name',
        title: 'Project name',
        type: 'string',
        validation: (Rule) => Rule.required().error('The name of the project is mandatory.'),
      },
      {
        name: 'slug',
        type: 'slug',
        title: 'Slug',
        description: 'A slug is a unique identifier for this project. It is used in the URL of the project page.',
        options: {
          source: 'name',
          maxLength: 96,
        },
        validation: (Rule) => Rule.required().error('The slug of the project is mandatory.'),
      },
      {
        name: 'webURL',
        title: 'Project URL',
        type: 'url',
        description: 'Optional website of the project.',
        validation: (Rule) => Rule.uri({
          scheme: ['http', 'https'],
          allowRelative: false,
          allowCredentials: false,
        }),
      },
      {
        name: 'startDate',
        title: 'Start date',
        type: 'date',
        description: 'Optional start date.',
      },
      {
        name: 'endDate',
        title: 'End date',
        type: 'date',
        description: 'Optional end date.',
      },
      {
        name: 'description',
        title: 'Description',
        description: 'An optional description of this project.',
        type: 'array',
        of: [{ type: 'block'}],
      },
      {
        name: 'skills',
        title: 'Skills learned or used',
        description: 'An optional ordered list of skills (not natural languages) learned or used.',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'skill'}]}],
        validation: [
          (Rule) => Rule.min(0),
          (Rule) => Rule.unique().error('Duplicates are not allowed.'),
        ]
      },
      {
        name: 'contributors',
        title: 'Contributors',
        description: 'Optional list of contributors excluding yourself.',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'contributionAuthor'}]}],
        validation: [
          (Rule) => Rule.min(0),
          (Rule) => Rule.unique().error('Duplicates are not allowed.'),
        ]
      },
      {
        name: 'representativePicture',
        title: 'Representative picture',
        type: 'reference',
        to: [{ type: 'picture'}],
        description: 'Optional representative picture of the project.',
      },
      {
        name: 'otherPictures',
        title: 'Other pictures',
        type: 'array',
        of: [
          {
            type: 'reference',
            to: [{ type: 'picture'}],
          }
        ],
        description: 'Optional pictures relevant to the project. Up to a maximum of 16 are allowed.',
        validation: [
          (Rule) => Rule.min(0),
          (Rule) => Rule.unique().error('Duplicates are not allowed.'),
          (Rule) => Rule.max(16).error('You have too many pictures.'),
        ]
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