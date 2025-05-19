import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EventType } from '../../types/event.type';
import { validate as validateByType } from './event-action.validator';

@ValidatorConstraint({ name: 'eventActionConfigValidator', async: false })
export class EventActionConfigValidator
  implements ValidatorConstraintInterface
{
  validate(config: any, args: ValidationArguments) {
    const obj = args.object as any;
    if (!obj.type) return false;
    try {
      validateByType(obj.type as EventType, config);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage() {
    return 'config가 type에 맞는 형식이 아님';
  }
}
