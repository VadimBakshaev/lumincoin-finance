export type ChartDataType = {
    labels: string[],
    datasets: Datasets[],
}
type Datasets = {
    label: string,
    backgroundColor: string[],
    data: number[],
}