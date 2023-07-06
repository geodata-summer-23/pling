import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faUserSecret,
  faAngleDown,
  faAngleUp,
  faAngleLeft,
  faAngleRight,
  faHouse,
  faMap,
  faEarthAmericas,
  faComment,
  faCircleUser,
  faPlus,
  faEllipsisVertical,
  faXmark,
  faTriangleExclamation,
  faBell,
} from '@fortawesome/free-solid-svg-icons'

export const registerIcons = () => {
  library.add(faUserSecret)
  library.add(faAngleDown)
  library.add(faAngleUp)
  library.add(faAngleLeft)
  library.add(faAngleRight)
  library.add(faHouse)
  library.add(faMap)
  library.add(faEarthAmericas)
  library.add(faComment)
  library.add(faCircleUser)
  library.add(faPlus)
  library.add(faEllipsisVertical)
  library.add(faXmark)
  library.add(faTriangleExclamation)
  library.add(faBell)
}
