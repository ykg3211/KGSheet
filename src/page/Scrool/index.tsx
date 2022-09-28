import React, { useEffect, useReducer, useRef, useState } from 'react'
import InfiniteScroll from '../../components/InfinitScroll'
interface dataList {
  name: string,
  id: string
}
function Scrool() {
  const [list, setList] = useState<dataList[]>([]);
  const time = useRef(new Date());
  const endTime = useRef<Date>();

  useEffect(() => {
    setTimeout(() => {
      setList(new Array(10000000).fill(0).map((item, index) => {
        return {
          id: index + '',
          name: `name_${index}`
        }
      }))

      endTime.current = new Date();
    }, 0);
  }, [])

  return (<div>
    {endTime.current && JSON.stringify(+endTime.current - +time.current)}
    <InfiniteScroll data={list}></InfiniteScroll>
  </div>)
}

export default Scrool
