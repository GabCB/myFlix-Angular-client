import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';


//Declaring the api url that will provide data for the client app
const apiUrl = 'https://moviewebapp.herokuapp.com/';
@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
 // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }
 // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
    catchError(this.handleError)
    );
  }

// Making the api call for the user login endpoint
public userLogin(userDetails: any): Observable<any> {
  console.log(userDetails);
  return this.http.post(apiUrl + 'login', userDetails).pipe(
    catchError(this.handleError)
  );
}

// Making the api call for the get all movies endpoint
getAllMovies(): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(apiUrl + 'movies', {
    headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// Making the api call for the get one movie endpoint
getOneMovie(title: string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(apiUrl + 'movies/' + title, {
    headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// Making the api call for the get one director endpoint
getOneDirector(directorName: string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(apiUrl + 'movies/director/' + directorName, {
    headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// Making the api call for the get one genre endpoint
getOneGenre(genreName: string): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(apiUrl + 'movies/genre/' + genreName, {
    headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// Making the api call for the get one user endpoint
getOneUser(): Observable<any> {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user;
  // const username = localStorage.getItem('username');
  // const token = localStorage.getItem('token');
  // return this.http.get(apiUrl + 'users/' + username, {
  //   headers: new HttpHeaders(
  //     {
  //       Authorization: 'Bearer ' + token,
  //     })
  // }).pipe(
  //   map(this.extractResponseData),
  //   catchError(this.handleError)
  // );
}

// Making the api call for the get favourite movies for a user endpoint
getFavoriteMovies(): Observable<any> {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  return this.http.get(apiUrl + 'users/' + user.Username, {
    headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
  }).pipe(
    map(this.extractResponseData),
    map((data) => data.FavoriteMovies),
    catchError(this.handleError)
  );
}

// Making the api call for the add a movie to favourite Movies endpoint
addFavoriteMovie(movieId: string): Observable<any> {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  user.FavoriteMovies.push(movieId);
  localStorage.setItem('user', JSON.stringify(user));
  return this.http.post(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {}, {
    headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      }),
    responseType: "text"
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

isFavoriteMovie(movieId: string): boolean {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.FavoriteMovies.indexOf(movieId) >= 0;
}

// Making the api call for the edit user endpoint
editUser(updatedUser: any): Observable<any> {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  return this.http.put(apiUrl + 'users/' + user.Username, updatedUser, {
    headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// Making the api call for the delete user endpoint
deleteUser(): Observable<any> {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  return this.http.delete(apiUrl + 'users/' + user._id, {
    headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })
  }).pipe(
    catchError(this.handleError)
  );
}

// Making the api call for deleting a movie from the favorite movies endpoint
deleteFavoriteMovie(movieId: string): Observable<any> {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const index = user.FavoriteMovies.indexOf(movieId);
  console.log(index);
  if (index > -1) { // only splice array when item is found
    user.FavoriteMovies.splice(index, 1); // 2nd parameter means remove one item only
  }
  localStorage.setItem('user', JSON.stringify(user));
  return this.http.delete(apiUrl + 'users/' + user.Username + '/movies/' + movieId, {
    headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      }),
    responseType: "text"
  }).pipe(
    map(this.extractResponseData),
    catchError(this.handleError)
  );
}

// Non-typed response extraction
private extractResponseData(res: any): any {
  const body = res;
  return body || {};
}

private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
    console.error('Some error occurred:', error.error.message);
    } 
     else if (error.error.errors) {
      return throwError(() => new Error(error.error.errors[0].msg));
    }
    else {
    console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
