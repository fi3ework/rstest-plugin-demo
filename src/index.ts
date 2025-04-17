// === dynamic foo ===
const foo = (await import('./foo')).foo
// const foo = (await fooMod('./foo', fooMod)).foo;
// === dynamic foo ===
// import { foo } from './foo';

// const capMod = await import('lodash-es/capitalize.js');
// export const sayHi = () => capMod.default(foo);

export const sayHi = () => foo
