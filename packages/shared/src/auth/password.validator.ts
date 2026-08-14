import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

const BCryptMaxBytes = 72;

// bcrypt silently truncates passwords at 72 UTF-8 bytes, so character-based
// length checks can let two distinct passwords collide after hashing.
@ValidatorConstraint({ name: 'maxBcryptBytes', async: false })
export class MaxBcryptBytes implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return typeof value === 'string' && utf8ByteLength(value) <= BCryptMaxBytes;
  }

  defaultMessage(): string {
    return `Password must not exceed ${BCryptMaxBytes} bytes (bcrypt limit)`;
  }
}

function utf8ByteLength(value: string): number {
  let bytes = 0;
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code < 0x80) {
      bytes += 1;
    } else if (code < 0x800) {
      bytes += 2;
    } else if (code >= 0xd800 && code <= 0xdbff && i + 1 < value.length) {
      const next = value.charCodeAt(i + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        bytes += 4;
        i += 1;
      } else {
        bytes += 3;
      }
    } else {
      bytes += 3;
    }
  }
  return bytes;
}
