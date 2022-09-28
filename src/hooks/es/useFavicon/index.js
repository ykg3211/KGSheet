import { useEffect } from 'react'; // available image formats

var formatMap = {
  ico: 'image/x-icon',
  png: 'image/png',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  jpeg: 'image/jpeg'
};

var useFavicon = function useFavicon(url) {
  useEffect(function () {
    if (!url) return; // split url to get the format

    var strings = url.split('.');
    var format = strings[strings.length - 1].toLocaleLowerCase();
    if (!format) return; // find the icon link or create a link element

    var link = document.querySelector("link[rel*='icon']") || document.createElement("link"); // set the link attributes

    link.type = formatMap[format];
    link.href = url;
    link.rel = 'shortcut icon'; // insert into the DOM tree

    document.getElementsByTagName('head')[0].appendChild(link);
  }, [url]); // will not update if newUrl not changed
};

export default useFavicon;