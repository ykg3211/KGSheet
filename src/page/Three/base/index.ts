import * as THREE from 'three'
class Three {
  constructor(dom: any) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    dom.appendChild( renderer.domElement );
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    camera.position.z = 5;
  }
}
type Record<K extends keyof any, T> = {
  [P in K]: T;
};

const map: Record<string, Three> = {

}

export default function createThree (dom: any, name = 'default') {
  if(map[name]) {
    return map[name]
  } else {
    const result = new Three(dom);
    map[name] = result;
    return result;
  }
}