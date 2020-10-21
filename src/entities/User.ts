import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

export class User {
    public readonly id: string;

    public name: string;
    public email: string;
    public login: string;
    public password: string;

    constructor (props: Omit<User, 'id'|'comparePassword'>, id?: string) {
      Object.assign(this, props)

      if (!id) {
        this.id = uuidv4()
      }
    }

    public async comparePassword (candidatePassword: string): Promise<boolean> {
      return await bcrypt.compare(candidatePassword, this.password)
    }
}
