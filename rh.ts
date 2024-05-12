const argumentsArr = process.argv.slice(2)
const val = Number(argumentsArr.at(0))

console.log({
  base: val * 0.6,
  sm: val * 0.9,
  md: val,
  lg: val * 1.5,
})
