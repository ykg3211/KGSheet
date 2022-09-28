/// <reference types="react" />
export default function useKeepPage(initShouldKeepPage: boolean, onLeave?: Function): [boolean, React.Dispatch<React.SetStateAction<boolean>>];
