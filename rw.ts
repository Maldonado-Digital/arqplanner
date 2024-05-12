const args = process.argv.slice(2)
const baseValue = Number(args.at(0))

const bW = 430
const bH = 932

console.log({
  base: baseValue * 0.75,
  sm: baseValue * 0.9,
  md: baseValue,
  lg: baseValue * 1.72,
})
