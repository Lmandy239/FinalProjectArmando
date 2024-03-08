import { AuthService } from './../../services/auth.service';
import { User } from './../../models/user';
import { PetService } from './../../services/pet.service';
import { Component, OnInit } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Pet } from '../../models/pet';
import { UserService } from '../../services/user.service';



@Component({
  selector: 'app-mypets',
  standalone: true,
  imports: [HomeComponent, FormsModule, CommonModule],
  templateUrl: './mypets.component.html',
  styleUrl: './mypets.component.css'
})
export class MypetsComponent implements OnInit {

  isEditing: boolean = false;
  newPet: Pet = new Pet();
  selected: Pet | null = null;
  editPet: Pet | null = null;
  pet: Pet[] = [];

  constructor(private petService: PetService, private authService: AuthService) {}


  ngOnInit(): void {
    this.loadPets();
  }

  loadPets() {
    if(this.authService.checkLogin()) {
      this.petService.index().subscribe( {
        next: (petList) => {
          this.pet = petList;
          console.log(this.pet);
        },
        error: (err: any) => {
          console.error('PetListComponent.loadPet: error');
          console.error(err);
        }
      });
    }
}

addInventory() {
  this.petService.create(this.newPet).subscribe(
    (createdPet) => {
      this.pet.push(createdPet);
      this.newPet = new Pet();
      this.loadPets();
    },
    (error) => {
      console.error('Error creating pet:', error);
    }
  );
}

deleteInventory(id: number) {
  this.petService.destroy(id).subscribe(
    () => {
      this.pet = this.pet.filter((pet) => pet.id !== id);
    },
    (error) => {
      console.error('Error deleting pet:', error);
    }
  );
}

updateInventory() {
  if (this.editPet) {
    this.petService.update(this.editPet).subscribe(
      () => {
        this.isEditing = false;
        this.editPet = null;
        this.loadPets();
      },
      (error) => {
        console.error('Error updating pets:', error);
      }
    );
  }
}

displayPets(item: Pet): void {
  this.selected = item;
}

displayTable(): void {
  this.selected = null;
}

setEditPets() {
  this.isEditing = true;
  this.editPet = Object.assign({}, this.selected);
}
}
