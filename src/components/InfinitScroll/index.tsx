import React, { useState, useEffect, useRef, RefObject, HtmlHTMLAttributes } from 'react';
import { debounce, Subject, tap, timer } from 'rxjs';
interface dataList {
  name: string,
  id: string
}
interface configTypes {
  itemHeight: number,
  boxHeight: number
}
const baseConfig = {
  itemHeight: 50,
  boxHeight: 500
}
const InfiniteScroll = ({ data }: { data: dataList[] }) => {
  const box = useRef(null);
  const flag = useRef(false);
  const [visibleList, setVisibleList] = useState<dataList[]>([]);
  const [currnetTop, setCurrnetTop] = useState<number>(0);

  const handleVisibleData = (top: number) => {
    setVisibleList(data.slice(top, top + Math.floor(baseConfig.boxHeight / baseConfig.itemHeight) + 10))
  }

  useEffect(() => {
    handleVisibleData(currnetTop);
  }, [data])

  useEffect(() => {
    handleVisibleData(currnetTop);
  }, [currnetTop])


  const rx = new Subject();
  rx.pipe(
    debounce(() => timer(0)),
    tap(() => {
      const top = box.current && (box.current as HTMLElement).scrollTop || 0;
      let startIndex = Math.floor(top / baseConfig.itemHeight) - 5;
      startIndex = startIndex < 0 ? 0 : startIndex;
      setCurrnetTop(startIndex);
    })
  ).subscribe()
  const handleScrool = () => {
    rx.next(1);
  }
  useEffect(() => {
    if (box.current) {
      (box.current as HTMLElement).addEventListener('scroll', handleScrool)
    }
    return () => {
      if (box.current) {
        (box.current as HTMLElement).removeEventListener('scroll', handleScrool)
      }
    }
  }, [box])

  const createItem = (data: dataList) => {
    return <div style={{ height: baseConfig.itemHeight + 'px' }} key={data.id}>{data.name}</div>
  }

  return <div ref={box} style={{ width: '300px', height: baseConfig.boxHeight + 'px', overflow: 'scroll', boxSizing: 'border-box' }}>
    <div style={{ width: '100%', height: data.length * baseConfig.itemHeight + 'px', paddingTop: (currnetTop * baseConfig.itemHeight) + 'px', boxSizing: 'border-box' }}>
      {
        visibleList.map((item, i) => {
          return createItem(item)
        })
      }
    </div>
  </div>;
}
export default InfiniteScroll;