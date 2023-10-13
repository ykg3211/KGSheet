import { CellTypeEnum } from '../../interfaces';
import Text from './text';
import Url from './url';
import Image from './image';
import Number from './number';
import { ComponentsMeta } from './type';

const componentsMeta: ComponentsMeta = {
  [CellTypeEnum.text]: Text,
  [CellTypeEnum.number]: Number,
  [CellTypeEnum.url]: Url,
  [CellTypeEnum.image]: Image,
  [CellTypeEnum.richText]: Text,
  [CellTypeEnum.date]: Text,
  [CellTypeEnum.money]: Text,
};

export default componentsMeta;
