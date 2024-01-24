import post from './documents/post'
import profile from './documents/profile'
import researchPublication from './documents/researchPublication'
import personName from './objects/personName'
import skill from './documents/skill'
import languageSkill from './documents/languageSkill'
import education from './documents/education'
import contributionAuthor from './documents/contributionAuthor'
import project from './documents/project'
import picture from './documents/picture'
import experience from './documents/experience'
import socialLink from './documents/socialLink'

export const schemaTypes = [
    //documents
    profile,
    education,
    experience,
    researchPublication,
    skill,
    languageSkill,
    post,
    picture,
    project,
    contributionAuthor,
    socialLink,
    //objects
    personName,
]