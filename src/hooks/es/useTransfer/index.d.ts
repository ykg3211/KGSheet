/// <reference types="react" />
export interface ReturnValue<Item> {
    transferProps: {
        dataSource: Item[];
        targetKeys: string[];
        selectedKeys: string[];
        disabled: boolean;
        showSearch: boolean;
        filterOption: any;
        onChange: (nextTargetKeys: string[], direction: string, moveKeys: string[]) => void;
        onSelectChange: (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => void;
    };
    noTargetKeys: string[];
    unSelectedKeys: string[];
    setTargetKeys: React.Dispatch<React.SetStateAction<string[]>>;
    setSelectedKeys: React.Dispatch<React.SetStateAction<string[]>>;
    setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
    setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
    leftAll: () => void;
    rightAll: () => void;
    selectAll: () => void;
    unSelectAll: () => void;
}
export interface TransferItem {
    key: string;
    [name: string]: any;
}
export interface Options {
    defaultTargetKeys?: string[];
    defaultSelectedKeys?: string[];
    defaultDisabled?: boolean;
    deafultShowSearch?: boolean;
    onChange?: (nextTargetKeys: string[], direction: string, moveKeys: string[]) => void;
}
declare const useTransfer: <Item extends TransferItem>(dataSource: Item[], options?: Options) => ReturnValue<Item>;
export default useTransfer;
