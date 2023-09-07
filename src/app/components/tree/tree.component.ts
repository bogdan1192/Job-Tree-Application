import { Component, OnInit } from '@angular/core';
import { TreeService } from 'src/app/services/tree.service';
import { NewStepModel, TaskModel } from 'src/app/shared/taskModel';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tree',
  templateUrl: 'tree.component.html',
  styleUrls: ['tree.component.scss'],
})
export class TreeComponent implements OnInit {
  public tree: TaskModel[] = [];
  public addTaskIndex: number = -1;
  public addStepForm: FormGroup = new FormGroup({
    stepName: new FormControl(''),
    ownerName: new FormControl(''),
  });
  constructor(public treeService: TreeService) {}

  ngOnInit(): void {
    this.treeService.getRootLevel().subscribe((root: TaskModel[][]) => {
      this.tree = Object.values(root).map((item) => {
        let entry = item[0];
        entry.isExpanded = false;
        entry.isHidden = false;
        entry.childrenProvided = false;
        entry.level = 0;
        return entry;
      });
    });
  }

  public expandNode(task: TaskModel): void {
    const taskIndex = this.tree.findIndex((item) => item.id === task.id);
    const level = this.tree[taskIndex].level;
    this.tree[taskIndex].isExpanded = !task.isExpanded;

    if (!task.isExpanded) {
      this.collapseNode(taskIndex, level);
      return;
    }
    if (task.childrenProvided === false) {
      this.getChildren(task, taskIndex);
    } else {
      this.showChildren(taskIndex, level);
    }
  }

  public addStep(id: number): void {
    this.addTaskIndex = id;
    this.addStepForm.patchValue({
      stepName: '',
      ownerName: '',
    });
  }

  public saveStep(task: TaskModel): void {
    const taskIndex = this.tree.findIndex((item) => item.id === task.id);
    let newTask: NewStepModel = {
      ID: -99,
      Owner: this.addStepForm.controls['ownerName'].value,
      HasChildren: false,
      Name: this.addStepForm.controls['stepName'].value,
    };

    this.treeService
      .addChild(task.id, newTask)
      .subscribe(() => {
        this.getChildren(task, taskIndex);
        this.tree[taskIndex].hasChildren = true;
      });
  }

  public cancelStep(): void {
    this.addTaskIndex = -1;
    this.addStepForm.patchValue({
      stepName: '',
      ownerName: '',
    });
  }

  public isInvalid(): boolean {
    return (
      this.addStepForm.controls['stepName'].value.length === 0 ||
      this.addStepForm.controls['ownerName'].value.length === 0
    );
  }

  private collapseNode(index: number, level: number): void {
    for (let i = index + 1; i < this.tree.length; i++) {
      if (this.tree[i].level === level) {
        return;
      }
      this.tree[i].isHidden = true;
    }
    this.tree = [...this.tree];
  }

  private getChildren(task: TaskModel, taskIndex: number): void {
    this.treeService
      .getChildren(task.id)
      .subscribe((children: TaskModel[][]) => {
        let childrenList = Object.values(children)[0].map((child) => {
          let entry = child;
          entry.level = task.level + 1;
          entry.isHidden = !this.tree[taskIndex].isExpanded;
          entry.childrenProvided = false;
          return entry;
        });
        this.tree[taskIndex].childrenProvided = true;
        childrenList.forEach((child, index) => {
          if (this.tree.findIndex((item) => item.id === child.id) >= 0) {
            return;
          }
          this.tree.splice(taskIndex + index + 1, 0, child);
        });

        this.cancelStep();
      });
  }

  private showChildren(index: number, level: number): void {
    for (let i = index + 1; i < this.tree.length; i++) {
      if (this.tree[i].level !== level + 1) {
        return;
      }
      this.tree[i].isExpanded = false;
      this.tree[i].isHidden = false;
    }
  }
}
