import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class HeroService {

  private heroesUrl = 'api/heroes';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  //Get heroes from the server
  getHeroes(): Observable<Hero[]> {    
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  //Error Handling for when Http operation fails but let the app continue
  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> =>{
      //send the error to remote logging infrastructure
      console.error(error); // log to console instead

      //better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      //let the app keep running by returning an empty result
      return of(result as T);
    };
  }

  //Get hero by id. Will 404 if not found
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log('fetched hero id=${id}')),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  //update the hero on the server
  updateHero (hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`update hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  //add new hero to the server
  addHero (hero: Hero): Observable<Hero>{
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`add hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  //Delete the hero from the server
  deleteHero (hero: Hero | number): Observable<Hero>{
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/ ${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_=> this.log(`deleted hero id = ${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  //Get heroes whose name contains search term
  searchHeroes(term: string): Observable<Hero[]>{
    if(!term.trim()){
      //if not the search term, return empty hero array
      return of([]);
    }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  private log(message: string){
    this.messageService.add(`HeroService: ${message}`);
  }
}