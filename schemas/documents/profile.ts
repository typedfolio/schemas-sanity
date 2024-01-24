/* 
    - Implement localisation using https://www.sanity.io/docs/localization.
    - A singleton instance of the profile may need to be created to ensure that only one profile exists: https://www.sanity.io/guides/singleton-document.
*/

import { defineType } from 'sanity'
import { BsPersonVcard } from "react-icons/bs";


export default defineType({
    name: 'profile',
    title: 'Profile',
    type: 'document',
    icon: BsPersonVcard,
    preview: {
      select: {
          name: 'name',
          headline: 'headline',
          media: 'profileImage.imageData.asset', 
          language: 'language'               
      },
      prepare({ name, headline, media, language }) {
        return {
          title: typeof name.givenNames!=='undefined' ? name.familyName?.concat(', ', name.givenNames?.join(' ')) : name.familyName,
          subtitle: typeof language !== 'undefined' ? `[${language}] ${headline}` : `${headline}` ,
          media,
        }
      }
    },
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'personName',
        description: 'Name of the researcher.',
        validation: (Rule) => Rule.required().error('The name of the researcher is mandatory.'),
      },
      {
        name: 'headline',
        type: 'string',
        title: 'A headline',
        description: 'A succinct headline to summarise the profile of the researcher.',
        validation: Rule => [
          Rule.required().error('You need to provide a headline for the researcher profile.'),
        ],
      },
      {
        name: 'summary',
        title: 'Summary',
        description: 'A summary of the researcher profile.',
        type: 'array',
        of: [{ type: 'block'}],
        validation: Rule => [
            Rule.required().error('A summary of the researcher profile is mandatory.'),
        ],
      },
      {
        name: 'experience',
        title: 'Work and voluntary experiences',
        description: 'An optional ordered list of work and voluntary experiences.',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'experience'}]}],
        validation: [
          (Rule) => Rule.min(0),
          (Rule) => Rule.unique().error('Duplicates are not allowed.'),
        ]
      },
      {
        name: 'education',
        title: 'School or university education',
        description: 'An optional ordered list of educational achievements.',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'education'}]}],
        validation: [
          (Rule) => Rule.min(0),
          (Rule) => Rule.unique().error('Duplicates are not allowed.'),
        ]
      },
      {
        name: 'projects',
        title: 'Featured projects',
        description: 'An optional ordered list of featured projects.',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'project'}]}],
        validation: [
          (Rule) => Rule.min(0),
          (Rule) => Rule.max(5).error('Restrict these to only your top 5 projects.'),
          (Rule) => Rule.unique().error('Duplicates are not allowed.'),
        ],
      },
      {
        name: 'skills',
        title: 'Top skills',
        description: 'An optional ordered list of top skills (not natural languages).',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'skill'}]}],
        validation: [
          (Rule) => Rule.min(0),
          (Rule) => Rule.max(5).error('Restrict these to only your top 5 skills.'),
          (Rule) => Rule.unique().error('Duplicates are not allowed.'),
        ]
      },
      {
        name: 'languageSkills',
        title: 'Top natural language skills',
        description: 'An optional ordered list of top natural language skills.',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'languageSkill'}]}],
        validation: [
          (Rule) => Rule.min(0),
          (Rule) => Rule.max(5).error('Restrict these to only your top 5 language skills.'),
          (Rule) => Rule.unique().error('Duplicates are not allowed.'),
        ],
      },
      {
        name: 'profileImage',
        title: 'Profile image',
        type: 'reference',
        to: [{ type: 'picture'}],
        description: 'A profile picture of the researcher.',
        validation: (Rule) => Rule.required().error('The profile picture of the researcher is mandatory.'),
      },
      {
        name: 'socialLinks',
        title: 'Social links',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'socialLink'}]}],
        description: 'Optional social links: a maximum of 16 is supported.',
        validation: [
          (Rule) => Rule.min(0),
          (Rule) => Rule.max(16).error('You have too many social links.'),
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
      {
        // should match 'languageField' plugin configuration setting, if customized
        name: 'language',
        type: 'string',
        readOnly: true,
      }
    ],
  })