export interface NodeType {
  value: string;
  pNode: NodeType | null;
  cNodes: Record<string, NodeType>
}

class Node implements NodeType {
  public value: string;
  public pNode: NodeType | null;
  public cNodes: Record<string, NodeType>

  constructor(value: string, father: NodeType | null) {
    this.value = value;
    this.pNode = father;
    this.cNodes = {};
  }
}

export default class MutiNodeTree {
  private Head: NodeType;

  constructor() {
    this.Head
  }

  private createNewNode(value: string, father: NodeType) {
    const newNode = new Node(value, father);

  }
}