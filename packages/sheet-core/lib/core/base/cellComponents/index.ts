import { CellTypeEnum } from '../../../interfaces';
import Text from './text';
import Url from './url';
import Image from './image';

export default {
  [CellTypeEnum.text]: Text,
  [CellTypeEnum.url]: Url,
  [CellTypeEnum.image]: Image,
};
