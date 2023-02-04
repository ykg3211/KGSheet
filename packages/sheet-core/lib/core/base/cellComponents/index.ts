import { CellTypeEnum } from '../../../interfaces';
import Text from './text';
import Url from './url';

export default {
  [CellTypeEnum.text]: Text,
  [CellTypeEnum.url]: Url,
};
