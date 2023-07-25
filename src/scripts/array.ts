export const arrayEquals = (listA: any[], listB: any[]) => {
  return (
    listA.every((a) => listB.includes(a)) &&
    listB.every((b) => listA.includes(b))
  )
}
