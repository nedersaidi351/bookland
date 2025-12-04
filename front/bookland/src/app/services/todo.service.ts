import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo } from '../models/Todo';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { UserAchievement } from '../models/UserAchievement';
import { TodoTemplate } from '../models/TodoTemplate ';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
private apiUrl = 'http://localhost:8088/api/todos';

  constructor(private http: HttpClient) {}

  

  getTodosByGroup(email: string, groupName: string): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiUrl}/user/email/${email}/group/${groupName}`);
  }

  addTodoByEmail(email: string, todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(`${this.apiUrl}/user/email/${email}`, todo);
  }

updateTodo(todo: Todo): Observable<Todo> {
  return this.http.put<Todo>(`${this.apiUrl}/${todo.id}`, todo).pipe(
    catchError(error => {
      console.error('Update error:', error);
      throw error;
    })
  );
}


// Add proper error handling to all methods


getGroupNames(email: string): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/user/email/${email}/groups`).pipe(
    catchError(error => {
      console.error('Error loading group names:', error);
      return of([]); // Return empty array on error
    })
  );
}

  getGroupedTodosByEmail(email: string): Observable<Map<string, Todo[]>> {
    return this.http.get<Map<string, Todo[]>>(`${this.apiUrl}/user/email/${email}`);
  }

  updateCompletionStatus(id: number, completed: boolean, email: string): Observable<Todo> {
    return this.http.patch<Todo>(
      `${this.apiUrl}/${id}/complete?completed=${completed}&email=${email}`,
      {}
    );
  }

  // Disable delete in frontend too
  deleteTodo(id: number): Observable<never> {
    throw new Error('Deleting tasks is not allowed');
  }
   getUserAchievements(email: string): Observable<UserAchievement[]> {
    return this.http.get<UserAchievement[]>(`${this.apiUrl}/user/${email}/achievements`);
  }
  // Add these methods
getDefaultAchievementIcons(): Observable<{[key: string]: string}> {
  return this.http.get<{[key: string]: string}>(`${this.apiUrl}/achievements/default-icons`);
}

getAvailableAchievements(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/achievements`);
}

uploadAchievementIcon(formData: FormData): Observable<string> {
  return this.http.post(`${this.apiUrl}/achievements/upload-icon`, formData, {
    responseType: 'text'
  });
}
  
  addTodoTemplate(template: TodoTemplate): Observable<TodoTemplate> {
    return this.http.post<TodoTemplate>(`${this.apiUrl}/template`, template);
  }

  getTodoTemplates(): Observable<TodoTemplate[]> {
    return this.http.get<TodoTemplate[]>(`${this.apiUrl}/template`);
  }
// todo-template.service.ts
// todo.service.ts
 getTodoById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/template/${id}`).pipe(
      catchError(error => {
        console.error('Detailed error response:', error);
        let errorMsg = 'Error fetching todo';
        if (error.error && typeof error.error === 'string') {
          errorMsg = error.error;
        } else if (error.status === 404) {
          errorMsg = 'Todo not found';
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }

updateTemplate(id: number, updatedTemplate: TodoTemplate): Observable<TodoTemplate> {
  return this.http.put<TodoTemplate>(`${this.apiUrl}/template/${id}`, updatedTemplate);
}
getIncompleteTodosInfo(): Observable<any[]> {
  return this.http.get<any[]>('http://localhost:8088/api/todos/incomplete-info');
}
getCompletedTodosInfo(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/completed-info`);
}
getTodoByTodoId(id: number): Observable<Todo> {
  return this.http.get<Todo>(`${this.apiUrl}/${id}`);
}
 // todo.service.ts
deleteTemplate(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/template/${id}`); 
  // Will produce: http://localhost:8088/api/todos/template/13
}


}
