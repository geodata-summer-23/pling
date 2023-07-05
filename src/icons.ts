import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faUserSecret,
  faAngleDown,
  faAngleUp,
  faHouse,
  faMap,
  faEarthAmericas,
  faComment,
  faCircleUser,
} from '@fortawesome/free-solid-svg-icons'

export const registerIcons = () => {
  library.add(faUserSecret)
  library.add(faAngleDown)
  library.add(faAngleUp)
  library.add(faHouse)
  library.add(faMap)
  library.add(faEarthAmericas)
  library.add(faComment)
  library.add(faCircleUser)
}
