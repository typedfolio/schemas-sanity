import { defineType } from 'sanity'
import { FaUserGraduate } from "react-icons/fa";


export default defineType({
    name: 'education',
    title: 'Education',
    description: 'School or university education.',
    type: 'document',
    icon: FaUserGraduate,
    preview: {
      select: {
          institution: 'institution',
          degree: 'degree',
          fieldOfStudy: 'fieldOfStudy',
          startDate: 'startDate',
          endDate: 'endDate',               
      },
      prepare({ institution, degree, fieldOfStudy, startDate, endDate }) {
        return {
          title: typeof degree !== 'undefined' ? `${degree} in ${fieldOfStudy}` : `${fieldOfStudy}`,
          subtitle: typeof startDate !== 'undefined' ? (typeof endDate !== 'undefined' ? `${institution}: (${startDate} - ${endDate})` : `${institution}: (${startDate} - )`)  : `${institution}`,
        }
      }
    },
    fields: [
      {
        name: 'institution',
        title: 'Institution',
        type: 'string',
        description: 'Name of the institution that provided this education.',
        validation: (Rule) => Rule.required().error('The name of the institution is mandatory.'),
      },
      {
        name: 'degree',
        title: 'Degree',
        type: 'string',
        description: 'Optional degree marking the completion of this education.',
      },
      {
        name: 'fieldOfStudy',
        title: 'Field of study',
        type: 'string',
        description: 'Optional field of study.',
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
        description: 'Optional end date (or expected).',
      },
      {
        name: 'grade',
        title: 'Grade',
        type: 'string',
        description: 'Optional grade obtained.',
      },
      {
        name: 'summary',
        title: 'Summary',
        description: 'An optional summary of or other information related to this education.',
        type: 'array',
        of: [{ type: 'block'}],
      },
      {
        name: 'extracurricular',
        title: 'Extracurricular activities',
        description: 'An optional description of extracurricular activities.',
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
    ],
  })