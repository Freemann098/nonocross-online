import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Database, getDatabase, onValue, ref } from "@angular/fire/database";
import { Auth } from '@angular/fire/auth';

interface TreeNode {
  name: string;
  children?: GramNode[];
}

interface GramNode {
  name: string;
}

let TREE_DATA: TreeNode[] = [
  {
    name: 'My Custom Puzzles',
    children: [],
  },
  {
    name: 'Favorites',
    children: []
  },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-saved-gram-tree',
  templateUrl: './saved-gram-tree.component.html',
  styleUrls: ['./saved-gram-tree.component.sass']
})
export class SavedGramTreeComponent implements OnInit {
  private _transformer = (node: TreeNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor( private database: Database, private auth: Auth) {

    database = getDatabase();
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.auth.onAuthStateChanged(
      () => {
        const customDataRef = ref(this.database, "/custom-grams/" + this.auth.currentUser?.uid);
        onValue(customDataRef, (snapshot) => {
          const data = snapshot.val();
          this.handleData(data, 0);
        });
      }
    );
  }

  handleData(data: any, category: number) {
    for (let i = 0; i < (data as string[]).length; i++) {
      TREE_DATA[category].children?.push({name: data[i].name});
      console.log(TREE_DATA);
    }
    this.dataSource.data = TREE_DATA;
  }
}
