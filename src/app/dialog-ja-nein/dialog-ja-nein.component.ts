import { Component } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
@Component({
  selector: 'app-dialog-ja-nein',
  templateUrl: './dialog-ja-nein.component.html',
  styleUrls: ['./dialog-ja-nein.component.css']
})
export class DialogJaNeinComponent {

constructor(public dialogRef: MatDialogRef<DialogJaNeinComponent>){  }
// openDialog(): void {
//   const dialogRef = this.dialog.open(DialogJaNeinComponent)
  
// dialogRef.afterClosed().subscribe(result => {
  
//   if (result){
// console.log("hh")

//   }
//   console.log('The dialog was abgebrochen');
//   console.log(result);
//   dialogRef.close();
// });}
cancel(){
  this.dialogRef.close(false);
}
confirmation(){
  
  
  console.log('The dialog was closed');
  this.dialogRef.close(true);

 }

close(){

}}
