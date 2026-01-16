export const participants = [
  { id: 1, name: "山田部長", role: "部長", age: 58 },
  { id: 2, name: "鈴木課長", role: "課長", age: 45 },
  { id: 3, name: "田中主任", role: "主任", age: 38 },
  { id: 4, name: "佐藤", role: "新人", age: 25 },
  { id: 5, name: "高橋", role: "一般", age: 30 },
  { id: 6, name: "伊藤", role: "一般", age: 32 },
  { id: 7, name: "渡辺", role: "一般", age: 28 },
  { id: 8, name: "中村", role: "一般", age: 35 },
]

export const constraints = [
  { id: 1, text: "山田部長は上座下座を気にしないのでどこでもOK", default: true },
  { id: 2, text: "高橋と伊藤は隣にしないと拗ねる", default: true },
  { id: 3, text: "中村さんは21時に「終電が...」と言い出すので出口側に", default: true },
  { id: 4, text: "田中主任の声がでかいので部長の真正面は避ける", default: true },
  { id: 5, text: "新人の佐藤は渡辺の近くに（じゃないと孤立する）", default: true },
  { id: 6, text: "鈴木課長は部長の隣でヨイショ係", default: true },
  { id: 7, text: "田中主任と中村は昔カラオケの選曲で揉めたので離す", default: false },
  { id: 8, text: "高橋も声でかいので田中主任と近づけると騒がしさが倍になる", default: false },
]
