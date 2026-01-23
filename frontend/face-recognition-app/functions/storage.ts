
import * as SecureStore from 'expo-secure-store';

class StorageService {
  private static TOKEN_KEY = 'token';
  private static ROLE_KEY = 'role';
  private static USERID_KEY = 'userId';

  static async saveToken(token: string) {
    await SecureStore.setItemAsync(StorageService.TOKEN_KEY, token);
  }

  static async getToken() {
    return await SecureStore.getItemAsync(StorageService.TOKEN_KEY);
  }

  static async removeToken() {
    await SecureStore.deleteItemAsync(StorageService.TOKEN_KEY);
  }

  static async saveRole(role:string){
    await SecureStore.setItemAsync(StorageService.ROLE_KEY,role)
  }

  static async getRole(){
    return await SecureStore.getItemAsync(StorageService.ROLE_KEY)
  }

  static async removeRole() {
    await SecureStore.deleteItemAsync(StorageService.ROLE_KEY);
  }

  static async saveUserId(userId:string){
    await SecureStore.setItemAsync(StorageService.USERID_KEY,userId)
  }

  static async getUserId(){
    return await SecureStore.getItemAsync(StorageService.USERID_KEY)
  }

  static async removeUserId() {
    await SecureStore.deleteItemAsync(StorageService.USERID_KEY);
  }

  static async ClearSession(){
    await Promise.all([
        this.removeRole(),
        this.removeToken(),
        this.removeUserId()
    ])
  }
}

export default StorageService;
