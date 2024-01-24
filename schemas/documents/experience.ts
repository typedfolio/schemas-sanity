import { defineType } from 'sanity'
import { MdOutlineHomeWork } from "react-icons/md";

const affiliationTypes = [
  {title: 'Permanent (part-time)', value: 0},
  {title: 'Permanent (full-time)', value: 1},
  {title: 'Self-employed', value: 2},
  {title: 'Freelance', value: 3},
  {title: 'Contract (part-time)', value: 4},
  {title: 'Contract (full-time)', value: 5},
  {title: 'Internship', value: 6},
  {title: 'Apprenticeship', value: 7},
  {title: 'Voluntary (part-time)', value: 8},
  {title: 'Voluntary (full-time)', value: 9},
  {title: 'Honorary', value: 10},
  {title: 'Adjunct', value: 11},
  {title: 'Emeritus', value: 12},
  {title: 'Other', value: -1},
]

const workStyleTypes = [
  {title: 'On-site', value: 0},
  {title: 'Hybrid', value: 1},
  {title: 'Remote', value: 2},
]

export default defineType({
    name: 'experience',
    title: 'Experiences',
    type: 'document',
    icon: MdOutlineHomeWork,
    preview: {
      select: {
          title: 'title',
          name: 'name',
          startDate: 'startDate',
          endDate: 'endDate',              
      },
      prepare({ title, name, startDate, endDate }) {
        return {
          title: name.concat(': ', title),
          subtitle: typeof startDate !== 'undefined' ? (typeof endDate !== 'undefined' ? `${startDate} - ${endDate}` : `${startDate} - `)  : '',
        }
      }
    },
    fields: [
      {
        name: 'title',
        title: 'Title or designation',
        type: 'string',
        validation: (Rule) => Rule.required().error('The title or designation of the experience is mandatory.'),
      },
      {
        name: 'name',
        title: 'Name',
        description: 'The name of the organisation.',
        type: 'string',
        validation: (Rule) => Rule.required().error('The name of the organisation is mandatory.'),
      },
      {
        name: 'location',
        title: 'Location',
        description: 'Optional location of the organisation or office, if relevant.',
        type: 'string',
      },
      {
        name: 'webURL',
        title: 'Website URL',
        type: 'url',
        description: 'Optional website of the organisation or affiliation profile.',
        validation: (Rule) => Rule.uri({
          scheme: ['http', 'https'],
          allowRelative: false,
          allowCredentials: false,
        }),
      },
      {
        name: 'experienceType',
        title: 'Type of experience',
        type: 'number',
        description: 'Optional type of experience.',
        options: {
          list: affiliationTypes,
        },
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
        name: 'workStyle',
        title: 'Style of work',
        type: 'number',
        description: 'Optional style of work.',
        options: {
          list: workStyleTypes,
        },
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
        name: 'relatedProjects',
        title: 'Related projects',
        description: 'Optional list of related projects.',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'project'}]}],
        validation: [
          (Rule) => Rule.min(0),
          (Rule) => Rule.unique().error('Duplicates are not allowed.'),
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