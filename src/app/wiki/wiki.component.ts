import { Component, OnInit } from '@angular/core';
import { WikiService, WikiTreeEntry } from 'src/app/services/wiki-service';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
@Component({
  selector: 'app-wiki',
  templateUrl: './wiki.component.html',
  styleUrls: ['./wiki.component.css'],
})
export class WikiComponent implements OnInit {
  treeControl = new NestedTreeControl<WikiTreeEntry>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<WikiTreeEntry>();

  constructor(private wikiService: WikiService) {}
 
  

  ngOnInit(): void {
    this.wikiService.getWikiTreeEntries().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Daten:', err);
      },
    });
  }

  hasChild = (_: number, node: WikiTreeEntry) =>
    !!node.children && node.children.length > 0;
  
  getNodeLevel(node: WikiTreeEntry): number {
    return this.treeControl.getLevel(node);
  }
}