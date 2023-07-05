import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faUserSecret,
  faAngleDown,
  faAngleUp,
} from '@fortawesome/free-solid-svg-icons'

export const registerIcons = () => {
  library.add(faUserSecret)
  library.add(faAngleDown)
  library.add(faAngleUp)
}
