import { defineType } from 'sanity'
import { MdOutlineLanguage } from "react-icons/md";


const levels = [ 
    {title: 'Elementary', value: 1},
    {title: 'Intermediate', value: 2},
    {title: 'Advanced', value: 3},
    {title: 'Professional', value: 4},
    {title: 'Native or bilingual', value: 5},  
]

export default defineType({
    name: 'languageSkill',
    title: 'Language skills',
    type: 'document',
    icon: MdOutlineLanguage,
    preview: {
      select: {
          skill: 'languageSkill',
          reading: 'readingLevel',
          writing: 'writingLevel',
          listening: 'listeningLevel',
          speaking: 'speakingLevel',
          locale: 'locale',               
      },
      prepare({ skill, reading, writing, listening, speaking, locale }) {
        return {
          title: typeof locale !== 'undefined' ? `${skill} (${locale})` : `${skill}`,
          subtitle: `R-${reading} W-${writing} L-${listening} S-${speaking}`,
        }
      }
    },
    fields: [
      {
        name: 'languageSkill',
        title: 'Language',
        type: 'string',
        description: 'Name of the language.',
        validation: (Rule) => Rule.required().error('The name of the language is mandatory.'),
      },
      {
        name: 'locale',
        type: 'string',
        title: 'Locale',
        description: 'Optional dialect or regional information.',
      },
      {
        name: 'readingLevel',
        type: 'number',
        title: 'Reading level',
        description: 'A self-assessed reading level of the language skill.',
        validation: (Rule) => Rule.required().error('The reading level of the language is mandatory.'),
        options: {
            list: levels,
        },
      },
      {
        name: 'writingLevel',
        type: 'number',
        title: 'Writing level',
        description: 'A self-assessed writing level of the language skill.',
        validation: (Rule) => Rule.required().error('The writing level of the language is mandatory.'),
        options: {
            list: levels,
        },
      },
      {
        name: 'listeningLevel',
        type: 'number',
        title: 'Listening level',
        description: 'A self-assessed listening level of the language skill.',
        validation: (Rule) => Rule.required().error('The listening level of the language is mandatory.'),
        options: {
            list: levels,
        },
      },
      {
        name: 'speakingLevel',
        type: 'number',
        title: 'Speaking level',
        description: 'A self-assessed speaking level of the language skill.',
        validation: (Rule) => Rule.required().error('The speaking level of the language is mandatory.'),
        options: {
            list: levels,
        },
      },
    ],
  })