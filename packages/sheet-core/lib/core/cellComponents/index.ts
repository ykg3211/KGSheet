import { CellTypeEnum } from '../../interfaces';
import Text from './text';
import Url from './url';
import Image from './image';
import { ComponentsMeta } from './type';

const componentsMeta: ComponentsMeta = {
  [CellTypeEnum.text]: Text,
  [CellTypeEnum.number]: Text,
  [CellTypeEnum.url]: Url,
  [CellTypeEnum.image]: Image,
  [CellTypeEnum.richText]: Text,
  [CellTypeEnum.date]: Text,
  [CellTypeEnum.money]: Text,
};

export default componentsMeta;
