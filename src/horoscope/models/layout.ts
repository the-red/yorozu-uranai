// 円の上での、記号の配置

// 隣り合う記号のかたまり。中では、等間隔に並べる
type Cluster = {
  sum: number // 本当の位置の合計
  count: number
}

// 誤差で、ちょうど決めた間隔のものを、近すぎると判定しないようにする
const EPSILON = 1e-9

const normalize = (longitude: number) => ((longitude % 360) + 360) % 360

// 記号が重ならないように、表示する位置を求める
//
// 近すぎる記号をかたまりにして、本当の位置の平均を中心に、等間隔に広げる。
// - 重なっていない記号は、動かない
// - 記号の順番は、入れ替わらない。同じ黄経のものは、渡した順番で並べる
// - 結果は、渡した順番で返す
export const spreadLongitudes = (longitudes: number[], minGap: number): number[] => {
  const { length } = longitudes
  if (length === 0) {
    return []
  }
  // 円に入りきらない数なら、間隔を縮める
  const gap = Math.min(minGap, 360 / length)

  // 黄経0度で円を切り開いて、一列に並べる
  const line = longitudes
    .map((longitude, index) => ({ index, longitude: normalize(longitude) }))
    .sort((a, b) => a.longitude - b.longitude || a.index - b.index)

  const center = ({ sum, count }: Cluster) => sum / count
  const start = (cluster: Cluster) => center(cluster) - ((cluster.count - 1) / 2) * gap
  const end = (cluster: Cluster) => center(cluster) + ((cluster.count - 1) / 2) * gap

  // 最後のかたまりが、手前のかたまりと近すぎる間は、1つにまとめる
  const mergeTail = (clusters: Cluster[]) => {
    while (clusters.length > 1) {
      const [a, b] = clusters.slice(-2)
      if (start(b) - end(a) >= gap - EPSILON) {
        return
      }
      clusters.splice(-2, 2, { sum: a.sum + b.sum, count: a.count + b.count })
    }
  }

  const clusters: Cluster[] = []
  line.forEach(({ longitude }) => {
    clusters.push({ sum: longitude, count: 1 })
    mergeTail(clusters)
  })

  // 黄経0度をまたいで近いものは、先頭のかたまりを、1周ぶん先に置いて、最後のかたまりにまとめる
  let moved = 0 // 先頭から最後に移した記号の数
  while (clusters.length > 1 && start(clusters[0]) + 360 - end(clusters[clusters.length - 1]) < gap - EPSILON) {
    const { sum, count } = clusters.shift() as Cluster
    clusters.push({ sum: sum + 360 * count, count })
    mergeTail(clusters)
    moved += count
  }

  const shown = clusters.flatMap((cluster) =>
    Array.from({ length: cluster.count }, (_, i) => normalize(start(cluster) + i * gap))
  )
  const result: number[] = []
  line.forEach(({ index }, i) => {
    // 移した記号は、並びの最後にある
    result[index] = shown[(i - moved + length) % length]
  })
  return result
}
