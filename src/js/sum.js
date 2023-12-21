export default function sum(...args) {
  return args.reduce((a, b) => {
    return a + b;
  }, 1);
}
