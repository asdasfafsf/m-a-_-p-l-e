import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { uuidv7 } from 'uuidv7';
import { ROLE_MAP } from '../../common/constants/role.constant';
import { Role } from '../../common/types/role.type';
export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true, default: uuidv7() })
  uuid: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, type: String, enum: Object.values(ROLE_MAP) })
  role: Role;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop({ required: true, default: new Date() })
  updatedAt: Date;

  @Prop({ required: false })
  jtl: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
