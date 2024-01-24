import { defineType } from "sanity"
import { FaSignature } from "react-icons/fa6";



export default defineType({
    name: 'personName',
    title: 'Person name',
    type: 'object',
    icon: FaSignature,
    preview: {
      select: {
          familyName: 'familyName',
          givenNames: 'givenNames',
      },
      prepare: ({ familyName, givenNames}) => {
          return {
              title: typeof givenNames!=='undefined' ? `${familyName}, ${givenNames.join(' ')}` : `${familyName}`
          }
      },
    },
    fields: [
      {
        name: 'familyName',
        title: 'Family name',
        type: 'string',
        description: 'Family name or surname of the person.',
        validation: (Rule) => Rule.required().error('Family name is mandatory for a person.'),
      },  
      {
        name: 'givenNames',
        title: 'Given names',
        type: 'array',
        of: [{ type: 'string'}],
        description: 'An ordered list of given names of the person. A minimum of 1 and a maximum of 16 names are supported.',
        validation: [
          (Rule) => Rule.required().min(1).error('At least one given name is mandatory for a person.'),
          (Rule) => Rule.max(16).error('You have too many names for the person.'),
          (Rule) => Rule.custom((givenNames:string[]) => {
            if (givenNames.length > 0) {
              return givenNames.every((name:string) => {
                return name.length > 0
              }) || 'Given names cannot be empty.'
            }
            return true
          }),
        ]
      },
      {
        name: 'pronunciation',
        title: 'Pronunciation',
        type: 'string',
        description: 'Optional pronunciation of the name such as in international phonetic alphabet.',
      },
      {
        name: 'pronouns',
        title: 'Pronouns',
        type: 'string',
        options: {
            list: [ 
                {title: 'Other', value: 'other'},
                {title: 'They/Them', value: 'they/them'},
                {title: 'She/Her', value: 'she/her'},
                {title: 'He/Him', value: 'he/him'},  
            ],
        },
      },
    ],
  })