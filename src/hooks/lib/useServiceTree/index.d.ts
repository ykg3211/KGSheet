export interface Options {
    jwtToken?: string;
}
export interface DataNode {
    id: number;
    name: string;
    is_leaf: boolean;
    is_deleted: boolean;
    owners: string;
    path: string;
    parent_id: number;
    children: Array<DataNode> | undefined;
    [key: string]: any;
}
declare const useServiceTree: (options?: Options) => {
    data: DataNode[];
    loadData: (parentData: DataNode) => Promise<void>;
    checkedProps: {
        checkable: boolean;
        checkedKeys: string[];
        onCheck: (item: string[]) => void;
        utils: import("../useMultiSelect").IMultiSelectReturn<string>;
    };
    selectedProps: {
        selectable: boolean;
        selectedKeys: string[];
        onSelect: (item: string[]) => void;
        utils: import("../useMultiSelect").IMultiSelectReturn<string>;
    };
    expandedProps: {
        expandedKeys: string[];
        onExpand: (item: string[]) => void;
        utils: import("../useMultiSelect").IMultiSelectReturn<string>;
    };
};
export default useServiceTree;
