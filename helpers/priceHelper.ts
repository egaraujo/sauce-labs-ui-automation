export class PriceHelper{

    private static removeDollarSigns(priceList: string[]){
        return priceList.map(p => p.slice(1))
    }

    static formatActualPriceList(priceList: string[]){
        priceList = this.removeDollarSigns(priceList)
        return priceList.toString()
    }

    static sortPricesAscending(priceList: string[]){
        priceList = this.removeDollarSigns(priceList)
        let ascendingPriceList = priceList.map(i => Number(i))
        ascendingPriceList = ascendingPriceList.sort((a,b) => a-b)
        return ascendingPriceList.toString()
    }

    static sortPricesDescending(priceList: string[]){
        priceList = this.removeDollarSigns(priceList)
        let descendingPriceList = priceList.map(i => Number(i))
        descendingPriceList = descendingPriceList.sort((a,b) => b-a)
        return descendingPriceList.toString()
    }
}