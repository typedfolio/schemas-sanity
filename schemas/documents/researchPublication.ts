import { defineType } from 'sanity'
import { IoNewspaperOutline } from "react-icons/io5";
import {createClient} from '@sanity/client'
import {
  dataset,
  projectId,
} from '../../lib/sanity.api'

const client = createClient({
  projectId: projectId,
  dataset: dataset,
  useCdn: true,
  apiVersion: '2024-01-01',
  // Required: the new 'withKeyArraySelector' option is used here instead of 'true' so that links to array items and portable text are stable even if the array is reordered
  resultSourceMap: 'withKeyArraySelector',
})

export default defineType({
    name: 'researchPublication',
    title: 'Research publication',
    type: 'document',
    icon: IoNewspaperOutline,
    preview: {
      select: {
          title: 'title',
          year: 'year',
          author0person: 'authors.0.personName',
          author1person: 'authors.1.personName',
          author2person: 'authors.2.personName',
          author0organisation: 'authors.0.organisationName',
          publicationType: 'publicationType',
      },
      prepare({ title, year, author0person, author1person, author2person, author0organisation, publicationType }) {
        return {
          title: typeof year !== 'undefined' ? `${title} (${year})` : `${title}`,
          //FIXME: Very convoluted?
          subtitle: publicationType.concat(': ', 
            typeof author0person !== 'undefined' ? 
                author0person.familyName.concat(' ',
                    author0person.givenNames.map(
                      (givenName:string)=>givenName[0].toUpperCase()).join(' '))
                      .concat(
                        typeof author1person !== 'undefined'? 
                        (typeof author2person !== 'undefined'? ' et al.' : 
                          ' and ' + author1person.familyName.concat(' ',
                          author1person.givenNames.map(
                            (givenName:string)=>givenName[0].toUpperCase()).join(' '))) : '')
                : author0organisation),
        }
      }
    },
    fields: [
      {
        name: 'publicationType',
        title: 'Publication type',
        type: 'string',
        description: 'The BibTeX type of publication.',
        options: {
          list: [ // TODO: Make this into K-V map so that values are not compared in the validation using literal strings?
              {title: 'Article in a journal', value: 'article'}, 
              {title: 'Book', value: 'book'},
              {title: 'Booklet', value: 'booklet'},
              {title: 'Conference paper', value: 'conference'},
              {title: 'In book', value: 'inbook'},
              {title: 'In collection', value: 'incollection'},
              {title: 'In proceedings', value: 'inproceedings'},
              {title: 'Manual', value: 'manual'},
              {title: 'Masters thesis', value: 'mastersthesis'},
              {title: 'Miscellaneous', value: 'misc'},
              {title: 'PhD thesis', value: 'phdthesis'},
              {title: 'Proceedings', value: 'proceedings'},
              {title: 'Technical report', value: 'techreport'},
              {title: 'Unpublished', value: 'unpublished'}
            ],
        },
        validation: (Rule) => Rule.required().error('The type of the publication is mandatory.'),
      },
      {
        name: 'citationKey',
        title: 'Citation key',
        type: 'slug',
        description: 'A citation key is a unique identifier for this publication. It is used in the citation of the publication.',
        validation: (Rule) => Rule.required().error('The citation key of the publication is mandatory.'),
        options: {
          source: async (document: {
              year: number,
              title: string,
              authors: {_key: string, _ref: string, _type: string} [],
            }) => {
            if(document.authors.length > 0) {
              //TODO: Expand the reference by fetching, see https://github.com/sanity-io/sanity/issues/1743. API call is not cached, so this is not an optimised solution.
              var authorNames: string[] = []
              var concatenatedAuthorNames: string
              var author0: {_key: string, _ref: string, _type: string} = document.authors[0]
              const fetchAuthor0 = await client.fetch(`*[_id == "${author0._ref}" && _type == "contributionAuthor"]{...}[0]`)
              authorNames.push(fetchAuthor0.personName.familyName)
              concatenatedAuthorNames = authorNames[0]
              if(document.authors.length > 2) {
                concatenatedAuthorNames = concatenatedAuthorNames.concat('-etal')
              }
              else if(document.authors.length == 2) {
                var author1: {_key: string, _ref: string, _type: string} = document.authors[1]
                const fetchAuthor1 = await client.fetch(`*[_id == "${author1._ref}" && _type == "contributionAuthor"]{...}[0]`)
                authorNames.push(fetchAuthor1.personName.familyName)
                concatenatedAuthorNames = concatenatedAuthorNames.concat('-', authorNames[1])
              }
              return `${document.year}-${concatenatedAuthorNames}-${document.title}`
            }
            else {
              return `${document?.year}-${document.title}`
            }
          }
        },
      },
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        description: 'Title of the publication.',
        validation: (Rule) => Rule.required().error('The title of the publication is mandatory.'),
      },
      {
        name: 'authors',
        title: 'List of authors',
        type: 'array',
        description: 'A list of authors of the publication.',
        of: [
          {
            type: 'reference',
            to: [{type: 'contributionAuthor'}],
          }
        ],
        options: {
          sortable: false,
        },
        validation: [
          (Rule) => Rule.custom((fieldValue, context) => {
          if (context.document?.publicationType === 'manual' && typeof fieldValue === 'undefined') {
            return true // ok, no authors for a manual
          }
          else if (context.document?.publicationType === 'proceedings' && typeof fieldValue === 'undefined') {
            return true // ok, no authors for a proceeding
          }
          else if (typeof fieldValue === 'undefined') {
            return 'The list of authors is mandatory.'
          }
          else {
            return true
          }  
        }),
        (Rule) => Rule.unique().error('Duplicates are not allowed.'),
      ],
      },
      {
        name: 'year',
        title: 'Year',
        type: 'number',
        description: 'Year of publication.',
        validation: (Rule) => Rule.custom((fieldValue, context) => {
          if (context.document?.publicationType === 'misc' && typeof fieldValue === 'undefined') {
            return true
          }
          else if (context.document?.publicationType === 'unpublished' && typeof fieldValue === 'undefined') {
            return true
          }
          else if (typeof fieldValue === 'undefined') {
            return 'The year of the publication is mandatory.'
          }
          else {
            return true
          }
        }),
      },
      {
        name: 'school',
        title: 'School',
        type: 'string',
        description: 'The school or university with the degree programme requiring this thesis.',
        hidden: ({ document }) => (document?.publicationType !== 'mastersthesis' &&
                                   document?.publicationType !== 'phdthesis'),
        validation: (Rule) => Rule.custom((fieldValue, context) => {
          if (context.document?.publicationType === 'mastersthesis' && typeof fieldValue === 'undefined') {
            return 'Publisher is mandatory for a publication that is a Masters thesis.'
          }
          if (context.document?.publicationType === 'phdthesis' && typeof fieldValue === 'undefined') {
            return 'Publisher is mandatory for a publication that is a PhD thesis.'
          }
          return true        
        }),
      },
      {
        name: 'type',
        title: 'Type',
        type: 'string',
        description: 'The type of the thesis, e.g., Masters thesis.',
        hidden: ({ document }) => (document?.publicationType !== 'phdthesis' &&
                                   document?.publicationType !== 'mastersthesis'),
      },
      {
        name: 'month',
        title: 'Month',
        type: 'number',
        description: 'Month of publication.',
        hidden: ({ document }) => (document?.publicationType !== 'article' && 
                                   document?.publicationType !== 'booklet' &&
                                   document?.publicationType !== 'conference' &&
                                   document?.publicationType !== 'inbook' &&
                                   document?.publicationType !== 'incollection' &&
                                   document?.publicationType !== 'inproceedings' &&
                                   document?.publicationType !== 'manual' &&
                                   document?.publicationType !== 'mastersthesis' &&
                                   document?.publicationType !== 'phdthesis' &&
                                   document?.publicationType !== 'proceedings' &&
                                   document?.publicationType !== 'techreport' &&
                                   document?.publicationType !== 'unpublished'),
        options: {
          list: [
              {title: 'January', value: 1}, 
              {title: 'February', value: 2},
              {title: 'March', value: 3},
              {title: 'April', value: 4},
              {title: 'May', value: 5},
              {title: 'June', value: 6},
              {title: 'July', value: 7},
              {title: 'August', value: 8},
              {title: 'September', value: 9},
              {title: 'October', value: 10},
              {title: 'November', value: 11},
              {title: 'December', value: 12}
            ],
        },
      },
      {
        name: 'volume',
        title: 'Volume',
        type: 'number',
        description: 'Volume in which this publication appears.',
        hidden: ({ document }) => (document?.publicationType !== 'article' &&
                                   document?.publicationType !== 'booklet' &&
                                   document?.publicationType !== 'conference' &&
                                   document?.publicationType !== 'inbook' &&
                                   document?.publicationType !== 'incollection' &&
                                   document?.publicationType !== 'inproceedings' &&
                                   document?.publicationType !== 'proceedings'),
      },
      {
        name: 'number',
        title: 'Number',
        type: 'number',
        description: 'Volume number in which this publication appears.',
        hidden: ({ document }) => (document?.publicationType !== 'article' &&
                                   document?.publicationType !== 'booklet' &&
                                   document?.publicationType !== 'conference' &&
                                   document?.publicationType !== 'inbook' &&
                                   document?.publicationType !== 'incollection' &&
                                   document?.publicationType !== 'inproceedings' &&
                                   document?.publicationType !== 'proceedings' &&
                                   document?.publicationType !== 'techreport'),
      },
      {
        name: 'pages',
        title: 'Pages',
        type: 'string',
        description: 'The page numbers on which this publication appears.',
        hidden: ({ document }) => (document?.publicationType !== 'article' &&
                                   document?.publicationType !== 'booklet' &&
                                   document?.publicationType !== 'conference' &&
                                   document?.publicationType !== 'inbook' &&
                                   document?.publicationType !== 'incollection' &&
                                   document?.publicationType !== 'inproceedings'),
      },
      {
        name: 'editor',
        title: 'Editor',
        type: 'string',
        description: 'The editor(s) for this publication.',
        hidden: ({ document }) => (document?.publicationType !== 'booklet' &&
                                   document?.publicationType !== 'conference' &&
                                   document?.publicationType !== 'inbook' &&
                                   document?.publicationType !== 'incollection' &&
                                   document?.publicationType !== 'inproceedings' &&
                                   document?.publicationType !== 'proceedings'),
      },
      {
        name: 'edition',
        title: 'Edition',
        type: 'string',
        description: 'The edition for this publication.',
        hidden: ({ document }) => (document?.publicationType !== 'inbook' &&
                                   document?.publicationType !== 'manual'),
      },
      {
        name: 'series',
        title: 'Series',
        type: 'string',
        description: 'The series in which this publication appears.',
        hidden: ({ document }) => (document?.publicationType !== 'booklet' &&
                                   document?.publicationType !== 'conference' &&
                                   document?.publicationType !== 'inbook' && 
                                   document?.publicationType !== 'incollection' &&
                                   document?.publicationType !== 'inproceedings' &&
                                   document?.publicationType !== 'proceedings'),
      },
      {
        name: 'organisation',
        title: 'Organisation',
        type: 'string',
        description: 'The organisation that published or sponsored this work.',
        hidden: ({ document }) => (document?.publicationType !== 'booklet' &&
                                   document?.publicationType !== 'conference' &&
                                   document?.publicationType !== 'inproceedings' &&
                                   document?.publicationType !== 'manual'),
      },
      {
        name: 'institution',
        title: 'Institution',
        type: 'string',
        description: 'The institution that published or sponsored this work.',
        hidden: ({ document }) => (document?.publicationType !== 'techreport'),
        validation: (Rule) => Rule.custom((fieldValue, context) => {
          if (context.document?.publicationType === 'techreport' && typeof fieldValue === 'undefined') {
            return 'Institution is mandatory for a technical report.'
          }
          return true        
        }),
      },
      {
        name: 'journal',
        title: 'Journal',
        type: 'string',
        description: 'Journal in which this article has been published.',
        hidden: ({ document }) => (document?.publicationType !== 'article'),
        validation: (Rule) => Rule.custom((fieldValue, context) => {
          if (context.document?.publicationType === 'article' && typeof fieldValue === 'undefined') {
            return 'Journal is mandatory for a publication that is an article.'
          }
          return true        
        }),
      },
      {
        name: 'publisher',
        title: 'Publisher',
        type: 'string',
        description: 'The publisher of this publication.',
        hidden: ({ document }) => (document?.publicationType !== 'book' &&
                                   document?.publicationType !== 'conference' &&
                                   document?.publicationType !== 'inbook' &&
                                   document?.publicationType !== 'incollection' &&
                                   document?.publicationType !== 'inproceedings' &&
                                   document?.publicationType !== 'proceedings'),
        validation: (Rule) => Rule.custom((fieldValue, context) => {
          if (context.document?.publicationType === 'book' && typeof fieldValue === 'undefined') {
            return 'Publisher is mandatory for a publication that is a book.'
          }
          if (context.document?.publicationType === 'inbook' && typeof fieldValue === 'undefined') {
            return 'Publisher is mandatory for a publication that is in a book.'
          }
          if (context.document?.publicationType === 'incollection' && typeof fieldValue === 'undefined') {
            return 'Publisher is mandatory for a publication that is in a collection.'
          }
          return true        
        }),
      },
      {
        name: 'address',
        title: 'Address',
        type: 'string',
        description: 'Addresser of the publisher of this publication.',
        hidden: ({ document }) => (document?.publicationType !== 'book' &&
                                   document?.publicationType !== 'booklet' &&
                                   document?.publicationType !== 'conference' &&
                                   document?.publicationType !== 'inbook' &&
                                   document?.publicationType !== 'incollection' &&
                                   document?.publicationType !== 'inproceedings' &&
                                   document?.publicationType !== 'manual' &&
                                   document?.publicationType !== 'mastersthesis' &&
                                   document?.publicationType !== 'phdthesis' &&
                                   document?.publicationType !== 'proceedings' &&
                                   document?.publicationType !== 'techreport'),
        validation: (Rule) => Rule.custom((fieldValue, context) => {
          if (context.document?.publicationType === 'book' && typeof fieldValue === 'undefined') {
            return 'Address of the publisher is mandatory for a publication that is a book.'
          }
          if (context.document?.publicationType === 'booklet' && typeof fieldValue === 'undefined') {
            return 'Address of the publisher is mandatory for a publication that is a booklet.'
          }
          return true        
        }),
      },
      {
        name: 'howPublished',
        title: 'How published',
        type: 'string',
        description: 'How has this work been published?',
        hidden: ({ document }) => (document?.publicationType !== 'booklet'),
        validation: (Rule) => Rule.custom((fieldValue, context) => {
          if (context.document?.publicationType === 'booklet' && typeof fieldValue === 'undefined') {
            return 'This field is mandatory for a publication that is a booklet.'
          }
          return true        
        }),
      },
      {
        name: 'bookTitle',
        title: 'Book title',
        type: 'string',
        description: 'Title of the book in which this publication appears.',
        hidden: ({ document }) => (document?.publicationType !== 'conference' &&
                                   document?.publicationType !== 'inbook' &&
                                   document?.publicationType !== 'incollection' &&
                                   document?.publicationType !== 'inproceedings'),
        validation: (Rule) => Rule.custom((fieldValue, context) => {
          if (context.document?.publicationType === 'conference' && typeof fieldValue === 'undefined') {
            return 'This field is mandatory for a publication that is a conference.'
          }
          if (context.document?.publicationType === 'inbook' && typeof fieldValue === 'undefined') {
            return 'This field is mandatory for a publication in a book.'
          }
          if (context.document?.publicationType === 'incollection' && typeof fieldValue === 'undefined') {
            return 'This field is mandatory for a publication in a collection.'
          }
          if (context.document?.publicationType === 'inproceedings' && typeof fieldValue === 'undefined') {
            return 'This field is mandatory for a publication in proceedings.'
          }
          return true        
        }),
      },
      {
        name: 'notes',
        title: 'Notes',
        type: 'text',
        description: 'Notes for this publication.',
        validation: (Rule) => Rule.custom((fieldValue, context) => {
          if (context.document?.publicationType === 'unpublished' && typeof fieldValue === 'undefined') {
            return 'Publisher is mandatory for an unpublished work.'
          }
          return true        
        }),
      },
    ],
  })