import { pagesPath } from '../lib/$path'

type PathpidaObject = typeof pagesPath
type PathpidaKey = Exclude<keyof PathpidaObject, '$url'>
export type PathpidaValue = PathpidaObject[PathpidaKey] | Pick<PathpidaObject, '$url'>
