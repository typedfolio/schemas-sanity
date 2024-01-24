import { defineType } from "sanity";
import { GiHumanTarget } from "react-icons/gi";

export default defineType({
    name: 'contributionAuthor',
    title: 'Contributing authors',
    type: 'document',
    icon: GiHumanTarget,
    description: 'An author of a publication or a contributor of a project.',
    preview: {
      select: {
          authorType: 'authorType',
          personName: 'personName',
          organisationName: 'organisationName',
          orcid: 'orcid',
          image: 'imageRef.imageData.asset',                
      },
      prepare: ({ authorType, personName, organisationName, orcid, image }) => {
          return {
              title: authorType === 'Person' ? (typeof personName.givenNames!=='undefined' ? `${personName.familyName}, ${personName.givenNames.join(' ')}` : `${personName.familyName}`) : organisationName,
              subtitle: authorType === 'Person' ? typeof orcid!=='undefined' ? `${authorType} (${orcid})` : `${authorType}` : authorType,
              media: image,
          }
      },
    },
    fields: [
      {
        name: 'authorType',
        title: 'Type of author',
        type: 'string',
        description: 'Identify the type of author.',
        options: {
          list: [
              {title: 'Person', value: 'Person'}, 
              {title: 'Organisation', value: 'Organisation'},
            ],
            layout: 'radio',
        },
        validation: (Rule) => Rule.required().error('The type of the author is mandatory.'),
      },
      {
        name: 'personName',
        title: 'Name',
        type: 'personName',
        description: 'Name of the author.',
        hidden: ({ document }) => (document?.authorType !== 'Person'),
        validation: (Rule) => Rule.required().error('Name of the author is mandatory.'),
      },
      {
        name: 'organisationName',
        title: 'Name',
        type: 'string',
        description: 'Name of the organisation.',
        hidden: ({ document }) => (document?.authorType !== 'Organisation'),
        validation: [
            (Rule) => Rule.custom((fieldValue, context) => {
                if (context.document?.authorType === 'Organisation' && typeof fieldValue === 'undefined') {
                    return 'Name of the organisation is mandatory.'
                }
                return true        
                })
        ]
      },  
      {
        name: 'orcid',
        title: 'ORCiD of the author',
        type: 'string',
        description: 'Optional ORCiD of the author.',
        hidden: ({ document }) => (document?.authorType !== 'Person'),
        validation: (Rule) => Rule.custom((fieldValue, context) => {
          if (context.document?.authorType === 'Person') {
            if (typeof fieldValue === 'undefined') {
                return true // allow empty ORCiD
            }
            else {
                const orcidRegex = /^(\d{4}-){3}\d{3}(\d|X)$/gi
                if (orcidRegex.test(typeof fieldValue === 'string' ? fieldValue : '')) { 
                    return true
                }
                else {
                    return 'The ORCiD must be in the form of 0000-0000-0000-0000.'
                }
            }
         }
         return true // does not matter for organisations
        }),
      },
      {
        name: 'webURL',
        title: 'Website URL',
        type: 'url',
        description: 'Optional website of the author.',
        //hidden: ({ document }) => (document?.authorType !== 'Person'),
        validation: (Rule) => Rule.uri({
          scheme: ['http', 'https'],
          allowRelative: false,
          allowCredentials: false,
        }),
      },
      {
        name: 'imageRef',
        title: 'Image',
        type: 'reference',
        to: [{ type: 'picture'}],
        description: 'An optional profile picture of a person or a logo of an organisation.',
      },
    ],
  })